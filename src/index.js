import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const basename =
  process.env.NODE_ENV === "production"
    ? "/kanna-Pathanjali-Retail-App"
    : "/";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>
);