import React, { useEffect, useState } from "react";
import axios from "axios";

function CategoryImageViewer() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/getCategories`);
      setCategories(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedCategory(res.data[0]);
        fetchImages(res.data[0]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchImages = async (category) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BACKEND_URL}/api/getImages/${category}`);
      setImages(res.data || []);
    } catch (err) {
      console.error("Error fetching images:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    fetchImages(category);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        View Uploaded Images
      </h2>

      <div className="flex justify-center mb-6">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border p-2 rounded-lg"
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading images...</p>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((item) => (
            <div
              key={item._id}
              className="border rounded-xl p-3 shadow-sm hover:shadow-md transition"
            >
              <img
                src={item.secure_url}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
              <p className="text-gray-600">₹{item.price}</p>
              {item.description && (
                <p className="text-sm text-gray-500">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No images found for this category.
        </p>
      )}
    </div>
  );
}

export default CategoryImageViewer;
