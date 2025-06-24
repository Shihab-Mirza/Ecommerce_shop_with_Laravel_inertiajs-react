import React, { useState, useEffect } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';
import { Inertia } from '@inertiajs/inertia';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const AddOffer = ({ auth, products, flash, search: initialSearch }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProductsOpen, setIsProductsOpen] = useState(false);
    const [isOffersOpen, setIsOffersOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState(flash || null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState(initialSearch || '');
    const [errors, setErrors] = useState({});

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
        if (flash) {
            setSuccessMessage(flash);
            const timer = setTimeout(() => setSuccessMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            timeZone: 'Asia/Dhaka',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).replace(',', '').replace(/(\d+\/.+) (\d+:\d+:\d+) ([AP]M)/, '$1 $2 $3');
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = {
            timeZone: 'Asia/Dhaka',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        };
        const [day, month, year] = date
            .toLocaleString('en-GB', options)
            .split('/')
            .map(part => part.padStart(2, '0'));
        return `${year}-${month}-${day}`;
    };

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const newMode = !prev;
            window.dispatchEvent(new CustomEvent('darkModeChange', { detail: newMode }));
            return newMode;
        });
    };

    const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);
    const toggleMobileSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleEdit = (product) => {
        const currentDate = new Date().toISOString();
        setEditingProduct({
            ...product,
            offer: {
                is_offered_product: product.is_offered_product || 'no',
                discount_type: product.offer?.discount_type || 'unlimited',
                offer_price: product.offer?.offer_price || '',
                start_date: product.offer?.start_date || currentDate,
                end_date: product.offer?.end_date || null,
            },
        });
        setErrors({});
    };

    const handleSave = () => {
        const newErrors = {};

        if (editingProduct.offer.is_offered_product === 'yes') {
            if (!editingProduct.offer.offer_price) {
                newErrors.offer_price = 'Offer price is required when product is offered.';
            } else if (parseFloat(editingProduct.offer.offer_price) > parseFloat(editingProduct.price)) {
                newErrors.offer_price = 'The offer price cannot be greater than the product price.';
            }
        }

        if (
            editingProduct.offer.is_offered_product === 'yes' &&
            editingProduct.offer.discount_type === 'fixed'
        ) {
            if (!editingProduct.offer.end_date) {
                newErrors.end_date = 'End date is required for fixed discounts.';
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const { start_date, ...offerData } = editingProduct.offer;
        const payload = {
            ...editingProduct,
            offer: offerData,
        };

        Inertia.post('/offers/save', payload, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setEditingProduct(null);
                setSuccessMessage('Offer updated successfully!');
                setErrors({});
                Inertia.get('/add_offer', { search: searchQuery }, {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                });
            },
            onError: (serverErrors) => {
                setErrors(serverErrors);
            },
        });
    };

    const handleCancel = () => {
        setEditingProduct(null);
        setErrors({});
    };

    const updateOfferField = (field, value) => {
        if (field === 'start_date') return;

        setEditingProduct((prev) => {
            const updatedOffer = { ...prev.offer, [field]: value };

            if (field === 'discount_type' && value === 'unlimited') {
                updatedOffer.end_date = null;
            }

            return {
                ...prev,
                offer: updatedOffer,
            };
        });

        setErrors((prev) => ({ ...prev, [field]: null }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        Inertia.get('/add_offer', { search: searchQuery }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
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
                    isOffersOpen={isOffersOpen}
                    setIsOffersOpen={setIsOffersOpen}
                    activeLink="add_offer"
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                <main className={`flex-1 p-4 lg:p-6 w-full ${isSidebarMinimized ? 'md:ml-16' : 'md:ml-72'}`}>
                    <div className={`max-w-full mx-auto ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-2xl shadow-lg p-6 transition-colors duration-300`}>
                        <h2 className={`text-3xl font-bold mb-6`}>Manage Offers</h2>

                        {successMessage && (
                            <div className="mb-4 p-3 bg-green-100 text-green-800 flex justify-between items-center rounded">
                                <span>{successMessage}</span>
                                <button onClick={() => setSuccessMessage(null)} className="text-green-800">
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
                            <table className={`w-full text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                                <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                    <tr>
                                        <th className="py-3 px-3 text-left">SI</th>
                                        <th className="py-3 px-3 text-left">Image</th>
                                        {!editingProduct && (
                                            <th className="py-3 px-3 text-left">Code</th>
                                        )}
                                        <th className="py-3 px-3 text-left">Name</th>
                                        <th className="py-3 px-3 text-left">Price</th>
                                        <th className="py-3 px-3 text-left">Is Offered</th>
                                        <th className="py-3 px-3 text-left">Offer Price</th>
                                        <th className="py-3 px-3 text-left">Discount type</th>
                                        <th className="py-3 px-3 text-left">Start Date</th>
                                        <th className="py-3 px-3 text-left">End Date</th>
                                        <th className="py-3 px-3 text-left">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.data.map((product, index) => (
                                        <tr key={product.id} className={`${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                                            <td className="py-3 px-3">
                                                {(products.from || 1) + index}
                                            </td>
                                            <td className="py-3 px-3">
                                                {product.image ? (
                                                    <img
                                                        src={`/storage/${product.image}`}
                                                        alt={product.name}
                                                        className="w-10 h-10 object-cover rounded-full"
                                                    />
                                                ) : (
                                                    <span>No Image</span>
                                                )}
                                            </td>
                                            {!editingProduct && (
                                                <td className="py-3 px-3">{product.product_code}</td>
                                            )}
                                            <td className="py-3 px-3">{product.name}</td>
                                            <td className="py-3 px-3">
                                                {parseFloat(product.price).toFixed(2)}
                                            </td>
                                            {editingProduct?.id === product.id ? (
                                                <>
                                                    <td className="py-3 px-3">
                                                        <select
                                                            value={editingProduct.offer.is_offered_product}
                                                            onChange={(e) => updateOfferField('is_offered_product', e.target.value)}
                                                            className={`border rounded py-0.5 px-2 text-sm ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-gray-100 text-gray-800 border-gray-300'}`}
                                                        >
                                                            <option value="yes">Yes</option>
                                                            <option value="no">No</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <div>
                                                            <input
                                                                type="number"
                                                                value={editingProduct.offer.offer_price || ''}
                                                                onChange={(e) => updateOfferField('offer_price', e.target.value)}
                                                                disabled={editingProduct.offer.is_offered_product === 'no'}
                                                                className={`border rounded p-0 w-24 ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-gray-100 text-gray-800 border-gray-300'} ${errors.offer_price ? 'border-red-500' : ''}`}
                                                            />
                                                            {errors.offer_price && (
                                                                <p className="text-red-500 text-xs mt-1">{errors.offer_price}</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <select
                                                            value={editingProduct.offer.discount_type}
                                                            onChange={(e) => updateOfferField('discount_type', e.target.value)}
                                                            disabled={editingProduct.offer.is_offered_product === 'no'}
                                                            className={`border rounded py-0.5 px-2 text-sm ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-gray-100 text-gray-800 border-gray-300'}`}
                                                        >
                                                            <option value="unlimited">Unlimited</option>
                                                            <option value="fixed">Fixed</option>
                                                        </select>
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <div>
                                                            <input
                                                                type="date"
                                                                value={formatDateForInput(editingProduct.offer.start_date)}
                                                                readOnly
                                                                className={`border rounded py-0.5 px-0 text-sm w-[107px] ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-gray-100 text-gray-800 border-gray-300'} ${errors.start_date ? 'border-red-500' : ''}`}
                                                            />
                                                            {errors.start_date && (
                                                                <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <div>
                                                            <input
                                                                type="date"
                                                                value={formatDateForInput(editingProduct.offer.end_date)}
                                                                onChange={(e) => updateOfferField('end_date', e.target.value)}
                                                                disabled={editingProduct.offer.is_offered_product === 'no' || editingProduct.offer.discount_type === 'unlimited'}
                                                                className={`border rounded py-0.5 px-0 text-sm w-[107px] ${isDarkMode ? 'bg-gray-600 text-white border-gray-500' : 'bg-gray-100 text-gray-800 border-gray-300'} ${errors.end_date ? 'border-red-500' : ''}`}
                                                            />
                                                            {errors.end_date && (
                                                                <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={handleSave}
                                                                className={`p-2 rounded-lg text-sm ${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white transition-all duration-200`}
                                                                title="Save"
                                                            >
                                                                <FaSave />
                                                            </button>
                                                            <button
                                                                onClick={handleCancel}
                                                                className={`p-2 rounded-lg text-sm ${isDarkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600'} text-white transition-all duration-200`}
                                                                title="Cancel"
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="py-3 px-3">{product.is_offered_product}</td>
                                                    <td className="py-3 px-3">{product.offer?.offer_price ? `${parseFloat(product.offer.offer_price).toFixed(2)}` : 'N/A'}</td>
                                                    <td className="py-3 px-3">{product.offer?.discount_type || 'N/A'}</td>
                                                    <td className="py-3 px-3">{formatDate(product.offer?.start_date)}</td>
                                                    <td className="py-3 px-3">{formatDate(product.offer?.end_date)}</td>
                                                    <td className="py-3 px-3">
                                                        <button
                                                            onClick={() => handleEdit(product)}
                                                            className={`p-2 rounded-lg text-sm ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-all duration-200`}
                                                            title="Edit"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                    {products.data.length === 0 && (
                                        <tr>
                                            <td colSpan={editingProduct ? 11 : 12} className={`py-4 px-3 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                                        onClick={() => link.url && Inertia.get(link.url, {}, { replace: true })}
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
        </div>
    );
};

export default AddOffer;