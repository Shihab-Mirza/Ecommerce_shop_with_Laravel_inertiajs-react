<?php

namespace App\Http\Controllers;

use App\Models\Homepage;
use App\Models\Cart;
use App\Models\Order;
use App\Models\Orderitem;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use App\Models\Brand;
use App\Models\Offer;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{
    public function index()
    {
        $images = Homepage::all()->map(function ($image) {
            return [
                'id' => $image->id,
                'image' => $image->image_path ? asset('storage/' . $image->image_path) : asset('images/placeholder.jpg'),
            ];
        })->toArray();

        // Fetch categories with subcategories, brands, and icon details
        $categories = Category::with(['subcategories.brands'])
            ->select('id', 'name', 'icon', 'show_category_icon')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'icon' => $category->icon,
                    'show_category_icon' => $category->show_category_icon,
                    'subcategories' => $category->subcategories->map(function ($subcategory) {
                        return [
                            'id' => $subcategory->id,
                            'name' => $subcategory->name,
                            'brands' => $subcategory->brands->map(function ($brand) {
                                return [
                                    'id' => $brand->id,
                                    'name' => $brand->name,
                                ];
                            })->toArray(),
                        ];
                    })->toArray(),
                ];
            })->toArray();

        // Fetch featured products with offer details and image
        $featuredProducts = Product::where('is_featured', 'yes')
            ->with('offer')
            ->select('id', 'name', 'price', 'is_offered_product', 'image')
            ->take(25)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'is_offered_product' => $product->is_offered_product,
                    'offer_price' => $product->offer && $product->is_offered_product === 'yes' ? $product->offer->offer_price : null,
                    'discount_value' => $product->offer && $product->is_offered_product === 'yes' ? $product->offer->discount_value : null,
                    'image' => $product->image ? asset('storage/' . $product->image) : asset('images/placeholder.jpg'),
                ];
            })->toArray();

        // Fetch special offer products with offer details and image
        $specialOfferProducts = Product::where('is_special_offer', 'yes')
            ->with('offer')
            ->select('id', 'name', 'price', 'is_special_offer', 'image')
            ->take(25)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'is_special_offer' => $product->is_special_offer,
                    'offer_price' => $product->offer && $product->is_special_offer === 'yes' ? $product->offer->offer_price : null,
                    'discount_value' => $product->offer && $product->is_special_offer === 'yes' ? $product->offer->discount_value : null,
                    'image' => $product->image ? asset('storage/' . $product->image) : asset('images/placeholder.jpg'),
                ];
            })->toArray();

        // Fetch new arrival products with offer details and image
        $newArrivalProducts = Product::where('is_featured', 'no')
            ->where('is_special_offer', 'no')
            ->with('offer')
            ->select('id', 'name', 'price', 'is_offered_product', 'image')
            ->orderBy('id', 'desc')
            ->take(25)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'is_offered_product' => $product->is_offered_product,
                    'offer_price' => $product->offer && $product->is_offered_product === 'yes' ? $product->offer->offer_price : null,
                    'image' => $product->image ? asset('storage/' . $product->image) : asset('images/placeholder.jpg'),
                ];
            })->toArray();

        return Inertia::render('Landing/Home', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'images' => $images,
            'category' => $categories,
            'featuredProducts' => $featuredProducts,
            'specialOfferProducts' => $specialOfferProducts,
            'newArrivalProducts' => $newArrivalProducts,
        ]);
    }

    public function index_category()
    {
        $categories = Category::with(['subcategories.brands'])->get();

        return Inertia::render('Landing/ShowAllCategory', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'categories' => $categories,
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->query('query');

        $products = Product::query()
            ->with(['category', 'subcategory', 'brand', 'offer'])
            ->where('name', 'LIKE', '%' . $query . '%')
            ->orWhere('description', 'LIKE', '%' . $query . '%')
            ->paginate(30)
            ->appends(['query' => $query]);

        $categories = Category::with(['subcategories.brands'])->get();

        return Inertia::render('Landing/SearchResults', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'products' => $products,
            'query' => $query,
            'categories' => $categories,
        ]);
    }

    public function byCategory(Request $request, $id)
    {
        // Retrieve query parameters for filters
        $minPrice = $request->query('minPrice');
        $maxPrice = $request->query('maxPrice');
        $inStock = $request->query('inStock');
        $offered = $request->query('offered');
        $sort = $request->query('sort'); // New sort parameter

        // Validate price inputs
        if ($minPrice !== null && (!is_numeric($minPrice) || $minPrice < 0)) {
            return redirect()->back()->withErrors(['minPrice' => 'Minimum price must be a non-negative number.']);
        }
        if ($maxPrice !== null && (!is_numeric($maxPrice) || $maxPrice < 0)) {
            return redirect()->back()->withErrors(['maxPrice' => 'Maximum price must be a non-negative number.']);
        }
        // Validate sort input
        if ($sort !== null && !in_array($sort, ['high-to-low', 'low-to-high'])) {
            return redirect()->back()->withErrors(['sort' => 'Invalid sort option.']);
        }

        // Build the query for products in the specified category
        $query = Product::query()->where('category_id', $id)
            ->with(['category', 'subcategory', 'brand', 'offer']);

        // Apply price filters
        if ($minPrice !== null) {
            $query->where(function ($q) use ($minPrice) {
                $q->where(function ($subQuery) use ($minPrice) {
                    $subQuery->where('is_offered_product', 'yes')
                             ->whereHas('offer', function ($offerQuery) use ($minPrice) {
                                 $offerQuery->where('offer_price', '>=', $minPrice);
                             });
                })
                ->orWhere(function ($subQuery) use ($minPrice) {
                    $subQuery->where('is_offered_product', '!=', 'yes')
                             ->where('price', '>=', $minPrice);
                })
                ->orWhere(function ($subQuery) use ($minPrice) {
                    $subQuery->whereDoesntHave('offer')
                             ->where('price', '>=', $minPrice);
                });
            });
        }

        if ($maxPrice !== null) {
            $query->where(function ($q) use ($maxPrice) {
                $q->where(function ($subQuery) use ($maxPrice) {
                    $subQuery->where('is_offered_product', 'yes')
                             ->whereHas('offer', function ($offerQuery) use ($maxPrice) {
                                 $offerQuery->where('offer_price', '<=', $maxPrice);
                             });
                })
                ->orWhere(function ($subQuery) use ($maxPrice) {
                    $subQuery->where('is_offered_product', '!=', 'yes')
                             ->where('price', '<=', $maxPrice);
                })
                ->orWhere(function ($subQuery) use ($maxPrice) {
                    $subQuery->whereDoesntHave('offer')
                             ->where('price', '<=', $maxPrice);
                });
            });
        }

        // Apply inStock filter
        if ($inStock) {
            $query->where('quantity', '>', 0);
        }

        // Apply offered filter
        if ($offered) {
            $query->where('is_offered_product', 'yes');
        }

        // Apply sorting with LEFT JOIN
        if ($sort) {
            $query->leftJoin('offers', 'products.id', '=', 'offers.product_id')
                  ->orderByRaw("
                      CASE
                          WHEN products.is_offered_product = 'yes' AND offers.offer_id IS NOT NULL
                          THEN offers.offer_price
                          ELSE products.price
                      END " . ($sort === 'high-to-low' ? 'DESC' : 'ASC')
                  );
        }

        // Paginate the results
        $products = $query->paginate(20)->appends($request->query());

        // Fetch category and categories for navigation
        $category = Category::findOrFail($id);
        $categories = Category::with(['subcategories.brands'])->get();

        // Return Inertia response
        return Inertia::render('Landing/ShowProductOfCategory', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'title' => $category->name,
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'minPrice' => $minPrice ?? '',
                'maxPrice' => $maxPrice ?? '',
                'inStock' => $inStock ? true : false,
                'offered' => $offered ? true : false,
                'sort' => $sort ?? '',
                'category_id' => $id,
                'subcategory_id' => '',
                'brand_id' => '',
            ],
        ]);
    }

    public function bySubcategory(Request $request, $id)
    {
        // Retrieve query parameters for filters
        $minPrice = $request->query('minPrice');
        $maxPrice = $request->query('maxPrice');
        $inStock = $request->query('inStock');
        $offered = $request->query('offered');
        $sort = $request->query('sort'); // New sort parameter

        // Validate price inputs
        if ($minPrice !== null && (!is_numeric($minPrice) || $minPrice < 0)) {
            return redirect()->back()->withErrors(['minPrice' => 'Minimum price must be a non-negative number.']);
        }
        if ($maxPrice !== null && (!is_numeric($maxPrice) || $maxPrice < 0)) {
            return redirect()->back()->withErrors(['maxPrice' => 'Maximum price must be a non-negative number.']);
        }
        // Validate sort input
        if ($sort !== null && !in_array($sort, ['high-to-low', 'low-to-high'])) {
            return redirect()->back()->withErrors(['sort' => 'Invalid sort option.']);
        }

        // Build the query for products in the specified subcategory
        $query = Product::query()->where('subcategory_id', $id)
            ->with(['category', 'subcategory', 'brand', 'offer']);

        // Apply price filters
        if ($minPrice !== null) {
            $query->where(function ($q) use ($minPrice) {
                $q->where(function ($subQuery) use ($minPrice) {
                    $subQuery->where('is_offered_product', 'yes')
                             ->whereHas('offer', function ($offerQuery) use ($minPrice) {
                                 $offerQuery->where('offer_price', '>=', $minPrice);
                             });
                })
                ->orWhere(function ($subQuery) use ($minPrice) {
                    $subQuery->where('is_offered_product', '!=', 'yes')
                             ->where('price', '>=', $minPrice);
                })
                ->orWhere(function ($subQuery) use ($minPrice) {
                    $subQuery->whereDoesntHave('offer')
                             ->where('price', '>=', $minPrice);
                });
            });
        }

        if ($maxPrice !== null) {
            $query->where(function ($q) use ($maxPrice) {
                $q->where(function ($subQuery) use ($maxPrice) {
                    $subQuery->where('is_offered_product', 'yes')
                             ->whereHas('offer', function ($offerQuery) use ($maxPrice) {
                                 $offerQuery->where('offer_price', '<=', $maxPrice);
                             });
                })
                ->orWhere(function ($subQuery) use ($maxPrice) {
                    $subQuery->where('is_offered_product', '!=', 'yes')
                             ->where('price', '<=', $maxPrice);
                })
                ->orWhere(function ($subQuery) use ($maxPrice) {
                    $subQuery->whereDoesntHave('offer')
                             ->where('price', '<=', $maxPrice);
                });
            });
        }

        // Apply inStock filter
        if ($inStock) {
            $query->where('quantity', '>', 0);
        }

        // Apply offered filter
        if ($offered) {
            $query->where('is_offered_product', 'yes');
        }

        // Apply sorting with LEFT JOIN
        if ($sort) {
            $query->leftJoin('offers', 'products.id', '=', 'offers.product_id')
                  ->orderByRaw("
                      CASE
                          WHEN products.is_offered_product = 'yes' AND offers.offer_id IS NOT NULL
                          THEN offers.offer_price
                          ELSE products.price
                      END " . ($sort === 'high-to-low' ? 'DESC' : 'ASC')
                  );
        }

        // Paginate the results
        $products = $query->paginate(20)->appends($request->query());

        // Fetch subcategory and categories for navigation
        $subcategory = Subcategory::findOrFail($id);
        $categories = Category::with(['subcategories.brands'])->get();

        // Return Inertia response
        return Inertia::render('Landing/ShowProductOfCategory', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'title' => $subcategory->sub_category_name,
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'minPrice' => $minPrice ?? '',
                'maxPrice' => $maxPrice ?? '',
                'inStock' => $inStock ? true : false,
                'offered' => $offered ? true : false,
                'sort' => $sort ?? '',
                'category_id' => '',
                'subcategory_id' => $id,
                'brand_id' => '',
            ],
        ]);
    }

    public function byBrand(Request $request, $id)
    {
        // Retrieve query parameters for filters
        $minPrice = $request->query('minPrice');
        $maxPrice = $request->query('maxPrice');
        $inStock = $request->query('inStock');
        $offered = $request->query('offered');
        $sort = $request->query('sort'); // New sort parameter

        // Validate price inputs
        if ($minPrice !== null && (!is_numeric($minPrice) || $minPrice < 0)) {
            return redirect()->back()->withErrors(['minPrice' => 'Minimum price must be a non-negative number.']);
        }
        if ($maxPrice !== null && (!is_numeric($maxPrice) || $maxPrice < 0)) {
            return redirect()->back()->withErrors(['maxPrice' => 'Maximum price must be a non-negative number.']);
        }
        // Validate sort input
        if ($sort !== null && !in_array($sort, ['high-to-low', 'low-to-high'])) {
            return redirect()->back()->withErrors(['sort' => 'Invalid sort option.']);
        }

        // Build the query for products in the specified brand
        $query = Product::query()->where('brand_id', $id)
            ->with(['category', 'subcategory', 'brand', 'offer']);

        // Apply price filters
        if ($minPrice !== null) {
            $query->where(function ($q) use ($minPrice) {
                $q->where(function ($subQuery) use ($minPrice) {
                    $subQuery->where('is_offered_product', 'yes')
                             ->whereHas('offer', function ($offerQuery) use ($minPrice) {
                                 $offerQuery->where('offer_price', '>=', $minPrice);
                             });
                })
                ->orWhere(function ($subQuery) use ($minPrice) {
                    $subQuery->where('is_offered_product', '!=', 'yes')
                             ->where('price', '>=', $minPrice);
                })
                ->orWhere(function ($subQuery) use ($minPrice) {
                    $subQuery->whereDoesntHave('offer')
                             ->where('price', '>=', $minPrice);
                });
            });
        }

        if ($maxPrice !== null) {
            $query->where(function ($q) use ($maxPrice) {
                $q->where(function ($subQuery) use ($maxPrice) {
                    $subQuery->where('is_offered_product', 'yes')
                             ->whereHas('offer', function ($offerQuery) use ($maxPrice) {
                                 $offerQuery->where('offer_price', '<=', $maxPrice);
                             });
                })
                ->orWhere(function ($subQuery) use ($maxPrice) {
                    $subQuery->where('is_offered_product', '!=', 'yes')
                             ->where('price', '<=', $maxPrice);
                })
                ->orWhere(function ($subQuery) use ($maxPrice) {
                    $subQuery->whereDoesntHave('offer')
                             ->where('price', '<=', $maxPrice);
                });
            });
        }

        // Apply inStock filter
        if ($inStock) {
            $query->where('quantity', '>', 0);
        }

        // Apply offered filter
        if ($offered) {
            $query->where('is_offered_product', 'yes');
        }

        // Apply sorting with LEFT JOIN
        if ($sort) {
            $query->leftJoin('offers', 'products.id', '=', 'offers.product_id')
                  ->orderByRaw("
                      CASE
                          WHEN products.is_offered_product = 'yes' AND offers.offer_id IS NOT NULL
                          THEN offers.offer_price
                          ELSE products.price
                      END " . ($sort === 'high-to-low' ? 'DESC' : 'ASC')
                  );
        }

        // Paginate the results
        $products = $query->paginate(20)->appends($request->query());

        // Fetch brand and categories for navigation
        $brand = Brand::findOrFail($id);
        $categories = Category::with(['subcategories.brands'])->get();

        // Return Inertia response
        return Inertia::render('Landing/ShowProductOfCategory', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'title' => $brand->brand_name,
            'products' => $products,
            'categories' => $categories,
            'filters' => [
                'minPrice' => $minPrice ?? '',
                'maxPrice' => $maxPrice ?? '',
                'inStock' => $inStock ? true : false,
                'offered' => $offered ? true : false,
                'sort' => $sort ?? '',
                'category_id' => '',
                'subcategory_id' => '',
                'brand_id' => $id,
            ],
        ]);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'subcategory', 'brand', 'offer', 'reviews'])->findOrFail($id);
        $categories = Category::with(['subcategories.brands'])->get();

        return Inertia::render('Landing/ShowProduct', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'product' => $product,
            'categories' => $categories,
        ]);
    }

    public function view_full_Product($id)
    {
        $product = Product::with([
            'category:id,name',
            'subcategory:id,category_id,sub_category_name',
            'brand:id,brand_name',
            'offer',
            'reviews' => function ($query) {
                $query->with('user:id,name')->orderBy('created_at', 'desc')->take(2);
            }
        ])->findOrFail($id);

        return Inertia::render('Landing/ShowProduct', [
            'product' => $product,
        ]);
    }

    public function searchProducts(Request $request)
    {
        $query = $request->input('query');

        // Validate the search query
        if (empty($query) || strlen($query) < 2) {
            return response()->json([]);
        }

        // Search products by name (case-insensitive, partial match)
        $products = Product::where('name', 'LIKE', '%' . $query . '%')
            ->select('id', 'name') // Select only necessary fields
            ->take(10) // Limit to 10 suggestions
            ->get();

        // Format the response
        $results = $products->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'url' => route('products.show', $product->id), // Generate URL for the product
            ];
        });

        return response()->json($results);
    }

    public function view_order_history_index()
    {
        // Verify authentication
        if (!Auth::check()) {
            return Inertia::render('Landing/ViewOrderHistory', [
                'orders' => [],
                'error' => 'User not authenticated',
                'auth' => null,
                'categories' => [], // Assuming categories are needed for Navbar
            ]);
        }

        // Fetch orders with related items and products
        $orders = Order::with(['items.product' => function ($query) {
            $query->select('id', 'name', 'image'); // Select necessary fields
        }])
            ->where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Landing/ViewOrderHistory', [
            'orders' => $orders,
        ]);
    }
}
