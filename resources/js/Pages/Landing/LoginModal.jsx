import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

function LoginModal({ closeModal, toggleToRegistrationModal }) {
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const { data, setData, post, errors, processing, reset } = useForm({
        email: '',
        password: '',
    });

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        post('/login', {
            onSuccess: () => {
                closeModal();
                window.location.reload();
            },
            onFinish: () => reset(),
        });
    };

    const handleForgotPasswordSubmit = (e) => {
        e.preventDefault();
        post('/forgot-password', {
            onSuccess: () => {
                alert('Password reset link sent to your email!');
                setShowForgotPassword(false);
                reset();
            },
            onFinish: () => reset(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-500">
            <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-md border border-gray-200 animate-slideIn">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-600 text-2xl font-semibold hover:text-gray-800 transition-all duration-300 hover:scale-110"
                >
                    ×
                </button>

                <h2 className="text-4xl font-semibold text-center text-gray-900 mb-8 tracking-tight">
                    {showForgotPassword ? 'Reset Password' : 'Log In'}
                </h2>

                {/* General error */}
                {errors.auth && (
                    <div className="mb-4 text-red-500 text-sm text-center bg-red-100/50 p-3 rounded-lg">
                        {errors.auth}
                    </div>
                )}

                {!showForgotPassword ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                minLength="4"
                                maxLength="255"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address (e.g., user@example.com)"
                                className="w-full p-4 border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <span className="text-red-500 text-xs mt-1">
                                    {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                                </span>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                minLength="6"
                                maxLength="50"
                                pattern=".{6,}"
                                title="Password must be at least 6 characters long"
                                className="w-full p-4 border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <span className="text-red-500 text-xs mt-1">
                                    {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {processing ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                minLength="5"
                                maxLength="255"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address (e.g., user@example.com)"
                                className="w-full p-4 border-2 border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <span className="text-red-500 text-xs mt-1">
                                    {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                                </span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {processing ? 'Sending...' : 'Send Password Reset Link'}
                        </button>

                        <div className="text-center">
                            <span
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    reset();
                                }}
                                className="text-sm text-emerald-600 hover:text-emerald-700 transition-all duration-300 cursor-pointer"
                            >
                                Back to Login
                            </span>
                        </div>
                    </form>
                )}

                {!showForgotPassword && (
                    <div className="mt-6 text-center space-y-3">
                        <button
                            onClick={() => setShowForgotPassword(true)}
                            className="text-sm text-emerald-600 hover:text-emerald-700 transition-all duration-300"
                        >
                            Forgot Password?
                        </button>
                        <div className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <span
                                onClick={toggleToRegistrationModal}
                                className="text-emerald-600 hover:text-emerald-700 transition-all duration-300 cursor-pointer"
                            >
                                Create an account
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom CSS for animations */}
            <style>
                {`
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
                        animation: slideIn 0.4s ease-out;
                    }
                `}
            </style>
        </div>
    );
}

export default LoginModal;
