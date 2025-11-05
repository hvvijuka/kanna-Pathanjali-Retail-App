import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage if available
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  // Login function: validates username & password via backend
  const login = async (username, password) => {
    try {
      if (!username || !password) {
        return { success: false, error: "Username and password are required" };
      }

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

      if (res.ok && data.user) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || "Invalid credentials" };
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      return { success: false, error: "Failed to login" };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
