import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import NavBar from './Navbar';
import Footer from './Footer';
const Modal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all duration-300 scale-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">{message}</h3>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200 transition duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200 font-medium"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ViewWishlist({ auth, wishlistItems, categories }) {
  const { delete: destroy } = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

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

  return (
    <>
      <Head title="Wishlist" />
      <NavBar auth={auth} categories={categories} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Wishlist</h1>
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <p className="text-gray-600 text-xl mb-6">Your wishlist is empty.</p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full hover:from-gray-900 hover:to-gray-950 transition duration-300 font-medium shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <ul className="space-y-6">
            {wishlistItems.map((item, index) => (
              <li
                key={item.id}
                className="flex items-center border border-gray-100 rounded-xl bg-white p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="w-10 text-xl font-semibold text-gray-700">{index + 1}.</span>
                <Link href={`/product/${item.product_id}`} className="flex items-center flex-1">
                  <div className="flex items-center flex-1">
                    {item.image_path ? (
                      <img
                        src={`/storage/${item.image_path}`}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs mr-4">
                        No Image
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{item.product_name}</h3>
                      <div className="mt-2">
                        {item.is_offered_product && item.offer_price ? (
                          <div className="flex items-center space-x-3">
                            <span className="text-red-500 font-semibold text-lg">Tk {item.offer_price}</span>
                            <span className="text-gray-400 line-through text-sm">Tk {item.original_price}</span>
                          </div>
                        ) : (
                          <span className="text-gray-900 font-semibold text-lg">Tk {item.original_price}</span>
                        )}
                      </div>
                      <div className="flex items-center mt-3">
                        {item.quantity > 0 ? (
                          <div className="flex items-center text-green-500">
                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-lg" />
                            <span className="text-sm font-medium">In Stock</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-red-500">
                            <FontAwesomeIcon icon={faExclamationCircle} className="mr-2 text-lg" />
                            <span className="text-sm font-medium">Out of Stock</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemoveClick(item.id)}
                  className="ml-4 text-red-500 hover:text-red-600 transition duration-300 transform hover:scale-110"
                  title="Remove from Wishlist"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-lg" />
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
        message="Are you sure you want to remove this item from your wishlist?"
      />
      <Footer />
    </>
  );
}
