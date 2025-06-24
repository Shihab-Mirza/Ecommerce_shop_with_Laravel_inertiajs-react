import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSignInAlt, faUserPlus, faSearch, faSignOutAlt, faShoppingCart, faHeart, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Link, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { motion, AnimatePresence } from 'framer-motion';
import { InertiaLink } from '@inertiajs/inertia-react';
import axios from 'axios';
import LoginModal from '@/Pages/Landing/LoginModal';
import RegistrationModal from '@/Pages/Landing/RegistrationModal';

function Navbar({ auth, categories, cartCount, toggleCartModal, setPendingCheckout, cartId, checkoutToken }) {
    const { props } = usePage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [expandedSubcategories, setExpandedSubcategories] = useState({});

    // Animation variants for mobile menu with instant appearance
    const mobileMenuVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0, // Instant transition
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0, // Instant transition
            }
        }
    };

    // Fetch product suggestions with Axios (debounced)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim().length === 0) {
                setSuggestions([]); // Clear suggestions when search input is empty
                return;
            }
            if (searchQuery.length >= 2) {
                axios.get('/search-products', { params: { query: searchQuery } })
                    .then(response => {
                        setSuggestions(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching suggestions:', error);
                        setSuggestions([]);
                    });
            } else {
                setSuggestions([]); // Clear suggestions for queries shorter than 2 characters
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
        if (searchOpen) setSearchOpen(false);
        setSuggestions([]); // Clear suggestions when toggling mobile menu
    };

    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
        if (mobileMenuOpen) setMobileMenuOpen(false);
        setSuggestions([]); // Clear suggestions when toggling search
    };

    const toggleLoginModal = () => {
        setLoginModalOpen(!loginModalOpen);
        setRegistrationModalOpen(false);
        setMobileMenuOpen(false);
        setSuggestions([]); // Clear suggestions when opening login modal
    };

    const toggleRegistrationModal = () => {
        setRegistrationModalOpen(!registrationModalOpen);
        setLoginModalOpen(false);
        setMobileMenuOpen(false);
        setSuggestions([]); // Clear suggestions when opening registration modal
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            Inertia.get('/search', { query: searchQuery });
            setSuggestions([]); // Clear suggestions on search submission
        }
    };

    const handleWishlistClick = () => {
        if (!auth.user) {
            setLoginModalOpen(true);
            setMobileMenuOpen(false);
            setSuggestions([]); // Clear suggestions when opening login for wishlist
        } else {
            Inertia.get('/wishlist');
        }
    };

    const toggleCategory = (categoryId) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    const toggleSubcategory = (subcategoryId) => {
        setExpandedSubcategories((prev) => ({
            ...prev,
            [subcategoryId]: !prev[subcategoryId],
        }));
    };

    const handleLoginSuccess = () => {
        setLoginModalOpen(false);
        if (props.pendingCheckout) {
            setPendingCheckout(false);
            Inertia.get(`/checkout2/${cartId}/${checkoutToken}`);
        }
    };

    const authButtonStyles = "px-4 py-2 text-sm text-gray-100 font-medium tracking-wide uppercase rounded-full bg-gray-800/80 border border-gray-700/50 hover:bg-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/30 transition-all duration-300 flex items-center gap-2 shadow-sm";

    return (
        <header className="relative">
            {/* Primary Navbar */}
            <nav className="z-50 fixed top-0 w-full p-3 sm:p-4 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-lg shadow-md transition-all duration-500">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center justify-between">
                        <InertiaLink href={route('home')} className="text-xl sm:text-2xl font-extralight text-white tracking-tight hover:text-gray-200 transition duration-300">
                            Tech Store
                        </InertiaLink>

                        <form onSubmit={handleSearch} className="relative flex-grow max-w-md lg:max-w-xl mx-4 lg:mx-8">
                            <input
                                className="w-full h-9 sm:h-10 bg-white text-gray-900 rounded-lg pl-3 pr-10 sm:pl-4 sm:pr-12 shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 placeholder-gray-500 text-sm tracking-wide"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition duration-300">
                                <FontAwesomeIcon icon={faSearch} size="sm" />
                            </button>
                            {/* Suggestions Dropdown for Desktop */}
                            {suggestions.length > 0 && (
                                <ul className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-300 max-h-64 overflow-y-auto">
                                    {suggestions.map((product) => (
                                        <li key={product.id}>
                                            <InertiaLink
                                                href={product.url}
                                                className="block px-4 py-2 text-sm text-black hover:bg-gray-100 hover:text-black transition-colors duration-200"
                                                onClick={() => setSuggestions([])}
                                            >
                                                {product.name}
                                            </InertiaLink>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </form>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <button onClick={toggleCartModal} className="relative p-2 text-gray-200 hover:text-white transition duration-300">
                                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            </button>
                            <button onClick={handleWishlistClick} className="p-2 text-gray-200 hover:text-white transition duration-300">
                                <FontAwesomeIcon icon={faHeart} size="lg" />
                            </button>
                            {auth.user ? (
                                <>
                                    <Link href="/profile" className={authButtonStyles}>
                                        <FontAwesomeIcon icon={faUserPlus} /> Profile
                                    </Link>
                                    <Link href="/logout" method="post" className={authButtonStyles}>
                                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button onClick={toggleLoginModal} className={authButtonStyles}>
                                        <FontAwesomeIcon icon={faSignInAlt} /> Login
                                    </button>
                                    <button onClick={toggleRegistrationModal} className={authButtonStyles}>
                                        <FontAwesomeIcon icon={faUserPlus} /> Register
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="flex md:hidden items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button onClick={toggleMobileMenu} className="text-gray-200 hover:text-white transition duration-300">
                                <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} size="lg" />
                            </button>
                            <Link href="/" className="text-xl sm:text-2xl font-extralight text-white tracking-tight hover:text-gray-200 transition duration-300">
                                Tech Store
                            </Link>
                        </div>
                        <div className="flex items-center gap-3 sm:gap-4">
                            <button onClick={handleWishlistClick} className="text-gray-200 hover:text-white transition duration-300">
                                <FontAwesomeIcon icon={faHeart} size="lg" />
                            </button>
                            <button onClick={toggleCartModal} className="relative text-gray-200 hover:text-white transition duration-300">
                                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            </button>
                            <button onClick={toggleSearch} className="text-gray-200 hover:text-white transition duration-300">
                                <FontAwesomeIcon icon={faSearch} size="lg" />
                            </button>
                        </div>
                    </div>

                    {searchOpen && (
                        <div className="md:hidden mt-3 sm:mt-4">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    className="w-full h-9 sm:h-10 bg-white text-gray-900 rounded-full pl-3 pr-10 sm:pl-4 sm:pr-12 shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 placeholder-gray-500 text-sm tracking-wide"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition duration-300">
                                    <FontAwesomeIcon icon={faSearch} size="sm" />
                                </button>
                                {/* Suggestions Dropdown for Mobile */}
                                {suggestions.length > 0 && (
                                    <ul className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-300 max-h-64 overflow-y-auto">
                                        {suggestions.map((product) => (
                                            <li key={product.id}>
                                                <InertiaLink
                                                    href={product.url}
                                                    className="block px-4 py-2 text-sm text-black hover:bg-gray-100 hover:text-cyan-400 transition-colors duration-200"
                                                    onClick={() => {
                                                        setSuggestions([]);
                                                        setSearchOpen(false);
                                                    }}
                                                >
                                                    {product.name}
                                                </InertiaLink>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </form>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="md:hidden fixed top-0 left-0 w-4/5 sm:w-3/4 max-w-xs h-full bg-gray-800 shadow-inner shadow-cyan-500/20 z-50"
                    >
                        <div className="flex flex-col h-full p-4 sm:p-5 overflow-y-auto">
                            <div className="flex justify-end">
                                <button onClick={toggleMobileMenu} className="text-gray-200 hover:text-white transition duration-300">
                                    <FontAwesomeIcon icon={faTimes} size="lg" />
                                </button>
                            </div>

                            <div className="flex flex-col gap-2 sm:gap-3 mt-4">
                                {auth.user ? (
                                    <>
                                        <Link
                                            href="/profile"
                                            className={`${authButtonStyles} py-3 sm:py-3.5 text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out flex justify-center`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                                            Profile
                                        </Link>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            className={`${authButtonStyles} py-3 sm:py-3.5 text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out flex justify-center`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                                            Logout
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={toggleLoginModal}
                                            className={`${authButtonStyles} py-3 sm:py-3.5 text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out flex justify-center`}
                                        >
                                            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                                            Login
                                        </button>
                                        <button
                                            onClick={toggleRegistrationModal}
                                            className={`${authButtonStyles} py-3 sm:py-3.5 text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg transition duration-300 ease-in-out flex justify-center`}
                                        >
                                            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                                            Register
                                        </button>
                                    </>
                                )}
                            </div>

                            <div className="mt-4 sm:mt-6 ">
                                {categories?.length ? (
                                    <ul className="space-y-2 sm:space-y-3">
                                        {categories.map((category) => (
                                            <li key={category.id}>
                                                <div className="flex items-center justify-between">
                                                    <Link
                                                        href={route('products.by.category', category.id)}
                                                        className="text-sm sm:text-base text-gray-100 hover:text-cyan-400 py-1.5 sm:py-2"
                                                        onClick={() => setMobileMenuOpen(false)}
                                                    >
                                                        {category.name}
                                                    </Link>
                                                    {category.subcategories?.length > 0 && (
                                                        <button
                                                            onClick={() => toggleCategory(category.id)}
                                                            className="text-gray-400 hover:text-cyan-400"
                                                        >
                                                            <FontAwesomeIcon
                                                                icon={expandedCategories[category.id] ? faMinus : faPlus}
                                                                size="sm"
                                                            />
                                                        </button>
                                                    )}
                                                </div>
                                                {expandedCategories[category.id] && category.subcategories?.length > 0 && (
                                                    <ul className="ml-3 sm:ml-4 mt-2 space-y-1.5 sm:space-y-2">
                                                        {category.subcategories.map((subcategory) => (
                                                            <li key={subcategory.id}>
                                                                <div className="flex items-center justify-between">
                                                                    <Link
                                                                        href={route('products.by.subcategory', subcategory.id)}
                                                                        className="text-xs sm:text-sm text-gray-300 hover:text-cyan-400 py-1"
                                                                        onClick={() => setMobileMenuOpen(false)}
                                                                    >
                                                                        {subcategory.sub_category_name}
                                                                    </Link>
                                                                    {subcategory.brands?.length > 0 && (
                                                                        <button
                                                                            onClick={() => toggleSubcategory(subcategory.id)}
                                                                            className="text-gray-400 hover:text-cyan-400"
                                                                        >
                                                                            <FontAwesomeIcon
                                                                                icon={expandedSubcategories[subcategory.id] ? faMinus : faPlus}
                                                                                size="xs"
                                                                            />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                                {expandedSubcategories[subcategory.id] && subcategory.brands?.length > 0 && (
                                                                    <ul className="ml-3 sm:ml-4 mt-1 space-y-1">
                                                                        {subcategory.brands.map((brand) => (
                                                                            <li key={brand.id}>
                                                                                <Link
                                                                                    href={route('products.by.brand', brand.id)}
                                                                                    className="block text-xs sm:text-sm text-gray-400 hover:text-cyan-400 py-1"
                                                                                    onClick={() => setMobileMenuOpen(false)}
                                                                                >
                                                                                    {brand.brand_name}
                                                                                </Link>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-red-500 text-xs sm:text-sm">No categories found.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Secondary Navbar (Desktop) */}
            <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg py-2 z-40 border-b border-cyan-500/30 md:mt-[72px]">
                <div className="container ml-[93px] px-4 sm:px-6 lg:px-8">
                    <div className="hidden lg:flex items-center">
                        {categories?.slice(0, 14).map((category) => (
                            <div key={category.id} className="relative group pb-1">
                                <Link
                                    href={route('products.by.category', category.id)}
                                    className="flex items-center px-3 py-1 text-sm font-semibold text-gray-100 hover:text-cyan-400 transition-colors duration-300"
                                >
                                    {category.name}
                                    {category.subcategories?.length > 0 && (
                                        <svg className="ml-1 h-4 w-4 text-gray-400 group-hover:text-cyan-400 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </Link>
                                {category.subcategories?.length > 0 && (
                                    <ul
                                        className="absolute left-0 mt-0 w-64 bg-gray-800 rounded-xl shadow-2xl shadow-cyan-500/20 border border-gray-700 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transform translate-y-1 group-hover:translate-y-0 transition-all duration-200 ease-out z-50"
                                        role="menu"
                                    >
                                        {category.subcategories.map((subcategory) => (
                                            <li key={subcategory.id} className="relative group/sub px-2">
                                                <Link
                                                    href={route('products.by.subcategory', subcategory.id)}
                                                    className="flex items-center px-5 py-3 text-sm font-medium text-gray-200 hover:bg-gray-700 hover:text-cyan-400 rounded-lg transition-colors duration-200"
                                                >
                                                    {subcategory.sub_category_name}
                                                    {subcategory.brands?.length > 0 && (
                                                        <svg className="ml-2 h-4 w-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l-7 7 7 7" />
                                                        </svg>
                                                    )}
                                                </Link>
                                                {subcategory.brands?.length > 0 && (
                                                    <ul
                                                        className="absolute left-full top-0 w-64 bg-gray-800 rounded-xl shadow-2xl shadow-cyan-500/20 border border-gray-700 opacity-0 group-hover/sub:opacity-100 pointer-events-none group-hover/sub:pointer-events-auto transform -translate-x-1 group-hover/sub:translate-x-0 transition-all duration-200 ease-out z-50"
                                                        role="menu"
                                                    >
                                                        {subcategory.brands.map((brand) => (
                                                            <li key={brand.id}>
                                                                <Link
                                                                    href={route('products.by.brand', brand.id)}
                                                                    className="flex items-center px-5 py-3 text-sm font-medium text-gray-200 hover:bg-gray-700 hover:text-cyan-400 rounded-lg transition-colors duration-200"
                                                                    role="menuitem"
                                                                >
                                                                    {brand.brand_name}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </nav>

            {loginModalOpen && (
                <LoginModal closeModal={toggleLoginModal} toggleToRegistrationModal={toggleRegistrationModal} onLoginSuccess={handleLoginSuccess} />
            )}
            {registrationModalOpen && (
                <RegistrationModal closeModal={toggleRegistrationModal} toggleToLoginModal={toggleLoginModal} />
            )}
        </header>
    );
}

export default Navbar;
