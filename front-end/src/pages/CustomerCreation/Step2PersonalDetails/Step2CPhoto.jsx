
import React from 'react';
import PhotoCapture from '../../Enrollment/CustomerPhotoCapture';
const Step2CPhotoSignature = ({
  formData,
  handleChange,
  nextStep,
  prevStep,
}) => {
  return (
    <>
      <h2>Step 2C: Photo and Signatureee</h2>
      <div className="form-group">

        <PhotoCapture
          photoType="customer"
          onCapture={(data) => { setLocalFormData(data); console.log('After cature : ', data) }}
        />
      </div>
      <div className="navigation-buttons">
        <button type="button" onClick={prevStep}>
          Previous
        </button>
        <button type="button" onClick={nextStep}>
          Next Step
        </button>
      </div>
    </>
  );
};

export default Step2CPhotoSignature;
