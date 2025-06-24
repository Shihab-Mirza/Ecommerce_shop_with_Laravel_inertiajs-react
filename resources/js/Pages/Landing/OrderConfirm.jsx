import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import NavBar from './Navbar';
import Footer from './Footer';
import CartModal from './CartModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { usePage } from '@inertiajs/react';

function OrderConfirm({ auth, categories, orderItems, order_token, orderId, total, orderDetails, orderid }) {
    const { props } = usePage();
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    const [cartCount, setCartCount] = useState(props.cartCount || 0);
    const [cartItems, setCartItems] = useState(props.cartItems || []);
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const [pendingCheckout, setPendingCheckout] = useState(false);

    useEffect(() => {
        setCartItems(props.cartItems || []);
        setCartCount(props.cartCount || 0);
    }, [props.cartItems, props.cartCount]);

    const toggleCartModal = () => {
        setCartModalOpen((prev) => !prev);
    };

    const openLoginModal = () => {
        // This can be passed to Navbar to trigger login modal if needed
    };

    return (
        <>
            <Head title="Order Confirmation" />
            <NavBar
                auth={auth}
                categories={categories}
                cartCount={cartCount}
                toggleCartModal={toggleCartModal}
                setPendingCheckout={setPendingCheckout}
                cartId={props.cartId}
                checkoutToken={props.checkoutToken}
            />
            <main className="bg-gray-100 min-h-screen py-4 sm:py-6 lg:py-8">
                {/* Floating Cart Icon */}
                <button
                    onClick={toggleCartModal}
                    className="fixed bottom-4 right-4 z-40 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none"
                >
                    <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                        {cartCount}
                    </span>
                </button>

                {/* Cart Modal */}
                <CartModal
                    isOpen={cartModalOpen}
                    toggleCartModal={toggleCartModal}
                    cartItems={cartItems}
                    cartCount={cartCount}
                    setCartItems={setCartItems}
                    setCartCount={setCartCount}
                    auth={auth}
                    cartId={props.cartId}
                    checkoutToken={props.checkoutToken}
                    setPendingCheckout={setPendingCheckout}
                    openLoginModal={openLoginModal}
                />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 lg:mt-0">
                    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-2 sm:mb-2">
                        <div className="text-center mb-4 sm:mb-6">
                            <p className="text-base sm:text-lg text-gray-600">
                                Complete your purchase with our secure payment process
                            </p>
                            <p className="mt-2 text-sm sm:text-md text-gray-700">
                                Order ID: <span className="font-semibold">#{orderid}</span>
                            </p>
                        </div>
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-6">Order Summary</h4>

                        {orderItems.length === 0 ? (
                            <p className="text-gray-500 text-center text-sm sm:text-base">Your order is empty.</p>
                        ) : (
                            <div className="space-y-4">
                                {orderItems.map((item) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            {item.product_image ? (
                                                <img
                                                    src={item.product_image}
                                                    alt={item.product_name}
                                                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded flex items-center justify-center">
                                                    <span className="text-xs text-gray-500">No image</span>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-sm sm:text-base font-medium text-gray-900">{item.product_name}</h3>
                                                {item.is_offered_product === 'yes' && item.offer_price ? (
                                                    <div>
                                                        <p className="text-xs sm:text-sm text-gray-500 line-through">
                                                            Regular: Tk{item.unit_price.toFixed(2)}
                                                        </p>
                                                        <p className="text-xs sm:text-sm text-green-600 font-medium">
                                                            Offer: Tk{item.offer_price.toFixed(2)}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs sm:text-sm text-gray-500">
                                                        Price: Tk{item.unit_price.toFixed(2)}
                                                    </p>
                                                )}
                                                <p className="text-xs sm:text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm sm:text-base font-semibold text-gray-700 mt-2 sm:mt-0">
                                            Tk{item.subtotal.toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                                <div className="flex justify-between text-base sm:text-lg font-semibold text-gray-900 mt-4">
                                    <span>Total:</span>
                                    <span>Tk{total.toFixed(2)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg  shadow-lg p-4 sm:p-6">
                        <h4 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 sm:mb-6">Billing Address</h4>
                        <form action={`/pay/${orderId}/${order_token}`} method="POST" className="space-y-4 sm:space-y-6">
                            <input type="hidden" name="_token" value={csrfToken} />
                            <input type="hidden" name="amount" value={total} />
                            <input type="hidden" name="order_id" value={orderId} />
                            <input type="hidden" name="order_token" value={order_token} />

                            <div className="grid grid-cols-1 gap-4 sm:gap-6">
                                <div>
                                    <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{orderDetails?.customer_name || 'N/A'}</p>
                                </div>

                                <div>
                                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                                        Mobile
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {orderDetails?.customer_mobile || 'N/A'}
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email <span className="text-gray-500">(Optional)</span>
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{orderDetails?.customer_email || 'N/A'}</p>
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                        Address
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{orderDetails?.address || 'N/A'}</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                            Country
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">{orderDetails?.country || 'N/A'}</p>
                                    </div>

                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                            City
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">{orderDetails?.city || 'N/A'}</p>
                                    </div>

                                    <div>
                                        <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                                            Zip
                                        </label>
                                        <p className="mt-1 text-sm text-gray-900">{orderDetails?.zip || 'N/A'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="order_type" className="block text-sm font-medium text-gray-700">
                                        Order Type
                                    </label>
                                    <p className="mt-1 text-sm text-gray-900">{orderDetails?.order_type || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                {orderDetails?.order_type === 'cash on delivery' ? (
                                    <a
                                        href="/"
                                        className="flex-1 bg-indigo-600 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-center text-sm sm:text-base"
                                    >
                                        Continue Shopping
                                    </a>
                                ) : (
                                    <>
                                        <a
                                            href="/"
                                            className="flex-1 bg-gray-600 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-center text-sm sm:text-base"
                                        >
                                            Pay Later
                                        </a>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-indigo-600 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-sm sm:text-base"
                                        >
                                            Continue to Payment
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default OrderConfirm;
