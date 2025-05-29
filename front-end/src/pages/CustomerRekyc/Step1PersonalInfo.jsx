import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import workingman from '../../assets/imgs/workingman1.png';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { applicationDetailsService } from '../../services/apiServices';

const Step1PersonalInfo = ({ formData, handleChange, onAadharDataFetched }) => {
  const [selectedOption, setSelectedOption] = useState(formData.auth_type || '');
  const [selectedType, setSelectedType] = useState(formData.begin_process || 'rekyc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    // Optionally update parent's begin_process
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    // Optionally update parent's auth_type
  };

  const handleAadharSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await applicationDetailsService.getByAadhar(formData.auth_code);
      if (response.data && response.data.data) {
        onAadharDataFetched(response.data.data); // Pass data to parent to go to next step
      } else {
        setError('No data found for this Aadhaar number.');
      }
    } catch (err) {
      setError('No data found for this Aadhaar number.');
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
                <div className="border rounded-lg p-2 flex items-center gap-4 peer-checked:border-green-600 transition-colors">
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
                  Pan Number
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
                        onChange={handleChange}
                        name="auth_code"
                        placeholder={`Enter ${selectedOption}`}
                        required
                      />
                    </div>
                    <div className="md:w-1/2">
                      <CommonButton
                        className="btn-login"
                        onClick={handleAadharSubmit}
                        disabled={!formData.auth_code || loading}
                      >
                        {loading ? 'Loading...' : 'Submit'}
                      </CommonButton>
                    </div>
                  </div>
                  {error && <div className="text-red-500 mt-2">{error}</div>}
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
