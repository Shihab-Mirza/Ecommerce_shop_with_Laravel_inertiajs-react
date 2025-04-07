<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class BrandController extends Controller
{
    public function index()
    {
        $categories = Category::all(['id', 'name']);
        $subcategories = Subcategory::all(['id', 'sub_category_name', 'category_id']); // Fetch all subcategories
        $brands = Brand::with(['category', 'subcategory'])->get(['id', 'brand_name', 'category_id', 'subcategory_id']); // Fetch brands with relationships

        return Inertia::render('AdminDashboard/AddBrand', [
            'auth' => Auth::user(), // Pass authenticated user
            'categories' => $categories,
            'subcategories' => $subcategories,
            'brands' => $brands,
            'errors' => session('errors') ? session('errors')->all() : [],
            'flash' => session('flash'),
        ]);
    }

    /**
     * Store a new brand.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'brand_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('brands')->where(function ($query) use ($request) {
                    return $query->where('category_id', $request->category_id)
                                 ->where('subcategory_id', $request->subcategory_id);
                }),
            ],
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:subcategories,id', // Subcategory is optional
        ]);

        $brand = Brand::create($validated);

        return redirect()->back()->with('flash', 'Brand added successfully!')->with('brands', Brand::with(['category', 'subcategory'])->get());
    }

    /**
     * Update an existing brand.
     */
    public function update(Request $request, Brand $brand)
    {
        $validated = $request->validate([
            'brand_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('brands')->where(function ($query) use ($request) {
                    return $query->where('category_id', $request->category_id)
                                 ->where('subcategory_id', $request->subcategory_id);
                })->ignore($brand->id),
            ],
            'category_id' => 'required|exists:categories,id',
            'subcategory_id' => 'nullable|exists:subcategories,id',
        ]);

        $brand->update($validated);

        return redirect()->back()->with('flash', 'Brand updated successfully!')->with('brands', Brand::with(['category', 'subcategory'])->get());
    }

    /**
     * Delete a brand.
     */
    public function destroy(Brand $brand)
    {
        $brand->delete();

        return redirect()->back()->with('flash', 'Brand deleted successfully!')->with('brands', Brand::with(['category', 'subcategory'])->get());
    }
}
