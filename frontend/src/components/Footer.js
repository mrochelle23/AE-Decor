import React from 'react';

function Footer() {
  return (
    <footer className="bg-blue-600 text-white p-4 mt-8 shadow-md">
      <div className="container mx-auto text-center">
        <ul className="flex justify-center space-x-4 mb-4">
          <li><a href="https://facebook.com/aedecor" className="hover:text-gray-400">Facebook</a></li>
          <li><a href="https://instagram.com/aedecor1" className="hover:text-gray-400">Instagram</a></li>
          <li><a href="mailto:contact@aedecor.com" className="hover:text-gray-400">Email Us</a></li>
        </ul>
        <p>&copy; 2024 AE Decor. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;