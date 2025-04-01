import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function Cart() {
  const { cart, updateCartQuantity, removeFromCart } = useContext(CartContext);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              updateCartQuantity={updateCartQuantity}
              removeFromCart={removeFromCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CartItem({ item = {}, updateCartQuantity, removeFromCart }) {
  const { id, name, price, image, quantity } = item;

  // Define the isHovered state
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <img
          src={image || '/images/default.png'} // Fallback to a default image
          alt={name || 'Item'}
          className="w-16 h-16 object-contain mr-4"
        />
        <div>
          <Link to={`/books/${id}`} className="text-xl font-bold text-blue-500 hover:underline">
            {name || 'Unknown Item'}
          </Link>
          <p className="text-gray-700">${price || '0.00'}</p>
        </div>
      </div>
      {/* Expandable Circle */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`flex items-center justify-center bg-blue-500 text-white font-bold rounded-full transition-all duration-300 ${
            isHovered ? 'w-64 px-4' : 'w-12'
          } h-12`}
        >
          {isHovered ? (
            <div className="flex items-center space-x-4">
              {/* Decrement Button */}
              <button
                onClick={() => updateCartQuantity(id, quantity - 1)}
                className="text-gray-700 px-2 py-1 rounded-full hover:bg-gray-400 transition duration-300"
              >
                -
              </button>
              {/* Quantity Display */}
              <span className="mx-4">{quantity || 0}</span>
              {/* Increment Button */}
              <button
                onClick={() => updateCartQuantity(id, quantity + 1)}
                className="text-gray-700 px-2 py-1 rounded-full hover:bg-gray-400 transition duration-300"
              >
                +
              </button>
              {/* Trashcan Button */}
              <button
                onClick={() => removeFromCart(id)}
                className="text-gray-700 px-2 py-1 rounded-full hover:bg-gray-400 transition duration-300"
              >
              <i className="fas fa-trash"></i>
              </button>
            </div>
          ) : (
            <span>{quantity || 0}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;