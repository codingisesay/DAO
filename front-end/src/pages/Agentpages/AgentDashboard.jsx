import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import payvanceLogoDark from "../../assets/imgs/payvance_dark_logo.png";
import payvanceLogoLight from "../../assets/imgs/payvance_light_logo.png";
import userphoto from "../../assets/imgs/user_avatar.jpg";
import ThemeToggle from "../../components/Toggle";
import useLocalStorage from "use-local-storage";
import AccountBarChart from "./AccountBarChart";
import KYCgue from "./KYCmeter";
import DemographicsBarChart from "./DemographicsBarChart";
import KYCpendingTbl from "./KYCpendingTbl";
import DateRangePicker from "../../components/DaterangePicker";
import CommonButton from "../../components/CommonButton";
import { agentService } from "../../services/apiServices";
import Swal from "sweetalert2";
import Help from "../DashboardHeaderComponents/Help";
import Profilecard from "../DashboardHeaderComponents/ProfileCard";
import  NotificationDd from '../DashboardHeaderComponents/NotificationCard';
import EnrollmentApprovedTable from './Enrollment_ApprovedTable'
import EnrollmentPendingTable from './Enrollment_PendingTable'
import EnrollmentRejectedTable from './Enrollment_Reject'
import EnrollmentReviewTable from './Enrollment_Review'
import Footer from "../../components/Footer";
import DashboardHeaderRight from '../DashboardHeaderComponents/DashboardHeaderRight'; // Import the new component


