import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Inertia } from '@inertiajs/inertia';

const AddProduct = ({ auth, errors: initialErrors, flash, categories, subcategories, brands }) => {
    const [isProductsOpen, setIsProductsOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
     const [isDarkMode, setIsDarkMode] = useState(() => {
         const savedMode = localStorage.getItem('darkMode');
         return savedMode ? JSON.parse(savedMode) : false;
     });
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [subcategoryId, setSubcategoryId] = useState("");
    const [brandId, setBrandId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [isFeatured, setIsFeatured] = useState("no");
    const [productImage, setProductImage] = useState(null);
    const [validationErrors, setValidationErrors] = useState(initialErrors || {});
    const [successMessage, setSuccessMessage] = useState(flash || null);
    const [activeLink, setActiveLink] = useState('add_product');
    const [filteredSubcategories, setFilteredSubcategories] = useState([]);
    const [filteredBrands, setFilteredBrands] = useState([]);
    const [specName1, setSpecName1] = useState('');
    const [specDetail1, setSpecDetail1] = useState('');
    const [specName2, setSpecName2] = useState('');
    const [specDetail2, setSpecDetail2] = useState('');
    const [specName3, setSpecName3] = useState('');
    const [specDetail3, setSpecDetail3] = useState('');
    const [specName4, setSpecName4] = useState('');
    const [specDetail4, setSpecDetail4] = useState('');
    const [specName5, setSpecName5] = useState('');
    const [specDetail5, setSpecDetail5] = useState('');
    const [specName6, setSpecName6] = useState('');
    const [specDetail6, setSpecDetail6] = useState('');
    const [specName7, setSpecName7] = useState('');
    const [specDetail7, setSpecDetail7] = useState('');
    const [specName8, setSpecName8] = useState('');
    const [specDetail8, setSpecDetail8] = useState('');
    const [specName9, setSpecName9] = useState('');
    const [specDetail9, setSpecDetail9] = useState('');
    const [specName10, setSpecName10] = useState('');
    const [specDetail10, setSpecDetail10] = useState('');
    const [specName11, setSpecName11] = useState('');
    const [specDetail11, setSpecDetail11] = useState('');
    const [specName12, setSpecName12] = useState('');
    const [specDetail12, setSpecDetail12] = useState('');
    const [specName13, setSpecName13] = useState('');
    const [specDetail13, setSpecDetail13] = useState('');
    const [specName14, setSpecName14] = useState('');
    const [specDetail14, setSpecDetail14] = useState('');
    const [specName15, setSpecName15] = useState('');
    const [specDetail15, setSpecDetail15] = useState('');

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

    // Filter subcategories based on selected category
    useEffect(() => {
        if (categoryId) {
            const filtered = subcategories.filter(subcategory => subcategory.category_id === parseInt(categoryId));
            setFilteredSubcategories(filtered);
            setSubcategoryId(""); // Reset subcategory when category changes
            setFilteredBrands([]); // Reset brands when category changes
            setBrandId(""); // Reset brand when category changes
        } else {
            setFilteredSubcategories([]);
            setSubcategoryId("");
            setFilteredBrands([]);
            setBrandId("");
        }
    }, [categoryId, subcategories]);

    // Filter brands based on selected subcategory
    useEffect(() => {
        if (subcategoryId) {
            const filtered = brands.filter(brand => brand.subcategory_id === parseInt(subcategoryId));
            setFilteredBrands(filtered);
            setBrandId(""); // Reset brand when subcategory changes
        } else {
            setFilteredBrands([]);
            setBrandId("");
        }
    }, [subcategoryId, brands]);

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

        formData.append('spec_name_1', specName1);
        formData.append('spec_detail_1', specDetail1);
        formData.append('spec_name_2', specName2);
        formData.append('spec_detail_2', specDetail2);
        formData.append('spec_name_3', specName3);
        formData.append('spec_detail_3', specDetail3);
        formData.append('spec_name_4', specName4);
        formData.append('spec_detail_4', specDetail4);
        formData.append('spec_name_5', specName5);
        formData.append('spec_detail_5', specDetail5);
        formData.append('spec_name_6', specName6);
        formData.append('spec_detail_6', specDetail6);
        formData.append('spec_name_7', specName7);
        formData.append('spec_detail_7', specDetail7);
        formData.append('spec_name_8', specName8);
        formData.append('spec_detail_8', specDetail8);
        formData.append('spec_name_9', specName9);
        formData.append('spec_detail_9', specDetail9);
        formData.append('spec_name_10', specName10);
        formData.append('spec_detail_10', specDetail10);
        formData.append('spec_name_11', specName11);
        formData.append('spec_detail_11', specDetail11);
        formData.append('spec_name_12', specName12);
        formData.append('spec_detail_12', specDetail12);
        formData.append('spec_name_13', specName13);
        formData.append('spec_detail_13', specDetail13);
        formData.append('spec_name_14', specName14);
        formData.append('spec_detail_14', specDetail14);
        formData.append('spec_name_15', specName15);
        formData.append('spec_detail_15', specDetail15);

        Inertia.post('/add_new_product', formData, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                setProductName('');
                setProductPrice('');
                setProductDescription('');
                setCategoryId('');
                setSubcategoryId('');
                setBrandId('');
                setQuantity('');
                setIsFeatured("no");
                setProductImage(null);
                setSpecName1(''); setSpecDetail1('');
                setSpecName2(''); setSpecDetail2('');
                setSpecName3(''); setSpecDetail3('');
                setSpecName4(''); setSpecDetail4('');
                setSpecName5(''); setSpecDetail5('');
                setSpecName6(''); setSpecDetail6('');
                setSpecName7(''); setSpecDetail7('');
                setSpecName8(''); setSpecDetail8('');
                setSpecName9(''); setSpecDetail9('');
                setSpecName10(''); setSpecDetail10('');
                setSpecName11(''); setSpecDetail11('');
                setSpecName12(''); setSpecDetail12('');
                setSpecName13(''); setSpecDetail13('');
                setSpecName14(''); setSpecDetail14('');
                setSpecName15(''); setSpecDetail15('');
                setValidationErrors({});
                setSuccessMessage(page.props.flash || 'Product added successfully!');
                setIsProductsOpen(true);
                setActiveLink('add_product');
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
                    className={`flex-1 p-4 lg:p-6 transition-all duration-300 w-full ${isSidebarMinimized ? 'md:ml-16' : 'md:ml-72'}`}
                >
                    <div className={`max-w-5xl mx-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 transition-colors duration-300`}>
                        <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-6`}>
                            Add New Product
                        </h2>

                        {successMessage && (
                            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 border border-green-300 flex justify-between items-center">
                                <span>{successMessage}</span>
                                <button onClick={dismissSuccessMessage} className="text-green-800 hover:text-green-900">
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
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                        Product Name
                                    </label>
                                    <input
                                        type="text"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        placeholder="Enter product name"
                                        className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                        Price
                                    </label>
                                    <input
                                        type="number"
                                        value={productPrice}
                                        onChange={(e) => setProductPrice(e.target.value)}
                                        placeholder="Enter price"
                                        className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                        Category
                                    </label>
                                    <select
                                        value={categoryId}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
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
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                        Subcategory
                                    </label>
                                    <select
                                        value={subcategoryId}
                                        onChange={(e) => setSubcategoryId(e.target.value)}
                                        className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
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
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                        Brand Name
                                    </label>
                                    <select
                                        value={brandId}
                                        onChange={(e) => setBrandId(e.target.value)}
                                        className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
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
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="Enter quantity"
                                        className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        required
                                        min="0"
                                        step="1"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                        Featured Product
                                    </label>
                                    <select
                                        value={isFeatured}
                                        onChange={(e) => setIsFeatured(e.target.value)}
                                        className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                    >
                                        <option value="no">No</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                        Product Image
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setProductImage(e.target.files[0])}
                                        className={`w-full py-2 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600 file:bg-gray-600 file:text-white file:border-0 file:rounded-md file:px-3 file:py-1.5' : 'bg-gray-100 text-gray-800 border-gray-300 file:bg-gray-200 file:text-gray-800 file:border-0 file:rounded-md file:px-3 file:py-1.5'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                    Description
                                </label>
                                <textarea
                                    value={productDescription}
                                    onChange={(e) => setProductDescription(e.target.value)}
                                    placeholder="Enter product description"
                                    className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                    rows="4"
                                />
                            </div>

                            <div className="space-y-4">
                                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>
                                    Product Specifications
                                </h3>
                                {/* Specification 1 */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Name 1 (Example: Warranty)
                                        </label>
                                        <input
                                            type="text"
                                            value={specName1}
                                            onChange={(e) => setSpecName1(e.target.value)}
                                            placeholder="Enter specification name 1"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Detail 1 (Example: 1 year)
                                        </label>
                                        <input
                                            type="text"
                                            value={specDetail1}
                                            onChange={(e) => setSpecDetail1(e.target.value)}
                                            placeholder="Enter specification detail 1"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                                {/* Specification 2 */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Name 2
                                        </label>
                                        <input
                                            type="text"
                                            value={specName2}
                                            onChange={(e) => setSpecName2(e.target.value)}
                                            placeholder="Enter specification name 2"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Detail 2
                                        </label>
                                        <input
                                            type="text"
                                            value={specDetail2}
                                            onChange={(e) => setSpecDetail2(e.target.value)}
                                            placeholder="Enter specification detail 2"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                                {/* Specification 3 */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Name 3
                                        </label>
                                        <input
                                            type="text"
                                            value={specName3}
                                            onChange={(e) => setSpecName3(e.target.value)}
                                            placeholder="Enter specification name 3"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Detail 3
                                        </label>
                                        <input
                                            type="text"
                                            value={specDetail3}
                                            onChange={(e) => setSpecDetail3(e.target.value)}
                                            placeholder="Enter specification detail 3"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                                {/* Specification 4 */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Name 4
                                        </label>
                                        <input
                                            type="text"
                                            value={specName4}
                                            onChange={(e) => setSpecName4(e.target.value)}
                                            placeholder="Enter specification name 4"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Detail 4
                                        </label>
                                        <input
                                            type="text"
                                            value={specDetail4}
                                            onChange={(e) => setSpecDetail4(e.target.value)}
                                            placeholder="Enter specification detail 4"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                                {/* Specification 5 */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Name 5
                                        </label>
                                        <input
                                            type="text"
                                            value={specName5}
                                            onChange={(e) => setSpecName5(e.target.value)}
                                            placeholder="Enter specification name 5"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Detail 5
                                        </label>
                                        <input
                                            type="text"
                                            value={specDetail5}
                                            onChange={(e) => setSpecDetail5(e.target.value)}
                                            placeholder="Enter specification detail 5"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                                {/* Specification 6 */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Name 6
                                        </label>
                                        <input
                                            type="text"
                                            value={specName6}
                                            onChange={(e) => setSpecName6(e.target.value)}
                                            placeholder="Enter specification name 6"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Detail 6
                                        </label>
                                        <input
                                            type="text"
                                            value={specDetail6}
                                            onChange={(e) => setSpecDetail6(e.target.value)}
                                            placeholder="Enter specification detail 6"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                                {/* Specification 7 */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Name 7
                                        </label>
                                        <input
                                            type="text"
                                            value={specName7}
                                            onChange={(e) => setSpecName7(e.target.value)}
                                            placeholder="Enter specification name 7"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Detail 7
                                        </label>
                                        <input
                                            type="text"
                                            value={specDetail7}
                                            onChange={(e) => setSpecDetail7(e.target.value)}
                                            placeholder="Enter specification detail 7"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                                {/* Specification 8 */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Name 8
                                        </label>
                                        <input
                                            type="text"
                                            value={specName8}
                                            onChange={(e) => setSpecName8(e.target.value)}
                                            placeholder="Enter specification name 8"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Detail 8
                                        </label>
                                        <input
                                            type="text"
                                            value={specDetail8}
                                            onChange={(e) => setSpecDetail8(e.target.value)}
                                            placeholder="Enter specification detail 8"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                                {/* Specification 9 */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Name 9
                                        </label>
                                        <input
                                            type="text"
                                            value={specName9}
                                            onChange={(e) => setSpecName9(e.target.value)}
                                            placeholder="Enter specification name 9"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Detail 9
                                        </label>
                                        <input
                                            type="text"
                                            value={specDetail9}
                                            onChange={(e) => setSpecDetail9(e.target.value)}
                                            placeholder="Enter specification detail 9"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                                {/* Specification 10 */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Name 10
                                        </label>
                                        <input
                                            type="text"
                                            value={specName10}
                                            onChange={(e) => setSpecName10(e.target.value)}
                                            placeholder="Enter specification name 10"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Detail 10
                                        </label>
                                        <input
                                            type="text"
                                            value={specDetail10}
                                            onChange={(e) => setSpecDetail10(e.target.value)}
                                            placeholder="Enter specification detail 10"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                                {/* Specification 11 */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Name 11
                                        </label>
                                        <input
                                            type="text"
                                            value={specName11}
                                            onChange={(e) => setSpecName11(e.target.value)}
                                            placeholder="Enter specification name 11"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Detail 11
                                        </label>
                                        <input
                                            type="text"
                                            value={specDetail11}
                                            onChange={(e) => setSpecDetail11(e.target.value)}
                                            placeholder="Enter specification detail 11"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                                {/* Specification 12 */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Name 12
                                        </label>
                                        <input
                                            type="text"
                                            value={specName12}
                                            onChange={(e) => setSpecName12(e.target.value)}
                                            placeholder="Enter specification name 12"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Detail 12
                                        </label>
                                        <input
                                            type="text"
                                            value={specDetail12}
                                            onChange={(e) => setSpecDetail12(e.target.value)}
                                            placeholder="Enter specification detail 12"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                                {/* Specification 13 */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Name 13
                                        </label>
                                        <input
                                            type="text"
                                            value={specName13}
                                            onChange={(e) => setSpecName13(e.target.value)}
                                            placeholder="Enter specification name 13"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Detail 13
                                        </label>
                                        <input
                                            type="text"
                                            value={specDetail13}
                                            onChange={(e) => setSpecDetail13(e.target.value)}
                                            placeholder="Enter specification detail 13"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                                {/* Specification 14 */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Name 14
                                        </label>
                                        <input
                                            type="text"
                                            value={specName14}
                                            onChange={(e) => setSpecName14(e.target.value)}
                                            placeholder="Enter specification name 14"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Detail 14
                                        </label>
                                        <input
                                            type="text"
                                            value={specDetail14}
                                            onChange={(e) => setSpecDetail14(e.target.value)}
                                            placeholder="Enter specification detail 14"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                                {/* Specification 15 */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Name 15
                                        </label>
                                        <input
                                            type="text"
                                            value={specName15}
                                            onChange={(e) => setSpecName15(e.target.value)}
                                            placeholder="Enter specification name 15"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                                            Specification Detail 15
                                        </label>
                                        <input
                                            type="text"
                                            value={specDetail15}
                                            onChange={(e) => setSpecDetail15(e.target.value)}
                                            placeholder="Enter specification detail 15"
                                            className={`w-full py-2.5 px-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className={`w-full py-3 px-6 rounded-lg font-semibold text-white ${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'} transition-all duration-300 shadow-md hover:shadow-lg`}
                                >
                                    Add Product
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AddProduct;
