import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPaperPlane, faShoppingCart, faPlus, faMinus, faCheckCircle, faExclamationCircle, faHome ,faHeart } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from './Navbar';
import Footer from './Footer';
import SecondaryNavBar from './SecondaryNavBar';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';
import { Inertia } from '@inertiajs/inertia'

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 right-4 max-w-sm w-full p-4 rounded-lg shadow-lg flex items-center gap-3 z-50 ${
                type === 'success' ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800'
            } border-l-4`}
        >
            <FontAwesomeIcon
                icon={type === 'success' ? faCheckCircle : faExclamationCircle}
                className={`text-xl ${type === 'success' ? 'text-green-500' : 'text-red-500'}`}
            />
            <p className="text-sm font-medium">{message}</p>
        </motion.div>
    );
};

export default function ShowProduct({ auth, product, categories }) {
    const { post, processing, setData: setCartData, errors: cartErrors } = useForm({
        quantity: 1,
    });
    const [quantity, setQuantity] = useState(1);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [activeTab, setActiveTab] = useState('specifications');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const { post: postReview, processing: reviewProcessing, errors: reviewErrors, setData } = useForm({
        rating: 0,
        comment: '',
    });
    const { post: postWishlist, processing: wishlistProcessing } = useForm({});
    const { flash } = usePage().props;

    useEffect(() => {
        setToast({ show: false, message: '', type: '' });

        if (flash?.error) {
            setToast({
                show: true,
                message: flash.error,
                type: 'error',
            });
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } else if (flash?.success) {
            setToast({
                show: true,
                message: flash.success,
                type: 'success',
            });
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }

        return () => {
            setToast({ show: false, message: '', type: '' });
        };
    }, [flash?.success, flash?.error]);

    const descriptionRef = useRef(null);
    const reviewsRef = useRef(null);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl text-gray-700 font-semibold"
                >
                    Product not found.
                </motion.div>
            </div>
        );
    }

    const handleAddToCart = () => {
        if (!quantity || quantity < 1) {
            setToast({
                show: true,
                message: 'Please select a valid quantity.',
                type: 'error',
            });
            return;
        }

        setCartData('quantity', quantity);

        post(route('cart.add', product.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setQuantity(1);
                setCartData('quantity', 1);
            },
            onError: (errors) => {
                const errorMessage = errors.quantity || errors.message || flash?.error || 'Failed to add product to cart.';
                setToast({
                    show: true,
                    message: errorMessage,
                    type: 'error',
                });
            },
        });
    };

    const handleAddToWishlist = () => {
        if (!auth?.user) {
            setIsLoginModalOpen(true);
            return;
        }

        postWishlist(route('wishlist.add', product.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {},
            onError: (errors) => {
                const errorMessage = errors.message || flash?.error || 'Failed to add product to wishlist.';
                setToast({
                    show: true,
                    message: errorMessage,
                    type: 'error',
                });
            },
        });
    };

    const closeToast = () => {
        setToast({ show: false, message: '', type: '' });
    };

    const increaseQuantity = () => {
        const newQuantity = quantity + 1;
        setQuantity(newQuantity);
        setCartData('quantity', newQuantity);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            setCartData('quantity', newQuantity);
        }
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1) {
            setQuantity(value);
            setCartData('quantity', value);
        } else if (e.target.value === '') {
            setQuantity('');
            setCartData('quantity', '');
        }
    };

    const handleStarClick = (star) => {
        setReviewRating(star);
        setData('rating', star);
    };

    const handleCommentChange = (e) => {
        setReviewComment(e.target.value);
        setData('comment', e.target.value);
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
                setData({ rating: 0, comment: '' });
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
            <NavBar auth={auth} />
            <SecondaryNavBar categories={categories} />
            <div className="min-h-screen bg-gray-100 py-2 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb Navigation */}
                    <div className="mb-1">
                        <div className="bg-white shadow-lg  border border-gray-200 p-4 w-full">
                            <nav className="flex items-center text-sm text-gray-600" aria-label="Breadcrumb">
                                <Link
                                    href={route('home')}
                                    className="flex items-center hover:text-indigo-600 transition-colors duration-200"
                                >
                                    <FontAwesomeIcon icon={faHome} className="mr-2" />
                                    Home
                                </Link>
                                <span className="mx-2">/</span>
                                {product.category && product.category.id && product.category.name && (
                                    <>
                                        <Link
                                            href={route('products.by.category', product.category.id)}
                                            className="hover:text-indigo-600 transition-colors duration-200"
                                        >
                                            {product.category.name}
                                        </Link>
                                        <span className="mx-2">/</span>
                                    </>
                                )}
                                {product.subcategory && product.subcategory.id && product.subcategory.sub_category_name && (
                                    <>
                                        <Link
                                            href={route('products.by.subcategory', product.subcategory.id)}
                                            className="hover:text-indigo-600 transition-colors duration-200"
                                        >
                                            {product.subcategory.sub_category_name}
                                        </Link>
                                        <span className="mx-2">/</span>
                                    </>
                                )}
                                {product.brand && product.brand.id && product.brand.brand_name && (
                                    <>
                                        <Link
                                            href={route('products.by.brand', product.brand.id)}
                                            className="hover:text-indigo-600 transition-colors duration-200"
                                        >
                                            {product.brand.brand_name}
                                        </Link>
                                        <span className="mx-2">/</span>
                                    </>
                                )}
                                <span className="text-gray-900 font-medium">{product.name}</span>
                            </nav>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 20 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white shadow-md overflow-hidden"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
                            <div className="relative flex justify-center items-center">
                                {product.image ? (
                                    <motion.img
                                        src={asset('storage/' + product.image)}
                                        alt={product.name}
                                        className="w-full max-w-md h-auto object-contain rounded-lg"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                ) : (
                                    <div className="w-full max-w-md h-80 bg-gray-100 flex items-center justify-center rounded-lg">
                                        <span className="text-gray-400 text-lg font-medium">No Image Available</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h1 className="text-[25px] sm:text-[25px] font-sans text-indigo-500">{product.name}</h1>
                                        <motion.button
    onClick={handleAddToWishlist}
    disabled={wishlistProcessing}
    className={`px-4 py-2 rounded-lg text-sm font-semibold text-black ${
        wishlistProcessing
            ? 'bg-white cursor-not-allowed'
            : 'bg-gray-100'
    } transition-colors duration-200 flex items-center gap-2`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
>
    <FontAwesomeIcon icon={faHeart} className="mr-2" />
    Add to Wishlist
</motion.button>
                                    </div>

                                    <div className="mb-4">
                                        {product.is_offered_product === 'yes' && product.offer ? (
                                            <div className="flex items-center gap-3">
                                                <span className="text-[15px] sm:text-[15px] font-bold text-red-600">
                                                    {parseFloat(product.offer.offer_price).toFixed(2)} Tk
                                                </span>
                                                <span className="text-sm text-gray-400 line-through">
                                                   Price: {parseFloat(product.price).toFixed(2)} Tk
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-[25px] sm:text-[20px] font-bold text-gray-900">
                                               {parseFloat(product.price).toFixed(2)} Tk
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center mb-4">
                                        {product.quantity > 0 ? (
                                            <div className="flex items-center text-green-600">
                                                <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-lg" />
                                                <span className="text-sm font-medium">In Stock</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-red-600">
                                                <FontAwesomeIcon icon={faExclamationCircle} className="mr-2 text-lg" />
                                                <span className="text-sm font-medium">Out of Stock</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-6 text-[15px]">
                                        <p className="text-gray-600">
                                            <span className="font-medium">Product Code:</span> {product.product_code}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-medium">Brand:</span> {product.brand?.brand_name || 'N/A'}
                                        </p>
                                        <p className="text-gray-600 mt-4">
                                            <span className="font-medium">Overview</span>
                                        </p>
                                        <div className="mt-2">
                                            <ul className="list-disc pl-5 text-gray-600">
                                                {[...Array(5).keys()].map((i) => {
                                                    const name = product[`spec_name_${i + 1}`];
                                                    const detail = product[`spec_detail_${i + 1}`];
                                                    if (name && detail) {
                                                        return (
                                                            <li key={i} className="text-sm mt-2">
                                                                <span className="font-medium ">{name}:</span> {detail}
                                                            </li>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="flex items-center">
                                            <span className="mr-3 text-gray-700 font-medium text-sm">Quantity:</span>
                                            <div className="flex items-center  border border-gray-200 rounded-lg">
                                                <motion.button
                                                    onClick={decreaseQuantity}
                                                    disabled={quantity <= 1}
                                                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FontAwesomeIcon icon={faMinus} className="text-sm" />
                                                </motion.button>
                                                <input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={handleQuantityChange}
                                                    className="w-16 px-4 py-2 text-gray-900 font-semibold text-sm text-center border-none focus:ring-0"
                                                    min="1"
                                                />
                                                <motion.button
                                                    onClick={increaseQuantity}
                                                    className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} className="text-sm" />
                                                </motion.button>
                                            </div>
                                        </div>

                                        <motion.button
                                            onClick={handleAddToCart}
                                            disabled={processing}
                                            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-sm transition-all duration-300 ${
                                                processing
                                                    ? 'bg-indigo-600 opacity-60 cursor-not-allowed'
                                                    : 'bg-indigo-600 hover:bg-indigo-700'
                                            }`}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FontAwesomeIcon icon={faShoppingCart} className="text-lg" />
                                            Add to Cart
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {product.spec_name_1 && (
                            <div className="border-t border-gray-200">
                                <div className="flex border-b border-gray-200">
                                    <button
                                        onClick={() => setActiveTab('specifications')}
                                        className={`px-6 py-3 text-sm font-medium ${
                                            activeTab === 'specifications'
                                                ? 'border-b-2 border-indigo-600 text-indigo-600'
                                                : 'text-gray-600 hover:text-indigo-600'
                                        }`}
                                    >
                                        Specifications
                                    </button>
                                    <button
                                        onClick={() => scrollToSection(descriptionRef)}
                                        className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-indigo-600"
                                    >
                                        Description
                                    </button>
                                    <button
                                        onClick={() => scrollToSection(reviewsRef)}
                                        className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-indigo-600"
                                    >
                                        Reviews
                                    </button>
                                </div>

                                <div className="p-6">
                                    {activeTab === 'specifications' && (
                                        <div className="backdrop-blur-md bg-white/30   border border-white/20 overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left">
                                                    <thead>
                                                        <tr className="bg-white text-black">
                                                            <th className="w-1/3 px-8 py-3 font-semibold ">Specification</th>
                                                            <th className="w-2/3 px-8 py-3 font-semibold ">Details</th>
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
                                                                        <td className="px-8 py-4 font-medium text-gray-800">{name}</td>
                                                                        <td className="px-8 py-4 text-gray-600">{detail}</td>
                                                                    </tr >
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
                            </div >
                        )}
                    </motion.div>
<div ref={descriptionRef}></div>
                    <div

                        className="bg-white  shadow-md overflow-hidden mt-7"
                    >
                        <div   className="border-t border-gray-200">
                            <div className="flex border-b border-gray-200">
                                <div className="px-6 py-3 text-sm font-medium border-b-2 border-indigo-600 text-indigo-600">
                                    Description
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {product.description || 'No description available.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        ref={reviewsRef}
                        className="bg-white  shadow-md overflow-hidden mt-2"
                    >
                        <div className="border-t border-gray-200">
                            <div className="flex border-b border-gray-200">
                                <div className="px-6 py-3 text-sm font-medium border-b-2 border-indigo-600 text-indigo-600">
                                    Customer Reviews
                                </div>
                            </div>
                            <div className="p-6">
                                {product.reviews && product.reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {product.reviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="bg-gray-50 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                                            >
                                                <div className="flex items-center mb-3">
                                                    <div>
                                                        <div className="flex items-center">
                                                            <div className="flex space-x-1">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <span
                                                                        key={star}
                                                                        className={`text-lg ${
                                                                            star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                                        }`}
                                                                    >
                                                                        <FontAwesomeIcon icon={faStar} />
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <span className="text-gray-600 text-sm font-medium">
                                                            {review.user?.name || 'Anonymous'} • {formatDate(review.created_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                                {review.comment && (
                                                    <p className="text-gray-700 text-sm leading-relaxed bg-white p-3 rounded-lg shadow-inner">
                                                        {review.comment}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 text-sm italic">
                                        No reviews yet. Be the first to share your thoughts!
                                    </p>
                                )}

                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
                                    <form
                                        onSubmit={handleReviewSubmit}
                                        className="backdrop-blur-md bg-white/30 p-6 rounded-xl shadow-lg border border-white/20"
                                    >
                                        <div className="mb-4">
                                            <label className="block text-gray-800 font-medium text-sm mb-2">Rating</label>
                                            <div className="flex space-x-3">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <motion.button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => handleStarClick(star)}
                                                        className={`text-2xl ${
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
                                                <motion.p
                                                    className="text-red-500 text-xs mt-2 bg-red-100/50 px-2 py-1 rounded"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    {reviewErrors.rating}
                                                </motion.p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="comment" className="block text-gray-800 font-medium text-sm mb-2">
                                                Comment
                                            </label>
                                            <textarea
                                                id="comment"
                                                value={reviewComment}
                                                onChange={handleCommentChange}
                                                className="w-full p-3 bg-white/50 rounded-lg border border-gray-200/50 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all text-sm shadow-sm"
                                                rows="5"
                                                placeholder="Share your experience with this product..."
                                            />
                                            {reviewErrors.comment && (
                                                <motion.p
                                                    className="text-red-500 text-xs mt-2 bg-red-100/50 px-2 py-1 rounded"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                >
                                                    {reviewErrors.comment}
                                                </motion.p>
                                            )}
                                        </div>
                                        <motion.button
                                            type="submit"
                                            disabled={reviewProcessing || reviewRating === 0}
                                            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-lg disabled:opacity-60"
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

            <Footer />
        </>
    );
}

function asset(path) {
    return `/${path}`;
}
