import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import NavBar from './Navbar';
import Footer from './Footer';
import CartModal from './CartModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faDesktop, faLaptop, faMicrochip, faMemory, faHdd, faSdCard,
    faServer, faKeyboard, faMouse, faHeadphones, faPrint, faPlug,
    faFan, faGamepad, faCamera, faTv, faChevronDown, faNetworkWired,
    faEthernet, faBatteryFull, faWifi, faMicrophone, faVolumeHigh, faMobile, faList,
    faShoppingCart
} from '@fortawesome/free-solid-svg-icons';
import {
    MdMonitor, MdDeveloperBoard, MdRouter, MdStorage, MdSpeaker,
    MdCable, MdBatteryChargingFull, MdCloud, MdSecurity, MdSmartphone, MdTablet,
    MdHeadsetMic, MdPower, MdVideogameAsset, MdNetworkCheck
} from 'react-icons/md';
import { FiCpu, FiHardDrive, FiMonitor } from 'react-icons/fi';
import { CircuitBoard, Usb, Webcam, Headphones as LucideHeadphones } from 'lucide-react';
import { InertiaLink } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/react';

const colors = ['text-black'];

const iconMapping = {
    'fa-keyboard': faKeyboard,
    'fa-mouse': faMouse,
    'fa-headphones': faHeadphones,
    'fa-desktop': faDesktop,
    'fa-camera': faCamera,
    'fa-volume-high': faVolumeHigh,
    'fa-microchip': faMicrochip,
    'fa-print': faPrint,
    'fa-network-wired': faNetworkWired,
    'fa-laptop': faLaptop,
    'fa-mobile': faMobile,
    'fa-memory': faMemory,
    'fa-hdd': faHdd,
    'fa-sd-card': faSdCard,
    'fa-server': faServer,
    'fa-plug': faPlug,
    'fa-fan': faFan,
    'fa-gamepad': faGamepad,
    'fa-tv': faTv,
    'fa-chevron-down': faChevronDown,
    'fa-ethernet': faEthernet,
    'fa-battery-full': faBatteryFull,
    'fa-wifi': faWifi,
    'fa-microphone': faMicrophone,
    'fa-list': faList,
    'md-monitor': MdMonitor,
    'md-developer-board': MdDeveloperBoard,
    'md-router': MdRouter,
    'md-storage': MdStorage,
    'md-speaker': MdSpeaker,
    'md-cable': MdCable,
    'md-battery-charging-full': MdBatteryChargingFull,
    'md-cloud': MdCloud,
    'md-security': MdSecurity,
    'md-smartphone': MdSmartphone,
    'md-tablet': MdTablet,
    'md-headset-mic': MdHeadsetMic,
    'md-power': MdPower,
    'md-videogame-asset': MdVideogameAsset,
    'md-network-check': MdNetworkCheck,
    'fi-cpu': FiCpu,
    'fi-hard-drive': FiHardDrive,
    'fi-monitor': FiMonitor,
    'lucide-circuit-board': CircuitBoard,
    'lucide-usb': Usb,
    'lucide-webcam': Webcam,
    'lucide-headphones': LucideHeadphones,
};

