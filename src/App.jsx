import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Choose from "./components/Choose";
import Hero from "./components/Hero";
import Auth from "./components/Auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/choose" element={<Choose />} />
        <Route path="/sign-in" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
