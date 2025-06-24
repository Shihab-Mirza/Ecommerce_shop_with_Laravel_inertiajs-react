import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

function LoginModal({ closeModal, toggleToRegistrationModal }) {
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const { data, setData, post, errors, processing, reset, clearErrors } = useForm({
        email: '',
        password: '',
    });

    // Helper function to toggle forgot password and clear errors
    const toggleForgotPassword = (show) => {
        setShowForgotPassword(show);
        clearErrors(); // Clear all errors when switching forms
        reset(); // Reset form data to initial state
    };

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
                toggleForgotPassword(false); // Switch back to login and clear errors
            },
            onFinish: () => reset(),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-600 font-montserrat">
            <div className="relative bg-white   p-10 rounded-xl shadow-2xl h-[450px] w-[380px] ml-2 mr-2 sd:h-[500px] sd:w-[360px] lg:h-[450px] lg:w-[360px] md:h-[450px] md:w-[370px] border border-gray-200 animate-slideIn">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-600 text-2xl font-bold hover:text-gray-800 transition-all duration-300 hover:scale-110"
                >
                    ×
                </button>

                <h2 className="text-3xl font-bold text-center text-gray-900 mb-8 mt-4 lg:mt-5">
                    {showForgotPassword ? 'Reset Password' : 'Sign In'}
                </h2>

                {/* General error */}
                {errors.auth && (
                    <div className="mb-4 text-red-500 text-sm text-center bg-red-100/50 p-3 rounded-lg">
                        {errors.auth}
                    </div>
                )}

                {!showForgotPassword ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4" >
                        <div className="flex flex-col items-center justify-center w-full">
                            <span className="text-sm text-gray-600 mb-2">Use your email to sign in</span>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                minLength="4"
                                maxLength="255"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address (e.g., user@example.com)"
                                className="w-full p-3 bg-gray-100 border-none rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
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
                                type="password"
                                id="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                minLength="8"
                                maxLength="50"
                                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d]).{8,}$"
                                title="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
                                className="w-full p-3 bg-gray-100 border-none rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
                                placeholder="Password"
                            />
                            {errors.password && (
                                <span className="text-red-500 text-xs mt-1 block text-center">
                                    {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                                </span>
                            )}
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
                                'Sign In'
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                        <div className="flex flex-col items-center justify-center w-full">
                            <span className="text-sm text-gray-600 mb-2">Enter your email to reset password</span>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                minLength="4"
                                maxLength="255"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address (e.g., user@example.com)"
                                className="w-full p-3 bg-gray-100 border-none rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF4B2B]  transition-all duration-300"
                                placeholder="Email"
                                autofocus
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
                            className={`w-full bg-[#FF4B2B] text-white lg:text-sm py-3 lg:py-2 text-xs rounded-full font-bold uppercase tracking-wide hover:bg-[#FF416C] transition-all duration-300 transform hover:scale-105 ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
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
                                Back to Sign In
                            </span>
                        </div>
                    </form>
                )}

                {!showForgotPassword && (
                    <div className="mt-6 text-center space-y-3">
                        <button
                            onClick={() => toggleForgotPassword(true)}
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
                                Sign Up
                            </span>
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
    );
}

export default LoginModal;