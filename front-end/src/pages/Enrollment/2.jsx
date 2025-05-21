import React, { useState } from 'react';
import AddressForm from './2B';
import PersonalDetailsForm from './2A';
import CameraCapture from './2C';
import '../../assets/css/StepperForm.css';
import CommonButton from '../../components/CommonButton';
import { apiService } from '../../utils/storage';
import { API_ENDPOINTS } from '../../services/api';

const P2 = ({ onNext, onBack, formData, updateFormData }) => {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        { label: 'Personal Details', icon: 'bi bi-person', component: PersonalDetailsForm },
        { label: 'Address Details', icon: 'bi bi-geo-alt', component: AddressForm },
        { label: 'Customer Photo', icon: 'bi bi-image', component: CameraCapture }
    ];

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        }
        console.log('formdata till step : ', formData)

    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep(activeStep - 1);
        }
    };

    const handleStepSubmit = (stepData) => {
        updateFormData(2, stepData); // Step 2 data
    };

    // Updated handleSubmit to use API_ENDPOINTS and check for application_id
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        try {
            const pd = formData.personalDetails || {};
            const payload = {
                application_id: formData.application_id, // Make sure this is set from previous step
                salutation: pd.salutation,
                religion: pd.religion,
                caste: pd.caste,
                marital_status: pd.maritalStatus ? pd.maritalStatus.toUpperCase() : undefined,
                alt_mob_no: pd.alternatemobile,
                email: pd.email,
                adhar_card: pd.aadharnumber,
                pan_card: pd.pannumber,
                passport: pd.passportno,
                driving_license: pd.drivinglicence,
                voter_id: pd.voterid,
                status: formData.status, // Should be 'APPROVED' or 'REJECT'
            };

            let response;
            if (formData.id) {
                response = await apiService.put(API_ENDPOINTS.PERSONAL_DETAILS.UPDATE(formData.id), payload);
            } else {
                response = await apiService.post(API_ENDPOINTS.PERSONAL_DETAILS.CREATE, payload);
            }

            alert(response.data.message || 'Personal details saved successfully.');
            onNext();
        } catch (err) {
            // ...error handling...
        }
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
                    onClick={
                        activeStep === 0
                            ? handleSubmit // Call handleSubmit for Personal Details step
                            : activeStep === 2
                                ? onNext
                                : handleNext
                    }
                    iconRight={<i className="bi bi-chevron-double-right"></i>}
                >
                    Next&nbsp;
                    <i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div>
        </div>
    );
};

export default P2;