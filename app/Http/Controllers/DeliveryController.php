<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Brand;
use App\Models\User;
use App\Models\Offer;
use App\Models\Order;
use App\Models\Orderitem;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\DeliveryOtp;
use App\Mail\InvoiceMail;

class DeliveryController extends Controller
{
     public function view_delivery_homepage() {
        $pendingOrderCount = Order::where('delivery_status', 'not delivered')->count();

        return Inertia::render('DeliveryPage/DeliveryHomePage', [

            'pendingOrderCount' => $pendingOrderCount,
                        'flash' => session('otp_error'),

        ]);
    }




    public function index(Request $request)
{
    $search = $request->input('search');

    // Query orders with pagination, search filtering, not delivered, and not cancelled
    $orders = Order::query()
        ->where('delivery_status', 'not delivered') // Filter for not delivered orders
        ->where('status', '!=', 'cancelled') // Exclude cancelled orders
        ->when($search, function ($query, $search) {
            $query->where('order_id', 'like', "%{$search}%")
                ->orWhere('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('status', 'like', "%{$search}%")
                ->orWhere('order_type', 'like', "%{$search}%")
                ->orWhere('delivery_status', 'like', "%{$search}%");
        })
        ->orderBy('id', 'desc') // Latest orders first
        ->paginate(20) // Paginate 20 per page
        ->withQueryString(); // Preserve query string for pagination

    return Inertia::render('DeliveryPage/ViewPendingOrder', [
        'orders' => $orders,
        'search' => $search,
        'flash' => [
            'success' => session('success'),
        ],
    ]);
}

public function generateOtp(Request $request, $order_id)
{
    $order = Order::where('order_id', $order_id)->firstOrFail();

    // Generate a random 5-digit OTP
    do {
        $otp = mt_rand(10000, 99999);
    } while (Order::where('delivery_otp', $otp)->exists());

    // Update the order with the new OTP and expires_at
    $order->delivery_otp = $otp;
    $order->expires_at = now()->addMinutes(5); // Set expiration to current time + 5 minutes
    $order->save();

    // Send OTP to customer via email
    Mail::to($order->email)->send(new DeliveryOtp($order));

    return redirect()->route('pending.order')->with('success', 'OTP sent to customer successfully!');
}

   public function verifyOtp(Request $request, $order_id)
{
    $request->validate([
        'otp' => 'required|digits:5',
    ]);

    $order = Order::where('order_id', $order_id)->firstOrFail();

    // Check if OTP has expired
    if ($order->expires_at && now()->greaterThan($order->expires_at)) {
        return back()->withErrors( ['otp' =>'OTP has expired. Please request a new one.']);
    }

    // Check if OTP is valid
    if ($order->delivery_otp != $request->otp) {
         return back()->withErrors(['otp' => 'Invalid OTP.']);
    }

    // Mark the order as completed
    $order->delivery_status = 'delivered';
    $order->status = 'Completed';
    $order->delivery_otp = null; // Clear the OTP
    $order->expires_at = null; // Clear the expiration time
    $order->save();

    // Update product quantities
    foreach ($order->items as $orderItem) {
        $product = $orderItem->product;
        if ($product) {
            $product->quantity -= $orderItem->quantity;
            $product->save();
        }
    }

    $order = Order::where('id', $order->id)->first();
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
    Mail::to($order->email)->send(new InvoiceMail($order, $orderItems));

    return redirect()->route('completed.order')->with('success', 'Order completed successfully!');
}
  public function view_completed_order(Request $request)
{
    $search = $request->input('search');

    // Query orders with pagination, search filtering, and not delivered status
    $orders = Order::query()
        ->where('delivery_status', 'delivered') // Filter for not delivered orders
        ->when($search, function ($query, $search) {
            $query->where('order_id', 'like', "%{$search}%")
                ->orWhere('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('status', 'like', "%{$search}%")
                ->orWhere('order_type', 'like', "%{$search}%")
                ->orWhere('delivery_status', 'like', "%{$search}%");
        })
        ->orderBy('id', 'desc') // Latest orders first
        ->paginate(20) // Paginate 20 per page
        ->withQueryString(); // Preserve query string for pagination

    return Inertia::render('DeliveryPage/ViewCompletedOrder', [
        'orders' => $orders,
        'search' => $search,
        'flash' => [
            'success' => session('success'),
                   'otp_error' => session('otp_error'),

        ],
    ]);
}
}


