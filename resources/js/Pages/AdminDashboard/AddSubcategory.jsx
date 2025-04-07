import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Inertia } from '@inertiajs/inertia';

const AddSubcategory = ({ auth, categories: initialCategories, subcategories: initialSubcategories, errors: initialErrors, flash }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(true); // Products menu starts open
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);
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
    const [activeLink, setActiveLink] = useState('add_subcategory'); // Track active link

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
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
                setIsProductsOpen(true); // Ensure Products menu stays open
                setActiveLink('add_subcategory'); // Maintain active link
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
                    setSubcategories(subcategories.map(s =>
                        s.id === subcategory.id ? { ...s, sub_category_name: editedSubcategoryName, category_id: editedCategoryId } : s
                    ));
                    setIsProductsOpen(true); // Ensure Products menu stays open
                    setActiveLink('add_subcategory'); // Maintain active link
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

    const handleDelete = (subcategoryId) => {
        if (window.confirm('Are you sure you want to delete this subcategory?')) {
            Inertia.delete(`/subcategories/${subcategoryId}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setValidationErrors({});
                    setSuccessMessage('Subcategory deleted successfully!');
                    setSubcategories(subcategories.filter(s => s.id !== subcategoryId));
                    setIsProductsOpen(true); // Ensure Products menu stays open
                    setActiveLink('add_subcategory'); // Maintain active link
                },
                onError: (errors) => {
                    setValidationErrors(errors);
                    setSuccessMessage(null);
                },
            });
        }
    };

    useEffect(() => {
        setSubcategories(initialSubcategories || []);
    }, [initialSubcategories]);

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
                                        <li key={subcategory.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}>
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
                                                    <span>{subcategory.sub_category_name} (Category: {initialCategories.find(cat => cat.id === subcategory.category_id)?.name || 'N/A'})</span>
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
                                                    onClick={() => handleDelete(subcategory.id)}
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
        </div>
    );
};

export default AddSubcategory;
