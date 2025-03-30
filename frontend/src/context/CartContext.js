import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([
  ]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      console.log('Previous cart:', prevCart);
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        const updatedCart = prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        console.log('Updated cart:', updatedCart);
        return updatedCart;
      } else {
        const newCart = [...prevCart, { ...item, quantity: 1 }];
        console.log('New cart:', newCart);
        return newCart;
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateCartQuantity = (itemId, newQuantity) => {
    setCart((prevCart) => {
      console.log('Previous cart:', prevCart);
      console.log('Updating quantity for item:', itemId, 'to:', newQuantity);
  
      if (newQuantity <= 0) {
        const filteredCart = prevCart.filter((item) => item.id !== itemId);
        console.log('Filtered cart (item removed):', filteredCart);
        return filteredCart;
      }
  
      const updatedCart = prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      console.log('Updated cart:', updatedCart);
      return updatedCart;
    });
  };
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQuantity }}>
      {children}
    </CartContext.Provider>
  );
}