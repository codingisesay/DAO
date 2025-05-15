import React from 'react';
import CommanInput from '../../components/CommanInput';
import CommanSelectInput from '../../components/CommanSelectInput';
import payvanceLogo from '../../assets/imgs/payvance_light_logo.png';
import labels from '../../components/labels';
import { userDetails, maritalStatusOptions, regionOptions, branchOptions, occupationTypeOptions } from '../../data/data';
import { useNavigate } from 'react-router-dom';
import CommonButton from '../../components/CommonButton';
const AgentRegisterForm = () => {
    const [formData, setFormData] = React.useState({
        userId: '',
        userName: '',
        email: '',
        mobile: '',
        region: '',
        branch: '',
        password: '',
        confirmPassword: '',
        accountHolder: '',
        accountNumber: '',
        bankName: '',
        ifsc: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleBack = () => {
        navigate(-1); // This goes one step back in the browser history
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    return (
        <div className="container mx-auto p-4">
            <div className='flex justify-between'>
                <div >
                    <img src={payvanceLogo} alt="PayVance Logo" className="payvance-logo" />
                    <h2>Welcome to FinAcctz</h2>
                </div>
                <div className="text-right">
                    <div className='flex items-center'>
                        {/* <ThemeToggle /> */}
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
            <div className=" mx-auto p-4 bg-white rounded-lg    " >
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-2"> Agent Registration</h2>
                    {/* User Details */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Agent Details</h2>
                        <div className="grid md:grid-cols-4 gap-3">
                            <CommanInput
                                label={labels.userId?.label || "User ID"}
                                name="userId"
                                value={formData.userId}
                                onChange={handleChange}
                                required
                            />
                            <CommanInput
                                label={labels.userName?.label || "User Name"}
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                            />
                            <CommanInput
                                label="Email ID"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <CommanInput
                                label="Mobile No."
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                            />

                            <CommanSelectInput
                                value={formData.region}
                                label={labels.region?.label || "Region"}
                                name="region"
                                onChange={handleChange}
                                required
                                options={regionOptions}
                            />

                            <CommanSelectInput
                                value={formData.branch}
                                label={labels.branch?.label || "Branch"}
                                name="branch"
                                onChange={handleChange}
                                required
                                options={branchOptions}
                            />
                        </div>
                    </div>

                    {/* Password Details */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Password Details</h2>
                        <div className="grid md:grid-cols-4 gap-3">
                            <CommanInput
                                label={labels.password?.label || "Password"}
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <CommanInput
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Bank Details</h2>
                        <div className="grid md:grid-cols-4 gap-3">
                            <CommanInput
                                label="Account Holder Name"
                                name="accountHolder"
                                value={formData.accountHolder}
                                onChange={handleChange}
                                required
                            />
                            <CommanInput
                                label="Account Number"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                required
                            />
                            <CommanInput
                                label="Bank Name"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                required
                            />
                            <CommanInput
                                label="IFSC Code"
                                name="ifsc"
                                value={formData.ifsc}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="text-end mt-4">
                    <CommonButton
                        className="btn-login w-[150px] py-2"
                        type="submit"
                    >
                        Register Agent
                    </CommonButton>&emsp;

                    <CommonButton
                        onClick={handleBack}
                        className="px-4 py-2 border border-gray-300 text-white rounded-lg hover:bg-gray-500 bg-gray-400"
                    >
                        Go Back To Dashboard
                    </CommonButton>
                </div>
            </div>
        </div>
    );
};

export default AgentRegisterForm;
