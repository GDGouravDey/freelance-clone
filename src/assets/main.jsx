import React from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import App from "./App.jsx";
import Choose from "./components/Choose.jsx";
import LoginPage from "./components/LoginPage.jsx";
import './index.css'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/choose" element={<Choose />} />
        <Route path="/sign-in" element={<LoginPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
