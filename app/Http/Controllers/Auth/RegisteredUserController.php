<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Userpoint;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Models\Cart;
use App\Models\Cartitem;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $sessionId = Session::getId();
        $guestCart = $this->updateGuestCartToUserCart($sessionId);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Create a Userpoint record for the new user with default user_point of 0
        Userpoint::create([
            'user_id' => $user->id,
            'user_point' => 0,
        ]);

        event(new Registered($user));

        Auth::login($user);
        $userid = Auth::id();
        $this->updateuseridGuestCartToUserCart($userid, $guestCart);

        return redirect(route('home', absolute: false));
    }

    /**
     * Update guest cart to user cart by clearing session_id.
     */
    protected function updateGuestCartToUserCart($sessionId): ?array
    {
        // Find the guest cart based on session_id
        $guestCart = Cart::where('session_id', $sessionId)->first();

        if ($guestCart) {
            // Update the guest cart: set session_id to null
            Cart::where('session_id', $sessionId)->update([
                'session_id' => null,
            ]);
            return $guestCart->toArray(); // Convert the cart record to array
        }

        return null; // Return null if no guest cart exists
    }

    /**
     * Update user_id for the guest cart.
     */
    protected function updateuseridGuestCartToUserCart($userid, $guestCart): void
    {
    if ($guestCart) {
            // Check if the user already has a cart
            $userCart = Cart::where('user_id', $userid)->first();

            if ($userCart) {
                // Get guest cart items
                $guestCartItems = Cartitem::where('cart_id', $guestCart['id'])->get();

                foreach ($guestCartItems as $guestItem) {
                    // Check if an item with the same product_id exists in the user's cart
                    $existingItem = Cartitem::where('cart_id', $userCart->id)
                        ->where('product_id', $guestItem->product_id)
                        ->first();

                    if ($existingItem) {
                        // Delete the existing item to keep the newer one
                        $existingItem->delete();
                    }

                    // Reassign the guest item to the user's cart
                    $guestItem->update([
                        'cart_id' => $userCart->id,
                    ]);
                }

                // Delete the guest cart
                Cart::where('id', $guestCart['id'])->delete();
            } else {
                // No existing user cart, update the guest cart
                Cart::where('id', $guestCart['id'])->update([
                    'session_id' => null,
                    'user_id' => $userid,
                    'checkout_token' => $guestCart['checkout_token'],
                ]);
            }
        }
}
}
