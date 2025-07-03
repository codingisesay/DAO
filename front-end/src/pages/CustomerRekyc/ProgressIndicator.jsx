import "./style.css"; import React, { useState } from 'react';
import payvanceLogo from '../../assets/imgs/payvance_dark_logo.png';
import ThemeToggle from '../../components/Toggle';
import { useAuth } from '../../auth/AuthContext';
import useLocalStorage from "use-local-storage";
import { useNavigate } from 'react-router-dom';


const ProgressIndicator = ({ progress, subProgress, currentStep }) => {
     const navigate = useNavigate(); const { logout } = useAuth();
     
    const username= localStorage.getItem('userName');
    const userrole =localStorage.getItem('roleName');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <div className='stepper-container max-w-md mx-auto p-5 relative'>
      <img src={payvanceLogo} alt="PayVance Logo" className="payvance-logo mx-auto" />

      <ul className='max-w-md mx-auto my-3'  onClick={() => navigate(-1)}>
        <li className="">
          <i className="bi bi-columns-gap"></i> &nbsp;
          Back To Dashboard
        </li>
      </ul>
      <hr className="h-px my-2 bg-gray-400 border-0 dark:bg-gray-700" />
      {/* <p className='my-3'> Account Opening</p> */}

      <div className="sidebar-stepper-container">
        <div className="vertical-stepper">
          {[1, 2, 3, 4,].map((step) => (
            <div
              key={step}
              className={`stepper-item ${currentStep === step ? "active" : ""
                } ${progress[step] === "completed" ||
                  progress[step] === "skipped" ? "completed" : ""
                }`}
            >
              <div className="stepper-number">
                {progress[step] === "completed" || progress[step] === "skipped" ? (
                  ""
                ) : (
                  <span>{step}</span>
                )}
              </div>
              <div className="ms-2">
                <div className="stepper-title">
                  {step === 1 && "Enrollment Details"}
                  {step === 2 && "Customer Application"}
                  {step === 3 && "Document Details"}
                  {step === 4 && "Video KYC"}
                </div>
                <div className={`stepper-status text-xs ${progress[step] === "completed" ? "completed" :
                  progress[step] === "inprogress" ? "inprogress" :
                    progress[step] === "skipped" ? "skipped" : "pending"
                  }`}>
                  {progress[step] === "completed" ? "Completed" :
                    progress[step] === "inprogress" ? "In Progress" :
                      progress[step] === "skipped" ? "Skipped" : "Pending"}
                </div>
              </div>

              {/* Sub-steps for step 2 */}

            </div>
          ))}
        </div>
      </div>

      <div className="stepper-footer">
        <div className="flex bg-green-100 p-2 rounded-md items-center dark:bg-gray-800   ">
          <img height='40px' width='40px'
            src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
            alt="profile"
            className="rounded-full object-cover mx-2"
          />
          <span className='font-bold'>{username} <br /><small className='font-normal'> {userrole}</small></span>
        </div>
        <div className="flex items-center justify-between footer-icon-collection">
          <ThemeToggle />
          <i className="mx-2 bi  bi-bell"></i>
          <i className="mx-2 bi  bi-question-circle"></i>
          <i className="mx-2 bi  bi-globe2"></i>
          <i className="mx-2 bi  bi-box-arrow-right" onClick={handleLogout}></i>
        </div>
      </div>
    </div >
  );
};

export default ProgressIndicator;