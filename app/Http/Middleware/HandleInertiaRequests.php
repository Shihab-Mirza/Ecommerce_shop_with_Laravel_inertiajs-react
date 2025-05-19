<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Category;
use App\Models\Cart;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        // Fetch categories with subcategories and brands without caching
        $categories = Category::with(['subcategories.brands'])->get();

        // Initialize cart data
        $cartCount = 0;
        $cartItems = [];
        $checkoutToken = null;
        $cartId = null;

        try {
            $cart = null;
            if ($request->user()) {
                // For logged-in users, fetch cart by user_id
                $cart = Cart::where('user_id', $request->user()->id)->first();
            } else {
                // For guest users, fetch cart by session_id
                $sessionId = $request->session()->getId();
                $cart = Cart::where('session_id', $sessionId)->first();
            }

            if ($cart) {
                $cartCount = $cart->items()->distinct('product_id')->count('product_id');
                $cartItems = $cart->items()
                    ->with(['product' => function ($query) {
                        $query->select('id', 'name', 'price', 'is_offered_product', 'image', 'quantity')
                            ->with(['offer' => function ($query) {
                                $query->select('offer_id', 'product_id', 'offer_price');
                            }]);
                    }])
                    ->get()
                    ->map(function ($item) {
                        $product = $item->product;
                        $offer = $product->offer ?? null;
                        return [
                            'id' => $item->id,
                            'product_id' => $item->product_id,
                            'product_name' => $product ? $product->name : 'Unknown Product',
                            'quantity' => $item->quantity, // Cart item quantity
                            'available_stock' => $product ? (int)$product->quantity : 0, // Product stock from products table
                            'price' => $product ? (float)$product->price : 0.0,
                            'offer_price' => $product && $product->is_offered_product === 'yes' ? (float)$offer->offer_price : null,
                            'is_offered_product' => $product ? $product->is_offered_product : 'no',
                            'image_path' => $product ? $product->image : null,
                            'total_price' => $product ? (
                                $product && $product->is_offered_product === 'yes' && $offer->offer_price
                                    ? (float)$offer->offer_price * $item->quantity
                                    : (float)$product->price * $item->quantity
                            ) : 0.0,
                        ];
                    })->toArray();
                $checkoutToken = $cart->checkout_token;
                $cartId = $cart->id;
            }
        } catch (\Exception $e) {
            // Silently handle the exception without logging
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'categories' => $categories,
            'cartCount' => $cartCount,
            'cartItems' => $cartItems,
            'checkoutToken' => $checkoutToken,
            'cartId' => $cartId,
             'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error' => fn () => $request->session()->get('error'),
             'review_success' => fn () => $request->session()->get('review_success'),
             'review_error' => fn () => $request->session()->get('review_error'),

        ],
        ];
    }
}
