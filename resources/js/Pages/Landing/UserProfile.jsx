import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faShoppingCart, faHeart, faSignOutAlt, faCoins } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';
import Footer from './Footer';
import CartModal from './CartModal';
import { useForm } from '@inertiajs/react';

export default function UserProfile({ auth, categories, userPoints = 0, cartItems, cartCount, cartId, checkoutToken }) {
  const {
    data,
    setData,
    patch,
    post,
    processing,
    errors,
    reset,
  } = useForm({
    name: auth.user.name || '',
    email: auth.user.email || '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const resendForm = useForm();
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [localCartItems, setLocalCartItems] = useState(cartItems || []);
  const [localCartCount, setLocalCartCount] = useState(cartCount || 0);
  const [pendingCheckout, setPendingCheckout] = useState(false);

  // Sync cart items and count with props
  useEffect(() => {
    setLocalCartItems(cartItems || []);
    setLocalCartCount(cartCount || 0);
  }, [cartItems, cartCount]);

  // Toggle cart modal
  const toggleCartModal = () => {
    setCartModalOpen((prev) => !prev);
  };

  const openLoginModal = () => {
    // Placeholder for login modal trigger, passed to Navbar or CartModal if needed
  };

  const updateProfile = (e) => {
    e.preventDefault();
    patch(route('profile.update'), {
      preserveScroll: true,
    });
  };

  const updatePassword = (e) => {
    e.preventDefault();
    post(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset('current_password', 'password', 'password_confirmation'),
    });
  };

  const resendVerification = () => {
    resendForm.post(route('verification.send'), {
      preserveScroll: true,
    });
  };

  return (
    <>
      <Head title="User Profile" />
      <Navbar
        auth={auth}
        categories={categories}
        cartCount={localCartCount}
        toggleCartModal={toggleCartModal}
        setPendingCheckout={setPendingCheckout}
        cartId={cartId}
        checkoutToken={checkoutToken}
      />
      <main className="container mx-auto px-4 py-8 min-h-screen bg-gray-50 relative">
        {/* Floating Cart Icon */}
        <button
          onClick={toggleCartModal}
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-40 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <FontAwesomeIcon icon={faShoppingCart} size="lg" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
              {localCartCount}
            </span>
        </button>

        {/* Cart Modal */}
        <CartModal
          isOpen={cartModalOpen}
          toggleCartModal={toggleCartModal}
          cartItems={localCartItems}
          cartCount={localCartCount}
          setCartItems={setLocalCartItems}
          setCartCount={setLocalCartCount}
          auth={auth}
          cartId={cartId}
          checkoutToken={checkoutToken}
          setPendingCheckout={setPendingCheckout}
          openLoginModal={openLoginModal}
        />

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4 bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex flex-col items-center mb-6 sm:mb-8 mt-4">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-5xl sm:text-6xl text-gray-700 transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 hover:opacity-20 rounded-full blur-xl transition-opacity duration-300"></div>
              </div>
              <h2 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-gray-800">{auth.user.name}</h2>
              <p className="text-xs sm:text-sm text-gray-600">{auth.user.email}</p>
            </div>

            {/* Points Section */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Loyalty Points</h3>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faCoins}
                  className="text-xl sm:text-2xl text-yellow-500 transition-transform duration-300 hover:scale-110"
                />
                <p className="text-xl sm:text-2xl font-bold text-indigo-600">{userPoints} Points</p>
              </div>
              <div className="mt-2 bg-gray-200 rounded-full h-2 sm:h-2.5">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 sm:h-2.5 rounded-full"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-3 sm:space-y-4">
              <Link
                href="/order-history"
                className="flex items-center gap-2 text-sm sm:text-base text-gray-700 hover:text-indigo-600 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="text-base sm:text-lg" />
                <span>Order History</span>
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-2 text-sm sm:text-base text-gray-700 hover:text-indigo-600 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faHeart} className="text-base sm:text-lg" />
                <span>Wishlist</span>
              </Link>
              <Link
                href="/logout"
                method="post"
                as="button"
                className="flex items-center gap-2 text-sm sm:text-base text-gray-700 hover:text-red-600 transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="text-base sm:text-lg" />
                <span>Logout</span>
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:w-3/4 space-y-6 md:space-y-8">
            {/* Profile Information Form */}
            <form
              onSubmit={updateProfile}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                Profile Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full p-2 sm:p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-sm sm:text-base"
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs sm:text-sm mt-2 animate-pulse">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="w-full p-2 sm:p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-sm sm:text-base"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs sm:text-sm mt-2 animate-pulse">{errors.email}</p>
                  )}
                </div>
              </div>
              <div className="mt-4 sm:mt-6">
                <button
                  type="submit"
                  disabled={processing}
                  className="relative px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Update Profile
                </button>
              </div>
              {auth.user.email_verified_at === null && (
                <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-700">
                  Your email address is not verified.{' '}
                  <button
                    onClick={resendVerification}
                    disabled={resendForm.processing}
                    className="text-indigo-600 hover:text-indigo-800 underline"
                  >
                    Resend Verification Email
                  </button>
                </div>
              )}
            </form>

            {/* Password Update Form */}
            <form
              onSubmit={updatePassword}
              className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                Update Password
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    className="w-full p-2 sm:p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-sm sm:text-base"
                    placeholder="Enter current password"
                  />
                  {errors.current_password && (
                    <p className="text-red-500 text-xs sm:text-sm mt-2 animate-pulse">{errors.current_password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="w-full p-2 sm:p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-sm sm:text-base"
                    placeholder="Enter new password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs sm:text-sm mt-2 animate-pulse">{errors.password}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    className="w-full p-2 sm:p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 text-sm sm:text-base"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              <div className="mt-4 sm:mt-6">
                <button
                  type="submit"
                  disabled={processing}
                  className="relative px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
