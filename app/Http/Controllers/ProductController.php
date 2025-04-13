<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Brand;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function create()
    {
        return Inertia::render('AdminDashboard/AddProduct', [
            'produaacts' => Product::all(),
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
            ->with('success', 'Product added successfully!');
    }

    public function index(Request $request)
    {
        $perPage = 20;
        $search = $request->input('search', '');

        $productsQuery = Product::with(['category', 'subcategory', 'brand'])
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

        return Inertia::render('AdminDashboard/ViewProduct', [
            'products' => $products,
            'categories' => Category::all(['id', 'name']),
            'subcategories' => Subcategory::all(['id', 'sub_category_name', 'category_id']),
            'brands' => Brand::all(['id', 'brand_name', 'subcategory_id', 'category_id']),
            'search' => $search,
        ]);
    }





    public function edit($id)
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
    public function update(Request $request, $id)
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

        // Validate is_featured and is_special_offer logic
        if ($request->is_featured === 'yes' && $request->is_special_offer === 'yes') {
            return back()->withErrors(['is_special_offer' => 'Special offer cannot be yes if featured is yes.']);
        }

  

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




    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return redirect()->back()
            ->with('success', 'Product deleted successfully!');
    }





}
