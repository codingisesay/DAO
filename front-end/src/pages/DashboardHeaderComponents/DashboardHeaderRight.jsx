// src/components/DashboardHeaderRight/DashboardHeaderRight.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext'; // Assuming AuthContext is needed here
import ThemeToggle from '../../components/Toggle';// Adjust path as necessary
import Google_Translater from '../../components/GoogleTranslet/Google_Translater' // Adjust path as necessary
import Help from "../DashboardHeaderComponents/Help"; // Adjust path as necessary
import Profilecard from "../DashboardHeaderComponents/ProfileCard"; // Adjust path as necessary
import NotificationDd from '../DashboardHeaderComponents/NotificationCard'; // Adjust path as necessary

const DashboardHeaderRight = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [showTranslator, setShowTranslator] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showNotification, setShowNotification] = useState(false);

    const helpRef = useRef();
    const profileRef = useRef();
    const notifyRef = useRef();

    const username = localStorage.getItem('userName');
    const userrole = localStorage.getItem('roleName');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (showHelp && helpRef.current && !helpRef.current.contains(event.target)) {
                setShowHelp(false);
            }
            if (showProfile && profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfile(false);
            }
            if (showNotification && notifyRef.current && !notifyRef.current.contains(event.target)) {
                setShowNotification(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showHelp, showProfile, showNotification]);

    return (
        // <div className="">
            <div className="flex items-center justify-between">
                <ThemeToggle />
                <div className="inline-block relative ms-2">
                    <i
                        className="mx-2 bi bi-bell"
                        onClick={() => {
                            setShowProfile(false);
                            setShowHelp(false);
                            setShowNotification(!showNotification);
                        }}
                        style={{ cursor: "pointer" }}
                    />
                    {showNotification && (
                        <div ref={notifyRef} className="dropdown-box absolute w-[240px] h-[200px] overflow-y-auto shadow-md mt-4">
                            <NotificationDd />
                        </div>
                    )}
                </div>
                {/* Help Icon */}
                <div className="inline-block relative">
                    <i
                        className="mx-2 bi bi-question-circle"
                        onClick={() => {
                            setShowHelp(!showHelp);
                            setShowProfile(false);
                            setShowNotification(false);
                        }}
                        style={{ cursor: "pointer" }}
                    />
                    {showHelp && (
                        <div ref={helpRef} className="dropdown-box rounded-lg absolute w-[200px] h-[200px] overflow-y-auto shadow-md mt-4">
                            <Help />
                        </div>
                    )}
                </div>
                <div className="inline-block relative">
                    <i
                        className="mx-2 bi bi-globe2"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowTranslator((prev) => !prev)}
                        title="Translate"
                    />
                    {showTranslator && (
                        <div
                            style={{
                                position: "absolute",
                                top: "30px",
                                right: 0,
                                zIndex: 9999,
                                background: "#fff",
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                padding: "8px",
                            }}
                        >
                            <Google_Translater key={Date.now()} />
                        </div>
                    )}
                </div>
                <i
                    className="mx-2 bi bi-box-arrow-right md:w-right"
                    onClick={handleLogout}
                ></i>

            </div>
        // </div>
    );
};

export default DashboardHeaderRight;