import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';
import { motion } from 'framer-motion';
import LoginModal from '@/Pages/Landing/LoginModal';
import RegistrationModal from '@/Pages/Landing/RegistrationModal';

function CartModal({
  isOpen,
  toggleCartModal,
  cartItems,
  cartCount,
  setCartItems,
  setCartCount,
  auth,
  cartId,
  checkoutToken,
  setPendingCheckout,
  isCheckoutPage = false,
}) {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [confirmRemoveItemId, setConfirmRemoveItemId] = useState(null);

  const toggleLoginModal = () => {
    setLoginModalOpen(!loginModalOpen);
    setRegistrationModalOpen(false);
  };

  const toggleRegistrationModal = () => {
    setRegistrationModalOpen(!registrationModalOpen);
    setLoginModalOpen(false);
  };

  const handleLoginSuccess = () => {
    setLoginModalOpen(false);
    if (setPendingCheckout) {
      setPendingCheckout(false);
      Inertia.get(`/checkout2/${cartId}/${checkoutToken}`);
    }
  };

  const handleQuantityChange = async (itemId, quantity) => {
    if (isCheckoutPage) return;
    if (quantity < 1) return;
    const item = cartItems.find((item) => item.id === itemId);
    if (quantity > item.available_stock) return;

    setIsUpdating(true);
    setUpdatingItemId(itemId);

    try {
      const response = await axios.post('/cart/update', {
        item_id: itemId,
        quantity: parseInt(quantity),
      });

      if (response.data.success) {
        const updatedItems = cartItems.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity: parseInt(quantity),
                total_price: item.is_offered_product === 'yes' && item.offer_price
                  ? item.offer_price * quantity
                  : item.price * quantity,
              }
            : item
        );
        setCartItems(updatedItems);
        setCartCount(updatedItems.length);
      } else {
        alert(response.data.error || 'Failed to update cart item');
      }
    } catch (error) {
      alert('Failed to update cart item');
    } finally {
      setIsUpdating(false);
      setUpdatingItemId(null);
    }
  };

  const initiateRemoveItem = (itemId) => {
    setConfirmRemoveItemId(itemId);
  };

  const cancelRemoveItem = () => {
    setConfirmRemoveItemId(null);
  };

  const confirmRemoveItem = async (itemId) => {
    setIsRemoving(true);
    setLoadingItemId(itemId);

    try {
      const response = await axios.post('/cart/remove', {
        item_id: itemId,
      });

      if (response.data.success) {
        const updatedItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedItems);
        setCartCount(updatedItems.length);
      } else {
        alert(response.data.error || 'Failed to remove cart item');
      }
    } catch (error) {
      alert('Failed to remove cart item');
    } finally {
      setIsRemoving(false);
      setLoadingItemId(null);
      setConfirmRemoveItemId(null);
    }
  };

  const handleCheckout = () => {
    const outOfStockItems = cartItems.filter((item) => item.quantity > item.available_stock);
    if (outOfStockItems.length > 0) {
      const messages = outOfStockItems.map(
        (item) => `${item.product_name}: ${item.quantity} requested, but only ${item.available_stock} available.`
      );
      alert(`Cannot proceed to checkout:\n${messages.join('\n')}`);
      return;
    }

    if (!auth.user) {
      setPendingCheckout(true);
      setLoginModalOpen(true);
      toggleCartModal();
    } else {
      Inertia.get(`/checkout2/${cartId}/${checkoutToken}`);
    }
  };

  const increaseQuantity = (itemId, currentQuantity, availableStock) => {
    if (isCheckoutPage) return;
    if (currentQuantity >= availableStock) return;
    handleQuantityChange(itemId, currentQuantity + 1);
  };

  const decreaseQuantity = (itemId, currentQuantity) => {
    if (isCheckoutPage) return;
    if (currentQuantity > 1) {
      handleQuantityChange(itemId, currentQuantity - 1);
    }
  };

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    toggleCartModal();
  };

  const isCheckoutDisabled = cartItems.some((item) => item.quantity > item.available_stock);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleOverlayClick}
          ></div>
          <div className="w-full max-w-[90vw] xs:max-w-[400px] sm:max-w-[450px] md:max-w-[500px] lg:w-[465px] lg:max-w-[465px] lg:h-full bg-white h-auto sm:h-full md:h-full shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0 relative z-100">
            <div className="p-3 xs:p-4 sm:p-5 flex justify-between items-center border-b">
              <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-900">
                Your Cart ({cartCount})
              </h2>
              <button
                onClick={toggleCartModal}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <FontAwesomeIcon icon={faTimes} className="text-lg sm:text-xl" />
              </button>
            </div>
            <div className="p-3 xs:p-4 sm:p-5 overflow-y-auto h-[calc(100%-7rem)] xs:h-[calc(100%-8rem)]">
              {cartCount === 0 ? (
                <p className="text-gray-500 text-center text-sm xs:text-base sm:text-lg">
                  Your cart is empty.
                </p>
              ) : (
                <div className="space-y-3 xs:space-y-4 sm:space-y-5">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-2 xs:gap-3 sm:gap-4 border-b pb-3 xs:pb-4 sm:pb-5"
                    >
                      {item.image_path ? (
                        <img
                          src={`/storage/${item.image_path}`}
                          alt={item.product_name || 'Product'}
                          className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 object-cover rounded border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-[10px] xs:text-xs">
                          No Image
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-sm xs:text-base sm:text-lg font-medium text-gray-900">
                          {item.product_name || 'Unknown Product'}
                        </h3>
                        <div className="text-xs xs:text-sm text-gray-500">
                          {item.is_offered_product === 'yes' && item.offer_price !== null ? (
                            <>
                              <span className="text-red-600 font-semibold">
                                Tk {item.offer_price.toFixed(2)}
                              </span>
                              <span className="line-through text-gray-400 ml-1 xs:ml-2">
                                Tk {item.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span>Tk {item.price ? item.price.toFixed(2) : '0.00'}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 xs:gap-2 mt-1 xs:mt-2">
                          <label className="text-xs xs:text-sm text-gray-700">Qty:</label>
                          <div className="flex items-center border border-gray-200 rounded-lg relative">
                            <motion.button
                              onClick={() => decreaseQuantity(item.id, item.quantity)}
                              disabled={item.quantity <= 1 || isUpdating || isRemoving || isCheckoutPage}
                              className={`px-2 xs:px-3 py-1 xs:py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                              whileHover={{ scale: (item.quantity <= 1 || isUpdating || isRemoving || isCheckoutPage) ? 1 : 1.1 }}
                              whileTap={{ scale: (item.quantity <= 1 || isUpdating || isRemoving || isCheckoutPage) ? 1 : 0.95 }}
                            >
                              <FontAwesomeIcon icon={faMinus} className="text-xs xs:text-sm" />
                            </motion.button>
                            <input
                              type="number"
                              value={item.quantity}
                              readOnly
                              className={`w-10 xs:w-12 sm:w-14 px-2 xs:px-3 py-1 xs:py-2 text-gray-900 font-semibold text-xs xs:text-sm text-center border-none focus:ring-0 ${
                                isCheckoutPage ? 'bg-gray-100 cursor-not-allowed' : ''
                              }`}
                              crippled={isCheckoutPage}
                            />
                            <motion.button
                              onClick={() => increaseQuantity(item.id, item.quantity, item.available_stock)}
                              disabled={item.quantity >= item.available_stock || isUpdating || isRemoving || isCheckoutPage}
                              className="px-2 xs:px-3 py-1 xs:py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                              whileHover={{ scale: (item.quantity >= item.available_stock || isUpdating || isRemoving || isCheckoutPage) ? 1 : 1.1 }}
                              whileTap={{ scale: (item.quantity >= item.available_stock || isUpdating || isRemoving || isCheckoutPage) ? 1 : 0.95 }}
                            >
                              <FontAwesomeIcon icon={faPlus} className="text-xs xs:text-sm" />
                            </motion.button>
                            {updatingItemId === item.id && isUpdating && (
                              <span className="spinner absolute right-[-20px]"></span>
                            )}
                          </div>
                          <div className="flex flex-col">
                            {item.quantity > item.available_stock && (
                              <span className="text-red-500 text-[10px] xs:text-xs">
                                Quantity exceeds stock availability!
                              </span>
                            )}
                            {item.quantity >= item.available_stock && (
                              <span className="text-red-500 text-[10px] xs:text-xs">
                                Quantity reached maximum stock availability.
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-xs xs:text-sm text-gray-700 mt-1 xs:mt-2">
                          Total: Tk
                          {(item.is_offered_product === 'yes' && item.offer_price !== null
                            ? item.offer_price * item.quantity
                            : item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      {confirmRemoveItemId === item.id ? (
                        <div className="flex flex-col items-end gap-2">
                          <p className="text-xs xs:text-sm text-gray-700">
                            Are you sure you want to remove this item?
                          </p>
                          <div className="flex gap-2">
                            <motion.button
                              onClick={() => confirmRemoveItem(item.id)}
                              className={`px-2 xs:px-3 py-1 xs:py-1.5 text-xs xs:text-sm text-white bg-red-500 hover:bg-red-600 rounded ${
                                isRemoving || isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={isRemoving || isUpdating}
                              whileHover={{ scale: (isRemoving || isUpdating) ? 1 : 1.1 }}
                              whileTap={{ scale: (isRemoving || isUpdating) ? 1 : 0.95 }}
                            >
                              Yes
                              {loadingItemId === item.id && <span className="spinner ml-2"></span>}
                            </motion.button>
                            <motion.button
                              onClick={cancelRemoveItem}
                              className={`px-2 xs:px-3 py-1 xs:py-1.5 text-xs xs:text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 rounded ${
                                isRemoving || isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={isRemoving || isUpdating}
                              whileHover={{ scale: (isRemoving || isUpdating) ? 1 : 1.1 }}
                              whileTap={{ scale: (isRemoving || isUpdating) ? 1 : 0.95 }}
                            >
                              No
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <motion.button
                          onClick={() => initiateRemoveItem(item.id)}
                          className={`text-red-500 hover:text-red-700 text-xs xs:text-sm flex items-center ${
                            isRemoving || isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          disabled={isRemoving || isUpdating}
                          whileHover={{ scale: (isRemoving || isUpdating) ? 1 : 1.1 }}
                          whileTap={{ scale: (isRemoving || isUpdating) ? 1 : 0.95 }}
                        >
                          Remove
                          {loadingItemId === item.id && <span className="spinner"></span>}
                        </motion.button>
                      )}
                    </div>
                  ))}
                  <div className="mt-3 xs:mt-4 sm:mt-5">
                    <div className="flex justify-between text-sm xs:text-base sm:text-lg font-semibold">
                      <span>Total:</span>
                      <span>
                        Tk
                        {cartItems
                          .reduce((sum, item) =>
                            sum + (item.is_offered_product === 'yes' && item.offer_price !== null
                              ? item.offer_price * item.quantity
                              : item.price * item.quantity), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className={`w-full mt-3 xs:mt-4 sm:mt-5 px-3 xs:px-4 py-2 xs:py-3 rounded-full text-center transition duration-300 text-sm xs:text-base sm:text-lg ${
                        isCheckoutDisabled || isUpdating || isRemoving || isCheckoutPage
                          ? 'bg-gray-800 text-white cursor-not-allowed'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                      disabled={isCheckoutDisabled || isUpdating || isRemoving || isCheckoutPage}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {loginModalOpen && (
        <LoginModal
          closeModal={toggleLoginModal}
          toggleToRegistrationModal={toggleRegistrationModal}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      {registrationModalOpen && (
        <RegistrationModal
          closeModal={toggleRegistrationModal}
          toggleToLoginModal={toggleLoginModal}
        />
      )}
    </>
  );
}

export default CartModal;
