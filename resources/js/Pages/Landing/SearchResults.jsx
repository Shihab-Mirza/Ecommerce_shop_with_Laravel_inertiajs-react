import React from 'react';
import { Head, Link } from '@inertiajs/react';
import NavBar from './Navbar';
import SecondaryNavBar from './SecondaryNavBar';
import Footer from './Footer';

export default function SearchResults({ auth, products, query, categories }) {
  return (
    <>
      <Head title={`Search Results for "${query}"`} />
      <NavBar auth={auth} />
      <SecondaryNavBar categories={categories} />
      <div className="container mx-auto px-4 py-4">
        {/* Main Content */}
        <main className="flex-1">
          {products.data.length === 0 ? (
            <p className="text-black text-center">No products found.</p>
          ) : (
            <>
              <div className="flex flex-col">
                {/* Header Card aligned with first product */}
                <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-2 mb-4">
                  <h1 className="text-lg font-bold text-left mb-0">Search Results for "{query}"</h1>
                </div>
                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
                  {products.data.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white shadow-lg rounded-lg border border-gray-200 p-3 text-center transform transition-all duration-300 ease-in-out hover:scale-102 hover:shadow-xl min-h-[250px] flex flex-col justify-end relative"
                    >
                      {product.is_offered_product === 'yes' && (
                        <div className="absolute top-2 left-2 animate-fire">
                          <i className="fas fa-fire text-yellow-500 text-lg animate-pulse"></i>
                        </div>
                      )}
                      {/* Product Image as Link */}
                      <Link href={`/view-products/${product.id}`}>
                        {product.image ? (
                          <img
                            src={asset(`storage/${product.image}`)}
                            alt={product.name}
                            className="w-full h-24 object-contain mb-3 cursor-pointer"
                          />
                        ) : (
                          <div className="w-full h-24 bg-gray-200 flex items-center justify-center mb-3 cursor-pointer">
                            <span className="text-gray-500 text-xs">No Image</span>
                          </div>
                        )}
                      </Link>
                      <div className="mt-auto">
                        {/* Product Name as Link */}
                        <h3 className="text-xs font-semibold mb-1 line-clamp-2">
                          <Link
                            href={`/view-products/${product.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            {product.name}
                          </Link>
                        </h3>
                        {/* Price Display */}
                        {product.is_offered_product === 'yes' && product.offer ? (
                          <div className="text-gray-600 text-sm">
                            <span className="line-through">{parseFloat(product.price).toFixed(2)} Tk</span>
                            <span className="ml-1 text-red-600">
                              {parseFloat(product.offer.offer_price).toFixed(2)} Tk
                            </span>
                          </div>
                        ) : (
                          <p className="text-gray-600 text-sm">{parseFloat(product.price).toFixed(2)} Tk</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

// Helper function to generate asset URLs
function asset(path) {
  return `/${path}`;
}
