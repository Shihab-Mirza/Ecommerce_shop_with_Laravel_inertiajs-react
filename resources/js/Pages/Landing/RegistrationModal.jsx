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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-700 ">
            <div className=" ml-2 mr-2 relative bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-[390px] max-w-md sm:animate-slideIn overflow-hidden border border-gray-100/20">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-600 text-xl font-semibold hover:text-gray-800 transition-all duration-300 hover:scale-110"
                >
                    ×
                </button>

                <h1 className="text-2xl font-bold text-center text-gray-900 mb-6 tracking-tight">
                    Create Account
                </h1>

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
                    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col items-center justify-center w-full">
                        <span className="text-sm text-gray-600 mb-2">Use your email for registration</span>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full p-3 bg-gray-200 border-none rounded-md text-gray-900 placeholder-gray-500 focus:outline-none  transition-all duration-300"
                            placeholder="Name"
                            required
                            minLength="3"
                            maxLength="255"
                        />
                        {errors?.name && <span className="text-red-500 text-xs mt-1 block">{errors.name}</span>}

                        <input
                            type="email"
                            id="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full p-3 bg-gray-200 border-none rounded-md text-gray-900 placeholder-gray-500 focus:outline-none  transition-all duration-300"
                            placeholder="Email"
                            required
                            minLength="4"
                            maxLength="255"
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                            title="Please enter a valid email address (e.g., user@example.com)"
                        />
                        {errors?.email && <span className="text-red-500 text-xs mt-1 block">{errors.email}</span>}

                        <input
                            type="password"
                            id="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full p-3 bg-gray-200 border-none rounded-md text-gray-900 placeholder-gray-500 focus:outline-none  transition-all duration-300"
                            placeholder="Password"
                            required
                            minLength="8"
                            maxLength="50"
                            title="Password must be at least 8 characters long, including one number, one lowercase, and one uppercase letter"
                        />
                        {errors?.password && <span className="text-red-500 text-xs mt-1 block">{errors.password}</span>}

                        <input
                            type="password"
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full p-3 bg-gray-200 border-none rounded-md text-gray-900 placeholder-gray-500 focus:outline-none  transition-all duration-300"
                            placeholder="Confirm Password"
                            required
                            minLength="8"
                            maxLength="50"
                            title="Password confirmation must match the password"
                        />
                        {errors?.password_confirmation && (
                            <span className="text-red-500 text-xs mt-1 block">{errors.password_confirmation}</span>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className={`w-full  text-white py-3 rounded-full font-bold uppercase text-sm tracking-wide bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300 transform hover:scale-105 ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                                'Sign Up'
                            )}
                        </button>
                    </form>
                )}

                <div className="text-center mt-6">
                    <span className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <span
                            onClick={toggleToLoginModal}
                            className="text-emerald-500  transition-all duration-300 cursor-pointer font-medium"
                        >
                            Sign In
                        </span>
                    </span>
                </div>

                <style>
                    {`
                        @media (min-width: 640px) {
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
                        }
                    `}
                </style>
            </div>
        </div>
    );
}

export default RegistrationModal;