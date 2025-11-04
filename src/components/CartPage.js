
// -----------------------------
// File: src/components/CartPage.js
// -----------------------------
import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
// import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function CartPage(){
  const { cart, updateQty, remove, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const total = cart.reduce((s,i)=> s + (Number(i.price||0) * Number(i.qty||1)), 0);

  const placeOrder = async () => {
    if(!user) return alert('Please login (demo: set user in session)');
    if(cart.length===0) return alert('Cart empty');
    const payload = { userId: user._id||'demo', username: user.username||'demo', items: cart, totalAmount: total, paymentMethod: 'COD', cashCollected: 0 };
    try{
      const res = await api.placeOrder(payload);
      alert('Order placed: ' + res._id);
      // clear cart
      clear();
      navigate('/orders');
    }catch(err){ console.error(err); alert('Failed to place order'); }
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
              <button onClick={()=> navigate('/shop')} className="px-3 py-1 border rounded">Continue</button>
              <button onClick={placeOrder} className="px-3 py-1 bg-green-600 text-white rounded">Place Order (COD)</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
