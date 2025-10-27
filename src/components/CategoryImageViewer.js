import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Cloudinary folder info (for reference)
const CLOUD_NAME = "dqdkd2crn";
const FOLDER = "Radha";

export default function CategoryImageViewer() {
  const navigate = useNavigate();
  const [imagesByCategory, setImagesByCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    alert("CategoryImageViewer mounted!");
    fetchImagesFromCloud();
  }, []);

  const fetchImagesFromCloud = async () => {
    try {
      setLoading(true);
      //alert("Starting fetchImagesFromCloud...");

      const res = await fetch("http://localhost:5000/api/getCloudImages");
      //alert(`Fetch response status: ${res.status}`);

      if (!res.ok) {
        //alert(`Failed to fetch images: ${res.status} ${res.statusText}`);
        setImagesByCategory({});
        return;
      }

      const data = await res.json();
      //alert(`Number of resources fetched: ${data.length}`);

      if (!data || data.length === 0) {
        //alert("No resources found in Cloudinary folder!");
        setImagesByCategory({});
        return;
      }

      // Group images by category (use the first part of public_id as category)
      const grouped = {};
      data.forEach((img) => {
        const parts = img.public_id.split("/"); // e.g., "Radha/Honey/honey1"
        const category = parts.length > 1 ? parts[1] : "Uncategorized";

        if (!grouped[category]) grouped[category] = [];
        grouped[category].push({
          id: img.public_id,
          name: parts[parts.length - 1],
          secure_url: img.secure_url,
          price: Math.floor(Math.random() * 500) + 50,
          description: "Product description here",
        });
      });

      //alert(`Categories found: ${Object.keys(grouped).join(", ")}`);
      setImagesByCategory(grouped);
      setSelectedCategory(Object.keys(grouped)[0] || "");
      //alert("Images grouped by category successfully!");
    } catch (err) {
      alert("Error fetching from Cloudinary: " + err.message);
      console.error("Error fetching from Cloudinary:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleAddToCart = (item) => {
    if (!cart.find((i) => i.id === item.id)) {
      setCart([...cart, { ...item, qty: 1 }]);
      alert(`Added to cart: ${item.name}`);
    } else {
      alert(`${item.name} already in cart!`);
    }
  };

  const handleGoToCart = () => {
    alert(`Navigating to cart with ${cart.length} items`);
    navigate("/cart", { state: { cart } });
  };

  const categories = Object.keys(imagesByCategory);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Shop Patanjali Products
      </h2>

      <div className="flex justify-between mb-4">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border p-2 rounded-lg"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          onClick={handleGoToCart}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Go to Cart ({cart.length})
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading images...</p>
      ) : selectedCategory && imagesByCategory[selectedCategory] ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imagesByCategory[selectedCategory].map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-3 shadow-sm hover:shadow-md transition"
            >
              <img
                src={item.secure_url}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-600">₹{item.price}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
              <button
                onClick={() => handleAddToCart(item)}
                className="mt-2 w-full bg-green-600 text-white py-1 rounded hover:bg-green-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No images found.</p>
      )}
    </div>
  );
}
