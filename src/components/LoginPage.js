import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import bg from "../assets/background.jpg";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (email === "admin" && password === "admin123") {
      navigate("/admin");
    } else {
      navigate("/user");
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
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} className="w-full mb-3">
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

