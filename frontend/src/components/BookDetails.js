import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function BookDetails({ books }) {
  const { id } = useParams(); // Get the book ID from the URL
  const { addToCart } = useContext(CartContext); // Access addToCart from CartContext
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const navigate = useNavigate(); // For navigation to the cart page

  // Find the book by ID
  const book = books?.find((b) => b.id === parseInt(id));

  if (!book) {
    return <p>Book not found.</p>;
  }

  const handleAddToCart = () => {
    addToCart(book); // Add the book to the cart
    setShowModal(true); // Show the modal
  };

  const handleCheckout = () => {
    setShowModal(false); // Close the modal
    navigate('/cart'); // Navigate to the cart page
  };

  return (
    <div className="container mx-auto p-4 md:p-10">
      <div className="flex flex-col md:flex-row items-center md:items-start">
        {/* Left: Book Image */}
        <img
          src={book.image || '/images/default.png'}
          alt={book.name}
          className="w-full md:w-1/3 h-auto object-cover mb-8 md:mb-0 md:mr-8"
        />
        {/* Right: Book Info */}
        <div className="flex flex-col items-start text-left">
          <h1 className="text-3xl font-bold mb-6">{book.name}</h1>
          <p className="text-gray-700 text-2xl mb-6">${book.price}</p>
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white px-5 py-3 rounded hover:bg-blue-600 text-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>
      {/* Separator */}
      <hr className="my-8" />
      {/* Book Details */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Details</h2>
        <p className="mb-4">{book.description}</p>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>ISBN:</strong> {book.isbn}</p>
        <p><strong>Format:</strong> {book.format}</p>
        <p><strong>Publication Date:</strong> {book.publicationDate}</p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 w-full max-w-sm md:max-w-md max-h-[80vh] overflow-y-auto relative">
            {/* Close Button (X) */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              &times;
            </button>
            <div className="flex flex-col items-center">
              {/* Book Image */}
              <img
                src={book.image || '/images/default.png'}
                alt={book.name}
                className="w-24 h-32 object-contain mb-4"
              />
              {/* Modal Content */}
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Added to your cart</h2>
                <p className="text-sm">ISBN: {book.isbn}</p>
                <p className="text-sm">Format: {book.format}</p>
                <p className="text-gray-700 text-lg font-bold mt-2 mb-4">${book.price}</p>
                {/* Go to Cart Button */}
                <button
                  onClick={handleCheckout}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                >
                  Go to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookDetails;