import React, { act, useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonalDetailsForm from "./Step6A_SummaryPrint";
import CameraCapture from "./Step6B_AgentLivePhoto";
import "../../assets/css/StepperForm.css"; // Import your CSS file here
import CommonButton from "../../components/CommonButton";
import Swal from "sweetalert2";
const p6 = ({ onNext, onBack }) => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate =useNavigate();
  const [formData, setFormData] = useState({
    // Personal Details
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Address Details
    permanentAddress: {
      complexName: "",
      country: "India",
      state: "",
      flatNo: "",
      pinCode: "",
      residentVN: "",
    },
    correspondenceAddressSame: false,
    correspondenceAddress: {
      complexName: "",
      country: "",
      state: "",
      flatNo: "",
      pinCode: "",
    },
    area: "",
    city: "",
    residenceStatus: "",
    nearbyLandmark: "",
    district: "",
    residenceDocument: null,

    // Photo
    customerPhoto: null,
  });

  const steps = [
    {
      label: "Customer Application",
      icon: "bi bi-person",
      component: PersonalDetailsForm,
    },
    { label: "Agent Photo", icon: "bi bi-image", component: CameraCapture },
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
    setFormData((prev) => {
      // Handle nested objects (like addresses)
      if (name.includes(".")) {
        const [parent, child] = name.split(".");
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const CurrentStepComponent = steps[activeStep].component;

  const CreateAccount = () => {  
    //  window.location.href = "/agentdashboard";
        navigate(-1);
      };
  return (
    <div className="">
      <div className="stepper-header">
        {steps.map((step, index) => {
          // Determine the status
          let status = "";
          if (index < activeStep) {
            status = "Completed";
          } else if (index === activeStep) {
            status = "In Progress";
          } else {
            status = "Pending";
          }

          return (
            <div
              key={index}
              className={`step ${index === activeStep ? "active" : ""} ${
                index < activeStep ? "completed" : ""
              }`}
            >
              <div className="step-number">
                <i className={step.icon}></i>
              </div>
              <div className="step-title">Step {index + 1}</div>
              <div className="step-label">{step.label}</div>
              <span
                className={`badge badge-${status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {status}
              </span>
            </div>
          );
        })}
      </div>

      <div className="nestedstepper-form-container">
        <CurrentStepComponent
          formData={formData}
          onChange={handleFormChange}
          onNext={handleNext}
          onBack={handleBack}
        />
      </div>
 
        <>
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
              // onClick={CreateAccount}
              onClick={  CreateAccount  }
              iconRight={<i className="bi bi-chevron-double-right"></i>}
            >
              {activeStep === 1 ? (
                <>Close</>
              ) : (
                <>
                  Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </>
              )}
            </CommonButton>
          </div>
        </>
 
    </div>
  );
};

export default p6;
