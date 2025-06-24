<?php

namespace App\Http\Controllers;

use App\Models\Userpoint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserPointController extends Controller
{
    public function index(Request $request)
    {
        $perPage = 20;
        $search = $request->input('search', '');

        $userPointsQuery = Userpoint::with('user')
            ->when($search, function ($query, $search) {
                return $query->whereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            });

        $userPoints = $userPointsQuery->paginate($perPage);
        if ($search) {
            $userPoints->appends(['search' => $search]);
        }

        return Inertia::render('AdminDashboard/ViewUserPoint', [
            'userPoints' => $userPoints,
            'search' => $search,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }
}
