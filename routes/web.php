<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\HomePageController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubcategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('AdminDashboard/Dashboard', [
        'activeLink' => 'dashboard',
    ]);
})->middleware(['auth', 'verified', 'admin'])->name('dashboard');

Route::middleware(['auth', 'verified', 'admin'])->group(function () {
Route::get('/add_category', [CategoryController::class, 'create']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::put('/categories/{category}', [CategoryController::class, 'update']);
Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);



Route::get('/add_subcategory', [SubcategoryController::class, 'index'])->name('subcategories.index');
Route::post('/subcategories', [SubcategoryController::class, 'store'])->name('subcategories.store');
Route::put('/subcategories/{subcategory}', [SubcategoryController::class, 'update'])->name('subcategories.update');
Route::delete('/subcategories/{subcategory}', [SubcategoryController::class, 'destroy'])->name('subcategories.destroy');


Route::get('/add_brand', [BrandController::class, 'index'])->name('brands.index');
Route::post('/brands', [BrandController::class, 'store'])->name('brands.store');
Route::put('/brands/{brand}', [BrandController::class, 'update'])->name('brands.update');
Route::delete('/brands/{brand}', [BrandController::class, 'destroy'])->name('brands.destroy');





Route::get('/add_product', [ProductController::class, 'create']);
Route::post('/add_new_product', [ProductController::class, 'store'])->name('products.store');
Route::get('/view_all_products', [ProductController::class, 'index'])->name('products.index');

Route::get('/products/{id}/edit', [ProductController::class, 'edit'])->name('products.edit');
Route::put('/products/{id}', [ProductController::class, 'update'])->name('products.update');
Route::delete('/products/{id}', [ProductController::class, 'destroy'])->name('products.destroy');


Route::get('/add_featured_product', [HomePageController::class, 'create_featured_product']);
Route::post('/add_new_product', [HomePageController::class, 'store'])->name('products.store');
Route::get('/view_featured_products', [HomePageController::class, 'feature_product_index'])->name('feature_product.index');
Route::get('/feature_products/{id}/edit', [HomePageController::class, 'feature_product_edit'])->name('feature_product.edit');
Route::put('/feature_products/{id}', [HomePageController::class, 'feature_product_update'])->name('feature_product.update');
Route::delete('/feature_products/{id}', [HomePageController::class, 'feature_product_destroy'])->name('feature_product.destroy');







Route::get('/add_image_slideshow', [HomepageController::class, 'index'])->name('add_image_slideshow');
Route::post('/homepages', [HomepageController::class, 'storehomepageimage'])->name('homepages.store');
Route::put('/homepages/{id}', [HomepageController::class, 'update'])->name('homepages.update');
Route::delete('/homepages/{id}', [HomepageController::class, 'destroy'])->name('homepages.destroy');




Route::get('/add_special_offer_product', [HomePageController::class, 'create_special_offer_product']);
Route::post('/add_new_special_offer_product', [HomePageController::class, 'special_offer_store']);
Route::get('/view_special_offer_products', [HomePageController::class, 'special_offer_index']);
Route::get('/special_offer_products/{id}/edit', [HomePageController::class, 'special_offer_edit']);
Route::put('/special_offer_products/{id}', [HomePageController::class, 'special_offer_update']);
Route::delete('/special_offer_products/{id}', [HomePageController::class, 'special_offer_destroy']);


Route::get('/manage_special_offer', [HomePageController::class, 'manage_special_offer_index'])->name('special_offers.index');
Route::post('/manage_special_offer/save', [HomePageController::class, 'manage_special_offer_save'])->name('special_offers.save');




Route::get('/assign_role', [UserManagementController::class, 'index'])->name('users.index');
Route::post('/assign_role/{id}/usertype', [UserManagementController::class, 'updateUserType'])->name('users.updateUserType');
Route::delete('/assign_role/{id}', [UserManagementController::class, 'destroy'])->name('users.destroy');




Route::get('/add_offer', [OfferController::class, 'index'])->name('offers.index');
Route::post('/offers/save', [OfferController::class, 'save'])->name('offers.save');

});





Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
