import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from "react";
// import useLocalStorage from "use-local-storage";
// import ThemeToggle from "./components/Toggle";
import "./assets/css/theme.css";
import "./assets/css/form.css";
import './App.css'
import Login from "./pages/Login/Login";
import { useAuth } from "./auth/AuthContext"
import Varificationform from './pages/Varification/Enrollmentform';
import Enrollmentform from './pages/Enrollment/Enrollmentform';
import AgentDashboard from './pages/Agentpages/AgentDashboard';
import AdminDashboard from './pages/Adminpages/AdminDashboard';
import AgentRegisterForm from './pages/Adminpages/Add_Agent';
import AccountTbl from './pages/Adminpages/ApproveTbl';
import Customercreation from './pages/Enrollment/3B_DAOExtraction';
import Rekyc from './pages/CustomerRekyc/AccountOpeningForm';
export const App = () => {
  // const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  // const [isDark, setIsDark] = useLocalStorage("isDark", preference);
  const { user } = useAuth();

  return (
    <div className="App"  >
      {/* <ThemeToggle /> */}

      <Router>
        <Routes>
          <Route path="/" element={<Customercreation />} />
          <Route path="/rekyc" element={<Rekyc />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/agentdashboard" element={<AgentDashboard />} />
          <Route path="/enrollmentform" element={<Enrollmentform />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/add_agent" element={<AgentRegisterForm />} />
          <Route path="/approved" element={<AccountTbl />} />
          <Route path="/pending" element={<AccountTbl />} />
          <Route path="/rejected" element={<AccountTbl />} />
          <Route path="/varify-account/01" element={<Varificationform />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;