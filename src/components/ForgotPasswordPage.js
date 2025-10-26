import React from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center min-h-screen bg-green-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-xl font-semibold text-center text-green-700 mb-4">
          Forgot Password
        </h2>
        <input placeholder="Enter your email" className="w-full p-2 mb-4 border rounded" />
        <button onClick={() => navigate("/")}>Reset Password</button>
      </div>
    </div>
  );
}
