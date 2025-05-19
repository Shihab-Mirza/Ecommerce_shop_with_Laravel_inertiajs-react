<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Cartitem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Add a product to the cart for authenticated or guest users.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function add(Request $request, $id)
    {
        // Validate the request
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Find the product
        $product = Product::find($id);

        if (!$product) {
            return back()->with(
                'error' ,'Product not found.'
            );
        }

        if (Auth::check()) {
            // Authenticated user
            $cart_user_id = Auth::id();

            // Find or create cart with user_id and checkout_token
            $cart = Cart::firstOrCreate(
                ['user_id' => $cart_user_id],
                [
                    'session_id' => Session::getId(),
                    'checkout_token' => Str::random(40),
                ]
            );

            // If the cart already exists but has no checkout_token, update it
            if (!$cart->checkout_token) {
                $cart->update(['checkout_token' => Str::random(40)]);
            }

            // Find or create cart item
            $cartItem = Cartitem::where('cart_id', $cart->id)
                ->where('product_id', $id)
                ->first();

            $existingQuantity = $cartItem ? $cartItem->quantity : 0;
            $totalQuantity = $existingQuantity + $request->quantity;

            if ($cartItem) {
                $cartItem->update(['quantity' => $totalQuantity]);
            } else {
                Cartitem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $id,
                    'quantity' => $request->quantity,
                ]);
            }

            return back()->with(
                'success' , "{$request->quantity} x {$product->name} added to cart successfully!",
            );
        } else {
            // Guest user
            $sessionId = Session::getId();

            // Find or create cart with session_id and checkout_token
            $cart = Cart::firstOrCreate(
                ['session_id' => $sessionId],
                ['checkout_token' => Str::random(40)]
            );

            // If the cart already exists but has no checkout_token, update it
            if (!$cart->checkout_token) {
                $cart->update(['checkout_token' => Str::random(40)]);
            }

            // Find or create cart item
            $cartItem = Cartitem::where('cart_id', $cart->id)
                ->where('product_id', $id)
                ->first();

            $existingQuantity = $cartItem ? $cartItem->quantity : 0;
            $totalQuantity = $existingQuantity + $request->quantity;

            if ($cartItem) {
                $cartItem->update(['quantity' => $totalQuantity]);
            } else {
                Cartitem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $id,
                    'quantity' => $request->quantity,
                ]);
            }

            return back()->with(
                'success' , "{$request->quantity} x {$product->name} added to cart successfully!"
            );
        }
    }

    /**
     * Update the quantity of a cart item.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'item_id' => 'required|exists:cartitems,id',
                'quantity' => 'required|integer|min:1',
            ]);

            $itemId = $request->input('item_id');
            $quantity = $request->input('quantity');

            // Find the cart item
            $cartItem = Cartitem::findOrFail($itemId);

            // Verify the cart belongs to the user or session
            $cart = $cartItem->cart;
            if (Auth::check()) {
                if ($cart->user_id !== Auth::id()) {
                    return response()->json(['error' => 'Unauthorized access to cart item'], 403);
                }
            } else {
                if ($cart->session_id !== $request->session()->getId()) {
                    return response()->json(['error' => 'Unauthorized access to cart item'], 403);
                }
            }

            // Update the quantity
            $cartItem->update(['quantity' => $quantity]);

            Log::info('Cart item updated', [
                'item_id' => $itemId,
                'quantity' => $quantity,
                'user_id' => Auth::id() ?? null,
                'session_id' => $request->session()->getId(),
            ]);

            return response()->json(['success' => 'Cart item updated successfully']);
        } catch (\Exception $e) {
            Log::error('Error updating cart item', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'Failed to update cart item'], 500);
        }
    }

    /**
     * Remove a cart item.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function remove(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'item_id' => 'required|exists:cartitems,id',
            ]);

            $itemId = $request->input('item_id');

            // Find the cart item
            $cartItem = Cartitem::findOrFail($itemId);

            // Verify the cart belongs to the user or session
            $cart = $cartItem->cart;
            if (Auth::check()) {
                if ($cart->user_id !== Auth::id()) {
                    return response()->json(['error' => 'Unauthorized access to cart item'], 403);
                }
            } else {
                if ($cart->session_id !== $request->session()->getId()) {
                    return response()->json(['error' => 'Unauthorized access to cart item'], 403);
                }
            }

            // Delete the cart item
            $cartItem->delete();

            Log::info('Cart item removed', [
                'item_id' => $itemId,
                'user_id' => Auth::id() ?? null,
                'session_id' => $request->session()->getId(),
            ]);

            return response()->json(['success' => 'Cart item removed successfully']);
        } catch (\Exception $e) {
            Log::error('Error removing cart item', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'Failed to remove cart item'], 500);
        }
    }

    /**
     * Initiate checkout and return the cart's checkout token and cart ID.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function initiateCheckout(Request $request): JsonResponse
    {
        try {
            // Find the cart
            $cart = null;
            if (Auth::check()) {
                $cart = Cart::where('user_id', Auth::id())->first();
            } else {
                $cart = Cart::where('session_id', $request->session()->getId())->first();
            }

            if (!$cart) {
                return response()->json(['error' => 'Cart not found'], 404);
            }

            if ($cart->cartitems()->count() === 0) {
                return response()->json(['error' => 'Cart is empty'], 400);
            }

            // If the cart doesn't have a checkout token, generate one
            if (!$cart->checkout_token) {
                $cart->update([
                    'checkout_token' => Str::random(40),
                ]);
            }

            Log::info('Checkout token accessed or generated', [
                'cart_id' => $cart->id,
                'checkout_token' => $cart->checkout_token,
                'user_id' => Auth::id() ?? null,
                'session_id' => $request->session()->getId(),
            ]);

            return response()->json([
                'checkoutToken' => $cart->checkout_token,
                'cartId' => $cart->id,
            ]);
        } catch (\Exception $e) {
            Log::error('Error initiating checkout', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json(['error' => 'Failed to initiate checkout'], 500);
        }
    }
}
