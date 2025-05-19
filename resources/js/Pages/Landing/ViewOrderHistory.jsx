import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import Navbar from './Navbar';
import Footer from './Footer';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-xl p-4 sm:p-6 max-w-2xl w-full mx-2 sm:mx-4 shadow-2xl transform transition-all duration-300 ease-out scale-100 max-h-[85vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition duration-200 ease-in-out"
          aria-label="Close modal"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 flex items-center gap-2">
            {title}
          </h3>
        </div>
        {children}
      </div>
    </div>
  );
};

export default function ViewOrderHistory({ auth, orders, categories }) {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const handleViewItems = (order) => {
    setSelectedOrder(order);
    setIsItemsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailsModalOpen(false);
    setIsItemsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <>
      <Head title="Order History" />
      <Navbar auth={auth} categories={categories}  />
      <div className="md:w-2/3 px-2 sm:px-4 lg:mt-0 mt-10 md:mt-16 sm:mt-16 lg:mr-7 "></div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-6 sm:mb-10 flex items-center gap-3">
          <FontAwesomeIcon icon={faShoppingCart} className="fa-lg text-gray-700" />
          Your Order History
        </h1>
        {orders.length === 0 ? (
          <div className="text-center py-12 sm:py-20 bg-gray-50 rounded-2xl shadow-inner">
            <FontAwesomeIcon icon={faShoppingCart} className="fa-3x sm:fa-4x text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg sm:text-xl mb-4 sm:mb-6 font-medium">You haven't placed any orders yet.</p>
            <Link
              href="/"
              className="inline-flex items-center px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-full hover:from-indigo-700 hover:to-indigo-800 transition duration-300 font-semibold shadow-lg text-sm sm:text-base"
            >
              Start Shopping
              <FontAwesomeIcon icon={faShoppingCart} className="fa-sm ml-2" />
            </Link>
          </div>
        ) : (
          <ul className="space-y-4 sm:space-y-6">
            {orders.map((order, index) => (
              <li
                key={order.id}
                className="border border-gray-200 rounded-xl bg-white p-4 sm:p-6 hover:shadow-lg transition-all duration-200 ease-in-out"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <span className="w-10 text-lg sm:text-xl font-semibold text-gray-700">{index + 1}.</span>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <span className="text-indigo-600">#</span> Order {order.order_id}
                    </h3>
                    <div className="mt-2 sm:mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                      <p><span className="font-medium">Date:</span> {new Date(order.created_at).toLocaleDateString()}</p>
                      <p><span className="font-medium">Total:</span> Tk {order.amount}</p>
                      <p><span className="font-medium">Payment Status:</span>
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                          order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </p>
                      <p><span className="font-medium">Delivery:</span>
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                          order.delivery_status === 'Delivered' ? 'bg-green-100 text-green-800' :
                          order.delivery_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.delivery_status}
                        </span>
                      </p>
                      <p><span className="font-medium">Order Type:</span> {order.order_type}</p>
                    </div>
                    {order.status === 'Pending' && order.order_type === 'advance payment' && (
                      <div className="mt-3 sm:mt-3">
                        <Link
                          href={`/order/${order.order_id}/${order.order_token}`}
                          className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition duration-300 font-medium text-xs sm:text-sm"
                        >
                          <FontAwesomeIcon icon={faShoppingCart} className="fa-sm mr-1 sm:mr-2" />
                          Pay Now
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row flex-wrap gap-2 sm:flex space-x-3 sm:space-y-0 mt-4 sm:mt-0">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition duration-300 font-medium text-xs sm:text-sm"
                    >
                      <FontAwesomeIcon icon={faShoppingBag} className="fa-sm mr-1 sm:mr-2" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleViewItems(order)}
                      className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition duration-300 font-medium text-xs sm:text-sm"
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="fa-sm mr-1 sm:mr-2" />
                      View Items
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Modal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModal}
        title={
          <>
            Order Details
          </>
        }
      >
        {selectedOrder && (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">Order Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                <p><span className="font-medium">Order ID:</span> {selectedOrder.order_id}</p>
                <p><span className="font-medium">Date:</span> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                <p><span className="font-medium">Total Amount:</span> Tk {selectedOrder.amount}</p>
                <p><span className="font-medium">Status:</span> {selectedOrder.status}</p>
                <p><span className="font-medium">Delivery Status:</span> {selectedOrder.delivery_status}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">Customer Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                <p><span className="font-medium">Name:</span> {selectedOrder.name}</p>
                <p><span className="font-medium">Email:</span> {selectedOrder.email}</p>
                <p><span className="font-medium">Phone:</span> {selectedOrder.phone}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">Shipping Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                <p><span className="font-medium">Address:</span> {selectedOrder.address}</p>
                <p><span className="font-medium">City:</span> {selectedOrder.city}</p>
                <p><span className="font-medium">Country:</span> {selectedOrder.country}</p>
                <p><span className="font-medium">Zip:</span> {selectedOrder.zip}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-base sm:text-lg mb-2 sm:mb-3">Payment Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600">
                <p><span className="font-medium">Transaction ID:</span> {selectedOrder.transaction_id || 'N/A'}</p>
                <p><span className="font-medium">Currency:</span> {selectedOrder.currency}</p>
                <p><span className="font-medium">Points Used:</span> {selectedOrder.used_points || 0}</p>
                <p><span className="font-medium">Vouchers Used:</span> {selectedOrder.used_vouchers || 'None'}</p>
                <p><span className="font-medium">Discount on Points:</span> Tk {selectedOrder.amount_discounted_on_points || 0}</p>
                <p><span className="font-medium">Discount on Vouchers:</span> Tk {selectedOrder.amount_discounted_on_vouchers || 0}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isItemsModalOpen}
        onClose={handleCloseModal}
        title={
          <>
            Order Items
          </>
        }
      >
        {selectedOrder && (
          <div className="space-y-4">
            <ul className="space-y-4">
              {selectedOrder.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center border-b border-gray-100 py-3 hover:bg-gray-50 rounded-lg transition duration-200"
                >
                  {item.product.image ? (
                    <img
                      src={`/storage/${item.product.image}`}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg mr-3 sm:mr-4 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gray-100 rounded-lg mr-3 sm:mr-4">
                      <span className="text-gray-500 text-xs sm:text-sm">No Image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {item.product?.name || 'Unknown Product'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                      <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                      <p><span className="font-medium">Unit Price:</span> Tk {item.unit_price}</p>
                      <p><span className="font-medium">Subtotal:</span> Tk {item.subtotal}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      <Footer />
    </>
  );
}
