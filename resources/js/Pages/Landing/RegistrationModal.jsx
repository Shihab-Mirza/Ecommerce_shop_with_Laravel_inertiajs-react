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
    const [timer, setTimer] = useState(4); // Start timer at 3 seconds
    const [timerInterval, setTimerInterval] = useState(null);

    useEffect(() => {
        // Set up timer interval when successMessage is shown
        if (successMessage) {
            const interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        window.location.reload(); // Refresh the page after countdown reaches 0
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000); // Update timer every 1 second
            setTimerInterval(interval);

            // Cleanup interval on component unmount or when timer finishes
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-3xl shadow-2xl w-[90%] sm:w-[320px] md:w-[360px] lg:w-[450px] max-w-full animate-fadeIn relative overflow-hidden">
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-600 text-xl font-semibold hover:text-gray-800 transition duration-200"
                >
                    ×
                </button>

                <h2 className="text-2xl font-semibold text-center text-gray-900 mb-4">Create an Account</h2>

                {errors?.general && (
                    <div className="mb-3 text-red-500 text-sm text-center">{errors.general}</div>
                )}

                {/* Display success message */}
                {successMessage && (
                    <div className="mb-4 text-green-500 text-sm text-center">
                        {successMessage}
                    </div>
                )}

                {/* Timer display when registration is successful */}
                {successMessage && (
                    <div className="mb-4 text-center text-gray-700">
                        <span>Closing in {timer}s...</span>
                    </div>
                )}

                {/* Form only shows if registration hasn't been successful */}
                {!successMessage && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full p-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-300 placeholder:text-gray-400"
                                placeholder="Enter your full name"
                                required
                                minLength={3}
                                maxLength={255}
                            />
                            {errors?.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full p-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-300 placeholder:text-gray-400"
                                placeholder="Enter your email"
                                required
                            />
                            {errors?.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full p-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-300 placeholder:text-gray-400"
                                placeholder="Enter your password"
                                required
                                minLength={8}
                            />
                            {errors?.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                            <input
                                type="password"
                                id="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full p-3 border-2 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition duration-300 placeholder:text-gray-400"
                                placeholder="Confirm your password"
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="mb-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2 rounded-2xl hover:bg-emerald-700 transition duration-300 focus:outline-none transform hover:scale-105 shadow-md hover:shadow-xl ${processing ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {processing ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center mt-4">
                    <span className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                            onClick={toggleToLoginModal}
                            className="text-sm text-emerald-600 hover:text-emerald-700 transition duration-300"
                        >
                            Log In
                        </button>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default RegistrationModal;
