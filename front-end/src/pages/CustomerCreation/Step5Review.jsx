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
      <div className="navigation-buttons">
        <button type="button" onClick={prevStep}>
          Previous
        </button>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Step5Review;
