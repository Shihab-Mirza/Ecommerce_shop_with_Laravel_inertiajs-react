import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faYoutube,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  faEnvelope,
  faMapMarkerAlt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { usePage } from "@inertiajs/react";

function Footer() {
  // Access the footer data passed via Inertia
  const { footer } = usePage().props;

  return (
    <footer className="bg-gray-950 text-white py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-300">
              Company
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
              <li>
                <a
                  href="/about"
                  className="hover:text-white transition-colors duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-white transition-colors duration-300"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="hover:text-white transition-colors duration-300"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="/privacy-policy"
                  className="hover:text-white transition-colors duration-300"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-300">
              Contact Us
            </h3>
            <p className="text-gray-400 text-sm sm:text-base flex items-center">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="mr-2 text-gray-400"
              />
              {footer.address || "Dhaka-1230"}
            </p>
            <p className="text-gray-400 text-sm sm:text-base flex items-center">
              <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-400" />
              <a
                href={`tel:${footer.contact_number}`}
                className="hover:text-white transition-colors duration-300"
              >
                {footer.contact_number || "+8801237289284248"}
              </a>
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-300">
              Follow Us
            </h3>
            <div className="flex space-x-4 sm:space-x-6">
              <a
                href={footer.facebook_link || "#"}
                className="hover:scale-110 transition-transform text-gray-400 hover:text-blue-500"
              >
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="text-lg sm:text-2xl"
                />
              </a>
              <a
                href="#"
                className="hover:scale-110 transition-transform text-gray-400 hover:text-blue-400"
              >
                <FontAwesomeIcon
                  icon={faTwitter}
                  className="text-lg sm:text-2xl"
                />
              </a>
              <a
                href="#"
                className="hover:scale-110 transition-transform text-gray-400 hover:text-red-500"
              >
                <FontAwesomeIcon
                  icon={faYoutube}
                  className="text-lg sm:text-2xl"
                />
              </a>
              <a
                href="#"
                className="hover:scale-110 transition-transform text-gray-400 hover:text-pink-500"
              >
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="text-lg sm:text-2xl"
                />
              </a>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-300">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm sm:text-base">
              Subscribe for exclusive offers and the latest news.
            </p>
            <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-3 sm:p-4 w-full lg:w-full bg-transparent text-white focus:outline-none placeholder-gray-500 text-sm sm:text-base"
              />
              <button className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 sm:px-6 py-3 sm:py-4 hover:bg-gradient-to-l transition duration-300">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="text-white text-base sm:text-lg"
                />
              </button>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 sm:mt-12 lg:mt-16 border-t border-gray-800 pt-4 sm:pt-6">
          <p className="text-xs sm:text-sm text-gray-500">
            © 2025 Tech Shop. All rights reserved. Developed by Shihab Mirza
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;