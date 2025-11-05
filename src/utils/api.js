const BACKEND_URL =
  process.env.REACT_APP_BACKEND_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:5001"
    : "https://rk-backend-cxfa.onrender.com");

// Place order API
export const placeOrder = async (payload) => {
  const res = await fetch(`${BACKEND_URL}/api/placeOrder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to place order");
  return await res.json();
};


export async function getOrdersByUser(userId) {
  const res = await fetch(`${BACKEND_URL}/api/getOrders/${userId}`);
  if (!res.ok) throw new Error("Failed to get orders");
  return res.json();
}