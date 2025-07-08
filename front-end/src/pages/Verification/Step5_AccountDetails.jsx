import React, { useEffect, useState } from 'react';
import NominationForm from './Step5B_NominationDetails';
import PersonalDetailsForm from './Step5A_PersonalDetails';
import BankFacility from './Step5C_BankingFacility';
import '../../assets/css/StepperForm.css'; // Import your CSS file here
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { pendingAccountStatusUpdate } from '../../services/apiServices';
import { useParams } from 'react-router-dom';


const p5 = ({ onNext, onBack }) => {
    const [activeStep, setActiveStep] = useState(0);
    const { id } = useParams();
    const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];

    const admin_id = localStorage.getItem('userCode');

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
        { label: 'Nomination Details', icon: 'bi bi-people', component: NominationForm },
        { label: 'Banking Facilities', icon: 'bi bi-bank', component: BankFacility }
    ];

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

    // 5A step

    const rejpersonalDetails = async () => {
        const result = await Swal.fire({
            title: 'Reason for Rejection',
            input: 'text',
            inputLabel: 'Personal Details Rejection Reason',
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
            const payload = {
                application_id: Number(id),
                status: 'Rejected',
                status_comment: result.value,
                admin_id: admin_id
            };
            await pendingAccountStatusUpdate.updateS5A(id, payload);
            applicationStatus.push('Reject');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            setActiveStep(activeStep + 1);
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    };

    const revpersonalDetails = async () => {
        const result = await Swal.fire({
            title: 'Reason for Review',
            input: 'text',
            inputLabel: 'Personal Details Review Reason',
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
            const payload = {
                application_id: Number(id),
                status: 'Review',
                status_comment: result.value,
                admin_id: admin_id
            };
            await pendingAccountStatusUpdate.updateS5A(id, payload);
            applicationStatus.push('Review');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            setActiveStep(activeStep + 1);
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    };

    const apprvpersonalDetails = () => {
        try {
            const payload = {
                applicaiton_id: Number(id),
                status: 'Approved',
                status_comment: '',
                admin_id: admin_id
            }
            pendingAccountStatusUpdate.updateS5A(id, payload);
            applicationStatus.push('Approved');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            Swal.fire({
                icon: 'success',
                title: 'Personal Details Approved Successfully',
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            setActiveStep(activeStep + 1);
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error?.response?.data?.message,
            });
        }
    }

    // 5B step

    const rejnomineeDetails = async () => {
        const result = await Swal.fire({
            title: 'Reason for Rejection',
            input: 'text',
            inputLabel: 'Nominee  Details Rejection Reason',
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
            const payload = {
                application_id: Number(id),
                status: 'Rejected',
                status_comment: result.value,
                admin_id: admin_id
            };
            await pendingAccountStatusUpdate.updateS5B(id, payload);

            applicationStatus.push('Reject');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            setActiveStep(activeStep + 1);
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    };

    const revnomineeDetails = async () => {
        const result = await Swal.fire({
            title: 'Reason for Review',
            input: 'text',
            inputLabel: 'Nominee  Details Review Reason',
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
            const payload = {
                application_id: Number(id),
                status: 'Review',
                status_comment: result.value,
                admin_id: admin_id
            };
            await pendingAccountStatusUpdate.updateS5B(id, payload);

            applicationStatus.push('Review');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            setActiveStep(activeStep + 1);
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    };

    const apprvnomineeDetails = () => {
        try {
            const payload = {
                applicaiton_id: Number(id),
                status: 'Approved',
                status_comment: '',
                admin_id: admin_id
            }
            pendingAccountStatusUpdate.updateS5A(id, payload);
            Swal.fire({
                icon: 'success',
                title: 'Nominee  Details Approved Successfully',
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            });

            applicationStatus.push('Approved');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            setActiveStep(activeStep + 1);
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error?.response?.data?.message,
            });
        }
    }


    // 5C Banking
    const rejbankFacility = async () => {
        const result = await Swal.fire({
            title: 'Reason for Rejection',
            input: 'text',
            inputLabel: 'Banking Details Rejection Reason',
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
            const payload = {
                application_id: Number(id),
                status: 'Rejected',
                status_comment: result.value,
                admin_id: admin_id
            };
            await pendingAccountStatusUpdate.updateS5C(id, payload);

            applicationStatus.push('Reject');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            onNext();
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }

    };

    const revbankFacility = async () => {
        const result = await Swal.fire({
            title: 'Reason for Review',
            input: 'text',
            inputLabel: 'Bnaking Details Review Reason',
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
            const payload = {
                application_id: Number(id),
                status: 'Review',
                status_comment: result.value,
                admin_id: admin_id
            };
            await pendingAccountStatusUpdate.updateS5C(id, payload);
            applicationStatus.push('Review');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            onNext();
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }

    };

    const apprvbankFacility = () => {

        try {
            const payload = {
                applicaiton_id: Number(id),
                status: 'Approved',
                status_comment: '',
                admin_id: admin_id
            }
            pendingAccountStatusUpdate.updateS5C(id, payload);

            applicationStatus.push('Approved');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            Swal.fire({
                icon: 'success',
                title: 'Banking Details Approved Successfully',
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            onNext();
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error?.response?.data?.message,
            });
        }

    };


    return (
        <div className="">
            <div className="stepper-header">
                {steps.map((step, index) => {
                    // Determine the status
                    let status = '';
                    if (index < activeStep) {
                        status = 'Completed';
                    } else if (index === activeStep) {
                        status = 'In Review';
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


            <div className="nestedstepper-form-container" >
                <CurrentStepComponent
                    formData={formData}
                    onChange={handleFormChange}
                />
            </div>


            {/* <div className="next-back-btns">
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
            </div> */}




            <div className="next-back-btns">
                <CommonButton
                    className="text-red-500 border border-red-500 hover:bg-red-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
                    // onClick={activeStep === 0 ? handleRejectClick : handelPhotoReject}
                    onClick={() => {
                        if (activeStep === 0) {
                            rejpersonalDetails();
                        } else if (activeStep === 1) {
                            rejnomineeDetails();
                        } else if (activeStep === 2) {
                            rejbankFacility();
                        }
                    }}

                >
                    Reject & Continue
                </CommonButton>

                <CommonButton
                    className="text-amber-500 border border-amber-500 hover:bg-amber-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
                    // onClick={activeStep === 0 ? handleReviewClick : handelPhotoReview}
                    onClick={() => {
                        if (activeStep === 0) {
                            revpersonalDetails();
                        } else if (activeStep === 1) {
                            revnomineeDetails();
                        } else if (activeStep === 2) {
                            revbankFacility();
                        }
                    }}

                >
                    Review & Continue
                </CommonButton>

                <CommonButton
                    className="btn-next "
                    // onClick={activeStep === 0 ? handleNextStep : handelPhotoAccept}
                    onClick={() => {
                        if (activeStep === 0) {
                            apprvpersonalDetails();
                        } else if (activeStep === 1) {
                            apprvnomineeDetails();
                        } else if (activeStep === 2) {
                            apprvbankFacility();
                        }
                    }}

                // onClick={handleNextStep}
                >
                    Accept & Continue
                </CommonButton>
            </div>












        </div>
    );
};

export default p5;