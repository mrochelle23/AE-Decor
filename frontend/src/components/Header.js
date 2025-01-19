import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function Header() {
  const { cart } = useContext(CartContext);

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/">
          <button className="text-white focus:outline-none">
            <img src="/images/logo.png" alt="AE Decor Logo" className="h-20 w-auto" />
          </button>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
            <li><Link to="/books" className="hover:text-gray-400">Books</Link></li>
            <li><Link to="/appointments" className="hover:text-gray-400">Appointments</Link></li>
            <li><Link to="/contact" className="hover:text-gray-400">Contact</Link></li>
            <li><Link to="/about" className="hover:text-gray-400">About Us</Link></li>
            <li className="relative">
              <Link to="/cart" className="hover:text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8L17 13M7 13H5.4M7 13l1.4-7h10.2M7 13h10m0 0l1.4 7M7 13l-1.4 7"></path>
                </svg>
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;