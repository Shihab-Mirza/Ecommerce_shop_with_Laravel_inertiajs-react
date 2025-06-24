import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Inertia } from '@inertiajs/inertia';
import { FaEye, FaFileInvoice, FaTimes } from 'react-icons/fa';

// Modal Component
const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{message}</h3>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200 font-medium"
          >
            Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewDeliveredOrder = ({ auth, orders, search: initialSearch, flash }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isHomepageOpen, setIsHomepageOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(initialSearch || '');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('view_delivered_orders');
    const [successMessage, setSuccessMessage] = useState(flash?.success || null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

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
        Inertia.get('/view_delivered_orders', { search: searchQuery }, {
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
        Inertia.get(`/delivery_orders/${orderId}/items`);
    };

    const handleViewInvoice = (orderId) => {
        Inertia.get(`/orders/${orderId}/invoice`);
    };

    const handleCancelClick = (orderId) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const handleConfirmCancel = () => {
        if (selectedOrderId) {
            Inertia.post(`/orders/${selectedOrderId}/cancel`, {}, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setSuccessMessage('Order cancelled successfully!');
                    setIsModalOpen(false);
                    setSelectedOrderId(null);
                    setActiveLink('view_delivered_orders');
                },
                onError: () => {
                    setIsModalOpen(false);
                    setSelectedOrderId(null);
                },
            });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrderId(null);
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
                            View Delivered Orders
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
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[60px]">SI</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[100px]">Order ID</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[120px]">Name</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[120px]">Email</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[100px]">Phone</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[80px]">Amount</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[150px]">Order Type</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[100px]">Status</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[120px]">Delivery Status</th>
                                        <th className="py-2 px-2 sm:px-3 text-left font-semibold text-base max-w-[120px]">Actions</th>
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
                                            <td className="py-2 px-2 sm:px-3 max-w-[150px] whitespace-normal break-all">{order.order_type}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[100px] whitespace-normal break-all">{order.status}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[120px] whitespace-normal break-all">{order.delivery_status}</td>
                                            <td className="py-2 px-2 sm:px-3 max-w-[120px]">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleViewUpdate(order.id)}
                                                        className={`p-2 rounded-lg text-sm ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-all duration-200`}
                                                        title="View items"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    {['processing', 'completed'].includes(order.status.toLowerCase()) && (
                                                        <button
                                                            onClick={() => handleViewInvoice(order.id)}
                                                            className={`p-2 rounded-lg text-sm ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-all duration-200`}
                                                            title="Print Invoice"
                                                        >
                                                            <FaFileInvoice />
                                                        </button>
                                                    )}
                                                    {order.status.toLowerCase() !== 'cancelled' && (
                                                        <button
                                                            onClick={() => handleCancelClick(order.id)}
                                                            className={`p-2 rounded-lg text-sm ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white transition-all duration-200`}
                                                            title="Cancel"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    )}
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
                            <div className={`${isDarkMode ? 'text-geay-300' : 'text-gray-600'} text-sm`}>
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
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmCancel}
                message="Are you sure you want to cancel this order?"
            />
        </div>
    );
};

export default ViewDeliveredOrder;