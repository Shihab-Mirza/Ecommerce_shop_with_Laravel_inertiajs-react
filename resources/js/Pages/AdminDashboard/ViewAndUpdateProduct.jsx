import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Inertia } from '@inertiajs/inertia';

const ViewAndUpdateProduct = ({ auth, errors: initialErrors, flash, product, categories, subcategories, brands }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [productName, setProductName] = useState(product.name || '');
    const [productPrice, setProductPrice] = useState(product.price || '');
    const [productDescription, setProductDescription] = useState(product.description || '');
    const [categoryId, setCategoryId] = useState(product.category_id || '');
    const [subcategoryId, setSubcategoryId] = useState(product.subcategory_id || '');
    const [brandId, setBrandId] = useState(product.brand_id || '');
    const [quantity, setQuantity] = useState(product.quantity || '');
    const [isFeatured, setIsFeatured] = useState(product.is_featured || 'no');
    const [productImage, setProductImage] = useState(null);
    const [validationErrors, setValidationErrors] = useState(initialErrors || {});
    const [successMessage, setSuccessMessage] = useState(flash || null);
    const [activeLink, setActiveLink] = useState('view_products');
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);

    // Initialize specifications array from product data
    const [specifications, setSpecifications] = useState(
        Array.from({ length: 15 }, (_, index) => ({
            name: product[`spec_name_${index + 1}`] || '',
            detail: product[`spec_detail_${index + 1}`] || '',
        }))
    );

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

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
    const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
    const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        if (categoryId) {
            const filtered = subcategories.filter((subcategory) => subcategory.category_id === parseInt(categoryId));
            setFilteredSubcategories(filtered);
            if (!filtered.some((sub) => sub.id === parseInt(subcategoryId))) {
                setSubcategoryId('');
            }
        } else {
            setFilteredSubcategories([]);
            setSubcategoryId('');
        }
    }, [categoryId, subcategories]);

    useEffect(() => {
        if (subcategoryId) {
            const filtered = brands.filter((brand) => brand.subcategory_id === parseInt(subcategoryId));
            setFilteredBrands(filtered);
            if (!filtered.some((brand) => brand.id === parseInt(brandId))) {
                setBrandId('');
            }
        } else {
            setFilteredBrands([]);
            setBrandId('');
        }
    }, [subcategoryId, brands]);

    const handleSpecChange = (index, field, value) => {
        setSpecifications((prev) =>
            prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec))
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', productName);
        formData.append('price', productPrice);
        formData.append('description', productDescription);
        formData.append('category_id', categoryId);
        formData.append('subcategory_id', subcategoryId);
        formData.append('brand_id', brandId);
        formData.append('quantity', quantity);
        formData.append('is_featured', isFeatured);
        if (productImage) formData.append('image', productImage);
        formData.append('_method', 'PUT');

        // Append specifications
        specifications.forEach((spec, index) => {
            formData.append(`spec_name_${index + 1}`, spec.name);
            formData.append(`spec_detail_${index + 1}`, spec.detail);
        });

        Inertia.post(`/products/${product.id}`, formData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                setValidationErrors({});
                setSuccessMessage(page.props.flash || 'Product updated successfully!');
                setActiveLink('view_products');
            },
            onError: (errors) => {
                setValidationErrors(errors);
                setSuccessMessage(null);
            },
        });
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
                    activeLink={activeLink}
                />
                <main
                    className={`flex-1 p-4 lg:p-6 transition-all duration-300 w-full ${
                        isSidebarMinimized ? 'md:ml-16' : 'md:ml-72'
                    }`}
                >
                    <div
                        className={`max-w-5xl mx-auto ${
                            isDarkMode ? 'bg-gray-800' : 'bg-white'
                        } rounded-2xl shadow-xl p-6 transition-colors duration-300`}
                    >
                        <h2
                            className={`text-4xl font-bold ${
                                isDarkMode ? 'text-white' : 'text-gray-800'
                            } mb-6`}
                        >
                            Update Product
                        </h2>

                        {successMessage && (
                            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 border border-green-300 flex justify-between items-center">
                                <span>{successMessage}</span>
                                <button
                                    onClick={dismissSuccessMessage}
                                    className="text-green-800 hover:text-green-900"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {Object.keys(validationErrors).length > 0 && (
                            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 border border-red-300">
                                {Object.values(validationErrors).map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label
                                        className={`block text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        } mb-1`}
                                    >
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        placeholder="Enter product name"
                                        className={`w-full py-2.5 px-4 rounded-lg border ${
                                            isDarkMode
                                                ? 'bg-gray-700 text-white border-gray-600'
                                                : 'bg-gray-100 text-gray-800 border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label
                                        className={`block text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        } mb-1`}
                                    >
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        value={productPrice}
                                        onChange={(e) => setProductPrice(e.target.value)}
                                        placeholder="Enter price"
                                        className={`w-full py-2.5 px-4 rounded-lg border ${
                                            isDarkMode
                                                ? 'bg-gray-700 text-white border-gray-600'
                                                : 'bg-gray-100 text-gray-800 border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label
                                        className={`block text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        } mb-1`}
                                    >
                                        Category
                                    </label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className={`w-full py-2.5 px-4 rounded-lg border ${
                                            isDarkMode
                                                ? 'bg-gray-700 text-white border-gray-600'
                                                : 'bg-gray-100 text-gray-800 border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label
                                        className={`block text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        } mb-1`}
                                    >
                                        Subcategory
                                    </label>
                                    <select
                                        value={subcategoryId}
                                        onChange={(e) => setSubcategoryId(e.target.value)}
                                        className={`w-full py-2.5 px-4 rounded-lg border ${
                                            isDarkMode
                                                ? 'bg-gray-700 text-white border-gray-600'
                                                : 'bg-gray-100 text-gray-800 border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        required
                                        disabled={!categoryId}
                                    >
                                        <option value="">Select a subcategory</option>
                                        {filteredSubcategories.map((subcategory) => (
                                            <option key={subcategory.id} value={subcategory.id}>
                                                {subcategory.sub_category_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label
                                        className={`block text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        } mb-1`}
                                    >
                                        Brand Name
                                    </label>
                                    <select
                                        value={brandId}
                                        onChange={(e) => setBrandId(e.target.value)}
                                        className={`w-full py-2.5 px-4 rounded-lg border ${
                                            isDarkMode
                                                ? 'bg-gray-700 text-white border-gray-600'
                                                : 'bg-gray-100 text-gray-800 border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        required
                                        disabled={!subcategoryId}
                                    >
                                        <option value="">Select a brand</option>
                                        {filteredBrands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.brand_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label
                                        className={`block text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        } mb-1`}
                                    >
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="Enter quantity"
                                        className={`w-full py-2.5 px-4 rounded-lg border ${
                                            isDarkMode
                                                ? 'bg-gray-700 text-white border-gray-600'
                                                : 'bg-gray-100 text-gray-800 border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        required
                                        min="0"
                                        step="1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label
                                        className={`block text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        } mb-1`}
                                    >
                                        Featured Product
                                    </label>
                                    <select
                                        value={isFeatured}
                                        onChange={(e) => setIsFeatured(e.target.value)}
                                        className={`w-full py-2.5 px-4 rounded-lg border ${
                                            isDarkMode
                                                ? 'bg-gray-700 text-white border-gray-600'
                                                : 'bg-gray-100 text-gray-800 border-gray-300'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                    >
                                        <option value="no">No</option>
                                        <option value="yes">Yes</option>
                                    </select>
                                </div>
                                <div>
                                    <label
                                        className={`block text-sm font-medium ${
                                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                        } mb-1`}
                                    >
                                        Product Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setProductImage(e.target.files[0])}
                                        className={`w-full py-2 px-4 rounded-lg border ${
                                            isDarkMode
                                                ? 'bg-gray-700 text-white border-gray-600 file:bg-gray-600 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1.5'
                                                : 'bg-gray-100 text-gray-800 border-gray-300 file:bg-gray-200 file:text-gray-800 file:border-0 file:rounded-md file:px-3 file:py-1.5'
                                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                    />
                                    {product.image && (
                                        <p
                                            className={`mt-2 text-sm ${
                                                isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                            }`}
                                        >
                                            Current image: {product.image}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label
                                    className={`block text-sm font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    } mb-1`}
                                >
                                    Description
                                </label>
                                <textarea
                                    value={productDescription}
                                    onChange={(e) => setProductDescription(e.target.value)}
                                    placeholder="Enter product description"
                                    className={`w-full py-2.5 px-4 rounded-lg border ${
                                        isDarkMode
                                            ? 'bg-gray-700 text-white border-gray-600'
                                            : 'bg-gray-100 text-gray-800 border-gray-300'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                    rows="4"
                                />
                            </div>

                            <div className="space-y-4">
                                <h3
                                    className={`text-lg font-semibold ${
                                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                                    } mb-2`}
                                >
                                    Product Specifications
                                </h3>
                                {specifications.map((spec, index) => (
                                    <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                        <div>
                                            <label
                                                className={`block text-sm font-medium ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                                } mb-1`}
                                            >
                                                Specification Name {index + 1}
                                            </label>
                                            <input
                                                type="text"
                                                value={spec.name}
                                                onChange={(e) =>
                                                    handleSpecChange(index, 'name', e.target.value)
                                                }
                                                placeholder={`Enter specification name ${index + 1}`}
                                                className={`w-full py-2.5 px-4 rounded-lg border ${
                                                    isDarkMode
                                                        ? 'bg-gray-700 text-white border-gray-600'
                                                        : 'bg-gray-100 text-gray-800 border-gray-300'
                                                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                            />
                                        </div>
                                        <div>
                                            <label
                                                className={`block text-sm font-medium ${
                                                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                                } mb-1`}
                                            >
                                                Specification Detail {index + 1}
                                            </label>
                                            <input
                                                type="text"
                                                value={spec.detail}
                                                onChange={(e) =>
                                                    handleSpecChange(index, 'detail', e.target.value)
                                                }
                                                placeholder={`Enter specification detail ${index + 1}`}
                                                className={`w-full py-2.5 px-4 rounded-lg border ${
                                                    isDarkMode
                                                        ? 'bg-gray-700 text-white border-gray-600'
                                                        : 'bg-gray-100 text-gray-800 border-gray-300'
                                                } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white ${
                                        isDarkMode
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
                                    } transition-all duration-300 shadow-md hover:shadow-lg`}
                                >
                                    Update Product
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ViewAndUpdateProduct;
