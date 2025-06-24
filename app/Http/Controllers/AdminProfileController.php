<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminProfileController extends Controller
{
    public function profile()
    {
        $user = Auth::user();
        return Inertia::render('AdminDashboard/AdminProfile', [
            'name' => $user->name,
            'email' => $user->email,
              'auth' => [
                'user' => $user
            ],
        ]);
    }


}
