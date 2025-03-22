import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faYoutube, faInstagram } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <footer className="bg-gray-950 text-white py-20">
            <div className="container mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-gray-300">Company</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/about-us" className="hover:text-white transition-colors duration-300">About Us</a></li>
                            <li><a href="/contact" className="hover:text-white transition-colors duration-300">Contact</a></li>
                            <li><a href="/careers" className="hover:text-white transition-colors duration-300">Careers</a></li>
                            <li><a href="/privacy-policy" className="hover:text-white transition-colors duration-300">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-gray-300">Contact Us</h3>
                        <p className="text-gray-400">wefwencwjncnwncdwcnwdnc</p>
                        <p className="text-gray-400">
                            <a href="tel:+1234567890" className="hover:text-white transition-colors duration-300">
                                017223717313332
                            </a>
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-gray-300">Follow Us</h3>
                        <div className="flex space-x-6">
                            <a href="#" className="hover:scale-110 transition-transform text-gray-400 hover:text-blue-500">
                                <FontAwesomeIcon icon={faFacebookF} className="text-2xl" />
                            </a>
                            <a href="#" className="hover:scale-110 transition-transform text-gray-400 hover:text-blue-400">
                                <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
                            </a>
                            <a href="#" className="hover:scale-110 transition-transform text-gray-400 hover:text-red-500">
                                <FontAwesomeIcon icon={faYoutube} className="text-2xl" />
                            </a>
                            <a href="#" className="hover:scale-110 transition-transform text-gray-400 hover:text-pink-500">
                                <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
                            </a>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-gray-300">Stay Updated</h3>
                        <p className="text-gray-400">Subscribe for exclusive offers and the latest news.</p>
                        <form className="flex items-center border border-gray-700 rounded-lg overflow-hidden bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="p-4 w-full bg-transparent text-white focus:outline-none placeholder-gray-500"
                            />
                            <button className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 hover:bg-gradient-to-l transition duration-300">
                                <span className="text-white text-lg">✉️</span>
                            </button>
                        </form>
                    </div>
                </div>
                <div className="text-center mt-16 border-t border-gray-800 pt-6">
                    <p className="text-sm text-gray-500">© 2025 Computer Store. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
