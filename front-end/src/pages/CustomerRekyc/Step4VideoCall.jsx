
import VideoKYCInstructions from '../Enrollment/4A';
import CommonButton from '../../components/CommonButton';
import vcallimg from '../../assets/imgs/vcall_illustration.jpg';
import { nav } from 'framer-motion/client';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
const Step4VideoCall = ({
  formData,
  handleChange,
  nextStep,
  prevStep,
  // skipStep,
}) => {
  const navigate = useNavigate();

  const skipStep = () => {
    Swal.fire({
      title: 'Application Submitted without VideoKYC!',
      text: 'You have chosen to skip VideoKYC.',
      icon: 'info',
      confirmButtonText: 'OK'
    });
  };
  const handleCombinedSubmit = (e) => {
    e.preventDefault();
    localStorage.removeItem('nominationFormData');
    localStorage.removeItem('documentData');
    localStorage.removeItem('application_id');

    // First show main submission message
    Swal.fire({
      title: 'Application Submitted!',
      text: 'Your application has been received successfully.',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        // Optionally trigger the second message
        skipStep();  // This shows the skipped KYC message

        // Navigate after showing both messages
        navigate('/agentDashboard');
      }
    });
  };


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

          <CommonButton
            onClick={handleCombinedSubmit}
            // onClick={skipStep}
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


      <div className="next-back-btns z-10">
        <CommonButton className="btn-back border-0" onClick={prevStep}>
          <i className="bi bi-chevron-double-left"></i>&nbsp;Back
        </CommonButton>
        <CommonButton
          className="btn-next border-0"
          onClick={handleCombinedSubmit}
        >
          Submit Application
        </CommonButton>
      </div>
    </div>
  );
};

export default Step4VideoCall;
