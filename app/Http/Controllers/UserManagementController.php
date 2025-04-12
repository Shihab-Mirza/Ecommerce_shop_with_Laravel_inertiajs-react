<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class UserManagementController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 20;
        $search = $request->input('search', '');

        $usersQuery = User::when($search, function ($query, $search) {
            return $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        });

        $users = $usersQuery->paginate($perPage);
        if ($search) {
            $users->appends(['search' => $search]);
        }

        return Inertia::render('AdminDashboard/UserManagement', [
            'users' => $users,
            'search' => $search,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    public function updateUserType(Request $request, $id)
    {
        $request->validate([
            'usertype' => 'required|in:admin,user',
        ]);

        $user = User::findOrFail($id);

        // Prevent changing own usertype
        if ($user->id === Auth::id() && $user->usertype === 'admin' && $request->usertype !== 'admin') {
            return redirect()->back()->with('error', 'You cannot demote yourself from admin.');
        }

        $user->update([
            'usertype' => $request->usertype,
        ]);

        return redirect()->back()->with('success', 'User type updated successfully!');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting self or other admins
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', 'You cannot delete yourself.');
        }
        if ($user->usertype === 'admin' && Auth::user()->usertype !== 'admin') {
            return redirect()->back()->with('error', 'You cannot delete an admin user.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully!');
    }
}
