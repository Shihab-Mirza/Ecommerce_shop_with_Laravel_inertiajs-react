const CartSuccessModal = ({ isOpen, closeModal, successMessage }) => {
    useEffect(() => {
        if (isOpen) {
            console.log('CartSuccessModal is open with message:', successMessage);
            const timer = setTimeout(() => {
                closeModal();
            }, 3000); // Auto-close after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [isOpen, closeModal, successMessage]);

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
                    <p className="text-gray-700">{successMessage || 'Product added to cart successfully!'}</p>
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
