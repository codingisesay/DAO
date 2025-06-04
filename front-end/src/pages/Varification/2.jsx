
import React, { useState } from 'react';
import AddressForm from './2B';
import PersonalDetailsForm from './2A';
import CameraCapture from './2C';
import '../../assets/css/StepperForm.css';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';

const P2 = ({ onNext, onBack, formData, updateFormData }) => {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        { label: 'Personal Details', icon: 'bi bi-person', component: PersonalDetailsForm },
        { label: 'Address Details', icon: 'bi bi-geo-alt', component: AddressForm },
        { label: 'Customer Photo', icon: 'bi bi-image', component: CameraCapture }
    ];

    const handleRejectClick = async () => {
        const { value: reason } = await Swal.fire({
            title: 'Reason for Rejection',
            input: 'text',
            inputLabel: 'Please provide a reason',
            inputPlaceholder: 'Enter reason here...',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            className: 'btn-login',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write a reason!';
                }
            },
        });

        if (reason) {
            // Handle rejection logic here
            console.log('Rejection reason:', reason);
            // if (onBack) onBack();
            setActiveStep(activeStep + 1);
        }
    };

    const handleNextStep = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        } else {
            // If we're on the last step, call the parent's onNext
            if (onNext) onNext();
        }
    };

    const handlePrevStep = async () => {
        const result = await Swal.fire({
            title: 'Reason for Rejection',
            input: 'text',
            inputLabel: 'Please provide a reason',
            inputPlaceholder: 'Enter reason here...',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            className: 'btn-login',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write a reason!';
                }
            },
        });

        if (result.isConfirmed && result.value) {
            onNext(); // Called when user confirms with valid input
        } else if (result.isDismissed) {
            // onReject?.(); // Called when user cancels or dismisses the alert
        }
    };

    const handleStepSubmit = (stepData) => {
        updateFormData({ ...formData, ...stepData });
    };

    const CurrentStepComponent = steps[activeStep].component;

    return (
        <div className="multi-step-form">
            <div className="stepper-header">
                {steps.map((step, index) => {
                    const status = index < activeStep ? 'Completed' :
                        index === activeStep ? 'In Progress' : 'Pending';

                    return (
                        <div
                            key={index}
                            className={`step ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
                            onClick={() => setActiveStep(index)}
                        >
                            <div className="step-number">
                                <i className={step.icon}></i>
                            </div>
                            <div className="step-title">Step {index + 1}</div>
                            <div className="step-label">{step.label}</div>
                            <span className={`badge badge-${status.toLowerCase().replace(' ', '-')}`}>
                                {status}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="nestedstepper-form-container">
                <CurrentStepComponent
                    formData={formData}
                    updateFormData={handleStepSubmit}
                    onNext={handleNextStep}
                    onBack={handlePrevStep}
                />
            </div>

            <div className="next-back-btns">
                <CommonButton
                    className="text-red-500 border border-red-500 hover:bg-red-50 transition-colors my-auto px-4 rounded-md py-1"
                    onClick={activeStep === 0 ? handleRejectClick : handlePrevStep}
                    iconLeft={<i className="bi bi-chevron-double-left"></i>}
                >
                    {activeStep === 0 ? 'Reject & Continue' : 'Reject & Continue'}
                </CommonButton>

                <CommonButton
                    className="btn-next"
                    onClick={handleNextStep}
                    iconRight={<i className="bi bi-chevron-double-right"></i>}
                >
                    {activeStep === steps.length - 1 ? 'Accept & Continue' : 'Accept & Continue'}
                </CommonButton>
            </div>
        </div>
    );
};

export default P2;
// import React, { useState, useEffect } from 'react';
// import AddressForm from './2B';
// import PersonalDetailsForm from './2A';
// import CameraCapture from './2C';
// import '../../assets/css/StepperForm.css';
// import CommonButton from '../../components/CommonButton';
// import { personalDetailsService } from '../../services/apiServices';
// import Swal from 'sweetalert2';
// const P2 = ({ onNext, onBack, formData, updateFormData }) => {
//     const [activeStep, setActiveStep] = useState(0);

//     // Restore application_id if missing
//     // useEffect(() => {
//     //     console.log('Step 2: formData.application_id =', formData.application_id); // <-- Debug log
//     //     if (!formData.application_id) {
//     //         const storedId = localStorage.getItem('application_id');
//     //         if (storedId) {
//     //             updateFormData({ ...formData, application_id: storedId });
//     //         } else {
//     //             alert('No application found. Please start a new application.');
//     //             if (onBack) onBack();
//     //         }
//     //     }
//     // }, []);

//     const steps = [
//         { label: 'Personal Details', icon: 'bi bi-person', component: PersonalDetailsForm },
//         { label: 'Address Details', icon: 'bi bi-geo-alt', component: AddressForm },
//         { label: 'Customer Photo', icon: 'bi bi-image', component: CameraCapture }
//     ];

//     const handleRejectClick = async () => {
//         const { value: reason } = await Swal.fire({
//             title: 'Reason for Rejection',
//             input: 'text',
//             inputLabel: 'Please provide a reason',
//             inputPlaceholder: 'Enter reason here...',
//             showCancelButton: true,
//             confirmButtonText: 'Submit',
//             className: 'btn-login',
//             inputValidator: (value) => {
//                 if (!value) {
//                     return 'You need to write a reason!';
//                 }
//             },
//         });
//         if (activeStep < steps.length - 1) {
//             setActiveStep(activeStep + 1);
//         }
//         // if (reason) {
//         //     onNext(reason); // Call your onNext function with the reason
//         // }
//     };
//     const handleNextStep = () => {
//         //  onNext();
//         if (activeStep < steps.length - 1) {
//             setActiveStep(activeStep + 1);
//         }
//     };


//     // const handleNext = () => {
//     //     if (activeStep < steps.length - 1) {
//     //         setActiveStep(activeStep + 1);
//     //     }
//     //     console.log('formdata till step : ', formData)

//     // };

//     // const handleBack = () => {
//     //     if (activeStep > 0) {
//     //         setActiveStep(activeStep - 1);
//     //     }
//     // };

//     const handleStepSubmit = (stepData) => {
//         updateFormData(2, stepData); // Step 2 data
//     };

//     // Updated handleSubmit to use API_ENDPOINTS and check for application_id
//     const handleSubmit = async (e) => {

//         if (e && e.preventDefault) {
//             e.preventDefault();
//             handleNext();
//             alert('called 2a')
//             //API integration here
//         }

//     };


//     const CurrentStepComponent = steps[activeStep].component;

//     return (
//         <div className="multi-step-form">

//             <div className="stepper-header">
//                 {steps.map((step, index) => {
//                     const status = index < activeStep ? 'Completed' :
//                         index === activeStep ? 'In Progress' : 'Pending';

//                     return (
//                         <div
//                             key={index}
//                             className={`step ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
//                         >
//                             <div className="step-number">
//                                 <i className={step.icon}></i>
//                             </div>
//                             <div className="step-title">Step {index + 1}</div>
//                             <div className="step-label">{step.label}</div>
//                             <span className={`badge badge-${status.toLowerCase().replace(' ', '-')}`}>
//                                 {status}
//                             </span>
//                         </div>
//                     );
//                 })}
//             </div>

//             <div className="nestedstepper-form-container">
//                 <CurrentStepComponent
//                     formData={formData}
//                     updateFormData={handleStepSubmit}
//                     onNext={activeStep === 2 ? onNext : handleNext}
//                     onBack={activeStep === 0 ? onBack : handleBack}
//                 />
//             </div>

//             <div className="next-back-btns">
//                 <CommonButton
//                     className="btn-back"
//                     onClick={activeStep === 0 ? handleRejectClick : handleRejectClick}
//                     iconLeft={<i className="bi bi-chevron-double-left"></i>}
//                 >
//                     <i className="bi bi-chevron-double-left"></i>&nbsp;Back
//                 </CommonButton>

//                 <CommonButton
//                     className="btn-next"
//                     onClick={
//                         activeStep === 0
//                             ? handleNextStep // Personal Details
//                             : onNext // Photo step
//                     }
//                     iconRight={<i className="bi bi-chevron-double-right"></i>}
//                 >
//                     Next&nbsp;
//                     <i className="bi bi-chevron-double-right"></i>
//                 </CommonButton>
//             </div>
//         </div>
//     );
// };

// export default P2;