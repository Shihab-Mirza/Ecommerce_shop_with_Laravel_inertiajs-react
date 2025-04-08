import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Inertia } from '@inertiajs/inertia';

const AddCategory = ({ auth, categories: initialCategories, errors: initialErrors, flash }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(true); // Products menu starts open
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState(initialCategories || []);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editedCategoryName, setEditedCategoryName] = useState("");
    const [validationErrors, setValidationErrors] = useState(initialErrors || {});
    const [successMessage, setSuccessMessage] = useState(flash || null);
    const [activeLink, setActiveLink] = useState('add_category'); // Track active link


    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        document.documentElement.classList.toggle('dark', isDarkMode);

        // Listen for dark mode changes from other components
        const handleDarkModeChange = (event) => {
            setIsDarkMode(event.detail);
        };
        window.addEventListener('darkModeChange', handleDarkModeChange);

        // Cleanup listener on unmount
        return () => {
            window.removeEventListener('darkModeChange', handleDarkModeChange);
        };
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
    const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post('/categories', { name: categoryName }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                setCategoryName('');
                setValidationErrors({});
                setSuccessMessage(page.props.flash || 'Category added successfully!');
                setCategories([...categories, { id: page.props.categories.slice(-1)[0].id, name: categoryName }]);
                setIsProductsOpen(true); // Ensure Products menu stays open
                setActiveLink('add_category'); // Maintain active link
            },
            onError: (errors) => {
                setValidationErrors(errors);
                setSuccessMessage(null);
            },
        });
    };

    const handleUpdate = (category) => {
        if (editingCategoryId === category.id) {
            Inertia.put(`/categories/${category.id}`, { name: editedCategoryName }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setEditingCategoryId(null);
                    setEditedCategoryName("");
                    setValidationErrors({});
                    setSuccessMessage('Category updated successfully!');
                    setCategories(categories.map(cat =>
                        cat.id === category.id ? { ...cat, name: editedCategoryName } : cat
                    ));
                    setIsProductsOpen(true); // Ensure Products menu stays open
                    setActiveLink('add_category'); // Maintain active link
                },
                onError: (errors) => {
                    setValidationErrors(errors);
                    setSuccessMessage(null);
                },
            });
        } else {
            setEditingCategoryId(category.id);
            setEditedCategoryName(category.name);
        }
    };

    const handleDelete = (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            Inertia.delete(`/categories/${categoryId}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setValidationErrors({});
                    setSuccessMessage('Category deleted successfully!');
                    setCategories(categories.filter(cat => cat.id !== categoryId));
                    setIsProductsOpen(true); // Ensure Products menu stays open
                    setActiveLink('add_category'); // Maintain active link
                },
                onError: (errors) => {
                    setValidationErrors(errors);
                    setSuccessMessage(null);
                },
            });
        }
    };

    useEffect(() => {
        setCategories(initialCategories || []);
    }, [initialCategories]);

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
                    activeLink={activeLink} // Pass activeLink to Sidebar
                />

                <main
                    className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 w-full ${isSidebarMinimized ? 'md:ml-16' : 'md:ml-72'}`}
                >
                    <div className={`rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 lg:p-8 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Add New Category</h2>

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
                                    value={categoryName}
                                    onChange={(e) => setCategoryName(e.target.value)}
                                    placeholder="Enter category name"
                                    className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    required
                                />
                                <button
                                    type="submit"
                                    className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600'} text-white font-semibold transition-all duration-300`}
                                >
                                    Add Category
                                </button>
                            </div>
                        </form>

                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-4">Existing Categories</h3>
                            {categories.length > 0 ? (
                                <ul className="space-y-3">
                                    {categories.map((category, index) => (
                                        <li key={category.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}>
                                            <div className="flex-1 flex items-center gap-3">
                                                <span className="font-semibold">{index + 1}.</span>
                                                {editingCategoryId === category.id ? (
                                                    <input
                                                        type="text"
                                                        value={editedCategoryName}
                                                        onChange={(e) => setEditedCategoryName(e.target.value)}
                                                        className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                    />
                                                ) : (
                                                    <span>{category.name}</span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdate(category)}
                                                    className={`px-3 py-1 rounded-lg ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-all duration-300`}
                                                >
                                                    {editingCategoryId === category.id ? 'Save' : 'Edit'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className={`px-3 py-1 rounded-lg ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white transition-all duration-300`}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No categories found.</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AddCategory;
