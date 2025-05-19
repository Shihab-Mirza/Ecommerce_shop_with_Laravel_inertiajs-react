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
class DeliveryController extends Controller
{
     public function view_delivery_homepage() {
        $pendingOrderCount = Order::where('delivery_status', 'not delivered')->count();

        return Inertia::render('DeliveryPage/DeliveryHomePage', [

            'pendingOrderCount' => $pendingOrderCount,
        ]);
    }




     public function index(Request $request)
{
    $search = $request->input('search');

    // Query orders with pagination, search filtering, and not delivered status
    $orders = Order::query()
        ->where('delivery_status', 'not delivered') // Filter for not delivered orders
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

        // Update the order with the new OTP
        $order->delivery_otp = $otp;
        $order->save();
        Mail::to($order->email)->send(new DeliveryOtp($order));

        // Optionally, send the OTP to the customer (e.g., via email or SMS)
        // Example: Mail::to($order->email)->send(new OtpMail($otp));

        return redirect()->route('pending.order')->with('success', 'OTP sent to customer successfully!');
    }

       public function verifyOtp(Request $request, $order_id)
    {
        $request->validate([
            'otp' => 'required|digits:5',
        ]);

        $order = Order::where('order_id', $order_id)->firstOrFail();

        if ($order->delivery_otp != $request->otp) {
            return redirect()->route('pending.order')->withErrors(['otp' => 'Invalid OTP.']);
        }

        // Mark the order as completed
        $order->delivery_status = 'delivered';
        $order->status ='Completed';
        $order->delivery_otp = null; // Clear the OTP
        $order->save();

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
        ],
    ]);
}
}


