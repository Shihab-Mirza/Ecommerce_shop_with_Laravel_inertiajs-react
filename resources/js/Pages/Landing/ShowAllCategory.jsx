import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faCube, faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import NavBar from './Navbar';
import Footer from './Footer';
import CartModal from './CartModal';

export default function ShowAllCategory({ auth, categories, cartItems, cartCount, cartId, checkoutToken }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [localCartItems, setLocalCartItems] = useState(cartItems || []);
  const [localCartCount, setLocalCartCount] = useState(cartCount || 0);
  const [pendingCheckout, setPendingCheckout] = useState(false);

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

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

  // Filter categories, subcategories, and brands based on search term
  const filteredCategories = categories.filter((category) => {
    const categoryMatch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const subcategoryMatch = category.subcategories?.some((subcategory) =>
      subcategory.sub_category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const brandMatch = category.subcategories?.some((subcategory) =>
      subcategory.brands?.some((brand) =>
        brand.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    return categoryMatch || subcategoryMatch || brandMatch;
  });

  return (
    <>
      <Head title="All Categories" />
      <NavBar
        auth={auth}
        categories={categories}
        cartCount={localCartCount}
        toggleCartModal={toggleCartModal}
        setPendingCheckout={setPendingCheckout}
        cartId={cartId}
        checkoutToken={checkoutToken}
      />
      <div className="container mx-auto px-4 py-12 bg-white min-h-screen relative">
        {/* Floating Cart Icon */}
        <button
          onClick={toggleCartModal}
          className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-40 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <FontAwesomeIcon icon={faShoppingCart} size="lg" />
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

        {/* Search Input */}
        <div className="mb-8">
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search categories, subcategories, or brands..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>

        {(!filteredCategories || filteredCategories.length === 0) ? (
          <p className="text-black font-medium text-lg">No results found...</p>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white shadow-lg rounded-2xl p-6 mb-8 break-inside-avoid transform hover:scale-105 transition-all duration-300 border border-gray-200"
              >
                <h2 className="text-2xl font-bold mb-4">
                  <Link
                    href={route('products.by.category', category.id)}
                    className="hover:underline text-gray-900 bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500"
                  >
                    {category.name}
                  </Link>
                </h2>

                {category.subcategories && category.subcategories.length > 0 ? (
                  <div className="mb-6">
                    {category.subcategories
                      .filter(
                        (subcategory) =>
                          subcategory.sub_category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          subcategory.brands?.some((brand) =>
                            brand.brand_name.toLowerCase().includes(searchTerm.toLowerCase())
                          ) ||
                          category.name.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((subcategory) => (
                        <div key={subcategory.id} className="ml-4 mb-4">
                          <h4 className="text-base font-medium text-gray-600 flex items-center">
                            <Link
                              href={route('products.by.subcategory', subcategory.id)}
                              className="hover:underline text-black"
                            >
                              {subcategory.sub_category_name}
                            </Link>
                          </h4>
                          {subcategory.brands && subcategory.brands.length > 0 ? (
                            <div className="ml-4">
                              <ul className="list-none pl-0">
                                {subcategory.brands
                                  .filter(
                                    (brand) =>
                                      brand.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      subcategory.sub_category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      category.name.toLowerCase().includes(searchTerm.toLowerCase())
                                  )
                                  .map((brand) => (
                                    <li
                                      key={brand.id}
                                      className="text-gray-600 text-sm flex items-center mt-2"
                                    >
                                      <span className="w-2 h-2 rounded-md bg-gray-600 mr-2"></span>
                                      <Link
                                        href={route('products.by.brand', brand.id)}
                                        className="hover:underline text-black"
                                      >
                                        {brand.brand_name}
                                      </Link>
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          ) : (
                            <p className="text-gray-500 text-sm ml-4 mt-2">No brands available.</p>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No subcategories available.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
