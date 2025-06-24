<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Cart;
use App\Models\User;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Voucher;
use App\Models\Category;
use App\Models\Userpoint;
use App\Models\Userpoint_rule;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmation;
use App\Mail\InvoiceMail;
use App\Models\Orderitem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Library\SslCommerz\SslCommerzNotification;
use Illuminate\Support\Str;

use Inertia\Response;
class SslCommerzPaymentController extends Controller
{

    public function exampleEasyCheckout()
    {
        return view('exampleEasycheckout');
    }

public function exampleHostedCheckout($cart_id, $token)
{
    // Find the cart by cart_id and checkout_token
    $cart = Cart::where('id', $cart_id)
                ->where('checkout_token', $token)
                ->first();

    if (!$cart) {
        return redirect()->route('home')->with('error', 'Cart not found or unauthorized access');
    }

    // Fetch cart items with product details including image, offer, and stock information
    $cartItems = $cart->items()
        ->with(['product' => function ($query) {
            $query->select('id', 'name', 'price', 'image', 'is_offered_product', 'quantity')
                  ->with(['offer' => function ($query) {
                      $query->select('offer_id', 'product_id', 'offer_price');
                  }]);
        }])
        ->get()
        ->map(function ($item) {
            $product = $item->product;
            $offer = $product->offer ?? null;
            $finalPrice = $product && $product->is_offered_product === 'yes' && $offer
                ? (float)$offer->offer_price
                : (float)$product->price;

            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $product ? $product->name : 'Unknown Product',
                'product_image' => $product && $product->image ? asset('storage/' . $product->image) : null,
                'quantity' => $item->quantity,
                'price' => $product ? (float)$product->price : 0.0,
                'is_offered_product' => $product ? $product->is_offered_product : 'no',
                'offer_price' => $product && $product->is_offered_product === 'yes' && $offer ? (float)$offer->offer_price : null,
                'total_price' => $finalPrice * $item->quantity,
                'available_stock' => $product ? (int)$product->quantity : 0,
            ];
        })->toArray();

    // Check for empty cart
    if (empty($cartItems)) {
        return redirect()->route('home')->with('error', 'Cannot proceed to checkout: Your cart is empty.');
    }

    // Check for items with zero quantity
    $zeroQuantityItems = array_filter($cartItems, fn($item) => $item['quantity'] == 0);
    if (!empty($zeroQuantityItems)) {
        $messages = array_map(
            fn($item) => "{$item['product_name']}: Quantity is set to 0.",
            $zeroQuantityItems
        );
        $errorMessage = "Cannot proceed to checkout: Some items have invalid quantities.\n" . implode("\n", $messages);
        return redirect()->route('home')->with('error', $errorMessage);
    }

    // Check for items exceeding available stock
    $outOfStockItems = array_filter($cartItems, fn($item) => $item['quantity'] > $item['available_stock']);
    if (!empty($outOfStockItems)) {
        $messages = array_map(
            fn($item) => "{$item['product_name']}: {$item['quantity']} requested, but only {$item['available_stock']} available.",
            $outOfStockItems
        );
        $errorMessage = "Cannot proceed to checkout:\n" . implode("\n", $messages);
        return redirect()->route('home')->with('error', $errorMessage);
    }

    // Calculate total based on the final prices (regular or offer price)
    $total = array_sum(array_column($cartItems, 'total_price'));

    // Fetch the authenticated user's points
    $userPoints = Auth::check() ? Userpoint::where('user_id', Auth::id())->first()->user_point ?? 0 : 0;

    // Fetch the minimum points required for discount from Userpoint_rule
    $pointRule = Userpoint_rule::first(); // Assuming there's a single rule; adjust if multiple rules exist
    $minimumPointsSpent = $pointRule ? $pointRule->minimum_points_spent : 0;

    return Inertia::render('Landing/Checkout', [
        'cartId' => $cart_id,
        'checkoutToken' => $token,
        'cartItems' => $cartItems,
        'total' => $total,
        'userPoints' => $userPoints,
        'minimumPointsSpent' => $minimumPointsSpent,
        'flash' => session('error'),
    ]);
}

