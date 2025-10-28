import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CategoryImageViewer() {
  const navigate = useNavigate();
  const [imagesByCategory, setImagesByCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    fetchImagesFromCloud();
  }, []);

  const fetchImagesFromCloud = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5001/api/getCloudImages");

      if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);
      const data = await res.json();
      if (!data || data.length === 0) throw new Error("No images found!");

      // ✅ Group by subfolder
      const grouped = {};
      data.forEach((img) => {
        const parts = img.public_id.split("/");
        const category =
          parts.length > 1 && parts[1]
            ? parts.slice(1, -1).join("/") || parts[1]
            : "Uncategorized";

        if (!grouped[category]) grouped[category] = [];
        grouped[category].push({
          id: img.asset_id,
          name: parts[parts.length - 1],
          secure_url: img.secure_url,
          price: Math.floor(Math.random() * 500) + 50,
          description: "Patanjali product",
        });
      });

      setImagesByCategory(grouped);
      const firstCategory = Object.keys(grouped)[0];
      setExpandedCategory(firstCategory || null);
    } catch (err) {
      alert("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    if (!cart.find((i) => i.id === item.id)) {
      setCart([...cart, { ...item, qty: 1 }]);
      alert(`✅ Added to cart: ${item.name}`);
    } else {
      alert(`${item.name} is already in cart!`);
    }
  };

  const handleGoToCart = () => {
    navigate("/cart", { state: { cart } });
  };

  const handleLogout = () => {
    alert("👋 Logged out successfully!");
    navigate("/");
  };

  const handleToggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const categories = Object.keys(imagesByCategory);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          🛍️ Patanjali Product Gallery
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleGoToCart}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Go to Cart ({cart.length})
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading images...</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-500">No images found.</p>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category} className="border rounded-lg shadow-sm bg-white">
              {/* Category Header */}
              <div
                className="flex justify-between items-center p-4 bg-green-100 cursor-pointer rounded-t-lg"
                onClick={() => handleToggleCategory(category)}
              >
                <h3 className="font-semibold text-lg text-gray-800">
                  {category}
                </h3>
                <span className="text-gray-600">
                  {expandedCategory === category ? "▲" : "▼"}
                </span>
              </div>

              {/* Category Content */}
              {expandedCategory === category && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
                  {imagesByCategory[category].map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-xl p-3 shadow-sm hover:shadow-md transition bg-white"
                    >
                      <img
                        src={item.secure_url}
                        alt={item.name}
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                      <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      <p className="text-gray-600">₹{item.price}</p>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.description}
                      </p>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full bg-green-600 text-white py-1.5 rounded hover:bg-green-700"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
