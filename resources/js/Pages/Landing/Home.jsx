import { Head } from '@inertiajs/react';
import React, { useState, useEffect, useCallback, memo } from 'react';
import NavBar from './Navbar';
import Footer from './Footer';
import CartModal from './CartModal';
import SecondaryNavBar from './SecondaryNavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faKeyboard,
  faMouse,
  faHeadphones,
  faDesktop,
  faCamera,
  faVolumeUp,
  faMicrochip,
  faPrint,
  faNetworkWired,
  faLaptop,
  faMobileAlt,
  faHeadphonesAlt,
  faList
} from '@fortawesome/free-solid-svg-icons';
import { InertiaLink } from '@inertiajs/inertia-react';

const colors = ['text-black'];
const Category = [
  { name: 'Keyboard', icon: faKeyboard },
  { name: 'Mouse', icon: faMouse },
  { name: 'Headsets', icon: faHeadphones },
  { name: 'Monitors', icon: faDesktop },
  { name: 'Webcams', icon: faCamera },
  { name: 'Speakers', icon: faVolumeUp },
  { name: 'Processors', icon: faMicrochip },
  { name: 'Printers', icon: faPrint },
  { name: 'Networking', icon: faNetworkWired },
  { name: 'Laptops', icon: faLaptop },
  { name: 'Earbuds', icon: faHeadphonesAlt },
  { name: 'Mobile Phones', icon: faMobileAlt },
  { name: 'Show All', icon: faList }
];

