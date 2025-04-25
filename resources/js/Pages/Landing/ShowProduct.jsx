import { Head, Link, useForm, usePage } from '@inertiajs/react';
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faPaperPlane, faShoppingCart, faPlus, faMinus, faCheckCircle, faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from './Navbar';
import Footer from './Footer';
import SecondaryNavBar from './SecondaryNavBar';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';

const CartSuccessModal = ({ isOpen, closeModal }) => {
    useEffect(() => {
        if (isOpen) {
            console.log('CartSuccessModal is open');
            const timer = setTimeout(() => {
                closeModal();
            }, 3000); // Auto-close after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [isOpen, closeModal]);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
            <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Success</h3>
                    <motion.button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </motion.button>
                </div>
                <div className="flex items-center mb-4">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-2xl mr-3" />
                    <p className="text-gray-700">Product added to cart successfully!</p>
                </div>
                <motion.button
                    onClick={closeModal}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Close
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

const CartErrorModal = ({ isOpen, closeModal, errorMessage }) => {
    useEffect(() => {
        if (isOpen) {
            console.log('CartErrorModal is open with message:', errorMessage);
            const timer = setTimeout(() => {
                closeModal();
            }, 3000); // Auto-close after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [isOpen, closeModal, errorMessage]);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 border-2 border-red-500"
        >
            <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Error</h3>
                    <motion.button
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </motion.button>
                </div>
                <div className="flex items-center mb-4">
                    <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 text-2xl mr-3" />
                    <p className="text-gray-700">{errorMessage || 'Failed to add product to cart.'}</p>
                </div>
                <motion.button
                    onClick={closeModal}
                    className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Close
                </motion.button>
            </motion.div>
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
    const [showCartSuccessModal, setShowCartSuccessModal] = useState(false);
    const [showCartErrorModal, setShowCartErrorModal] = useState(false);
    const [cartErrorMessage, setCartErrorMessage] = useState('');
    const { post: postReview, processing: reviewProcessing, errors: reviewErrors, setData } = useForm({
        rating: 0,
        comment: '',
    });
    const { flash } = usePage().props;

    // Debug: Log flash messages and handle modal triggers
    useEffect(() => {
        console.log('Current flash messages:', flash);
        if (flash?.success) {
            console.log('Flash success detected:', flash.success);
            setShowCartSuccessModal(true);
        }
        if (flash?.error) {
            console.log('Flash error detected:', flash.error);
            setCartErrorMessage(flash.error);
            setShowCartErrorModal(true);
        }
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
            console.log('Invalid quantity:', quantity);
            setCartErrorMessage('Please select a valid quantity.');
            setShowCartErrorModal(true);
            return;
        }

        setCartData('quantity', quantity);

        console.log('Sending cart add request with quantity:', quantity);

        post(route('cart.add', product.id), {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Cart add success, triggering full reload');
                setShowCartSuccessModal(true);
                setQuantity(1);
                setCartData('quantity', 1);
                window.location.reload(); // Trigger full page reload
            },
            onError: (errors) => {
                console.log('Cart add error:', errors);
                const errorMessage = errors.quantity || errors.message || flash?.error || 'Failed to add product to cart.';
                console.log('Setting error modal with message:', errorMessage);
                setCartErrorMessage(errorMessage);
                setShowCartErrorModal(true);
            },
        });
    };

    const closeCartSuccessModal = () => {
        console.log('Closing cart success modal');
        setShowCartSuccessModal(false);
    };

    const closeCartErrorModal = () => {
        console.log('Closing cart error modal');
        setShowCartErrorModal(false);
        setCartErrorMessage('');
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
            <div className="min-h-screen bg-white py-2 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="my-2">
                        <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 w-full">
                            <h1 className="text-lg font-bold text-left mb-0">Products</h1>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden"
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
                                    <h1 className="text-[25px] sm:text-[25px] font-extrabold text-gray-900 mb-4">{product.name}</h1>

                                    <div className="mb-4">
                                        {product.is_offered_product === 'yes' && product.offer ? (
                                            <div className="flex items-center gap-3">
                                                <span className="text-[20px] sm:text-[20px] font-bold text-red-600">
                                                    {parseFloat(product.offer.offer_price).toFixed(2)} Tk
                                                </span>
                                                <span className="text-sm text-gray-400 line-through">
                                                    {parseFloat(product.price).toFixed(2)} Tk
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-sm sm:text-3xl font-bold text-gray-900">
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

                                    <div className="mb-6 text-sm">
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
                                                            <li key={i} className="text-sm">
                                                                <span className="font-medium">{name}:</span> {detail}
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
                                            <div className="flex items-center border border-gray-200 rounded-lg">
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
                                        <div className="backdrop-blur-md bg-white/30 rounded-xl shadow-lg border border-white/20 overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm text-left">
                                                    <thead>
                                                        <tr className="bg-white text-black">
                                                            <th className="w-1/3 px-8 py-3 font-semibold rounded-tl-xl">Specification</th>
                                                            <th className="w-2/3 px-8 py-3 font-semibold rounded-tr-xl">Details</th>
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
                                                                        className="border-b border-gray-200/50 hover:bg-gray-50/50 transition-colors duration-200"
                                                                    >
                                                                        <td className="px-8 py-4 font-medium text-gray-800">{name}</td>
                                                                        <td className="px-8 py-4 text-gray-600">{detail}</td>
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

                    <div
                        ref={descriptionRef}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden mt-2"
                    >
                        <div className="border-t border-gray-200">
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
                        className="bg-white rounded-2xl shadow-xl overflow-hidden mt-2"
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
                                            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-lg disabled:opacity-60 "
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
                {showCartSuccessModal && (
                    <CartSuccessModal isOpen={showCartSuccessModal} closeModal={closeCartSuccessModal} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showCartErrorModal && (
                    <CartErrorModal
                        isOpen={showCartErrorModal}
                        closeModal={closeCartErrorModal}
                        errorMessage={cartErrorMessage}
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
