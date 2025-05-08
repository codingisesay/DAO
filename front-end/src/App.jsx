import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from "react";
// import useLocalStorage from "use-local-storage";
// import ThemeToggle from "./components/Toggle";
import "./assets/css/theme.css";
import "./assets/css/form.css";
import './App.css'
import Login from "./pages/Login/Login";
import { useAuth } from "./auth/AuthContext"
import Dashboard from './pages/Dashboard';
import Enrollmentform from './pages/Enrollment/Enrollmentform';

export const App = () => {
  // const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  // const [isDark, setIsDark] = useLocalStorage("isDark", preference);
  const { user } = useAuth();

  return (
    <div className="App"  >
      {/* <ThemeToggle /> */}

      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/enrollmentform" element={<Enrollmentform />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;