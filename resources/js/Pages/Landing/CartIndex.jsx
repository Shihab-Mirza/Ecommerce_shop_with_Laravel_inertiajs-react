import { Head } from '@inertiajs/react';
import React from 'react';
import NavBar from './Navbar';
import Footer from './Footer';
import SecondaryNavBar from './SecondaryNavBar';

export default function CartIndex({ auth, cartItems, categories }) {
  return (
    <>
      <Head title="Cart" />
      <NavBar auth={auth} />
      <SecondaryNavBar categories={categories} />
      <div className="min-h-screen bg-white py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
          {cartItems.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{item.product.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">Price: {parseFloat(item.product.price).toFixed(2)} Tk</p>
                  </div>
                  <p className="text-lg font-bold">
                    {(item.quantity * item.product.price).toFixed(2)} Tk
                  </p>
                </div>
              ))}
              <div className="border-t pt-4">
                <p className="text-xl font-bold">
                  Total: {cartItems.reduce((total, item) => total + item.quantity * item.product.price, 0).toFixed(2)} Tk
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Your cart is empty.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
