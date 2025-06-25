import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import workingman from '../../assets/imgs/workingman1.png';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { kycService } from '../../services/apiServices';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const Step1PersonalInfo = ({ formData, handleChange, onAadharDataFetched }) => {
  const [selectedOption, setSelectedOption] = useState(formData.auth_type || '');
  const [selectedType, setSelectedType] = useState(formData.begin_process || 'rekyc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Validation functions
  const validateAadhaar = (aadhaarNumber) => {
    const aadhaarRegex = /^[0-9]{12}$/;
    return aadhaarRegex.test(aadhaarNumber);
  };

  const validatePAN = (panNumber) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(panNumber);
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    // Optionally update parent's begin_process
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    setError('');
    // Optionally update parent's auth_type
  };

  const handleAadharSubmit = async () => {
    setError('');
    
    // Validate before submitting
    if (selectedOption === 'Aadhar Card' && !validateAadhaar(formData.auth_code)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      toast.error('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    
    if (selectedOption === 'Pan Card' && !validatePAN(formData.auth_code)) {
      setError('Please enter a valid PAN number (format: AAAAA9999A)');
      toast.error('Please enter a valid PAN number (format: AAAAA9999A)');
      return;
    }

    setLoading(true);

    const payload = {
      verify_from: selectedOption,
      verify_details: formData.auth_code,
    };
    
    try {
      const response = await kycService.startkyc(payload);  
      console.log('1st stp : ', response)
      if (response && response.data) {
        Swal.fire({
          icon: 'success',
          title: `${selectedOption} verified!`,
          showConfirmButton: false,
          timer: 1500
        });
        onAadharDataFetched(response.data); // Pass data to parent to go to next step
        localStorage.setItem('application_id', response.kyc_application_id);
      } else {
        setError('No data found for this number.');
        toast.error('No data found for this number.');
      }
    } catch (err) {
      console.log(err)
      setError(err.message || 'No data found for this number.');
      toast.error(err.message || 'No data found for this number.');
    }
    setLoading(false);
  };

  return (
    <div className="form-step">
      <div className='form-container'>
        <div className="flex flex-wrap items-top ">
          <div className="lg:w-1/2 md:full sm:w-full my-4">
            <h2 className="text-xl font-bold mb-2">Re-KYC Application</h2>
            <div className="application-type-container">
              <label className="application-type ">
                <input
                  type="radio"
                  name="begin_process"
                  value="rekyc"
                  className="hidden peer"
                  checked
                  onChange={() => handleTypeSelect('rekyc')}
                />
                <div className="border rounded-lg p-2 flex items-center gap-5 peer-checked:border-green-600 transition-colors">
                  <i className="bi bi-person-fill-check"></i>
                  <span className="font-medium">Re-KYC</span>
                </div>
              </label>
            </div>

            <div className='my-4'>
              <h2 className="text-xl font-bold mb-2">Choose the Option to Verify</h2>
              <div className="flex flex-wrap items-center justify-start">
                <label className="flex me-4">
                  <input
                    className="me-2"
                    type="radio"
                    name="auth_type"
                    value="Aadhar Card"
                    checked={selectedOption === 'Aadhar Card'}
                    onChange={handleRadioChange}
                  />
                  Aadhar Number
                </label>

                <label className="flex me-4">
                  <input
                    className="me-2"
                    type="radio"
                    name="auth_type"
                    value="Pan Card"
                    checked={selectedOption === 'Pan Card'}
                    onChange={handleRadioChange}
                  />
                  PAN Number
                </label>

                <label className="flex me-4">
                  <input
                    className="me-2"
                    type="radio"
                    name="auth_type"
                    value="Digilocker"
                    checked={selectedOption === 'Digilocker'}
                    onChange={handleRadioChange}
                  />
                  DigiLocker
                </label>
              </div>

              {selectedOption && (
                <div className="mt-6">
                  <div className="flex items-center">
                    <div className="md:w-1/2 me-4">
                      <CommanInput
                        type="text"
                        label={`Enter ${selectedOption}`}
                        value={formData.auth_code}
                        onChange={(e) => {
                          // Auto-uppercase for PAN
                          if (selectedOption === 'Pan Card') {
                            e.target.value = e.target.value.toUpperCase();
                          }
                          handleChange(e);
                        }}
                        name="auth_code"
                        placeholder={`Enter ${selectedOption}`}
                        required
                        maxLength={selectedOption === 'Aadhar Card' ? 12 : 10}
                        validationType={
                          selectedOption === 'Aadhar Card' ? 'NUMBER_ONLY' : 
                          selectedOption === 'Pan Card' ? 'PAN' : 'EVERYTHING'
                        }
                      />
                      {/* {selectedOption === 'Aadhar Card' && (
                        <p className='text-sm text-gray-500 mt-1'>Enter 12 digit Aadhaar number</p>
                      )}
                      {selectedOption === 'Pan Card' && (
                        <p className='text-sm text-gray-500 mt-1'>Format: AAAAA9999A</p>
                      )} */}
                    </div>
                    <div className="md:w-1/2">
                      <CommonButton
                        className="btn-login"
                        onClick={handleAadharSubmit}
                        disabled={!formData.auth_code || loading}
                      >
                        {loading ? (
                          <>
                            <span className="animate-spin inline-block mr-2">↻</span>
                            Verifying...
                          </>
                        ) : (
                          'Submit'
                        )}
                      </CommonButton>
                    </div>
                  </div>
                  {/* {error && <div className="text-red-500 mt-2">{error}</div>} */}
                </div>
              )}
            </div>
          </div>
          <div className="hidden lg:block lg:w-1/2 md:w-1/2">
            <img src={workingman} alt="workingman" className="w-3/4 m-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1PersonalInfo;
 