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

const AdminDashboard = () => {
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
    const handleDateChange = (range) => {
        console.log("Selected Range:", range);
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
                <div className='flex justify-between'>
                    <h2 className="text-xl font-bold mb-2">Overview</h2>
                    <CommonButton className="btn-login" onClick={handleRedireact} >
                        <i className="bi bi-plus"></i>&nbsp;Add Agent
                    </CommonButton>
                </div>


                <div className="mx-auto flex flex-wrap">
                    <div className="md:w-1/2 flex  flex-wrap justify-between">
                        <div className='w-full sm:w-full p-1'>
                            <div className="dashboard-top-caard-collection flex my-1">
                                <div className="md:w-1/2">
                                    <div className="approved-card">
                                        <i className="bi bi-clipboard2-check"></i>
                                        <div className="card-text">
                                            <span className="dashboard-card-count">100+</span>
                                            <small>Approved</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-1/2">
                                    <div className="pending-card">
                                        <i className="bi bi-clipboard2-minus"></i>
                                        <div className="card-text">
                                            <span className="dashboard-card-count">200+</span>
                                            <small>Pending</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="md:w-1/2">
                                    <div className="rejected-card">
                                        <i className="bi bi-clipboard2-x"></i>
                                        <div className="card-text">
                                            <span className="dashboard-card-count">50+</span>
                                            <small>Rejected</small>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <h2 className="text-xl font-bold mb-2">Re-KYC</h2>
                        <div className='w-full sm:w-full p-1'>
                            <div className="dashboard-top-caard-collection flex my-1 flex-wrap ">
                                <Link to="/approved" className="md:w-1/3  ">
                                    <div className="approved-card">
                                        <i className="bi bi-clipboard2-check"></i>
                                        <div className="card-text">
                                            <span className="dashboard-card-count">100+</span>
                                            <small>Approved</small>
                                        </div>
                                    </div>
                                </Link>

                                <Link to="/pending" className="md:w-1/3  ">
                                    <div className="pending-card">
                                        <i className="bi bi-clipboard2-minus"></i>
                                        <div className="card-text">
                                            <span className="dashboard-card-count">200+</span>
                                            <small>Pending</small>
                                        </div>
                                    </div>
                                </Link>

                                <Link to="/rejected" className="md:w-1/3  ">
                                    <div className="rejected-card">
                                        <i className="bi bi-clipboard2-x"></i>
                                        <div className="card-text">
                                            <span className="dashboard-card-count">50+</span>
                                            <small>Rejected</small>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className='md:w-1/2 sm:w-full p-1'>
                        <div className="bg-white w-full my-2 p-4 rounded-md">
                            <h2 className="text-xl font-bold mb-0">Agent Performance</h2>
                            <div className="table-container  overflow-y-auto " style={{ maxHeight: '150px' }}>
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr>
                                            <th>Agent Name</th>
                                            <th>Total Application</th>
                                            <th>Approval Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        <tr>
                                            <td>Vaibhav Talekar</td>
                                            <td>300</td>
                                            <td>855</td>
                                        </tr>
                                        <tr>
                                            <td>Anjor Rane</td>
                                            <td>250</td>
                                            <td>75%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    <div className="md:w-1/3 sm:w-full p-1">
                        <div className="bg-white w-full my-2 p-4 rounded-md">
                            <MonthlyAccountTrends />
                        </div>
                    </div>
                    <div className='md:w-1/3 sm:w-full p-1'>
                        <div className="bg-white w-full my-2 p-4 rounded-md">
                            <AccountBarChart />
                        </div>
                    </div>
                    <div className='md:w-1/3 sm:w-full p-1'>
                        <div className="bg-white w-full my-2 p-4 rounded-md">
                            <h2 className="text-xl font-bold mb-2"> KYC Verification Status</h2>
                            <DemographicsBarChart />
                        </div>
                    </div>


                </div >



            </div >


        </>
    );
};

export default AdminDashboard;
