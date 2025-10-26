import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([
    { id: 1, name: "Amla Juice", price: 120, qty: 1 },
    { id: 2, name: "Cow Ghee", price: 600, qty: 1 },
  ]);

  const handleRemove = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handlePlaceOrder = () => {
    alert("Order placed successfully!");
    setCart([]);
    navigate("/user");
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="p-6 min-h-screen bg-green-50">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>Your cart is empty.</p>
          <button className="mt-4" onClick={() => navigate("/user")}>
            Back to Shop
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between bg-white p-4 rounded-lg shadow-md">
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p>₹{item.price}</p>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="text-right text-lg font-semibold mb-4">
            Total: ₹{total}
          </div>

          <div className="text-right">
            <button onClick={handlePlaceOrder}>Place Order</button>
          </div>
        </>
      )}
    </div>
  );
}
