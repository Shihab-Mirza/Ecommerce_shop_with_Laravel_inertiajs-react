<?php

namespace App\Http\Controllers;

use App\Models\Homepage;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $images = Homepage::all()->map(function ($image) {
            return [
                'id' => $image->id,
                'url' => asset('storage/' . $image->image_path),
            ];
        });

        return Inertia::render('Landing/Home', [
           
            'images' => $images,
        ]);
    }
}
