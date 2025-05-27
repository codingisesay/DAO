import React from 'react';
import CommonButton from '../../../components/CommonButton';
const Step5Review = ({ formData, prevStep, handleSubmit }) => {
  return (
    <div className="form-step">
      <h2>Step 5: Review Your Information</h2>
      <div className="review-section">
        <h3>Personal Information</h3>
        <p>Full Name: {formData.fullName}</p>
        <p>Email: {formData.email}</p>
        <p>Mobile No: {formData.mobileNo}</p>

        <h3>Job Details</h3>
        <p>Job Details: {formData.jobDetails}</p>
        <p>Salary Details: {formData.salaryDetails}</p>
        <p>Current Address: {formData.currentAddress}</p>
        <p>Photo: {formData.photo ? formData.photo.name : "Not uploaded"}</p>
        <p>
          Signature:{" "}
          {formData.signature ? formData.signature.name : "Not uploaded"}
        </p>

        <h3>Nomination Details</h3>
        <p>{formData.nominationDetails}</p>

        <h3>Video Call</h3>
        <p>{formData.videoCall ? "Requested" : "Not requested"}</p>
      </div>

      <div className="next-back-btns z-10">
        <CommonButton className="btn-back border-0" onClick={prevStep}>
          <i className="bi bi-chevron-double-left"></i>&nbsp;Back
        </CommonButton>
        <CommonButton
          className="btn-next border-0"
          onClick={handleSubmit}
        >
          Submit
        </CommonButton>
      </div>


    </div>
  );
};

export default Step5Review;
