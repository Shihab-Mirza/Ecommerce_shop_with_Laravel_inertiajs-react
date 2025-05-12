import React, { useState, useEffect } from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const DeliverySidebar = ({
    isSidebarMinimized,
    toggleSidebar,
    isSidebarOpen,
    toggleMobileSidebar,
    activeLink,
    setIsSidebarOpen,
}) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isOrdersOpen, setIsOrdersOpen] = useState(() => {
        const savedState = localStorage.getItem('isOrdersOpen');
        const isOrdersActive = ['view_orders', 'view_delivered_orders'].includes(activeLink);
        return savedState ? JSON.parse(savedState) : isOrdersActive;
    });

    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        document.documentElement.classList.toggle('dark', isDarkMode);

        const handleDarkModeChange = (event) => {
            setIsDarkMode(event.detail);
        };
        window.addEventListener('darkModeChange', handleDarkModeChange);

        return () => {
            window.removeEventListener('darkModeChange', handleDarkModeChange);
        };
    }, [isDarkMode]);

    useEffect(() => {
        localStorage.setItem('isOrdersOpen', JSON.stringify(isOrdersOpen));
    }, [isOrdersOpen]);

    useEffect(() => {
        const isOrdersActive = ['view_orders', 'view_delivered_orders'].includes(activeLink);
        setIsOrdersOpen((prev) => isOrdersActive || prev);
    }, [activeLink]);

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
                } overflow-y-auto`}
            >
                <div className="flex items-center justify-between">
                    {!isSidebarMinimized && (
                        <h2
                            className={`text-xl sm:text-2xl font-bold bg-clip-text text-transparent ${
                                isDarkMode
                                    ? 'bg-gradient-to-r from-blue-400 to-purple-500'
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
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
                            <button
                                onClick={() => setIsOrdersOpen(!isOrdersOpen)}
                                className={`w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 ${
                                    isDarkMode
                                        ? 'text-gray-200 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                                        : 'text-gray-700 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                } rounded-xl transition-all duration-300 transform hover:scale-105`}
                            >
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faShoppingCart} className={isSidebarMinimized ? '' : 'mr-2 sm:mr-3'} />
                                    {!isSidebarMinimized && <span className="text-sm sm:text-base">View Orders</span>}
                                </div>
                                {!isSidebarMinimized && (
                                    <span className="transition-transform duration-300 text-xs sm:text-sm">
                                        {isOrdersOpen ? '▼' : '▶'}
                                    </span>
                                )}
                            </button>
                            {isOrdersOpen && !isSidebarMinimized && (
                                <ul className="ml-4 sm:ml-6 mt-2 space-y-2 animate-fade-in">
                                      <li>
                                        <InertiaLink
                                            href="/view_pending_orders"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'view_delivered_orders'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            View Pending Orders
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/view_completed_orders"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'view_orders'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            View Completed Orders
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

export default DeliverySidebar;
