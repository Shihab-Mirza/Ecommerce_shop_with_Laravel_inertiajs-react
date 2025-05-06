<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Orderitem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Library\SslCommerz\SslCommerzNotification;
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
            abort(404, 'Invalid cart ID or checkout token');
        }

        // Fetch cart items with product details including image and offer information
        $cartItems = $cart->items()
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
                $finalPrice = $product && $product->is_offered_product === 'yes' && $offer
                    ? (float)$offer->offer_price
                    : (float)$product->price;

                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $product ? $product->name : 'Unknown Product',
                    'product_image' => $product->image ? asset('storage/' . $product->image) : null,
                    'quantity' => $item->quantity,
                    'price' => $product ? (float)$product->price : 0.0,
                    'is_offered_product' => $product ? $product->is_offered_product : 'no',
                    'offer_price' => $product && $product->is_offered_product === 'yes' && $offer ? (float)$offer->offer_price : null,
                    'total_price' => $finalPrice * $item->quantity,
                ];
            })->toArray();

        // Calculate total based on the final prices (regular or offer price)
        $total = array_sum(array_column($cartItems, 'total_price'));

        // Debugging: Log the cart items
        \Illuminate\Support\Facades\Log::debug('Cart items for checkout', [
            'cart_id' => $cart_id,
            'checkout_token' => $token,
            'cart_items' => $cartItems,
            'total' => $total,
        ]);

        return Inertia::render('Landing/Checkout', [
            'cartId' => $cart_id,
            'checkoutToken' => $token,
            'cartItems' => $cartItems,
            'total' => $total,
        ]);
    }
    public function index(Request $request)
    {
        # Here you have to receive all the order data to initate the payment.
        # Let's say, your oder transaction informations are saving in a table called "orders"
        # In "orders" table, order unique identity is "transaction_id". "status" field contain status of the transaction, "amount" is the order amount to be paid and "currency" is for storing Site Currency which will be checked with paid currency.
        $cart = Cart::where('id', $request->cart_id)
            ->where('checkout_token', $request->checkout_token)
            ->first();

        if (!$cart) {
            return redirect()->back()->with('error', 'Invalid cart or checkout token');
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

            // Use offer price if product is offered and offer exists
            if ($product->is_offered_product === 'yes' && $offer && $offer->offer_price) {
                return (float)$offer->offer_price * $item->quantity;
            } else {
                return (float)$product->price * $item->quantity;
            }
        });

        // Validate the total amount
        if (abs($totalAmount - $request->amount) > 0.01) {
            return redirect()->back()->with('error', 'Invalid total amount');
        }

        $post_data = array();
        $post_data['total_amount'] = $totalAmount;
        $post_data['currency'] = "BDT"; # Currency remains BDT as per original logic
        $post_data['tran_id'] = uniqid(); # Generate unique transaction ID

        do {
            $order_id = mt_rand(1000, 9999999); # Generate a random number with 4 to 7 digits
            $exists = DB::table('orders')->where('order_id', $order_id)->exists();
        } while ($exists); # Keep generating until a unique order ID is found

        $post_data['order_id'] = $order_id; # Add order ID to post_data

        # CUSTOMER INFORMATION from frontend
        $post_data['cus_name'] = $request->input('customer_name');
        $post_data['cus_email'] = $request->input('customer_email');
        $post_data['cus_add1'] = $request->input('address');
        $post_data['cus_add2'] = $request->input('address2', ''); # Optional, default to empty if not provided
        $post_data['cus_city'] = $request->input('city', ''); # Optional, default to empty if not provided
        $post_data['cus_state'] = $request->input('state', ''); # Optional, default to empty if not provided
        $post_data['cus_postcode'] = $request->input('zip', ''); # Optional, default to empty if not provided
        $post_data['cus_country'] = $request->input('country', ''); # Optional, default to empty if not provided
        $post_data['cus_phone'] = $request->input('customer_mobile');
        $post_data['cus_fax'] = $request->input('fax', ''); #

        # SHIPMENT INFORMATION
        $post_data['ship_name'] = "Store Test";
        $post_data['ship_add1'] = "Dhaka";
        $post_data['ship_add2'] = "Dhaka";
        $post_data['ship_city'] = "Dhaka";
        $post_data['ship_state'] = "Dhaka";
        $post_data['ship_postcode'] = "1000";
        $post_data['ship_phone'] = "";
        $post_data['ship_country'] = "Bangladesh";

        $post_data['shipping_method'] = "NO";
        $post_data['product_name'] = "Computer";
        $post_data['product_category'] = "Goods";
        $post_data['product_profile'] = "physical-goods";

        # OPTIONAL PARAMETERS
        $post_data['value_a'] = "ref001";
        $post_data['value_b'] = "ref002";
        $post_data['value_c'] = "ref003";
        $post_data['value_d'] = "ref004";

        #Before going to initiate the payment order status need to insert or update as Pending.
        $order = Order::updateOrCreate(
            ['transaction_id' => $post_data['tran_id']],
            [
                'order_id' => $post_data['order_id'],
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

        // Insert cart items into order_items with the appropriate prices (regular or offer)
        foreach ($cartItems as $cartItem) {
            $product = $cartItem->product;
            $offer = $product->offer ?? null;

            // Determine the price to use (offer or regular)
            $unitPrice = $product->price;
            if ($product->is_offered_product === 'yes' && $offer && $offer->offer_price) {
                $unitPrice = $offer->offer_price;
            }

            Orderitem::create([
                'order_id' => $order->id,
                'product_id' => $cartItem->product_id,
                'quantity' => $cartItem->quantity,
                'unit_price' => $unitPrice,
                'subtotal' => $unitPrice * $cartItem->quantity,
                'is_offered_product' => $product->is_offered_product,
                'original_price' => $product->price, // Store original price for reference
            ]);
        }

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

        #Check order status in order tabel against the transaction id or order id.
        $order_details = DB::table('orders')
            ->where('transaction_id', $tran_id)
            ->select('transaction_id', 'status', 'currency', 'amount')->first();

        if ($order_details->status == 'Pending') {
            $validation = $sslc->orderValidate($request->all(), $tran_id, $amount, $currency);

            if ($validation) {
                /*
                That means IPN did not work or IPN URL was not set in your merchant panel. Here you need to update order status
                in order table as Processing or Complete.
                Here you can also sent sms or email for successfull transaction to customer
                */
                $update_product = DB::table('orders')
                    ->where('transaction_id', $tran_id)
                    ->update(['status' => 'Processing']);

                echo "<br >Transaction is successfully Completed";
            }
        } else if ($order_details->status == 'Processing' || $order_details->status == 'Complete') {
            /*
             That means through IPN Order status already updated. Now you can just show the customer that transaction is completed. No need to udate database.
             */
            echo "Transaction is successfully Completed";
        } else {
            #That means something wrong happened. You can redirect customer to your product page.
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