function Home({ auth, images, categories, category, featuredProducts, specialOfferProducts, newArrivalProducts }) {
    const { props } = usePage();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageErrors, setImageErrors] = useState({});
    const [cartCount, setCartCount] = useState(props.cartCount || 0);
    const [cartItems, setCartItems] = useState(props.cartItems || []);
    const [cartModalOpen, setCartModalOpen] = useState(false);
    const [pendingCheckout, setPendingCheckout] = useState(false);

    useEffect(() => {
        if (images && images.length > 0) {
            console.log('Slideshow running, current image:', images[currentImageIndex]?.image);
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [currentImageIndex, images]);

    useEffect(() => {
        setCartItems(props.cartItems || []);
        setCartCount(props.cartCount || 0);
    }, [props.cartItems, props.cartCount]);

    const handleImageError = (index) => {
        setImageErrors((prev) => ({ ...prev, [index]: true }));
    };

    const toggleCartModal = () => {
        setCartModalOpen((prev) => !prev);
    };

    const handleWishlistClick = () => {
        if (!auth.user) {
            toggleCartModal(); // Close cart modal
        } else {
            Inertia.get('/wishlist');
        }
    };

    const openLoginModal = () => {
        // This will be passed to Navbar to trigger login modal
    };

    const renderIcon = (iconName) => {
        const iconData = iconMapping[iconName];
        if (!iconData) return null;

        if (iconName.startsWith('fa-')) {
            return <FontAwesomeIcon icon={iconData} className="text-2xl sm:text-3xl mb-2 transition-transform duration-300 group-hover:scale-125 group-hover:animate-pulse text-black" />;
        } else if (iconName.startsWith('lucide-')) {
            return <span className="text-2xl sm:text-3xl mb-2 transition-transform duration-300 group-hover:scale-125 group-hover:animate-pulse text-black">{React.createElement(iconData, { size: 24 })}</span>;
        } else {
            return <span className="text-2xl sm:text-3xl mb-2 transition-transform duration-300 group-hover:scale-125 group-hover:animate-pulse text-black">{React.createElement(iconData, { size: 24 })}</span>;
        }
    };

    const displayCategories = [
        ...category.filter(category => category.show_category_icon === 'yes'),
        { name: 'Show All', icon: 'fa-list' }
    ];

    return (
        <>
            <Head title="Home" />
            <NavBar
                auth={auth}
                categories={categories}
                cartCount={cartCount}
                toggleCartModal={toggleCartModal}
                setPendingCheckout={setPendingCheckout}
                cartId={props.cartId}
                checkoutToken={props.checkoutToken}
            />

            <main className="p-2 sm:p-4 relative">
                {/* Floating Cart Icon */}
                <button
                    onClick={toggleCartModal}
                    className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-40 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                >
                    <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                        {cartCount}
                    </span>
                </button>

                {/* Cart Modal */}
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

                {/* Top Section with Category and Image */}
                <div className="flex flex-col md:flex-row mb-8 sm:mb-12">
                    <div className="md:w-2/3 px-2 sm:px-4 lg:mt-8 md:mt-4 sm:mt-16 mt-10 lg:mr-7 order-1 md:order-2">
                        <div className="bg-white shadow-md rounded-xl border border-gray-100 lg:h-[400px] h-48 sm:h-64 md:h-96 flex items-center justify-center overflow-hidden relative">
                            {images && images.length > 0 ?  (
                                    <img
                                        src={images[currentImageIndex]?.image}
                                        alt={`Slideshow Image ${currentImageIndex + 1}`}
                                        loading="lazy"
                                        className="w-full h-full object-cover rounded-xl transition-opacity duration-500 ease-in-out"
                                    />
                                )
                             : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm sm:text-base">
                                    No images available
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center mt-2 space-x-2">
                            {images &&
                                images.map((_, index) => (
                                    <div
                                        key={index}
                                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                                            currentImageIndex === index ? 'bg-blue-400 scale-125' : 'bg-gray-300'
                                        }`}
                                    />
                                ))}
                        </div>
                    </div>

                    <div className="md:w-1/2 px-2 sm:px-4 mb-6 md:mb-0 lg:ml-7 order-2 md:order-1">
                        <h1 className="text-xl sm:text-2xl font-extrabold mb-4 md:mt-4 mt-4 mx-auto sm:ml-7 md:ml-16 bg-gradient-to-r from-blue-600 via-teal-500 to-green-600 bg-clip-text text-transparent tracking-tight relative group animate-water-flow text-center sm:text-left">
                            <span className="absolute -bottom-1 lg:w-full w-60 h-1 bg-gradient-to-r from-blue-500 to-green-500 transform scale-x-110 group-hover:scale-x-105 transition-transform duration-300 ease-in-out sm:block lg:-ml-9 -ml-7"></span>
                            Featured Category
                        </h1>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {displayCategories.map((item, index) => (
                                <InertiaLink
                                    key={index}
                                    href={item.name === 'Show All' ? '/show_all_category' : `/products/category/${item.id}`}
                                    className={`card relative bg-gradient-to-br from-${
                                        colors[index % colors.length].split('-')[1]
                                    }-200 to-${
                                        colors[(index + 1) % colors.length].split('-')[1]
                                    }-300 hover:from-${
                                        colors[index % colors.length].split('-')[1]
                                    }-300 hover:to-${
                                        colors[(index + 1) % colors.length].split('-')[1]
                                    }-400 shadow-lg rounded-lg p-3 sm:p-4 text-center transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl group`}
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        {renderIcon(item.icon)}
                                        <h2 className="text-xs sm:text-sm font-bold transition-colors duration-300 text-black group-hover:text-gray-700">
                                            {item.name}
                                        </h2>
                                    </div>
                                </InertiaLink>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Featured Products */}
                <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800">Featured Products</h1>
                {featuredProducts && featuredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mb-8 sm:mb-12 mx-2 sm:mx-7">
                        {featuredProducts.map((product, index) => (
                            <div
                                key={product.id || index}
                                className="bg-white shadow-lg rounded-lg border border-gray-200 p-3 sm:p-4 text-center transform transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-xl min-h-[240px] sm:min-h-[310px] flex flex-col justify-end relative"
                            >
                                {product.is_offered_product === 'yes' && product.discount_value ? (
                                    <span className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                        Save {parseFloat(product.discount_value).toFixed(2)} Tk
                                    </span>
                                ) : (
                                    <div className="absolute top-2 left-2 animate-fire">
                                        <i className="fas fa-fire text-yellow-500 text-base sm:text-xl animate-pulse"></i>
                                    </div>
                                )}
                                <InertiaLink href={`/product/${product.id}`} className="flex flex-col items-center">
                                    {product.image && !imageErrors[product.id] ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className={`w-full h-32 sm:h-48 object-contain mb-2 rounded-md ${
                                                product.is_offered_product === 'yes' && product.discount_value ? 'mt-4' : ''
                                            }`}
                                            onError={() => handleImageError(product.id)}
                                        />
                                    ) : (
                                        <div
                                            className={`w-full h-32 sm:h-48 flex items-center justify-center mb-2 text-gray-500 text-xs sm:text-sm ${
                                                product.is_offered_product === 'yes' && product.discount_value ? 'mt-4' : ''
                                            }`}
                                        >
                                            No image available
                                        </div>
                                    )}
                                </InertiaLink>
                                <div className="mt-auto">
                                    <InertiaLink href={`/product/${product.id}`}>
                                        <p className="ml-2 underline text-xs sm:text-sm font-medium mt-2 mb-2 text-black hover:text-blue-800 text-left line-clamp-3 h-16 sm:h-20 hyphens-auto">
                                            {product.name}
                                        </p>
                                    </InertiaLink>
                                    <div className="flex items-center justify-center gap-2">
                                        {product.is_offered_product === 'yes' && product.offer_price ? (
                                            <>
                                                <p className="text-gray-400 text-xs sm:text-sm line-through">
                                                    {parseFloat(product.price).toFixed(2)} Tk
                                                </p>
                                                <p className="text-xs sm:text-sm font-bold text-red-600">
                                                    {parseFloat(product.offer_price).toFixed(2)} Tk
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-gray-600 text-xs sm:text-sm">{parseFloat(product.price).toFixed(2)} Tk</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mb-8 sm:mb-12 text-sm sm:text-base">No featured products found</p>
                )}

                {/* Special Offers Section */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-6 sm:mb-8 tracking-tight text-gray-900">Special Offers</h1>
                {specialOfferProducts && specialOfferProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mb-8 sm:mb-12 mx-2 sm:mx-7">
                        {specialOfferProducts.map((product, index) => (
                            <div
                                key={product.id || index}
                                className="bg-white shadow-lg rounded-lg border border-gray-200 p-3 sm:p-4 text-center transform transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-xl min-h-[260px] sm:min-h-[310px] flex flex-col justify-end relative group"
                            >
                                {product.is_special_offer === 'yes' && product.discount_value ? (
                                    <span className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                        Save {parseFloat(product.discount_value).toFixed(2)} Tk
                                    </span>
                                ) : (
                                    <div className="absolute top-2 left-2 animate-fire">
                                        <i className="fas fa-fire text-yellow-500 text-base sm:text-xl animate-pulse"></i>
                                    </div>
                                )}
                                <InertiaLink href={`/product/${product.id}`} className="flex flex-col items-center">
                                    {product.image && !imageErrors[product.id] ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className={`w-full h-28 sm:h-40 object-contain mb-2 rounded-md ${
                                                product.is_special_offer === 'yes' && product.discount_value ? 'mt-4' : ''
                                            }`}
                                            onError={() => handleImageError(product.id)}
                                        />
                                    ) : (
                                        <div
                                            className={`w-full h-28 sm:h-40 flex items-center justify-center mb-2 text-gray-500 text-xs sm:text-sm ${
                                                product.is_special_offer === 'yes' && product.discount_value ? 'mt-4' : ''
                                            }`}
                                        >
                                            No image available
                                        </div>
                                    )}
                                </InertiaLink>
                                <div className="mt-auto">
                                    <InertiaLink href={`/product/${product.id}`}>
                                        <h3 className="text-xs underline sm:text-sm font-semibold mt-2 mb-2 text-black hover:text-blue-800 text-left line-clamp-3 h-16 hyphens-auto">
                                            {product.name}
                                        </h3>
                                    </InertiaLink>
                                    <div className="flex items-center justify-center gap-2">
                                        {product.is_special_offer === 'yes' && product.offer_price ? (
                                            <>
                                                <p className="text-gray-400 text-xs sm:text-sm line-through">
                                                    {parseFloat(product.price).toFixed(2)} Tk
                                                </p>
                                                <p className="text-xs sm:text-sm font-bold text-red-600">
                                                    {parseFloat(product.offer_price).toFixed(2)} Tk
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-gray-600 text-xs sm:text-sm">{parseFloat(product.price).toFixed(2)} Tk</p>
                                        )}
                                    </div>
                                      <InertiaLink href={`/product/${product.id}`} >

                                    <button className="mt-4 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 px-3 sm:px-4 py-1 sm:py-2 rounded-full">

                                        Shop Now

                                    </button>
                                      </InertiaLink>

                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mb-8 sm:mb-12 text-sm sm:text-base">No special offer products found</p>
                )}

                {/* New Arrivals Section */}
                <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-800">New Arrivals</h1>
                {newArrivalProducts && newArrivalProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mb-8 sm:mb-12 mx-2 sm:mx-7">
                        {newArrivalProducts.map((product, index) => (
                            <div
                                key={product.id || index}
                                className="bg-white shadow-lg rounded-lg border border-gray-200 p-3 sm:p-4 text-center transform transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-xl min-h-[240px] sm:min-h-[310px] flex flex-col justify-end relative"
                            >
                                {product.is_offered_product === 'yes' && product.discount_value ? (
                                    <span className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                        Save {parseFloat(product.discount_value).toFixed(2)} Tk
                                    </span>
                                ) : (
                                    <div className="absolute top-2 left-2 animate-fire">
                                        <i className="fas fa-fire text-yellow-500 text-base sm:text-xl animate-pulse"></i>
                                    </div>
                                )}
                                <InertiaLink href={`/product/${product.id}`} className="flex flex-col items-center">
                                    {product.image && !imageErrors[product.id] ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className={`w-full h-32 sm:h-48 object-contain mb-2 rounded-md ${
                                                product.is_offered_product === 'yes' && product.discount_value ? 'mt-4' : ''
                                            }`}
                                            onError={() => handleImageError(product.id)}
                                        />
                                    ) : (
                                        <div
                                            className={`w-full h-32 sm:h-48 flex items-center justify-center mb-2 text-gray-500 text-xs sm:text-sm ${
                                                product.is_offered_product === 'yes' && product.discount_value ? 'mt-4' : ''
                                            }`}
                                        >
                                            No image available
                                        </div>
                                    )}
                                </InertiaLink>
                                <div className="mt-auto">
                                    <InertiaLink href={`/product/${product.id}`}>
                                        <p className="ml-2 underline text-xs sm:text-sm font-medium mt-2 mb-2 text-black hover:text-blue-800 text-left line-clamp-3 h-16 sm:h-20 hyphens-auto">
                                            {product.name}
                                        </p>
                                    </InertiaLink>
                                    <div className="flex items-center justify-center gap-2">
                                        {product.is_offered_product === 'yes' && product.offer_price ? (
                                            <>
                                                <p className="text-gray-400 text-xs sm:text-sm line-through">
                                                    {parseFloat(product.price).toFixed(2)} Tk
                                                </p>
                                                <p className="text-xs sm:text-sm font-bold text-red-600">
                                                    {parseFloat(product.offer_price).toFixed(2)} Tk
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-gray-600 text-xs sm:text-sm">{parseFloat(product.price).toFixed(2)} Tk</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mb-8 sm:mb-12 text-sm sm:text-base">No new arrival products found</p>
                )}
            </main>
            <Footer />
        </>
    );
}

export default Home;
