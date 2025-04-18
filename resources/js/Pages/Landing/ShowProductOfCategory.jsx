import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import NavBar from './Navbar';
import Footer from './Footer';
import SecondaryNavBar from './SecondaryNavBar';

export default function ShowProductOfCategory({ auth, title, products, categories }) {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    inStock: false,
    offered: false,
  });

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const applyFilters = () => {
    const query = new URLSearchParams();
    if (filters.minPrice) query.append('minPrice', filters.minPrice);
    if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);
    if (filters.inStock) query.append('inStock', '1');
    if (filters.offered) query.append('offered', '1');
    window.location.assign(`?${query.toString()}`);
  };

  return (
    <>
      <Head title={title} />
      <NavBar auth={auth} />
      <SecondaryNavBar categories={categories} />
      <div className="container mx-auto px-4">
        {/* Horizontal card below NavBar */}
        <div className="my-2 ml-64">
          <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-2">
            <h1 className="text-lg font-bold text-left mb-0">All {title} Products</h1>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-4 flex">
        {/* Filter Sidebar */}
        <aside className="w-64 pr-4">
          <div className="bg-white/10 backdrop-blur-lg shadow-xl rounded-2xl border border-white/20 p-6 transition-all duration-300 hover:shadow-2xl">
            <h2 className="text-xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Refine Your Search
            </h2>
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 text-gray-700">Price Range</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  className="w-full p-3 bg-gray-100/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                />
                <span className="text-gray-600">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  className="w-full p-3 bg-gray-100/50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
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
                  className={`w-6 h-6 rounded-md border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                    filters.inStock ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                  }`}
                >
                  {filters.inStock && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-gray-700 group-hover:text-blue-600 transition-colors duration-200">In Stock</span>
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
                  className={`w-6 h-6 rounded-md border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                    filters.offered ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                  }`}
                >
                  {filters.offered && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-gray-700 group-hover:text-blue-600 transition-colors duration-200">On Offer</span>
              </label>
            </div>
            <button
              onClick={applyFilters}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Apply Filters
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1">
          {products.data.length === 0 ? (
            <p className="text-black text-center">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12 justify-start">
              {products.data.map((product) => (
                <div
                  key={product.id}
                  className="bg-white shadow-lg rounded-lg border border-gray-200 p-4 text-center transform transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-xl min-h-[310px] flex flex-col justify-end relative"
                >
                  {product.is_offered_product === 'yes' && (
                    <div className="absolute top-2 left-2 animate-fire">
                      <i className="fas fa-fire text-yellow-500 text-xl animate-pulse"></i>
                    </div>
                  )}
                  {/* Product Image as Link */}
                  <Link href={`/view-products/${product.id}`}>
                    {product.image ? (
                      <img
                        src={asset('storage/' + product.image)}
                        alt={product.name}
                        className="w-full h-32 object-contain mb-4 cursor-pointer"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 flex items-center justify-center mb-4 cursor-pointer">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </Link>
                  <div className="mt-auto">
                    {/* Product Name as Link */}
                    <h3 className="text-sm font-semibold mb-2">
                      <Link
                        href={`/view-products/${product.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {product.name}
                      </Link>
                    </h3>
                    {/* Price Display */}
                    {product.is_offered_product === 'yes' && product.offer ? (
                      <div className="text-gray-600">
                        <span className="line-through">{parseFloat(product.price).toFixed(2)} Tk</span>
                        <span className="ml-2 text-red-600">
                          {parseFloat(product.offer.offer_price).toFixed(2)} Tk
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-600">{parseFloat(product.price).toFixed(2)} Tk</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Pagination */}
          <div className="mt-8 flex justify-center space-x-2">
            {products.links.map((link, index) => (
              <button
                key={index}
                onClick={() => link.url && window.location.assign(link.url)}
                disabled={!link.url}
                className={`px-3 py-1 border rounded ${
                  link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

// Helper function to generate asset URLs (you may already have this)
function asset(path) {
  return `/${path}`;
}
