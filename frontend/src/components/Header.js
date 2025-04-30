import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaLeaf } from "react-icons/fa";
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons for the hamburger menu

function Header() {
  const { cart } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <button className="text-white focus:outline-none">
            <img src="/images/logo.png" alt="AE Decor Logo" className="h-20 w-auto" />
          </button>
        </Link>

        {/* Right-side icons */}
        <div className="flex items-center space-x-4 md:hidden">
          {/* Cart icon (visible on small screens) */}
          <div className="relative">
            <Link to="/cart" className="hover:text-gray-400">
              <svg
                className="w-6 h-6 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8L17 13M7 13H5.4M7 13l1.4-7h10.2M7 13h10m0 0l1.4 7M7 13l-1.4 7"
                ></path>
              </svg>
              {getTotalQuantity() > 0 && (
                <span className="absolute -top-2 -right-4 inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {getTotalQuantity()}
                </span>
              )}
            </Link>
          </div>

          {/* Hamburger menu button (visible on small screens) */}
          <button
            className="text-white text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Fullscreen overlay menu (visible on small screens) */}
        <div
          className={`fixed inset-0 bg-blue-600 text-white z-50 transform ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 md:hidden`}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={() => setIsMenuOpen(false)}
          >
            <FaTimes />
          </button>
          <nav className="flex flex-col items-center justify-center h-full space-y-8">
            <Link
              to="/"
              className="text-2xl hover:text-gray-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/books"
              className="text-2xl hover:text-gray-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Books
            </Link>
            <Link
              to="/apppointments"
              className="text-2xl hover:text-gray-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Appointments
            </Link>
            <Link
              to="/contact"
              className="text-2xl hover:text-gray-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/about"
              className="text-2xl hover:text-gray-400"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/cart" 
              className="text-2xl hover:text-gray-400"
              onClick={() => setIsMenuOpen(false)}
            >
              Cart
            </Link>
          </nav>
        </div>

        {/* Desktop navigation menu (visible on larger screens) */}
        <nav className="hidden md:flex md:space-x-4 items-center">
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/books" className="hover:text-gray-400">
                Books
              </Link>
            </li>
            <li>
              <Link to="/appointments" className="hover:text-gray-400">
                appointments
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gray-400">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gray-400">
                About Us
              </Link>
            </li>
          </ul>
          {/* Cart icon (visible on larger screens) */}
          <div className="relative ml-4">
            <Link to="/cart" className="hover:text-gray-400">
              <svg
                className="w-6 h-6 inline"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8L17 13M7 13H5.4M7 13l1.4-7h10.2M7 13h10m0 0l1.4 7M7 13l-1.4 7"
                ></path>
              </svg>
              {getTotalQuantity() > 0 && (
                <span className="absolute -top-2 -right-4 inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {getTotalQuantity()}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;