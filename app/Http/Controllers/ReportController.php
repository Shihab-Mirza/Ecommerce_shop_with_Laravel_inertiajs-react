<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
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

        // Fetch orders within the date range
        $orders = Order::whereBetween('created_at', [$fromDate, $toDate])->get();
        $orderCount = $orders->count();
        $totalAmount = $orders->sum('amount');

        if ($orders->isEmpty()) {
            return redirect()->back()->withErrors(['message' => 'No orders found for the selected date range.']);
        }

        // Fetch new products added within the date range
        $products = Product::whereBetween('created_at', [$fromDate, $toDate])
            ->select('name', 'quantity', 'price')
            ->get();
         $newproductcount = $products ->count('name');
         $newproductquantity = $products ->sum('quantity');
        $newproductprice = $products ->sum('price');
 // Fetch new products added within the date range
        $newuser = User::whereBetween('created_at', [$fromDate, $toDate])
            ->select('name')
            ->get();
        $newusercount = $newuser ->count('name');


   $product = Product::get();
        $currentproductcount = $product->count('name');
         $currentproductquantity = $product->sum('quantity');
         $currentproductprice = $product->sum('price')


         ;
        $currentuser = User::get();
        $currentusercount = $currentuser ->count('name');
        $currentDate = Carbon::now()->toDateString();
        $data = [
            'from_date' => $fromDate->toDateString(),
            'to_date' => $toDate->toDateString(),
            'orders' => $orders,
            'order_count' => $orderCount,
            'total_amount' => $totalAmount,
            'products' => $products,
            'productcount'=>$newproductcount,
            'productprice'=>$newproductprice,
            'productquantity'=> $newproductquantity,
            'Newusercount' =>$newusercount,


            'Currentproductcount'=>$currentproductcount,
            'Currentproductprice'=>$currentproductprice,
            'Currentproductquantity'=> $currentproductquantity,
            'Currentusercount' =>$currentusercount,
             'CurrentDateTime' =>   $currentDate,


        ];

        $fileName = 'orders_report_' . $fromDate->toDateString() . '_' . $toDate->toDateString() . '.pdf';
        $pdf = Pdf::loadView('reports', $data);

        return $pdf->stream($fileName);
    }
}
