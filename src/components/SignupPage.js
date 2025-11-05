import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // your AuthContext

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth(); // to store user globally

  const [form, setForm] = useState({
    name: "",
    area: "",
    address: "",
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    if (!form.username || !form.password) {
      alert("Please enter username and password!");
      return;
    }

    try {
      const BACKEND_URL =
    process.env.REACT_APP_BACKEND_URL ||
    (window.location.hostname === "localhost"
      ? "http://localhost:5001"
      : "https://rk-backend-cxfa.onrender.com");

      const res = await fetch(`${BACKEND_URL}/api/signup`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(form),
                        });
   
      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert(`Signup successful! Welcome, ${data.user.username}`);
        login(data.user); // save in AuthContext + localStorage
        navigate("/user"); // redirect to user page/dashboard
      }
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Something went wrong while signing up!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-700">
          Sign Up
        </h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

        <select
          name="area"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        >
          <option value="">Select Area</option>
          <option>Koramangala 1st Block</option>
          <option>Koramangala 2nd Block</option>
          <option>Koramangala 3rd Block</option>
          <option>Koramangala 4th Block</option>
        </select>

        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Register
        </button>
      </div>
    </div>
  );
}
