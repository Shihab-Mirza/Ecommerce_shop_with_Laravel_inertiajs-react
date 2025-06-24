<?php

namespace App\Http\Controllers;

use App\Models\Homepage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Brand;
use App\Models\User;
use App\Models\Offer;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
   public function view_admin_dashboard()
    {
      $endDate = Carbon::now();
        $startDate = Carbon::now()->subMonths(11)->startOfMonth();

        // Query for order count and revenue for processing orders for the last 12 months
        $monthlyData = Order::select(
            DB::raw("DATE_FORMAT(created_at, '%b %Y') as month_year"),
            DB::raw("COUNT(CASE WHEN status = 'Processing' THEN 1 END) as order_count"),
            DB::raw("SUM(CASE WHEN status = 'Processing' THEN amount ELSE 0 END) as revenue")
        )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy(DB::raw("DATE_FORMAT(created_at, '%b %Y')"))
            ->orderBy('created_at', 'asc')
            ->get()
            ->keyBy('month_year');

        // Initialize arrays for chart data (ensure all 12 months are included, even with zero data)
        $labels = [];
        $orderCounts = [];
        $revenues = [];

        // Generate labels for the last 12 months
        $current = $startDate->copy();
        while ($current <= $endDate) {
            $monthYear = $current->format('M Y');
            $labels[] = $monthYear;
            $orderCounts[] = isset($monthlyData[$monthYear]) ? $monthlyData[$monthYear]->order_count : 0;
            $revenues[] = isset($monthlyData[$monthYear]) ? $monthlyData[$monthYear]->revenue : 0;
            $current->addMonth();
        }

        // Fetch existing counts
        $userCount = User::where('usertype', 'user')->count();
        $brandCount = Brand::count();
        $orderCount = Order::whereIn('status', ['processing', 'completed'])->count();
        $pendingOrderCount = Order::where('status', 'pending')->count();
        $productCount = Product::count();
        $totalSales = Order::whereIn('status', ['processing', 'completed'])->sum('amount');

        return Inertia::render('AdminDashboard/Dashboard', [
            'activeLink' => 'dashboard',
            'userCount' => $userCount,
            'brandCount' => $brandCount,
            'orderCount' => $orderCount,
            'pendingOrderCount' => $pendingOrderCount,
            'productCount' => $productCount,
            'totalSales' => $totalSales,
            'chartData' => [
                'labels' => $labels,
                'orderCounts' => $orderCounts,
                'revenues' => $revenues,
            ],
        ]);
    }

    public function index()
    {
        $images = Homepage::all();
        return Inertia::render('AdminDashboard/AddImageSlideshow', [
            'images' => $images,
            'flash' => session('flash'),
        ]);
    }

    public function storehomepageimage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $imageCount = Homepage::count();
        if ($imageCount >= 6) {
            return back()->withErrors(['image' => 'Maximum 6 images can be added.']);
        }

        // Generate filename with datetime and unique number
        $extension = $request->file('image')->getClientOriginalExtension();
        $timestamp = now()->format('YmdHis');
        $uniqueNumber = uniqid();
        $filename = "slideshow_{$timestamp}_{$uniqueNumber}.{$extension}";
        $path = $request->file('image')->storeAs('slideshow', $filename, 'public');

        Homepage::create([
            'image_path' => $path,
        ]);

        return back()->with('flash', 'Image added successfully!');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $image = Homepage::findOrFail($id);
        Storage::disk('public')->delete($image->image_path);

        // Generate filename with datetime and unique number
        $extension = $request->file('image')->getClientOriginalExtension();
        $timestamp = now()->format('YmdHis');
        $uniqueNumber = uniqid();
        $filename = "slideshow_{$timestamp}_{$uniqueNumber}.{$extension}";
        $path = $request->file('image')->storeAs('slideshow', $filename, 'public');

        $image->update([
            'image_path' => $path,
        ]);

        return back()->with('flash', 'Image updated successfully!');
    }

    public function destroy($id)
    {
        $image = Homepage::findOrFail($id);
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('flash', 'Image deleted successfully!');
    }










    public function create_featured_product()
    {
        return Inertia::render('AdminDashboard/AddFeatureProduct', [
            'products' => Product::all(),
            'categories' => Category::all(['id', 'name']),
            'subcategories' => Subcategory::all(['id', 'sub_category_name', 'category_id']),
            'brands' => Brand::all(['id', 'brand_name', 'subcategory_id', 'category_id']),
            'flash' => session('success'),
        ]);
    }

    public function store(Request $request)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'brand_id' => 'required|exists:brands,id',
            'quantity' => 'required|integer|min:0',
            'is_featured' => 'required|in:yes,no',
            'image' => 'nullable|image|max:2048',
            // Optional validation for specifications
            'spec_name_1' => 'nullable|string|max:255',
            'spec_detail_1' => 'nullable|string|max:255',
            'spec_name_2' => 'nullable|string|max:255',
            'spec_detail_2' => 'nullable|string|max:255',
            'spec_name_3' => 'nullable|string|max:255',
            'spec_detail_3' => 'nullable|string|max:255',
            'spec_name_4' => 'nullable|string|max:255',
            'spec_detail_4' => 'nullable|string|max:255',
            'spec_name_5' => 'nullable|string|max:255',
            'spec_detail_5' => 'nullable|string|max:255',
            'spec_name_6' => 'nullable|string|max:255',
            'spec_detail_6' => 'nullable|string|max:255',
            'spec_name_7' => 'nullable|string|max:255',
            'spec_detail_7' => 'nullable|string|max:255',
            'spec_name_8' => 'nullable|string|max:255',
            'spec_detail_8' => 'nullable|string|max:255',
            'spec_name_9' => 'nullable|string|max:255',
            'spec_detail_9' => 'nullable|string|max:255',
            'spec_name_10' => 'nullable|string|max:255',
            'spec_detail_10' => 'nullable|string|max:255',
            'spec_name_11' => 'nullable|string|max:255',
            'spec_detail_11' => 'nullable|string|max:255',
            'spec_name_12' => 'nullable|string|max:255',
            'spec_detail_12' => 'nullable|string|max:255',
            'spec_name_13' => 'nullable|string|max:255',
            'spec_detail_13' => 'nullable|string|max:255',
            'spec_name_14' => 'nullable|string|max:255',
            'spec_detail_14' => 'nullable|string|max:255',
            'spec_name_15' => 'nullable|string|max:255',
            'spec_detail_15' => 'nullable|string|max:255',
        ]);

        // Generate unique product code
        do {
            $length = rand(5, 9);
            $max = pow(10, $length) - 1;
            $productCode = str_pad(rand(0, $max), $length, '0', STR_PAD_LEFT);
            $exists = Product::where('product_code', $productCode)->exists();
        } while ($exists);

        // Handle image upload with custom filename
        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $dateCreated = now()->format('Ymd_His');
            $productName = str_replace(' ', '_', strtolower(trim($request->name)));
            $extension = $image->getClientOriginalExtension();
            $customFileName = "{$productCode}_{$productName}_{$dateCreated}.{$extension}";
            $imagePath = $image->storeAs('products', $customFileName, 'public');
        }

        // Prepare product data including specifications
        $productData = [
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'subcategory_id' => $request->subcategory_id,
            'brand_id' => $request->brand_id,
            'quantity' => $request->quantity,
            'product_code' => $productCode,
            'is_featured' => $request->is_featured,
            'image' => $imagePath,
            'spec_name_1' => $request->input('spec_name_1'),
            'spec_detail_1' => $request->input('spec_detail_1'),
            'spec_name_2' => $request->input('spec_name_2'),
            'spec_detail_2' => $request->input('spec_detail_2'),
            'spec_name_3' => $request->input('spec_name_3'),
            'spec_detail_3' => $request->input('spec_detail_3'),
            'spec_name_4' => $request->input('spec_name_4'),
            'spec_detail_4' => $request->input('spec_detail_4'),
            'spec_name_5' => $request->input('spec_name_5'),
            'spec_detail_5' => $request->input('spec_detail_5'),
            'spec_name_6' => $request->input('spec_name_6'),
            'spec_detail_6' => $request->input('spec_detail_6'),
            'spec_name_7' => $request->input('spec_name_7'),
            'spec_detail_7' => $request->input('spec_detail_7'),
            'spec_name_8' => $request->input('spec_name_8'),
            'spec_detail_8' => $request->input('spec_detail_8'),
            'spec_name_9' => $request->input('spec_name_9'),
            'spec_detail_9' => $request->input('spec_detail_9'),
            'spec_name_10' => $request->input('spec_name_10'),
            'spec_detail_10' => $request->input('spec_detail_10'),
            'spec_name_11' => $request->input('spec_name_11'),
            'spec_detail_11' => $request->input('spec_detail_11'),
            'spec_name_12' => $request->input('spec_name_12'),
            'spec_detail_12' => $request->input('spec_detail_12'),
            'spec_name_13' => $request->input('spec_name_13'),
            'spec_detail_13' => $request->input('spec_detail_13'),
            'spec_name_14' => $request->input('spec_name_14'),
            'spec_detail_14' => $request->input('spec_detail_14'),
            'spec_name_15' => $request->input('spec_name_15'),
            'spec_detail_15' => $request->input('spec_detail_15'),
        ];

        // Create the product
        $product = Product::create($productData);

        // Return a response with a flash message
        return redirect()->back()
            ->with('success', 'Featured Product for homepage added successfully!');
    }







    public function feature_product_index(Request $request)
    {
        $perPage = 20;
        $search = $request->input('search', '');

        $productsQuery = Product::with(['category', 'subcategory', 'brand'])
            ->where('is_featured', 'yes')
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('product_code', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('subcategory', function ($q) use ($search) {
                        $q->where('sub_category_name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('brand', function ($q) use ($search) {
                        $q->where('brand_name', 'like', "%{$search}%");
                    });
            });

        // Paginate and append search query manually
        $products = $productsQuery->paginate($perPage);
        if ($search) {
            $products->appends(['search' => $search]);
        }

        return Inertia::render('AdminDashboard/ViewFeatureProduct', [
            'products' => $products,
            'categories' => Category::all(['id', 'name']),
            'subcategories' => Subcategory::all(['id', 'sub_category_name', 'category_id']),
            'brands' => Brand::all(['id', 'brand_name', 'subcategory_id', 'category_id']),
            'search' => $search,
        ]);
    }



    public function feature_product_edit($id)
    {
        $product = Product::findOrFail($id);

        return Inertia::render('AdminDashboard/ViewAndUpdateProduct', [
            'product' => $product,
            'categories' => Category::all(['id', 'name']),
            'subcategories' => Subcategory::all(['id', 'sub_category_name', 'category_id']),
            'brands' => Brand::all(['id', 'brand_name', 'subcategory_id', 'category_id']),
            'flash' => session('success'),
        ]);
    }

    public function feature_product_update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'brand_id' => 'required|exists:brands,id',
            'quantity' => 'required|integer|min:0',
            'is_featured' => 'required|in:yes,no',
            'image' => 'nullable|image|max:2048',
            'spec_name_1' => 'nullable|string|max:255',
            'spec_detail_1' => 'nullable|string|max:255',
            'spec_name_2' => 'nullable|string|max:255',
            'spec_detail_2' => 'nullable|string|max:255',
            'spec_name_3' => 'nullable|string|max:255',
            'spec_detail_3' => 'nullable|string|max:255',
            'spec_name_4' => 'nullable|string|max:255',
            'spec_detail_4' => 'nullable|string|max:255',
            'spec_name_5' => 'nullable|string|max:255',
            'spec_detail_5' => 'nullable|string|max:255',
            'spec_name_6' => 'nullable|string|max:255',
            'spec_detail_6' => 'nullable|string|max:255',
            'spec_name_7' => 'nullable|string|max:255',
            'spec_detail_7' => 'nullable|string|max:255',
            'spec_name_8' => 'nullable|string|max:255',
            'spec_detail_8' => 'nullable|string|max:255',
            'spec_name_9' => 'nullable|string|max:255',
            'spec_detail_9' => 'nullable|string|max:255',
            'spec_name_10' => 'nullable|string|max:255',
            'spec_detail_10' => 'nullable|string|max:255',
            'spec_name_11' => 'nullable|string|max:255',
            'spec_detail_11' => 'nullable|string|max:255',
            'spec_name_12' => 'nullable|string|max:255',
            'spec_detail_12' => 'nullable|string|max:255',
            'spec_name_13' => 'nullable|string|max:255',
            'spec_detail_13' => 'nullable|string|max:255',
            'spec_name_14' => 'nullable|string|max:255',
            'spec_detail_14' => 'nullable|string|max:255',
            'spec_name_15' => 'nullable|string|max:255',
            'spec_detail_15' => 'nullable|string|max:255',
        ]);

        $imagePath = $product->image;
        if ($request->hasFile('image')) {
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            $image = $request->file('image');
            $dateCreated = now()->format('Ymd_His');
            $productName = str_replace(' ', '_', strtolower(trim($request->name)));
            $extension = $image->getClientOriginalExtension();
            $customFileName = "{$product->product_code}_{$productName}_{$dateCreated}.{$extension}";
            $imagePath = $image->storeAs('products', $customFileName, 'public');
        }

        $product->update([
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'subcategory_id' => $request->subcategory_id,
            'brand_id' => $request->brand_id,
            'quantity' => $request->quantity,
            'is_featured' => $request->is_featured,
            'image' => $imagePath,
            'spec_name_1' => $request->input('spec_name_1'),
            'spec_detail_1' => $request->input('spec_detail_1'),
            'spec_name_2' => $request->input('spec_name_2'),
            'spec_detail_2' => $request->input('spec_detail_2'),
            'spec_name_3' => $request->input('spec_name_3'),
            'spec_detail_3' => $request->input('spec_detail_3'),
            'spec_name_4' => $request->input('spec_name_4'),
            'spec_detail_4' => $request->input('spec_detail_4'),
            'spec_name_5' => $request->input('spec_name_5'),
            'spec_detail_5' => $request->input('spec_detail_5'),
            'spec_name_6' => $request->input('spec_name_6'),
            'spec_detail_6' => $request->input('spec_detail_6'),
            'spec_name_7' => $request->input('spec_name_7'),
            'spec_detail_7' => $request->input('spec_detail_7'),
            'spec_name_8' => $request->input('spec_name_8'),
            'spec_detail_8' => $request->input('spec_detail_8'),
            'spec_name_9' => $request->input('spec_name_9'),
            'spec_detail_9' => $request->input('spec_detail_9'),
            'spec_name_10' => $request->input('spec_name_10'),
            'spec_detail_10' => $request->input('spec_detail_10'),
            'spec_name_11' => $request->input('spec_name_11'),
            'spec_detail_11' => $request->input('spec_detail_11'),
            'spec_name_12' => $request->input('spec_name_12'),
            'spec_detail_12' => $request->input('spec_detail_12'),
            'spec_name_13' => $request->input('spec_name_13'),
            'spec_detail_13' => $request->input('spec_detail_13'),
            'spec_name_14' => $request->input('spec_name_14'),
            'spec_detail_14' => $request->input('spec_detail_14'),
            'spec_name_15' => $request->input('spec_name_15'),
            'spec_detail_15' => $request->input('spec_detail_15'),
        ]);

        return redirect()->back()
            ->with('success', 'Product updated successfully!');
    }




    public function feature_product_destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->back()
            ->with('success', 'Featured Product for homepage deleted successfully!');
    }














    public function create_special_offer_product()
    {
        return Inertia::render('AdminDashboard/AddSpecialOfferProduct', [
            'products' => Product::all(),
            'categories' => Category::all(['id', 'name']),
            'subcategories' => Subcategory::all(['id', 'sub_category_name', 'category_id']),
            'brands' => Brand::all(['id', 'brand_name', 'subcategory_id', 'category_id']),
            'flash' => session('success'),
        ]);
    }

    public function special_offer_store(Request $request)
    {
        // Validate the request
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'brand_id' => 'required|exists:brands,id',
            'quantity' => 'required|integer|min:0',
            'is_special_offer' => 'required|in:yes,no',
            'image' => 'nullable|image|max:2048',
            // Optional validation for specifications
            'spec_name_1' => 'nullable|string|max:255',
            'spec_detail_1' => 'nullable|string|max:255',
            'spec_name_2' => 'nullable|string|max:255',
            'spec_detail_2' => 'nullable|string|max:255',
            'spec_name_3' => 'nullable|string|max:255',
            'spec_detail_3' => 'nullable|string|max:255',
            'spec_name_4' => 'nullable|string|max:255',
            'spec_detail_4' => 'nullable|string|max:255',
            'spec_name_5' => 'nullable|string|max:255',
            'spec_detail_5' => 'nullable|string|max:255',
            'spec_name_6' => 'nullable|string|max:255',
            'spec_detail_6' => 'nullable|string|max:255',
            'spec_name_7' => 'nullable|string|max:255',
            'spec_detail_7' => 'nullable|string|max:255',
            'spec_name_8' => 'nullable|string|max:255',
            'spec_detail_8' => 'nullable|string|max:255',
            'spec_name_9' => 'nullable|string|max:255',
            'spec_detail_9' => 'nullable|string|max:255',
            'spec_name_10' => 'nullable|string|max:255',
            'spec_detail_10' => 'nullable|string|max:255',
            'spec_name_11' => 'nullable|string|max:255',
            'spec_detail_11' => 'nullable|string|max:255',
            'spec_name_12' => 'nullable|string|max:255',
            'spec_detail_12' => 'nullable|string|max:255',
            'spec_name_13' => 'nullable|string|max:255',
            'spec_detail_13' => 'nullable|string|max:255',
            'spec_name_14' => 'nullable|string|max:255',
            'spec_detail_14' => 'nullable|string|max:255',
            'spec_name_15' => 'nullable|string|max:255',
            'spec_detail_15' => 'nullable|string|max:255',
        ]);

        // Generate unique product code
        do {
            $length = rand(5, 9);
            $max = pow(10, $length) - 1;
            $productCode = str_pad(rand(0, $max), $length, '0', STR_PAD_LEFT);
            $exists = Product::where('product_code', $productCode)->exists();
        } while ($exists);

        // Handle image upload with custom filename
        $imagePath = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $dateCreated = now()->format('Ymd_His');
            $productName = str_replace(' ', '_', strtolower(trim($request->name)));
            $extension = $image->getClientOriginalExtension();
            $customFileName = "{$productCode}_{$productName}_{$dateCreated}.{$extension}";
            $imagePath = $image->storeAs('products', $customFileName, 'public');
        }

        // Prepare product data including specifications
        $productData = [
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'subcategory_id' => $request->subcategory_id,
            'brand_id' => $request->brand_id,
            'quantity' => $request->quantity,
            'product_code' => $productCode,
            'is_special_offer' => $request->is_special_offer,
            'image' => $imagePath,
            'spec_name_1' => $request->input('spec_name_1'),
            'spec_detail_1' => $request->input('spec_detail_1'),
            'spec_name_2' => $request->input('spec_name_2'),
            'spec_detail_2' => $request->input('spec_detail_2'),
            'spec_name_3' => $request->input('spec_name_3'),
            'spec_detail_3' => $request->input('spec_detail_3'),
            'spec_name_4' => $request->input('spec_name_4'),
            'spec_detail_4' => $request->input('spec_detail_4'),
            'spec_name_5' => $request->input('spec_name_5'),
            'spec_detail_5' => $request->input('spec_detail_5'),
            'spec_name_6' => $request->input('spec_name_6'),
            'spec_detail_6' => $request->input('spec_detail_6'),
            'spec_name_7' => $request->input('spec_name_7'),
            'spec_detail_7' => $request->input('spec_detail_7'),
            'spec_name_8' => $request->input('spec_name_8'),
            'spec_detail_8' => $request->input('spec_detail_8'),
            'spec_name_9' => $request->input('spec_name_9'),
            'spec_detail_9' => $request->input('spec_detail_9'),
            'spec_name_10' => $request->input('spec_name_10'),
            'spec_detail_10' => $request->input('spec_detail_10'),
            'spec_name_11' => $request->input('spec_name_11'),
            'spec_detail_11' => $request->input('spec_detail_11'),
            'spec_name_12' => $request->input('spec_name_12'),
            'spec_detail_12' => $request->input('spec_detail_12'),
            'spec_name_13' => $request->input('spec_name_13'),
            'spec_detail_13' => $request->input('spec_detail_13'),
            'spec_name_14' => $request->input('spec_name_14'),
            'spec_detail_14' => $request->input('spec_detail_14'),
            'spec_name_15' => $request->input('spec_name_15'),
            'spec_detail_15' => $request->input('spec_detail_15'),
        ];

        // Create the product
        $product = Product::create($productData);

        return redirect()->back()
            ->with('success', 'Special offer Product for Homepage added successfully!');
    }







    public function special_offer_index(Request $request)
    {
        $perPage = 20;
        $search = $request->input('search', '');

        $productsQuery = Product::with(['category', 'subcategory', 'brand'])
            ->where('is_special_offer', 'yes')
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('product_code', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('subcategory', function ($q) use ($search) {
                        $q->where('sub_category_name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('brand', function ($q) use ($search) {
                        $q->where('brand_name', 'like', "%{$search}%");
                    });
            });

        // Paginate and append search query manually
        $products = $productsQuery->paginate($perPage);
        if ($search) {
            $products->appends(['search' => $search]);
        }

        return Inertia::render('AdminDashboard/ViewSpecialOfferProduct', [
            'products' => $products,
            'categories' => Category::all(['id', 'name']),
            'subcategories' => Subcategory::all(['id', 'sub_category_name', 'category_id']),
            'brands' => Brand::all(['id', 'brand_name', 'subcategory_id', 'category_id']),
            'search' => $search,
        ]);
    }



    public function special_offer_edit($id)
    {
        $product = Product::findOrFail($id);

        return Inertia::render('AdminDashboard/ViewAndUpdateProduct', [
            'product' => $product,
            'categories' => Category::all(['id', 'name']),
            'subcategories' => Subcategory::all(['id', 'sub_category_name', 'category_id']),
            'brands' => Brand::all(['id', 'brand_name', 'subcategory_id', 'category_id']),
            'flash' => session('success'),
        ]);
    }

    public function special_offer_update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'brand_id' => 'required|exists:brands,id',
            'quantity' => 'required|integer|min:0',
            'is_special_offer' => 'required|in:yes,no',
            'image' => 'nullable|image|max:2048',
            'spec_name_1' => 'nullable|string|max:255',
            'spec_detail_1' => 'nullable|string|max:255',
            'spec_name_2' => 'nullable|string|max:255',
            'spec_detail_2' => 'nullable|string|max:255',
            'spec_name_3' => 'nullable|string|max:255',
            'spec_detail_3' => 'nullable|string|max:255',
            'spec_name_4' => 'nullable|string|max:255',
            'spec_detail_4' => 'nullable|string|max:255',
            'spec_name_5' => 'nullable|string|max:255',
            'spec_detail_5' => 'nullable|string|max:255',
            'spec_name_6' => 'nullable|string|max:255',
            'spec_detail_6' => 'nullable|string|max:255',
            'spec_name_7' => 'nullable|string|max:255',
            'spec_detail_7' => 'nullable|string|max:255',
            'spec_name_8' => 'nullable|string|max:255',
            'spec_detail_8' => 'nullable|string|max:255',
            'spec_name_9' => 'nullable|string|max:255',
            'spec_detail_9' => 'nullable|string|max:255',
            'spec_name_10' => 'nullable|string|max:255',
            'spec_detail_10' => 'nullable|string|max:255',
            'spec_name_11' => 'nullable|string|max:255',
            'spec_detail_11' => 'nullable|string|max:255',
            'spec_name_12' => 'nullable|string|max:255',
            'spec_detail_12' => 'nullable|string|max:255',
            'spec_name_13' => 'nullable|string|max:255',
            'spec_detail_13' => 'nullable|string|max:255',
            'spec_name_14' => 'nullable|string|max:255',
            'spec_detail_14' => 'nullable|string|max:255',
            'spec_name_15' => 'nullable|string|max:255',
            'spec_detail_15' => 'nullable|string|max:255',
        ]);

        $imagePath = $product->image;
        if ($request->hasFile('image')) {
            if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }

            $image = $request->file('image');
            $dateCreated = now()->format('Ymd_His');
            $productName = str_replace(' ', '_', strtolower(trim($request->name)));
            $extension = $image->getClientOriginalExtension();
            $customFileName = "{$product->product_code}_{$productName}_{$dateCreated}.{$extension}";
            $imagePath = $image->storeAs('products', $customFileName, 'public');
        }

        $product->update([
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'category_id' => $request->category_id,
            'subcategory_id' => $request->subcategory_id,
            'brand_id' => $request->brand_id,
            'quantity' => $request->quantity,
            'is_special_offer' => $request->is_special_offer,
            'image' => $imagePath,
            'spec_name_1' => $request->input('spec_name_1'),
            'spec_detail_1' => $request->input('spec_detail_1'),
            'spec_name_2' => $request->input('spec_name_2'),
            'spec_detail_2' => $request->input('spec_detail_2'),
            'spec_name_3' => $request->input('spec_name_3'),
            'spec_detail_3' => $request->input('spec_detail_3'),
            'spec_name_4' => $request->input('spec_name_4'),
            'spec_detail_4' => $request->input('spec_detail_4'),
            'spec_name_5' => $request->input('spec_name_5'),
            'spec_detail_5' => $request->input('spec_detail_5'),
            'spec_name_6' => $request->input('spec_name_6'),
            'spec_detail_6' => $request->input('spec_detail_6'),
            'spec_name_7' => $request->input('spec_name_7'),
            'spec_detail_7' => $request->input('spec_detail_7'),
            'spec_name_8' => $request->input('spec_name_8'),
            'spec_detail_8' => $request->input('spec_detail_8'),
            'spec_name_9' => $request->input('spec_name_9'),
            'spec_detail_9' => $request->input('spec_detail_9'),
            'spec_name_10' => $request->input('spec_name_10'),
            'spec_detail_10' => $request->input('spec_detail_10'),
            'spec_name_11' => $request->input('spec_name_11'),
            'spec_detail_11' => $request->input('spec_detail_11'),
            'spec_name_12' => $request->input('spec_name_12'),
            'spec_detail_12' => $request->input('spec_detail_12'),
            'spec_name_13' => $request->input('spec_name_13'),
            'spec_detail_13' => $request->input('spec_detail_13'),
            'spec_name_14' => $request->input('spec_name_14'),
            'spec_detail_14' => $request->input('spec_detail_14'),
            'spec_name_15' => $request->input('spec_name_15'),
            'spec_detail_15' => $request->input('spec_detail_15'),
        ]);

        return redirect()->back()
            ->with('success', 'Product updated successfully!');
    }




    public function special_offer_product_destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->back()
            ->with('success', 'Product deleted successfully!');
    }









    public function manage_special_offer_index(Request $request)
    {
        $perPage = 20;
        $search = $request->input('search', '');

        $productsQuery = Product::with(['offer', 'category', 'subcategory', 'brand'])
            ->where('is_special_offer', 'yes')
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%")
                    ->orWhere('product_code', 'like', "%{$search}%")
                    ->orWhereHas('category', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('subcategory', function ($q) use ($search) {
                        $q->where('sub_category_name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('brand', function ($q) use ($search) {
                        $q->where('brand_name', 'like', "%{$search}%");
                    });
            });

        $products = $productsQuery->paginate($perPage);
        if ($search) {
            $products->appends(['search' => $search]);
        }

        return Inertia::render('AdminDashboard/ManageSpecialOffer', [
            'products' => $products,
            'flash' => session('success'),
            'search' => $search,
        ]);
    }
    public function manage_special_offer_save(Request $request)
{
    $product = Product::findOrFail($request->input('id')); // Fetch product early for validation

    $validated = $request->validate([
        'id' => 'required|exists:products,id',
        'offer.is_offered_product' => 'required|in:yes,no',
        'offer.discount_type' => 'nullable|in:unlimited,fixed',
        'offer.offer_price' => [
            'nullable',
            'numeric',
            'min:0',
            'required_if:offer.is_offered_product,yes', // Require offer_price if is_offered_product is yes
            function ($attribute, $value, $fail) use ($product, $request) {
                if ($request->input('offer.is_offered_product') === 'yes' && $value > $product->price) {
                    $fail('The offer price cannot be greater than the product price.');
                }
            },
        ],
        'offer.start_date' => [
            'nullable',
            'date',
            'required_if:offer.discount_type,fixed',
        ],
        'offer.end_date' => [
            'nullable',
            'date',
            'required_if:offer.discount_type,fixed',
            'after_or_equal:offer.start_date',
        ],
    ]);

    // Update product is_offered_product status
    $product->is_offered_product = $request->offer['is_offered_product'];
    $product->save();

    // If not an offered product, delete any existing offer
    if ($request->offer['is_offered_product'] === 'no') {
        Offer::where('product_id', $product->id)->delete();
        return redirect()->route('special_offers.index')->with('success', 'Offer removed successfully!');
    }

    // Prepare offer data
    $offerData = [
        'product_id' => $product->id,
        'discount_type' => $request->offer['discount_type'],
        'offer_price' => $request->offer['offer_price'] ? floatval($request->offer['offer_price']) : null,
        'discount_value' => $request->offer['offer_price'] ? ($product->price - floatval($request->offer['offer_price'])) : 0,
        'start_date' => $request->offer['discount_type'] === 'unlimited' ? null : $request->offer['start_date'],
        'end_date' => $request->offer['discount_type'] === 'unlimited' ? null : $request->offer['end_date'],
    ];

    // Update or create offer
    Offer::updateOrCreate(
        ['product_id' => $product->id],
        $offerData
    );

    return redirect()->route('special_offers.index')->with('success', 'Offer updated successfully!');
}



public function about()
    {




        return Inertia::render('Landing/About');




    }


}
