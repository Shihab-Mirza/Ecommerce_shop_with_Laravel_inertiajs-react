<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Cart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
     return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $sessionId = Session::getId();
        // Capture the guestCart from updateGuestCartToUserCart
        $guestCart = $this->updateGuestCartToUserCart($sessionId);
        $request->authenticate();
        $request->session()->regenerate();
        $user = Auth::user();
        $userid = Auth::id();
        // Pass the guestCart to updateuseridGuestCartToUserCart
        $this->updateuseridGuestCartToUserCart($userid, $guestCart);

        // Check the user's type and redirect accordingly
        if ($user->usertype == 'admin') {
            return redirect()->intended(route('dashboard', absolute: false));
        } else {
            return redirect()->route('home');
        }
    }

    /**
     * Update guest cart (session-based) to authenticated user's cart.
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
        // Check if guestCart exists
        if ($guestCart) {
            // Update the guest cart: set session_id to null and assign user_id
            Cart::where('id', $guestCart['id'])->update([
                'session_id' => null,
                'user_id' => $userid,
            ]);
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
