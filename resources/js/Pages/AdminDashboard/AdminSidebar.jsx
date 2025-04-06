import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = ({
    isDarkMode,
    isSidebarMinimized,
    toggleSidebar,
    isSidebarOpen,
    toggleMobileSidebar,
    isProductsOpen,
    setIsProductsOpen,
    activeLink
}) => {
    return (
        <>
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
                                } rounded-xl transition-all duration-300 transform hover:scale-105 ${
                                    activeLink === 'dashboard' ? (isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white') : ''
                                }`}
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
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'products' ? (isDarkMode ? 'bg-gray-700/70 text-white' : 'bg-gray-200 text-gray-800') : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            All Products
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/add_category"
                                            className={`block px-3 py-2 ${
                                                isDarkMode ? 'text-gray-300 hover:bg-gray-700/70 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'add_category' ? (isDarkMode ? 'bg-gray-700/70 text-white' : 'bg-gray-200 text-gray-800') : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            Add new category
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/add_product"
                                            className={`block px-3 py-2 ${
                                                isDarkMode ? 'text-gray-300 hover:bg-gray-700/70 hover:text-white' : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'products/create' ? (isDarkMode ? 'bg-gray-700/70 text-white' : 'bg-gray-200 text-gray-800') : ''
                                            }`}
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
        </>
    );
};

export default AdminSidebar;
