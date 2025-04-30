import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import { CartContext } from '../context/CartContext';

function Home() {
  const { addToCart } = useContext(CartContext);
  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 200 });
  const slideIn = useSpring({ transform: 'translateY(0)', from: { transform: 'translateY(-50px)' }, delay: 400 });

  const books = [
    { id: 1, name: 'Distinctive Decor: Tablescaping Book', price: 45, image: '/images/book.png' },
    { id: 2, name: 'New Edition: Tablescaping Book 2', price: 45, image: '/images/book.png' },
  ];

  return (
    <div className="container mx-auto p-4">
      <div
        className="relative h-96"
        style={{
          backgroundImage: "url('/images/img3.png.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
          <animated.h1 style={fadeIn} className="text-5xl font-bold mb-4">
            Welcome to AE Decor
          </animated.h1>
          <animated.p style={slideIn} className="text-xl mb-8">
            Your one-stop shop for tablescaping books and appointments.
          </animated.p>
          <Link to="/books">
            <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition duration-300">
              Explore Our Books
            </button>
          </Link>
        </div>
      </div>

      {/* Updated grid container */}
      <div className="container mx-auto w-full grid grid-cols-2 max-834px:grid-cols-1 gap-8 mt-8">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105"
          >
            <div className="w-full h-64 flex items-center justify-center bg-gray-100">
              <img
                src={book.image || '/images/book.png'}
                alt={book.name}
                className="object-contain max-h-full max-w-full"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{book.name}</h3>
              <p className="text-gray-700 mb-4">${book.price}</p>
              <button
                onClick={() => addToCart(book)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;