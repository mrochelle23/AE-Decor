import React, { createContext, useState, useEffect } from 'react';

// Create the CartContext
export const CartContext = createContext();

export function CartProvider({ children }) {
  // Initialize cart state with data from localStorage or an empty array
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Function to update the quantity of an item in the cart
  const updateCartQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      )
      .filter((item) => item.quantity > 0) // Remove items with quantity 0
    );
  };

  // Function to remove an item from the cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // Function to add an item to the cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  // Function to calculate the total price of the cart
  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        updateCartQuantity,
        removeFromCart,
        addToCart,
        calculateTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}