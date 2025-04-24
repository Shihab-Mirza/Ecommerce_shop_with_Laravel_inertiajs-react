<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Category;
use App\Models\Cart;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Fetch categories with subcategories and brands, cached for 1 hour
        $categories = Cache::remember('categories_with_subcategories_brands', 60 * 60, function () {
            return Category::with(['subcategories.brands'])->get();
        });

        // Initialize cart count and cart items
        $cartCount = 0;
        $cartItems = [];

        try {
            if ($request->user()) {
                // For logged-in users, fetch cart by user_id
                $cart = Cart::where('user_id', $request->user()->id)->first();
                if ($cart) {
                    $cartCount = $cart->items()->distinct('product_id')->count('product_id');
                    $cartItems = $cart->items()
                        ->with(['product' => function ($query) {
                            $query->select('id', 'name', 'price'); // Removed image
                        }])
                        ->get()
                        ->map(function ($item) {
                            $product = $item->product;
                            return [
                                'id' => $item->id,
                                'product_id' => $item->product_id,
                                'product_name' => $product ? $product->name : 'Unknown Product',
                                'quantity' => $item->quantity,
                                'price' => $product ? (float)$product->price : 0.0,
                                'total_price' => $product ? (float)$product->price * $item->quantity : 0.0,
                            ];
                        })->toArray();
                }
            } else {
                // For guest users, fetch cart by session_id
                $sessionId = $request->session()->getId();
                $cart = Cart::where('session_id', $sessionId)->first();
                if ($cart) {
                    $cartCount = $cart->items()->distinct('product_id')->count('product_id');
                    $cartItems = $cart->items()
                        ->with(['product' => function ($query) {
                            $query->select('id', 'name', 'price'); // Removed image
                        }])
                        ->get()
                        ->map(function ($item) {
                            $product = $item->product;
                            return [
                                'id' => $item->id,
                                'product_id' => $item->product_id,
                                'product_name' => $product ? $product->name : 'Unknown Product',
                                'quantity' => $item->quantity,
                                'price' => $product ? (float)$product->price : 0.0,
                                'total_price' => $product ? (float)$product->price * $item->quantity : 0.0,
                            ];
                        })->toArray();
                }
            }

            // Log the cart data for debugging
            Log::debug('Cart data for request', [
                'user_id' => $request->user() ? $request->user()->id : null,
                'session_id' => $request->session()->getId(),
                'cart_count' => $cartCount,
                'cart_items' => $cartItems,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in HandleInertiaRequests middleware', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'categories' => $categories,
            'cartCount' => $cartCount,
            'cartItems' => $cartItems,
        ];
    }
}
