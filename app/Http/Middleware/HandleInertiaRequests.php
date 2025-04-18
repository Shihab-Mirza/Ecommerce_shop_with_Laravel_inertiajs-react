<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        try {
            // Fetch categories with subcategories and brands, cached for 1 hour
            $categories = Cache::remember('categories_with_subcategories_brands', 60 * 60, function () {
                return Category::with(['subcategories.brands'])->get();
            });

            Log::info('Categories shared with Inertia', ['count' => $categories->count()]);

            return [
                ...parent::share($request),
                'auth' => [
                    'user' => $request->user(),
                ],
                'categories' => $categories,
            ];
        } catch (\Exception $e) {
            Log::error('Error sharing categories:', ['message' => $e->getMessage()]);
            return [
                ...parent::share($request),
                'auth' => [
                    'user' => $request->user(),
                ],
                'categories' => [],
            ];
        }
    }
}
