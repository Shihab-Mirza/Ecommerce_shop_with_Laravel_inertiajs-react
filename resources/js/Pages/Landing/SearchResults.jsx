import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import NavBar from './Navbar';
import Footer from './Footer';
import CartModal from './CartModal';

export default function SearchResults({ auth, products, query, categories, cartItems, cartCount, cartId, checkoutToken }) {
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

  return (
    <>
      <Head title={`Search Results for "${query}"`} />
      <NavBar
        auth={auth}
        categories={categories}
        cartCount={localCartCount}
        toggleCartModal={toggleCartModal}
        setPendingCheckout={setPendingCheckout}
        cartId={cartId}
        checkoutToken={checkoutToken}
      />
      <div className="container mx-auto px-4 py-4 min-h-screen relative">
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

        {/* Main Content */}
        <main className="flex-1">
          {products.data.length === 0 ? (
            <p className="text-black text-center text-base sm:text-lg mt-8 mb-[calc(100vh-20rem)]">
              No products found...
            </p>
          ) : (
            <>
              <div className="flex flex-col">
                {/* Header Card */}
                <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-3 mt-6 lg:mt-0 sm:p-4 mb-4">
                  <h1 className="text-base sm:text-lg md:text-xl font-bold text-left mb-0">
                    Search Results for "{query}"
                  </h1>
                </div>
                {/* Product Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-12">
                  {products.data.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white shadow-md rounded-lg border border-gray-200 p-3 sm:p-4 text-center transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl min-h-[220px] sm:min-h-[250px] md:min-h-[250px] flex flex-col justify-end relative"
                    >
                      {product.is_offered_product === 'yes' && (
                        <div className="absolute top-2 left-2 animate-fire">
                          <i className="fas fa-fire text-yellow-500 text-base sm:text-lg animate-pulse"></i>
                        </div>
                      )}
                      {/* Product Image as Link */}
                      <Link href={route('products.show', product.id)}>
                        {product.image ? (
                          <img
                            src={asset(`storage/${product.image}`)}
                            alt={product.name}
                            className="w-full h-20 sm:h-24 md:h-28 object-contain mb-2 sm:mb-3 cursor-pointer"
                          />
                        ) : (
                          <div className="w-full h-20 sm:h-24 md:h-28 bg-gray-200 flex items-center justify-center mb-2 sm:mb-3 cursor-pointer">
                            <span className="text-gray-500 text-xs sm:text-sm">No Image</span>
                          </div>
                        )}
                      </Link>
                      <div className="mt-auto">
                        {/* Product Name as Link */}
                        <h3 className="text-xs sm:text-sm md:text-base font-semibold mb-1 sm:mb-2 line-clamp-2">
                          <Link
                            href={route('products.show', product.id)}
                            className="text-blue-600 hover:underline"
                          >
                            {product.name}
                          </Link>
                        </h3>
                        {/* Price Display */}
                        {product.is_offered_product === 'yes' && product.offer ? (
                          <div className="text-gray-600 text-xs sm:text-sm">
                            <span className="line-through">{parseFloat(product.price).toFixed(2)} Tk</span>
                            <span className="ml-1 text-red-600">
                              {parseFloat(product.offer.offer_price).toFixed(2)} Tk
                            </span>
                          </div>
                        ) : (
                          <p className="text-gray-600 text-xs sm:text-sm">
                            {parseFloat(product.price).toFixed(2)} Tk
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Pagination */}
              <div className="mt-6 sm:mt-8 flex justify-center flex-wrap gap-2">
                {products.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => link.url && window.location.assign(link.url)}
                    disabled={!link.url}
                    className={`px-2 py-1 sm:px-3 sm:py-1.5 border rounded text-xs sm:text-sm ${
                      link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
                    } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

// Helper function to generate asset URLs
function asset(path) {
  return `/${path}`;
}
