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

const AddPointDiscount = ({ auth, earningRules: initialEarningRules, redeemRules: initialRedeemRules, errors: initialErrors, flash }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [earnTaka, setEarnTaka] = useState('');
  const [earnPoints, setEarnPoints] = useState('');
  const [redeemPoints, setRedeemPoints] = useState('');
  const [redeemTaka, setRedeemTaka] = useState('');
  const [earningRules, setEarningRules] = useState(initialEarningRules || []);
  const [redeemRules, setRedeemRules] = useState(initialRedeemRules || []);
  const [editingDiscountId, setEditingDiscountId] = useState(null);
  const [editedEarnPoints, setEditedEarnPoints] = useState('');
  const [editedEarnTaka, setEditedEarnTaka] = useState('');
  const [validationErrors, setValidationErrors] = useState(initialErrors || {});
  const [successMessage, setSuccessMessage] = useState(flash || null);
  const [activeLink, setActiveLink] = useState('add_point_discounts');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiscountId, setSelectedDiscountId] = useState(null);

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
    setEarningRules(initialEarningRules || []);
    setRedeemRules(initialRedeemRules || []);
  }, [initialEarningRules, initialRedeemRules]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
  const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSubmitEarnRule = (e) => {
    e.preventDefault();
    Inertia.post('/point-discounts/earn', { points_per_taka: earnPoints, taka_per_point: earnTaka }, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setEarnTaka('');
        setEarnPoints('');
        setValidationErrors({});
        setSuccessMessage(page.props.flash || 'Earn rule added successfully!');
        setEarningRules([...earningRules, {
          id: page.props.earningRules.slice(-1)[0].id,
          points_per_taka: earnPoints,
          taka_per_point: earnTaka,
        }]);
        setIsProductsOpen(false);
        setActiveLink('add_point_discount');
      },
      onError: (errors) => {
        setValidationErrors(errors);
        setSuccessMessage(null);
      },
    });
  };

  const handleSubmitRedeemRule = (e) => {
    e.preventDefault();
    Inertia.post('/point-discounts/redeem', { points_per_taka: redeemPoints, taka_per_point: redeemTaka }, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setRedeemPoints('');
        setRedeemTaka('');
        setValidationErrors({});
        setSuccessMessage(page.props.flash || 'Redeem rule added successfully!');
        setRedeemRules([...redeemRules, {
          id: page.props.redeemRules.slice(-1)[0].id,
          points_per_taka: redeemPoints,
          taka_per_point: redeemTaka,
        }]);
        setIsProductsOpen(false);
        setActiveLink('add_point_discounts');
      },
      onError: (errors) => {
        setValidationErrors(errors);
        setSuccessMessage(null);
      },
    });
  };

  const handleUpdate = (discount, isEarnRule) => {
    if (editingDiscountId === discount.id) {
      Inertia.put(`/point-discounts/${discount.id}`, {
        points_per_taka: editedEarnPoints,
        taka_per_point: editedEarnTaka,
      }, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setEditingDiscountId(null);
          setEditedEarnPoints('');
          setEditedEarnTaka('');
          setValidationErrors({});
          setSuccessMessage('Point discount updated successfully!');
          if (isEarnRule) {
            setEarningRules(earningRules.map((disc) =>
              disc.id === discount.id ? { ...disc, points_per_taka: editedEarnPoints, taka_per_point: editedEarnTaka } : disc
            ));
          } else {
            setRedeemRules(redeemRules.map((disc) =>
              disc.id === discount.id ? { ...disc, points_per_taka: editedEarnPoints, taka_per_point: editedEarnTaka } : disc
            ));
          }
          setIsProductsOpen(false);
          setActiveLink('add_point_discounts');
        },
        onError: (errors) => {
          setValidationErrors(errors);
          setSuccessMessage(null);
        },
      });
    } else {
      setEditingDiscountId(discount.id);
      setEditedEarnPoints(discount.points_per_taka);
      setEditedEarnTaka(discount.taka_per_point);
    }
  };

  const handleDeleteClick = (discountId) => {
    setSelectedDiscountId(discountId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDiscountId) {
      Inertia.delete(`/point-discounts/${selectedDiscountId}`, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setValidationErrors({});
          setSuccessMessage('Point discount deleted successfully!');
          setEarningRules(earningRules.filter((disc) => disc.id !== selectedDiscountId));
          setRedeemRules(redeemRules.filter((disc) => disc.id !== selectedDiscountId));
          setIsModalOpen(false);
          setSelectedDiscountId(null);
          setIsProductsOpen(false);
          setActiveLink('add_point_discount');
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
    setSelectedDiscountId(null);
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
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Manage Point Discounts</h2>

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

            <form onSubmit={handleSubmitEarnRule} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Add Earn Rule</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="number"
                    value={earnTaka}
                    onChange={(e) => setEarnTaka(e.target.value)}
                    placeholder="Minimum Taka to earn points"
                    className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="number"
                    value={earnPoints}
                    onChange={(e) => setEarnPoints(e.target.value)}
                    placeholder="Points earned per minimum Taka"
                    className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600'} text-white font-semibold transition-all duration-300`}
                >
                  Add Earn Rule
                </button>
              </div>
            </form>

            <form onSubmit={handleSubmitRedeemRule} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Add Redeem Rule</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="number"
                    value={redeemPoints}
                    onChange={(e) => setRedeemPoints(e.target.value)}
                    placeholder="Points to redeem for discount"
                    className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="number"
                    value={redeemTaka}
                    onChange={(e) => setRedeemTaka(e.target.value)}
                    placeholder="Discount Taka for points"
                    className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700' : 'bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600'} text-white font-semibold transition-all duration-300`}
                >
                  Add Redeem Rule
                </button>
              </div>
            </form>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Existing Earning Rules</h3>
              {earningRules.length > 0 ? (
                <ul className="space-y-3">
                  {earningRules.map((discount, index) => (
                    <li
                      key={discount.id}
                      className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}
                    >
                      <div className="flex-1 flex items-center gap-3">
                        <span className="font-semibold">{index + 1}.</span>
                        {editingDiscountId === discount.id ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={editedEarnPoints}
                              onChange={(e) => setEditedEarnPoints(e.target.value)}
                              placeholder="Points per Taka"
                              className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              min="0"
                              step="0.01"
                            />
                            <input
                              type="number"
                              value={editedEarnTaka}
                              onChange={(e) => setEditedEarnTaka(e.target.value)}
                              placeholder="Taka per point"
                              className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        ) : (
                          <span>User get {discount.points_per_taka} points per {discount.taka_per_point} Taka spent</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(discount, true)}
                          className={`p-2 rounded-lg text-sm ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-all duration-200`}
                          title={editingDiscountId === discount.id ? 'Save' : 'Edit'}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(discount.id)}
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
                <p className="text-gray-500">No earning rules found.</p>
              )}
            </div>

            <div className="mt-8">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Existing Redeem Rules</h3>
              {redeemRules.length > 0 ? (
                <ul className="space-y-3">
                  {redeemRules.map((discount, index) => (
                    <li
                      key={discount.id}
                      className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}
                    >
                      <div className="flex-1 flex items-center gap-3">
                        <span className="font-semibold">{index + 1}.</span>
                        {editingDiscountId === discount.id ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={editedEarnPoints}
                              onChange={(e) => setEditedEarnPoints(e.target.value)}
                              placeholder="Points per Taka"
                              className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              min="0"
                              step="0.01"
                            />
                            <input
                              type="number"
                              value={editedEarnTaka}
                              onChange={(e) => setEditedEarnTaka(e.target.value)}
                              placeholder="Taka per point"
                              className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              min="0"
                              step="0.01"
                            />
                          </div>
                        ) : (
                          <span>User get {discount.taka_per_point} taka discount per {discount.points_per_taka} points </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(discount, false)}
                          className={`p-2 rounded-lg text-sm ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-all duration-200`}
                          title={editingDiscountId === discount.id ? 'Save' : 'Edit'}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(discount.id)}
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
                <p className="text-gray-500">No redeem rules found.</p>
              )}
            </div>
          </div>
        </main>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this point rule?"
      />
    </div>
  );
};

export default AddPointDiscount;