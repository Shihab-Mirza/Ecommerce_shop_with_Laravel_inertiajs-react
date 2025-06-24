import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faTrash, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import NavBar from './Navbar';
import Footer from './Footer';
import CartModal from './CartModal';

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 w-[90vw] max-w-lg min-h-[160px] sm:min-h-[200px] flex flex-col justify-between mx-auto shadow-2xl transform transition-all duration-300 scale-100">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-4 sm:mb-6">{message}</h3>
        <div className="flex justify-end space-x-3 sm:space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition duration-200 font-medium text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200 font-medium text-sm sm:text-base"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ViewWishlist({ auth, wishlistItems, categories, cartItems = [], cartCount = 0, cartId, checkoutToken }) {
  const { delete: destroy } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [localCartItems, setLocalCartItems] = useState(cartItems);
  const [localCartCount, setLocalCartCount] = useState(cartCount);
  const [pendingCheckout, setPendingCheckout] = useState(false);

  useEffect(() => {
    setLocalCartItems(cartItems);
    setLocalCartCount(cartCount);
  }, [cartItems, cartCount]);

  const handleRemoveClick = (itemId) => {
    setSelectedItemId(itemId);
    setIsModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (selectedItemId) {
      destroy(route('wishlist.remove', selectedItemId), {
        preserveScroll: true,
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedItemId(null);
        },
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItemId(null);
  };

  const toggleCartModal = () => {
    setCartModalOpen((prev) => !prev);
  };

  const openLoginModal = () => {
    // This will be passed to Navbar to trigger login modal
  };

  return (
    <>
      <Head title="Wishlist" />
      <NavBar
        auth={auth}
        categories={categories}
        cartCount={localCartCount}
        toggleCartModal={toggleCartModal}
        setPendingCheckout={setPendingCheckout}
        cartId={cartId}
        checkoutToken={checkoutToken}
      />
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-12 relative">
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

        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4 lg:mt-2 mt-8 sm:mb-8">Your Wishlist</h1>
        {wishlistItems.length === 0 ? (
          <div className="text-center py-8 sm:py-16 bg-gray-50 rounded-xl sm:rounded-2xl">
            <p className="text-gray-600 text-base sm:text-xl mb-3 sm:mb-6">Your wishlist is empty.</p>
            <Link
              href="/"
              className="inline-block px-4 py-1 sm:px-8 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full hover:from-gray-900 hover:to-gray-950 transition duration-300 font-medium shadow-md sm:shadow-lg text-xs sm:text-base"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <ul className="space-y-3 sm:space-y-6">
            {wishlistItems.map((item, index) => (
              <li
                key={item.id}
                className="flex items-center border border-gray-100 rounded-lg sm:rounded-xl bg-white p-3 sm:p-6 max-w-full mx-auto hover:shadow-md sm:hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="w-6 sm:w-10 text-sm sm:text-xl font-semibold text-gray-700">{index + 1}.</span>
                <Link href={`/product/${item.product_id}`} className="flex items-center flex-1 min-w-0">
                  <div className="flex items-center flex-1 min-w-0">
                    {item.image_path ? (
                      <img
                        src={`/storage/${item.image_path}`}
                        alt={item.product_name}
                        className="w-10 h-10 sm:w-16 sm:h-16 object-cover rounded-md sm:rounded-lg mr-2 sm:mr-4 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gray-100 rounded-md sm:rounded-lg flex items-center justify-center text-gray-400 text-[10px] sm:text-xs mr-2 sm:mr-4 flex-shrink-0">
                        No Image
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-900">{item.product_name}</h3>
                      <div className="mt-1 sm:mt-2">
                        {item.is_offered_product && item.offer_price ? (
                          <div className="flex items-center space-x-1 sm:space-x-3">
                            <span className="text-red-500 font-semibold text-sm sm:text-lg">Tk {item.offer_price}</span>
                            <span className="text-gray-400 line-through text-[10px] sm:text-sm">Tk {item.original_price}</span>
                          </div>
                        ) : (
                          <span className="text-gray-900 font-semibold text-sm sm:text-lg">Tk {item.original_price}</span>
                        )}
                      </div>
                      <div className="flex items-center mt-1 sm:mt-3">
                        {item.quantity > 0 ? (
                          <div className="flex items-center text-green-500">
                            <FontAwesomeIcon icon={faCheckCircle} className="mr-1 sm:mr-2 text-sm sm:text-lg" />
                            <span className="text-[10px] sm:text-sm font-medium">In Stock</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-500">
                            <FontAwesomeIcon icon={faExclamationCircle} className="mr-1 sm:mr-2 text-sm sm:text-lg" />
                            <span className="text-[10px] sm:text-sm font-medium">Out of Stock</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemoveClick(item.id)}
                  className="ml-2 sm:ml-4 text-red-500 hover:text-red-600 transition duration-300 transform hover:scale-110"
                  title="Remove from Wishlist"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm sm:text-lg" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmRemove}
        message="Are you sure to remove from your wishlist?"
      />
      <Footer />
    </>
  );
}
