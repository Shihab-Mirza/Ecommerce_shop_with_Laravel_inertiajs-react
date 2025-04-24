import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link, usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';

function CartModal({ closeModal }) {
    const { props } = usePage();
    const { cartItems, cartCount, total, cartId } = props;

    const handleQuantityChange = (cartItemId, quantity) => {
        if (quantity < 1) return;
        Inertia.post(`/cart/update/${cartItemId}`, { quantity }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                if (cartId) {
                    Inertia.visit(`/nav-cart/${cartId}`, {
                        preserveState: true,
                        preserveScroll: true,
                    });
                }
            },
        });
    };

    const handleRemoveItem = (cartItemId) => {
        Inertia.delete(`/cart/remove/${cartItemId}`, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                if (cartId) {
                    Inertia.visit(`/nav-cart/${cartId}`, {
                        preserveState: true,
                        preserveScroll: true,
                    });
                }
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="fixed inset-0 bg-black/50"
                onClick={closeModal}
            ></div>
            <div className="w-full max-w-sm bg-white h-[678px] shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0">
                <div className="p-6 flex justify-between items-center border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Your Cart ({cartCount})</h2>
                    <button onClick={closeModal} className="text-gray-600 hover:text-gray-900">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto h-[calc(100%-8rem)]">
                    {cartCount === 0 ? (
                        <p className="text-gray-500 text-center">Your cart is empty.</p>
                    ) : (
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                                    <div className="w-16 h-16 bg-gray-200 rounded">
                                        {item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-contain rounded"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                                No image
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-500">${parseFloat(item.price).toFixed(2)}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <label className="text-sm text-gray-700">Qty:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                                className="w-16 border rounded px-2 py-1 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <div className="mt-4">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total:</span>
                                    <span>${parseFloat(total).toFixed(2)}</span>
                                </div>
                                <Link
                                    href="/checkout"
                                    className="w-full mt-4 px-4 py-2 bg-gray-800 text-white rounded-full text-center hover:bg-gray-700 transition duration-300"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CartModal;
