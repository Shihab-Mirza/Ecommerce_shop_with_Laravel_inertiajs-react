import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import NavBar from './Navbar';
import Footer from './Footer';
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

const colors = ['text-green'];
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
};
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

// 25 featured products (5×5 grid)
const featuredProducts = [
  { name: 'Premium Keyboard', price: 99.99 },
  { name: 'Gaming Mouse', price: 59.99 },
  { name: '4K Monitor', price: 299.99 },
  { name: 'Wireless Earbuds', price: 79.99 },
  { name: 'RGB Mechanical Keyboard', price: 129.99 },
  { name: 'Ergonomic Mouse', price: 49.99 },
  { name: 'Noise-Canceling Headset', price: 149.99 },
  { name: 'UltraWide Monitor', price: 399.99 },
  { name: 'Webcam 1080p', price: 69.99 },
  { name: 'Bluetooth Speaker', price: 89.99 },
  { name: 'Mechanical Keyboard', price: 109.99 },
  { name: 'Wireless Mouse', price: 39.99 },
  { name: 'Gaming Headset', price: 99.99 },
  { name: 'Curved Monitor', price: 349.99 },
  { name: 'Streaming Webcam', price: 89.99 },
  { name: 'Silent Keyboard', price: 79.99 },
  { name: 'Laser Mouse', price: 69.99 },
  { name: 'Surround Sound Headset', price: 129.99 },
  { name: '27-inch Monitor', price: 249.99 },
  { name: 'Portable Speaker', price: 59.99 },
  { name: 'Backlit Keyboard', price: 89.99 },
  { name: 'Precision Mouse', price: 54.99 },
  { name: 'Wireless Headphones', price: 119.99 },
  { name: 'LED Monitor', price: 279.99 },
  { name: 'HD Webcam', price: 74.99 }
];

// 25 offered products (5×5 grid)
const offeredProducts = [
  { name: 'Wireless Headset', originalPrice: 89.99, offerPrice: 69.99 },
  { name: 'Webcam HD', originalPrice: 49.99, offerPrice: 39.99 },
  { name: 'Bluetooth Speaker', originalPrice: 79.99, offerPrice: 59.99 },
  { name: 'Gaming Keyboard', originalPrice: 119.99, offerPrice: 89.99 },
  { name: 'Optical Mouse', originalPrice: 34.99, offerPrice: 24.99 },
  { name: 'LED Monitor 24-inch', originalPrice: 199.99, offerPrice: 159.99 },
  { name: 'USB Earbuds', originalPrice: 39.99, offerPrice: 29.99 },
  { name: 'Mini Speaker', originalPrice: 59.99, offerPrice: 44.99 },
  { name: 'Budget Headset', originalPrice: 69.99, offerPrice: 49.99 },
  { name: 'Webcam 720p', originalPrice: 39.99, offerPrice: 29.99 },
  { name: 'Wireless Keyboard', originalPrice: 79.99, offerPrice: 59.99 },
  { name: 'Trackball Mouse', originalPrice: 49.99, offerPrice: 34.99 },
  { name: 'Portable Monitor', originalPrice: 249.99, offerPrice: 199.99 },
  { name: 'Noise-Canceling Earbuds', originalPrice: 99.99, offerPrice: 79.99 },
  { name: 'Desktop Speaker', originalPrice: 69.99, offerPrice: 54.99 },
  { name: 'Basic Keyboard', originalPrice: 29.99, offerPrice: 19.99 },
  { name: 'Budget Mouse', originalPrice: 24.99, offerPrice: 14.99 },
  { name: 'Entry-Level Monitor', originalPrice: 149.99, offerPrice: 119.99 },
  { name: 'Wired Headset', originalPrice: 59.99, offerPrice: 44.99 },
  { name: 'Compact Speaker', originalPrice: 49.99, offerPrice: 34.99 },
  { name: 'Office Keyboard', originalPrice: 39.99, offerPrice: 29.99 },
  { name: 'Basic Webcam', originalPrice: 34.99, offerPrice: 24.99 },
  { name: 'Travel Mouse', originalPrice: 29.99, offerPrice: 19.99 },
  { name: 'Studio Headphones', originalPrice: 129.99, offerPrice: 99.99 },
  { name: 'Small Monitor', originalPrice: 179.99, offerPrice: 139.99 }
];

// 25 new arrivals (5×5 grid)
const newArrivals = [
  { name: 'Smart Keyboard', price: 149.99 },
  { name: 'RGB Mouse', price: 69.99 },
  { name: '8K Monitor', price: 599.99 },
  { name: 'True Wireless Earbuds', price: 129.99 },
  { name: 'Foldable Keyboard', price: 89.99 },
  { name: 'Vertical Mouse', price: 59.99 },
  { name: 'ANC Headset', price: 179.99 },
  { name: 'OLED Monitor', price: 499.99 },
  { name: '4K Webcam', price: 119.99 },
  { name: 'Smart Speaker', price: 99.99 },
  { name: 'Compact Keyboard', price: 69.99 },
  { name: 'Gaming Mouse Pro', price: 79.99 },
  { name: 'VR Headset', price: 299.99 },
  { name: 'Mini LED Monitor', price: 349.99 },
  { name: 'AI Webcam', price: 139.99 },
  { name: 'Touch Keyboard', price: 109.99 },
  { name: 'Silent Mouse', price: 49.99 },
  { name: 'Spatial Audio Headset', price: 199.99 },
  { name: 'Portable 4K Monitor', price: 399.99 },
  { name: 'Streaming Speaker', price: 119.99 },
  { name: 'RGB Keyboard Pro', price: 159.99 },
  { name: 'Ergo Mouse', price: 64.99 },
  { name: 'Premium Headphones', price: 249.99 },
  { name: 'Curved 4K Monitor', price: 449.99 },
  { name: 'Pro Webcam', price: 149.99 }
];

