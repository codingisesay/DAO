import { useState } from "react";
import Step2AJobInfo from "./Step2AJobInfo";
import Step2BAddress from "./Step2BAddress";
import Step2CPhotoSignature from "./Step2CPhoto";

const Step2JobDetails = ({
  formData,
  handleChange,
  updateProgress,
  subProgress,
  completeStep,
  prevStep,
}) => {
  const [currentSubStep, setCurrentSubStep] = useState("2A");
  const stepLabels = {
    "2A": "Personal Details",
    "2B": "Address Details",
    "2C": "Customer Photo",
  };
  const nextSubStep = () => {
    // First mark current step as completed
    updateProgress(currentSubStep, "completed");

    // Then move to next step
    if (currentSubStep === "2A") {
      setCurrentSubStep("2B");
      updateProgress("2B", "inprogress");
    } else if (currentSubStep === "2B") {
      setCurrentSubStep("2C");
      updateProgress("2C", "inprogress");
    } else if (currentSubStep === "2C") {
      completeStep();
    }
  };

  const prevSubStep = () => {
    // Mark current step as pending when going back
    updateProgress(currentSubStep, "pending");

    if (currentSubStep === "2B") {
      setCurrentSubStep("2A");
      updateProgress("2A", "inprogress");
    } else if (currentSubStep === "2C") {
      setCurrentSubStep("2B");
      updateProgress("2B", "inprogress");
    }
  };

  return (
    <div className="form-step">
      {/* 
      <div className="sub-steps">
        {["2A", "2B", "2C"].map((s) => (
          <div key={s} className="sub-step-container">
            <div className={`sub-step-circle ${subProgress[s] === "completed" ? "completed" : subProgress[s] === "inprogress" ? "inprogress" : ""}`}>
              {subProgress[s] === "completed" ? "✓" : s.replace("2", "")}
            </div>
            <div className="sub-step-label">Step {s.replace("2", "")}</div>
            <div className={`sub-step-badge ${subProgress[s] === "completed" ? "completed" : subProgress[s] === "inprogress" ? "inprogress" : ""}`}>
              {subProgress[s] === "completed" ? "Completed" : subProgress[s] === "inprogress" ? "In Progress" : "Pending"}
            </div>
            {s !== "2C" && (
              <div className={`sub-step-line ${subProgress[s] === "completed" ? "completed" : ""}`} />
            )}
          </div>
        ))}
      </div> */}

      <div className="stepper-header">
        {["2A", "2B", "2C"].map((s) => (
          <div key={s} className="step">
            <div
              className={`sub-step-circle ${subProgress[s] === "completed"
                ? "completed"
                : subProgress[s] === "inprogress"
                  ? "inprogress"
                  : ""
                }`}
            >
              {subProgress[s] === "completed" ? "✓" : s.replace("2", "")}
            </div>
            <div className="sub-step-label">{stepLabels[s]}</div>
            <div
              className={`sub-step-badge ${subProgress[s] === "completed"
                ? "completed"
                : subProgress[s] === "inprogress"
                  ? "inprogress"
                  : ""
                }`}
            >
              {subProgress[s] === "completed"
                ? "Completed"
                : subProgress[s] === "inprogress"
                  ? "In Progress"
                  : "Pending"}
            </div>
          </div>
        ))}
      </div>





      {currentSubStep === "2A" && (
        <Step2AJobInfo
          formData={formData}
          handleChange={handleChange}
          nextStep={nextSubStep}
          prevStep={prevStep}
        />
      )}
      {currentSubStep === "2B" && (
        <Step2BAddress
          formData={formData}
          handleChange={handleChange}
          nextStep={nextSubStep}
          prevStep={prevSubStep}
        />
      )}
      {currentSubStep === "2C" && (
        <Step2CPhotoSignature
          formData={formData}
          handleChange={handleChange}
          nextStep={nextSubStep}
          prevStep={prevSubStep}
        />
      )}
    </div>
  );
};

export default Step2JobDetails;