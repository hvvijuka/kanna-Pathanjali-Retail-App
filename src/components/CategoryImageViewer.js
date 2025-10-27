import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Cloudinary config
const CLOUD_NAME = "dqdkd2crn";
const FOLDER = "Radha"; // your folder name
const API_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${FOLDER}.json`;

export default function CategoryImageViewer() {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    alert("CategoryImageViewer mounted!"); // debug alert
    fetchImagesFromCloud();
  }, []);

  const fetchImagesFromCloud = async () => {
  try {
    alert("Starting fetchImagesFromCloud..."); // Debug alert
    setLoading(true);

    // Call your backend route
    const res = await fetch("http://localhost:5000/api/getCloudImages");
    alert(`Fetch response status: ${res.status}`); // Debug alert

    if (!res.ok) {
      alert(`Failed to fetch images: ${res.status} ${res.statusText}`);
      setImages([]);
      return;
    }

    const data = await res.json();
    alert(`Number of resources fetched: ${data.length}`); // Debug alert

    if (!data || data.length === 0) {
      alert("No resources found in Cloudinary folder!"); // Debug alert
      setImages([]);
      return;
    }

    const cloudImages = data.map((img, index) => ({
      id: img.public_id,
      name: img.public_id.split("/").pop(),
      secure_url: img.secure_url,
      price: Math.floor(Math.random() * 500) + 50, // demo price
      description: "Product description here",
    }));

    // Debug: show names of all images fetched
    let imageNames = cloudImages.map((img) => img.name).join(", ");
    alert(`Fetched image names: ${imageNames}`);

    setImages(cloudImages);
    alert("Images successfully set in state!"); // Debug alert
  } catch (err) {
    alert("Error fetching from Cloudinary: " + err.message); // Debug alert
    console.error("Error fetching from Cloudinary:", err);
  } finally {
    setLoading(false);
  }
};
  const handleAddToCart = (item) => {
    if (!cart.find((i) => i.id === item.id)) {
      setCart([...cart, { ...item, qty: 1 }]);
      alert(`Added to cart: ${item.name}`); // debug alert
    } else {
      alert(`${item.name} already in cart!`); // debug alert
    }
  };

  const handleGoToCart = () => {
    alert(`Navigating to cart with ${cart.length} items`); // debug alert
    navigate("/cart", { state: { cart } });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Shop Patanjali Products
      </h2>

      <div className="text-right mb-4">
        <button
          onClick={handleGoToCart}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Go to Cart ({cart.length})
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading images...</p>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((item) => (
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
