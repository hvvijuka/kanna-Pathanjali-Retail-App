import React, { useState } from "react";
import axios from "axios";

function CategoryImageUploader() {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const BACKEND_URL = "http://localhost:5000";

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !image || !name || !price) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("category", category);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("image", image);

      const res = await axios.post(`${BACKEND_URL}/api/uploadImage`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("Image uploaded successfully!");
        setCategory("");
        setName("");
        setPrice("");
        setDescription("");
        setImage(null);
      } else {
        alert("Failed to upload image!");
      }
    } catch (err) {
      console.error(err);
      alert("Upload error!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Upload Product Image
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Product price"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product description"
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">
            Image File
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

export default CategoryImageUploader;
