import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { props } = usePage();
    const [cartCount, setCartCount] = useState(props.cartCount || 0);
    const [cartItems, setCartItems] = useState(props.cartItems || []);
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const [pendingCheckout, setPendingCheckout] = useState(false);

    // Sync cart items and count with server-side props
    useEffect(() => {
        setCartItems(props.cartItems || []);
        setCartCount(props.cartCount || 0);
    }, [props.cartItems, props.cartCount]);

    // Fetch fresh cart data when modal opens
    useEffect(() => {
        if (cartModalOpen) {
            axios.get('/cart')
                .then((response) => {
                    if (response.data.success) {
                        setCartItems(response.data.cartItems || []);
                        setCartCount(response.data.cartCount || 0);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching cart data:', error);
                });
        }
    }, [cartModalOpen]);

    const toggleCartModal = () => {
        setCartModalOpen(!cartModalOpen);
    };

    const handleQuantityChange = async (itemId, quantity) => {
        if (quantity < 1) return;

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
                              total_price:
                                  item.is_offered_product === 'yes' && item.offer_price
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
            alert('An error occurred while updating the cart item');
        }
    };

    const handleRemoveItem = async (itemId) => {
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
            alert('An error occurred while removing the cart item');
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

        if (!props.auth.user) {
            setPendingCheckout(true);
            alert('Please log in to proceed to checkout.');
        } else {
            Inertia.get(`/checkout2/${props.cartId}/${props.checkoutToken}`);
        }
    };

    const isCheckoutDisabled = cartItems.some((item) => item.quantity > item.available_stock);

    return (
        <CartContext.Provider
            value={{
                cartCount,
                cartItems,
                cartModalOpen,
                toggleCartModal,
                handleQuantityChange,
                handleRemoveItem,
                handleCheckout,
                isCheckoutDisabled,
                pendingCheckout,
                setPendingCheckout,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
