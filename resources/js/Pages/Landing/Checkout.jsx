import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import NavBar from './Navbar';
import Footer from './Footer';

function Checkout({ auth, categories, cartItems, checkoutToken, cartId, total, userPoints, minimumPointsSpent, flash }) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    const [applyVoucher, setApplyVoucher] = useState(false);
    const [usePoints, setUsePoints] = useState(false);
    const [pointsToUse, setPointsToUse] = useState('');

    // Check if the user has enough points to use
    const hasEnoughPoints = userPoints >= minimumPointsSpent;

    return (
        <>
            <Head title="Checkout" />
            <NavBar auth={auth} categories={categories} />
            <main className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Flash Messages */}
                    {flash?.error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-400 text-red-600 p-3 rounded-md shadow-sm">
                            <span className="text-sm">{flash.error}</span>
                        </div>
                    )}

                    {/* Cart Items Section */}
                    <div className="bg-white rounded-lg shadow-md p-5 mb-2">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
                                Checkout
                            </h2>
                            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                                Securely complete your purchase with our streamlined checkout process
                            </p>
                        </div>
                        <h4 className="text-lg font-medium text-gray-700 mb-4">Your Cart</h4>
                        {cartItems.length === 0 ? (
                            <p className="text-gray-500 text-center py-6 text-sm">Your cart is empty.</p>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between border-b border-gray-200 py-3 hover:bg-gray-50 rounded-md px-3"
                                    >
                                        <div className="flex items-center gap-4">
                                            {item.product_image ? (
                                                <img
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    className="w-16 h-16 object-cover rounded-md shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                                                    <span className="text-xs text-gray-400">No image</span>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-base font-medium text-gray-800">{item.product_name}</h3>
                                                {item.is_offered_product === 'yes' && item.offer_price ? (
                                                    <div>
                                                        <p className="text-xs text-gray-400 line-through">
                                                            Regular: Tk{item.price.toFixed(2)}
                                                        </p>
                                                        <p className="text-xs text-green-600 font-medium">
                                                            Offer: Tk{item.offer_price.toFixed(2)}
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
                                        <p className="text-base font-medium text-gray-800">
                                            Tk{item.total_price.toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                                <div className="flex justify-between text-lg font-semibold text-gray-800 mt-4">
                                    <span>Total:</span>
                                    <span>Tk{total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Billing & Discounts Section */}
                    <div className="bg-white rounded-lg shadow-md p-5">
                        <h4 className="text-lg font-medium text-gray-700 mb-4">Billing Details</h4>
                        <form action="/confirm_order" method="POST" className="space-y-6">
                            <input type="hidden" name="_token" value={csrfToken} />
                            <input type="hidden" name="cart_id" value={cartId} />
                            <input type="hidden" name="checkout_token" value={checkoutToken} />
                            <input type="hidden" name="amount" value={total} />

                            {/* Billing Form */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="customer_name" className="block text-sm font-medium text-gray-600">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="customer_name"
                                        id="customer_name"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-600">
                                        Mobile
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                            +88
                                        </span>
                                        <input
                                            type="text"
                                            name="customer_mobile"
                                            id="mobile"
                                            className="flex-1 block w-full rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                            placeholder="Enter mobile number"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                                        Email <span className="text-gray-400 text-xs">(Optional)</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="customer_email"
                                        id="email"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                        placeholder="Enter email address"
                                        value={auth.user?.email || ''}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-600">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                        placeholder="Enter address"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-600">
                                        Country
                                    </label>
                                    <select
                                        name="country"
                                        id="country"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                        required
                                    >
                                        <option value="">Choose...</option>
                                        <option value="Bangladesh">Bangladesh</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-600">
                                        City
                                    </label>
                                    <select
                                        name="city"
                                        id="city"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                        required
                                    >
                                        <option value="">Choose...</option>
                                        <option value="Dhaka">Dhaka</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="zip" className="block text-sm font-medium text-gray-600">
                                        Zip
                                    </label>
                                    <input
                                        type="text"
                                        name="zip"
                                        id="zip"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                        placeholder="Enter zip code"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Checkboxes */}
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <input
                                        id="same-address"
                                        name="same-address"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="same-address" className="ml-2 block text-sm text-gray-700">
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
                                    <label htmlFor="save-info" className="ml-2 block text-sm text-gray-700">
                                        Save this information for next time
                                    </label>
                                </div>
                            </div>

                            {/* Discounts & Points */}
                            <h4 className="text-lg font-medium text-gray-700 mb-4">Discounts & Points</h4>
                            <div className="space-y-4 mb-6">
                                {/* Checkboxes and Messages */}
                                <div className="grid grid-cols-1   sm:grid-cols-2 gap-4">
                                    <div className="flex   items-center">
                                        <input
                                            id="apply-voucher"
                                            name="apply_voucher"
                                            type="checkbox"
                                            checked={applyVoucher}
                                            onChange={(e) => setApplyVoucher(e.target.checked)}
                                            className="h-4 mb-[-30px] w-4 text-indigo-500 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="apply-voucher" className="ml-2 block mb-[-25px] text-sm text-gray-700">
                                            Apply Voucher
                                        </label>
                                    </div>
                                    <div>
                                        {!hasEnoughPoints && (
                                            <p className="text-xs text-red-500 mb-2">
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
                                            <label htmlFor="user-points" className="ml-2 block text-sm text-gray-700">
                                                Use Points
                                                <span className="ml-1 text-xs text-gray-500">
                                                    (Available: {userPoints} points)
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/* Input Fields */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="voucher_code"
                                        id="voucher_code"
                                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm ${
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
                                        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm ${
                                            !usePoints || !hasEnoughPoints ? 'bg-gray-100 cursor-not-allowed' : ''
                                        }`}
                                        placeholder="Enter points to use"
                                        disabled={!usePoints || !hasEnoughPoints}
                                    />
                                </div>
                            </div>

                            {/* Order Type Selection */}
                            <div>
                                <label htmlFor="order_type" className="block text-sm font-medium text-gray-600">
                                    Order Type
                                </label>
                                <select
                                    name="order_type"
                                    id="order_type"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    required
                                >
                                    <option value="">Select Order Type</option>
                                    <option value="cash on delivery">Cash on Delivery</option>
                                    <option value="advance payment">Advance Payment</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 mt-6">
                                <a
                                    href="/"
                                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-sm text-center"
                                >
                                    Continue Shopping
                                </a>
                                <button
                                    type="submit"
                                    className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm"
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
