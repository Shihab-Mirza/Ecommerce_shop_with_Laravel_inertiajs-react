import { Head, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import NavBar from './Navbar';
import Footer from './Footer';
import SecondaryNavBar from './SecondaryNavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faCube, faSearch } from '@fortawesome/free-solid-svg-icons';

export default function ShowAllCategory({ auth, categories }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
      <NavBar auth={auth} />
      <SecondaryNavBar categories={categories} />
      <div className="container mx-auto px-4 py-12 bg-white min-h-screen">
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
          <p className="text-black rose-500 font-medium text-lg">No results found.....</p>
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
                      .filter((subcategory) =>
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
                                  .filter((brand) =>
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
