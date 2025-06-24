<?php

namespace App\Http\Controllers;

use App\Models\Footer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FooterController extends Controller
{
    public function index()
    {
        // Return the first footer entry or an empty object if none exists
        return Inertia::render('AdminDashboard/AddSocialComponent', [
            'footer' => Footer::first() ? [Footer::first()] : [], 
            'errors' => session()->get('errors') ? session()->get('errors')->getBag('default')->getMessages() : [],
            'flash' => session()->get('flash'),
            'auth' => auth()->user(),
        ]);
    }

    public function store(Request $request)
    {
        // Check if a footer entry already exists
        if (Footer::exists()) {
            return redirect()->back()->withErrors(['error' => 'You can not add more than one entry for footer']);
        }

        $validated = $request->validate([
            'facebook_link' => 'nullable',
            'contact_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);

        // Create a new footer entry
        Footer::create($validated);
        $message = 'Footer entry added successfully!';

        return redirect()->back()->with('flash', $message);
    }

    public function update(Request $request, Footer $footer)
    {
        $validated = $request->validate([
            'facebook_link' => 'nullable',
            'contact_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);

        $footer->update($validated);

        return redirect()->back()->with('flash', 'Footer entry updated successfully!');
    }

    public function destroy(Footer $footer)
    {
        $footer->delete();
        return redirect()->back()->with('flash', 'Footer entry deleted successfully!');
    }
}