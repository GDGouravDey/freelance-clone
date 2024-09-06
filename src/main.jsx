import React from "react";
import ReactDOM from "react-dom/client";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

import App from "./App.jsx";
import Choose from "./components/Choose.jsx";
import LoginPage from "./components/LoginPage.jsx";
import Freelancer from "./components/Freelancer.jsx";
import Resume from "./components/Resume.jsx";
import "./index.css";
import Findprojects from "./components/Findprojects.jsx";
import Myprojects from "./components/Myprojects.jsx";
import MyProjects2 from "./components/MyProjects2.jsx";
import Employer from "./components/Employer.jsx";
import FindFreelancers from "./components/FindFreelancers.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/choose" element={<Choose />} />
        <Route path="/sign-in" element={<LoginPage />} />
        <Route path="/employer/profile" element={<Employer />} />
        <Route path="/employer/findFreelancers" element={<FindFreelancers />} />
        <Route path="/employer/myProjects" element={<MyProjects2 />} /> 
        <Route path="/freelancer/profile" element={<Freelancer />} />
        <Route path="/freelancer/resume" element={<Resume />} />
        <Route path="/freelancer/findProjects" element={<Findprojects />} />
        <Route path="/freelancer/myProjects" element={<Myprojects />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
