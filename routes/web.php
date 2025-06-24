<?php
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\ReportController;

use App\Http\Controllers\OrderDeliveryController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\UserPointController;
use App\Http\Controllers\UserPointRuleController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\AdminProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\SslCommerzPaymentController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CategoryIconController;
use App\Http\Controllers\SubcategoryController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\FooterController;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Route;




Route::get('/', [HomeController::class, 'index'])->name('home');
Route::middleware(['auth'])->group(function () {
    Route::get('/order-history', [HomeController::class, 'view_order_history_index'])->name('order.history');
});

Route::get('/checkout2/{cartId}/{checkoutToken}', [SslCommerzPaymentController::class, 'exampleHostedCheckout']);
Route::post('/confirm_order', [SslCommerzPaymentController::class, 'order_confirm']);
Route::get('/order/{order_id}/{order_token}', [SslCommerzPaymentController::class, 'showOrderConfirm'])->name('show_order_confirm');
Route::post('/pay/{order_id}/{order_token}', [SslCommerzPaymentController::class, 'index']);
Route::post('/pay-via-ajax', [SslCommerzPaymentController::class, 'payViaAjax']);

Route::post('/success', [SslCommerzPaymentController::class, 'success']); // Matches success_url
Route::post('/fail', [SslCommerzPaymentController::class, 'fail']);       // Matches failed_url
Route::post('/cancel', [SslCommerzPaymentController::class, 'cancel']);   // Matches cancel_url
Route::post('/ipn', [SslCommerzPaymentController::class, 'ipn']);


Route::get('/search', [HomeController::class, 'search'])->name('search');
Route::get('/search-products', [HomeController::class, 'searchProducts'])->name('products.search');
Route::post('/cart/add/{id}', [CartController::class, 'add'])->name('cart.add')->middleware('product_redirect');


Route::post('/cart/update', [CartController::class, 'update'])->name('cart.update');
Route::post('/cart/remove', [CartController::class, 'remove'])->name('cart.remove');

Route::get('/about', [AdminDashboardController::class, 'about'])->name('about');


Route::get('/show_all_category', [HomeController::class, 'index_category']);

Route::get('/products/category/{id}', [HomeController::class, 'byCategory'])->name('products.by.category');
Route::get('/products/subcategory/{id}', [HomeController::class, 'bySubcategory'])->name('products.by.subcategory');
Route::get('/products/brand/{id}', [HomeController::class, 'byBrand'])->name('products.by.brand');

