import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { useForm, usePage, Link } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const AdminProfile = ({ auth, categories: initialCategories, subcategories: initialSubcategories, errors: initialErrors, flash }) => {
    const { props } = usePage();
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('admin_profile');

    const { data, setData, patch, post, processing, errors, reset } = useForm({
        name: props.name || '',
        email: props.email || '',
        current_password: '',
        new_password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const toggleSidebar = () => {
        setIsSidebarMinimized(!isSidebarMinimized);
    };

    const toggleMobileSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                // Handle success (e.g., show toast notification)
            },
        });
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        post(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('current_password', 'new_password', 'password_confirmation');
            },
        });
    };

    const handleResendVerification = () => {
        post(route('verification.send'), {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Admin Profile" />
            <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
                <AdminNavbar
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    toggleMobileSidebar={toggleMobileSidebar}
                />
                <div className="flex">
                    <AdminSidebar
                        isDarkMode={isDarkMode}
                        isSidebarMinimized={isSidebarMinimized}
                        toggleSidebar={toggleSidebar}
                        isSidebarOpen={isSidebarOpen}
                        toggleMobileSidebar={toggleMobileSidebar}
                    />
                    <main className="flex-1 p-4 lg:p-8">
                        <div className="flex flex-col lg:flex-row gap-6 max-w-6xl ml-72">
                            {/* Sidebar Profile Card */}
                            <aside className="lg:w-1/4 bg-white rounded-2xl shadow-lg p-4 sm:p-6 h-72">
                                <div className="flex flex-col items-center mb-6 sm:mb-8 mt-4">
                                    <div className="relative">
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="text-5xl sm:text-6xl text-gray-700 transition-transform duration-300 hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 hover:opacity-20 rounded-full blur-xl transition-opacity duration-300"></div>
                                    </div>
                                    <h2 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-gray-800">{auth.user.name}</h2>
                                    <p className="text-xs sm:text-sm text-gray-600">{auth.user.email}</p>
                                    <p className="text-xs sm:text-sm text-gray-600 capitalize">Role: {auth.user.usertype || 'Admin'}</p>
                                </div>
                                <div className="space-y-3 sm:space-y-4">
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex items-center gap-2 text-sm sm:text-base text-gray-700 hover:text-indigo-500 transition-colors duration-300"
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} className="text-base sm:text-lg" />
                                        <span>Logout</span>
                                    </Link>
                                </div>
                            </aside>

                            {/* Main Content */}
                            <div className="lg:w-3/4 space-y-6">
                                {/* Profile Information Form */}
                                <form
                                    onSubmit={handleProfileSubmit}
                                    className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8"
                                >
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                                        Profile Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full p-2 sm:p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-sm sm:text-base"
                                                placeholder="Enter your name"
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-xs sm:text-sm mt-2 animate-pulse">{errors.name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="w-full p-2 sm:p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-sm sm:text-base"
                                                placeholder="Enter your email"
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-xs sm:text-sm mt-2 animate-pulse">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 sm:mt-6">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="relative px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                        >
                                            Update Profile
                                        </button>
                                    </div>
                                    {auth.user.email_verified_at === null && (
                                        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-700">
                                            Your email address is not verified.{' '}
                                            <button
                                                onClick={handleResendVerification}
                                                disabled={processing}
                                                className="text-indigo-600 hover:text-indigo-800 underline"
                                            >
                                                Resend Verification Email
                                            </button>
                                        </div>
                                    )}
                                </form>

                                {/* Password Update Form */}
                                <form
                                    onSubmit={handlePasswordSubmit}
                                    className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8"
                                >
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                                        Update Password
                                    </h2>
                                    <div className="space-y-4 sm:space-y-6">
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                            <input
                                                type="password"
                                                value={data.current_password}
                                                onChange={(e) => setData('current_password', e.target.value)}
                                                className="w-full p-2 sm:p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-sm sm:text-base"
                                                placeholder="Enter current password"
                                            />
                                            {errors.current_password && (
                                                <p className="text-red-500 text-xs sm:text-sm mt-2 animate-pulse">{errors.current_password}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">New Password</label>
                                            <input
                                                type="password"
                                                value={data.new_password}
                                                onChange={(e) => setData('new_password', e.target.value)}
                                                className="w-full p-2 sm:p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-sm sm:text-base"
                                                placeholder="Enter new password"
                                            />
                                            {errors.new_password && (
                                                <p className="text-red-500 text-xs sm:text-sm mt-2 animate-pulse">{errors.new_password}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                            <input
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className="w-full p-2 sm:p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-sm sm:text-base"
                                                placeholder="Confirm new password"
                                            />
                                            {errors.password_confirmation && (
                                                <p className="text-red-500 text-xs sm:text-sm mt-2 animate-pulse">{errors.password_confirmation}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 sm:mt-6">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="relative px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                        >
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
};

export default AdminProfile;
