import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage"; // <-- import SignupPage
import AdminDashboard from "./components/AdminDashboard";
import CategoryImageViewer from "./components/CategoryImageViewer";
import CartPage from "./components/CartPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />  {/* <-- add this */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<CategoryImageViewer />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;