import React, { useState } from 'react';
import AddressForm from './2B';
import PersonalDetailsForm from './2A';
import CameraCapture from './2C';
import '../../assets/css/StepperForm.css';
import CommonButton from '../../components/CommonButton';
import { apiService } from '../../utils/storage';
import { API_ENDPOINTS } from '../../services/api';
import { addressDetailsService } from '../../services/apiServices';

const P2 = ({ onNext, onBack, formData, updateFormData }) => {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        { label: 'Personal Details', icon: 'bi bi-person', component: PersonalDetailsForm },
        { label: 'Address Details', icon: 'bi bi-geo-alt', component: AddressForm },
        { label: 'Customer Photo', icon: 'bi bi-image', component: CameraCapture }
    ];

    const handleNext = async () => {
        // If on Address Details step (step 1), call the API
        if (activeStep === 1) {
            // Prepare payload from formData
            const address = formData.addressDetails || {};
            const payload = {
                application_id: formData.application_id, // Make sure this is set
                per_complex_name: address.permanentAddress?.complexname || '',
                per_flat_no: address.permanentAddress?.flatnoroomno || '',
                per_area: address.permanentAddress?.area || '',
                per_landmark: address.permanentAddress?.landmark || '',
                per_country: address.permanentAddress?.country || '',
                per_pincode: address.permanentAddress?.pincode || '',
                per_city: address.permanentAddress?.city || '',
                per_district: address.permanentAddress?.district || '',
                per_state: address.permanentAddress?.state || '',
                cor_complex: address.correspondenceAddress?.complexname || '',
                cor_flat_no: address.correspondenceAddress?.flatnoroomno || '',
                cor_area: address.correspondenceAddress?.area || '',
                cor_landmark: address.correspondenceAddress?.landmark || '',
                cor_country: address.correspondenceAddress?.country || '',
                cor_pincode: address.correspondenceAddress?.pincode || '',
                cor_city: address.correspondenceAddress?.city || '',
                cor_district: address.correspondenceAddress?.district || '',
                cor_state: address.correspondenceAddress?.state || '',
            };
            try {
                const response = await addressDetailsService.create(payload);
                alert(response.data.message || 'Address details saved successfully.');
            } catch (err) {
                alert('Failed to save address details');
                return; // Prevent moving to next step if API fails
            }
        }
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
            handleNext();
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