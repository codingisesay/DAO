import React , {useState, useEffect} from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; 
import payvanceLogo from '../../assets/imgs/payvance_dark_logo.png';
import ThemeToggle from '../../components/Toggle';
import useLocalStorage from "use-local-storage";
import AccountBarChart from './AccountBarChart';
import KYCgue from './KYCmeter';
import DemographicsBarChart from './DemographicsBarChart';
import KYCpendingTbl from './KYCpendingTbl';
import DateRangePicker from '../../components/DaterangePicker'
import CommonButton from '../../components/CommonButton';
import { agentService } from '../../services/apiServices';


const Dashboard = () => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDark, setIsDark] = useLocalStorage("isDark", preference);

    const { logout } = useAuth();
    const navigate = useNavigate();

    // Remove 'application_id' from localStorage
    localStorage.removeItem('application_id');

    const handleRedireact = () => {
        localStorage.removeItem('application_id'); // Clear any previous application ID
        navigate('/enrollmentform'); // Change to your route
    };
    const handlekyc = () => {
        navigate('/start_rekyc'); // Change to your route
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
                            <span className='font-bold'>Agent Name <br /><small className='font-normal'> - Agent</small></span>
                        </div>
                    </div>

                </div>
                <div className='flex justify-between'>
                    <h2 className="text-xl font-bold mb-2">Overview</h2>
                    <div>
                        <CommonButton
                            type="button"
                            className="btn-login me-4"
                            onClick={handleRedireact}
                        >
                            &nbsp;<i className="bi bi-pencil-square"></i>&nbsp;Start Enrollment&nbsp;
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
                        <div className='w-full sm:w-full p-1'>
                            <StatusDashboard1 />
                            
                        </div>  
                        <div className='md:w-2/3 sm:w-full p-1'>
                            <div className="bg-white w-full my-2 p-4 rounded-md">
                                <AccountBarChart />
                            </div>
                        </div>
                        <div className='md:w-1/3 sm:w-full p-1'>
                            <div className="bg-white w-full my-2 px-4 pt-4 rounded-md relative">
                                <h2 className="text-xl font-bold mb-2">KYC Application Status</h2>
                                <div className='pb-11'>
                                    <KYCgue total={2000} approved={800} pending={1200} />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className='md:w-2/6 sm:w-full p-1'>
                        <div className="bg-white w-full my-2 p-4 rounded-md">
                            <h2 className="text-xl font-bold mb-0">Application Insights</h2>
                            <div className="text-center">
                                <DateRangePicker onChange={handleDateChange} />
                            </div>


                            <div className="dashboard-top-caard-collection flex flex-wrap my-1">
                                <div className="w-1/2">
                                    <div className="approved-card">
                                        <i className="bi bi-clipboard2-check"></i>
                                        <div className="card-text">
                                            <span className="dashboard-card-count">100+</span>
                                            <small>Approved</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="pending-card">
                                        <i className="bi bi-clipboard2-minus"></i>
                                        <div className="card-text">
                                            <span className="dashboard-card-count">200+</span>
                                            <small>Pending</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="rejected-card">
                                        <i className="bi bi-clipboard2-x"></i>
                                        <div className="card-text">
                                            <span className="dashboard-card-count">50+</span>
                                            <small>Rejected</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/2">
                                    <div className="recent-applyed-card">
                                        <i className="bi bi-clipboard2-plus"></i>
                                        <div className="card-text">
                                            <span className="dashboard-card-count">350+</span>
                                            <small>Recent </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

 

                    <div className='md:w-1/2 sm:w-full p-1'>
                        <div className="bg-white w-full my-2 p-4 rounded-md">
                            <h2 className="text-xl font-bold mb-2"> Demographics Report</h2>
                            <DemographicsBarChart />
                        </div>
                    </div>
                    <div className='md:w-1/2 sm:w-full p-1'>
                        <div className="bg-white w-full my-2 p-4 rounded-md">
                            <h2 className="text-xl font-bold mb-2">    V-KYC Pending Status</h2>
                            <KYCpendingTbl />
                        </div>
                    </div>
                </div > 
            </div >


        </>
    );
};





function StatusDashboard1() {
    const storedId = localStorage.getItem('agent_id') || 1;
    const [statusCounts, setStatusCounts] = useState({
        Pending: 0,
        Approved: 0,
        Reject: 0,
        Review: 0
    });

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await agentService.applicationcountbyagent(storedId);
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
            <Link to="/enrollment_review_tbl" className="md:w-1/4">
                <div className="recent-applyed-card">
                    <i className="bi bi-clipboard2-x"></i>
                    <div className="card-text">
                        <span className="dashboard-card-count">{statusCounts.Review}</span>
                        <small>Review</small>
                    </div>
                </div>
            </Link>
            <Link to="/enrollment_approved_tbl" className="md:w-1/4">
                <div className="approved-card">
                    <i className="bi bi-clipboard2-check"></i>
                    <div className="card-text">
                        <span className="dashboard-card-count">{statusCounts.Approved}</span>
                        <small>Approved</small>
                    </div>
                </div>
            </Link>
            <Link to="/enrollment_pending_tbl" className="md:w-1/4">
                <div className="pending-card">
                    <i className="bi bi-clipboard2-minus"></i>
                    <div className="card-text">
                        <span className="dashboard-card-count">{statusCounts.Pending}</span>
                        <small>Pending</small>
                    </div>
                </div>
            </Link>
            <Link to="/enrollment_rejected_tbl" className="md:w-1/4">
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



export default Dashboard;
