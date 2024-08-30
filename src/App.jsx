import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Choose from "./components/Choose";
import Hero from "./components/Hero";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/choose" element={<Choose />} />
        <Route path="/sign-in" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
