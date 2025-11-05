import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bg from "../assets/background.jpg";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // store user globally

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter username and password!");
      return;
    }

    try {
      const BACKEND_URL =
      process.env.REACT_APP_BACKEND_URL ||
      (window.location.hostname === "localhost"
        ? "http://localhost:5001"
        : "https://rk-backend-cxfa.onrender.com");

    const res = await fetch(`${BACKEND_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        alert("Login successful!");
        login(data.user); // save in AuthContext + localStorage

        // Redirect admin differently if needed
        if (data.user.username === "admin") {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      alert("Something went wrong while logging in!");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-green-700">
          Patanjali - Koramangala
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} className="w-full mb-3 bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Login
        </button>

        <div className="text-sm text-center">
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>{" "}
          |{" "}
          <Link to="/forgot" className="text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
}
