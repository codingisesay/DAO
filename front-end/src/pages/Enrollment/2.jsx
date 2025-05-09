import React, { act, useState } from 'react';
import AddressForm from './2B';
import PersonalDetailsForm from './2A';
import CameraCapture from './2C';
import '../../assets/css/StepperForm.css'; // Import your CSS file here

const p2 = ({ onNext, onBack }) => {
    const [activeStep, setActiveStep] = useState(2);

    const [formData, setFormData] = useState({
        // Personal Details
        firstName: '',
        lastName: '',
        email: '',
        phone: '',

        // Address Details
        permanentAddress: {
            complexName: '',
            country: 'India',
            state: '',
            flatNo: '',
            pinCode: '',
            residentVN: ''
        },
        correspondenceAddressSame: false,
        correspondenceAddress: {
            complexName: '',
            country: '',
            state: '',
            flatNo: '',
            pinCode: ''
        },
        area: '',
        city: '',
        residenceStatus: '',
        nearbyLandmark: '',
        district: '',
        residenceDocument: null,

        // Photo
        customerPhoto: null
    });

    const steps = [
        { label: 'Personal Details', icon: 'bi bi-person', component: PersonalDetailsForm },
        { label: 'Address Details', icon: 'bi bi-geo-alt', component: AddressForm },
        { label: 'Customer Photo', icon: 'bi bi-image', component: CameraCapture }
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

    const handleFormChange = (name, value) => {
        setFormData(prev => {
            // Handle nested objects (like addresses)
            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                return {
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: value
                    }
                };
            }
            return {
                ...prev,
                [name]: value
            };
        });
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
                            <span className={`badge badge-${status.toLowerCase().replace(' ', '-')}`}>
                                {status}
                            </span>
                        </div>
                    );
                })}
            </div>


            <div className="">
                <CurrentStepComponent
                    formData={formData}
                    onChange={handleFormChange}
                />
            </div>


            <div className="next-back-btns">
                {activeStep === 0 ?

                    <button className="btn-back" onClick={onBack}>
                        <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                    </button>

                    :

                    <button className="btn-back" onClick={handleBack} >
                        <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                    </button>
                }
                {activeStep === 2 ?
                    <button className="btn-next" onClick={onNext}>
                        Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                    </button>

                    :
                    <button className="btn-next" onClick={handleNext} >
                        Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                    </button>
                }
            </div>

















            {/* <div className="next-back-btns">
                <button className="btn-back" onClick={handleBack} disabled={activeStep === 0} >
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </button>
                <button className="btn-next" onClick={handleNext} >
                    {activeStep === steps.length - 1 ? 'Submit' : 'Next'}&nbsp;
                    <i className="bi bi-chevron-double-right"></i>
                </button>
            </div>
            <hr />


            <div className="next-back-btns">
                <button className="btn-back" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </button>
                <button className="btn-next" onClick={onNext}>
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </button>
            </div> */}




        </div>
    );
};

export default p2;