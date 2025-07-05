
import React, { useState } from 'react';
import AddressForm from './Step2B_AddressDetails';
import PersonalDetailsForm from './Step2A_PersonalDetails';
import CameraCapture from './Step2C_CustoemerLivePhoto';
import '../../assets/css/StepperForm.css';
import CommonButton from '../../components/CommonButton';
import { createAccountService } from '../../services/apiServices';
import Swal from 'sweetalert2';
import { form } from 'framer-motion/client';
import { swap } from '@tensorflow/tfjs-core/dist/util_base';

const P2 = ({ onNext, onBack, formData, updateFormData }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleStepSubmit = (stepData) => {
        updateFormData(2, stepData);
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setIsSubmitting(true);

        try {
            if (activeStep === 0) {
                console.log('2A formadta : ', formData.personalDetails)
                const pd = formData.personalDetails || {};
                if (
                    /\d/.test(pd.first_name) ||
                    /\d/.test(pd.middle_name) ||
                    /\d/.test(pd.last_name)
                ) {
                    Swal.fire({
                        icon: 'error',
                        text: 'Only alphabets allowed. Numbers are not allowed in name fields.',
                    });
                    return;
                }

             let missingFields = [];

            if (!pd.email) missingFields.push("Email");
            if (!pd.caste) missingFields.push("Caste");
            if (!pd.religion) missingFields.push("Religion");

            if (missingFields.length > 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Missing Required Fields',
                    html: 'Please fill the following fields:<br><b>' + missingFields.join('</b><br><b>') + '</b>',
                });
                return;
            }


                else if (pd.mobile.length != 10) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error saving personal details',
                        text: '10 Digit Must for Mobile Number ',
                    }); return
                }
                else if (pd.alt_mob_no.length != 10) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error saving personal details',
                        text: '10 Digit Must for Alternate Mobile Number ',
                    }); return
                }
                else if (pd.pannumber.length != 10) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error saving personal details',
                        text: 'Invalid PAN Number',
                    }); return
                }

                const payload = {
                    application_id: formData.application_id,
                    salutation: pd.salutation,
                    religion: pd.religion,
                    caste: pd.caste,
                    marital_status: pd.maritalStatus ? pd.maritalStatus.toUpperCase() : undefined,
                    alt_mob_no: pd.alt_mob_no,
                    email: pd.email,
                    adhar_card: pd.adhar_card,
                    pan_card: pd.pannumber,
                    passport: pd.passport,
                    driving_license: pd.driving_license,
                    voter_id: pd.voterid,
                    status: 'Pending'
                };

                try {
                    let response = await createAccountService.personalDetails_s2a(payload);

                    Swal.fire({
                        icon: 'success',
                        title: response.data.message || 'Personal details saved successfully.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    handleNext();

                } catch (error) {
                    console.error("Error saving personal details:", error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error saving personal details',
                        text: error.response?.data?.message || 'Required field contains invalid data.',
                    });
                }
            }
        } catch (err) {
            console.error("Submission error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const CurrentStepComponent = steps[activeStep].component;

    return (
        <div className="multi-step-form">
            {isSubmitting && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            )}

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
                    isSubmitting={isSubmitting}
                />
            </div>

            <div className="next-back-btns">
                <CommonButton
                    className="btn-back"
                    onClick={activeStep === 0 ? onBack : handleBack}
                    iconLeft={<i className="bi bi-chevron-double-left"></i>}
                    disabled={isSubmitting}
                >
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>

                <CommonButton
                    className="btn-next"
                    onClick={
                        activeStep === 0
                            ? handleSubmit
                            : onNext
                    }
                    iconRight={<i className="bi bi-chevron-double-right"></i>}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="animate-spin inline-block mr-2">↻</span>
                            Processing...
                        </>
                    ) : (
                        <>
                            Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                        </>
                    )}
                </CommonButton>
            </div>
        </div>
    );
};

export default P2;