export default function Home({ auth, images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length > 0) {
      console.log('Slideshow running, current image:', images[currentImageIndex].url);
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [currentImageIndex, images]);

  return (
    <>
      <Head title="Home" />
      <NavBar auth={auth} />

      <main className="p-4 sm:p-6 md:p-8">
        {/* Top Section with Category and Image */}
        <div className="flex flex-col md:flex-row mb-12">
          {/* Category Section - Left */}
          <div className="md:w-1/2 pr-4 mb-6 md:mb-0 lg:ml-7">
            <h1 className="text-2xl font-extrabold mb-4 md:mt-20 mt-14 ml-28 sd:ml-7 md:ml-16 bg-gradient-to-r from-blue-600 via-teal-500 to-green-600 bg-clip-text text-transparent tracking-tight relative group animate-water-flow">
              <span className="absolute -bottom-1 w-full h-1 bg-gradient-to-r from-blue-500 to-green-500 transform scale-x-110 group-hover:scale-x-105 transition-transform duration-300 ease-in-out -ml-9"></span>
              Featured Category
            </h1>
            <div className="grid grid-cols-5 gap-2">
              {Category.map((item, index) => (
                <Link
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
                </Link>
              ))}
            </div>
          </div>

          {/* Image-section-Right with Slideshow and Navigation Bars */}
          <div className="md:w-2/3 pl-4 lg:mt-28 md:mt-28 sd:mt-2 lg:mr-7">
            <div className="bg-white shadow-md rounded-xl border border-gray-100 h-48 md:h-96 flex items-center justify-center overflow-hidden relative">
              {images.length > 0 ? (
                <img
                  src={images[currentImageIndex].url}
                  alt={`Slideshow Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover rounded-xl transition-opacity duration-500 ease-in-out"
                  onError={() => console.log(`Failed to load image: ${images[currentImageIndex].url}`)}
                />
              ) : (
                <p className="text-gray-500">No images available</p>
              )}
            </div>
            {/* Navigation Bars (Dots) */}
            <div className="flex justify-center mt-2 space-x-2">
              {images.map((_, index) => (
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-12 ml-7 mr-7">
          {featuredProducts.map((product, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 text-center transform transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-xl min-h-[310px] flex flex-col justify-end relative"
            >
              <div className="absolute top-2 left-2 animate-fire">
                <i className="fas fa-fire text-yellow-500 text-xl animate-pulse"></i>
              </div>
              <div className="mt-auto">
                <h3 className="text-sm font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600">{product.price.toFixed(2)} Tk</p>
              </div>
            </div>
          ))}
        </div>

        {/* Special Offers Section */}
        <h1 className="text-3xl font-extrabold text-center mb-8 tracking-tight text-gray-900">Special Offers</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12 ml-7 mr-7">
          {offeredProducts.map((product, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl border border-gray-100 p-5 text-center transform transition-all duration-300 ease-in-out hover(scale-105 hover:shadow-lg hover:border-gray-200 min-h-[310px] relative overflow-hidden flex flex-col group"
            >
              <span className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Save {(product.originalPrice - product.offerPrice).toFixed(2)} Tk
              </span>
              <div className="flex-grow" />
              <div className="mt-auto">
                <h3 className="text-base font-semibold mb-2 text-gray-800">{product.name}</h3>
                <div className="flex flex-col items-center">
                  <p className="text-gray-400 text-sm line-through tracking-wide">
                    {product.originalPrice.toFixed(2)} Tk
                  </p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mt-2">
                    {product.offerPrice.toFixed(2)} Tk
                  </p>
                </div>
              </div>
              <button className="mt-4 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:from-red-600 hover:to-pink-600">
                Shop Now
              </button>
            </div>
          ))}
        </div>

        {/* New Arrivals Section */}
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">New Arrivals</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12 ml-7 mr-7">
          {newArrivals.map((product, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-xl border border-gray-100 p-5 text-center transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:border-gray-200 min-h-[310px] relative overflow-hidden flex flex-col group"
            >
              <span className="absolute top-2 left-2 bg-gradient-to-r from-teal-400 to-purple-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                New Arrival
              </span>
              <div className="flex-grow" />
              <div className="mt-auto">
                <h3 className="text-base font-semibold mb-2 text-gray-900">{product.name}</h3>
                <div className="flex flex-col items-center">
                  <p className="text-2xl font-bold text-gray-900 mt-2">{product.price.toFixed(2)} Tk</p>
                </div>
              </div>
              <button className="mt-4 text-sm font-medium text-white bg-gradient-to-r from-teal-500 to-purple-600 px-4 py-2 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:from-teal-600 hover:to-purple-700">
                Shop Now
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
