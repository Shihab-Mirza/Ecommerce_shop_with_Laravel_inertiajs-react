<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    public function store(Request $request, $productId)
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'You must be logged in to post a review.');
        }

        // Check if the user has already reviewed this product
        $existingReview = Review::where('user_id', Auth::id())
                               ->where('product_id', $productId)
                               ->first();

        if ($existingReview) {
            return redirect()->route('products.show', $productId)
                             ->with('review_error', "You have already submitted a review for this product.");
        }

        $validated = $request->validate([
            'rating' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:1000',
        ]);

        Review::create([
            'product_id' => $productId,
            'user_id' => Auth::id(),
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return redirect()->route('products.show', $productId)
                         ->with('review_success', 'Review submitted successfully!');
    }


}
