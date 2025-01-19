import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function BookList() {
  const { addToCart } = useContext(CartContext);

  const books = [
    { id: 1, name: 'Distinctive Decor: Tablescaping Book', price: 45, image: '/images/book.png' },
    { id: 2, name: 'New Edition: Tablescaping Book 2', price: 45, image: '/images/book.png' },
  ];

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4 text-left">Our Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {books.map((book) => (
          <div key={book.id} className="book border p-4">
            <img src={book.image} alt={book.name} className="mb-4 mx-auto" />
            <h3 className="text-xl font-bold">{book.name}</h3>
            <p>${book.price}</p>
            <button
              onClick={() => addToCart(book)}
              className="bg-blue-500 text-white px-4 py-2 mt-2"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookList;