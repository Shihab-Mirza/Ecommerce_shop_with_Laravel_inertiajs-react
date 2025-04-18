import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSignInAlt, faUserPlus, faSearch, faSignOutAlt, faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';
import { Link } from '@inertiajs/react';
import LoginModal from '@/Pages/Landing/LoginModal';
import RegistrationModal from '@/Pages/Landing/RegistrationModal';
import { Inertia } from '@inertiajs/inertia';

function Navbar({ auth, cartCount = 0 }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        if (searchOpen) setSearchOpen(false);
    };

    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
        if (menuOpen) setMenuOpen(false);
    };

    const toggleLoginModal = () => {
        setLoginModalOpen(!loginModalOpen);
        setRegistrationModalOpen(false);
        setMenuOpen(false);
    };

    const toggleRegistrationModal = () => {
        setRegistrationModalOpen(!registrationModalOpen);
        setLoginModalOpen(false);
        setMenuOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            Inertia.get('/search', { query: searchQuery });
        }
    };

    const authButtonStyles = "px-5 py-2 text-sm text-gray-100 font-medium tracking-wide uppercase rounded-full bg-gray-800/80 border border-gray-700/50 hover:bg-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/30 transition-all duration-300 flex items-center gap-2 shadow-sm";

    return (
        <header>
            <nav className="z-50 fixed top-0 w-full p-4 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-lg shadow-md transition-all duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="text-2xl font-extralight text-white tracking-tight hover:text-gray-200 transition duration-300">
                            Computer Store
                        </Link>

                        {/* Search Bar (White) with Icon on Right */}
                        <form onSubmit={handleSearch} className="relative flex-grow max-w-xl mx-8">
                            <input
                                className="w-full h-10 bg-white text-gray-900 rounded-lg pl-4 pr-12 shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 placeholder-gray-500 text-sm tracking-wide"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition duration-300">
                                <FontAwesomeIcon icon={faSearch} size="sm" />
                            </button>
                        </form>

                        {/* Navigation Links */}
                        <div className="flex items-center gap-4">
                            <Link href="/cart" className="relative p-2 text-gray-200 hover:text-white transition duration-300">
                                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            </Link>
                            <Link href="/wishlist" className="p-2 text-gray-200 hover:text-white transition duration-300">
                                <FontAwesomeIcon icon={faHeart} size="lg" />
                            </Link>
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
                        {/* Logo */}
                        <Link href="/" className="text-2xl font-extralight text-white tracking-tight hover:text-gray-200 transition duration-300">
                            Computer Store
                        </Link>

                        {/* Mobile Toggles */}
                        <div className="flex items-center gap-4">
                            <button onClick={toggleSearch} className="text-gray-200 hover:text-white transition duration-300">
                                <FontAwesomeIcon icon={searchOpen ? faTimes : faSearch} size="lg" />
                            </button>
                            <button onClick={toggleMenu} className="text-gray-200 hover:text-white transition duration-300">
                                <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar (White) with Icon on Right */}
                    {searchOpen && (
                        <div className="md:hidden mt-4">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    className="w-full h-10 bg-white text-gray-900 rounded-full pl-4 pr-12 shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 placeholder-gray-500 text-sm tracking-wide"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition duration-300">
                                    <FontAwesomeIcon icon={faSearch} size="sm" />
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Mobile Menu Dropdown */}
                    {menuOpen && (
                        <div className="md:hidden mt-4 space-y-3">
                            <Link href="/cart" className="px-4 py-2 text-gray-200 hover:bg-gray-800/50 rounded-lg transition duration-300 flex items-center gap-2">
                                <FontAwesomeIcon icon={faShoppingCart} /> Cart
                                <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            </Link>
                            <Link href="/wishlist" className="px-4 py-2 text-gray-200 hover:bg-gray-800/50 rounded-lg transition duration-300 flex items-center gap-2">
                                <FontAwesomeIcon icon={faHeart} /> Wishlist
                            </Link>
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
                    )}
                </div>
            </nav>

            {loginModalOpen && (
                <LoginModal closeModal={toggleLoginModal} toggleToRegistrationModal={toggleRegistrationModal} />
            )}
            {registrationModalOpen && (
                <RegistrationModal closeModal={toggleRegistrationModal} toggleToLoginModal={toggleLoginModal} />
            )}
        </header>
    );
}

export default Navbar;
