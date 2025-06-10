import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useState } from "react"; 
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
// import Customercreation from './pages/Enrollment/3B_DAOExtraction';
import PendingTable from './pages/Adminpages/PendingTable';
import ReviewTable from './pages/Adminpages/ReviewTable';
import ApprovedTable from './pages/Adminpages/ApprovedTable';
import UserTable from './muitbl';
import Rekyc from './pages/CustomerRekyc/AccountOpeningForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DAOExtraction from './RND_DND_GetSignphoto';
import PrintApplication from './pages/Enrollment/PrintApplication';


export const App = () => {
  // const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  // const [isDark, setIsDark] = useLocalStorage("isDark", preference);
  const { user } = useAuth();

  return (
    <div className="App"  >
      {/* <ThemeToggle /> */}

      <Router>
        <Routes>
          <Route path="/" element={<DAOExtraction />} />
          <Route path="/rekyc" element={<Rekyc />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/agentdashboard" element={<AgentDashboard />} />
          <Route path="/enrollmentform" element={<Enrollmentform />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/add_agent" element={<AgentRegisterForm />} />
          <Route path="/approved" element={<ApprovedTable />} />
          <Route path="/pending" element={<PendingTable />} />
          <Route path="/review" element={<ReviewTable />} />
          <Route path="/varify-account/:id" element={<Varificationform />} />
          // In your router configuration
          <Route path="/print-application" element={<PrintApplication />} />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default App;