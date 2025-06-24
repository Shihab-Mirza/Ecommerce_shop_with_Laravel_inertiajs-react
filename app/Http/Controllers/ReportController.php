<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\Orderitem;
use Barryvdh\DomPDF\Facade\Pdf as PDF;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('AdminDashboard/ViewReports');
    }

    public function generatePDF(Request $request)
    {
        // Validate query parameters
        $validator = Validator::make($request->query(), [
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $fromDate = Carbon::parse($request->query('from_date'))->startOfDay();
        $toDate = Carbon::parse($request->query('to_date'))->endOfDay();

        // Fetch orders within the date range with their items, filtered by status
        $orders = Order::with('items.product')
            ->whereBetween('created_at', [$fromDate, $toDate])
            ->whereIn('status', ['Completed', 'Processing'])
            ->get()
            ->map(function ($order) {
                // Format each item individually without merging
                $order->order_items = $order->items->map(function ($item) {
                    return [
                        'quantity' => $item->quantity,
                        'product_name' => $item->product->name,
                    ];
                });
                return $order;
            });

        $orderCount = $orders->count();
        $totalAmount = $orders->sum('amount');

        // Fetch new products added within the date range
        $products = Product::whereBetween('created_at', [$fromDate, $toDate])
            ->select('name', 'quantity', 'price')
            ->get();
        $newProductCount = $products->count();
        $newProductQuantity = $products->sum('quantity');
        $newProductPrice = $products->sum('price');

        // Fetch new users added within the date range
        $newUsers = User::whereBetween('created_at', [$fromDate, $toDate])
            ->select('name')
            ->get();
        $newUserCount = $newUsers->count();

        // Fetch total products
        $allProducts = Product::select('name', 'quantity', 'price')->get();
        $currentProductCount = $allProducts->count();
        $currentProductQuantity = $allProducts->sum('quantity');
        $currentProductPrice = $allProducts->sum('price');

        // Fetch total users
        $currentUsers = User::select('name')->get();
        $currentUserCount = $currentUsers->count();

        $currentDate = Carbon::now()->toDateString();

        $data = [
            'from_date' => $fromDate->toDateString(),
            'to_date' => $toDate->toDateString(),
            'orders' => $orders,
            'order_count' => $orderCount,
            'total_amount' => $totalAmount,
            'products' => $products,
            'productcount' => $newProductCount,
            'productprice' => $newProductPrice,
            'productquantity' => $newProductQuantity,
            'Newusercount' => $newUserCount,
            'Currentproductcount' => $currentProductCount,
            'Currentproductprice' => $currentProductPrice,
            'Currentproductquantity' => $currentProductQuantity,
            'Currentusercount' => $currentUserCount,
            'CurrentDateTime' => $currentDate,
        ];

        $fileName = 'report_' . $fromDate->toDateString() . '_' . $toDate->toDateString() . '.pdf';
        $pdf = Pdf::loadView('reports', $data);

        return $pdf->stream($fileName);
    }
}
