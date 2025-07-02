

import React, { useEffect, useState } from 'react';
import Page1 from './Step1_EnrollmentDetails';
import Page2 from './Step2_CustomerApplication';
import Page3 from './Step3_DocumentUpload';
import Page4 from './Step4_VideoCallMain';
import Page5 from './Step5_AccountDetails';
import Page6 from './Step6_SummarySheet';
import Stepper from './Stepper';
import { agentService } from '../../services/apiServices';
import { useParams } from 'react-router-dom';
import Footer from '../../components/Footer';

function Enrollmentform() {  
    const [currentStep, setCurrentStep] = useState(1);
    const [complete, setComplete] = useState(false);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();


    localStorage.setItem('vcall', JSON.stringify(false));
    // const application_no = localStorage.getItem('application_no')
    // Centralized form data state
    const [formData, setFormData] = useState({
        application_no: '',
        applicationType: '',
        salutation: '',
        verificationOption: '',
        verificationNumber: '', email: '',
        correspondenceAddressSame: false,
        personalDetails: {
            firstName: '',
            middleName: '',
            lastName: '',
            dob: '',
            gender: '',
            mobile: '',
            complexName: '',
            flatNoRoomNo: '',
            area: '',
            landmark: '',
            country: '',
            pincode: '',
            city: '',
            district: '',
            state: '', email: '',
        },
        permanentAddress: {},
        correspondenceAddress: {},
        documents: {
            identityProof: null,
            addressProof: null,
            signatureProof: null,
            customerPhoto: null
        },
        personalDetailsf5: [],
    });
    // Update form data handler
 
     useEffect(() => {
     
    const fetchAndStoreDetails = async (id) => {
        try {
            setLoading(true);
            const response = await agentService.refillApplication(id);
            console.log(response)
        } catch (error) {
            console.error("Failed to fetch review applications:", error);
        } finally {
            setLoading(false);
        }
    }; 
    
        fetchAndStoreDetails();
    }, [id]);

  



    const updateFormData = (step, data) => {
        setFormData(prev => {
            if (step === 1) {
                return {
                    ...prev,
                    ...data
                };
            } else if (step === 2) {
                return {
                    ...prev,
                    personalDetails: { ...prev.personalDetails, ...data.personalDetails },
                    permanentAddress: { ...prev.permanentAddress, ...data.permanentAddress },
                    correspondenceAddressSame: data.correspondenceAddressSame,
                    correspondenceAddress: data.correspondenceAddressSame
                        ? { ...prev.permanentAddress }
                        : { ...prev.correspondenceAddress, ...data.correspondenceAddress }
                };
            } else if (step === 3) {
                return {
                    ...prev,
                    documents: data.documents
                };
            }
            else if (step === 5) {
                return {
                    ...prev,
                    ...data
                };
            }

            // Add cases for other steps as needed
            return { ...prev, ...data };
        });
    };



    const handleNext = () => {
        // console.log('Final form data:', formData);
        if (currentStep === 6) {
            setComplete(true);
            // On final submission
            // Here you would typically send the data to your API
        } else {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const renderCurrentPage = () => {
        switch (currentStep) {
            case 1:
                return <Page1
                    onNext={handleNext}
                    formData={formData}
                    updateFormData={updateFormData}
                />;
            case 2:
                return <Page2
                    onNext={handleNext}
                    onBack={handleBack}
                    formData={formData}
                    updateFormData={updateFormData}
                />;
            case 3:
                return <Page3
                    onNext={handleNext}
                    onBack={handleBack}
                    formData={formData}
                    updateFormData={updateFormData}
                />;
            case 4:
                return <Page4
                    onNext={handleNext}
                    onBack={handleBack}
                    formData={formData}
                    updateFormData={updateFormData}
                />;
            case 5:
                return <Page5
                    onNext={handleNext}
                    onBack={handleBack}
                    formData={formData}
                    updateFormData={updateFormData}
                />;
            case 6:
                return <Page6
                    onComplete={() => {
                        setComplete(true);
                        // console.log('Final form data:', formData);
                    }}
                    onBack={handleBack}
                    formData={formData}
                />;
            default:
                return <Page6
                    onComplete={() => {
                        setComplete(true);
                        // console.log('Final form data:', formData);
                    }}
                    onBack={handleBack}
                    formData={formData}
                />;
            // <Page1
            //     onNext={handleNext}
            //     formData={formData}
            //     updateFormData={updateFormData}
            // />;
        }
    };

    return (
        <>
        <div className="enrollment-form-container px-1 pt-1">
            <div className='flex justify-around items-center flex-wrap'>
                <div className='xl:w-1/5 lg:w-1/4 md:w-2/6 sm:w-1/3 p-1'>
                    <Stepper
                        currentStep={currentStep}
                        complete={complete}
                        steps={[
                            { subtitle: "STEP 1", title: "Enrollment Details", icon: "bi bi-clipboard-minus" },
                            { subtitle: "STEP 2", title: "Customer Application", icon: "bi bi-file-earmark-text" },
                            { subtitle: "STEP 3", title: "Document Details", icon: "bi bi-file-earmark-richtext" },
                            { subtitle: "STEP 4", title: "Video - KYC", icon: "bi bi-person-badge" },
                            { subtitle: "STEP 5", title: "Account Details", icon: "bi bi-person-vcard" },
                            { subtitle: "STEP 6", title: "Summary Sheet", icon: "bi bi-file-text" }
                        ]}
                    />
                </div>
                <div className='xl:w-4/5 lg:w-3/4 md:w-4/6 sm:w-2/3 p-1'>
                    <div className='work-area dark:bg-gray-900'>
                        {renderCurrentPage()}
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
}

export default Enrollmentform; 