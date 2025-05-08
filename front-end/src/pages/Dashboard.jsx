import React from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../assets/css/login.css';
import payvanceLogo from '../assets/imgs/payvance_light_logo.png';
import ThemeToggle from '../components/Toggle';
import useLocalStorage from "use-local-storage";

const Dashboard = () => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDark, setIsDark] = useLocalStorage("isDark", preference);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleRedireact = () => {
        navigate('/enrollmentform'); // Change to your route
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
                    <div>
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
                            <span className='font-bold'>Agent Name <br /><small className='font-normal'> - Agent</small></span>
                        </div>
                        <button className='btn-login ' onClick={handleRedireact}>Start Enrollment</button>
                    </div>

                </div>



                <div className="mx-auto flex flex-wrap">
                    <div className='md:w-3/5 sm:full p-1'>
                        overview
                        <div className=" flex">
                            <div className="md:w-1/4">
                                <div className="bg-lime-500 m-2 p-2 rounded-md">1</div></div>
                            <div className="md:w-1/4">
                                <div className="bg-orange-500 m-2 p-2 rounded-md">1</div></div>
                            <div className="md:w-1/4">
                                <div className="bg-red-500 m-2 p-2 rounded-md">1</div></div>
                            <div className="md:w-1/4">
                                <div className="bg-teal-500 m-2 p-2 rounded-md">1</div></div>
                        </div>
                    </div>
                    <div className='md:w-2/5 sm:full p-1'>
                        Missing Documents
                        <div className="bg-white w-full my-2 p-2 rounded-md">Pie Chart</div>
                    </div>
                    <div className='md:w-1/3 sm:full p-1'>
                        Performance Metrics
                        <div className="bg-white w-full my-2 p-2 rounded-md">Bar Graph</div>
                    </div>
                    <div className='md:w-1/3 sm:full p-1'>
                        KYC Application Status
                        <div className="bg-white w-full my-2 p-2 rounded-md">Meter Graph</div>
                    </div>
                    <div className='md:w-1/3 sm:full p-1'>
                        Application Insights
                        <div className="bg-white w-full my-2 p-2 rounded-md">CAlender</div>
                    </div>
                    <div className='md:w-1/3 sm:full p-1'>
                        Demographics Report
                        <div className="bg-white w-full my-2 p-2 rounded-md">Pie Chart</div>
                    </div>
                </div>




            </div>


        </>
    );
};

export default Dashboard;
