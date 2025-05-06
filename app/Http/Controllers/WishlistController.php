<?php

namespace App\Http\Controllers;
use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Brand;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use App\Models\Wishlist;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{



public function add(Request $request, $productId)
{
    $user = Auth::user();
    $product = Product::findOrFail($productId);

    // Check if the product is already in the wishlist
    $existingWishlist = Wishlist::where('user_id', $user->id)
                               ->where('product_id', $productId)
                               ->first();

    if ($existingWishlist) {

        return redirect()->back()->with('flash', ['error' => 'Product is already in your wishlist.']);
    }
else {
    // Add to wishlist
    Wishlist::create([
        'user_id' => $user->id,
        'product_id' => $productId,
    ]);

    return redirect()->back()->with('flash', ['success' => 'Product added to wishlist successfully!']); }
}
    public function index()
    {
        $user = Auth::user();

        // Fetch wishlist items for the authenticated user with product details
        $wishlistItems = Wishlist::where('user_id', $user->id)
            ->with(['product', 'product.offer'])
            ->get()
            ->map(function ($wishlist) {
                $product = $wishlist->product;
                return [
                    'id' => $wishlist->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'image_path' => $product->image,
                    'original_price' => number_format($product->price, 2),
                    'is_offered_product' => $product->is_offered_product,
                    'offer_price' => $product->offer ? number_format($product->offer->offer_price, 2) : null,
                    'quantity' => $product->quantity,
                ];
            });

        return Inertia::render('Landing/ViewWishlist', [
            'auth' => ['user' => $user],
            'wishlistItems' => $wishlistItems,

        ]);
    }
    public function remove(Request $request, $id)
    {
        $wishlistItem = Wishlist::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $wishlistItem->delete();

        return back()->with('success', 'Item removed from wishlist successfully.');
    }
}
