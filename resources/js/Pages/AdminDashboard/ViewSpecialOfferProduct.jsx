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

const ViewSpecialOfferProduct = ({ auth, products, categories, subcategories, brands, search: initialSearch, flash }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isHomepageOpen, setIsHomepageOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('view_special_offer_products');
  const [successMessage, setSuccessMessage] = useState(flash?.success || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

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

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
  const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSearch = (e) => {
    e.preventDefault();
    Inertia.get('/view_special_offer_products', { search: searchQuery }, {
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
    const currentPage = products.current_page || 1;
    return (currentPage - 1) * perPage + index + 1;
  };

  const handleViewUpdate = (productId) => {
    Inertia.get(`/special_offer_products/${productId}/edit`);
  };

  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProductId) {
      Inertia.delete(`/special_offer_products/${selectedProductId}`, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedProductId(null);
          setSuccessMessage('Product deleted successfully!');
        },
        onError: (errors) => {
          console.error('Error deleting product:', errors);
        },
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProductId(null);
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
              View Special Offer Products
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
                  placeholder="Search products by name, code, category, subcategory, or brand..."
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
                    <th className="py-3 px-3 text-left font-semibold w-12 text-base">SI</th>
                    <th className="py-3 px-3 text-left font-semibold w-16 text-base">Image</th>
                    <th className="py-3 px-3 text-left font-semibold max-w-xs text-base">Name</th>
                    <th className="py-3 px-3 text-left font-semibold w-24 text-base">Code</th>
                    <th className="py-3 px-3 text-left font-semibold w-20 text-base">Price</th>
                    <th className="py-3 px-3 text-left font-semibold w-28 text-base">Category</th>
                    <th className="py-3 px-3 text-left font-semibold w-28 text-base">Subcategory</th>
                    <th className="py-3 px-3 text-left font-semibold w-24 text-base">Brand</th>
                    <th className="py-3 px-3 text-left font-semibold w-20 text-base">Quantity</th>
                    <th className="py-3 px-3 text-left font-semibold w-32 text-base">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.data.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`transition-all duration-200 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${index % 2 === 0 ? (isDarkMode ? 'bg-gray-800' : 'bg-white') : (isDarkMode ? 'bg-gray-750' : 'bg-gray-50')}`}
                    >
                      <td className="py-3 px-3 w-12">{getSerialNumber(index)}</td>
                      <td className="py-3 px-3 w-16">
                        {product.image ? (
                          <img
                            src={`/storage/${product.image}`}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-full shadow-sm"
                          />
                        ) : (
                          <span className="text-gray-500">No Image</span>
                        )}
                      </td>
                      <td className="py-3 px-3 max-w-xs whitespace-normal">{product.name}</td>
                      <td className="py-3 px-3 w-24 whitespace-normal">{product.product_code}</td>
                      <td className="py-3 px-3 w-20 whitespace-normal">${parseFloat(product.price).toFixed(2)}</td>
                      <td className="py-3 px-3 w-28 whitespace-normal">{product.category?.name || 'N/A'}</td>
                      <td className="py-3 px-3 w-28 whitespace-normal">{product.subcategory?.sub_category_name || 'N/A'}</td>
                      <td className="py-3 px-3 w-24 whitespace-normal">{product.brand?.brand_name || 'N/A'}</td>
                      <td className="py-3 px-3 w-20">{product.quantity}</td>
                      <td className="py-3 px-3 w-32">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleViewUpdate(product.id)}
                            className={`py-1 px-3 rounded-lg text-xs font-semibold text-white ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} transition-all duration-200`}
                          >
                            View/Update
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product.id)}
                            className={`py-1 px-3 rounded-lg text-xs font-semibold text-white ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} transition-all duration-200`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.data.length === 0 && (
                    <tr>
                      <td colSpan="10" className={`py-4 px-3 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                Showing {products.from || 0} to {products.to || 0} of {products.total} products
              </div>
              <div className="flex space-x-2">
                {products.links.map((link, index) => (
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
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default ViewSpecialOfferProduct;
