import React from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';

function Home() {
  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 200 });
  const slideIn = useSpring({ transform: 'translateY(0)', from: { transform: 'translateY(-50px)' }, delay: 400 });

  return (
    <div className="container mx-auto p-4">
      <div className="relative h-96" style={{ backgroundImage: "url('/images/img3.png.jpeg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
          <animated.h1 style={fadeIn} className="text-5xl font-bold mb-4">Welcome to AE Decor</animated.h1>
          <animated.p style={slideIn} className="text-xl mb-8">Your one-stop shop for tablescaping books and appointments.</animated.p>
          <Link to="/books">
            <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition duration-300">
              Explore Our Books
            </button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
          <div className="w-full h-64 flex items-center justify-center">
            <img src="/images/book.png" alt="Book 1" className="object-contain max-h-full max-w-full" />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-2">Tablescaping Book 1</h3>
            <p className="text-gray-700 mb-4">$45</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Add to Cart</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
          <div className="w-full h-64 flex items-center justify-center bg-gray-100">
            <img src="/images/book.png" alt="Book 2" className="object-contain max-h-full max-w-full" />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-bold mb-2">Tablescaping Book 2</h3>
            <p className="text-gray-700 mb-4">$45</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;