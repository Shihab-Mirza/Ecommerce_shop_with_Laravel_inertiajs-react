<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function create()
    {
        return Inertia::render('AdminDashboard/AddCategory', [
            'categories' => Category::all(),
            'flash' => session('success'), // Send flash message as prop
        ]);
    }

    public function store(Request $request)
    {
        // Validate category name uniqueness
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name', // Ensure unique name
        ]);

        // Create category after validation
        Category::create([
            'name' => $request->name,
        ]);

        return redirect()->back()->with('success', 'Category added successfully');
    }

    public function update(Request $request, Category $category)
    {
        // Validate category name uniqueness (excluding current category)
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
        ]);

        // Update the category
        $category->update([
            'name' => $request->name,
        ]);

        return redirect()->back()->with('success', 'Category updated successfully');
    }

    public function destroy(Category $category)
    {
        // Delete the category
        $category->delete();

        return redirect()->back()->with('success', 'Category deleted successfully');
    }
}
