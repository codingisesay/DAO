import { useState, useEffect } from 'react';
import '../../assets/css/login.css'; 
import useLocalStorage from "use-local-storage";
import payvanceLogo from '../../assets/imgs/payvance_light_logo.png';
import CommanInput from '../../components/CommanInput';
import agenticon from '../../assets/imgs/agent.png';
import adminicon from '../../assets/imgs/admin.png';
import empicon from '../../assets/imgs/employee.png';
import ThemeToggle from '../../components/Toggle';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { loginUser } from '../../utils/endpoints';



const roles = [
    { label: 'AGENT', icon: agenticon },
    { label: 'ADMIN', icon: adminicon },
    { label: 'EMPLOYEE', icon: empicon }
];

export default function LoginPage() {

    // clear privious data

   useEffect(() => {
        localStorage.removeItem('approveStatusArray');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userCode');
        localStorage.removeItem('userName');
        localStorage.removeItem('roleName');
        localStorage.removeItem('refreshToken');
    }, []);
    // clear privious data above

    const [selectedRole, setSelectedRole] = useState(null);
    const [formData, setFormData] = useState({ username: '', password: '', captcha: '', role: '' });
    const [showPassword, setShowPassword] = useState(false);
    const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDark, setIsDark] = useLocalStorage("isDark", preference);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const [numbers, setNumbers] = useState([]);

    const generateCaptcha = () => {
        const newNumbers = [
            Math.floor(Math.random() * 90 + 10),
            Math.floor(Math.random() * 90 + 10),
            Math.floor(Math.random() * 90 + 10),
        ];
        setNumbers(newNumbers);
    };

    // Returns true if captcha is valid, false otherwise
    const validateCaptcha = () => {
        const correctAnswer = Math.min(...numbers);
        if (parseInt(formData.captcha) !== correctAnswer) {
            Swal.fire({
                title: 'Invalid Captcha!',
                text: 'Please enter the smallest value shown.',
                icon: 'error', 
                confirmButtonText: 'Try Again',
                customClass: {
                    confirmButton: 'btn-error',
                }
            });
            return false;
        }
        return true;
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate captcha first
        if (!validateCaptcha()) {
            return; // Stop login if captcha is invalid
        }
        try {
            const success = await loginUser(formData.username, formData.password, '01');
            if (success) {
                if(success.roleName === 'Admin') {
                    navigate('/admindashboard');
                } else {
                    navigate('/agentdashboard');
                }
            } else {
                Swal.fire({
                    title: 'Login Failed',
                    text: 'Invalid credentials',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    customClass: {
                        confirmButton: 'btn-error',
                    }
                });
            }
        }
        catch(error){
            Swal.fire({
                title: 'Error',
                text: JSON.stringify(error) || 'An unexpected error occurred',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'btn-error',
                }
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div data-theme={isDark ? "dark" : "light"} className="w-full min-h-screen justify-center flex flex-col md:flex-row bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            {/* Left Panel */}
            <div className="md:w-1/2 bg-gradient-to-b from-blue-900 to-black flex items-center justify-center">
                <div className='login-bg'>
                    <img className="m-5 p-2 px-4 rounded-xl backdrop-blur-sm" src={payvanceLogo} alt="logo" />
                </div>
            </div>

            {/* Right Panel */}
            <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <div className="w-4/5 m-auto">
                    <div className='flex justify-between'>
                        <p className="green-underline text-3xl font-bold mb-2 w-full font-xl text-gray-900 dark:text-gray-200">Sign In</p>
                        <ThemeToggle />
                    </div>
                    <p className="text-sm my-4 text-gray-500 dark:text-gray-400">Please select your role</p>

                    <div className="flex gap-5 mb-6">
                        {roles.map((role) => (
                            <span
                                key={role.label}
                                onClick={() => setSelectedRole(role.label)}
                                className={`flex flex-col items-center p-4 border rounded-md w-1/3 transition ${selectedRole === role.label
                                    ? 'bg-green-100 dark:bg-green-800 border-green-500'
                                    : 'role-gray-icon border-gray-300 dark:border-gray-600'
                                    }`}
                            >
                                <img src={role.icon} alt="roleicon" width='50px' />
                                <span className="text-sm mt-2">{role.label}</span>
                            </span>
                        ))}
                    </div>

                    {/* Inputs */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <CommanInput
                            onChange={handleChange}
                            label={labels.username.label}
                            type="text"
                            name="username"
                            value={formData.username}
                        />

                        <div className="relative">
                            <CommanInput
                                onChange={handleChange}
                                label={labels.password.label}
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-2 text-gray-500 dark:text-gray-400"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <i className="bi bi-eye-slash-fill"></i>
                                ) : (
                                    <i className="bi bi-eye-fill"></i>
                                )}
                            </button>

                            <div className="flex items-center text-xs mt-1">
                                <input type="checkbox" id="remember" className="mx-1" />
                                <label htmlFor="remember" className="text-gray-600 dark:text-gray-300">Remember me</label>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                Identify the smallest value ({numbers.join(", ")}) = ?
                            </p>
                            <div className="flex items-center gap-2">
                                <CommanInput
                                    onChange={handleChange}
                                    label={labels.captacha.label}
                                    type="text"
                                    name="captcha"
                                    value={formData.captcha || ''}
                                />

                                <CommonButton
                                    type="button"
                                    className="captach-refresh"
                                    onClick={generateCaptcha}
                                >
                                    <i className="bi bi-arrow-clockwise text-xl font-bold"></i>
                                </CommonButton>
                            </div>
                        </div>

                        <CommonButton
                            type="submit"
                            className="btn-login w-full"
                        >
                            Login
                        </CommonButton>
                    </form> 
                    <div className='text-center my-2'> <Link to="/forgotpassword" className="text-sm text-gray-400">Forgot Password?</Link></div>
                   
                </div>
            </div>
        </div>
    );
}

 