import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { InertiaLink } from '@inertiajs/inertia-react';

const Modal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{message}</h3>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewReports = ({ auth, errors: initialErrors = {}, flash }) => {
  const [isProductsOpen, setIsProductsOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [validationErrors, setValidationErrors] = useState(initialErrors);
  const [successMessage, setSuccessMessage] = useState(flash || null);
  const [activeLink, setActiveLink] = useState('view_reports');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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
    // Handle validation errors from Inertia
    if (Object.keys(initialErrors).length > 0) {
      setValidationErrors(initialErrors);
      if (initialErrors.message) {
        setModalMessage(initialErrors.message);
        setIsModalOpen(true);
      }
    }
  }, [initialErrors]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
  const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const dismissSuccessMessage = () => {
    setSuccessMessage(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

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
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Generate Reports</h2>

            {successMessage && (
              <div
                className="mb-4 p-3 rounded-lg flex justify-between items-center bg-green-100 text-green-800 border-green-300"
              >
                <span>{successMessage}</span>
                <button
                  onClick={dismissSuccessMessage}
                  className="text-green-800 hover:text-green-900 font-semibold focus:outline-none"
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

            <form className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col w-full sm:w-1/2">
                  <label className="mb-1 font-medium">From Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
                <div className="flex flex-col w-full sm:w-1/2">
                  <label className="mb-1 font-medium">To Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                </div>
                <div className="flex items-end gap-4">
                  <InertiaLink
                    href={`/reports/pdf?from_date=${fromDate}&to_date=${toDate}`}
                    target="_blank"
                    className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700' : 'bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600'} text-white font-semibold transition-all duration-300 ${!fromDate || !toDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!fromDate || !toDate}
                  >
                    Generate Report
                  </InertiaLink>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        message={modalMessage || "An error occurred while generating the report."}
      />
    </div>
  );
};

export default ViewReports;