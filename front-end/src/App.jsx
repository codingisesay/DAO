 






import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from "react";
import "./assets/css/theme.css";
import "./assets/css/form.css";
import './App.css'
import Login from "./pages/Login/Login";
import { useAuth } from "./auth/AuthContext";

 
import Varificationform from './pages/Varification/Enrollmentform';
import Enrollmentform from './pages/Enrollment/Enrollmentform';
import AgentDashboard from './pages/Agentpages/AgentDashboard';
import AdminDashboard from './pages/Adminpages/AdminDashboard';
import AgentRegisterForm from './pages/Adminpages/Add_Agent';
import Enrollment_PendingTable from './pages/Adminpages/Enrollment_PendingTable';
import Enrollment_ReviewTable from './pages/Adminpages/Enrollment_Review';
import Enrollment_ApprovedTable from './pages/Adminpages/Enrollment_ApprovedTable'; 
import Enrollment_Reject from './pages/Adminpages/Enrollment_Reject'; 
import Enrollment_PendingTable_Tbl from './pages/Agentpages/Enrollment_PendingTable';
import Enrollment_ReviewTable_Tbl from './pages/Agentpages/Enrollment_Review';
import Enrollment_ApprovedTable_Tbl from './pages/Agentpages/Enrollment_ApprovedTable'; 
import Enrollment_Reject_Tbl from './pages/Agentpages/Enrollment_Reject'; 
import Kyc_PendingTable from './pages/Adminpages/Kyc_PendingTable';
import Rekyc from './pages/CustomerRekyc/AccountOpeningForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DAOExtraction from './RND_DND_GetSignphoto';
import PrintApplication from './pages/Enrollment/PrintApplication';
import KycVarification from './pages/KycVarification/Enrollmentform';
import StartKyc from './pages/Enrollment/4B';  
import CreateMeeting from './pages/Enrollment/CreateMeeting';

 
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
 
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (isAuthenticated && isAuthenticated()) {
    // Check user role and redirect accordingly
    console.log("User role:", user?.roleName);
    if (user?.roleName === 'Admin') {
      return <Navigate to="/admindashboard" replace />;
    } else if (user?.roleName === 'Agent') {
      return <Navigate to="/agentdashboard" replace />;
    }
    // If authenticated but no valid role, redirect to login
    return <Navigate to="/login" replace />;
  }
  return children;
};

export const App = () => {
  const { user } = useAuth();

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />

          {/* Protected admin routes */}
          <Route path="/admindashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/add_agent" element={
            <ProtectedRoute>
              <AgentRegisterForm />
            </ProtectedRoute>
          } />
          <Route path="/enrollment_review" element={
            <ProtectedRoute>
              <Enrollment_ReviewTable />
            </ProtectedRoute>
          } />
          <Route path="/enrollment_approved" element={
            <ProtectedRoute>
              <Enrollment_ApprovedTable />
            </ProtectedRoute>
          } />
          <Route path="/enrollment_pending" element={
            <ProtectedRoute>
              <Enrollment_PendingTable />
            </ProtectedRoute>
          } />
          <Route path="/enrollment_rejected" element={
            <ProtectedRoute>
              <Enrollment_Reject />
            </ProtectedRoute>
          } />
          <Route path="/kyc_pending" element={
            <ProtectedRoute>
              <Kyc_PendingTable />
            </ProtectedRoute>
          } />
          <Route path="/verify-account/edit/:id" element={
            <ProtectedRoute>
              <Varificationform />
            </ProtectedRoute>
          } />
          <Route path="/kyc-varification/edit/:id" element={
            <ProtectedRoute>
              <KycVarification />
            </ProtectedRoute>
          } />

          {/* Protected agent routes */}
          <Route path="/agentdashboard" element={
            <ProtectedRoute>
              <AgentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/enrollmentform" element={
            <ProtectedRoute>
              <Enrollmentform />
            </ProtectedRoute>
          } />
          <Route path="/start_rekyc" element={
            <ProtectedRoute>
              <Rekyc />
            </ProtectedRoute>
          } />
          <Route path="/print-application" element={
            <ProtectedRoute>
              <PrintApplication />
            </ProtectedRoute>
          } />
          <Route path="/startVkyc" element={
            <ProtectedRoute>
              <StartKyc />
            </ProtectedRoute>
          } />
          <Route path="/enrollment_review_tbl" element={
            <ProtectedRoute>
              <Enrollment_ReviewTable_Tbl />
            </ProtectedRoute>
          } />
          <Route path="/enrollment_approved_tbl" element={
            <ProtectedRoute>
              <Enrollment_ApprovedTable_Tbl />
            </ProtectedRoute>
          } />
          <Route path="/enrollment_pending_tbl" element={
            <ProtectedRoute>
              <Enrollment_PendingTable_Tbl />
            </ProtectedRoute>
          } />
          <Route path="/enrollment_rejected_tbl" element={
            <ProtectedRoute>
              <Enrollment_Reject_Tbl />
            </ProtectedRoute>
          } />
          <Route path="/dao_extraction" element={
            <ProtectedRoute>
              <DAOExtraction />
            </ProtectedRoute>
          } />
          <Route path="/create-meeting" element={
            <ProtectedRoute>
              <CreateMeeting />
            </ProtectedRoute>
          } />

          {/* Catch-all route */}
          <Route path="*" element={
            <Navigate to={user ? "/admindashboard" : "/login"} replace /> 
          } />
        </Routes>
      </Router>
      <ToastContainer />
    </div>
  );
};

export default App;

 