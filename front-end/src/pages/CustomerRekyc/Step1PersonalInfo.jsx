import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import workingman from '../../assets/imgs/workingman1.png';
import CommonButton from '../../components/CommonButton';
import { kycService } from '../../services/apiServices';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const Step1PersonalInfo = ({ 
  formData, 
  handleChange, 
  onAadhaarDataFetched, 
  setFormData,
  onNext,
  onBack
}) => {
  const [selectedOption, setSelectedOption] = useState(formData.auth_type || '');
  const [selectedType, setSelectedType] = useState(formData.begin_process || 'rekyc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [localFormData, setLocalFormData] = useState({
    ...formData,
    auth_type: formData.auth_type || '',
    auth_code: formData.auth_code || '',
    begin_process: formData.begin_process || 'rekyc',
    isVerified: formData.isVerified || false
  });

  // Sync local state with parent formData
  useEffect(() => {
    setLocalFormData(prev => ({
      ...prev,
      ...formData,
      auth_type: formData.auth_type || prev.auth_type,
      auth_code: formData.auth_code || prev.auth_code,
      begin_process: formData.begin_process || prev.begin_process,
      isVerified: formData.isVerified || prev.isVerified
    }));
    setSelectedOption(formData.auth_type || '');
    setSelectedType(formData.begin_process || 'rekyc');
  }, [formData]);

  const validateAadhaar = (aadhaarNumber) => /^[0-9]{12}$/.test(aadhaarNumber);
  const validatePAN = (panNumber) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    const updatedData = { ...localFormData, begin_process: type };
    setLocalFormData(updatedData);
    if (setFormData) setFormData(updatedData);
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    setError('');
    const updatedData = { 
      ...localFormData, 
      auth_type: value, 
      auth_code: '', 
      isVerified: false 
    };
    setLocalFormData(updatedData);
    if (setFormData) setFormData(updatedData);
  };

  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (name === 'auth_code' && selectedOption === 'Pan Card') {
      processedValue = value.toUpperCase();
    }
    
    const updatedData = { 
      ...localFormData, 
      [name]: processedValue,
      isVerified: false
    };
    
    setLocalFormData(updatedData);
    if (setFormData) setFormData(updatedData);
  };

  const handleAadhaarSubmit = async () => {
    setError('');
    
    if (selectedOption === 'Aadhaar Card' && !validateAadhaar(localFormData.auth_code)) {
      setError('Please enter a valid 12-digit Aadhaar number');
      // toast.error('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    
    if (selectedOption === 'Pan Card' && !validatePAN(localFormData.auth_code)) {
      setError('Please enter a valid PAN number (format: AAAAA9999A)');
      
Swal.fire({
  icon: 'error', 
  text: 'Please enter a valid PAN number (format: AAAAA9999A)',
});
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await kycService.startkyc({
        verify_from: selectedOption,
        verify_details: localFormData.auth_code,
      });

      if (response && response.data) {
        const updatedData = {
          ...localFormData,
          ...response.data,
          isVerified: true,
          application_id: response.kyc_application_id
        };

        setLocalFormData(updatedData);
        if (setFormData) setFormData(updatedData);
        
        Swal.fire({
          icon: 'success',
          title: `${selectedOption} verified!`,
          showConfirmButton: false,
          timer: 1500
        });

        localStorage.setItem('application_id', response.kyc_application_id);
        
        if (onAadhaarDataFetched) {
          onAadhaarDataFetched(response.data);
        }
      }
    } catch (err) {
      setError(err.message || 'Verification failed');
      // toast.error(err.message || 'Verification failed');
      
Swal.fire({
  icon: 'error',
  title: 'Verification failed', 
});
    } finally {
      setLoading(false);
    }
  };

  // const handleNext = (e) => {
  //   e.preventDefault();
  //   if (onNext) onNext();
  // };

  // const handleBack = (e) => {
  //   e.preventDefault();
  //   if (onBack) onBack();
  // };

  return (
    <div className="form-step">
      <div className='form-container pb-10'>
        <div className="flex flex-wrap items-top">
          <div className="lg:w-1/2 md:full sm:w-full my-4">
            <h2 className="text-xl font-bold mb-2">Re-KYC Application</h2>
            <div className="application-type-container">
              <label className="application-type">
                <input
                  type="radio"
                  name="begin_process"
                  value="rekyc"
                  className="hidden peer"
                  checked={selectedType === 'rekyc'}
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
                    value="Aadhaar Card"
                    checked={selectedOption === 'Aadhaar Card'}
                    onChange={handleRadioChange}
                  />
                  Aadhaar Number
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
                <div className="">
                  {selectedOption === 'Aadhaar Card'&&
                  <> <p className=' text-sm'>Enter 12 Digit Aadhaar Number (Format: xxxx xxxx xxxx)</p></> }
                  {selectedOption === 'Pan Card'&&
                  <>  <p className=' text-sm'>Please Enter a Valid PAN (Format: AAAAA9999A)</p></> }
                  {selectedOption === 'Digilocker'&&
                  <>   </> }
                  
                  <div className="flex items-center mt-3">
                    <div className="md:w-1/2 me-4">
                      <CommanInput
                        type={selectedOption === 'Aadhaar Card' ? "number" :  "text"} 
                        label={`Enter ${selectedOption}`}
                        value={localFormData.auth_code}
                        onChange={handleLocalChange}
                        name="auth_code"
                        placeholder={`Enter ${selectedOption}`}
                        required
                        max={selectedOption === 'Aadhaar Card' ? 12 : 10} 
                        // disabled={localFormData.isVerified}
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                          }}
                      />
                    </div>
                    <div className="md:w-1/2">
                 <CommonButton
                      className="btn-login"
                      onClick={handleAadhaarSubmit}
                      disabled={
                        !localFormData.auth_code ||
                        loading ||
                        localFormData.isVerified ||
                        (selectedOption === 'Aadhaar Card' && localFormData.auth_code.length !== 12) ||
                        (selectedOption === 'Pan Card' && localFormData.auth_code.length !== 10)
                      }
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin inline-block mr-2">↻</span>
                          Verifying...
                        </>
                      ) : (
                        localFormData.isVerified ? 'Verified' : 'Submit'
                      )}
                    </CommonButton>
                    </div>
                  </div>
                  {error && <small className="text-red-500 mt-2">{error}</small>}
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