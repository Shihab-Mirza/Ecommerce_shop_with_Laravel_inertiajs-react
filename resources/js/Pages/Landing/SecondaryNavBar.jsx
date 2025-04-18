import { Link } from '@inertiajs/react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

function SecondaryNavBar({ categories }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Animation variants for mobile menu only
  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
  };

  // Limit to 14 categories for desktop view
  const desktopCategories = categories?.slice(0, 14) || [];

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg py-2 top-0 z-50 border-b border-cyan-500/30 mt-[72px]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop and Mobile Toggle */}
        <div className="flex justify-between items-center">
          <div className="hidden lg:flex items-center">
            {desktopCategories.length ? (
              desktopCategories.map((category) => (
                <div key={category.id} className="relative group pb-1">
                  <Link
                    href={route('products.by.category', category.id)}
                    className="flex items-center px-3 py-1 text-sm font-semibold text-gray-100 hover:text-cyan-400 transition-colors duration-300"
                  >
                    {category.name}
                    {category.subcategories?.length > 0 && (
                      <ChevronDown className="ml-1 h-4 w-4 text-gray-400 group-hover:text-cyan-400 transition-transform duration-300 group-hover:rotate-180" />
                    )}
                  </Link>

                  {/* Subcategories Dropdown */}
                  {category.subcategories?.length > 0 && (
                    <ul
                      className="absolute left-0 mt-0 w-64 bg-gray-800 rounded-xl shadow-2xl shadow-cyan-500/20 border border-gray-700 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transform translate-y-1 group-hover:translate-y-0 transition-all duration-200 ease-out z-50"
                      role="menu"
                    >
                      {category.subcategories.map((subcategory) => (
                        <li key={subcategory.id} className="relative group/sub px-2">
                          <Link
                            href={route('products.by.subcategory', subcategory.id)}
                            className="flex items-center px-5 py-3 text-sm font-medium text-gray-200 hover:bg-gray-700 hover:text-cyan-400 rounded-lg transition-colors duration-200"
                          >
                            {subcategory.sub_category_name}
                            {subcategory.brands?.length > 0 && (
                              <ChevronRight className="ml-2 h-4 w-4 text-cyan-500" />
                            )}
                          </Link>

                          {/* Brands Dropdown */}
                          {subcategory.brands?.length > 0 && (
                            <ul
                              className="absolute left-full top-0 w-64 bg-gray-800 rounded-xl shadow-2xl shadow-cyan-500/20 border border-gray-700 opacity-0 group-hover/sub:opacity-100 pointer-events-none group-hover/sub:pointer-events-auto transform -translate-x-1 group-hover/sub:translate-x-0 transition-all duration-200 ease-out z-50"
                              role="menu"
                            >
                              {subcategory.brands.map((brand) => (
                                <li key={brand.id}>
                                  <Link
                                    href={route('products.by.brand', brand.id)}
                                    className="flex items-center px-5 py-3 text-sm font-medium text-gray-200 hover:bg-gray-700 hover:text-cyan-400 rounded-lg transition-colors duration-200"
                                    role="menuitem"
                                  >
                                    {brand.brand_name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <li className="text-red-500 text-sm font-medium">No categories found.</li>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6 text-gray-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="lg:hidden mt-4 bg-gray-800 rounded-xl shadow-inner shadow-cyan-500/20 p-4"
            >
              {categories?.length ? (
                categories.map((category) => (
                  <div key={category.id} className="mb-4">
                    <Link
                      href={route('products.by.category', category.id)}
                      className="block text-base font-semibold text-gray-100 hover:text-cyan-400 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                    {category.subcategories?.length > 0 && (
                      <ul className="ml-4 mt-2 space-y-2">
                        {category.subcategories.map((subcategory) => (
                          <li key={subcategory.id}>
                            <Link
                              href={route('products.by.subcategory', subcategory.id)}
                              className="block text-sm text-gray-300 hover:text-cyan-400 py-1"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subcategory.sub_category_name}
                            </Link>
                            {subcategory.brands?.length > 0 && (
                              <ul className="ml-4 mt-1 space-y-1">
                                {subcategory.brands.map((brand) => (
                                  <li key={brand.id}>
                                    <Link
                                      href={route('products.by.brand', brand.id)}
                                      className="block text-sm text-gray-400 hover:text-cyan-400 py-1"
                                      onClick={() => setMobileMenuOpen(false)}
                                    >
                                      {brand.brand_name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-red-500 text-sm">No categories found.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default SecondaryNavBar;
