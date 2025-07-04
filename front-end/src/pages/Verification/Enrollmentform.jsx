import React, { useState } from "react";
import Page1 from "./Step1_EnrollmentDetails";
import Page2 from "./Step2_CustomerApplication";
import Page3 from "./Step3_DocumentUpload";
import Page4 from "./Step4_VideoCallMain";
import Page5 from "./Step5_AccountDetails";
import Page6 from "./Step6_SummarySheet";
import Stepper from "./Stepper";
import Footer from "../../components/Footer";

function Enrollmentform() {
  const [currentStep, setCurrentStep] = useState(1);
  const [complete, setComplete] = useState(false);

  // Centralized form data state
  const [formData, setFormData] = useState({});

  // Update form data handler
  const updateFormData = (step, data) => {
    setFormData((prev) => {
      if (step === 1) {
        return {
          ...prev,
          ...data,
        };
      } else if (step === 2) {
        return {
          ...prev,
          personalDetails: { ...prev.personalDetails, ...data.personalDetails },
          permanentAddress: {
            ...prev.permanentAddress,
            ...data.permanentAddress,
          },
          correspondenceAddressSame: data.correspondenceAddressSame,
          correspondenceAddress: data.correspondenceAddressSame
            ? { ...prev.permanentAddress }
            : { ...prev.correspondenceAddress, ...data.correspondenceAddress },
        };
      }
      // Add cases for other steps as needed
      return { ...prev, ...data };
    });
  };

  const handleNext = () => {
    if (currentStep === 6) {
      setComplete(true);
      // On final submission
      console.log("Final form data:", formData);
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
        return (
          <Page1
            onNext={handleNext}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <Page2
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <Page3
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return (
          <Page4
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 5:
        return (
          <Page5
            onNext={handleNext}
            onBack={handleBack}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 6:
        return (
          <Page6
            onComplete={() => {
              setComplete(true);
              console.log("Final form data:", formData);
            }}
            onBack={handleBack}
            formData={formData}
          />
        );
      default:
        return (
          <Page1
            onNext={handleNext}
            formData={formData}
            updateFormData={updateFormData}
          />
        );
    }
  };

  return (
    <>
      <div className="enrollment-form-container">
        <div className="flex justify-around items-center flex-wrap">
          <div className="xl:w-1/5 lg:w-1/4 md:w-2/6 sm:w-1/3 p-2">
            <Stepper
              currentStep={currentStep}
              complete={complete}
              steps={[
                {
                  subtitle: "STEP 1",
                  title: "Enrollment Details",
                  icon: "bi bi-clipboard-minus",
                },
                {
                  subtitle: "STEP 2",
                  title: "Customer Application",
                  icon: "bi bi-file-earmark-text",
                },
                {
                  subtitle: "STEP 3",
                  title: "Document Details",
                  icon: "bi bi-file-earmark-richtext",
                },
                {
                  subtitle: "STEP 4",
                  title: "Video - KYC",
                  icon: "bi bi-person-badge",
                },
                {
                  subtitle: "STEP 5",
                  title: "Account Details",
                  icon: "bi bi-person-vcard",
                },
                {
                  subtitle: "STEP 6",
                  title: "Summary Sheet",
                  icon: "bi bi-file-text",
                },
              ]}
            />
          </div>
          <div className="xl:w-4/5 lg:w-3/4 md:w-4/6 sm:w-2/3 p-2">
            <div className="work-area dark:bg-gray-900 ">
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
