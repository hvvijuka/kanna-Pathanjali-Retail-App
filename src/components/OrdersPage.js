// -----------------------------
// File: src/components/OrdersPage.js
// -----------------------------
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import * as api from "../utils/api"; // ✅ import all api functions

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

async function load() {
  try {
    alert("Hello");
    alert(`User found: ${user.username}`);
    if (!user) {
      console.log("⚪ No user found in AuthContext.");
      alert("FAILED - No user found in AuthContext");  
      setOrders([]);
      setLoading(false);
      return;
    }

    // ✅ Show an alert with user info
    alert(`User found: ${user.username || "Guest"} (ID: ${user._id || "demo"})`);

    console.log("🟢 [FRONTEND] Fetching orders for userId:", user._id || "demo");
    const res = await api.getOrdersByUser(user._id || "demo");
    console.log("🟢 [FRONTEND] Received orders:", res);

    setOrders(res || []);
  } catch (err) {
    console.error("❌ [FRONTEND] Error loading orders:", err);
    alert("Failed to load your orders.");
  } finally {
    setLoading(false);
  }
}

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        <p>No orders found. Please place an order to see it here.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      <div className="space-y-6">
        {orders.map((o) => (
          <div
            key={o._id}
            className="bg-white p-5 rounded-2xl shadow border border-gray-200"
          >
            {/* Order Header */}
            <div className="flex flex-wrap justify-between border-b pb-2 mb-3">
              <div>
                <div className="font-semibold text-gray-800">
                  Order ID: {o._id}
                </div>
                <div className="text-sm text-gray-500">
                  Date:{" "}
                  {new Date(o.createdAt || o.date).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-700">
                  ₹{o.totalAmount}
                </div>
                <div className="text-sm text-gray-500">
                  Payment: {o.paymentMethod || "COD"}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="text-sm text-gray-600 mb-3">
              <div>
                <span className="font-medium">Customer:</span>{" "}
                {o.username || "Guest User"}
              </div>
              <div>
                <span className="font-medium">Address:</span>{" "}
                {o.address || "Not provided"}
              </div>
            </div>

            {/* Items */}
            <div className="divide-y">
              {o.items.map((it, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 py-2 text-sm"
                >
                  <img
                    src={it.image}
                    alt={it.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium">{it.name}</div>
                    <div className="text-gray-500">
                      Qty: {it.qty} × ₹{it.price}
                    </div>
                  </div>
                  <div className="text-right font-semibold">
                    ₹{Number(it.qty) * Number(it.price)}
                  </div>
                </div>
              ))}
            </div>

            {/* Optional images array */}
            {o.images?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {o.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Order image ${i + 1}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="mt-3 text-xs text-gray-400">
              Order placed on:{" "}
              {new Date(o.createdAt || o.date).toLocaleDateString("en-IN")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
