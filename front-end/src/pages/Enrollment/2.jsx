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
        if (e && e.preventDefault) e.preventDefault(); handleNext();
        // try {
        //     if (activeStep === 0) {
        //         // Personal Details API
        //         const pd = formData.personalDetails || {};
        //         const payload = {
        //             application_id: formData.application_id,
        //             salutation: pd.salutation,
        //             religion: pd.religion,
        //             caste: pd.caste,
        //             marital_status: pd.maritalStatus ? pd.maritalStatus.toUpperCase() : undefined,
        //             alt_mob_no: pd.alternatemobile,
        //             email: pd.email,
        //             adhar_card: pd.aadharnumber,
        //             pan_card: pd.pannumber,
        //             passport: pd.passportno,
        //             driving_license: pd.drivinglicence,
        //             voter_id: pd.voterid,
        //             status: formData.status,
        //         };

        //         let response = await apiService.post(API_ENDPOINTS.PERSONAL_DETAILS.CREATE, payload);
        //         alert(response.data.message || 'Personal details saved successfully.');
        //         handleNext();
        //     } else if (activeStep === 1) {
        //         const ad = formData.addressDetails || {};
        //         console.log("DEBUG: addressDetails in formData", ad);
        //         // Address Details API
        //         const payload = {
        //             application_id: formData.application_id,
        //             per_complex_name: ad.perComplexName,
        //             per_flat_no: ad.perFlatNo,
        //             per_area: ad.perArea,
        //             per_landmark: ad.perLandmark,
        //             per_country: ad.perCountry,
        //             per_pincode: ad.perPincode,
        //             per_city: ad.perCity,
        //             per_district: ad.perDistrict,
        //             per_state: ad.perState,
        //             per_resident: ad.perResident,
        //             per_residence_status: ad.perResidenceStatus,
        //             resi_doc: ad.resiDoc,
        //             cor_complex: ad.corComplex,
        //             cor_flat_no: ad.corFlatNo,
        //             cor_area: ad.corArea,
        //             cor_landmark: ad.corLandmark,
        //             cor_country: ad.corCountry,
        //             cor_pincode: ad.corPincode,
        //             cor_city: ad.corCity,
        //             cor_district: ad.corDistrict,
        //             cor_state: ad.corState,
        //             status: formData.status,
        //         };

        //         let response = await apiService.post(API_ENDPOINTS.ADDRESS_DETAILS.CREATE, payload);
        //         alert(response.data.message || 'Address details saved successfully.');

        //     }
        // } catch (err) {
        //     // ...error handling...
        // }
    };

    const handleAddressSubmit = async () => {
        try {
            const ad = formData.addressDetails || formData; // adjust as per your state shape
            const payload = {

                application_id: "APP202505220001",
                per_complex_name: "Green Valley Residency",
                per_flat_no: "B-204",
                per_area: "Andheri East",
                per_landmark: "Near Metro Station",
                per_country: "India",
                per_pincode: "400069",
                per_city: "Mumbai",
                per_district: "Mumbai Suburban",
                per_state: "Maharashtra",
                cor_complex: "Skyline Heights",
                cor_flat_no: "D-501",
                cor_area: "Powai",
                cor_landmark: "Opposite Hiranandani Hospital",
                cor_country: "India",
                cor_pincode: "400076",
                cor_city: "Mumbai",
                cor_district: "Mumbai Suburban",
                cor_state: "Maharashtra",


                status: null, // or as needed
            };

            const response = await apiService.post(API_ENDPOINTS.ADDRESS_DETAILS.CREATE, payload);
            alert(response.data.message || 'Address details saved successfully.');
            handleNext();
        } catch (err) {
            alert('Failed to save address details');
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
                            ? handleSubmit // Personal Details
                            : activeStep === 1
                                ? handleAddressSubmit // Address Details
                                : onNext // Photo step
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