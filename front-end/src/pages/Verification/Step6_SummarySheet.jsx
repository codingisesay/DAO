import React, { useEffect, useState } from "react";
import PersonalDetailsForm from "./Step6A_SummaryPrint";
import CameraCapture from "./Step6B_AgentLivePhoto";
import "../../assets/css/StepperForm.css"; // Import your CSS file here
import CommonButton from "../../components/CommonButton";
import Swal from "sweetalert2";
import { pendingAccountStatusUpdate } from "../../services/apiServices";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const p6 = ({ onNext, onBack }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL parameters
  const [activeStep, setActiveStep] = useState(0);
  const applicationStatus =
    JSON.parse(localStorage.getItem("approveStatusArray")) || [];
  const [isDisabled, setIsDisabled] = useState(false);

  const admin_id = localStorage.getItem("userCode");

  useEffect(() => {
    // Get the array from localStorage
    const storedArray =
      JSON.parse(localStorage.getItem("approveStatusArray")) || [];

    // Check if it contains 'Review' or 'Reject'
    const containsReviewOrReject = storedArray.some(
      (status) => status == "Review" || status == "Reject"
    );

    // Set button disabled state
    setIsDisabled(containsReviewOrReject);
  }, []); // Runs once on component mount

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

  const handleRejectClick = async () => {
    const result = await Swal.fire({
      title: "Reason for Rejection",
      input: "text",
      inputLabel: "Please provide a reason",
      inputPlaceholder: "Enter reason here...",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      className: "btn-login",
      inputValidator: (value) => {
        if (!value) {
          return "You need to write a reason!";
        }
      },
    });

    if (result.isConfirmed && result.value) {
      const payload = {
        application_id: Number(id),
        status: "Rejected",
        status_comment: result.value,
        admin_id: admin_id,
      };
      await pendingAccountStatusUpdate.updateS6B(id, payload);

      applicationStatus.push("Reject");
      localStorage.setItem(
        "approveStatusArray",
        JSON.stringify(applicationStatus)
      );
      // console.log('Payload:', payload);

      navigate("/admindashboard");
    } else if (result.isDismissed) {
      console.log("Rejection canceled");
    }
  };

  const handleReviewClick = async () => {
    const result = await Swal.fire({
      title: "Reason for Review",
      input: "text",
      inputLabel: "Please provide a reason",
      inputPlaceholder: "Enter reason here...",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      className: "btn-login",
      inputValidator: (value) => {
        if (!value) {
          return "You need to write a reason!";
        }
      },
    });

    if (result.isConfirmed && result.value) {
      const payload = {
        application_id: Number(id),
        status: "Review",
        status_comment: result.value,
        admin_id: admin_id,
      };
      await pendingAccountStatusUpdate.updateS6B(id, payload);
      applicationStatus.push("Review");
      localStorage.setItem(
        "approveStatusArray",
        JSON.stringify(applicationStatus)
      );

      // console.log('Payload:', payload);
      navigate("/admindashboard"); // pass the payload forward
    } else if (result.isDismissed) {
      console.log("Rejection canceled");
    }
  };

  const handleNextStep = () => {
    // alert('called')
    try {
      const payload = {
        applicaiton_id: Number(id),
        status: "Approved",
        status_comment: "",
        admin_id: admin_id,
      };
      const response = pendingAccountStatusUpdate.updateS6B(id, payload);
      applicationStatus.push("Approved");
      localStorage.setItem(
        "approveStatusArray",
        JSON.stringify(applicationStatus)
      );

      Swal.fire({
        icon: "success",
        title: "Enrollment Details Approved Successfully",
        timer: 2000, // alert stays for 2 seconds
        showConfirmButton: false, // no "OK" button
        allowOutsideClick: false, // optional: prevent closing by clicking outside
        allowEscapeKey: false, // optional: prevent closing with Escape key
        didOpen: () => {
          Swal.showLoading(); // optional: show loading spinner
        },
      });

      navigate("/admindashboard"); // Navigate to the admin dashboard after success
      localStorage.getItem("application_id".remove());
    } catch (error) {
      // console.error('Error updating status:', error);
      // Swal.fire({
      //     icon: 'error',
      //     title: 'Oops...',
      //     text: 'Something went wrong while updating the status!',
      // });

      Swal.fire({
        icon: "success",
        title: "Agent Photo Approved Successfully",
        timer: 2000, // alert stays for 2 seconds
        showConfirmButton: false, // no "OK" button
        allowOutsideClick: false, // optional: prevent closing by clicking outside
        allowEscapeKey: false, // optional: prevent closing with Escape key
        didOpen: () => {
          Swal.showLoading(); // optional: show loading spinner
        },
      });

      navigate("/admindashboard"); // Navigate to the admin dashboard after success
    }
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

      <div className="next-back-btns">
        {activeStep === 1 ? (
          <>
            <div className="next-back-btns">
              <CommonButton
                className="text-red-500 border border-red-500 hover:bg-red-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
                onClick={handleRejectClick}
              >
                Reject & Continue
              </CommonButton>

              <CommonButton
                className="text-amber-500 border border-amber-500 hover:bg-amber-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
                onClick={handleReviewClick}
              >
                Review & Continue
              </CommonButton>

              <CommonButton
                className="btn-next "
                onClick={handleNextStep}
                disabled={isDisabled}
              >
                Accept & Continue
              </CommonButton>
            </div>
          </>
        ) : (
          <>
            <CommonButton
              className="btn-next"
              // onClick={CreateAccount}
              onClick={handleNext}
              iconRight={<i className="bi bi-chevron-double-right"></i>}
            >
              {activeStep === 1 ? (
                <>Submit</>
              ) : (
                <>
                  Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </>
              )}
            </CommonButton>
          </>
        )}
      </div>
    </div>
  );
};

export default p6;
