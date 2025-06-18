import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import payvanceLogo from '../../assets/imgs/payvance_dark_logo.png';
import userphoto from '../../assets/imgs/user_avatar.jpg';
import ThemeToggle from '../../components/Toggle';
import useLocalStorage from "use-local-storage";
import AccountBarChart from './AdminDashboardMonthlyBarChart';
import DemographicsBarChart from './AdminDashobardKycDoughnutChart';
import MonthlyAccountTrends from './AdminDashboardLineChart';
import CommonButton from '../../components/CommonButton';
import { accountsStatusListService } from '../../services/apiServices';
import { kycaccountsStatusListService } from '../../services/apiServices';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDark, setIsDark] = useLocalStorage("isDark", preference);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const username= localStorage.getItem('userName');
    const userrole =localStorage.getItem('roleName');
    
    const handleRedireact = () => {
        navigate('/add_agent'); // Change to your route
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
    };


    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await accountsStatusListService.getList();
                if (response) {
                    console.log(response)
                }
            } catch (error) {
                console.log(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error?.response?.data?.message
                });
            }
        };
        fetchDetails();
    }, []);




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
                                src={userphoto}
                                alt="profile"
                                className="rounded-full object-cover mx-2"
                            />
                           
                            <span className='font-bold'> {username}<br /><small className='font-normal'> - {userrole}</small></span>
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
                            <StatusDashboard1 /> 
                        </div>
                        <h2 className="text-xl font-bold mb-2">Re-KYC</h2>
                        <div className='w-full sm:w-full p-1'> 
                            <StatusDashboard2 /> 
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





function StatusDashboard1() {
    const [statusCounts, setStatusCounts] = useState({
        Pending: 0,
        Approved: 0,
        Reject: 0,
        Review: 0
    });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await accountsStatusListService.getList();
                // console.log(response)
                if (response && response.data) {
                    // Count the statuses
                    const counts = response.data.reduce((acc, item) => {
                        acc[item.status] = (acc[item.status] || 0) + 1;
                        return acc;
                    }, {});

                    setStatusCounts({
                        Pending: counts.Pending || 0,
                        Approved: counts.Approved || 0,
                        Reject: counts.Reject || 0,
                        Review: counts.Review || 0
                    });
                }
            } catch (error) {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error?.response?.data?.message
                });
            }
        };
        fetchDetails();
    }, []);

    return (
        <div className="dashboard-top-caard-collection flex my-1">
            <Link to="/enrollment_review" className="md:w-1/4">
                <div className="recent-applyed-card">
                    <i className="bi bi-clipboard2-x"></i>
                    <div className="card-text">
                        <span className="dashboard-card-count">{statusCounts.Review}</span>
                        <small>Review</small>
                    </div>
                </div>
            </Link>
            <Link to="/enrollment_approved" className="md:w-1/4">
                <div className="approved-card">
                    <i className="bi bi-clipboard2-check"></i>
                    <div className="card-text">
                        <span className="dashboard-card-count">{statusCounts.Approved}</span>
                        <small>Approved</small>
                    </div>
                </div>
            </Link>
            <Link to="/enrollment_pending" className="md:w-1/4">
                <div className="pending-card">
                    <i className="bi bi-clipboard2-minus"></i>
                    <div className="card-text">
                        <span className="dashboard-card-count">{statusCounts.Pending}</span>
                        <small>Pending</small>
                    </div>
                </div>
            </Link>
            <Link to="/enrollment_rejected" className="md:w-1/4">
                <div className="rejected-card">
                    <i className="bi bi-clipboard2-x"></i>
                    <div className="card-text">
                        <span className="dashboard-card-count">{statusCounts.Reject}</span>
                        <small>Rejected</small>
                    </div>
                </div>
            </Link>
        </div>
    );
}



function StatusDashboard2() {
    const [statusCounts, setStatusCounts] = useState({
        Pending: 0,
        Approved: 0,
        Reject: 0,
        // Review: 0/
    });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await kycaccountsStatusListService.getList();
                if (response && response.data) {
                    // Count the statuses
                    const counts = response.data.reduce((acc, item) => {
                        acc[item.status] = (acc[item.status] || 0) + 1;
                        return acc;
                    }, {});

                    setStatusCounts({
                        Pending: counts.Pending || 0,
                        Approved: counts.Approved || 0,
                        Reject: counts.Reject || 0,
                        Review: counts.Review || 0
                    });
                }
            } catch (error) {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error?.response?.data?.message
                });
            }
        };
        fetchDetails();
    }, []);

    return (
        <div className="dashboard-top-caard-collection flex my-1">
            <Link to="/kyc_review" className="md:w-1/4">
                <div className="recent-applyed-card">
                    <i className="bi bi-clipboard2-x"></i>
                    <div className="card-text">
                        <span className="dashboard-card-count">{statusCounts.Review}</span>
                        <small>Review</small>
                    </div>
                </div>
            </Link>
            <Link to="/kyc_approved" className="md:w-1/4">
                <div className="approved-card">
                    <i className="bi bi-clipboard2-check"></i>
                    <div className="card-text">
                        <span className="dashboard-card-count">{statusCounts.Approved}</span>
                        <small>Approved</small>
                    </div>
                </div>
            </Link>
            <Link to="/kyc_pending" className="md:w-1/4">
                <div className="pending-card">
                    <i className="bi bi-clipboard2-minus"></i>
                    <div className="card-text">
                        <span className="dashboard-card-count">{statusCounts.Pending}</span>
                        <small>Pending</small>
                    </div>
                </div>
            </Link>
            <Link to="/kyc_rejected" className="md:w-1/4">
                <div className="rejected-card">
                    <i className="bi bi-clipboard2-x"></i>
                    <div className="card-text">
                        <span className="dashboard-card-count">{statusCounts.Reject}</span>
                        <small>Rejected</small>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default AdminDashboard;
