import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Inertia } from '@inertiajs/inertia';
import { FaEdit, FaTrash } from 'react-icons/fa';

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
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const AddVoucherComponent = ({ auth, vouchers: initialVouchers, errors: initialErrors, flash }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState('');
  const [vouchers, setVouchers] = useState(initialVouchers || []);
  const [editingVoucherId, setEditingVoucherId] = useState(null);
  const [editedVoucherCode, setEditedVoucherCode] = useState('');
  const [editedVoucherDiscount, setEditedVoucherDiscount] = useState('');
  const [validationErrors, setValidationErrors] = useState(initialErrors || {});
  const [successMessage, setSuccessMessage] = useState(flash || null);
  const [activeLink, setActiveLink] = useState('add_vouchers');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);

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
    setVouchers(initialVouchers || []);
  }, [initialVouchers]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
  const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSubmitVoucher = (e) => {
    e.preventDefault();
    Inertia.post('/vouchers', { voucher_code: voucherCode, voucher_discount: voucherDiscount }, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setVoucherCode('');
        setVoucherDiscount('');
        setValidationErrors({});
        setSuccessMessage(page.props.flash || 'Voucher added successfully!');
        setVouchers([...vouchers, {
          id: page.props.vouchers.slice(-1)[0].id,
          voucher_code: voucherCode,
          voucher_discount: voucherDiscount,
        }]);
        setIsProductsOpen(false);
        setActiveLink('add_vouchers');
      },
      onError: (errors) => {
        setValidationErrors(errors);
        setSuccessMessage(null);
      },
    });
  };

  const handleUpdate = (voucher) => {
    if (editingVoucherId === voucher.id) {
      Inertia.put(`/vouchers/${voucher.id}`, {
        voucher_code: editedVoucherCode,
        voucher_discount: editedVoucherDiscount,
      }, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setEditingVoucherId(null);
          setEditedVoucherCode('');
          setEditedVoucherDiscount('');
          setValidationErrors({});
          setSuccessMessage('Voucher updated successfully!');
          setVouchers(vouchers.map((v) =>
            v.id === voucher.id ? { ...v, voucher_code: editedVoucherCode, voucher_discount: editedVoucherDiscount } : v
          ));
          setIsProductsOpen(false);
          setActiveLink('add_vouchers');
        },
        onError: (errors) => {
          setValidationErrors(errors);
          setSuccessMessage(null);
        },
      });
    } else {
      setEditingVoucherId(voucher.id);
      setEditedVoucherCode(voucher.voucher_code);
      setEditedVoucherDiscount(voucher.voucher_discount);
    }
  };

  const handleDeleteClick = (voucherId) => {
    setSelectedVoucherId(voucherId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedVoucherId) {
      Inertia.delete(`/vouchers/${selectedVoucherId}`, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setValidationErrors({});
          setSuccessMessage('Voucher deleted successfully!');
          setVouchers(vouchers.filter((v) => v.id !== selectedVoucherId));
          setIsModalOpen(false);
          setSelectedVoucherId(null);
          setIsProductsOpen(false);
          setActiveLink('add_vouchers');
        },
        onError: (errors) => {
          setValidationErrors(errors);
          setSuccessMessage(null);
        },
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVoucherId(null);
  };

  const dismissSuccessMessage = () => {
    setSuccessMessage(null);
  };

  const isDeleteMessage = successMessage && successMessage.toLowerCase().includes('deleted');

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300`}>
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
        />
        <main
          className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 w-full ${isSidebarMinimized ? 'md:ml-16' : 'md:ml-72'}`}
        >
          <div className={`rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Manage Vouchers</h2>

            {successMessage && (
              <div
                className={`mb-4 p-3 rounded-lg flex justify-between items-center ${
                  isDeleteMessage
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : 'bg-green-100 text-green-800 border-green-300'
                }`}
              >
                <span>{successMessage}</span>
                <button
                  onClick={dismissSuccessMessage}
                  className={`${
                    isDeleteMessage ? 'text-red-800 hover:text-red-900' : 'text-green-800 hover:text-green-900'
                  } font-semibold focus:outline-none`}
                >
                  ✕
                </button>
              </div>
            )}

            {Object.keys(validationErrors).length > 0 && (
              <div className="mb-4 text-red-600">
                {Object.values(validationErrors).map((error, index) => (
                  <p key={index}>{error}</p>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmitVoucher} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Add Voucher</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Voucher Code"
                    className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                  <input
                    type="number"
                    value={voucherDiscount}
                    onChange={(e) => setVoucherDiscount(e.target.value)}
                    placeholder="Discount Percentage"
                    className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600'} text-white font-semibold transition-all duration-300`}
                >
                  Add Voucher
                </button>
              </div>
            </form>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Existing Vouchers</h3>
              {vouchers.length > 0 ? (
                <ul className="space-y-3">
                  {vouchers.map((voucher, index) => (
                    <li
                      key={voucher.id}
                      className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}
                    >
                      <div className="flex-1 flex items-center gap-3">
                        <span className="font-semibold">{index + 1}.</span>
                        {editingVoucherId === voucher.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={editedVoucherCode}
                              onChange={(e) => setEditedVoucherCode(e.target.value)}
                              placeholder="Voucher Code"
                              className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            <input
                              type="number"
                              value={editedVoucherDiscount}
                              onChange={(e) => setEditedVoucherDiscount(e.target.value)}
                              placeholder="Discount Percentage"
                              className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              min="0"
                              max="100"
                              step="0.01"
                            />
                          </div>
                        ) : (
                          <span>
                            Code: {voucher.voucher_code} - Discount: {voucher.voucher_discount}%
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(voucher)}
                          className={`p-2 rounded-lg text-sm ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-all duration-200`}
                          title={editingVoucherId === voucher.id ? 'Save' : 'Edit'}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(voucher.id)}
                          className={`p-2 rounded-lg text-sm ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white transition-all duration-200`}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No vouchers found.</p>
              )}
            </div>
          </div>
        </main>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this voucher?"
      />
    </div>
  );
};

export default AddVoucherComponent;