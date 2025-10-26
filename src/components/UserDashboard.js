import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();

  const [categories] = useState(["All", "Health", "Food", "Ayurveda"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);

  // Example static items
  const allItems = [
    { id: 1, name: "Amla Juice", price: 120, category: "Health", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Chyawanprash", price: 250, category: "Ayurveda", image: "https://via.placeholder.com/150" },
    { id: 3, name: "Cow Ghee", price: 600, category: "Food", image: "https://via.placeholder.com/150" },
  ];

  const filteredItems =
    selectedCategory === "All"
      ? allItems
      : allItems.filter((item) => item.category === selectedCategory);

  const handleAddToCart = (item) => {
    if (cart.find((c) => c.id === item.id)) {
      alert("Item already in cart");
      return;
    }
    setCart([...cart, item]);
    alert(`${item.name} added to cart`);
  };

  return (
    <div className="p-6 min-h-screen bg-green-50">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Welcome to Patanjali Koramangala</h1>

      <div className="flex justify-between items-center mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <button onClick={() => navigate("/cart")}>🛒 View Cart ({cart.length})</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
            <img src={item.image} alt={item.name} className="w-32 h-32 object-cover mb-3" />
            <h2 className="font-semibold text-lg">{item.name}</h2>
            <p className="text-green-700 font-medium mb-2">₹{item.price}</p>
            <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}
