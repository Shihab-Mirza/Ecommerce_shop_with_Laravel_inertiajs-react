import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSignInAlt, faUserPlus, faSearch, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from '@inertiajs/react';
import LoginModal from '@/Pages/Landing/LoginModal';
import RegistrationModal from '@/Pages/Landing/RegistrationModal';

function Navbar({ auth }) {
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
        Inertia.get('/search', { query: searchQuery });
    };

    return (
        <header>
            <nav className="z-50 fixed top-0 w-full p-4 bg-gradient-to-r from-emerald-300 to-emerald-600 backdrop-blur-md shadow-lg transition-all duration-300">
                <div className="flex flex-wrap items-center max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex items-center w-full md:w-auto">
                        <Link href="/" className="text-3xl font-semibold text-gray-900 tracking-wide hover:text-white transition duration-300 lg:ml-[-100px]">
                            Computer Store
                        </Link>

                        {/* Mobile Menu Icon and Search Icon */}
                        <div className="flex items-center ml-auto gap-4 md:hidden">
                            <button onClick={toggleSearch} className="text-white text-xl focus:outline-none transition duration-300">
                                <FontAwesomeIcon icon={searchOpen ? faTimes : faSearch} />
                            </button>
                            <button onClick={toggleMenu} className="text-white text-xl focus:outline-none transition duration-300">
                                <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className={`md:w-auto md:mr-2 transition-all duration-300 ${searchOpen ? 'block mt-4' : 'hidden md:block'}`}>
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                className="w-full md:w-[600px] lg:w-[600px] h-12 bg-white/70 rounded-full pl-12 pr-12  shadow-md focus:outline-none focus:ring-2 focus:ring-gray-700 transition duration-300 ml-4"
                                placeholder="Search for products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 lg:gap-64">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </form>
                    </div>

                    {/* Navbar Links */}
                    <div className={`ml-auto w-full md:w-auto transition-all duration-300 ${menuOpen ? 'block mt-4' : 'hidden md:flex'}`}>
                        <div className="flex flex-row gap-2 items-center justify-end w-full md:w-auto ml-auto">
                            {auth.user ? (
                                <>
                                    <Link href="/profile" className="w-full md:w-auto px-4 py-2 text-white font-medium rounded-lg shadow-lg hover:bg-white/30 flex items-center gap-2 justify-center transition duration-300">
                                        <FontAwesomeIcon icon={faUserPlus} /> Profile
                                    </Link>
                                    <Link href="/logout" method="post" className="w-full md:w-auto px-4 py-2 text-white font-medium rounded-lg shadow-lg hover:bg-white/30 flex items-center gap-2 justify-center transition duration-300">
                                        <FontAwesomeIcon icon={faSignOutAlt} /> Log out
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button onClick={toggleLoginModal} className="w-full md:w-auto px-4 py-2 text-white font-medium rounded-lg shadow-lg hover:bg-white/30 flex items-center gap-2 justify-center transition duration-300">
                                        <FontAwesomeIcon icon={faSignInAlt} /> Log in
                                    </button>
                                    <button onClick={toggleRegistrationModal} className="w-full md:w-auto px-4 py-2 text-white font-medium rounded-lg shadow-lg hover:bg-white/30 flex items-center gap-2 justify-center transition duration-300">
                                        <FontAwesomeIcon icon={faUserPlus} /> Register
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
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
