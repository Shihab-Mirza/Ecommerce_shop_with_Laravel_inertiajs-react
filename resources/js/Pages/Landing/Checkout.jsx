import { Head } from '@inertiajs/react';
import React from 'react';
import NavBar from './Navbar';
import Footer from './Footer';
import SecondaryNavBar from './SecondaryNavBar';

function Checkout({ auth, categories, cartItems, checkoutToken, cartId, total }) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

    return (
        <>
            <Head title="Checkout" />
            <NavBar auth={auth} />
            <SecondaryNavBar categories={categories} />
            <main className="bg-gray-100 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900">Checkout</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Complete your purchase with our secure checkout process
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                        <h4 className="text-lg font-semibold text-gray-700 mb-6">Order Summary</h4>
                        {cartItems.length === 0 ? (
                            <p className="text-gray-500 text-center">Your cart is empty.</p>
                        ) : (
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-200 rounded"></div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-900">{item.product_name}</h3>
                                                <p className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</p>
                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-700">
                                            ${item.total_price.toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                                <div className="flex justify-between text-lg font-semibold text-gray-900 mt-4">
                                    <span>Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h4 className="text-lg font-semibold text-gray-700 mb-6">Billing Address</h4>
                        <form action="/pay" method="POST" className="space-y-6">
                            <input type="hidden" name="_token" value={csrfToken} />
                            <input type="hidden" name="cart_id" value={cartId} />
                            <input type="hidden" name="checkout_token" value={checkoutToken} />
                            <input type="hidden" name="amount" value={total} />
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="customer_name"
                                        id="customer_name"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Enter full name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                                        Mobile
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                            +88
                                        </span>
                                        <input
                                            type="text"
                                            name="customer_mobile"
                                            id="mobile"
                                            className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Enter mobile number"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email <span className="text-gray-500">(Optional)</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="customer_email"
                                        id="email"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Enter email address"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Enter address"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
                                        Address 2 <span className="text-gray-500">(Optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="address2"
                                        id="address2"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Apartment or suite"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                            Country
                                        </label>
                                        <select
                                            name="country"
                                            id="country"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">Choose...</option>
                                            <option value="Bangladesh">Bangladesh</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                            State
                                        </label>
                                        <select
                                            name="state"
                                            id="state"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        >
                                            <option value="">Choose...</option>
                                            <option value="Dhaka">Dhaka</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                                            Zip
                                        </label>
                                        <input
                                            type="text"
                                            name="zip"
                                            id="zip"
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Enter zip code"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        id="same-address"
                                        name="same-address"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="same-address" className="ml-2 block text-sm text-gray-900">
                                        Shipping address is the same as my billing address
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="save-info"
                                        name="save-info"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="save-info" className="ml-2 block text-sm text-gray-900">
                                        Save this information for next time
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Continue to Payment
                            </button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default Checkout;
