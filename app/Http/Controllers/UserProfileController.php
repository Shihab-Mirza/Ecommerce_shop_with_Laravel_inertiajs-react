<?php

namespace App\Http\Controllers;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class UserProfileController extends Controller
{

    public function index()
{
    return Inertia::render('Landing/UserProfile', [
        'auth' => [
            'user' => Auth::user()
        ],

    ]);
}public function update(Request $request)
{
    $user = $request->user();

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $user->id,
    ]);

    // Only update email if it has changed
    if ($validated['email'] !== $user->email) {
        $user->email_verified_at = null; // explicitly reset verification
        $user->email = $validated['email'];
    }

    $user->name = $validated['name'];
    $user->save();

    return Redirect::back()->with('message', 'Profile updated successfully.');
}

    public function Passwordupdate(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();
        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return Redirect::back()->with('message', 'Password updated successfully.');
    }
}
