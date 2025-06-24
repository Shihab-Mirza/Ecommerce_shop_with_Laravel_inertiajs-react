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

const AddSocialComponent = ({ auth, footer: initialFooter, errors: initialErrors, flash }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [facebookLink, setFacebookLink] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [footerEntries, setFooterEntries] = useState(initialFooter || []);
  const [editingFooterId, setEditingFooterId] = useState(null);
  const [editedFacebookLink, setEditedFacebookLink] = useState('');
  const [editedContactNumber, setEditedContactNumber] = useState('');
  const [editedAddress, setEditedAddress] = useState('');
  const [validationErrors, setValidationErrors] = useState(initialErrors || {});
  const [successMessage, setSuccessMessage] = useState(flash || null);
  const [activeLink, setActiveLink] = useState('add_social');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFooterId, setSelectedFooterId] = useState(null);

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
    setFooterEntries(initialFooter || []);
  }, [initialFooter]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
  const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSubmitFooter = (e) => {
    e.preventDefault();
    Inertia.post('/footer', { facebook_link: facebookLink, contact_number: contactNumber, address }, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setFacebookLink('');
        setContactNumber('');
        setAddress('');
        setValidationErrors({});
        setSuccessMessage(page.props.flash || 'Footer entry added successfully!');
        setFooterEntries([...footerEntries, {
          id: page.props.footer.slice(-1)[0].id,
          facebook_link: facebookLink,
          contact_number: contactNumber,
          address,
        }]);
        setIsProductsOpen(false);
        setActiveLink('add_social');
      },
      onError: (errors) => {
        setValidationErrors(errors);
        setSuccessMessage(null);
      },
    });
  };

  const handleUpdate = (footer) => {
    if (editingFooterId === footer.id) {
      Inertia.put(`/footer/${footer.id}`, {
        facebook_link: editedFacebookLink,
        contact_number: editedContactNumber,
        address: editedAddress,
      }, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setEditingFooterId(null);
          setEditedFacebookLink('');
          setEditedContactNumber('');
          setEditedAddress('');
          setValidationErrors({});
          setSuccessMessage('Footer entry updated successfully!');
          setFooterEntries(footerEntries.map((f) =>
            f.id === footer.id ? { ...f, facebook_link: editedFacebookLink, contact_number: editedContactNumber, address: editedAddress } : f
          ));
          setIsProductsOpen(false);
          setActiveLink('add_social');
        },
        onError: (errors) => {
          setValidationErrors(errors);
          setSuccessMessage(null);
        },
      });
    } else {
      setEditingFooterId(footer.id);
      setEditedFacebookLink(footer.facebook_link || '');
      setEditedContactNumber(footer.contact_number || '');
      setEditedAddress(footer.address || '');
    }
  };

  const handleDeleteClick = (footerId) => {
    setSelectedFooterId(footerId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedFooterId) {
      Inertia.delete(`/footer/${selectedFooterId}`, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setValidationErrors({});
          setSuccessMessage('Footer entry deleted successfully!');
          setFooterEntries(footerEntries.filter((f) => f.id !== selectedFooterId));
          setIsModalOpen(false);
          setSelectedFooterId(null);
          setIsProductsOpen(false);
          setActiveLink('add_social');
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
    setSelectedFooterId(null);
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
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main
          className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 w-full ${isSidebarMinimized ? 'md:ml-16' : 'md:ml-72'}`}
        >
          <div className={`rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Manage Footer</h2>

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

            <form onSubmit={handleSubmitFooter} className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Add Footer Entry</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={facebookLink}
                    onChange={(e) => setFacebookLink(e.target.value)}
                    placeholder="Facebook Link (must be start with https://)"
                    className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="Contact Number"
                    className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600'} text-white font-semibold transition-all duration-300`}
                >
                  Add Footer Entry
                </button>
              </div>
            </form>

            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-4">Existing Footer Entries</h3>
              {footerEntries.length > 0 ? (
                <ul className="space-y-3">
                  {footerEntries.map((footer, index) => (
                    <li
                      key={footer.id}
                      className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}
                    >
                      <div className="flex-1 flex items-center gap-3">
                        <span className="font-semibold">{index + 1}.</span>
                        {editingFooterId === footer.id ? (
                          <div className="flex flex-col sm:flex-row gap-2 w-full">
                            <input
                              type="url"
                              value={editedFacebookLink}
                              onChange={(e) => setEditedFacebookLink(e.target.value)}
                              placeholder="Facebook Link"
                              className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            <input
                              type="text"
                              value={editedContactNumber}
                              onChange={(e) => setEditedContactNumber(e.target.value)}
                              placeholder="Contact Number"
                              className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                            <input
                              type="text"
                              value={editedAddress}
                              onChange={(e) => setEditedAddress(e.target.value)}
                              placeholder="Address"
                              className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            />
                          </div>
                        ) : (
                          <span className="flex flex-col sm:flex-row gap-2">
                            <span>Facebook: {footer.facebook_link || 'N/A'}</span>
                            <span>Contact: {footer.contact_number || 'N/A'}</span>
                            <span>Address: {footer.address || 'N/A'}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(footer)}
                          className={`p-2 rounded-lg text-sm ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-all duration-200`}
                          title={editingFooterId === footer.id ? 'Save' : 'Edit'}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(footer.id)}
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
                <p className="text-gray-500">No footer entries found.</p>
              )}
            </div>
          </div>
        </main>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this footer entry?"
      />
    </div>
  );
};

export default AddSocialComponent;
