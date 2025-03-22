import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser, faSignInAlt, faUserPlus, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  // Sample state for demonstration - you can manage this via props or context
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    // Add your logout logic here (e.g., clear tokens, redirect)
    setIsLoggedIn(false);
  };

  return (
    <header>
      <nav className='z-50 top-0 w-full p-4 bg-gradient-to-r from-emerald-300 to-emerald-600 backdrop-blur-md shadow-md transition-all duration-300'>
        <div className='flex flex-wrap justify-between items-center max-w-7xl mx-auto px-4'>
          <p className='text-xl font-semibold tracking-wide text-gray-900'>Computer Store</p>

          <button
            className='md:hidden text-gray-900 text-xl focus:outline-none'
            onClick={() => setIsOpen(!isOpen)}
          >
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>

          <div className={`w-full md:w-auto flex-col md:flex md:flex-row items-center gap-4 ${isOpen ? 'flex' : 'hidden'} md:flex`}>
            <div className='flex w-full md:w-auto justify-center items-center gap-3'>
              <input
                className='w-full md:w-[400px] lg:w-[600px] h-11 bg-white/70 rounded-lg px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-700 transition-all duration-300'
                placeholder='Search for products...'
              />
              <button className='rounded-lg w-[120px] h-11 bg-white text-gray-900 font-medium shadow-md hover:bg-gray-300 transition-all duration-300'>
                Search
              </button>
            </div>

            <div className='flex flex-col md:flex-row gap-4 items-center'>
              {isLoggedIn ? (
                <>
                  <a
                    href="/profile"
                    className='px-4 py-2 text-gray-900 font-medium rounded-lg shadow-md transition-all duration-300 hover:bg-white/30 flex items-center gap-2'
                  >
                    <FontAwesomeIcon icon={faUser} /> Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className='px-4 py-2 text-white font-medium bg-gray-900 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-700 flex items-center gap-2'
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className='px-4 py-2 text-gray-900 font-medium rounded-lg shadow-md transition-all duration-300 hover:bg-white/30 flex items-center gap-2'
                  >
                    <FontAwesomeIcon icon={faSignInAlt} /> Log in
                  </a>
                  <a
                    href="/register"
                    className='px-4 py-2 text-white font-medium bg-gray-900 rounded-lg shadow-md transition-all duration-300 hover:bg-gray-700 flex items-center gap-2'
                  >
                    <FontAwesomeIcon icon={faUserPlus} /> Register
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