public function order_confirm(Request $request)
{
    // Validate request inputs
    $request->validate([
        'cart_id' => 'required|exists:carts,id',
        'checkout_token' => 'required|string',
        'amount' => 'required|numeric|min:0',
        'customer_name' => 'required|string|max:255',
        'customer_mobile' => 'required|string|max:20',
        'address' => 'required|string|max:500',
        'country' => 'required|string|max:100',
        'city' => 'required|string|max:100',
        'zip' => 'required|string|max:20',
        'voucher_code' => 'nullable|string|max:50',
        'use_points' => 'nullable|numeric|min:0',
        'order_type' => 'required|in:cash on delivery,advance payment', // Added validation for order_type
    ]);

    // Validate cart
    $cart = Cart::where('id', $request->cart_id)
        ->where('checkout_token', $request->checkout_token)
        ->first();

    if (!$cart) {
        return redirect()->route('home')->with('error', 'Cart not found or unauthorized access');
    }

    // Load cart items with product details and offer information
    $cartItems = $cart->items()
        ->with(['product' => function ($query) {
            $query->select('id', 'name', 'price', 'is_offered_product')
                ->with(['offer' => function ($query) {
                    $query->select('offer_id', 'product_id', 'offer_price');
                }]);
        }])
        ->get();

    if ($cartItems->isEmpty()) {
        return redirect()->back()->with('error', 'Cart is empty');
    }

    // Calculate total amount considering offer prices
    $totalAmount = $cartItems->sum(function ($item) {
        $product = $item->product;
        $offer = $product->offer ?? null;

        if ($product->is_offered_product === 'yes' && $offer && $offer->offer_price) {
            return (float)$offer->offer_price * $item->quantity;
        } else {
            return (float)$product->price * $item->quantity;
        }
    });

    // Apply voucher discount if provided
    $voucher = null;
    $voucherDiscount = 0;
    $usedVouchers = null;
    if ($request->apply_voucher && $request->voucher_code) {
        $voucher = Voucher::where('voucher_code', $request->voucher_code)->first();
        if (!$voucher) {
            return redirect()->back()->with('flash', ['error' => "Invalid voucher code"]);
        }
        $voucherDiscount = ($totalAmount * (float)$voucher->voucher_discount) / 100;
        $usedVouchers = $request->voucher_code; // Store voucher code
    }


$pointRule = Userpoint_rule::whereNotNull('minimum_points_spent')
                           ->whereNotNull('discount_taka_for_points')
                           ->first();
$usedPoints = 0;
$pointsDiscount = 0;

if (!$pointRule) {
    return redirect()->back()->with('error', 'Point rules are not configured or invalid.');
}

$minimumPointsSpent = $pointRule->minimum_points_spent;

if ($request->user_points && $request->use_points > 0) {
    $userPoints = Userpoint::where('user_id', Auth::id())->first();

    if (!$userPoints || $userPoints->user_point < $request->use_points) {
        return redirect()->back()->with('error', 'Insufficient points');
    }

    if ($request->use_points < $minimumPointsSpent) {
        return redirect()->back()->with('error', "Minimum {$minimumPointsSpent} points required to use points");
    }

    if ($minimumPointsSpent <= 0) {
        return redirect()->back()->with('error', 'Invalid point rule configuration: minimum points cannot be zero.');
    }

    $usedPoints = $request->use_points;
    // Calculate discount: points * discount_taka_for_points
    $pointsDiscount = ($usedPoints / $minimumPointsSpent) * (float)$pointRule->discount_taka_for_points;

    // Deduct points from user
    $userPoints->user_point -= $usedPoints;
    $userPoints->save();
}
    // Apply discounts to total amount
    $totalAmount = $totalAmount - $voucherDiscount - $pointsDiscount;

    // Ensure total amount is not negative
    if ($totalAmount < 0) {
        $totalAmount = 0;
    }

    // Generate unique order ID
    do {
        $new_order_id = mt_rand(1000, 9999999);
        $exists = Order::where('order_id', $new_order_id)->exists();
    } while ($exists);

    // Generate unique order token
    $order_token = Str::random(40);

    // Prepare post data for payment
    $post_data = [
        'order_id' => $new_order_id,
        'order_token' => $order_token,
        'tran_id' => null, // Generate unique transaction ID if needed
        'total_amount' => $totalAmount,
        'currency' => 'BDT',
        'cus_name' => $request->input('customer_name'),
        'cus_email' => $request->input('customer_email', ''),
        'cus_add1' => $request->input('address'),
        'cus_city' => $request->input('city'),
        'cus_postcode' => $request->input('zip'),
        'cus_country' => $request->input('country'),
        'cus_phone' => $request->input('customer_mobile'),
        'cus_fax' => $request->input('fax', ''),
        'ship_name' => 'Store Test',
        'ship_add1' => 'Dhaka',
        'ship_add2' => 'Dhaka',
        'ship_city' => 'Dhaka',
        'ship_state' => 'Dhaka',
        'ship_postcode' => '1000',
        'ship_phone' => '',
        'ship_country' => 'Bangladesh',
        'shipping_method' => 'NO',
        'product_name' => 'Computer',
        'product_category' => 'Goods',
        'product_profile' => 'physical-goods',
        'value_a' => 'ref001',
        'value_b' => 'ref002',
        'value_c' => 'ref003',
        'value_d' => 'ref004',
    ];

    // Create or update order
    $order = Order::create([
        'order_id' => $post_data['order_id'],
        'name' => $post_data['cus_name'],
        'email' => $post_data['cus_email'],
        'phone' => $post_data['cus_phone'],
        'amount' => $post_data['total_amount'],
        'status' => 'Pending',
        'user_id' => Auth::id(),
        'transaction_id' => $post_data['tran_id'],
        'order_token' => $post_data['order_token'],
        'address' => $post_data['cus_add1'],
        'currency' => $post_data['currency'],
        'country' => $post_data['cus_country'],
        'city' => $post_data['cus_city'],
        'zip' => $post_data['cus_postcode'],
        'used_points' => $usedPoints,
        'used_vouchers' => $usedVouchers,
        'amount_discounted_on_points' => $pointsDiscount,
        'amount_discounted_on_vouchers' => $voucherDiscount,
        'order_type' => $request->order_type,
    ]);

    // Insert cart items into order_items
    foreach ($cartItems as $cartItem) {
        $product = $cartItem->product;
        $offer = $product->offer ?? null;
        $unitPrice = $product->is_offered_product === 'yes' && $offer && $offer->offer_price
            ? $offer->offer_price
            : $product->price;

        Orderitem::create([
            'order_id' => $order->id,
            'product_id' => $cartItem->product_id,
            'quantity' => $cartItem->quantity,
            'unit_price' => $unitPrice,
            'subtotal' => $unitPrice * $cartItem->quantity,
            'is_offered_product' => $product->is_offered_product,
            'original_price' => $product->price,
        ]);
    }

    // Fetch order and items for rendering
    $orderItems = $order->items()
        ->with(['product' => function ($query) {
            $query->select('id', 'name', 'price', 'image', 'is_offered_product')
                ->with(['offer' => function ($query) {
                    $query->select('offer_id', 'product_id', 'offer_price');
                }]);
        }])
        ->get()
        ->map(function ($item) {
            $product = $item->product;
            $offer = $product->offer ?? null;
            $unitPrice = $product && $product->is_offered_product === 'yes' && $offer
                ? (float)$offer->offer_price
                : (float)$product->price;
            $subTotal = $unitPrice * $item->quantity;

            return [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product_name' => $product ? $product->name : 'Unknown Product',
                'quantity' => $item->quantity,
                'price' => $product ? (float)$product->price : 0.0,
                'is_offered_product' => $product ? $product->is_offered_product : 'no',
                'offer_price' => $product && $product->is_offered_product === 'yes' && $offer ? (float)$offer->offer_price : null,
                'unit_price' => $unitPrice,
                'subtotal' => $subTotal,
                'total_price' => $subTotal,
            ];
        })->toArray();

    // Delete cart after order is placed
    $cart->delete();

    Mail::to($order->email)->send(new OrderConfirmation($order , $orderItems));

    return redirect()->route('show_order_confirm', [
        'order_id' => $order->order_id,
        'order_token' => $order->order_token,
        'flash' => [
            'error' => session('error'),
            'success' => session('success'),
        ],
    ]);
}



