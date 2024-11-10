import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-8 mt-16">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-lg font-semibold">SLAM Design</div>
          <div className="flex space-x-6">
            {/* Social Media Links */}
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-500 transition-colors"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-500 transition-colors"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-yellow-500 transition-colors"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-xl mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/" className="hover:text-yellow-500 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="hover:text-yellow-500 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-yellow-500 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-4">Contact Us</h3>
            <p className="text-sm mb-2"> SLAM Design,</p>
            <p className="text-sm mb-2">Pitesti, Romania</p>
            <p className="text-sm mb-2">Email: info@slam.com</p>
            <p className="text-sm">Phone: +40 7xx xxx xxx</p>
          </div>

          <div>
            <h3 className="font-semibold text-xl mb-4">Stay Connected</h3>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for updates:
            </p>
            <form action="#" method="POST" className="flex">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="p-2 w-3/4 rounded-l-lg border border-blue-700 bg-blue-800 text-white placeholder-blue-400 focus:outline-none"
              />
              <button
                type="submit"
                className="p-2 w-1/4 rounded-r-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-gray-300">
          <p>© {new Date().getFullYear()} Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
