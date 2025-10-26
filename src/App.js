import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import CategoryImageUploader from "./components/CategoryImageUploader";
import CategoryImageViewer from "./components/CategoryImageViewer";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/upload" element={<CategoryImageUploader />} />
        <Route path="/view" element={<CategoryImageViewer />} />
      </Routes>
    </Router>
  );
}