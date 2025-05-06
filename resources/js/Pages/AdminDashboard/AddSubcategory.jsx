import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Inertia } from '@inertiajs/inertia';

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

const AddSubcategory = ({ auth, categories: initialCategories, subcategories: initialSubcategories, errors: initialErrors, flash }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategories, setSubcategories] = useState(initialSubcategories || []);
  const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);
  const [editedSubcategoryName, setEditedSubcategoryName] = useState("");
  const [editedCategoryId, setEditedCategoryId] = useState("");
  const [validationErrors, setValidationErrors] = useState(initialErrors || {});
  const [successMessage, setSuccessMessage] = useState(flash || null);
  const [activeLink, setActiveLink] = useState('add_subcategory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);

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
    setSubcategories(initialSubcategories || []);
  }, [initialSubcategories]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
  const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSubmit = (e) => {
    e.preventDefault();
    Inertia.post('/subcategories', { sub_category_name: subcategoryName, category_id: selectedCategory }, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setSubcategoryName('');
        setSelectedCategory('');
        setValidationErrors({});
        setSuccessMessage(page.props.flash || 'Subcategory added successfully!');
        setSubcategories([...subcategories, {
          id: page.props.subcategories.slice(-1)[0].id,
          sub_category_name: subcategoryName,
          category_id: selectedCategory
        }]);
        setIsProductsOpen(true);
        setActiveLink('add_subcategory');
      },
      onError: (errors) => {
        setValidationErrors(errors);
        setSuccessMessage(null);
      },
    });
  };

  const handleUpdate = (subcategory) => {
    if (editingSubcategoryId === subcategory.id) {
      Inertia.put(`/subcategories/${subcategory.id}`, {
        sub_category_name: editedSubcategoryName,
        category_id: editedCategoryId
      }, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setEditingSubcategoryId(null);
          setEditedSubcategoryName("");
          setEditedCategoryId("");
          setValidationErrors({});
          setSuccessMessage('Subcategory updated successfully!');
          setSubcategories(subcategories.map((s) =>
            s.id === subcategory.id ? { ...s, sub_category_name: editedSubcategoryName, category_id: editedCategoryId } : s
          ));
          setIsProductsOpen(true);
          setActiveLink('add_subcategory');
        },
        onError: (errors) => {
          setValidationErrors(errors);
          setSuccessMessage(null);
        },
      });
    } else {
      setEditingSubcategoryId(subcategory.id);
      setEditedSubcategoryName(subcategory.sub_category_name);
      setEditedCategoryId(subcategory.category_id);
    }
  };

  const handleDeleteClick = (subcategoryId) => {
    setSelectedSubcategoryId(subcategoryId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSubcategoryId) {
      Inertia.delete(`/subcategories/${selectedSubcategoryId}`, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setValidationErrors({});
          setSuccessMessage('Subcategory deleted successfully!');
          setSubcategories(subcategories.filter((s) => s.id !== selectedSubcategoryId));
          setIsModalOpen(false);
          setSelectedSubcategoryId(null);
          setIsProductsOpen(true);
          setActiveLink('add_subcategory');
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
    setSelectedSubcategoryId(null);
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
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Add New Subcategory</h2>

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

            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="text"
                  value={subcategoryName}
                  onChange={(e) => setSubcategoryName(e.target.value)}
                  placeholder="Enter subcategory name"
                  className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                >
                  <option value="">Select Category</option>
                  {initialCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600'} text-white font-semibold transition-all duration-300`}
                >
                  Add Subcategory
                </button>
              </div>
            </form>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Existing Subcategories</h3>
              {subcategories.length > 0 ? (
                <ul className="space-y-3">
                  {subcategories.map((subcategory, index) => (
                    <li
                      key={subcategory.id}
                      className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}
                    >
                      <div className="flex-1 flex items-center gap-3">
                        <span className="font-semibold">{index + 1}.</span>
                        {editingSubcategoryId === subcategory.id ? (
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <input
                              type="text"
                              value={editedSubcategoryName}
                              onChange={(e) => setEditedSubcategoryName(e.target.value)}
                              className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            <select
                              value={editedCategoryId}
                              onChange={(e) => setEditedCategoryId(e.target.value)}
                              className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            >
                              <option value="">Select Category</option>
                              {initialCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <span>{subcategory.sub_category_name} (Category: {initialCategories.find((cat) => cat.id === subcategory.category_id)?.name || 'N/A'})</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(subcategory)}
                          className={`px-3 py-1 rounded-lg ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-all duration-300`}
                        >
                          {editingSubcategoryId === subcategory.id ? 'Save' : 'Edit'}
                        </button>
                        <button
                          onClick={() => handleDeleteClick(subcategory.id)}
                          className={`px-3 py-1 rounded-lg ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white transition-all duration-300`}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No subcategories found.</p>
              )}
            </div>
          </div>
        </main>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this subcategory?"
      />
    </div>
  );
};

export default AddSubcategory;
