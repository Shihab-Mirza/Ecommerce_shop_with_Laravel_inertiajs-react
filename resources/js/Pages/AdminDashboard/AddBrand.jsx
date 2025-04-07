import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Inertia } from '@inertiajs/inertia';

const AddBrand = ({ auth, categories: initialCategories, subcategories: initialSubcategories, brands: initialBrands, errors: initialErrors, flash }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [brandName, setBrandName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [brands, setBrands] = useState(initialBrands || []);
    const [editingBrandId, setEditingBrandId] = useState(null);
    const [editedBrandName, setEditedBrandName] = useState("");
    const [editedCategoryId, setEditedCategoryId] = useState("");
    const [editedSubcategoryId, setEditedSubcategoryId] = useState("");
    const [validationErrors, setValidationErrors] = useState(initialErrors || {});
    const [successMessage, setSuccessMessage] = useState(flash || null);
    const [activeLink, setActiveLink] = useState('add_brand');

    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
    const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
    const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // Filter subcategories based on selected category
    const filteredSubcategories = initialSubcategories.filter(sub => sub.category_id === parseInt(selectedCategory));

    const handleSubmit = (e) => {
        e.preventDefault();
        Inertia.post('/brands', {
            brand_name: brandName,
            category_id: selectedCategory,
            subcategory_id: selectedSubcategory
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                setBrandName('');
                setSelectedCategory('');
                setSelectedSubcategory('');
                setValidationErrors({});
                setSuccessMessage(page.props.flash || 'Brand added successfully!');
                setBrands([...brands, {
                    id: page.props.brands.slice(-1)[0].id,
                    brand_name: brandName,
                    category_id: selectedCategory,
                    subcategory_id: selectedSubcategory
                }]);
                setIsProductsOpen(true);
                setActiveLink('add_brand');
            },
            onError: (errors) => {
                setValidationErrors(errors);
                setSuccessMessage(null);
            },
        });
    };

    const handleUpdate = (brand) => {
        if (editingBrandId === brand.id) {
            Inertia.put(`/brands/${brand.id}`, {
                brand_name: editedBrandName,
                category_id: editedCategoryId,
                subcategory_id: editedSubcategoryId
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setEditingBrandId(null);
                    setEditedBrandName("");
                    setEditedCategoryId("");
                    setEditedSubcategoryId("");
                    setValidationErrors({});
                    setSuccessMessage('Brand updated successfully!');
                    setBrands(brands.map(b =>
                        b.id === brand.id ? { ...b, brand_name: editedBrandName, category_id: editedCategoryId, subcategory_id: editedSubcategoryId } : b
                    ));
                    setIsProductsOpen(true);
                    setActiveLink('add_brand');
                },
                onError: (errors) => {
                    setValidationErrors(errors);
                    setSuccessMessage(null);
                },
            });
        } else {
            setEditingBrandId(brand.id);
            setEditedBrandName(brand.brand_name);
            setEditedCategoryId(brand.category_id);
            setEditedSubcategoryId(brand.subcategory_id || "");
        }
    };

    const handleDelete = (brandId) => {
        if (window.confirm('Are you sure you want to delete this brand?')) {
            Inertia.delete(`/brands/${brandId}`, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    setValidationErrors({});
                    setSuccessMessage('Brand deleted successfully!');
                    setBrands(brands.filter(b => b.id !== brandId));
                    setIsProductsOpen(true);
                    setActiveLink('add_brand');
                },
                onError: (errors) => {
                    setValidationErrors(errors);
                    setSuccessMessage(null);
                },
            });
        }
    };

    useEffect(() => {
        setBrands(initialBrands || []);
    }, [initialBrands]);

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
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Add New Brand</h2>

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
                                    value={brandName}
                                    onChange={(e) => setBrandName(e.target.value)}
                                    placeholder="Enter brand name"
                                    className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    required
                                />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        setSelectedSubcategory(""); // Reset subcategory when category changes
                                    }}
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
                                <select
                                    value={selectedSubcategory}
                                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                                    className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    disabled={!selectedCategory} // Disable if no category is selected
                                >
                                    <option value="">Select Subcategory</option>
                                    {filteredSubcategories.map((subcategory) => (
                                        <option key={subcategory.id} value={subcategory.id}>
                                            {subcategory.sub_category_name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600'} text-white font-semibold transition-all duration-300`}
                                >
                                    Add Brand
                                </button>
                            </div>
                        </form>

                        <div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-4">Existing Brands</h3>
                            {brands.length > 0 ? (
                                <ul className="space-y-3">
                                    {brands.map((brand, index) => (
                                        <li key={brand.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-between`}>
                                            <div className="flex-1 flex items-center gap-3">
                                                <span className="font-semibold">{index + 1}.</span>
                                                {editingBrandId === brand.id ? (
                                                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                                                        <input
                                                            type="text"
                                                            value={editedBrandName}
                                                            onChange={(e) => setEditedBrandName(e.target.value)}
                                                            className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                        />
                                                        <select
                                                            value={editedCategoryId}
                                                            onChange={(e) => {
                                                                setEditedCategoryId(e.target.value);
                                                                setEditedSubcategoryId(""); // Reset subcategory when category changes
                                                            }}
                                                            className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                        >
                                                            <option value="">Select Category</option>
                                                            {initialCategories.map((category) => (
                                                                <option key={category.id} value={category.id}>
                                                                    {category.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            value={editedSubcategoryId}
                                                            onChange={(e) => setEditedSubcategoryId(e.target.value)}
                                                            className={`flex-1 p-2 rounded-lg ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-white text-gray-800 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                            disabled={!editedCategoryId}
                                                        >
                                                            <option value="">Select Subcategory</option>
                                                            {initialSubcategories.filter(sub => sub.category_id === parseInt(editedCategoryId)).map((subcategory) => (
                                                                <option key={subcategory.id} value={subcategory.id}>
                                                                    {subcategory.sub_category_name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ) : (
                                                    <span>
                                                        {brand.brand_name} (Category: {initialCategories.find(cat => cat.id === brand.category_id)?.name || 'N/A'},
                                                        Subcategory: {initialSubcategories.find(sub => sub.id === brand.subcategory_id)?.sub_category_name || 'N/A'})
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdate(brand)}
                                                    className={`px-3 py-1 rounded-lg ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-all duration-300`}
                                                >
                                                    {editingBrandId === brand.id ? 'Save' : 'Edit'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(brand.id)}
                                                    className={`px-3 py-1 rounded-lg ${isDarkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white transition-all duration-300`}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No brands found.</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AddBrand;
