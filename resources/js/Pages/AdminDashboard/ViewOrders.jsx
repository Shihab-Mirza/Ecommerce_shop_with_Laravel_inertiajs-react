import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Inertia } from '@inertiajs/inertia';

const ViewOrders = ({ auth, orders, search: initialSearch, flash }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(false); // Products menu starts collapsed
    const [isHomepageOpen, setIsHomepageOpen] = useState(true); // Homepage menu starts open
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(initialSearch || '');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('view_orders');
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

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
        Inertia.get('/view_orders', { search: searchQuery }, {
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
        const currentPage = orders.current_page || 1;
        return (currentPage - 1) * perPage + index + 1;
    };

    const handleViewUpdate = (orderId) => {
        Inertia.get(`/orders/${orderId}/items`);
    };

    const handleDelete = (orderId) => {
        if (confirm('Are you sure you want to delete this order?')) {
            Inertia.delete(`/orders/${orderId}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Order deleted successfully');
                    setSuccessMessage('Order deleted successfully!');
                },
                onError: (errors) => {
                    console.error('Error deleting order:', errors);
                },
            });
        }
    };

    const dismissSuccessMessage = () => setSuccessMessage(null);

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
                            View All Orders
                        </h2>

                        {successMessage && (
                            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 border border-green-300 flex justify-between items-center">
                                <span>{successMessage}</span>
                                <button onClick={dismissSuccessMessage} className="text-green-800 hover:text-green-900">
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
                                    placeholder="Search orders by order ID, name, email, or status..."
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
                            <table className={`w-full table-auto text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} border-collapse`}>
                                <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} sticky top-0 z-10`}>
                                    <tr>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[60px] ">SI</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[100px] ">Order ID</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[120px] ">Name</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[120px] ">Email</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[100px] ">Phone</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[80px] ">Amount</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[150px] ">Address</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[100px] ">Payment Status</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[120px] ">Transaction ID</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[120px] ">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.data.map((order, index) => (
                                        <tr
                                            key={order.id}
                                            className={`transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-800' : 'bg-white') : (isDarkMode ? 'bg-gray-750' : 'bg-gray-50')}`}
                                        >
                                            <td className="py-2 px-2 sm:px-3 max-w-[60px] whitespace-normal break-all">{getSerialNumber(index)}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[100px] whitespace-normal break-all">{order.order_id}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[120px] whitespace-normal break-all">{order.name}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[120px] whitespace-normal break-all">{order.email}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[100px] whitespace-normal break-all">{order.phone}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[80px] whitespace-normal break-all">{parseFloat(order.amount).toFixed(2)}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[150px] whitespace-normal break-all">{order.address}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[100px] whitespace-normal break-all">{order.status}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[120px] whitespace-normal break-all">{order.transaction_id || 'N/A'}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[120px]">
                                                <div className="flex flex-col space-y-2">
                                                    <button
                                                        onClick={() => handleViewUpdate(order.id)}
                                                        className={`py-1 px-2 sm:px-3 rounded-lg text-xs font-semibold text-white ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} transition-all duration-200`}
                                                    >
                                                        View items
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(order.id)}
                                                        className={`py-1 px-2 sm:px-3 rounded-lg text-xs font-semibold text-white ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} transition-all duration-200`}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.data.length === 0 && (
                                        <tr>
                                            <td colSpan="10" className={`py-4 px-3 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                No orders found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-between items-center">
                            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                                Showing {orders.from || 0} to {orders.to || 0} of {orders.total} orders
                            </div>
                            <div className="flex space-x-2">
                                {orders.links.map((link, index) => (
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

export default ViewOrders;
