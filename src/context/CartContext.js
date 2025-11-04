
// -----------------------------
// File: src/context/CartContext.js
// -----------------------------
import React, { createContext, useContext, useState } from 'react';
const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }){
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('pr_cart')) || []; } catch(e){ return [] }
  });

  const save = (c) => { setCart(c); sessionStorage.setItem('pr_cart', JSON.stringify(c)); };
  const add = (item) => {
    const exists = cart.find(i => i.id === item.id);
    if(!exists) save([...cart, {...item, qty:1}]);
  };
  const updateQty = (id, qty) => save(cart.map(i=> i.id===id?{...i, qty}:i));
  const remove = (id) => save(cart.filter(i=> i.id!==id));
  const clear = () => save([]);

  return (
    <CartContext.Provider value={{ cart, add, updateQty, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}