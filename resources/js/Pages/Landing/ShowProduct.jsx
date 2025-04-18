import { Head, Link } from '@inertiajs/react';
import React from 'react';
import NavBar from './Navbar';
import Footer from './Footer';
import SecondaryNavBar from './SecondaryNavBar';

export default function ShowProduct({ auth, product, categories }) {
  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <>
      <Head title={product.name} />
      <NavBar auth={auth} />
      <SecondaryNavBar categories={categories} />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6 flex">
          {/* Product Image */}
          <div className="w-1/2">
            {product.image ? (
              <img
                src={asset('storage/' + product.image)}
                alt={product.name}
                className="w-full h-64 object-contain"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
          </div>
          {/* Product Details */}
          <div className="w-1/2 pl-6">
            <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
            {product.is_offered_product === 'yes' && product.offer ? (
              <div className="mb-4">
                <span className="line-through text-gray-600">
                  {parseFloat(product.price).toFixed(2)} Tk
                </span>
                <span className="ml-2 text-red-600 font-semibold">
                  {parseFloat(product.offer.offer_price).toFixed(2)} Tk
                </span>
              </div>
            ) : (
              <p className="text-gray-600 mb-4">{parseFloat(product.price).toFixed(2)} Tk</p>
            )}
            <p className="text-gray-700 mb-4">{product.description || 'No description available.'}</p>
            <p className="text-gray-600">Category: {product.category?.name}</p>
            <p className="text-gray-600">Subcategory: {product.subcategory?.sub_category_name || 'N/A'}</p>
            <p className="text-gray-600">Brand: {product.brand?.brand_name}</p>
            <p className="text-gray-600">Stock: {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function asset(path) {
  return `/${path}`;
}
