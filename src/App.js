import React, { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

// Lazy-loaded components
const LoginPage = lazy(() => import("./components/LoginPage"));
const SignupPage = lazy(() => import("./components/SignupPage"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));
const CategoryImageViewer = lazy(() => import("./components/CategoryImageViewer"));
const CartPage = lazy(() => import("./components/CartPage"));
const ForgotPasswordPage = lazy(() => import("./components/ForgotPasswordPage"));
const OrdersPage = lazy(() => import("./components/OrdersPage"));

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen text-xl text-gray-700">
          Loading...
        </div>
      }
    >
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/user" element={<CategoryImageViewer />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Suspense>
  );
}

export default App;
