import React, { useEffect, useState } from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faMoon, faSun, faBars } from '@fortawesome/free-solid-svg-icons';

const DeliveryNavbar = ({
    isProfileOpen,
    setIsProfileOpen,
    auth,
    toggleMobileSidebar,
}) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', JSON.stringify(newMode));
            window.dispatchEvent(new CustomEvent('darkModeChange', { detail: newMode }));
            return newMode;
        });
    };

    useEffect(() => {
        document.documentElement.classList.toggle('dark', isDarkMode);
    }, [isDarkMode]);

    return (
        <nav className={`${isDarkMode ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-r from-white via-gray-50 to-white'} shadow-lg sticky top-0 z-50 transition-all duration-500`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleMobileSidebar}
                            className="md:hidden p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
                        >
                            <FontAwesomeIcon icon={faBars} className="text-xl" />
                        </button>
                        <h1 className={`text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent ${isDarkMode ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500' : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'} animate-pulse tracking-wider`}>
                            Computer Store
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
                        <button className={`p-2 sm:p-3 rounded-full ${isDarkMode ? 'bg-gray-800/50 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600' : 'bg-gray-100 hover:bg-gradient-to-br hover:from-blue-400 hover:to-indigo-500'} transform hover:scale-110 transition-all duration-300 group relative`}>
                            <FontAwesomeIcon icon={faBell} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} group-hover:text-white`} />
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white opacity-75">3</span>
                        </button>
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 sm:p-3 rounded-full ${isDarkMode ? 'bg-gray-800/50 hover:bg-gradient-to-br hover:from-blue-600 hover:to-purple-600' : 'bg-gray-100 hover:bg-gradient-to-br hover:from-blue-400 hover:to-indigo-500'} transform hover:scale-110 transition-all duration-300 group`}
                        >
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
                                    <InertiaLink
                                        href="/profile"
                                        className={`block px-4 sm:px-5 py-2 ${isDarkMode ? 'text-gray-200 border-b-gray-800' : 'text-gray-800 border-b-gray-200'} font-medium border-b`}
                                    >
                                        {auth.user.name}
                                    </InertiaLink>
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
    );
};

export default DeliveryNavbar;
