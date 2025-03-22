import React, { useState } from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faUser, faMoon, faSun, faChevronLeft, faChevronRight, faBars } from '@fortawesome/free-solid-svg-icons';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = ({ auth }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
    const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Revenue ($)',
                data: [5000, 7000, 8000, 6000, 9000, 10000, 11000, 9500, 8500, 7500, 6500, 12000],
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'Orders',
                data: [50, 70, 80, 60, 90, 100, 110, 95, 85, 75, 65, 120],
                backgroundColor: 'rgba(255, 159, 64, 0.8)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: isDarkMode ? '#ffffff' : '#374151' },
            },
            title: {
                display: true,
                text: 'Monthly Revenue and Orders',
                color: isDarkMode ? '#ffffff' : '#374151',
                font: { size: 18 },
            },
        },
        scales: {
            x: {
                ticks: { color: isDarkMode ? '#ffffff' : '#374151' },
                grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
            },
            y: {
                ticks: { color: isDarkMode ? '#ffffff' : '#374151' },
                grid: { color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
            },
        },
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
            {/* Navbar */}
            <nav className={`${isDarkMode ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-r from-white via-gray-50 to-white'} shadow-lg sticky top-0 z-50 transition-all duration-500`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center space-x-4">
                            <button onClick={toggleMobileSidebar} className="md:hidden p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
                                <FontAwesomeIcon icon={faBars} className="text-xl" />
                            </button>
                            <h1 className={`text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent ${isDarkMode ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'} animate-pulse tracking-wider`}>
                                Computer store
                            </h1>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
                            <div className="relative group hidden sm:block">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`px-3 py-2 sm:px-4 sm:py-2 ${isDarkMode ? 'text-gray-200 bg-gray-800/50 border-gray-700' : 'text-gray-800 bg-gray-100 border-gray-300'} border rounded-full focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-purple-500 focus:bg-gray-900' : 'focus:ring-blue-400 focus:bg-white'} transition-all duration-300 group-hover:w-48 sm:group-hover:w-64 w-40 sm:w-48`}
                                />
                                <button className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                                    <FontAwesomeIcon icon={faSearch} className={`${isDarkMode ? 'text-blue-400 hover:text-purple-500' : 'text-blue-500 hover:text-indigo-500'}`} />
                                </button>
                            </div>
                            <button className={`p-2 sm:p-3 rounded-full ${isDarkMode ? 'bg-gray-800/50 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600' : 'bg-gray-100 hover:bg-gradient-to-br hover:from-blue-400 hover:to-indigo-500'} transform hover:scale-110 transition-all duration-300 group relative`}>
                                <FontAwesomeIcon icon={faBell} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} group-hover:text-white`} />
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white opacity-75">3</span>
                            </button>
                            <button onClick={toggleDarkMode} className={`p-2 sm:p-3 rounded-full ${isDarkMode ? 'bg-gray-800/50 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600' : 'bg-gray-100 hover:bg-gradient-to-br hover:from-blue-400 hover:to-indigo-500'} transform hover:scale-110 transition-all duration-300 group`}>
                                <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} group-hover:text-white`} />
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className={`p-2 sm:p-3 rounded-full ${isDarkMode ? 'bg-gray-800/50 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600' : 'bg-gray-100 hover:bg-gradient-to-br hover:from-blue-400 hover:to-indigo-500'} transform hover:scale-110 transition-all duration-300 group`}
                                >
                                    <FontAwesomeIcon icon={faUser} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} group-hover:text-white`} />
                                </button>
                                {isProfileOpen && (
                                    <div className={`absolute right-0 mt-3 w-48 sm:w-56 ${isDarkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'} backdrop-blur-md shadow-xl rounded-xl py-3 border animate-fade-in`}>
                                        <span className={`block px-4 sm:px-5 py-2 ${isDarkMode ? 'text-gray-200 border-b-gray-800' : 'text-gray-800 border-b-gray-200'} font-medium border-b`}>{auth.user.name}</span>
                                        <InertiaLink
                                            href="/logout"
                                            method="post"
                                            className={`block px-4 sm:px-5 py-2 text-red-500 ${isDarkMode ? 'hover:bg-gray-800/70 hover:text-red-400' : 'hover:bg-gray-100 hover:text-red-600'} transition-all duration-200 rounded-b-xl`}
                                        >
                                            Logout
                                        </InertiaLink>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sticky Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 md:w-72 ${
                        isSidebarMinimized ? 'md:w-16' : 'md:w-72'
                    } ${
                        isDarkMode
                            ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white'
                            : 'bg-gradient-to-b from-white via-gray-50 to-white text-gray-800'
                    } shadow-xl p-4 space-y-6 transform transition-all duration-300 ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        {!isSidebarMinimized && (
                            <h2
                                className={`text-xl sm:text-2xl font-bold bg-clip-text text-transparent ${
                                    isDarkMode ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                }`}
                            >
                                Dashboard
                            </h2>
                        )}
                        <button
                            onClick={toggleSidebar}
                            className={`p-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} hidden md:block`}
                        >
                            <FontAwesomeIcon icon={isSidebarMinimized ? faChevronRight : faChevronLeft} className="text-lg" />
                        </button>
                        <button
                            onClick={toggleMobileSidebar}
                            className={`p-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} md:hidden`}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} className="text-lg" />
                        </button>
                    </div>
                    <nav>
                        <ul className="space-y-3">
                            <li>
                                <InertiaLink
                                    href="/dashboard"
                                    className={`flex items-center px-3 py-2 sm:px-4 sm:py-3 ${
                                        isDarkMode
                                            ? 'text-gray-200 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                                            : 'text-gray-700 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                    } rounded-xl transition-all duration-300 transform hover:scale-105`}
                                    onClick={() => setIsSidebarOpen(false)}
                                >
                                    <FontAwesomeIcon icon={faUser} className={isSidebarMinimized ? '' : 'mr-2 sm:mr-3'} />
                                    {!isSidebarMinimized && <span className="text-sm sm:text-base">Overview</span>}
                                </InertiaLink>
                            </li>
                            <li>
                                <button
                                    onClick={() => setIsProductsOpen(!isProductsOpen)}
                                    className={`w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 ${
                                        isDarkMode
                                            ? 'text-gray-200 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                                            : 'text-gray-700 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                    } rounded-xl transition-all duration-300 transform hover:scale-105`}
                                >
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faBell} className={isSidebarMinimized ? '' : 'mr-2 sm:mr-3'} />
                                        {!isSidebarMinimized && <span className="text-sm sm:text-base">Products</span>}
                                    </div>
                                    {!isSidebarMinimized && (
                                        <span className="transition-transform duration-300 text-xs sm:text-sm">
                                            {isProductsOpen ? '▼' : '▶'}
                                        </span>
                                    )}
                                </button>
                                {isProductsOpen && !isSidebarMinimized && (
                                    <ul className="ml-4 sm:ml-6 mt-2 space-y-2 animate-fade-in">
                                        <li>
                                            <InertiaLink
                                                href="/products"
                                                className={`block px-3 py-2 ${
                                                    isDarkMode ? 'text-gray-300 hover:bg-gray-700/70 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                                } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm`}
                                                onClick={() => setIsSidebarOpen(false)}
                                            >
                                                All Products
                                            </InertiaLink>
                                        </li>
                                        <li>
                                            <InertiaLink
                                                href="/products/create"
                                                className={`block px-3 py-2 ${
                                                    isDarkMode ? 'text-gray-300 hover:bg-gray-700/70 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                                } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm`}
                                                onClick={() => setIsSidebarOpen(false)}
                                            >
                                                Add Product
                                            </InertiaLink>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </nav>
                </aside>

                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                        onClick={toggleMobileSidebar}
                    ></div>
                )}

                {/* Scrollable Main Content */}
                <main
                    className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 w-full ${
                        isSidebarMinimized ? 'md:ml-16' : 'md:ml-72'
                    }`}
                >
                    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 transition-colors duration-300`}>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Dashboard Overview</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                            {["Total Sales", "Orders", "Products"].map((title, index) => (
                                <div
                                    key={index}
                                    className={`p-4 sm:p-6 ${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-indigo-500'} rounded-xl sm:rounded-2xl shadow-lg text-white`}
                                >
                                    <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2">
                                        {title === "Total Sales" ? "$12,345" : title === "Orders" ? "87" : "245"}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-opacity-50 rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6">
                            <Bar data={chartData} options={chartOptions} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
