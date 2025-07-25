import React, { act, useState } from 'react';
import NominationForm from './Step5B_NominationDetails';
import PersonalDetailsForm from './Step5A_PersonalDetails';
import BankFacility from './Step5C_BankingFacility';
import '../../assets/css/StepperForm.css'; // Import your CSS file here
import CommonButton from '../../components/CommonButton';
const p2 = ({ onNext, onBack, formData, updateFormData }) => {
    const [activeStep, setActiveStep] = useState(0);


    const steps = [
        { label: 'Personal Details', icon: 'bi bi-person', component: PersonalDetailsForm },
        { label: 'Nomination Details', icon: 'bi bi-people', component: NominationForm },
        { label: 'Banking Facilities', icon: 'bi bi-bank', component: BankFacility }
    ];

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };
    const handleStepSubmit = (stepData) => {
        updateFormData(5, stepData); // Step 2 data
    };


    const CurrentStepComponent = steps[activeStep].component;

    return (
        <div className="">
            <div className="stepper-header">
                {steps.map((step, index) => {
                    // Determine the status
                    let status = '';
                    if (index < activeStep) {
                        status = 'Completed';
                    } else if (index === activeStep) {
                        status = 'In Progress';
                    } else {
                        status = 'Pending';
                    }

                    return (
                        <div
                            key={index}
                            className={`step ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
                        >
                            <div className="step-number">
                                <i className={step.icon}></i>
                            </div>
                            <div className="step-title">Step {index + 1}</div>
                            <div className="step-label">
                                {step.label}
                            </div>
                            {/* <span className={`badge badge-${status.toLowerCase().replace(' ', '-')}`}>
                                {status}
                            </span> */}
                        </div>
                    );
                })}
            </div>


            <div className="nestedstepper-form-container" >
                <CurrentStepComponent
                    formData={formData}
                    updateFormData={handleStepSubmit}
                    onNext={activeStep === 2 ? onNext : handleNext}
                    onBack={activeStep === 0 ? onBack : handleBack}
                />
            </div>


            <div className="next-back-btns">
                <CommonButton
                    className="btn-back"
                    onClick={activeStep === 0 ? onBack : handleBack}
                    iconLeft={<i className="bi bi-chevron-double-left"></i>}
                >
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>

                <CommonButton
                    className="btn-next"
                    onClick={activeStep === 2 ? onNext : handleNext}
                    iconRight={<i className="bi bi-chevron-double-right"></i>}
                >
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div>





        </div>
    );
};

export default p2;