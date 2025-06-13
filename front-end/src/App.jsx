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
import Enrollment_PendingTable from './pages/Adminpages/Enrollment_PendingTable';
import Kyc_PendingTable from './pages/Adminpages/Kyc_PendingTable';
import Enrollment_ReviewTable from './pages/Adminpages/Enrollment_Review';
import Enrollment_ApprovedTable from './pages/Adminpages/Enrollment_ApprovedTable'; 
import Rekyc from './pages/CustomerRekyc/AccountOpeningForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DAOExtraction from './RND_DND_GetSignphoto';
import PrintApplication from './pages/Enrollment/PrintApplication';
import KycVarification from './pages/KycVarification/Enrollmentform';
import StartKyc from './pages/Enrollment/4B';  
import CreateMeeting from './pages/Enrollment/CreateMeeting';
// import VideoKYC from './pages/VideoKYC';


export const App = () => {
  // const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  // const [isDark, setIsDark] = useLocalStorage("isDark", preference);
  const { user } = useAuth();

  return (
    <div className="App"  >
      {/* <ThemeToggle /> */}

      <Router>
        <Routes>
          <Route path="/create-meeting" element={<CreateMeeting />} />
          <Route path="/" element={<DAOExtraction />} />
          <Route path="/rekyc" element={<Rekyc />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/agentdashboard" element={<AgentDashboard />} />
          <Route path="/enrollmentform" element={<Enrollmentform />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/add_agent" element={<AgentRegisterForm />} />
          <Route path="/enrollment_approved" element={<Enrollment_ApprovedTable />} />
          <Route path="/enrollment_pending" element={<Enrollment_PendingTable />} />
          <Route path="/kyc_pending" element={<Kyc_PendingTable />} />
          <Route path="/nrollment__review" element={<Enrollment_ReviewTable />} />
          <Route path="/varify-account/:id" element={<Varificationform />} />
          // In your router configuration
          <Route path="/print-application" element={<PrintApplication />} />
          <Route path="/kyc-varification/edit/:id" element={<KycVarification />} /> 
          <Route path="/startCkyc" element={<StartKyc />} /> 
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default App;