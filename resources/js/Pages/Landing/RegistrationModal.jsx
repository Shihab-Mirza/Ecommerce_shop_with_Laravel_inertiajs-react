import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';

function RegistrationModal({ closeModal, toggleToLoginModal }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [successMessage, setSuccessMessage] = useState(null);
    const [timer, setTimer] = useState(4);
    const [timerInterval, setTimerInterval] = useState(null);

    useEffect(() => {
        if (successMessage) {
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        window.location.reload();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            setTimerInterval(interval);
            return () => clearInterval(interval);
        }
    }, [successMessage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onSuccess: () => {
                setSuccessMessage('Registration successful! Please check your email for the verification link.');
                reset();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-700">
            <div className="relative bg-white p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-md animate-slideIn overflow-hidden border border-gray-100/20">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-600 text-xl font-semibold hover:text-gray-800 transition-all duration-300 hover:scale-110"
                >
                    ×
                </button>

                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6 tracking-tight">
                    Create Account
                </h2>

                {errors?.general && (
                    <div className="mb-4 text-red-500 text-sm text-center bg-red-100/50 p-3 rounded-xl">
                        {errors.general}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 text-green-500 text-sm text-center bg-green-100/50 p-3 rounded-xl">
                        {successMessage}
                        <div className="mt-2 text-gray-700 text-sm">
                            Closing in {timer}s...
                        </div>
                    </div>
                )}

                {!successMessage && (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="peer w-full p-3 pt-6 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50/50"
                                placeholder="Full Name"
                                required
                                minLength="3"
                                maxLength="255"
                            />
                            <label
                                htmlFor="name"
                                className="absolute left-3 top-1 text-sm font-medium text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
                            >
                                Full Name
                            </label>
                            {errors?.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}
                        </div>

                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="peer w-full p-3 pt-6 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50/50"
                                placeholder="Email Address"
                                required
                                minLength="4"
                                maxLength="255"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address (e.g., user@example.com)"
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-3 top-1 text-sm font-medium text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
                            >
                                Email Address
                            </label>
                            {errors?.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}
                        </div>

                        <div className="relative">
                            <input
                                type="password"
                                id="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="peer w-full p-3 pt-6 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50/50"
                                placeholder="Password"
                                required
                                minLength="8"
                                maxLength="50"

                                title="Password must be at least 8 characters long, including one number, one lowercase, and one uppercase letter"
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-3 top-1 text-sm font-medium text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
                            >
                                Password
                            </label>
                            {errors?.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}
                        </div>

                        <div className="relative">
                            <input
                                type="password"
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="peer w-full p-3 pt-6 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50/50"
                                placeholder="Confirm Password"
                                required
                                minLength="8"
                                maxLength="50"
                                title="Password confirmation must match the password"
                            />
                            <label
                                htmlFor="password_confirmation"
                                className="absolute left-3 top-1 text-sm font-medium text-gray-500 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-gray-500"
                            >
                                Confirm Password
                            </label>
                            {errors?.password_confirmation && (
                                <span className="text-red-500 text-xs mt-1 block">{errors.password_confirmation}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {processing ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                    </svg>
                                    Registering...
                                </span>
                            ) : (
                                'Register'
                            )}
                        </button>
                    </form>
                )}

                <div className="text-center mt-6">
                    <span className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <span
                            onClick={toggleToLoginModal}
                            className="text-emerald-600 hover:text-emerald-700 transition-all duration-300 cursor-pointer font-medium"
                        >
                            Log In
                        </span>
                    </span>
                </div>

                <style>
                    {`
                        @keyframes slideIn {
                            from {
                                transform: translateY(30px);
                                opacity: 0;
                            }
                            to {
                                transform: translateY(0);
                                opacity: 1;
                            }
                        }
                        .animate-slideIn {
                            animation: slideIn 0.5s ease-out;
                        }
                    `}
                </style>
            </div>
        </div>
    );
}

export default RegistrationModal;
