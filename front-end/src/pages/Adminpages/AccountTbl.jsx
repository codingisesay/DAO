
import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import payvanceLogo from '../../assets/imgs/payvance_light_logo.png';
import ThemeToggle from '../../components/Toggle';
import useLocalStorage from "use-local-storage";
import AccountBarChart from './AdminDashboard_validationBarGraph';
import DemographicsBarChart from './AdminDashobard_KYCdounut';
import MonthlyAccountTrends from './AdminDashboard_MonthlyTrends';
import CommonButton from '../../components/CommonButton';
import RejectedTbl from './RejectedTbl'

function ApprovedTable() {
    const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDark, setIsDark] = useLocalStorage("isDark", preference);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleRedireact = () => {
        navigate('/add_agent'); // Change to your route
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <>

            <div data-theme={isDark ? "dark" : "light"} className="px-8 py-4 ">
                <div className='flex justify-between'>
                    <div >
                        <img src={payvanceLogo} alt="PayVance Logo" className="payvance-logo" />
                        <h2>Welcome to FinAcctz</h2>
                    </div>
                    <div className="text-right">
                        <div className='flex items-center'>
                            <ThemeToggle />
                            <i className="mx-2 bi  bi-bell"></i>
                            <i className="mx-2 bi  bi-question-circle"></i>
                            <i className="mx-2 bi  bi-globe2"></i>
                            <i className="mx-2 bi  bi-box-arrow-right md:w-right" onClick={handleLogout}></i>
                            <img height='40px' width='40px'
                                src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                                alt="profile"
                                className="rounded-full object-cover mx-2"
                            />
                            <span className='font-bold'>Agent Name <br /><small className='font-normal'> - Admin</small></span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto">
                    <div className='work-area'>
                        <RejectedTbl />
                    </div>
                </div>
            </div>

        </>);
}

export default ApprovedTable;
