import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Inertia } from '@inertiajs/inertia';

const ViewUserPoint = ({ auth, userPoints, search: initialSearch, flash }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(initialSearch || '');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('view_user_points');
    const [successMessage, setSuccessMessage] = useState(flash?.success || null);
    const [errorMessage, setErrorMessage] = useState(flash?.error || null);

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
        if (flash?.success) {
            setSuccessMessage(flash.success);
            const timer = setTimeout(() => setSuccessMessage(null), 5000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setErrorMessage(flash.error);
            const timer = setTimeout(() => setErrorMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
    const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
    const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleSearch = (e) => {
        e.preventDefault();
        Inertia.get('/view_user_points', { search: searchQuery }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (url) => {
        if (url) {
            Inertia.get(url, {}, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const getSerialNumber = (index) => {
        const perPage = 20;
        const currentPage = userPoints.current_page || 1;
        return (currentPage - 1) * perPage + index + 1;
    };

    const dismissSuccessMessage = () => setSuccessMessage(null);
    const dismissErrorMessage = () => setErrorMessage(null);

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
            <AdminNavbar
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
                <AdminSidebar
                    isDarkMode={isDarkMode}
                    isSidebarMinimized={isSidebarMinimized}
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    toggleMobileSidebar={toggleMobileSidebar}
                    isProductsOpen={isProductsOpen}
                    setIsProductsOpen={setIsProductsOpen}
                    activeLink={activeLink}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                <main
                    className={`flex-1 p-4 lg:p-6 transition-all duration-300 w-full ${isSidebarMinimized ? 'md:ml-16' : 'md:ml-72'}`}
                >
                    <div className={`max-w-full mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 transition-colors duration-300`}>
                        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                            User Points
                        </h2>

                        {successMessage && (
                            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 border border-green-300 flex justify-between items-center">
                                <span>{successMessage}</span>
                                <button onClick={dismissSuccessMessage} className="text-green-800 hover:text-green-900">
                                    ✕
                                </button>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 border border-red-300 flex justify-between items-center">
                                <span>{errorMessage}</span>
                                <button onClick={dismissErrorMessage} className="text-red-800 hover:text-red-900">
                                    ✕
                                </button>
                            </div>
                        )}

                        <form onSubmit={handleSearch} className="mb-6">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search users by name or email..."
                                    className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600 focus:ring-blue-500' : 'bg-gray-100 text-gray-800 border-gray-300 focus:ring-blue-400'} focus:ring-2 focus:border-transparent transition-all duration-200`}
                                />
                                <button
                                    type="submit"
                                    className={`ml-2 py-2.5 px-4 rounded-lg font-semibold text-white ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} transition-all duration-200 shadow-md`}
                                >
                                    Search
                                </button>
                            </div>
                        </form>

                        <div className="overflow-x-auto rounded-lg shadow-md">
                            <table className={`w-full table-auto text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} sticky top-0 z-10`}>
                                    <tr>
                                        <th className="py-3 px-3 text-left font-semibold w-12 text-base">S.No</th>
                                        <th className="py-3 px-3 text-left font-semibold max-w-xs text-base">Name</th>
                                        <th className="py-3 px-3 text-left font-semibold max-w-xs text-base">Email</th>
                                        <th className="py-3 px-3 text-left font-semibold w-32 text-base">User Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userPoints.data.map((point, index) => (
                                        <tr
                                            key={point.id}
                                            className={`transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-800' : 'bg-white') : (isDarkMode ? 'bg-gray-750' : 'bg-gray-50')}`}
                                        >
                                            <td className="py-3 px-3 w-12">{getSerialNumber(index)}</td>
                                            <td className="py-3 px-3 max-w-xs whitespace-normal">{point.user?.name || 'N/A'}</td>
                                            <td className="py-3 px-3 max-w-xs whitespace-normal">{point.user?.email || 'N/A'}</td>
                                            <td className="py-3 px-3 w-32">{point.user_point ?? '0'}</td>
                                        </tr>
                                    ))}
                                    {userPoints.data.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className={`py-4 px-3 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                No user points found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-between items-center">
                            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                                Showing {userPoints.from || 0} to {userPoints.to || 0} of {userPoints.total} entries
                            </div>
                            <div className="flex space-x-2">
                                {userPoints.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && handlePageChange(link.url)}
                                        className={`py-1.5 px-4 rounded-lg text-sm font-medium ${link.active ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : (isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')} ${!link.url ? 'cursor-not-allowed opacity-50' : ''} transition-all duration-200 shadow-sm hover:shadow-md`}
                                        disabled={!link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ViewUserPoint;