public function showOrderConfirm($order_id, $order_token)
    {
        // Fetch the order based on order_id and order_token
        $order = Order::where('order_id', $order_id)
            ->where('order_token', $order_token)
            ->where('user_id', Auth::id())
            ->first();

        if (!$order) {
            return redirect()->route('home')->with('error', 'Order not found or unauthorized access');
        }
        $orderid=$order->order_id;

        // Fetch order items
        $orderItems = $order->items()
            ->with(['product' => function ($query) {
                $query->select('id', 'name', 'price', 'image', 'is_offered_product')
                    ->with(['offer' => function ($query) {
                        $query->select('offer_id', 'product_id', 'offer_price');
                    }]);
            }])
            ->get()
            ->map(function ($item) {
                $product = $item->product;
                $offer = $product->offer ?? null;
                $unitPrice = $product && $product->is_offered_product === 'yes' && $offer
                    ? (float)$offer->offer_price
                    : (float)$product->price;
                $subTotal = $unitPrice * $item->quantity;

                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $product ? $product->name : 'Unknown Product',
                    'product_image' => $product->image ? asset('storage/' . $product->image) : null,
                    'quantity' => $item->quantity,
                    'price' => $product ? (float)$product->price : 0.0,
                    'is_offered_product' => $product ? $product->is_offered_product : 'no',
                    'offer_price' => $product && $product->is_offered_product === 'yes' && $offer ? (float)$offer->offer_price : null,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subTotal,
                    'total_price' => $subTotal,
                ];
            })->toArray();
 // Fetch the order based on order_id and order_token

        // Prepare order details for pre-filling the form
        $orderDetails = [
            'order_id' => $order->id,
            'order_token' => $order->order_token,
            'tran_id' => $order->transaction_id,
            'customer_name' => $order->name,
            'customer_email' => $order->email,
            'customer_mobile' => $order->phone,
            'address' => $order->address,
            'city' => $order->city,
            'zip' => $order->zip,
            'country' => $order->country,
            'order_type' =>$order->order_type,
        ];


        return Inertia::render('Landing/OrderConfirm', [
            'order_token' => $order->order_token,
            'total' => $order->amount,
            'orderId' => $order->id,
            'orderid' => $orderid,
            'orderItems' => $orderItems,
            'auth' => Auth::user(),
            'orderDetails' => $orderDetails,
        ]);
    }

    public function index(Request $request, $order_id, $order_token)
    {

        $order = Order::where('id', $order_id)
        ->where('order_token', $order_token)
        ->first();

        $orderItems = $order->items()
        ->with(['product' => function ($query) {
            $query->select('id', 'name', 'price', 'is_offered_product')
                  ->with(['offer' => function ($query) {
                      $query->select('offer_id', 'product_id', 'offer_price');
                  }]);
        }])
        ->get();

    if ($orderItems->isEmpty()) {
        return redirect()->back()->with('error', 'Cart is empty');
    }

    // Calculate total amount considering offer prices
       $totalAmount = $order->amount;
      $post_data['tran_id'] = uniqid(); # Generate unique transaction ID
      DB::table('orders')
      ->where('id', $order_id)
      ->update(['transaction_id' => $post_data['tran_id']]);

      $post_data = [
        'total_amount' => $totalAmount,
        'currency' => $order->currency,
        'tran_id' =>  $post_data['tran_id'],
        'order_id' => $order_id,
        'success_url' => url('/success'),
        'fail_url' => url('/fail'),
        'cancel_url' => url('/cancel'),
        'ipn_url' => url('/ipn'),
        'cus_name' => $order->name,
        'cus_email' => $order->email,
        'cus_add1' => $order->phone,
        'cus_city' => $order->city,
        'cus_postcode' => $order->zip,
        'cus_country' => $order->country,
        'cus_phone' => $order->phone,
        'cus_fax' => $request->input('fax', ''),
        'ship_name' => 'Store Test',
        'ship_add1' => 'Dhaka',
        'ship_add2' => 'Dhaka',
        'ship_city' => 'Dhaka',
        'ship_state' => 'Dhaka',
        'ship_postcode' => '1000',
        'ship_phone' => '',
        'ship_country' => 'Bangladesh',
        'shipping_method' => 'NO',
        'product_name' => 'Computer',
        'product_category' => 'Goods',
        'product_profile' => 'physical-goods',
        'value_a' => 'ref001',
        'value_b' => 'ref002',
        'value_c' => 'ref003',
        'value_d' => 'ref004',
    ];


   $order->update( ['transaction_id' => $post_data['tran_id']],
            [
                'name' => $post_data['cus_name'],
                'email' => $post_data['cus_email'],
                'phone' => $post_data['cus_phone'],
                'amount' => $post_data['total_amount'],
                'status' => 'Pending',
                'address' => $post_data['cus_add1'],
                'transaction_id' => $post_data['tran_id'],
                'currency' => $post_data['currency'],
                'country' => $post_data['cus_country'],
                'city' => $post_data['cus_city'],
                 'zip' => $post_data['cus_postcode'],
            ]
        );
  $sslc = new SslCommerzNotification();
        # initiate(Transaction Data, false: Redirect to SSLCOMMERZ gateway/ true: Show all the Payement gateway here)
        $payment_options = $sslc->makePayment($post_data, 'hosted');

        if (!is_array($payment_options)) {
            print_r($payment_options);
            $payment_options = array();
        }
    }
    public function payViaAjax(Request $request)
    {

        # Here you have to receive all the order data to initate the payment.
        # Lets your oder trnsaction informations are saving in a table called "orders"
        # In orders table order uniq identity is "transaction_id","status" field contain status of the transaction, "amount" is the order amount to be paid and "currency" is for storing Site Currency which will be checked with paid currency.
        $postdata = $request->input('postdata');
        $post_data = array();


        $post_data = [
            'total_amount' => '10', // Minimum amount for SSLCommerz
            'currency' => 'BDT',
            'tran_id' => uniqid(), // Unique transaction ID
          'cus_name' => $postdata['cus_name'],
         'cus_email' => $postdata['cus_email'],
         'cus_add1' => $postdata['cus_addr1'],
         'cus_phone' =>  $postdata['cus_phone'] ,
            'cus_add2' => '',
            'cus_city' => '',
            'cus_state' => 'Dhaka',
            'cus_postcode' => '',
            'cus_country' => 'Bangladesh',
            'cus_fax' => '',
            'ship_name' => 'Store Test',
            'ship_add1' => 'Dhaka',
            'ship_add2' => 'Dhaka',
            'ship_city' => 'Dhaka',
            'ship_state' => 'Dhaka',
            'ship_postcode' => '1000',
            'ship_phone' => '',
            'ship_country' => 'Bangladesh',
            'shipping_method' => 'NO',
            'product_name' => 'Computer',
            'product_category' => 'Goods',
            'product_profile' => 'physical-goods',
            'value_a' => 'ref001',
            'value_b' => 'ref002',
            'value_c' => 'ref003',
            'value_d' => 'ref004',
        ];

        // Update or insert order in the database
        DB::table('orders')->updateOrInsert(
            ['transaction_id' => $post_data['tran_id']],
            [
                'name' => $post_data['cus_name'],
                'email' => $post_data['cus_email'],
                'phone' => $post_data['cus_phone'],
                'amount' => $post_data['total_amount'],
                'status' => 'Pending',
                'address' => $post_data['cus_add1'],
                'transaction_id' => $post_data['tran_id'],
                'currency' => $post_data['currency'],
            ]
        );

        $sslc = new SslCommerzNotification();
        # initiate(Transaction Data , false: Redirect to SSLCOMMERZ gateway/ true: Show all the Payement gateway here )
        $payment_options = $sslc->makePayment($post_data, 'checkout', 'json');

        if (!is_array($payment_options)) {
            print_r($payment_options);
            $payment_options = array();
        }

    }
