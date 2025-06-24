import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';
import Footer from './Footer';
import CartModal from './CartModal';

export default function About({ auth, categories, cartItems, cartCount, cartId, checkoutToken }) {
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
    // Placeholder for login modal trigger
  };

  return (
    <>
      <Head title="About Us" />
      <Navbar
        auth={auth}
        categories={categories}
        cartCount={localCartCount}
        toggleCartModal={toggleCartModal}
        setPendingCheckout={setPendingCheckout}
        cartId={cartId}
        checkoutToken={checkoutToken}
      />
      <div className="md:w-2/3 px-2 sm:px-4 lg:mt-0 mt-10 md:mt-16 sm:mt-16 lg:mr-7"></div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 relative">
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

        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-6 sm:mb-10 flex items-center gap-3">
          About Us
        </h1>
        <section className="space-y-8 sm:space-y-12">
          {/* Company Mission */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Our Mission</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              At Tech Shop, our mission is to provide high-quality tech products that empower our customers to achieve their goals. We strive to deliver exceptional service and innovative solutions tailored to your needs.
            </p>
          </div>
          {/* Our Vision */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Our Vision</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              We envision a world where technology is accessible to everyone, fostering creativity and connectivity. Our goal is to be the leading tech retailer trusted by communities worldwide.
            </p>
          </div>

          {/* Our Team */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Our Team</h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Our dedicated team of professionals is passionate about technology and customer satisfaction. From product experts to customer support, we work together to ensure a seamless shopping experience.
            </p>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-block px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full hover:from-gray-900 hover:to-gray-950 transition duration-300 font-medium shadow-lg text-sm sm:text-base"
            >
              Explore Our Products
              <FontAwesomeIcon icon={faShoppingCart} className="fa-sm ml-2" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
