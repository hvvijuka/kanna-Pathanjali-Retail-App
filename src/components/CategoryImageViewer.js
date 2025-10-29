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

    const BACKEND_URL =
      process.env.REACT_APP_BACKEND_URL ||
      (window.location.hostname === "localhost"
        ? "http://localhost:5001"
        : "https://rk-backend-cxfa.onrender.com");

    const res = await fetch(`${BACKEND_URL}/api/getCloudImages`);
    if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);

    const data = await res.json();
    if (!data || data.length === 0) throw new Error("No images found!");

    const grouped = {};

    data.forEach((img) => {
      const parts = img.public_id.split("/");
      const category =
        parts.length > 1 && parts[1]
          ? parts.slice(1, -1).join("/") || parts[1]
          : "Uncategorized";

      // ✅ Parse metadata safely from context
      let price = "";
      let qty = "";
      let description = "";

      const context = img.context || {};
      const custom = context.custom || {};

      if (typeof custom === "object") {
        price = custom.price || "";
        qty = custom.qty || "";
        description = custom.description || "";
      } else if (typeof custom === "string") {
        // Sometimes Cloudinary returns a string like "price=100|qty=2|description=..." — parse it
        custom.split("|").forEach((pair) => {
          const [key, val] = pair.split("=");
          if (key === "price") price = val;
          if (key === "qty") qty = val;
          if (key === "description") description = val;
        });
      }

      if (!grouped[category]) grouped[category] = [];
      grouped[category].push({
        id: img.asset_id,
        name: parts[parts.length - 1],
        secure_url: img.secure_url,
        price,
        qty,
        description,
      });
    });

    setImagesByCategory(grouped);

    const firstCategory = Object.keys(grouped)[0];
    setExpandedCategory(firstCategory || null);

    console.log("✅ Cloud images loaded:", grouped);
  } catch (err) {
    alert("❌ " + err.message);
    console.error("Error fetching images:", err);
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
