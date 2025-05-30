
import React from 'react';
import CommanInput from '../../components/CommanInput';
import CommanSelect from '../../components/CommanSelect';
import payvanceLogo from '../../assets/imgs/payvance_light_logo.png';
import labels from '../../components/labels';
import { maritalStatusOptions, regionOptions, branchOptions, occupationTypeOptions } from '../../data/data';
import { useNavigate } from 'react-router-dom';
import CommonButton from '../../components/CommonButton';
import { userService } from '../../services/apiServices';
import { ToastContainer, toast } from "react-toastify";




const AgentRegisterForm = () => {
    const [formData, setFormData] = React.useState({
        userCode: '',
        userName: '',
        emailId: '',
        mobileNumber: '',
        employeeCode: '',
        designation: '',
        workingBranchId: '',
        multiBranchAccessYN: '',
        role: '',
        loginFromOtherBranchYN: '',
        autoLogoutYN: '',
        autoLogoutAfterSecs: '',
        passwordChangeForcedYN: '',
        passwordChangePeriodDays: '',
        minimumLoginFrequencyForcedYN: '',
        minimumLoginPeriodDays: '',
        maxBadLoginsPerDay: '10',
        maxBadLoginsPerInst: '3',
        password: '',
        confirmPassword: ''
    });

    const [validation, setValidation] = React.useState({
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
        length: false
    });
    const [isPasswordFocused, setIsPasswordFocused] = React.useState(false);
    const [validationErrors, setValidationErrors] = React.useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRoleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validatePassword = (password) => {
        setValidation({
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            length: password.length >= 8
        });
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleLogout = () => {
        // logout(); // Uncomment if you have logout function
        navigate('/login');
    };

    const activityOptions = [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' }
    ];

    // These should be replaced with your actual options from data or API
    const roles = [
        { value: 1, label: 'Admin' },
        { value: 2, label: 'Agent' }
    ];

    const designation = [
        { value: 'manager', label: 'Manager' },
        { value: 'agent', label: 'Agent' }
    ];
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Password and Confirm Password do not match");
            return;
        }

        toast.error(Object.values(validationErrors));
        // Check if there are any validation errors
        // if (
        //     Object.values(validationErrors).some((error) => error) ||
        //     !isFormValid(formData, validationErrors)
        // ) {
        //     setShowSuccessPopup(true); // Show a success message to the user
        //     return;
        // }
        // setIsSubmitting(true); // Disable submit button
        // Validate form fields
        try {
            await userService.createUsers({
                userCode: formData.userCode.toUpperCase(),
                userName: formData.userName.toUpperCase(),
                emailId: formData.emailId,
                mobileNumber: formData.mobileNumber,
                employeeCode: formData.employeeCode,
                designation: formData.designation,
                workingBranchId: parseInt(formData.workingBranchId),
                role: formData.role,
                homeBranch: parseInt(formData.workingBranchId),
                multiBranchAccessYN: !!formData.multiBranchAccessYN,
                loginFromOtherBranchYN: !!formData.loginFromOtherBranchYN,
                autoLogoutYN: !!formData.autoLogoutYN,
                passwordChangeForcedYN: !!formData.passwordChangeForcedYN,
                minimumLoginFrequencyForcedYN: !!formData.minimumLoginFrequencyForcedYN,
                autoLogoutAfterSecs: parseInt(formData.autoLogoutAfterSecs),
                passwordChangePeriodDays: parseInt(formData.passwordChangePeriodDays),
                minimumLoginPeriodDays: parseInt(formData.minimumLoginPeriodDays),
                maxBadLoginsPerDay: parseInt(formData.maxBadLoginsPerDay),
                maxBadLoginsPerInst: parseInt(formData.maxBadLoginsPerInst),
                password: formData.password,
                confirmPassword: formData.confirmPassword,
            });
            alert('Agent / Admin Created !!')
        } catch (error) {
            toast.error("Submission Error:", error);
        } finally {
            // setIsSubmitting(false); // Enable submit button again
        }
    };

    return (
        <div className=" mx-auto p-4">
            <div className='flex justify-between'>
                <div >
                    <img src={payvanceLogo} alt="PayVance Logo" className="payvance-logo" />
                    <h2>Welcome to FinAcctz</h2>
                </div>
                <h2 className="text-2xl font-bold mb-2"> Agent Registration</h2>
                <div className="text-right">
                    <div className='flex items-center'>
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
            <div className=" mx-auto p-4 bg-white rounded-lg">
                <div className="space-y-6">

                    {/* Personal Information Section */}
                    <div>
                        <h2 className="text-lg   mb-2">Personal Information</h2>
                        <div className="grid  md:grid-cols-5 gap-3">
                            <CommanInput
                                label="User Code"
                                name="userCode"
                                value={formData.userCode.toUpperCase()}
                                onChange={handleChange}
                                required
                            />
                            <CommanInput
                                label="User Name"
                                name="userName"
                                value={formData.userName.toUpperCase()}
                                onChange={handleChange}
                                required
                            />
                            <CommanInput
                                label="Email ID"
                                name="emailId"
                                value={formData.emailId}
                                onChange={handleChange}
                            />
                            <CommanInput
                                label="Mobile Number"
                                name="mobileNumber"
                                value={formData.mobileNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Employee Details Section */}
                    <div>
                        {/* <h2 className="text-lg   mb-2">Employee Details</h2> */}
                        <div className="grid  md:grid-cols-5 gap-3">
                            <CommanInput
                                label="Employee Code"
                                name="employeeCode"
                                value={formData.employeeCode.toUpperCase()}
                                onChange={handleChange}
                                required
                            />
                            <CommanSelect
                                label="Designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                required
                                options={designation}
                            />
                            <CommanSelect
                                label="Working Branch"
                                name="workingBranchId"
                                value={formData.workingBranchId}
                                onChange={handleChange}
                                required
                                options={branchOptions}
                            />
                        </div>
                    </div>

                    {/* Access Control Section */}
                    <div>
                        <h2 className="text-lg   mb-2">Access Control</h2>
                        <div className="grid  md:grid-cols-5 gap-3">
                            <CommanSelect
                                label="Multi Branch Access"
                                name="multiBranchAccessYN"
                                value={formData.multiBranchAccessYN}
                                onChange={handleChange}
                                required
                                options={activityOptions}
                            />
                            <CommanSelect
                                label="Role"
                                name="role"
                                value={formData.role}
                                onChange={handleRoleChange}
                                required
                                options={roles}
                            />
                            <CommanSelect
                                label="Login From Other Branch"
                                name="loginFromOtherBranchYN"
                                value={formData.loginFromOtherBranchYN}
                                onChange={handleChange}
                                required
                                options={activityOptions}
                            />
                            <CommanSelect
                                label="Auto Logout"
                                name="autoLogoutYN"
                                value={formData.autoLogoutYN}
                                onChange={handleChange}
                                required
                                options={activityOptions}
                            />
                            <CommanInput
                                label="Auto Logout After (secs)"
                                name="autoLogoutAfterSecs"
                                value={formData.autoLogoutAfterSecs}
                                onChange={handleChange}
                                required={formData.autoLogoutYN === 'Yes'}
                                disabled={formData.autoLogoutYN !== 'Yes'}
                            />
                        </div>
                    </div>

                    {/* Security Settings Section */}
                    <div>
                        <h2 className="text-lg   mb-2">Security Settings</h2>
                        <div className="grid  md:grid-cols-5 gap-3">
                            <CommanSelect
                                label="Force Password Change"
                                name="passwordChangeForcedYN"
                                value={formData.passwordChangeForcedYN}
                                onChange={handleChange}
                                required
                                options={activityOptions}
                            />
                            <CommanInput
                                label="Password Change Period (days)"
                                name="passwordChangePeriodDays"
                                value={formData.passwordChangePeriodDays}
                                onChange={handleChange}
                                required={formData.passwordChangeForcedYN === 'Yes'}
                                disabled={formData.passwordChangeForcedYN !== 'Yes'}
                            />
                            <CommanSelect
                                label="Force Minimum Login Frequency"
                                name="minimumLoginFrequencyForcedYN"
                                value={formData.minimumLoginFrequencyForcedYN}
                                onChange={handleChange}
                                required
                                options={activityOptions}
                            />
                            <CommanInput
                                label="Minimum Login Period (days)"
                                name="minimumLoginPeriodDays"
                                value={formData.minimumLoginPeriodDays}
                                onChange={handleChange}
                                required={formData.minimumLoginFrequencyForcedYN === 'Yes'}
                                disabled={formData.minimumLoginFrequencyForcedYN !== 'Yes'}
                            />
                            <CommanInput
                                label="Max Bad Logins Per Day"
                                name="maxBadLoginsPerDay"
                                value={formData.maxBadLoginsPerDay}
                                onChange={handleChange}
                                required
                            />
                            <CommanInput
                                label="Max Bad Logins Per Instance"
                                name="maxBadLoginsPerInst"
                                value={formData.maxBadLoginsPerInst}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Section */}
                    <div>
                        <h2 className="text-lg   mb-2">Set Password</h2>
                        <div className="grid  md:grid-cols-5 gap-3">
                            <div className="relative">
                                <CommanInput
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => {
                                        handleChange(e);
                                        validatePassword(e.target.value);
                                    }}
                                    onFocus={() => setIsPasswordFocused(true)}
                                    onBlur={() => setTimeout(() => setIsPasswordFocused(false), 200)}
                                    required
                                />
                                {isPasswordFocused && (
                                    <div className="absolute z-10 mt-2 p-3 bg-white border border-gray-300 rounded shadow-lg">
                                        <ul className="space-y-1">
                                            <li className={`flex items-center ${validation.lowercase ? 'text-green-500' : 'text-gray-500'}`}>
                                                {validation.lowercase ? (
                                                    <i className="bi bi-check-circle-fill mr-2"></i>
                                                ) : (
                                                    <i className="bi bi-circle mr-2"></i>
                                                )}
                                                Lower Case
                                            </li>
                                            <li className={`flex items-center ${validation.uppercase ? 'text-green-500' : 'text-gray-500'}`}>
                                                {validation.uppercase ? (
                                                    <i className="bi bi-check-circle-fill mr-2"></i>
                                                ) : (
                                                    <i className="bi bi-circle mr-2"></i>
                                                )}
                                                Upper Case
                                            </li>
                                            <li className={`flex items-center ${validation.number ? 'text-green-500' : 'text-gray-500'}`}>
                                                {validation.number ? (
                                                    <i className="bi bi-check-circle-fill mr-2"></i>
                                                ) : (
                                                    <i className="bi bi-circle mr-2"></i>
                                                )}
                                                Number
                                            </li>
                                            <li className={`flex items-center ${validation.special ? 'text-green-500' : 'text-gray-500'}`}>
                                                {validation.special ? (
                                                    <i className="bi bi-check-circle-fill mr-2"></i>
                                                ) : (
                                                    <i className="bi bi-circle mr-2"></i>
                                                )}
                                                Symbol
                                            </li>
                                            <li className={`flex items-center ${validation.length ? 'text-green-500' : 'text-gray-500'}`}>
                                                {validation.length ? (
                                                    <i className="bi bi-check-circle-fill mr-2"></i>
                                                ) : (
                                                    <i className="bi bi-circle mr-2"></i>
                                                )}
                                                Minimum 8 characters
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
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
                </div>
                <div className="text-end mt-4">
                    <CommonButton onClick={handleSubmit}
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





















// import React from 'react';
// import CommanInput from '../../components/CommanInput';
// import CommanSelect from '../../components/CommanSelect';
// import payvanceLogo from '../../assets/imgs/payvance_light_logo.png';
// import labels from '../../components/labels';
// import { userDetails, maritalStatusOptions, regionOptions, branchOptions, occupationTypeOptions } from '../../data/data';
// import { useNavigate } from 'react-router-dom';
// import CommonButton from '../../components/CommonButton';
// const AgentRegisterForm = () => {
//     const [formData, setFormData] = React.useState({
//         userId: '',
//         userName: '',
//         email: '',
//         mobile: '',
//         region: '',
//         branch: '',
//         password: '',
//         confirmPassword: '',
//         accountHolder: '',
//         accountNumber: '',
//         bankName: '',
//         ifsc: ''
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleBack = () => {
//         navigate(-1); // This goes one step back in the browser history
//     };
//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };
//     return (
//         <div className="container mx-auto p-4">
//             <div className='flex justify-between'>
//                 <div >
//                     <img src={payvanceLogo} alt="PayVance Logo" className="payvance-logo" />
//                     <h2>Welcome to FinAcctz</h2>
//                 </div>
//                 <div className="text-right">
//                     <div className='flex items-center'>
//                         {/* <ThemeToggle /> */}
//                         <i className="mx-2 bi  bi-bell"></i>
//                         <i className="mx-2 bi  bi-question-circle"></i>
//                         <i className="mx-2 bi  bi-globe2"></i>
//                         <i className="mx-2 bi  bi-box-arrow-right md:w-right" onClick={handleLogout}></i>
//                         <img height='40px' width='40px'
//                             src="https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
//                             alt="profile"
//                             className="rounded-full object-cover mx-2"
//                         />
//                         <span className='font-bold'>Agent Name <br /><small className='font-normal'> - Admin</small></span>
//                     </div>
//                 </div>
//             </div>
//             <div className=" mx-auto p-4 bg-white rounded-lg    " >
//                 <div className="space-y-6">
//                     <h2 className="text-2xl font-bold mb-2"> Agent Registration</h2>
//                     {/* User Details */}
//                     <div>
//                         <h2 className="text-lg   mb-2">Agent Details</h2>
//                         <div className="grid  md:grid-cols-5 gap-3">
//                             <CommanInput
//                                 label={labels.userId?.label || "User ID"}
//                                 name="userId"
//                                 value={formData.userId}
//                                 onChange={handleChange}
//                                 required
//                             />
//                             <CommanInput
//                                 label={labels.userName?.label || "User Name"}
//                                 name="userName"
//                                 value={formData.userName}
//                                 onChange={handleChange}
//                                 required
//                             />
//                             <CommanInput
//                                 label="Email ID"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 required
//                             />
//                             <CommanInput
//                                 label="Mobile No."
//                                 name="mobile"
//                                 value={formData.mobile}
//                                 onChange={handleChange}
//                                 required
//                             />

//                             <CommanSelect
//                                 value={formData.region}
//                                 label={labels.region?.label || "Region"}
//                                 name="region"
//                                 onChange={handleChange}
//                                 required
//                                 options={regionOptions}
//                             />

//                             <CommanSelect
//                                 value={formData.branch}
//                                 label={labels.branch?.label || "Branch"}
//                                 name="branch"
//                                 onChange={handleChange}
//                                 required
//                                 options={branchOptions}
//                             />
//                         </div>
//                     </div>

//                     {/* Password Details */}
//                     <div>
//                         <h2 className="text-lg   mb-2">Password Details</h2>
//                         <div className="grid  md:grid-cols-5 gap-3">
//                             <CommanInput
//                                 label={labels.password?.label || "Password"}
//                                 name="password"
//                                 type="password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                                 required
//                             />
//                             <CommanInput
//                                 label="Confirm Password"
//                                 name="confirmPassword"
//                                 type="password"
//                                 value={formData.confirmPassword}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//                     </div>

//                     {/* Bank Details */}
//                     <div>
//                         <h2 className="text-lg   mb-2">Bank Details</h2>
//                         <div className="grid  md:grid-cols-5 gap-3">
//                             <CommanInput
//                                 label="Account Holder Name"
//                                 name="accountHolder"
//                                 value={formData.accountHolder}
//                                 onChange={handleChange}
//                                 required
//                             />
//                             <CommanInput
//                                 label="Account Number"
//                                 name="accountNumber"
//                                 value={formData.accountNumber}
//                                 onChange={handleChange}
//                                 required
//                             />
//                             <CommanInput
//                                 label="Bank Name"
//                                 name="bankName"
//                                 value={formData.bankName}
//                                 onChange={handleChange}
//                                 required
//                             />
//                             <CommanInput
//                                 label="IFSC Code"
//                                 name="ifsc"
//                                 value={formData.ifsc}
//                                 onChange={handleChange}
//                                 required
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <div className="text-end mt-4">
//                     <CommonButton
//                         className="btn-login w-[150px] py-2"
//                         type="submit"
//                     >
//                         Register Agent
//                     </CommonButton>&emsp;

//                     <CommonButton
//                         onClick={handleBack}
//                         className="px-4 py-2 border border-gray-300 text-white rounded-lg hover:bg-gray-500 bg-gray-400"
//                     >
//                         Go Back To Dashboard
//                     </CommonButton>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AgentRegisterForm;
