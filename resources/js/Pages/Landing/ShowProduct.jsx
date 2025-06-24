import { Head, useForm, usePage } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faStar,
    faPaperPlane,
    faShoppingCart,
    faPlus,
    faMinus,
    faCheckCircle,
    faExclamationCircle,
    faHome,
    faHeart,
    faClock,
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from './Navbar';
import Footer from './Footer';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';
import CartModal from './CartModal';
import { InertiaLink } from '@inertiajs/inertia-react';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 right-2 sm:right-4 z-50 p-3 sm:p-4 rounded-lg shadow-lg flex items-center gap-3 max-w-[calc(100vw-1rem)] w-full sm:max-w-sm ${
                type === 'success' ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800'
            } border-l-4`}
        >
            <FontAwesomeIcon
                icon={type === 'success' ? faCheckCircle : faExclamationCircle}
                className={`text-lg sm:text-xl ${type === 'success' ? 'text-green-500' : 'text-red-500'}`}
            />
            <p className="text-xs sm:text-sm font-medium">{message}</p>
        </motion.div>
    );
};

export default function ShowProduct({ auth, product, categories }) {
    const { props } = usePage();
    const { post: postReview, processing: reviewProcessing, errors: reviewErrors, setData: setReviewData } = useForm({
        rating: 0,
        comment: '',
    });
    const { post: postWishlist, processing: wishlistProcessing } = useForm({});
    const [quantity, setQuantity] = useState(1);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [activeTab, setActiveTab] = useState('specifications');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [cartCount, setCartCount] = useState(props.cartCount || 0);
    const [cartItems, setCartItems] = useState(props.cartItems || []);
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const [pendingCheckout, setPendingCheckout] = useState(false);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isAddingToCart, setIsAddingToCart] = useState(false); // State to track add-to-cart action
    const { flash } = usePage().props;

    const descriptionRef = useRef(null);
    const reviewsRef = useRef(null);

    const cartQuantity = cartItems
        .filter((item) => item.product_id === product.id)
        .reduce((total, item) => total + item.quantity, 0);

    // Countdown timer logic
    useEffect(() => {
        if (product.is_offered_product === 'yes' && product.offer?.end_date) {
            const endDate = new Date(product.offer.end_date);

            const updateCountdown = () => {
                const now = new Date();
                const timeDiff = endDate - now;

                if (timeDiff <= 0) {
                    setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                    return;
                }

                const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                setCountdown({ days, hours, minutes, seconds });
            };

            updateCountdown(); // Initial call
            const interval = setInterval(updateCountdown, 1000); // Update every second
            return () => clearInterval(interval); // Cleanup on unmount
        }
    }, [product.is_offered_product, product.offer?.end_date]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg md:text-2xl text-gray-700 font-semibold"
                >
                    Product not found.
                </motion.div>
            </div>
        );
    }

    useEffect(() => {
        setCartItems(props.cartItems || []);
        setCartCount(props.cartCount || 0);
        if (props.flash?.error) {
            setToast({ show: true, message: props.flash.error, type: 'error' });
        } else if (props.flash?.success) {
            setToast({ show: true, message: props.flash.success, type: 'success' });
        }
    }, [props.cartItems, props.cartCount, props.flash]);

    const handleAddToWishlist = () => {
        if (!auth?.user) {
            setIsLoginModalOpen(true);
            return;
        }

        postWishlist(route('wishlist.add', product.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                const successMessage = page.props.flash?.success || 'Product added to wishlist!';
                setToast({ show: true, message: successMessage, type: 'success' });
            },
            onError: (errors) => {
                const errorMessage = errors.error || 'Failed to add to wishlist.';
                setToast({ show: true, message: errorMessage, type: 'error' });
            },
        });
    };

    const toggleCartModal = () => {
        setCartModalOpen((prev) => !prev);
    };

    const openLoginModal = () => {
        setIsLoginModalOpen(true);
    };

    const closeToast = () => {
        setToast({ show: false, message: '', type: '' });
    };

    const increaseQuantity = () => {
        if (cartQuantity + quantity < product.quantity) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1 && cartQuantity + value <= product.quantity) {
            setQuantity(value);
        } else if (e.target.value === '') {
            setQuantity('');
        }
    };

    const handleStarClick = (star) => {
        setReviewRating(star);
        setReviewData('rating', star);
    };

    const handleCommentChange = (e) => {
        setReviewComment(e.target.value);
        setReviewData('comment', e.target.value);
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!auth?.user) {
            setIsLoginModalOpen(true);
            return;
        }

        postReview(route('reviews.store', product.id), {
            preserveScroll: true,
            onSuccess: () => {
                setReviewRating(0);
                setReviewComment('');
                setReviewData({ rating: 0, comment: '' });
            },
        });
    };

    const closeLoginModal = () => {
        setIsLoginModalOpen(false);
    };

    const closeRegistrationModal = () => {
        setIsRegistrationModalOpen(false);
    };

    const toggleToRegistrationModal = () => {
        setIsRegistrationModalOpen(true);
        setIsLoginModalOpen(false);
    };

    const toggleToLoginModal = () => {
        setIsLoginModalOpen(true);
        setIsRegistrationModalOpen(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <Head title={product.name} />
            <NavBar
                auth={auth}
                categories={categories}
                cartCount={cartCount}
                toggleCartModal={toggleCartModal}
                setPendingCheckout={setPendingCheckout}
                cartId={props.cartId}
                checkoutToken={props.checkoutToken}
            />
            <div className="min-h-screen bg-gray-100 py-2 px-4 sm:px-6 lg:px-8 relative">
                <button
                    onClick={toggleCartModal}
                    className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-40 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                >
                    <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                        {cartCount}
                    </span>
                </button>

                <CartModal
                    isOpen={cartModalOpen}
                    toggleCartModal={toggleCartModal}
                    cartItems={cartItems}
                    cartCount={cartCount}
                    setCartItems={setCartItems}
                    setCartCount={setCartCount}
                    auth={auth}
                    cartId={props.cartId}
                    checkoutToken={props.checkoutToken}
                    setPendingCheckout={setPendingCheckout}
                    openLoginModal={openLoginModal}
                />

                <div className="max-w-full mx-auto lg:ml-10 lg:mr-10">
                    <div>
                        <div className="bg-white shadow-sm border border-gray-200 lg:p-6 p-3 w-full flex items-center justify-between lg:mt-[-1px] mt-9">
                            <nav className="flex items-center lg:text-sm md:text-xs sd:text-xs text-xs text-gray-600 overflow-hidden" aria-label="Breadcrumb">
                                <InertiaLink
                                    href={route('home')}
                                    className="flex items-center hover:text-indigo-600 transition-colors duration-200"
                                >
                                    <FontAwesomeIcon icon={faHome} className="mr-1 h-3" />
                                </InertiaLink>
                                <span className="mx-1">/</span>
                                {product.category && product.category.id && product.category.name && (
                                    <>
                                        <InertiaLink
                                            href={route('products.by.category', product.category.id)}
                                            className="hover:text-indigo-600 truncate transition-colors duration-200 max-w-[60px]"
                                        >
                                            {product.category.name}
                                        </InertiaLink>
                                        <span className="mx-1">/</span>
                                    </>
                                )}
                                {product.subcategory && product.subcategory.id && product.subcategory.sub_category_name && (
                                    <>
                                        <InertiaLink
                                            href={route('products.by.subcategory', product.subcategory.id)}
                                            className="hover:text-indigo-600 truncate transition-colors duration-200 max-w-[60px]"
                                        >
                                            {product.subcategory.sub_category_name}
                                        </InertiaLink>
                                        <span className="mx-1">/</span>
                                    </>
                                )}
                                {product.brand && product.brand.id && product.brand.brand_name && (
                                    <>
                                        <InertiaLink
                                            href={route('products.by.brand', product.brand.id)}
                                            className="hover:text-indigo-600 truncate transition-colors duration-200 max-w-[60px]"
                                        >
                                            {product.brand.brand_name}
                                        </InertiaLink>
                                        <span className="mx-1">/</span>
                                    </>
                                )}
                                <span className="text-gray-900 font-medium truncate max-w-[80px]">
                                    {(() => {
                                        const productName = product.name || '';
                                        if (typeof productName !== 'string') {
                                            console.warn('product.name is not a string:', productName);
                                            return productName;
                                        }
                                        const words = productName.trim().split(/\s+/);
                                        return words.length > 2 && window.innerWidth < 640
                                            ? words.slice(0, 2).join(' ') + ' ...'
                                            : words.length > 6
                                            ? words.slice(0, 6).join(' ') + ' ...'
                                            : productName;
                                    })()}
                                </span>
                            </nav>
                            <motion.button
                                onClick={handleAddToWishlist}
                                disabled={wishlistProcessing}
                                className={`px-2 py-1 bg-white rounded-md text-xs font-medium text-black ${
                                    wishlistProcessing
                                        ? 'bg-gray-200 cursor-not-allowed opacity-50'
                                        : 'hover:bg-gray-100'
                                } transition-colors duration-200 flex items-center gap-1`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FontAwesomeIcon
                                    icon={faHeart}
                                    className="lg:text-sm"
                                    style={{ color: 'white', stroke: 'black', strokeWidth: 30 }}
                                />
                                <span className="lg:text-sm hidden md:inline">Add to Wishlist</span>
                            </motion.button>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 20 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white shadow-md overflow-hidden -mt-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 p-4 md:p-6 lg:p-10">
                            <div className="relative flex justify-center items-center">
                                {product.image ? (
                                    <motion.img
                                        src={asset('storage/' + product.image)}
                                        alt={product.name}
                                        className="w-full max-w-[80%] md:max-w-md h-auto object-contain rounded-lg"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                ) : (
                                    <div className="w-full max-w-[80%] md:max-w-md h-60 md:h-80 bg-gray-100 flex items-center justify-center rounded-lg">
                                        <span className="text-gray-400 text-sm md:text-lg font-medium">No Image Available</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h1 className="text-xl md:text-[25px] font-sans text-black">{product.name}</h1>
                                    </div>

                                    <div className="mb-4">
                                        {product.is_offered_product === 'yes' && product.offer ? (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 md:gap-3">
                                                    <span className="text-base md:text-lg font-sans text-black line-through">
                                                        Price: {parseFloat(product.price).toFixed(2)} Tk
                                                    </span>
                                                    <span className="text-sm md:font-bold text-red-600">
                                                        {parseFloat(product.offer.offer_price).toFixed(2)} Tk
                                                    </span>
                                                </div>
                                                {product.offer.end_date && countdown.days >= 0 && (
                                                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-700 font-medium">
                                                        <span>
                                                            Offer ends in: {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s ⏳
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-lg md:text-[25px] font-bold text-gray-900">
                                                {parseFloat(product.price).toFixed(2)} Tk
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center mb-4">
                                        {product.quantity > 0 ? (
                                            <div className="flex items-center text-green-600">
                                                <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-base md:text-lg" />
                                                <span className="text-xs md:text-sm font-medium">In Stock</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-red-600">
                                                <FontAwesomeIcon icon={faExclamationCircle} className="mr-2 text-base md:text-lg" />
                                                <span className="text-xs md:text-sm font-medium">Out of Stock</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-4 md:mb-6 text-sm md:text-[15px]">
                                        <div className="ml-[-4px] flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 bg-gray-50 p-3 md:p-4 rounded-lg shadow-sm">
                                            <p className="text-xs md:text-sm text-gray-700">
                                                <span className="ml-[-8px] font-semibold text-gray-900">Brand:</span> {product.brand?.brand_name || 'N/A'}
                                            </p>
                                            <p className="text-xs md:text-sm text-gray-700">
                                                <span className="font-semibold text-gray-900">Product Code:</span> {product.product_code}
                                            </p>
                                        </div>
                                        <p className="text-gray-600 mt-3 md:mt-4 text-sm md:text-base">
                                            <span className="font-medium">Overview</span>
                                        </p>
                                        <div className="mt-2">
                                            <ul className="list-disc pl-5 text-gray-600">
                                                {[...Array(5).keys()].map((i) => {
                                                    const name = product[`spec_name_${i + 1}`];
                                                    const detail = product[`spec_detail_${i + 1}`];
                                                    if (name && detail) {
                                                        return (
                                                            <li key={i} className="text-xs md:text-sm mt-2">
                                                                <span className="font-medium">{name}:</span> {detail}
                                                            </li>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start gap-2 mb-4 md:mb-6">
                                        <div className="flex flex-row items-center gap-3 md:gap-4">
                                            <div className="flex items-center w-auto">
                                                <span className="mr-2 md:mr-3 text-gray-700 font-medium text-xs md:text-sm">Quantity:</span>
                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                    <motion.button
                                                        onClick={decreaseQuantity}
                                                        disabled={quantity <= 1}
                                                        className="px-2 md:px-3 lg:py-1 py-2 md:py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FontAwesomeIcon icon={faMinus} className="text-sm md:text-sm" />
                                                    </motion.button>
                                                    <input
                                                        type="number"
                                                        value={quantity}
                                                        onChange={handleQuantityChange}
                                                        className="w-12 md:w-16 px-2 md:px-4 lg:py-1 py-2 md:py-2 text-gray-900 font-semibold text-xs md:text-sm text-center border-none focus:ring-0"
                                                        min="1"
                                                        max={product.quantity - cartQuantity}
                                                    />
                                                    <motion.button
                                                        onClick={increaseQuantity}
                                                        disabled={cartQuantity + quantity >= product.quantity}
                                                        className="px-2 md:px-3 lg:py-1 py-2 md:py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FontAwesomeIcon icon={faPlus} className="text-xs md:text-sm" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                            <InertiaLink
                                                href={route('cart.add', product.id)}
                                                method="post"
                                                data={{ quantity: quantity }}
                                                disabled={product.quantity === 0 || cartQuantity + quantity > product.quantity || isAddingToCart}
                                                onClick={(e) => {
                                                    if (product.quantity === 0 || cartQuantity + quantity > product.quantity) {
                                                        e.preventDefault();
                                                        setToast({
                                                            show: true,
                                                            message: product.quantity === 0
                                                                ? 'Product is out of stock.'
                                                                : 'Cart quantity exceeds stock availability.',
                                                            type: 'error',
                                                        });
                                                    } else {
                                                        setIsAddingToCart(true); // Disable button on click
                                                    }
                                                }}
                                                onSuccess={() => {
                                                    setIsAddingToCart(false); // Re-enable button on success
                                                }}
                                                onError={() => {
                                                    setIsAddingToCart(false); // Re-enable button on error
                                                }}
                                                className={`flex items-center justify-center gap-2 px-3 lg:py-3 py-3 md:px-4 md:py-3 rounded-lg text-white font-semibold text-xs md:text-sm transition-all duration-300 w-auto ${
                                                    product.quantity === 0 || cartQuantity + quantity > product.quantity || isAddingToCart
                                                        ? 'bg-indigo-600 opacity-60 cursor-not-allowed'
                                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                                }`}
                                                as="button"
                                                whileHover={{ scale: (product.quantity === 0 || cartQuantity + quantity > product.quantity || isAddingToCart) ? 1 : 1.05 }}
                                                whileTap={{ scale: (product.quantity === 0 || cartQuantity + quantity > product.quantity || isAddingToCart) ? 1 : 0.95 }}
                                            >
                                                <FontAwesomeIcon icon={faShoppingCart} className="text-base md:text-lg" />
                                                Add to Cart
                                            </InertiaLink>
                                        </div>
                                        {cartQuantity + quantity >= product.quantity && product.quantity > 0 && (
                                            <p className="text-red-600 text-xs md:text-sm font-medium">
                                                Cart Quantity reached maximum stock availability.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {product.spec_name_1 && (
                            <div className="border-t border-gray-200">
                                <div className="flex border-b border-gray-200 flex-wrap">
                                    <button
                                        onClick={() => setActiveTab('specifications')}
                                        className={`px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium ${
                                            activeTab === 'specifications'
                                                ? 'border-b-2 border-indigo-600 text-indigo-600'
                                                : 'text-gray-600 hover:text-indigo-600'
                                        }`}
                                    >
                                        Specifications
                                    </button>
                                    <button
                                        onClick={() => scrollToSection(descriptionRef)}
                                        className="px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-gray-600 hover:text-indigo-600"
                                    >
                                        Description
                                    </button>
                                    <button
                                        onClick={() => scrollToSection(reviewsRef)}
                                        className="px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-gray-600 hover:text-indigo-600"
                                    >
                                        Reviews
                                    </button>
                                </div>

                                <div className="p-4 md:p-6">
                                    {activeTab === 'specifications' && (
                                        <div className="backdrop-blur-md bg-white/30 border border-white/20 overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-xs md:text-sm text-left">
                                                    <thead>
                                                        <tr className="bg-white text-black">
                                                            <th className="w-1/3 px-4 md:px-8 py-2 md:py-3 font-semibold">Specification</th>
                                                            <th className="w-2/3 px-4 md:px-8 py-2 md:py-3 font-semibold">Details</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {[...Array(15).keys()].map((i) => {
                                                            const name = product[`spec_name_${i + 1}`];
                                                            const detail = product[`spec_detail_${i + 1}`];
                                                            if (name && detail) {
                                                                return (
                                                                    <tr
                                                                        key={i}
                                                                        className="border-b border-gray-300/50 hover:bg-gray-50/50 transition-colors duration-200"
                                                                    >
                                                                        <td className="px-4 md:px-8 py-3 md:py-4 font-medium text-gray-800">{name}</td>
                                                                        <td className="px-4 md:px-8 py-3 md:py-4 text-gray-600">{detail}</td>
                                                                    </tr>
                                                                );
                                                            }
                                                            return null;
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                    <div ref={descriptionRef}></div>
                    <div className="bg-white shadow-md overflow-hidden lg:mt-6 mt-6 md:mt-7 sd:mt-6">
                        <div className="border-t border-gray-200">
                            <div className="flex border-b border-gray-200">
                                <div className="px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium border-b-2 border-indigo-600 text-indigo-600">
                                    Description
                                </div>
                            </div>
                            <div className="p-4 md:p-6">
                                <p className="text-gray-600 leading-relaxed text-xs md:text-sm">
                                    {product.description || 'No description available.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div ref={reviewsRef} className="bg-white shadow-md overflow-hidden mt-2">
                        <div className="border-t border-gray-200">
                            <div className="flex border-b border-gray-200">
                                <div className="px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium border-b-2 border-indigo-600 text-indigo-600">
                                    Customer Reviews
                                </div>
                            </div>
                            <div className="p-4 md:p-6">
                                {product.reviews && product.reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {product.reviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="bg-gray-50 rounded-xl p-3 md:p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                                            >
                                                <div className="flex items-center mb-2 md:mb-3">
                                                    <div>
                                                        <div className="flex space-x-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <span
                                                                    key={star}
                                                                    className={`text-base md:text-lg ${
                                                                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                                    }`}
                                                                >
                                                                    <FontAwesomeIcon icon={faStar} />
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <span className="text-gray-600 text-xs md:text-sm font-medium">
                                                            {review.user?.name || 'Anonymous'} • {formatDate(review.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                                {review.comment && (
                                                    <p className="text-gray-700 text-xs md:text-sm leading-relaxed bg-white p-2 md:p-3 rounded-lg shadow-inner">
                                                        {review.comment}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 text-xs md:text-sm italic">
                                        No reviews yet. Be the first to share your thoughts!
                                    </p>
                                )}
                                <div>
                                    {flash.review_success && (
                                        <div className="w-full p-3 md:p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 bg-green-100 border-green-500 text-green-800 border-l-4">
                                            {flash.review_success}
                                        </div>
                                    )}

                                    {flash.review_error && (
                                        <div className="w-full p-3 md:p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 bg-red-100 border-red-500 text-red-800 border-l-4">
                                            {flash.review_error}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-6 md:mt-8">
                                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Write a Review</h3>
                                    <form
                                        onSubmit={handleReviewSubmit}
                                        className="backdrop-blur-md bg-white/30 p-4 md:p-6 rounded-xl shadow-md border border-white/20"
                                    >
                                        <div className="mb-4">
                                            <label className="block text-gray-800 font-medium text-xs md:text-sm mb-2">Rating</label>
                                            <div className="flex space-x-2 md:space-x-3">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <motion.button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => handleStarClick(star)}
                                                        className={`text-xl md:text-2xl ${
                                                            star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'
                                                        } hover:text-yellow-400 transition-colors duration-200`}
                                                        whileHover={{ scale: 1.3, filter: 'drop-shadow(0 0 5px rgba(255, 193, 7, 0.5))' }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <FontAwesomeIcon icon={faStar} />
                                                    </motion.button>
                                                ))}
                                            </div>
                                            {reviewErrors.rating && (
                                                <p className="text-red-500 text-xs mt-2 bg-red-100/50 px-2 py-1 rounded">
                                                    {reviewErrors.rating}
                                                </p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="comment" className="block text-gray-800 font-medium text-xs md:text-sm mb-2">
                                                Comment
                                            </label>
                                            <textarea
                                                id="comment"
                                                value={reviewComment}
                                                onChange={handleCommentChange}
                                                className="w-full p-2 md:p-3 bg-white/50 rounded-lg border border-gray-200/50 focus:ring-2 focus:border-transparent transition-all text-xs md:text-sm shadow-sm"
                                                rows="4 md:rows-5"
                                                placeholder="Share your experience with this product..."
                                            />
                                            {reviewErrors.comment && (
                                                <p className="text-red-500 text-xs mt-2 bg-red-100/50 px-2 py-1 rounded">
                                                    {reviewErrors.comment}
                                                </p>
                                            )}
                                        </div>
                                        <motion.button
                                            type="submit"
                                            disabled={reviewProcessing || reviewRating === 0}
                                            className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg text-white font-semibold text-xs md:text-sm transition-all duration-300 bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-lg disabled:opacity-70 lg:w-42 w-42 md:w-42"
                                            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FontAwesomeIcon icon={faPaperPlane} />
                                            Submit Review
                                        </motion.button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {isLoginModalOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <LoginModal closeModal={closeLoginModal} toggleToRegistrationModal={toggleToRegistrationModal} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isRegistrationModalOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <RegistrationModal closeModal={closeRegistrationModal} toggleToLoginModal={toggleToLoginModal} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {toast.show && (
                            <Toast
                                message={toast.message}
                                type={toast.type}
                                onClose={closeToast}
                            />
                        )}
                    </AnimatePresence>
                </div>
                {/* Close the main content div */}
            </div>
            <div className="w-full min-w-full">
                <Footer />
            </div>
        </>
    );
}

function asset(path) {
    return `/${path}`;
}
