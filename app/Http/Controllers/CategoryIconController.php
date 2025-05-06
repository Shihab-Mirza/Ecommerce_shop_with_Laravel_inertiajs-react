<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class CategoryIconController extends Controller
{
    /**
     * Display the Manage Category Icons page.
     */
    public function manageIcons()
    {
        $categories = Category::all()->map(function ($category) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'icon' => $category->icon,
                'show_category_icon' => $category->show_category_icon,
            ];
        });

        return Inertia::render('AdminDashboard/ManageCategoryIcon', [
            'categories' => $categories,
            'flash' => session('flash'),
            'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : [],
        ]);
    }

    /**
     * Update an existing category's icon and show_category_icon.
     */
    public function update(Request $request, $id)
    {
        Log::info('CategoryIconController::update called', ['id' => $id, 'request' => $request->all()]);

        try {
            $category = Category::findOrFail($id);
            Log::info('Category found', ['category' => $category->toArray()]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::error('Category not found', ['id' => $id]);
            return back()->withErrors(['id' => 'Category not found'])->withInput();
        }

        $validator = Validator::make($request->all(), [
            'icon' => ['nullable', 'string', 'max:255', 'required_if:show_category_icon,yes'],
            'show_category_icon' => ['required', 'in:yes,no'],
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', ['errors' => $validator->errors()]);
            return back()->withErrors($validator)->withInput();
        }

        $category->update([
            'icon' => $request->show_category_icon === 'yes' ? $request->icon : null,
            'show_category_icon' => $request->show_category_icon,
        ]);

        Log::info('Category icon updated', ['id' => $id, 'icon' => $request->icon, 'show_category_icon' => $request->show_category_icon]);

        return redirect()->back()->with('flash', 'Category icon updated successfully!');
    }
}
