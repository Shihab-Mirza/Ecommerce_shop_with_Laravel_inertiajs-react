import React, { useState, useEffect } from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faBox, faChevronLeft, faChevronRight, faHome, faUser, faTag, faShoppingCart, faGift, faStar } from '@fortawesome/free-solid-svg-icons';

const AdminSidebar = ({
    isSidebarMinimized,
    toggleSidebar,
    isSidebarOpen,
    toggleMobileSidebar,
    isProductsOpen,
    setIsProductsOpen,
    activeLink,
    setIsSidebarOpen,
}) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [isHomepageOpen, setIsHomepageOpen] = useState(() => {
        const savedState = localStorage.getItem('isHomepageOpen');
        const isHomepageActive = [
            'add_image_slideshow',
            'add_featured_product',
            'view_featured_products',
            'add_special_offer_product',
            'view_special_offer_product',
            'manage_special_offer',
            'manage_category_icons'
        ].includes(activeLink);
        return savedState ? JSON.parse(savedState) : isHomepageActive;
    });
    const [isUserRolesOpen, setIsUserRolesOpen] = useState(() => {
        const savedState = localStorage.getItem('isUserRolesOpen');
        const isUserRolesActive = ['assign_role'].includes(activeLink);
        return savedState ? JSON.parse(savedState) : isUserRolesActive;
    });
    const [isOffersOpen, setIsOffersOpen] = useState(() => {
        const savedState = localStorage.getItem('isOffersOpen');
        const isOffersActive = ['add_offer', 'view_offers'].includes(activeLink);
        return savedState ? JSON.parse(savedState) : isOffersActive;
    });
    const [isOrdersOpen, setIsOrdersOpen] = useState(() => {
        const savedState = localStorage.getItem('isOrdersOpen');
        const isOrdersActive = ['view_orders', 'view_delivered_orders'].includes(activeLink);
        return savedState ? JSON.parse(savedState) : isOrdersActive;
    });
    const [isVouchersOpen, setIsVouchersOpen] = useState(() => {
        const savedState = localStorage.getItem('isVouchersOpen');
        const isVouchersActive = ['add_vouchers', 'add_point_discounts', 'view_user_points'].includes(activeLink);
        return savedState ? JSON.parse(savedState) : isVouchersActive;
    });

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
        localStorage.setItem('isHomepageOpen', JSON.stringify(isHomepageOpen));
    }, [isHomepageOpen]);

    useEffect(() => {
        localStorage.setItem('isUserRolesOpen', JSON.stringify(isUserRolesOpen));
    }, [isUserRolesOpen]);

    useEffect(() => {
        localStorage.setItem('isOffersOpen', JSON.stringify(isOffersOpen));
    }, [isOffersOpen]);

    useEffect(() => {
        localStorage.setItem('isOrdersOpen', JSON.stringify(isOrdersOpen));
    }, [isOrdersOpen]);

    useEffect(() => {
        localStorage.setItem('isVouchersOpen', JSON.stringify(isVouchersOpen));
    }, [isVouchersOpen]);

    useEffect(() => {
        const isHomepageActive = [
            'add_image_slideshow',
            'add_featured_product',
            'view_featured_products',
            'add_special_offer_product',
            'view_special_offer_product',
            'manage_special_offer',
            'manage_category_icons'
        ].includes(activeLink);
        setIsHomepageOpen((prev) => isHomepageActive || prev);

        const isUserRolesActive = ['view_all_roles', 'add_role', 'assign_role'].includes(activeLink);
        setIsUserRolesOpen((prev) => isUserRolesActive || prev);

        const isOffersActive = ['add_offer', 'view_offers'].includes(activeLink);
        setIsOffersOpen((prev) => isOffersActive || prev);

        const isOrdersActive = ['view_orders', 'view_delivered_orders'].includes(activeLink);
        setIsOrdersOpen((prev) => isOrdersActive || prev);

        const isVouchersActive = ['add_vouchers', 'add_point_discounts', 'view_user_points'].includes(activeLink);
        setIsVouchersOpen((prev) => isVouchersActive || prev);
    }, [activeLink]);

    return (
        <>
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 md:w-72 ${
                    isSidebarMinimized ? 'md:w-16' : 'md:w-72'
                } ${
                    isDarkMode
                        ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white'
                        : 'bg-gradient-to-b from-white via-gray-50 to-white text-gray-800'
                } shadow-xl p-4 space-y-6 transform transition-all duration-300 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                } overflow-y-auto`}
            >
                <div className="flex items-center justify-between">
                    {!isSidebarMinimized && (
                        <h2
                            className={`text-xl sm:text-2xl font-bold bg-clip-text text-transparent ${
                                isDarkMode
                                    ? 'bg-gradient-to-r from-blue-400 to-purple-500'
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                            }`}
                        >
                            Dashboard
                        </h2>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className={`p-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} hidden md:block`}
                    >
                        <FontAwesomeIcon icon={isSidebarMinimized ? faChevronRight : faChevronLeft} className="text-lg" />
                    </button>
                    <button
                        onClick={toggleMobileSidebar}
                        className={`p-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'} md:hidden`}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} className="text-lg" />
                    </button>
                </div>
                <nav>
                    <ul className="space-y-3">
                        <li>
                            <InertiaLink
                                href="/dashboard"
                                className={`flex items-center px-3 py-2 sm:px-4 sm:py-3 ${
                                    isDarkMode
                                        ? 'text-gray-200 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                                        : 'text-gray-700 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                } rounded-xl transition-all duration-300 transform hover:scale-105 ${
                                    activeLink === 'dashboard'
                                        ? isDarkMode
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                                            : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                        : ''
                                }`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <FontAwesomeIcon icon={faTable} className={isSidebarMinimized ? '' : 'mr-2 sm:mr-3'} />
                                {!isSidebarMinimized && <span className="text-sm sm:text-base">Overview</span>}
                            </InertiaLink>
                        </li>
                        <li>
                            <button
                                onClick={() => setIsProductsOpen(!isProductsOpen)}
                                className={`w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 ${
                                    isDarkMode
                                        ? 'text-gray-200 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                                        : 'text-gray-700 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                } rounded-xl transition-all duration-300 transform hover:scale-105`}
                            >
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faBox} className={isSidebarMinimized ? '' : 'mr-2 sm:mr-3'} />
                                    {!isSidebarMinimized && <span className="text-sm sm:text-base">Products</span>}
                                </div>
                                {!isSidebarMinimized && (
                                    <span className="transition-transform duration-300 text-xs sm:text-sm">
                                        {isProductsOpen ? '▼' : '▶'}
                                    </span>
                                )}
                            </button>
                            {isProductsOpen && !isSidebarMinimized && (
                                <ul className="ml-4 sm:ml-6 mt-2 space-y-2 animate-fade-in">
                                    <li>
                                        <InertiaLink
                                            href="/view_all_products"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'view_all_products'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            All Products
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/add_category"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'add_category'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            Add new category
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/add_subcategory"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'add_subcategory'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            Add sub category
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/add_brand"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'add_brand'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            Add new brand
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/add_product"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'add_product'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            Add Product
                                        </InertiaLink>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li>
                            <button
                                onClick={() => setIsOffersOpen(!isOffersOpen)}
                                className={`w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 ${
                                    isDarkMode
                                        ? 'text-gray-200 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                                        : 'text-gray-700 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                } rounded-xl transition-all duration-300 transform hover:scale-105`}
                            >
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faTag} className={isSidebarMinimized ? '' : 'mr-2 sm:mr-3'} />
                                    {!isSidebarMinimized && <span className="text-sm sm:text-base">Manage Offer</span>}
                                </div>
                                {!isSidebarMinimized && (
                                    <span className="transition-transform duration-300 text-xs sm:text-sm">
                                        {isOffersOpen ? '▼' : '▶'}
                                    </span>
                                )}
                            </button>
                            {isOffersOpen && !isSidebarMinimized && (
                                <ul className="ml-4 sm:ml-6 mt-2 space-y-2 animate-fade-in">
                                    <li>
                                        <InertiaLink
                                            href="/add_offer"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'add_offer'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            Add Offer
                                        </InertiaLink>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li>
                            <button
                                onClick={() => setIsHomepageOpen(!isHomepageOpen)}
                                className={`w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 ${
                                    isDarkMode
                                        ? 'text-gray-200 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                                        : 'text-gray-700 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                } rounded-xl transition-all duration-300 transform hover:scale-105`}
                            >
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faHome} className={isSidebarMinimized ? '' : 'mr-2 sm:mr-3'} />
                                    {!isSidebarMinimized && <span className="text-sm sm:text-base">Manage Homepage</span>}
                                </div>
                                {!isSidebarMinimized && (
                                    <span className="transition-transform duration-300 text-xs sm:text-sm">
                                        {isHomepageOpen ? '▼' : '▶'}
                                    </span>
                                )}
                            </button>
                            {isHomepageOpen && !isSidebarMinimized && (
                                <ul className="ml-4 sm:ml-6 mt-2 space-y-2 animate-fade-in">
                                    <li>
                                        <InertiaLink
                                            href="/add_image_slideshow"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'add_image_slideshow'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            Add Image Slideshow
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/add_featured_product"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'add_featured_product'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            Add Featured Product
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/view_featured_products"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'view_featured_products'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            View Featured Products
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/add_special_offer_product"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'add_special_offer_product'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            Add Special Offer Product
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/view_special_offer_products"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'view_special_offer_products'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            View Special Offer Product
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/manage_special_offer"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'manage_special_offer'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            Manage Special Offer
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/manage_category_icons"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'manage_category_icons'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            Manage Category Icons
                                        </InertiaLink>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li>
                            <button
                                onClick={() => setIsOrdersOpen(!isOrdersOpen)}
                                className={`w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 ${
                                    isDarkMode
                                        ? 'text-gray-200 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                                        : 'text-gray-700 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                } rounded-xl transition-all duration-300 transform hover:scale-105`}
                            >
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faShoppingCart} className={isSidebarMinimized ? '' : 'mr-2 sm:mr-3'} />
                                    {!isSidebarMinimized && <span className="text-sm sm:text-base">Manage Orders</span>}
                                </div>
                                {!isSidebarMinimized && (
                                    <span className="transition-transform duration-300 text-xs sm:text-sm">
                                        {isOrdersOpen ? '▼' : '▶'}
                                    </span>
                                )}
                            </button>
                            {isOrdersOpen && !isSidebarMinimized && (
                                <ul className="ml-4 sm:ml-6 mt-2 space-y-2 animate-fade-in">
                                    <li>
                                        <InertiaLink
                                            href="/view_orders"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'view_orders'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            View All Orders
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/view_delivered_orders"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'view_delivered_orders'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            View Delivered Orders
                                        </InertiaLink>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li>
                            <button
                                onClick={() => setIsVouchersOpen(!isVouchersOpen)}
                                className={`w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 ${
                                    isDarkMode
                                        ? 'text-gray-200 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                                        : 'text-gray-700 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                } rounded-xl transition-all duration-300 transform hover:scale-105`}
                            >
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faGift} className={isSidebarMinimized ? '' : 'mr-2 sm:mr-3'} />
                                    {!isSidebarMinimized && <span className="text-sm sm:text-base">Manage Points</span>}
                                </div>
                                {!isSidebarMinimized && (
                                    <span className="transition-transform duration-300 text-xs sm:text-sm">
                                        {isVouchersOpen ? '▼' : '▶'}
                                    </span>
                                )}
                            </button>
                            {isVouchersOpen && !isSidebarMinimized && (
                                <ul className="ml-4 sm:ml-6 mt-2 space-y-2 animate-fade-in">
                                    <li>
                                        <InertiaLink
                                            href="/add_vouchers"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'add_vouchers'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            Add Vouchers
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/add_point_discounts"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'add_point_discounts'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            Add Point Discounts
                                        </InertiaLink>
                                    </li>
                                    <li>
                                        <InertiaLink
                                            href="/view_user_points"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'view_user_points'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            View User Points
                                        </InertiaLink>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li>
                           <button
                                onClick={() => setIsUserRolesOpen(!isUserRolesOpen)}
                                className={`w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 ${
                                    isDarkMode
                                        ? 'text-gray-200 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                                        : 'text-gray-700 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                } rounded-xl transition-all duration-300 transform hover:scale-105`}
                            >
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faUser} className={isSidebarMinimized ? '' : 'mr-2 sm:mr-3'} />
                                    {!isSidebarMinimized && <span className="text-sm sm:text-base">User Role Management</span>}
                                </div>
                                {!isSidebarMinimized && (
                                    <span className="transition-transform duration-300 text-xs sm:text-sm">
                                        {isUserRolesOpen ? '▼' : '▶'}
                                    </span>
                                )}
                            </button>
                            {isUserRolesOpen && !isSidebarMinimized && (
                                <ul className="ml-4 sm:ml-6 mt-2 space-y-2 animate-fade-in">
                                    <li>
                                        <InertiaLink
                                            href="/assign_role"
                                            className={`block px-3 py-2 ${
                                                isDarkMode
                                                    ? 'text-gray-300 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                            } rounded-lg transition-all duration-200 transform hover:translate-x-1 text-sm ${
                                                activeLink === 'assign_role'
                                                    ? isDarkMode
                                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                                        : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                                    : ''
                                            }`}
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            Assign Role
                                        </InertiaLink>
                                    </li>
                                </ul>
                            )}
                        </li>
                        
                        <li>
                            <InertiaLink
                                href="/view_reports"
                                className={`flex items-center px-3 py-2 sm:px-4 sm:py-3 ${
                                    isDarkMode
                                        ? 'text-gray-200 bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600'
                                        : 'text-gray-700 bg-gray-100 hover:bg-gradient-to-r hover:from-blue-400 hover:to-indigo-500 hover:text-white'
                                } rounded-xl transition-all duration-300 transform hover:scale-105 ${
                                    activeLink === 'view_reports'
                                        ? isDarkMode
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                                            : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white'
                                        : ''
                                }`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                <FontAwesomeIcon icon={faStar} className={isSidebarMinimized ? '' : 'mr-2 sm:mr-3'} />
                                {!isSidebarMinimized && <span className="text-sm sm:text-base">Report</span>}
                            </InertiaLink>
                        </li>
                    </ul>
                </nav>
            </aside>
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={toggleMobileSidebar}
                ></div>
            )}
        </>
    );
};

export default AdminSidebar;