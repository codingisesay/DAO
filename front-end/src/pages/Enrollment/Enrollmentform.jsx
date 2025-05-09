import React, { useState } from 'react';
import Page1 from './1';
import Page2 from './2';
import Page3 from './3';
import Page4 from './4';
import Page5 from './5';
import Page6 from './6';
import Stepper from './Stepper';

function Enrollmentform() {
    const [currentStep, setCurrentStep] = useState(2);
    const [complete, setComplete] = useState(false);

    const handleNext = () => {
        if (currentStep === 6) {
            setComplete(true);
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
                return <Page1 onNext={handleNext} />;
            case 2:
                return <Page2 onNext={handleNext} onBack={handleBack} />;
            case 3:
                return <Page3 onNext={handleNext} onBack={handleBack} />;
            case 4:
                return <Page4 onNext={handleNext} onBack={handleBack} />;
            case 5:
                return <Page5 onNext={handleNext} onBack={handleBack} />;
            case 6:
                return <Page6 onComplete={() => setComplete(true)} onBack={handleBack} />;
            default:
                return <Page1 onNext={handleNext} />;
        }
    };

    return (
        <div className="enrollment-form-container">
            <div className='flex justify-around items-center p-2'>
                <div className='md:w-1/5'>

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
                <div className='md:w-3/4 '>
                    <div className='w-full bg-white shadow-md rounded-lg p-6'>
                        {renderCurrentPage()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Enrollmentform;