const Dashboard = () => {
  const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDark, setIsDark] = useLocalStorage("isDark", preference);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const username = localStorage.getItem("userName");
  const userrole = localStorage.getItem("roleName");
  // Remove 'application_id' from localStorage
   
  localStorage.removeItem("application_id"); 
  localStorage.removeItem('customerPhotoData');
  localStorage.removeItem('agentPhotoData');
  localStorage.removeItem('documentData');
  localStorage.removeItem('nominationFormData');

  const [showHelp, setShowHelp] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const helpRef = useRef();
  const profileRef = useRef();
  const notifyRef = useRef();
  useEffect(() => {
    function handleClickOutside(event) {
      // Help dropdown
      if (showHelp && helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelp(false);
      }
      // Profile dropdown
      if (showProfile && profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      // Notification dropdown
      if (showNotification && notifyRef.current && !notifyRef.current.contains(event.target)) {
        setShowNotification(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHelp, showProfile, showNotification]);
  const handleRedireact = () => {
    localStorage.removeItem("application_id"); // Clear any previous application ID
    navigate("/agent_enrollmentform"); // Change to your route
  };
  const handlekyc = () => {
    navigate("/start_rekyc"); // Change to your route
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleDateChange = (range) => {
    console.log("Selected Range:", range);
  };
  function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

  return (
    <>
      <div data-theme={isDark ? "dark" : "light"} className="p-4  dark:bg-gray-700">
        <div className="flex justify-between">
          <div> 
            <img
              src={ isDark ? payvanceLogoLight :payvanceLogoDark}
              alt="PayVance Logo"
              className="payvance-logo"
            />
          </div>
          <div className="text-right flex items-center " >
          <DashboardHeaderRight /> 
            <div className="inline-block relative">
                {/* Profile Icon */}
                <div className="flex">
                    <img
                        height="40px"
                        width="40px"
                        src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                        alt="profile"
                        className="rounded-full object-cover mx-2 my-auto"
                        onClick={() => {
                            setShowProfile(!showProfile);
                            setShowHelp(false);
                            setShowNotification(false);
                        }}
                    />
                    <span className="font-bold">
                        {username}
                        <br />
                        <small className="font-normal"> {userrole} </small>
                    </span>
                </div>

           
           {showProfile && (
  <div
    ref={profileRef}
    className="dropdown-box absolute w-[240px] h-[225px] overflow-y-auto shadow-md mt-3"
    style={{ left: "-120px" }}
  >
    <Profilecard />
  </div>



           )}
            </div> 
          </div>
        </div>
        <h2 className="mb-2">Welcome to FinAcctz</h2>
        <div className="flex justify-between">
          <h2 className="text-xl font-bold mb-2">Overview</h2>

          <div>
            <CommonButton
              type="button"
              className="btn-login me-4"
              onClick={handleRedireact}
            >
              &nbsp;<i className="bi bi-pencil-square"></i>&nbsp;Start
              Enrollment&nbsp;
            </CommonButton>
            <CommonButton
              type="button"
              className="btn-login"
              onClick={handlekyc}
            >
              &nbsp;<i className="bi bi-pencil-square"></i>&nbsp;Re-KYC&nbsp;
            </CommonButton>
          </div>
        </div>

        <div className="mx-auto flex flex-wrap">
          <div className="md:w-4/6 flex  flex-wrap justify-between">
            <div className="w-full sm:w-full p-1">
              <StatusDashboard1 />
            </div>
            <div className="md:w-3/5 sm:w-full p-1">
              <div className="bg-white w-full my-2 p-4  dark:bg-gray-900 rounded-md">
                <AccountBarChart />
              </div>
            </div>
            <div className="md:w-2/5 sm:w-full p-1">
              <div className="bg-white w-full my-2 p-4  dark:bg-gray-900 rounded-md relative overflow-auto">
                <h2 className="text-xl font-bold mb-2">
                  Re-KYC Application Status
                </h2>
                <div className="pt-5 pb-10 ">
                  <KYCgue total={2000} approved={800} pending={1200} /><br />
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-2/6 sm:w-full p-1">
            <div className="bg-white w-full my-2 p-4  dark:bg-gray-900 rounded-md">
              <h2 className="text-xl font-bold mb-0">Application Insights</h2>
              <div className="text-center">
                <DateRangePicker onChange={handleDateChange} />
              </div>
 
            </div>
          </div>

          <div className="md:w-1/2 sm:w-full p-1">
            <div className="bg-white w-full my-2 p-4  dark:bg-gray-900 rounded-md">
              <h2 className="text-xl font-bold mb-2"> Demographics Report</h2>
              <DemographicsBarChart />
            </div>
          </div>
          <div className="md:w-1/2 sm:w-full p-1">
            <div className="bg-white w-full my-2 p-4  dark:bg-gray-900 rounded-md">
              <h2 className="text-xl font-bold mb-2"> V-KYC Pending Status</h2>
              <KYCpendingTbl />
            </div>
          </div>
        </div>
      </div>
        <Footer />
    </>
  );
};


function StatusDashboard1() {
  const storedId = localStorage.getItem("userCode") || 1;
  const [statusCounts, setStatusCounts] = useState({
    Pending: 0,
    Approved: 0,
    Rejected: 0,
    Review: 0,
  });

  // State for each modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);

  useEffect(() => {
    fetchDetails();
  }, [storedId]);
    const fetchDetails = async () => {
      try {
        const response = await agentService.applicationcountbyagent(storedId);
        if (response && response.data) {
          const counts = response.data.reduce((acc, item) => {
            acc[item.status] = (acc[item.status] || 0) + 1;
            return acc;
          }, {});

          setStatusCounts({
            Pending: counts.Pending || 0,
            Approved: counts.Approved || 0,
            Rejected: counts.Rejected || 0,
            Review: counts.Review || 0,
          });
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error?.response?.data?.message,
        });
      }
    };

  return (
    <div className="dashboard-top-caard-collection flex my-1">
      {/* Review Card */}
      <div onClick={() => setIsReviewModalOpen(true)} className="md:w-1/4 cursor-pointer">
        <div className="recent-applyed-card">
          <i className="bi bi-clipboard2-x"></i>
          <div className="card-text">
            <span className="dashboard-card-count">{statusCounts.Review}</span>
            <small>Review</small>
          </div>
        </div>
      </div>

      {/* Approved Card */}
      <div onClick={() => setIsApprovedModalOpen(true)} className="md:w-1/4 cursor-pointer">
        <div className="approved-card">
          <i className="bi bi-clipboard2-check"></i>
          <div className="card-text">
            <span className="dashboard-card-count">{statusCounts.Approved}</span>
            <small>Approved</small>
          </div>
        </div>
      </div>

      {/* Pending Card */}
      <div onClick={() => setIsPendingModalOpen(true)} className="md:w-1/4 cursor-pointer">
        <div className="pending-card">
          <i className="bi bi-clipboard2-minus"></i>
          <div className="card-text">
            <span className="dashboard-card-count">{statusCounts.Pending}</span>
            <small>Pending</small>
          </div>
        </div>
      </div>

      {/* Rejected Card */}
      <div onClick={() => setIsRejectedModalOpen(true)} className="md:w-1/4 cursor-pointer">
        <div className="rejected-card">
          <i className="bi bi-clipboard2-x"></i>
          <div className="card-text">
            <span className="dashboard-card-count">{statusCounts.Rejected}</span>
            <small>Rejected</small>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1 className='flex justify-between'>
              <span>Review Applications</span>
              <button onClick={() => setIsReviewModalOpen(false)}>X</button>
            </h1>
            <EnrollmentReviewTable agentId={storedId} />
          </div>
        </div>
      )}

      {/* Approved Modal */}
      {isApprovedModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1 className='flex justify-between'>
              <span>Approved Applications</span>
              <button onClick={() => setIsApprovedModalOpen(false)}>X</button>
            </h1>
            <EnrollmentApprovedTable agentId={storedId} />
          </div>
        </div>
      )}

      {/* Pending Modal */}
      {isPendingModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1 className='flex justify-between'>
              <span>Pending Applications</span>
              <button onClick={() => setIsPendingModalOpen(false)}>X</button>
            </h1>
            <EnrollmentPendingTable agentId={storedId} />
          </div>
        </div>
      )}

      {/* Rejected Modal */}
      {isRejectedModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1 className='flex justify-between'>
              <span>Rejected Applications</span>
              <button onClick={() => setIsRejectedModalOpen(false)}>X</button>
            </h1>
            <EnrollmentRejectedTable agentId={storedId} />
          </div>
        </div>
      )}
    </div>
  );
}

 
const LanguageSwitcher = () => {
  const handleTranslateClick = () => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      const currentLang = select.value;
      // Toggle between English and Spanish as an example
      select.value = currentLang === "hi" ? "en" : "hi";
      select.dispatchEvent(new Event("change"));
    }
  };

  return (
    <i
      className="mx-2 bi bi-globe2"
      style={{ cursor: "pointer" }}
      onClick={handleTranslateClick}
      title="Translate"
    />
  );
}; 

export default Dashboard;
