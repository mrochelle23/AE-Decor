import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function Cart() {
  const { cart, removeFromCart } = useContext(CartContext);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {cart.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain mr-4" />
                <div>
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <p className="text-gray-700">${item.price}</p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(index)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Cart;