public function success(Request $request)
    {
        echo "Transaction is Successful";

        $tran_id = $request->input('tran_id');
        $amount = $request->input('amount');
        $currency = $request->input('currency');

        $sslc = new SslCommerzNotification();

        # Check order status in order table against the transaction id or order id.
        $order_details = DB::table('orders')
            ->where('transaction_id', $tran_id)
            ->select('transaction_id', 'status', 'currency', 'amount')->first();

        if ($order_details->status == 'Pending') {
            $validation = $sslc->orderValidate($request->all(), $tran_id, $amount, $currency);

            if ($validation) {
                /*
                That means IPN did not work or IPN URL was not set in your merchant panel. Here you need to update order status
                in order table as Processing or Complete.
                Here you can also sent sms or email for successful transaction to customer
                */
                $update_product = DB::table('orders')
                    ->where('transaction_id', $tran_id)
                    ->update(['status' => 'Processing']);

                $order_data = Order::where('transaction_id', $tran_id)->first();
                $order_amount = $order_data->amount;
                $userid = $order_data->user_id;

                $minimum = Userpoint_rule::whereNotNull('minimum_taka_spent')
                            ->whereNotNull('points_per_minimum_taka')
                            ->first();
                $userPoints = Userpoint::where('user_id', $userid)->first();

                $minimum_taka = $minimum->minimum_taka_spent;
                $minimum_point = $minimum->points_per_minimum_taka;
                $pointsadded = ($order_amount / $minimum_taka) * (float)$minimum_point;
                $userPoints->user_point += $pointsadded;

                $userPoints->save();

        $order = Order::where('id', $order_data->id)
        ->first();          // Fetch order items (assuming OrderItem model exists)
               // Fetch order items
        $orderItems = $order->items()
            ->with(['product' => function ($query) {
                $query->select('id', 'name', 'price', 'image', 'is_offered_product')
                    ->with(['offer' => function ($query) {
                        $query->select('offer_id', 'product_id', 'offer_price');
                    }]);
            }])
            ->get()
            ->map(function ($item) {
                $product = $item->product;
                $offer = $product->offer ?? null;
                $unitPrice = $product && $product->is_offered_product === 'yes' && $offer
                    ? (float)$offer->offer_price
                    : (float)$product->price;
                $subTotal = $unitPrice * $item->quantity;

                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $product ? $product->name : 'Unknown Product',
                    'product_image' => $product->image ? asset('storage/' . $product->image) : null,
                    'quantity' => $item->quantity,
                    'price' => $product ? (float)$product->price : 0.0,
                    'is_offered_product' => $product ? $product->is_offered_product : 'no',
                    'offer_price' => $product && $product->is_offered_product === 'yes' && $offer ? (float)$offer->offer_price : null,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subTotal,
                    'total_price' => $subTotal,
                ];
            })->toArray();

                // Send order confirmation email

                    Mail::to($order->email)->send(new InvoiceMail($order ,$orderItems));


                echo "<br>Transaction is successfully Completed";
            }
        } else if ($order_details->status == 'Processing' || $order_details->status == 'Complete') {
            /*
             That means through IPN Order status already updated. Now you can just show the customer that transaction is completed. No need to update database.
             */
            $order_data = Order::where('transaction_id', $tran_id)->first();
            $order_amount = $order_data->amount;
            $userid = $order_data->user_id;

            $minimum = Userpoint_rule::whereNotNull('minimum_taka_spent')
                        ->whereNotNull('points_per_minimum_taka')
                        ->first();
            $userPoints = Userpoint::where('user_id', $userid)->first();

            $minimum_taka = $minimum->minimum_taka_spent;
            $minimum_point = $minimum->points_per_minimum_taka;
            $pointsadded = ($order_amount / $minimum_taka) * (float)$minimum_point;
            $userPoints->user_point += $pointsadded;

            $userPoints->save();

      $order = Order::where('id', $order_data->id)
        ->first();          // Fetch order items (assuming OrderItem model exists)
               // Fetch order items
        $orderItems = $order->items()
            ->with(['product' => function ($query) {
                $query->select('id', 'name', 'price', 'image', 'is_offered_product')
                    ->with(['offer' => function ($query) {
                        $query->select('offer_id', 'product_id', 'offer_price');
                    }]);
            }])
            ->get()
            ->map(function ($item) {
                $product = $item->product;
                $offer = $product->offer ?? null;
                $unitPrice = $product && $product->is_offered_product === 'yes' && $offer
                    ? (float)$offer->offer_price
                    : (float)$product->price;
                $subTotal = $unitPrice * $item->quantity;

                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $product ? $product->name : 'Unknown Product',
                    'product_image' => $product->image ? asset('storage/' . $product->image) : null,
                    'quantity' => $item->quantity,
                    'price' => $product ? (float)$product->price : 0.0,
                    'is_offered_product' => $product ? $product->is_offered_product : 'no',
                    'offer_price' => $product && $product->is_offered_product === 'yes' && $offer ? (float)$offer->offer_price : null,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subTotal,
                    'total_price' => $subTotal,
                ];
            })->toArray();

                // Send order confirmation email

                    Mail::to($order->email)->send(new InvoiceMail($order_data ,$orderItems));


            echo "Transaction is successfully Completed";
        } else {
            # That means something wrong happened. You can redirect customer to your product page.
            echo "Invalid Transaction";
        }
    }
    public function fail(Request $request)
    {
        $tran_id = $request->input('tran_id');

        $order_details = DB::table('orders')
            ->where('transaction_id', $tran_id)
            ->select('transaction_id', 'status', 'currency', 'amount')->first();

        if ($order_details->status == 'Pending') {
            $update_product = DB::table('orders')
                ->where('transaction_id', $tran_id)
                ->update(['status' => 'Failed']);
            echo "Transaction is Falied";
        } else if ($order_details->status == 'Processing' || $order_details->status == 'Complete') {
            echo "Transaction is already Successful";
        } else {
            echo "Transaction is Invalid";
        }

    }

    public function cancel(Request $request)
    {
        $tran_id = $request->input('tran_id');

        $order_details = DB::table('orders')
            ->where('transaction_id', $tran_id)
            ->select('transaction_id', 'status', 'currency', 'amount')->first();

        if ($order_details->status == 'Pending') {
            $update_product = DB::table('orders')
                ->where('transaction_id', $tran_id)
                ->update(['status' => 'Canceled']);
            echo "Transaction is Cancel";
        } else if ($order_details->status == 'Processing' || $order_details->status == 'Complete') {
            echo "Transaction is already Successful";
        } else {
            echo "Transaction is Invalid";
        }


    }

    public function ipn(Request $request)
    {
        #Received all the payement information from the gateway
        if ($request->input('tran_id')) #Check transation id is posted or not.
        {

            $tran_id = $request->input('tran_id');

            #Check order status in order tabel against the transaction id or order id.
            $order_details = DB::table('orders')
                ->where('transaction_id', $tran_id)
                ->select('transaction_id', 'status', 'currency', 'amount')->first();

            if ($order_details->status == 'Pending') {
                $sslc = new SslCommerzNotification();
                $validation = $sslc->orderValidate($request->all(), $tran_id, $order_details->amount, $order_details->currency);
                if ($validation == TRUE) {
                    /*
                    That means IPN worked. Here you need to update order status
                    in order table as Processing or Complete.
                    Here you can also sent sms or email for successful transaction to customer
                    */
                    $update_product = DB::table('orders')
                        ->where('transaction_id', $tran_id)
                        ->update(['status' => 'Processing']);

                    echo "Transaction is successfully Completed";
                }
            } else if ($order_details->status == 'Processing' || $order_details->status == 'Complete') {

                #That means Order status already updated. No need to udate database.

                echo "Transaction is already successfully Completed";
            } else {
                #That means something wrong happened. You can redirect customer to your product page.

                echo "Invalid Transaction";
            }
        } else {
            echo "Invalid Data";
        }
    }

}
