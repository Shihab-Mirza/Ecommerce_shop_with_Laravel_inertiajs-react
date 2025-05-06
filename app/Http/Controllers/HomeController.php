<?php

namespace App\Http\Controllers;

use App\Models\Homepage;
use App\Models\Cart;
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

class HomeController extends Controller
{

    public function index()
    {
        // Fetch slideshow images
        $images = Homepage::all()->map(function ($image) {
            return [
                'id' => $image->id,
                'url' => asset('storage/' . $image->image_path),
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
            ->with(['offer' => function ($query) {
                $query->where('is_active', 'yes');
            }])
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
            ->with(['offer' => function ($query) {
                $query->where('is_active', 'yes');
            }])
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
            ->with(['offer' => function ($query) {
                $query->where('is_active', 'yes');
            }])
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

    public function showProducts(Request $request)
    {
        $categoryId = $request->query('category_id');
        $subcategoryId = $request->query('subcategory_id');
        $brandId = $request->query('brand_id');
        $minPrice = $request->query('minPrice');
        $maxPrice = $request->query('maxPrice');
        $inStock = $request->query('inStock');
        $offered = $request->query('offered');

        $query = Product::query()->with(['category', 'subcategory', 'brand', 'offer']);

        if ($categoryId && is_numeric($categoryId)) {
            $query->where('category_id', $categoryId);
        }

        if ($subcategoryId && is_numeric($subcategoryId)) {
            $query->where('subcategory_id', $subcategoryId);
        }

        if ($brandId && is_numeric($brandId)) {
            $query->where('brand_id', $brandId);
        }

        if ($minPrice && is_numeric($minPrice)) {
            $query->where('price', '>=', $minPrice);
        }

        if ($maxPrice && is_numeric($maxPrice)) {
            $query->where('price', '<=', $maxPrice);
        }

        if ($inStock) {
            $query->where('quantity', '>', 0);
        }

        if ($offered) {
            $query->where('is_offered_product', 'yes')
                  ->whereHas('offer', function ($q) {
                      $q->where('start_date', '<=', Carbon::now())
                        ->where('end_date', '>=', Carbon::now());
                  });
        }

        $title = 'Products';
        if ($categoryId && is_numeric($categoryId)) {
            $category = Category::findOrFail($categoryId);
            $title = $category->name;
        } elseif ($subcategoryId && is_numeric($subcategoryId)) {
            $subcategory = Subcategory::findOrFail($subcategoryId);
            $title = $subcategory->sub_category_name;
        } elseif ($brandId && is_numeric($brandId)) {
            $brand = Brand::findOrFail($brandId);
            $title = $brand->brand_name;
        }

        $products = $query->paginate(20);
        $categories = Category::with(['subcategories.brands'])->get();

        return Inertia::render('Landing/ShowProductOfCategory', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'title' => $title,
            'categories' => $categories,
            'products' => $products,
        ]);
    }

    public function byCategory($id)
    {
        $products = Product::where('category_id', $id)
            ->with(['category', 'subcategory', 'brand', 'offer'])
            ->paginate(20);
        $category = Category::findOrFail($id);
        $categories = Category::with(['subcategories.brands'])->get();

        return Inertia::render('Landing/ShowProductOfCategory', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'title' => $category->name,
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function bySubcategory($id)
    {
        $products = Product::where('subcategory_id', $id)
            ->with(['category', 'subcategory', 'brand', 'offer'])
            ->paginate(20);
        $subcategory = Subcategory::findOrFail($id);
        $categories = Category::with(['subcategories.brands'])->get();

        return Inertia::render('Landing/ShowProductOfCategory', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'title' => $subcategory->sub_category_name,
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function byBrand($id)
    {
        $products = Product::where('brand_id', $id)
            ->with(['category', 'subcategory', 'brand', 'offer'])
            ->paginate(20);
        $brand = Brand::findOrFail($id);
        $categories = Category::with(['subcategories.brands'])->get();

        return Inertia::render('Landing/ShowProductOfCategory', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'title' => $brand->brand_name,
            'products' => $products,
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
            'reviews.user:id,name'
        ])->findOrFail($id);

        return Inertia::render('Landing/ShowProduct', [
            'product' => $product,
            'flash' => session('flash'),
        ]);
    }












}
