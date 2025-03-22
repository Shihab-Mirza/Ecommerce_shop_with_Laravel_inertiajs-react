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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-[90%] sm:w-[400px] md:w-[450px] animate-fadeIn relative">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-600 text-2xl font-semibold hover:text-gray-800 transition duration-200"
                >
                    ×
                </button>

                <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">
                    {showForgotPassword ? 'Reset Password' : 'Log In'}
                </h2>

                {/* General error */}
                {errors.auth && (
                    <div className="mb-3 text-red-500 text-sm text-center">
                        {errors.auth}
                    </div>
                )}

                {!showForgotPassword ? (
                    <form onSubmit={handleLoginSubmit}>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                minLength="5"
                                maxLength="255"
                                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-300 placeholder:text-gray-400"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <span className="text-red-500 text-xs">
                                    {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                                </span>
                            )}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                minLength="6"
                                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-300 placeholder:text-gray-400"
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <span className="text-red-500 text-xs">
                                    {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition duration-300 focus:outline-none transform hover:scale-105 shadow-md hover:shadow-xl ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {processing ? 'Logging in...' : 'Log In'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleForgotPasswordSubmit}>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                minLength="5"
                                maxLength="255"
                                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-300 placeholder:text-gray-400"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <span className="text-red-500 text-xs">
                                    {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                                </span>
                            )}
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition duration-300 focus:outline-none transform hover:scale-105 shadow-md hover:shadow-xl ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {processing ? 'Sending...' : 'Send Password Reset Link'}
                            </button>
                        </div>

                        <div className="text-center mt-4">
                            <span
                                onClick={() => {
                                    setShowForgotPassword(false);
                                    reset(); // Reset the entire form state when switching back to login
                                }}
                                className="text-sm text-emerald-600 hover:text-emerald-700 transition duration-300 cursor-pointer"
                            >
                                Back to Login
                            </span>
                        </div>
                    </form>
                )}

                {!showForgotPassword && (
                    <>
                        <div className="text-center mt-4">
                            <button
                                onClick={() => setShowForgotPassword(true)}
                                className="text-sm text-emerald-600 hover:text-emerald-700 transition duration-300"
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <div className="text-center mt-2">
                            <span className="text-sm text-gray-600">
                                Don't have an account?{' '}
                                <button
                                    onClick={toggleToRegistrationModal}
                                    className="text-sm text-emerald-600 hover:text-emerald-700 transition duration-300"
                                >
                                    Create an account
                                </button>
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default LoginModal;
