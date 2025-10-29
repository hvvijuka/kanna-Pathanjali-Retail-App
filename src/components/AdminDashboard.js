import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CLOUD_NAME = "dqdkd2crn";
const ASSET_FOLDER = "Radha"; // main asset folder

export default function AdminDashboard() {
  const [categories, setCategories] = useState(["All"]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [items, setItems] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
  const fetchUploadedImages = async () => {
    try {
      const BACKEND_URL =
        process.env.REACT_APP_BACKEND_URL ||
        (window.location.hostname === "localhost"
          ? "http://localhost:5001"
          : "https://rk-backend-cxfa.onrender.com");

      console.log(`🧩 Using backend: ${BACKEND_URL}`);
      const res = await axios.get(`${BACKEND_URL}/api/getImages`);
      const folderImages = res.data;

      const allItems = [];
      const allCategories = new Set(["All"]);

      for (const folder in folderImages) {
        const images = folderImages[folder];

        // Extract category from folder path (e.g. "Radha/Temple" → "Temple")
        const category = folder.replace(/^Radha\//, "") || "All";

        images.forEach((img) => {
          const id = img.asset_id || Date.now();
          const name = img.original_filename || img.public_id?.split("/").pop() || "unknown";
          const imageUrl = img.secure_url || img.url || "";

          // ✅ Robust context extraction
          let price = "", qty = "", description = "";

          if (img.context) {
            const custom = img.context.custom || img.context;

            if (typeof custom === "object") {
              price = custom.price || "";
              qty = custom.qty || "";
              description = custom.description || "";
            } else if (typeof custom === "string") {
              // Sometimes returned as "price=100|qty=2|description=Test"
              custom.split("|").forEach((pair) => {
                const [k, v] = pair.split("=");
                if (k === "price") price = v;
                if (k === "qty") qty = v;
                if (k === "description") description = v;
              });
            }
          }

          allItems.push({
            id,
            name,
            image: imageUrl,
            category,
            uploaded: true,
            price,
            qty,
            description,
            file: null,
          });
        });

        allCategories.add(category);
      }

      setItems(allItems);
      setCategories([...allCategories]);
      console.log("✅ Fetched Cloudinary images:", allItems);
    } catch (err) {
      console.error("❌ Failed to fetch Cloudinary images:", err);
      alert("Error fetching images. Check console for details.");
    }
  };

  fetchUploadedImages();
}, []);

  
  // ✅ Add new category
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  // ✅ Add local image with metadata inputs
  const handleFileUploadLocal = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newItem = {
        id: Date.now(),
        name: file.name,
        price: "",
        qty: "",
        description: "",
        category: selectedCategory,
        image: reader.result,
        uploaded: false,
        file,
      };
      setItems((prev) => [...prev, newItem]);
    };
    reader.readAsDataURL(file);
  };

  // ✅ Update metadata (price, qty, desc)
  const handleChangeField = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // ✅ Delete item
  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // ✅ Logout
  const handleLogout = () => {
    navigate("/");
  };

  // ✅ Upload with metadata to Cloudinary
  const handleUploadAllSigned = async () => {
    if (items.length === 0) return alert("No images to upload!");

    const newItems = [...items];
    //const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
    const BACKEND_URL =
        process.env.REACT_APP_BACKEND_URL ||
        (window.location.hostname === "localhost"
        ? "http://localhost:5001"
        : "https://rk-backend-cxfa.onrender.com");

    const categoryMap = {};
    newItems.forEach((item, index) => {
      if (!item.uploaded && item.file) {
        const cat = item.category?.trim().replace(/\s+/g, "_") || "Uncategorized";
        if (!categoryMap[cat]) categoryMap[cat] = [];
        categoryMap[cat].push({ ...item, index });
      }
    });

    for (const cat in categoryMap) {
      const itemsInCategory = categoryMap[cat];

      for (const { file, name, price, qty, description, index } of itemsInCategory) {
        try {
          const folderPath = `${ASSET_FOLDER}/${cat}`;
          const publicId = name.replace(/\.[^/.]+$/, "");

          const contextString = `price=${price}|qty=${qty}|description=${description}`;

          const sigRes = await axios.get(
              `${BACKEND_URL}/api/signature?folder=${encodeURIComponent(folderPath)}&public_id=${encodeURIComponent(publicId)}&context=${encodeURIComponent(contextString)}`
          );
          const { signature, timestamp, apiKey, cloudName } = sigRes.data;

          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folderPath);
          formData.append("public_id", publicId);
          formData.append("api_key", apiKey);
          formData.append("timestamp", timestamp);
          formData.append("signature", signature);

          // ✅ Attach metadata using Cloudinary's "context" field
          formData.append("context", contextString);

          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData
          );

          newItems[index].image = response.data.secure_url;
          newItems[index].uploaded = true;

          console.log(`✅ Uploaded successfully: ${name} → ${folderPath}`);
        } catch (err) {
          const errorMsg = err.response?.data?.error?.message || err.message;
          console.error(`❌ Failed to upload ${name}: ${errorMsg}`);
          alert(`Failed to upload "${name}": ${errorMsg}`);
        }
      }
    }

    setItems(newItems);
    alert("✅ All images uploaded successfully!");
  };

  // ✅ Group items by category for display
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
          value={selectedCategory}
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
          onClick={handleUploadAllSigned}
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
            {groupedItems[cat]?.map((item) => (
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

                <input
                  type="text"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => handleChangeField(item.id, "price", e.target.value)}
                  className="border p-1 rounded w-full mb-2"
                />

                <input
                  type="number"
                  placeholder="Quantity"
                  value={item.qty}
                  onChange={(e) => handleChangeField(item.id, "qty", e.target.value)}
                  className="border p-1 rounded w-full mb-2"
                />

                <textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleChangeField(item.id, "description", e.target.value)}
                  className="border p-1 rounded w-full mb-2"
                />

                <p className="text-sm text-green-700 mt-1">
                  Category: {item.category}
                </p>
                {item.uploaded ? (
                  <span className="text-xs text-blue-600">Uploaded</span>
                ) : (
                  <span className="text-xs text-orange-600">Not uploaded</span>
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
