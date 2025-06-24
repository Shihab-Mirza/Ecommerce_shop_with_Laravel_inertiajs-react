import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Inertia } from '@inertiajs/inertia';

const ViewDeliveredOrderItem = ({ auth, orderItems, orderId, flash }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isHomepageOpen, setIsHomepageOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('view_delivered_orders');
    const [successMessage, setSuccessMessage] = useState(flash?.success || null);

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
    }, [flash]);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);
    const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
    const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const dismissSuccessMessage = () => setSuccessMessage(null);

    const getSerialNumber = (index) => {
        return index + 1;
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
            <AdminNavbar
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                toggleMobileSidebar={toggleMobileSidebar}
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
                    isHomepageOpen={isHomepageOpen}
                    setIsHomepageOpen={setIsHomepageOpen}
                    activeLink={activeLink}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                <main
                    className={`flex-1 p-4 lg:p-6 transition-all duration-300 w-full ${isSidebarMinimized ? 'md:ml-16' : 'md:ml-72'}`}
                >
                    <div className={`max-w-full mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 transition-colors duration-300`}>
                        <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                            Order Items (Order ID: {orderId})
                        </h2>

                        {successMessage && (
                            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 border border-green-300 flex justify-between items-center">
                                <span>{successMessage}</span>
                                <button onClick={dismissSuccessMessage} className="text-green-800 hover:text-green-900">
                                    ✕
                                </button>
                            </div>
                        )}

                        <div className="overflow-x-auto rounded-lg shadow-md">
                            <table className={`w-full table-auto text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} border-collapse`}>
                                <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} sticky top-0 z-10`}>
                                    <tr>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[60px]">SI</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[100px]">Product Image</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[100px]">Product Code</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[150px]">Product Name</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[80px]">Quantity</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[100px]">Unit Price</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[100px]">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderItems.map((item, index) => (
                                        <tr
                                            key={item.id}
                                            className={`transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-800' : 'bg-white') : (isDarkMode ? 'bg-gray-750' : 'bg-gray-50')}`}
                                        >
                                            <td className="py-2 px-2 sm:px-3 max-w-[60px] whitespace-normal break-all">{getSerialNumber(index)}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[100px]">
                                                {item.product.image ? (
                                                    <img
                                                        src={`/storage/${item.product.image}`}
                                                        alt={item.product.name}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                ) : (
                                                    <span className="text-gray-500">No Image</span>
                                                )}
                                            </td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[100px] whitespace-normal break-all">{item.product.product_code}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[150px] whitespace-normal break-all">{item.product.name}</td>

                                            <td className="py-2 px-2 sm:px-3 max-w-[80px] whitespace-normal break-all">{item.quantity}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[100px] whitespace-normal break-all">{parseFloat(item.unit_price).toFixed(2)}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[100px] whitespace-normal break-all">{parseFloat(item.subtotal).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {orderItems.length === 0 && (
                                        <tr>
                                            <td colSpan="7" className={`py-4 px-3 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                No items found for this order.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => Inertia.get('/view_delivered_orders')}
                                className={`py-2 px-4 rounded-lg text-sm font-semibold text-white ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} transition-all duration-200`}
                            >
                                Back to Delivered Orders
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ViewDeliveredOrderItem;
