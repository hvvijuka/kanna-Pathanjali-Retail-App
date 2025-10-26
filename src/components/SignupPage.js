import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    area: "",
    address: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = () => {
    alert("Signup successful!");
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
          Sign Up
        </h2>

        <input name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 mb-3 border rounded" />

        <select name="area" onChange={handleChange} className="w-full p-2 mb-3 border rounded">
          <option value="">Select Area</option>
          <option>Koramangala 1st Block</option>
          <option>Koramangala 2nd Block</option>
          <option>Koramangala 3rd Block</option>
          <option>Koramangala 4th Block</option>
        </select>

        <input name="address" placeholder="Address" onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
        <input name="phone" placeholder="Phone" onChange={handleChange} className="w-full p-2 mb-3 border rounded" />

        <button onClick={handleSignup} className="w-full">Register</button>
      </div>
    </div>
  );
}
