import React, { useState, useEffect } from 'react';
import DeliverySidebar from './DeliverySidebar';
import DeliveryNavbar from './DeliveryNavbar';

const DeliveryHomePage = ({ auth, pendingOrderCount }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);
    const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
    const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const dashboardCards = [
        {
            title: 'Pending Orders',
            value: pendingOrderCount,
            gradient: 'from-blue-400 to-indigo-500',
            darkGradient: 'from-blue-600 to-purple-600',
        },
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
            <DeliveryNavbar
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                toggleMobileSidebar={toggleMobileSidebar}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen}
                auth={auth}
            />
            <div className="flex">
                <DeliverySidebar
                    isSidebarMinimized={isSidebarMinimized}
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    toggleMobileSidebar={toggleMobileSidebar}
                    isProductsOpen={isProductsOpen}
                    setIsProductsOpen={setIsProductsOpen}
                    activeLink=""
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                <main
                    className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 w-full ${
                        isSidebarMinimized ? 'md:ml-16' : 'md:ml-72'
                    }`}
                >
                    <div
                        className={`${
                            isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
                        } rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 transition-colors duration-300`}
                    >
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
                            Dashboard Overview
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                            {dashboardCards.map((card, index) => (
                                <div
                                    key={index}
                                    className={`p-4 sm:p-6 ${
                                        isDarkMode
                                            ? `bg-gradient-to-br ${card.darkGradient}`
                                            : `bg-gradient-to-br ${card.gradient}`
                                    } rounded-xl sm:rounded-2xl shadow-lg text-white hover:shadow-xl transition-shadow duration-300`}
                                >
                                    <h3 className="text-base sm:text-lg font-semibold">{card.title}</h3>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1 sm:mt-2">
                                        {card.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DeliveryHomePage;
