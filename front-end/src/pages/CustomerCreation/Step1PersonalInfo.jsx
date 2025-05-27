import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import workingman from '../../assets/imgs/workingman1.png';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { gender } from '../../data/data';
import CommanSelect from '../../components/CommanSelect';

const Step1PersonalInfo = ({ formData, handleChange, nextStep, onTypeChange, onOptionChange }) => {
  // Initialize from formData.begin_process and formData.auth_type
  const [selectedOption, setSelectedOption] = useState(formData.auth_type || '');
  const [selectedType, setSelectedType] = useState(formData.begin_process || '');
  const [showData, setShowData] = useState(!!formData.auth_code);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    if (onTypeChange) onTypeChange(type); // Update parent's begin_process
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    if (onOptionChange) onOptionChange(value); // Update parent's auth_type
  };

  const fetchShowData = (e) => {
    e.preventDefault();
    if (formData.auth_code) {
      setShowData(true);
    }
  };

  // ... rest of your component remains the same ...

  return (
    <div className="form-step">
      {/* <h2>Step 1: Personal Information</h2> */}

      <div className='form-container'>
        <div className="flex flex-wrap items-top ">
          <div className="lg:w-1/2 md:full sm:w-full my-4">
            <h2 className="text-xl font-bold mb-2">Choose Application Type</h2>
            <div className="application-type-container">
              <label className="application-type">
                <input
                  type="radio"
                  name="begin_process"
                  value="new"
                  className="hidden peer"
                  checked={selectedType === 'new'}
                  onChange={() => handleTypeSelect('new')}
                />
                <div className="border rounded-lg p-2 flex items-center gap-4 peer-checked:border-green-600 transition-colors">
                  <i className="bi bi-person-fill-add"></i>
                  <span className="font-medium">New Customer</span>
                </div>
              </label>

              <label className="application-type ">
                <input
                  type="radio"
                  name="begin_process"
                  value="rekyc"
                  className="hidden peer"
                  checked={selectedType === 'rekyc'}
                  onChange={() => handleTypeSelect('rekyc')}
                />
                <div className="border rounded-lg p-2 flex items-center gap-4 peer-checked:border-green-600 transition-colors">
                  <i className="bi bi-person-fill-check"></i>
                  <span className="font-medium">Re-KYC</span>
                </div>
              </label>
            </div>

            {selectedType && (
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
                          onClick={fetchShowData}
                          disabled={!formData.auth_code}
                        >
                          Submit
                        </CommonButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden lg:block lg:w-1/2 md:w-1/2">
            <img src={workingman} alt="workingman" className="w-3/4 m-auto" />
          </div>
        </div>

        {showData && (
          <>
            <h2 className="text-xl font-bold mb-2">{selectedOption} Details</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-5">
              <CommanInput
                onChange={handleChange}
                label={labels.firstname.label}
                type="text"
                name="first_name"
                value={formData.first_name}
                required
                max={50}
                validationType="TEXT_ONLY"
              />

              <CommanInput
                onChange={handleChange}
                label={labels.middlename.label}
                type="text"
                name="middle_name"
                value={formData.middle_name}
                required
                max={50}
                validationType="TEXT_ONLY"
              />

              <CommanInput
                onChange={handleChange}
                label={labels.lastname.label}
                type="text"
                name="last_name"
                value={formData.last_name}
                required
                max={50}
                validationType="TEXT_ONLY"
              />
              {/* Date of Birth - Using DATE validation */}
              <CommanInput
                onChange={handleChange}
                label={labels.dob.label}
                type="date"
                name="DOB"
                value={formData.DOB}
                required
                validationType="DATE"
              />

              {/* Gender - Text with 20 char limit */}
              <CommanSelect
                onChange={handleChange}
                label={labels.gender.label}
                value={formData.gender}
                name="gender"
                required
                options={gender}
              />

              {/* Mobile - Using PHONE validation with 15 digit limit */}
              <CommanInput
                onChange={handleChange}
                label={labels.mobile.label}
                type="text"
                name="mobile"
                value={formData.mobile}
                required
                max={10}
                validationType="PHONE"
              />

              {/* Complex Name - Text with 50 char limit */}
              <CommanInput
                onChange={handleChange}
                label={labels.complexname.label}
                type="text"
                name="complex_name"
                value={formData.complex_name}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
              />

              {/* Flat/Room No - Alphanumeric with 20 char limit */}
              <CommanInput
                onChange={handleChange}
                label={labels.roomno.label}
                type="text"
                name="flat_no"
                value={formData.flat_no}
                required
                max={5}
                validationType="ALPHANUMERIC"
              />

              {/* Area - Text with 50 char limit */}
              <CommanInput
                onChange={handleChange}
                label={labels.area.label}
                type="text"
                name="area"
                value={formData.area}
                required
                max={50}
                validationType="ALPHABETS_AND_SPACE"
              />

              {/* Landmark - Text with 50 char limit (more flexible) */}
              <CommanInput
                onChange={handleChange}
                label={labels.landmark.label}
                type="text"
                name="landmark"
                value={formData.landmark}
                required
                max={50}
                validationType="EVERYTHING"
              />

              {/* Country - Text with 30 char limit */}
              <CommanInput
                onChange={handleChange}
                label={labels.country.label}
                type="text"
                name="country"
                value={formData.country}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
              />

              {/* Pincode - Numbers only with standard 6-10 digit limit */}
              <CommanInput
                onChange={handleChange}
                label={labels.pincode.label}
                type="text"
                name="pincode"
                value={formData.pincode}
                required
                max={6}
                validationType="NUMBER_ONLY"
              />

              {/* City - Text with 30 char limit */}
              <CommanInput
                onChange={handleChange}
                label={labels.city.label}
                type="text"
                name="city"
                value={formData.city}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
              />

              {/* District - Text with 30 char limit */}
              <CommanInput
                onChange={handleChange}
                label={labels.district.label}
                type="text"
                name="district"
                value={formData.district}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
              />

              {/* State - Text with 30 char limit */}
              <CommanInput
                onChange={handleChange}
                label={labels.state.label}
                type="text"
                name="state"
                value={formData.state}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
              />
            </div>
          </>
        )}
      </div>

      <hr />

      <div className="navigation-buttons">
        {/* <CommonButton className="btn-back" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton> */}

        <CommonButton className="btn-next" onClick={nextStep}>
          Next&nbsp;<i className="bi bi-chevron-double-right"></i>
        </CommonButton>
      </div>

    </div>
  );
};

export default Step1PersonalInfo;
