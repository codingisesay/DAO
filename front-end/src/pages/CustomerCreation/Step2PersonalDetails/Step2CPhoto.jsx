
import React from 'react';
import PhotoCapture from '../../Enrollment/CustomerPhotoCapture';
import CommonButton from '../../../components/CommonButton';
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


      <div className="next-back-btns z-10">
        <CommonButton className="btn-back border-0" onClick={prevStep}>
          <i className="bi bi-chevron-double-left"></i>&nbsp;Back
        </CommonButton>
        <CommonButton
          className="btn-next border-0"
          onClick={nextStep}
        >
          Next&nbsp;<i className="bi bi-chevron-double-right"></i>
        </CommonButton>
      </div>

    </>
  );
};

export default Step2CPhotoSignature;
