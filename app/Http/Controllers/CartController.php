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

class CartController extends Controller
{
    public function add(Request $request, $id)
    {
        if (Auth::check()) {
            // Validate the request
            $request->validate([
                'quantity' => 'required|integer|min:1',
            ]);

            // Find the product
            $product = Product::find($id);

            if (!$product) {
                return back()->with('flash', [
                    'error' => 'Product not found.',
                ]);
            }

            // Find or create the cart
            $cart_user_id = Auth::id();

            // Find or create cart with session_id and user_id
            $cart = Cart::firstOrCreate(
                ['user_id' => $cart_user_id]
            );

            // If the cart already exists but has no user_id, update it
            if (!$cart->user_id) {
                $cart->update(['user_id' => $cart_user_id]);
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

            return back()->with('flash', [
                'success' => "{$request->quantity} x {$product->name} added to cart successfully!",
            ]);
        } else {
            // Validate the request
            $request->validate([
                'quantity' => 'required|integer|min:1',
            ]);

            // Find the product
            $product = Product::find($id);

            if (!$product) {
                return back()->with('flash', [
                    'error' => 'Product not found.',
                ]);
            }

            $sessionId = Session::getId();

            // Find or create the cart
            $cart = Cart::firstOrCreate(['session_id' => $sessionId]);

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

            return back()->with('flash', [
                'success' => "{$request->quantity} x {$product->name} added to cart successfully!",
            ]);
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
}