Route::get('/product/{id}', [HomeController::class, 'view_full_Product'])->name('products.show');
Route::post('/products/{productId}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
Route::post('/wishlist/add/{product}', [WishlistController::class, 'add'])->name('wishlist.add');
Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist.index');
Route::delete('/wishlist/{id}', [WishlistController::class, 'remove'])->name('wishlist.remove');



Route::middleware(['auth', 'delivery'])->group(function () {

Route::get('/view_pending_orders', [DeliveryController::class, 'index'])->name('pending.order');
Route::post('/orders/{order_id}/generate-otp', [DeliveryController::class, 'generateOtp'])->name('orders.generate-otp');
Route::post('/orders/{order_id}/verify-otp', [DeliveryController::class, 'verifyOtp'])->name('orders.verify-otp');
Route::get('/view_completed_orders', [DeliveryController::class, 'view_completed_order'])->name('completed.order');



});

Route::get('/order_delivery_home', [DeliveryController::class,'view_delivery_homepage'])->middleware(['auth', 'delivery'])->name('delivery.homepage');

Route::get('/dashboard', [AdminDashboardController::class,'view_admin_dashboard'])->middleware(['auth', 'admin'])->name('dashboard');



Route::middleware(['auth', 'admin'])->group(function () {

Route::get('/view_user_points', [UserPointController::class, 'index']);

Route::get('/reports/pdf', [ReportController::class, 'generatePDF'])->name('reports.pdf');

Route::get('/view_reports', [ReportController::class, 'index']);



Route::get('/view_user_points', [UserPointController::class, 'index']);
Route::get('/add_point_discounts', [UserPointRuleController::class, 'index'])->name('point-discounts.index');
Route::post('/point-discounts/earn', [UserPointRuleController::class, 'storeEarnRule'])->name('point-discounts.store.earn');
Route::post('/point-discounts/redeem', [UserPointRuleController::class, 'storeRedeemRule'])->name('point-discounts.store.redeem');
Route::put('/point-discounts/{id}', [UserPointRuleController::class, 'update'])->name('point-discounts.update');
Route::delete('/point-discounts/{id}', [UserPointRuleController::class, 'destroy'])->name('point-discounts.destroy');



   Route::get('/add_vouchers', [VoucherController::class, 'index'])->name('vouchers.index');
    Route::post('/vouchers', [VoucherController::class, 'store'])->name('vouchers.store');
    Route::put('/vouchers/{voucher}', [VoucherController::class, 'update'])->name('vouchers.update');
    Route::delete('/vouchers/{voucher}', [VoucherController::class, 'destroy'])->name('vouchers.destroy');
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
Route::put('/update_product/{id}', [ProductController::class, 'update'])->name('products.update');
Route::delete('/products/{id}', [ProductController::class, 'destroy'])->name('products.destroy');


Route::get('/add_featured_product', [AdminDashboardController::class, 'create_featured_product']);
Route::post('/add_new_featured_product', [AdminDashboardController::class, 'store']);
Route::get('/view_featured_products', [AdminDashboardController::class, 'feature_product_index'])->name('feature_product.index');
Route::get('/feature_products/{id}/edit', [AdminDashboardController::class, 'feature_product_edit'])->name('feature_product.edit');
Route::put('/feature_products/{id}', [AdminDashboardController::class, 'feature_product_update'])->name('feature_product.update');
Route::delete('/feature_products/{id}', [ProductController::class, 'destroy'])->name('feature_product.destroy');







Route::get('/add_image_slideshow', [AdminDashboardController::class, 'index'])->name('add_image_slideshow');
Route::post('/homepages', [AdminDashboardController::class, 'storehomepageimage'])->name('homepages.store');
Route::put('/homepages/{id}', [AdminDashboardController::class, 'update'])->name('homepages.update');
Route::delete('/homepages/{id}', [AdminDashboardController::class, 'destroy'])->name('homepages.destroy');


 Route::get('/add_social', [FooterController::class, 'index'])->name('add_social');
    Route::post('/footer', [FooterController::class, 'store'])->name('footer.store');
    Route::put('/footer/{footer}', [FooterController::class, 'update'])->name('footer.update');
    Route::delete('/footer/{footer}', [FooterController::class, 'destroy'])->name('footer.destroy');

Route::get('/add_special_offer_product', [AdminDashboardController::class, 'create_special_offer_product']);
Route::post('/add_new_special_offer_product', [AdminDashboardController::class, 'special_offer_store']);
Route::get('/view_special_offer_products', [AdminDashboardController::class, 'special_offer_index']);
Route::get('/special_offer_products/{id}/edit', [AdminDashboardController::class, 'special_offer_edit']);
Route::put('/special_offer_products/{id}', [AdminDashboardController::class, 'special_offer_update']);
Route::delete('/special_offer_products/{id}', [ProductController::class, 'destroy']);


Route::get('/manage_special_offer', [AdminDashboardController::class, 'manage_special_offer_index'])->name('special_offers.index');
Route::post('/manage_special_offer/save', [AdminDashboardController::class, 'manage_special_offer_save'])->name('special_offers.save');




Route::get('/assign_role', [UserManagementController::class, 'index'])->name('users.index');
Route::post('/assign_role/{id}/usertype', [UserManagementController::class, 'updateUserType'])->name('users.updateUserType');
Route::delete('/assign_role/{id}', [UserManagementController::class, 'destroy'])->name('users.destroy');




Route::get('/add_offer', [OfferController::class, 'index'])->name('offers.index');
Route::post('/offers/save', [OfferController::class, 'save'])->name('offers.save');



Route::get('/view_orders', [OrderController::class, 'index'])->name('orders.index');
Route::get('/orders/{orderId}/items', [OrderController::class, 'showOrderItems'])->name('orders.items');
Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel'])->name('orders.cancel');
Route::get('/orders/{order}/invoice', [OrderController::class, 'generateInvoice'])->name('orders.invoice');
Route::get('/view_delivered_orders', [OrderDeliveryController::class, 'index']);
Route::get('/delivery_orders/{orderId}/items', [OrderDeliveryController::class, 'showOrderItems']);;


Route::middleware(['auth'])->group(function () {
    Route::get('/manage_category_icons', [CategoryIconController::class, 'manageIcons'])->name('manage_category_icons');
    Route::put('/categoriesIcon/{id}', [CategoryIconController::class, 'update'])->name('categories.update');
});



});
Route::middleware(['auth'])->group(function () {
    Route::get('/admin_profile', [AdminProfileController::class, 'profile'])->name('admin.profile');

});
Route::middleware(['auth'])->group(function () {
    Route::get('/profile', [UserProfileController::class, 'index'])->name('profile');

    Route::patch('/profile', [UserProfileController::class, 'update'])->name('profile.update');
    Route::post('/password', [UserProfileController::class, 'Passwordupdate'])->name('password.update');
});;

require __DIR__.'/auth.php';
