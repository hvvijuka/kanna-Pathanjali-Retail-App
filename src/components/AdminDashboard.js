import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CLOUD_NAME = "dqdkd2crn";
const UPLOAD_PRESET = "radha-kanna-retail-app";

export default function AdminDashboard() {
  const [categories, setCategories] = useState(["All"]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  // ------------------------
  // Fetch previously uploaded images on mount
  // ------------------------
  useEffect(() => {
    const fetchUploadedImages = async () => {
      try {
        const res = await axios.get("/api/getImages"); // Replace with your backend endpoint
        const uploadedItems = res.data.map((item) => ({
          ...item,
          uploaded: true,
          file: null, // no local file for previously uploaded images
        }));

        setItems(uploadedItems);

        // Merge categories from fetched images
        const fetchedCategories = [
          ...new Set(uploadedItems.map((i) => i.category)),
        ];
        setCategories((prev) => Array.from(new Set([...prev, ...fetchedCategories])));
      } catch (err) {
        console.error("Failed to fetch uploaded images:", err);
      }
    };

    fetchUploadedImages();
  }, []);

  // ------------------------
  // Add new category
  // ------------------------
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  // ------------------------
  // Add local image
  // ------------------------
  const handleFileUploadLocal = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newItem = {
        id: Date.now(),
        name: file.name,
        price: "₹100",
        qty: 1,
        category: selectedCategory,
        image: reader.result,
        uploaded: false,
        file,
      };
      setItems((prev) => [...prev, newItem]);
    };
    reader.readAsDataURL(file);
  };

  // ------------------------
  // Delete item
  // ------------------------
  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // ------------------------
  // Logout
  // ------------------------
  const handleLogout = () => {
    navigate("/");
  };

  // ------------------------
  // Upload all local images to Cloudinary
  // ------------------------
  const handleUploadAll = async () => {
  if (items.length === 0) {
    alert("No images to upload!");
    return;
  }

  const newItems = [...items];

  for (let i = 0; i < newItems.length; i++) {
    const item = newItems[i];

    if (!item.uploaded && item.file) {
      try {
        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("upload_preset", UPLOAD_PRESET); // must be UNSIGNED

        console.log("Uploading:", item.name);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData
        );

        // Update item with Cloudinary URL
        item.image = response.data.secure_url;
        item.uploaded = true;
        newItems[i] = item;

        console.log("Uploaded successfully:", item.name);
      } catch (err) {
        const errorMsg = err.response?.data?.error?.message || err.message;
        console.error("Upload failed:", errorMsg);
        alert(`Failed to upload "${item.name}": ${errorMsg}`);
      }
    }
  }

  setItems(newItems);
  alert("All images processed!");
};
  
  // ------------------------
  // Group items by category
  // ------------------------
  const groupedItems = categories.reduce((acc, cat) => {
    acc[cat] = items.filter((item) => item.category === cat);
    return acc;
  }, {});

  return (
    <div className="p-8 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Category Management */}
      <div className="flex gap-2 mb-4">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category"
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleAddCategory}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Category
        </button>
      </div>

      {/* File Upload */}
      <div className="flex gap-2 mb-6">
        <select
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileUploadLocal}
          className="border p-2 rounded"
        />
      </div>

      {/* Upload All Button */}
      {items.some((item) => !item.uploaded) && (
        <button
          onClick={handleUploadAll}
          className="mb-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Upload All to Cloudinary
        </button>
      )}

      {/* Display items grouped by category */}
      {categories.map((cat) => (
        <div key={cat} className="mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-3">{cat}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {groupedItems[cat].map((item) => (
              <div
                key={item.id}
                className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded mb-3"
                  />
                )}
                <p className="font-bold text-lg">{item.name}</p>
                <p className="text-gray-600">{item.price}</p>
                <p className="text-gray-500">Qty: {item.qty}</p>
                <p className="text-sm text-green-700 mt-1">
                  Category: {item.category}
                </p>
                {!item.uploaded && (
                  <span className="text-xs text-orange-600">Not uploaded</span>
                )}
                {item.uploaded && (
                  <span className="text-xs text-blue-600">Uploaded</span>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
