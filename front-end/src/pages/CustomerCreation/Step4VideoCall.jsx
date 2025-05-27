
import VideoKYCInstructions from '../Enrollment/4A';
import CommonButton from '../../components/CommonButton';
import vcallimg from '../../assets/imgs/vcall_illustration.jpg';
const Step4VideoCall = ({
  formData,
  handleChange,
  nextStep,
  prevStep,
  skipStep,
}) => {
  return (
    <div className="form-step">
      <h2>Step 4: Video Call (Optional)</h2>

      <VideoKYCInstructions />


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="img-container">
          <img
            src={vcallimg}
            alt="KYC"
            className="zoom-in-image"
          />
        </div>
        <div className="text-center mt-4 flex flex-col items-center justify-center">
          <CommonButton
            className="btn-login my-3 w-[200px]"
            disabled={true}
          >
            Self V-KYC
          </CommonButton>

          <CommonButton onClick={skipStep}
            className="btn-login my-3 w-[200px]"
          >
            Skip V-KYC & Next
          </CommonButton>
          {/* <button type="button" onClick={skipStep} className="skip-button"> Skip        </button> */}


          <CommonButton
            className="btn-login my-3 w-[200px]"
          >
            Assisted V-KYC
          </CommonButton>
        </div>
      </div>

      <div className="navigation-buttons">
        <button type="button" onClick={prevStep}>
          Previous
        </button>
        <button type="button" onClick={nextStep}>
          Next
        </button>

      </div>
    </div>
  );
};

export default Step4VideoCall;
