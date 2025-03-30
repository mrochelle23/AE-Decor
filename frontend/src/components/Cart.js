import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

function Cart() {
  const { cart, updateCartQuantity, removeFromCart } = useContext(CartContext);

  console.log('Cart context:', { cart, updateCartQuantity, removeFromCart });

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

function CartItem({ item, updateCartQuantity, removeFromCart }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <img src={item.image} alt={item.name} className="w-16 h-16 object-contain mr-4" />
        <div>
          <Link to={`/books/${item.id}`} className="text-xl font-bold text-blue-500 hover:underline">
            {item.name}
          </Link>
          <p className="text-gray-700">${item.price}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
          className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400 transition duration-300"
        >
          -
        </button>
        <span>{item.quantity}</span>
        <button
          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
          className="bg-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-gray-400 transition duration-300"
        >
          +
        </button>
        {/* Trashcan Button */}
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-gray-700 px-3 py-2 rounded-full hover:bg-gray-400 transition duration-300 ml-4"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  );
}

export default CartItem;