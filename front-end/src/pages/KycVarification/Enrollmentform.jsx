

import React, { useState } from 'react';
import Page1 from './1'; 
import Page3 from './3';
import Page4 from './4'; 
import Stepper from './Stepper';

function Enrollmentform() {
    const [currentStep, setCurrentStep] = useState(1);
    const [complete, setComplete] = useState(false);

    // Centralized form data state
    const [formData, setFormData] = useState({});

    // Update form data handler
    const updateFormData = (step, data) => {
        setFormData(prev => {
            if (step === 1) {
                return {
                    ...prev,
                    ...data
                };
            } else if (step === 3) {
                return {
                    ...prev, ...data
                };
            } 
            return { ...prev, ...data };
        });
    };

    const handleNext = () => {
        if (currentStep === 6) {
            setComplete(true);
            // On final submission
            console.log('Final form data:', formData);
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
            default:
                return <Page4
                    onNext={handleNext}
                    onBack={handleBack}
                    formData={formData}
                    updateFormData={updateFormData}
                />;
        }
    };

    return (
        <div className="enrollment-form-container">
            <div className='flex justify-around items-center flex-wrap'>
                <div className='xl:w-1/5 lg:w-1/4 md:w-2/6 sm:w-1/3 p-2'>
                    <Stepper
                        currentStep={currentStep}
                        complete={complete}
                        steps={[
                            { subtitle: "STEP 1", title: "Enrollment Details", icon: "bi bi-clipboard-minus" }, 
                            { subtitle: "STEP 2", title: "Document Details", icon: "bi bi-file-earmark-richtext" }, 
                            { subtitle: "STEP 4", title: "Video - KYC", icon: "bi bi-person-badge" }, 
                        ]}
                    />
                </div>
                <div className='xl:w-4/5 lg:w-3/4 md:w-4/6 sm:w-2/3 p-2'>
                    <div className='work-area'>
                        {renderCurrentPage()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Enrollmentform; 