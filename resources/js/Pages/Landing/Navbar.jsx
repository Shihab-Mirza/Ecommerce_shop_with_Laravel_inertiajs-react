import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSignInAlt, faUserPlus, faSearch, faSignOutAlt, faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';
import { Link, usePage } from '@inertiajs/react';
import LoginModal from '@/Pages/Landing/LoginModal';
import RegistrationModal from '@/Pages/Landing/RegistrationModal';
import { Inertia } from '@inertiajs/inertia';
import axios from 'axios';

function Navbar({ auth }) {
    const { props } = usePage();
    const [cartCount, setCartCount] = useState(props.cartCount || 0);
    const [cartItems, setCartItems] = useState(props.cartItems || []);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registrationModalOpen, setRegistrationModalOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [pendingCheckout, setPendingCheckout] = useState(false);

    // Debug cart items on mount and when props change
    useEffect(() => {
        console.log('Cart Items:', props.cartItems);
        console.log('Cart Count:', props.cartCount);
        setCartItems(props.cartItems || []);
        setCartCount(props.cartCount || 0);
    }, [props.cartItems, props.cartCount]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
        if (searchOpen) setSearchOpen(false);
        if (cartModalOpen) setCartModalOpen(false);
    };

    const toggleSearch = () => {
        setSearchOpen(!searchOpen);
        if (menuOpen) setMenuOpen(false);
        if (cartModalOpen) setCartModalOpen(false);
    };

    const toggleLoginModal = () => {
        setLoginModalOpen(!loginModalOpen);
        setRegistrationModalOpen(false);
        setMenuOpen(false);
        setCartModalOpen(false);
    };

    const toggleRegistrationModal = () => {
        setRegistrationModalOpen(!registrationModalOpen);
        setLoginModalOpen(false);
        setMenuOpen(false);
        setCartModalOpen(false);
    };

    const toggleCartModal = () => {
        setCartModalOpen(!cartModalOpen);
        if (menuOpen) setMenuOpen(false);
        if (searchOpen) setSearchOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            Inertia.get('/search', { query: searchQuery });
        }
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
                            total_price: item.is_offered_product === 'yes' && item.offer_price
                                ? item.offer_price * quantity
                                : item.price * quantity
                        }
                        : item
                );
                setCartItems(updatedItems);
                setCartCount(updatedItems.length);
            } else {
                alert(response.data.error || 'Failed to update cart item');
            }
        } catch (error) {
            console.error('Error updating cart item:', error);
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
            console.error('Error removing cart item:', error);
            alert('An error occurred while removing the cart item');
        }
    };

    const handleCheckout = () => {
        // Check if any cart item exceeds available stock
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
        } else {
            Inertia.get(`/checkout2/${props.cartId}/${props.checkoutToken}`);
        }
    };

    const handleLoginSuccess = () => {
        setLoginModalOpen(false);
        if (pendingCheckout) {
            setPendingCheckout(false);
            Inertia.get(`/checkout2/${props.cartId}/${props.checkoutToken}`);
        }
    };

    // Handle wishlist click
    const handleWishlistClick = () => {
        if (!auth.user) {
            setLoginModalOpen(true);
            setMenuOpen(false);
            setCartModalOpen(false);
        } else {
            Inertia.get('/wishlist');
        }
    };

    // Check if any cart item exceeds available stock to disable checkout button
    const isCheckoutDisabled = cartItems.some((item) => item.quantity > item.available_stock);

    const authButtonStyles = "px-5 py-2 text-sm text-gray-100 font-medium tracking-wide uppercase rounded-full bg-gray-800/80 border border-gray-700/50 hover:bg-gray-700 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500/30 transition-all duration-300 flex items-center gap-2 shadow-sm";

    return (
        <header>
            <nav className="z-50 fixed top-0 w-full p-4 bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-lg shadow-md transition-all duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Desktop Layout */}
                    <div className="hidden md:flex items-center justify-between">
                        <Link href="/" className="text-2xl font-extralight text-white tracking-tight hover:text-gray-200 transition duration-300">
                            Computer Store
                        </Link>

                        <form onSubmit={handleSearch} className="relative flex-grow max-w-xl mx-8">
                            <input
                                className="w-full h-10 bg-white text-gray-900 rounded-lg pl-4 pr-12 shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 placeholder-gray-500 text-sm tracking-wide"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition duration-300">
                                <FontAwesomeIcon icon={faSearch} size="sm" />
                            </button>
                        </form>

                        <div className="flex items-center gap-4">
                            <button onClick={toggleCartModal} className="relative p-2 text-gray-200 hover:text-white transition duration-300">
                                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            </button>
                            <button onClick={handleWishlistClick} className="p-2 text-gray-200 hover:text-white transition duration-300">
                                <FontAwesomeIcon icon={faHeart} size="lg" />
                            </button>
                            {auth.user ? (
                                <>
                                    <Link href="/profile" className={authButtonStyles}>
                                        <FontAwesomeIcon icon={faUserPlus} /> Profile
                                    </Link>
                                    <Link href="/logout" method="post" className={authButtonStyles}>
                                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button onClick={toggleLoginModal} className={authButtonStyles}>
                                        <FontAwesomeIcon icon={faSignInAlt} /> Login
                                    </button>
                                    <button onClick={toggleRegistrationModal} className={authButtonStyles}>
                                        <FontAwesomeIcon icon={faUserPlus} /> Register
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Layout */}
                    <div className="flex md:hidden items-center justify-between">
                        <Link href="/" className="text-2xl font-extralight text-white tracking-tight hover:text-gray-200 transition duration-300">
                            Computer Store
                        </Link>

                        <div className="flex items-center gap-4">
                            <button onClick={toggleSearch} className="text-gray-200 hover:text-white transition duration-300">
                                <FontAwesomeIcon icon={searchOpen ? faTimes : faSearch} size="lg" />
                            </button>
                            <button onClick={toggleMenu} className="text-gray-200 hover:text-white transition duration-300">
                                <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} size="lg" />
                            </button>
                        </div>
                    </div>

                    {searchOpen && (
                        <div className="md:hidden mt-4">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    className="w-full h-10 bg-white text-gray-900 rounded-full pl-4 pr-12 shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 placeholder-gray-500 text-sm tracking-wide"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition duration-300">
                                    <FontAwesomeIcon icon={faSearch} size="sm" />
                                </button>
                            </form>
                        </div>
                    )}

                    {menuOpen && (
                        <div className="md:hidden mt-4 space-y-3">
                            <button onClick={toggleCartModal} className="px-4 py-2 text-gray-200 hover:bg-gray-800/50 rounded-lg transition duration-300 flex items-center gap-2">
                                <FontAwesomeIcon icon={faShoppingCart} /> Cart
                                <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            </button>
                            <button onClick={handleWishlistClick} className="px-4 py-2 text-gray-200 hover:bg-gray-800/50 rounded-lg transition duration-300 flex items-center gap-2">
                                <FontAwesomeIcon icon={faHeart} /> Wishlist
                            </button>
                            {auth.user ? (
                                <>
                                    <Link href="/profile" className={authButtonStyles}>
                                        <FontAwesomeIcon icon={faUserPlus} /> Profile
                                    </Link>
                                    <Link href="/logout" method="post" className={authButtonStyles}>
                                        <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <button onClick={toggleLoginModal} className={authButtonStyles}>
                                        <FontAwesomeIcon icon={faSignInAlt} /> Login
                                    </button>
                                    <button onClick={toggleRegistrationModal} className={authButtonStyles}>
                                        <FontAwesomeIcon icon={faUserPlus} /> Register
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* Cart Modal */}
            {cartModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={toggleCartModal}
                    ></div>
                    <div className="w-full max-w-sm bg-white h-[678px] shadow-xl transform transition-transform duration-300 ease-in-out translate-x-0">
                        <div className="p-6 flex justify-between items-center border-b">
                            <h2 className="text-xl font-semibold text-gray-900">Your Cart ({cartCount})</h2>
                            <button onClick={toggleCartModal} className="text-gray-600 hover:text-gray-900">
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
                                            {/* Product Image */}
                                            {item.image_path ? (
                                                <img
                                                    src={`/storage/${item.image_path}`}
                                                    alt={item.product_name || 'Product'}
                                                    className="w-16 h-16 object-cover rounded border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                                                    No Image
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-gray-900">{item.product_name || 'Unknown Product'}</h3>
                                                <div className="text-sm text-gray-500">
                                                    {item.is_offered_product === 'yes' && item.offer_price !== null ? (
                                                        <>
                                                            <span className="text-green-600 font-semibold">Tk {item.offer_price.toFixed(2)}</span>
                                                            <span className="line-through text-gray-400 ml-2">Tk {item.price.toFixed(2)}</span>
                                                        </>
                                                    ) : (
                                                        <span>Tk {item.price ? item.price.toFixed(2) : '0.00'}</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <label className="text-sm text-gray-700">Qty:</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                                        className="w-16 border rounded px-2 py-1 text-sm"
                                                    />
                                                    {item.quantity > item.available_stock && (
                                                        <span className="text-red-500 text-xs">
                                                            Quantity exceeds stock availability!
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-700 mt-1">
                                                    Total: Tk
                                                    {(item.is_offered_product === 'yes' && item.offer_price !== null
                                                        ? item.offer_price * item.quantity
                                                        : item.price * item.quantity).toFixed(2)}
                                                </p>
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
                                            className={`w-full mt-4 px-4 py-2 rounded-full text-center transition duration-300 ${
                                                isCheckoutDisabled
                                                    ? 'bg-gray-800 text-white cursor-not-allowed'
                                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                                            }`}
                                            disabled={isCheckoutDisabled}
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
                <LoginModal closeModal={toggleLoginModal} toggleToRegistrationModal={toggleRegistrationModal} onLoginSuccess={handleLoginSuccess} />
            )}
            {registrationModalOpen && (
                <RegistrationModal closeModal={toggleRegistrationModal} toggleToLoginModal={toggleLoginModal} />
            )}
        </header>
    );
}

export default Navbar;
