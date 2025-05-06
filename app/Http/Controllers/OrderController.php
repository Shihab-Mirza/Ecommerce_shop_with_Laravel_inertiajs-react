<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Orderitem;
class OrderController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        // Query orders with pagination and search filtering
        $orders = Order::query()
            ->when($search, function ($query, $search) {
                $query->where('order_id', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('status', 'like', "%{$search}%");
            })
            ->orderBy('id', 'desc') // Latest orders first
            ->paginate(20) // Paginate 20 per page
            ->withQueryString(); // Preserve query string for pagination

        return Inertia::render('AdminDashboard/ViewOrders', [

            'orders' => $orders,
            'search' => $search,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }
    public function showOrderItems($orderId)
    { $order = Order::findOrFail($orderId); // Ensure the order exists
        $orderItems = Orderitem::where('order_id', $orderId)
            ->with('product')
            ->get();

        return Inertia::render('AdminDashboard/ViewOrderItems', [
            'orderItems' => $orderItems,
            'orderId' => $order->order_id,
        ]);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return redirect()->route('orders.index')->with('success', 'Order deleted successfully');
    }
}
