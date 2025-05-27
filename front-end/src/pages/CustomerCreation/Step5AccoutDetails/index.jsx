import { useState } from "react";
import Step5PersonalDetails from "./Step5APrsonalDetails";
import Step5BNomination from "./Step5BNomination";
import Step5CBankDetails from "./Step5CBankDetails";

const Step2JobDetails = ({
  formData,
  handleChange,
  updateProgress,
  subProgress,
  completeStep,
  prevStep,
}) => {
  const [currentSubStep, setCurrentSubStep] = useState("5A");
  const stepLabels = {
    "5A": "Personal Details",
    "5B": "Nomination Details",
    "5C": "Banking Facilities",
  };
  const nextSubStep = () => {
    // First mark current step as completed
    updateProgress(currentSubStep, "completed");

    // Then move to next step
    if (currentSubStep === "5A") {
      setCurrentSubStep("5B");
      updateProgress("5B", "inprogress");
    } else if (currentSubStep === "5B") {
      setCurrentSubStep("5C");
      updateProgress("5C", "inprogress");
    } else if (currentSubStep === "5C") {
      completeStep();
    }
  };

  const prevSubStep = () => {
    // Mark current step as pending when going back
    updateProgress(currentSubStep, "pending");

    if (currentSubStep === "5B") {
      setCurrentSubStep("5A");
      updateProgress("5A", "inprogress");
    } else if (currentSubStep === "5C") {
      setCurrentSubStep("5B");
      updateProgress("5B", "inprogress");
    }
  };

  return (
    <div className="form-step">
      {/* 
      <div className="sub-steps">
        {["5A", "5B", "5C"].map((s) => (
          <div key={s} className="sub-step-container">
            <div className={`sub-step-circle ${subProgress[s] === "completed" ? "completed" : subProgress[s] === "inprogress" ? "inprogress" : ""}`}>
              {subProgress[s] === "completed" ? "✓" : s.replace("2", "")}
            </div>
            <div className="sub-step-label">Step {s.replace("2", "")}</div>
            <div className={`sub-step-badge ${subProgress[s] === "completed" ? "completed" : subProgress[s] === "inprogress" ? "inprogress" : ""}`}>
              {subProgress[s] === "completed" ? "Completed" : subProgress[s] === "inprogress" ? "In Progress" : "Pending"}
            </div>
            {s !== "5C" && (
              <div className={`sub-step-line ${subProgress[s] === "completed" ? "completed" : ""}`} />
            )}
          </div>
        ))}
      </div> */}

      <div className="stepper-header">
        {["5A", "5B", "5C"].map((s) => (
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





      {currentSubStep === "5A" && (
        <Step5PersonalDetails
          formData={formData}
          handleChange={handleChange}
          nextStep={nextSubStep}
          prevStep={prevStep}
        />
      )}
      {currentSubStep === "5B" && (
        <Step5BNomination
          formData={formData}
          handleChange={handleChange}
          nextStep={nextSubStep}
          prevStep={prevSubStep}
        />
      )}
      {currentSubStep === "5C" && (
        <Step5CBankDetails
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