// Memoize ProductCard to prevent unnecessary re-renders
const ProductCard = memo(({ product, handleImageError }) => (
  <div
    className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 text-center transform transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-xl min-h-[310px] flex flex-col justify-end relative group"
  >
    {product.is_offered_product === 'yes' && product.discount_value ? (
      <span className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
        Save {parseFloat(product.discount_value).toFixed(2)} Tk
      </span>
    ) : product.is_special_offer === 'yes' && product.discount_value ? (
      <span className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
        Save {parseFloat(product.discount_value).toFixed(2)} Tk
      </span>
    ) : (
      <div className="absolute top-2 left-2 animate-fire">
        <i className="fas fa-fire text-yellow-500 text-xl animate-pulse"></i>
      </div>
    )}
    {product.is_new_arrival && (
      <span className="absolute top-2 right-2 bg-gradient-to-r from-teal-400 to-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
        New Arrival
      </span>
    )}
    <InertiaLink href={`/product/${product.id}`} className="flex flex-col items-center">
      {product.image && !product.imageError ? (
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-40 object-contain mb-2 rounded-md ${
            (product.is_offered_product === 'yes' || product.is_special_offer === 'yes' || product.is_new_arrival) && product.discount_value ? 'mt-4' : ''
          }`}
          onError={() => handleImageError(product.id)}
          loading="lazy"
        />
      ) : (
        <div
          className={`w-full h-40 flex items-center justify-center mb-2 text-gray-500 text-sm ${
            (product.is_offered_product === 'yes' || product.is_special_offer === 'yes' || product.is_new_arrival) && product.discount_value ? 'mt-4' : ''
          }`}
        >
          No image available
        </div>
      )}
    </InertiaLink>
    <div className="mt-auto">
      <InertiaLink href={`/product/${product.id}`}>
        <h3 className="text-sm font-semibold mb-2 text-blue-600 hover:text-blue-800">
          {product.name}
        </h3>
      </InertiaLink>
      {(product.is_offered_product === 'yes' || product.is_special_offer === 'yes') && product.offer_price ? (
        <div className="flex flex-col items-center">
          <p className="text-gray-400 text-sm line-through tracking-wide">
            {parseFloat(product.price).toFixed(2)} Tk
          </p>
          <p className="text-lg font-bold text-red-600">
            {parseFloat(product.offer_price).toFixed(2)} Tk
          </p>
        </div>
      ) : (
        <p className="text-gray-600">{parseFloat(product.price).toFixed(2)} Tk</p>
      )}
    </div>
    {(product.is_special_offer === 'yes' || product.is_new_arrival) && (
      <button className={`mt-4 text-sm font-medium text-white bg-gradient-to-r ${product.is_special_offer ? 'from-red-500 to-pink-500' : 'from-teal-500 to-purple-600'} px-4 py-2 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:${product.is_special_offer ? 'from-red-600 hover:to-pink-600' : 'from-teal-600 hover:to-purple-700'}`}>
        Shop Now
      </button>
    )}
  </div>
));

function Home({ auth, images, categories, featuredProducts, specialOfferProducts, newArrivalProducts }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState(new Set());

  // Optimize slideshow interval
  useEffect(() => {
    if (images && images.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [images]);

  // Optimize image error handling
  const handleImageError = useCallback((productId) => {
    setImageErrors((prev) => new Set(prev).add(productId));
  }, []);

  // Prepare products with image error status
  const prepareProducts = (products, isNewArrival = false) =>
    products.map((product) => ({
      ...product,
      imageError: imageErrors.has(product.id),
      is_new_arrival: isNewArrival,
    }));

  return (
    <>
      <Head title="Home" />
      <NavBar auth={auth} />
      <SecondaryNavBar categories={categories} />
      <main className="p-4">
        {/* Top Section with Category and Image */}
        <div className="flex flex-col md:flex-row mb-12">
          {/* Category Section - Left */}
          <div className="md:w-1/2 pr-4 mb-6 md:mb-0 lg:ml-7">
            <h1 className="text-2xl font-extrabold mb-4 md:mt-4 mt-4 ml-28 sd:ml-7 md:ml-16 bg-gradient-to-r from-blue-600 via-teal-500 to-green-600 bg-clip-text text-transparent tracking-tight relative group animate-water-flow">
              <span className="absolute -bottom-1 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500 transform scale-x-110 group-hover:scale-x-105 transition-transform duration-300 ease-in-out -ml-9"></span>
              Featured Category
            </h1>
            <div className="grid grid-cols-5 gap-2">
              {Category.map((item, index) => (
                <InertiaLink
                  key={index}
                  href={item.name === 'Show All' ? '/show_all_category' : `/Category/${item.name.toLowerCase()}`}
                  className={`card relative bg-gradient-to-br from-${
                    colors[index % colors.length].split('-')[1]
                  }-200 to-${
                    colors[(index + 1) % colors.length].split('-')[1]
                  }-300 hover:from-${
                    colors[index % colors.length].split('-')[1]
                  }-300 hover:to-${
                    colors[(index + 1) % colors.length].split('-')[1]
                  }-400 shadow-lg rounded-lg p-4 text-center transform transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-2xl group`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <FontAwesomeIcon
                      icon={item.icon}
                      className="text-3xl mb-2 transition-transform duration-300 group-hover:scale-125 group-hover:animate-pulse text-black"
                    />
                    <h2 className="text-sm font-bold transition-colors duration-300 text-black group-hover:text-gray-700">
                      {item.name}
                    </h2>
                  </div>
                </InertiaLink>
              ))}
            </div>
          </div>

          {/* Image-section-Right with Slideshow and Navigation Bars */}
          <div className="md:w-2/3 pl-4 lg:mt- md:mt-4 sd:mt-2 lg:mr-7">
            <div className="bg-white shadow-md rounded-xl border border-gray-100 h-48 md:h-96 flex items-center justify-center overflow-hidden relative">
              {images && images.length > 0 ? (
                <img
                  src={images[currentImageIndex]?.url}
                  alt={`Slideshow Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover rounded-xl transition-opacity duration-500 ease-in-out"
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                  loading="lazy"
                />
              ) : (
                <p className="text-gray-500">No images available</p>
              )}
            </div>
            {/* Navigation Bars (Dots) */}
            <div className="flex justify-center mt-2 space-x-2">
              {images && images.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentImageIndex === index ? 'bg-blue-400 scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <h1 className="text-2xl font-bold text-center mb-6 mt-0">Featured Products</h1>
        {featuredProducts && featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-12 ml-7 mr-7">
            {prepareProducts(featuredProducts).map((product) => (
              <ProductCard key={product.id} product={product} handleImageError={handleImageError} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mb-12">No featured products found</p>
        )}

        {/* Special Offers Section */}
        <h1 className="text-3xl font-extrabold text-center mb-8 tracking-tight text-gray-900">Special Offers</h1>
        {specialOfferProducts && specialOfferProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-12 ml-7 mr-7">
            {prepareProducts(specialOfferProducts).map((product) => (
              <ProductCard key={product.id} product={product} handleImageError={handleImageError} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mb-12">No special offer products found</p>
        )}

        {/* New Arrivals Section */}
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">New Arrivals</h1>
        {newArrivalProducts && newArrivalProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-12 ml-7 mr-7">
            {prepareProducts(newArrivalProducts, true).map((product) => (
              <ProductCard key={product.id} product={product} handleImageError={handleImageError} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mb-12">No new arrival products found</p>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Home;
