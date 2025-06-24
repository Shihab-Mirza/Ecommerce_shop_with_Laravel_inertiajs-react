<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Orderitem;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderCancel;
use Barryvdh\DomPDF\Facade\Pdf;
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

   public function cancel($id)
    {
        $order = Order::findOrFail($id);
        $order->status = 'cancelled';
        $order->save();
      Mail::to($order->email)->send(new OrderCancel($order));

        return back()->with('success', 'Order cancelled successfully');
    }





public function generateInvoice(Order $order)
    {
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

        // Load the Blade view and pass data
        $data = [
            'order' => $order,
            'orderItems' => $orderItems,
        ];

        // Generate PDF
        $pdf = Pdf::loadView('OrderInvoice', $data);

        // Stream the PDF to the browser
        return $pdf->stream('invoice-'. now()->format('Y-m-d').$order->order_id.'.pdf');
    }



}
