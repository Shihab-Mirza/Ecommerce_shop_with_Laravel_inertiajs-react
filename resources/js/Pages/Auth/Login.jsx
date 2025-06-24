import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import NavBar from '../Landing/Navbar';
import Footer from '../Landing/Footer';
import CartModal from '../Landing/CartModal';

export default function Login({ status, canResetPassword, auth, categories, cartItems, cartCount, cartId, checkoutToken }) {
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const [localCartItems, setLocalCartItems] = useState(cartItems || []);
    const [localCartCount, setLocalCartCount] = useState(cartCount || 0);
    const [pendingCheckout, setPendingCheckout] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Sync cart items and count with props
    useEffect(() => {
        setLocalCartItems(cartItems || []);
        setLocalCartCount(cartCount || 0);
    }, [cartItems, cartCount]);

    // Toggle forgot password form and clear errors
    const toggleForgotPassword = (show) => {
        setShowForgotPassword(show);
        clearErrors();
        reset();
    };

    // Toggle cart modal
    const toggleCartModal = () => {
        setCartModalOpen((prev) => !prev);
    };

    const openLoginModal = () => {
        // Placeholder for login modal trigger, passed to CartModal if needed
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleForgotPasswordSubmit = (e) => {
        e.preventDefault();
        post(route('password.request'), {
            onSuccess: () => {
                alert('Password reset link sent to your email!');
                toggleForgotPassword(false);
            },
            onFinish: () => reset(),
        });
    };

    return (
        <>
            <Head title={showForgotPassword ? 'Reset Password' : 'Sign in'} />
            <NavBar
                auth={auth}
                categories={categories}
                cartCount={localCartCount}
                toggleCartModal={toggleCartModal}
                setPendingCheckout={setPendingCheckout}
                cartId={cartId}
                checkoutToken={checkoutToken}
            />
            <div className="min-h-screen bg-white flex flex-col">
                {/* Floating Cart Icon */}
                <button
                    onClick={toggleCartModal}
                    className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-40 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                >
                    <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                        {localCartCount}
                    </span>
                </button>

                {/* Cart Modal */}
                <CartModal
                    isOpen={cartModalOpen}
                    toggleCartModal={toggleCartModal}
                    cartItems={localCartItems}
                    cartCount={localCartCount}
                    setCartItems={setLocalCartItems}
                    setCartCount={setLocalCartCount}
                    auth={auth}
                    cartId={cartId}
                    checkoutToken={checkoutToken}
                    setPendingCheckout={setPendingCheckout}
                    openLoginModal={openLoginModal}
                />

                {/* Login Form */}
                <div className="flex-1 flex items-center justify-center font-montserrat mb-14 lg:mb-10 lg:mt-12 mt-20">
                    <div className="bg-white p-10 rounded-xl shadow-2xl ml-2 mr-2 w-[380px] h-[480px] border border-gray-200 animate-slideIn">
                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600 text-center bg-green-100/50 p-3 rounded-lg">
                                {status}
                            </div>
                        )}

                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 mt-6">
                            {showForgotPassword ? 'Reset Password' : 'Log in'}
                        </h2>

                        {!showForgotPassword ? (
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                <div className="flex flex-col items-center justify-center w-full">
                                    <span className="text-sm text-gray-600 mb-2">Use your email to log in</span>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        minLength="4"
                                        maxLength="255"
                                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                        title="Please enter a valid email address (e.g., user@example.com)"
                                        className="w-full p-3 bg-gray-100 border-none rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500  transition-all duration-300"
                                        placeholder="Email"
                                        autoFocus
                                    />
                                    {errors.email && (
                                        <span className="text-red-500 text-xs mt-1 block text-center">
                                            {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        minLength="8"
                                        maxLength="50"
                                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
                                        title="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
                                        className="w-full p-3 bg-gray-100 border-none rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500  transition-all duration-300"
                                        placeholder="Password"
                                    />
                                    {errors.password && (
                                        <span className="text-red-500 text-xs mt-1 block text-center">
                                            {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 text-blue-400  focus:ring-gray-300 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember" className="ms-2 text-sm text-gray-600">
                                        Remember me
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-full font-bold uppercase text-sm tracking-wide hover:bg-[#FF416C] transition-all duration-300 transform hover:scale-105 ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                            </svg>
                                            Signing in...
                                        </span>
                                    ) : (
                                        'Sign in'
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                                <div className="flex flex-col items-center justify-center w-full">
                                    <span className="text-sm text-gray-600 mb-2">Enter your email to reset password</span>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        minLength="4"
                                        maxLength="255"
                                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                        title="Please enter a valid email address (e.g., user@example.com)"
                                        className="w-full p-3 bg-gray-100 border-none rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4B2B] transition-all duration-300"
                                        placeholder="Email"
                                        autoFocus
                                    />
                                    {errors.email && (
                                        <span className="text-red-500 text-xs mt-1 block text-center">
                                            {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                                        </span>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`w-full bg-[#FF4B2B] text-white py-3 rounded-full font-bold uppercase text-sm tracking-wide hover:bg-[#FF416C] transition-all duration-300 transform hover:scale-105 ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        'Send Password Reset Link'
                                    )}
                                </button>

                                <div className="text-center">
                                    <span
                                        onClick={() => toggleForgotPassword(false)}
                                        className="text-sm text-[#FF4B2B] hover:text-[#FF416C] transition-all duration-300 cursor-pointer"
                                    >
                                        Back to Log in
                                    </span>
                                </div>
                            </form>
                        )}

                        {!showForgotPassword && (
                            <div className="mt-6 text-center space-y-3">
                                {canResetPassword && (
                                    <button
                                        onClick={() => toggleForgotPassword(true)}
                                        className="text-sm text-emerald-600 hover:text-emerald-700 transition-all duration-300"
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                                <div className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link
                                        href={route('register')}
                                        className="text-emerald-600 hover:text-emerald-700 transition-all duration-300"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            </div>
                        )}

                        <style jsx>{`
                            @keyframes slideIn {
                                from {
                                    transform: translateY(20px);
                                    opacity: 0;
                                }
                                to {
                                    transform: translateY(0);
                                    opacity: 1;
                                }
                            }
                            .animate-slideIn {
                                animation: slideIn 0.6s ease-out;
                            }
                            .font-montserrat {
                                font-family: 'Montserrat', sans-serif;
                            }
                        `}</style>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}

// Helper function to generate asset URLs
function asset(path) {
    return `/${path}`;
}