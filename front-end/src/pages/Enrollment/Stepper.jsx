import React from 'react';
// import { TiTick } from "react-icons/ti";
import payvanceLogo from '../../assets/imgs/payvance_dark_logo.png';
import ThemeToggle from '../../components/Toggle';
import { useAuth } from '../../auth/AuthContext';
import useLocalStorage from "use-local-storage";


const Stepper = ({ currentStep, complete, steps }) => {

    const preference = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDark, setIsDark] = useLocalStorage("isDark", preference);
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <div className='stepper-container max-w-md mx-auto p-5' data-theme={isDark ? "dark" : "light"}>
            <img src={payvanceLogo} alt="PayVance Logo" className="payvance-logo mx-auto" />

            <ul className='max-w-md mx-auto'>
                <li>
                    <i className="bi bi-columns-gap"></i> &nbsp;
                    Dashboard
                </li>
            </ul>
            <p className='my-3'>Start Digital Account Opening</p>

            <div className="max-w-md mx-auto">
                <div className="vertical-stepper">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className={`stepper-item ${currentStep === i + 1 ? "active" : ""} ${i + 1 < currentStep || complete ? "completed" : ""}`}
                        >
                            <div className="stepper-number">
                                {i + 1 < currentStep || complete ? '' : <i className={step.icon}></i>}
                            </div>
                            <div className="ms-2">
                                <div className="stepper-subtitle">{step.subtitle}</div>
                                <div className="stepper-title">{step.title}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="stepper-footer">

                    <div className="flex bg-green-100 p-2 rounded-md items-center">
                        <img height='40px' width='40px'
                            src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
                            alt="profile"
                            className="rounded-full object-cover mx-2"
                        />
                        <span className='font-bold'>Agent Name <br /><small className='font-normal'> - Agent</small></span>
                    </div>
                    <div className="flex items-center justify-between footer-icon-collection">
                        <ThemeToggle />
                        <i className="mx-2 bi  bi-bell"></i>
                        <i className="mx-2 bi  bi-question-circle"></i>
                        <i className="mx-2 bi  bi-globe2"></i>
                        <i className="mx-2 bi  bi-box-arrow-right" onClick={handleLogout}></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stepper;