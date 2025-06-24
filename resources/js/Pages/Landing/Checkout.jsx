import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import NavBar from './Navbar';
import Footer from './Footer';
import CartModal from './CartModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { usePage } from '@inertiajs/react';

function Checkout({ auth, categories, cartItems, checkoutToken, cartId, total, userPoints, minimumPointsSpent, flash }) {
    const { props } = usePage();
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    const [applyVoucher, setApplyVoucher] = useState(false);
    const [usePoints, setUsePoints] = useState(false);
    const [pointsToUse, setPointsToUse] = useState('');
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const [cartCount, setCartCount] = useState(props.cartCount || 0);
    const [cartItemsState, setCartItemsState] = useState(cartItems || []);
    const [pendingCheckout, setPendingCheckout] = useState(false);

    const hasEnoughPoints = userPoints >= minimumPointsSpent;

    useEffect(() => {
        setCartItemsState(cartItems || []);
        setCartCount(props.cartCount || 0);
    }, [cartItems, props.cartCount]);

    const toggleCartModal = () => {
        setCartModalOpen((prev) => !prev);
    };

    const openLoginModal = () => {
        // This can be passed to Navbar to trigger login modal if needed
    };

    return (
        <>
            <Head title="Checkout" />
            <NavBar
                auth={auth}
                categories={categories}
                cartCount={cartCount}
                toggleCartModal={toggleCartModal}
                setPendingCheckout={setPendingCheckout}
                cartId={cartId}
                checkoutToken={checkoutToken}
            />
            <main className="bg-gray-50 min-h-screen py-4 px-4 sm:px-6 lg:px-8">
                {/* Floating Cart Icon */}
                <button
                    onClick={toggleCartModal}
                    className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                        {cartCount}
                    </span>
                </button>

                {/* Cart Modal */}
                <CartModal
                    isOpen={cartModalOpen}
                    toggleCartModal={toggleCartModal}
                    cartItems={cartItemsState}
                    cartCount={cartCount}
                    setCartItems={setCartItemsState}
                    setCartCount={setCartCount}
                    auth={auth}
                    cartId={cartId}
                    checkoutToken={checkoutToken}
                    setPendingCheckout={setPendingCheckout}
                    openLoginModal={openLoginModal}
                    isCheckoutPage={true}
                />

                {/* Main Content */}
                <div className="max-w-7xl mx-auto">
                    {/* Flash Messages */}
                    {flash?.error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-400 text-red-600 p-3 rounded-md shadow-sm">
                            <span className="text-xs sm:text-sm">
                                {flash.error === 'Point rules are not configured.'
                                    ? 'Points system is currently unavailable. Please try again later.'
                                    : flash.error}
                            </span>
                        </div>
                    )}

                    {/* Cart Items Section */}
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 mt-4 lg:mt-0">
                        <div className="text-center mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight">
                                Checkout
                            </h2>
                            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                                Securely complete your Order with our streamlined checkout process
                            </p>
                        </div>
                        <h4 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">Your Cart</h4>
                        {cartItems.length === 0 ? (
                            <p className="text-gray-500 text-center py-4 sm:py-6 text-xs sm:text-sm">Your cart is empty.</p>
                        ) : (
                            <div className="space-y-3 sm:space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 py-3 hover:bg-gray-50 rounded-md px-2 sm:px-3"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                                            {item.product_image ? (
                                                <img
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-md flex items-center justify-center">
                                                    <span className="text-xs text-gray-400">No image</span>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h3 className="text-sm sm:text-base font-medium text-gray-800">{item.product_name}</h3>
                                                {item.is_offered_product === 'yes' && item.offer_price ? (
                                                    <div>
                                                        <p className="text-xs text-gray-400 line-through">
                                                            Regular Price: Tk{item.price.toFixed(2)}
                                                        </p>
                                                        <p className="text-xs text-green-600 font-medium">
                                                            Offer Price: Tk{item.offer_price.toFixed(2)}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-500">
                                                        Price: Tk{item.price.toFixed(2)}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm sm:text-base font-medium text-gray-800 mt-2 sm:mt-0">
                                            Tk{item.total_price.toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                                <div className="flex justify-between text-base sm:text-lg font-semibold text-gray-800 mt-3 sm:mt-4">
                                    <span>Total:</span>
                                    <span>Tk{total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Billing & Discounts Section */}
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                        <h4 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">Billing Details</h4>
                        <form action="/confirm_order" method="POST" className="space-y-4 sm:space-y-6">
                            <input type="hidden" name="_token" value={csrfToken} />
                            <input type="hidden" name="cart_id" value={cartId} />
                            <input type="hidden" name="checkout_token" value={checkoutToken} />
                            <input type="hidden" name="amount" value={total} />
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="customer_name" className="block text-xs sm:text-sm font-medium text-gray-600">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="customer_name"
                                        id="customer_name"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm"
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="mobile" className="block text-xs sm:text-sm font-medium text-gray-600">
                                        Mobile
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <span className="inline-flex items-center px-2 sm:px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs sm:text-sm">
                                            +88
                                        </span>
                                        <input
                                            type="text"
                                            name="customer_mobile"
                                            id="mobile"
                                            className="flex-1 block w-full rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm"
                                            placeholder="Enter mobile number"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-600">
                                        Email <span className="text-gray-400 text-xs">(Optional)</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="customer_email"
                                        id="email"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm"
                                        placeholder="Enter email address"
                                        value={auth.user?.email || ''}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-xs sm:text-sm font-medium text-gray-600">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm"
                                        placeholder="Enter address"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="country" className="block text-xs sm:text-sm font-medium text-gray-600">
                                        Country
                                    </label>
                                    <select
                                        name="country"
                                        id="country"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm"
                                        required
                                    >
                                        <option value="">Choose...</option>
                                        <option value="Bangladesh">Bangladesh</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-xs sm:text-sm font-medium text-gray-600">
                                        City
                                    </label>
                                    <select
                                        name="city"
                                        id="city"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm"
                                        required
                                    >
                                        <option value="">Choose...</option>
                                        <option value="Dhaka">Dhaka</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="zip" className="block text-xs sm:text-sm font-medium text-gray-600">
                                        Zip
                                    </label>
                                    <input
                                        type="text"
                                        name="zip"
                                        id="zip"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm"
                                        placeholder="Enter zip code"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center">
                                    <input
                                        id="same-address"
                                        name="same-address"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="same-address" className="ml-2 block text-xs sm:text-sm text-gray-700">
                                        Shipping address is the same as my billing address
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="save-info"
                                        name="save-info"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="save-info" className="ml-2 block text-xs sm:text-sm text-gray-700">
                                        Save this information for next time
                                    </label>
                                </div>
                            </div>
                            <h4 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4">Discounts & Points</h4>
                            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <input
                                            id="apply-voucher"
                                            name="apply_voucher"
                                            type="checkbox"
                                            checked={applyVoucher}
                                            onChange={(e) => setApplyVoucher(e.target.checked)}
                                            className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="apply-voucher" className="ml-2 block text-xs sm:text-sm text-gray-700">
                                            Apply Voucher
                                        </label>
                                    </div>
                                    <div>
                                        {!hasEnoughPoints && (
                                            <p className="text-xs text-red-500 mb-1 sm:mb-2">
                                                Minimum required: {minimumPointsSpent} points
                                            </p>
                                        )}
                                        <div className="flex items-center">
                                            <input
                                                id="user-points"
                                                name="user_points"
                                                type="checkbox"
                                                checked={usePoints}
                                                onChange={(e) => setUsePoints(e.target.checked)}
                                                className={`h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-gray-300 rounded ${
                                                    !hasEnoughPoints ? 'cursor-not-allowed opacity-50' : ''
                                                }`}
                                                disabled={!hasEnoughPoints}
                                            />
                                            <label htmlFor="user-points" className="ml-2 block text-xs sm:text-sm text-gray-700">
                                                Use Points
                                                <span className="ml-1 text-xs text-gray-500">
                                                    (Available: {userPoints} points)
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="voucher_code"
                                        id="voucher_code"
                                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm ${
                                            !applyVoucher ? 'bg-gray-100 cursor-not-allowed' : ''
                                        }`}
                                        placeholder="Enter voucher code"
                                        disabled={!applyVoucher}
                                    />
                                    <input
                                        type="number"
                                        name="use_points"
                                        id="use_points"
                                        min="0"
                                        max={userPoints}
                                        value={pointsToUse}
                                        onChange={(e) => setPointsToUse(e.target.value)}
                                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm ${
                                            !usePoints || !hasEnoughPoints ? 'bg-gray-100 cursor-not-allowed' : ''
                                        }`}
                                        placeholder="Enter points to use"
                                        disabled={!usePoints || !hasEnoughPoints}
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="order_type" className="block text-xs sm:text-sm font-medium text-gray-600">
                                    Order Type
                                </label>
                                <select
                                    name="order_type"
                                    id="order_type"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm"
                                    required
                                >
                                    <option value="">Select Order Type</option>
                                    <option value="cash on delivery">Cash on Delivery</option>
                                    <option value="advance payment">Advance Payment</option>
                                </select>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
                                <a
                                    href="/"
                                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-xs sm:text-sm text-center"
                                >
                                    Continue Shopping
                                </a>
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-xs sm:text-sm"
                                >
                                    Confirm Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Checkout;
