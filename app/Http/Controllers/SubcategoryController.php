<?php

namespace App\Http\Controllers;

use App\Models\Subcategory;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class SubcategoryController extends Controller
{
    /**
     * Display the subcategory management page.
     */
    public function index()
    {
        $categories = Category::all(['id', 'name']); // Fetch all categories for the dropdown
        $subcategories = Subcategory::with('category')->get(['id', 'sub_category_name', 'category_id']); // Fetch subcategories with their category relationship

        return Inertia::render('AdminDashboard/AddSubcategory', [
            'categories' => $categories,
            'subcategories' => $subcategories,
            'errors' => session('errors') ? session('errors')->all() : [],
            'flash' => session('flash'), // Pass flash message if any
        ]);
    }

    /**
     * Store a newly created subcategory in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'sub_category_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('subcategories')->where(function ($query) use ($request) {
                    return $query->where('category_id', $request->category_id);
                }),
            ],
            'category_id' => 'required|exists:categories,id',
        ]);

        $subcategory = Subcategory::create($validated);

        return Redirect::route('subcategories.index')->with('flash', 'Subcategory added successfully!');
    }

    /**
     * Update the specified subcategory in storage.
     */
    public function update(Request $request, Subcategory $subcategory)
    {
        $validated = $request->validate([
            'sub_category_name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('subcategories')->where(function ($query) use ($request) {
                    return $query->where('category_id', $request->category_id);
                })->ignore($subcategory->id),
            ],
            'category_id' => 'required|exists:categories,id',
        ]);

        $subcategory->update($validated);

        return Redirect::route('subcategories.index')->with('flash', 'Subcategory updated successfully!');
    }

    /**
     * Remove the specified subcategory from storage.
     */
    public function destroy(Subcategory $subcategory)
    {
        // Optional: Check if subcategory has related products or brands before deletion
        if ($subcategory->products()->exists() || $subcategory->brands()->exists()) {
            return Redirect::route('subcategories.index')->withErrors(['sub_category_name' => 'Cannot delete subcategory with associated products or brands.']);
        }

        $subcategory->delete();

        return Redirect::route('subcategories.index')->with('flash', 'Subcategory deleted successfully!');
    }
}
