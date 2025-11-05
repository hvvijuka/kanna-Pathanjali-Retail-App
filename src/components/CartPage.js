
// -----------------------------
// File: src/components/CartPage.js
// -----------------------------
import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
// import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import * as api from "../utils/api";

export default function CartPage(){
  const { cart, updateQty, remove, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = cart.reduce((s,i)=> s + (Number(i.price||0) * Number(i.qty||1)), 0);

const placeOrder = async () => {
  if (cart.length === 0) return alert("Cart empty");

  // Prepare image URLs from cart
  const imageUrls = cart.map(item => item.secure_url || item.image || "");

  // Compute total cost
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 1),
    0
  );

  // Prepare payload
  const payload = {
    userId: user?._id || "demo",
    username: user?.username || "Guest User",
    address: user?.address || "Not provided",
    items: cart.map(item => ({
      id: item.id,
      name: item.name,
      qty: item.qty,
      price: item.price,
      image: item.secure_url || item.image || "",
    })),
    totalAmount: total,
    paymentMethod: "COD",
    cashCollected: 0,
    images: imageUrls, // all image URLs in one array
  };

  try {
    alert("calling backend: ");
    const res = await api.placeOrder(payload);
    alert("Order placed successfully! ID: " + res._id);

    // clear cart
    clear();
    navigate("/orders");
  } catch (err) {
    console.error("Error placing order:", err);
    alert("Failed to place order. Please try again.");
  }
};


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.length===0 ? <p>No items in cart</p> : (
        <div className="bg-white p-4 rounded shadow">
          {cart.map(i=> (
            <div key={i.id} className="flex items-center gap-4 border-b py-3">
              <img src={i.secure_url || i.image} alt={i.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <div className="font-semibold">{i.name}</div>
                <div className="text-sm">₹{i.price}</div>
              </div>
              <div>
                <input type="number" value={i.qty} onChange={(e)=> updateQty(i.id, Number(e.target.value||1))} className="w-20 border p-1 rounded" />
              </div>
              <div className="w-24">₹{Number(i.price||0) * Number(i.qty||1)}</div>
              <button onClick={()=> remove(i.id)} className="text-red-500">Remove</button>
            </div>
          ))}

          <div className="flex justify-between items-center mt-4">
            <div className="font-bold">Total: ₹{total}</div>
            <div className="flex gap-2">
              <button onClick={()=> navigate('/user')} className="px-3 py-1 border rounded">Continue</button>
              <button onClick={placeOrder} className="px-3 py-1 bg-green-600 text-white rounded">Place Order (COD)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
