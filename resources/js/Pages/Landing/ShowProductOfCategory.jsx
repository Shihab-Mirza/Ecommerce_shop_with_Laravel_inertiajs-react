import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFire, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import NavBar from './Navbar';
import Footer from './Footer';
import CartModal from './CartModal';

// Add icons to the library
import { library } from '@fortawesome/fontawesome-svg-core';
library.add(faHome, faFire, faShoppingCart);

export default function ShowProductOfCategory({ auth, title, products, categories, filters: initialFilters, errors, cartItems, cartCount, cartId, checkoutToken }) {
  const [filters, setFilters] = useState({
    minPrice: initialFilters?.minPrice && parseFloat(initialFilters.minPrice) >= 0 ? initialFilters.minPrice : '',
    maxPrice: initialFilters?.maxPrice && parseFloat(initialFilters.maxPrice) >= 0 ? initialFilters.maxPrice : '',
    inStock: initialFilters?.inStock || false,
    offered: initialFilters?.offered || false,
    sort: initialFilters?.sort || '',
  });
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [localCartItems, setLocalCartItems] = useState(cartItems || []);
  const [localCartCount, setLocalCartCount] = useState(cartCount || 0);
  const [pendingCheckout, setPendingCheckout] = useState(false);

  // Sync cart items and count with props
  useEffect(() => {
    setLocalCartItems(cartItems || []);
    setLocalCartCount(cartCount || 0);
  }, [cartItems, cartCount]);

  // Toggle cart modal
  const toggleCartModal = () => {
    setCartModalOpen((prev) => !prev);
  };

  const openLoginModal = () => {
    // Placeholder for login modal trigger, passed to Navbar or CartModal if needed
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'number' && value !== '' && parseFloat(value) < 0) {
      return; // Prevent negative values
    }
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSortDoubleClick = (e) => {
    e.preventDefault(); // Prevent any default browser behavior
    setFilters((prev) => ({
      ...prev,
      sort: '', // Clear sort on double-click
    }));
  };

  const applyFilters = () => {
    // Validate non-negative prices
    if ((filters.minPrice !== '' && parseFloat(filters.minPrice) < 0) ||
        (filters.maxPrice !== '' && parseFloat(filters.maxPrice) < 0)) {
      alert('Price cannot be negative.');
      return;
    }
    const query = new URLSearchParams();
    if (filters.minPrice !== '') query.append('minPrice', filters.minPrice);
    if (filters.maxPrice !== '') query.append('maxPrice', filters.maxPrice);
    if (filters.inStock) query.append('inStock', '1');
    if (filters.offered) query.append('offered', '1');
    if (filters.sort !== '') query.append('sort', filters.sort);
    window.location.assign(`?${query.toString()}`);
  };

  return (
    <>
      <Head title={title} />
      <NavBar
        auth={auth}
        categories={categories}
        cartCount={localCartCount}
        toggleCartModal={toggleCartModal}
        setPendingCheckout={setPendingCheckout}
        cartId={cartId}
        checkoutToken={checkoutToken}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Floating Cart Icon */}
        <button
          onClick={toggleCartModal}
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-40 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <FontAwesomeIcon icon="shopping-cart" size="lg" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
            {localCartCount}
          </span>
        </button>

        {/* Cart Modal */}
        <CartModal
          isOpen={cartModalOpen}
          toggleCartModal={toggleCartModal}
          cartItems={localCartItems}
          cartCount={localCartCount}
          setCartItems={setLocalCartItems}
          setCartCount={setLocalCartCount}
          auth={auth}
          cartId={cartId}
          checkoutToken={checkoutToken}
          setPendingCheckout={setPendingCheckout}
          openLoginModal={openLoginModal}
        />

        {/* Breadcrumb Navigation */}
        <nav className="lg:mt-2 mt-10 mb-2" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 bg-white shadow-lg border border-gray-200 rounded-md p-3 w-full sm:w-auto sm:ml-0">
            <li>
              <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600">
                <FontAwesomeIcon icon="home" className="w-4 h-4" />
                <span className="sr-only">Home</span>
              </Link>
            </li>
            <li className="flex items-center">
              <span className="text-gray-400 mx-1">/</span>
              <span className="text-sm sm:text-md font-semibold text-gray-800">All {title} Products</span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col sm:flex-row sm:space-x-6">
          {/* Filter Sidebar */}
          <aside className="w-full sm:w-64 mb-6 sm:mb-0">
            <div className="bg-white/10 shadow-md rounded-2xl border border-white/20 p-6 transition-all duration-300 hover:shadow-md">
              <h2 className="text-lg sm:text-xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Refine Your Search
              </h2>
              {/* Error Messages */}
              {errors.minPrice && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm" role="alert">
                  <span>{errors.minPrice}</span>
                </div>
              )}
              {errors.maxPrice && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm" role="alert">
                  <span>{errors.maxPrice}</span>
                </div>
              )}
              {errors.sort && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 text-sm" role="alert">
                  <span>{errors.sort}</span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">Price Range</h3>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    min="0"
                    className="w-full p-2 sm:p-3 bg-gray-100/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
                  />
                  <span className="text-gray-600">-</span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    min="0"
                    className="w-full p-2 sm:p-3 bg-gray-100/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={filters.inStock}
                    onChange={handleFilterChange}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                      filters.inStock ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                    }`}
                  >
                    {filters.inStock && (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-700 group-hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base">In Stock</span>
                </label>
              </div>
              <div className="mb-6">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    name="offered"
                    checked={filters.offered}
                    onChange={handleFilterChange}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                      filters.offered ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                    }`}
                  >
                    {filters.offered && (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-700 group-hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base">On Offer</span>
                </label>
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">Sort By</h3>
                <label className="flex items-center cursor-pointer group mb-2">
                  <input
                    type="checkbox"
                    name="sort"
                    value="high-to-low"
                    checked={filters.sort === 'high-to-low'}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        sort: e.target.checked ? 'high-to-low' : prev.sort === 'high-to-low' ? '' : prev.sort,
                      }));
                    }}
                    onDoubleClick={handleSortDoubleClick}
                    className="hidden"
                    id="sort-high-to-low"
                  />
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                      filters.sort === 'high-to-low' ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                    }`}
                  >
                    {filters.sort === 'high-to-low' && (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-700 group-hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base">Price High to Low</span>
                </label>
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    name="sort"
                    value="low-to-high"
                    checked={filters.sort === 'low-to-high'}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        sort: e.target.checked ? 'low-to-high' : prev.sort === 'low-to-high' ? '' : prev.sort,
                      }));
                    }}
                    onDoubleClick={handleSortDoubleClick}
                    className="hidden"
                    id="sort-low-to-high"
                  />
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                      filters.sort === 'low-to-high' ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                    }`}
                  >
                    {filters.sort === 'low-to-high' && (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-700 group-hover:text-blue-600 transition-colors duration-200 text-sm sm:text-base">Price Low to High</span>
                </label>
              </div>
              <button
                onClick={applyFilters}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                Apply Filters
              </button>
            </div>
          </aside>
          {/* Main Content */}
          <main className="flex-1">
            {products.data.length === 0 ? (
              <p className="text-black text-center text-sm sm:text-base">No products found.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
                {products.data.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 text-center transform transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-xl min-h-[250px] sm:min-h-[310px] flex flex-col justify-end relative"
                  >
                    {product.is_offered_product === 'yes' && (
                      <div className="absolute top-2 left-2 animate-fire">
                        <FontAwesomeIcon icon="fire" className="text-yellow-500 text-lg sm:text-xl animate-pulse" />
                      </div>
                    )}
                    {/* Product Image as Link */}
                    <Link href={route('products.show', product.id)}>
                      {product.image ? (
                        <img
                          src={asset('storage/' + product.image)}
                          alt={product.name}
                          className="w-full h-24 sm:h-32 object-contain mb-4 cursor-pointer"
                        />
                      ) : (
                        <div className="w-full h-24 sm:h-32 bg-gray-200 flex items-center justify-center mb-4 cursor-pointer">
                          <span className="text-gray-500 text-sm">No Image</span>
                        </div>
                      )}
                    </Link>
                    <div className="mt-auto">
                      {/* Product Name as Link */}
                      <h3 className="text-xs sm:text-sm font-semibold mb-2">
                        <Link
                          href={route('products.show', product.id)}
                          className="text-blue-600 hover:underline"
                        >
                          {product.name}
                        </Link>
                      </h3>
                      {/* Price Display */}
                      {product.is_offered_product === 'yes' && product.offer ? (
                        <div className="text-gray-600 text-xs sm:text-sm">
                          <span className="line-through">{parseFloat(product.price).toFixed(2)} Tk</span>
                          <span className="ml-2 text-red-600">
                            {parseFloat(product.offer.offer_price).toFixed(2)} Tk
                          </span>
                        </div>
                      ) : (
                        <p className="text-gray-600 text-xs sm:text-sm">{parseFloat(product.price).toFixed(2)} Tk</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Pagination */}
            <div className="mt-8 flex justify-center space-x-2 flex-wrap">
              {products.links.map((link, index) => (
                <button
                  key={index}
                  onClick={() => link.url && window.location.assign(link.url)}
                  disabled={!link.url}
                  className={`px-2 py-1 sm:px-3 sm:py-1 border rounded text-sm sm:text-base ${
                    link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
                  } ${!link.url && 'opacity-50 cursor-not-allowed'} m-1`}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}

// Helper function to generate asset URLs
function asset(path) {
  return `/${path}`;
}
