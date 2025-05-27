import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import workingman from '../../assets/imgs/workingman1.png';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { gender } from '../../data/data';
import CommanSelect from '../../components/CommanSelect';
import Swal from 'sweetalert2';
<<<<<<< HEAD
import { agentService } from '../../services/apiServices'
=======
import { agentService } from '../../services/apiServices';
>>>>>>> c62b96d242dc33d1ca77b2a4d360d7ea00c7b87f


function P1({ onNext, onBack, formData, updateFormData }) {
    const [selectedOption, setSelectedOption] = useState(formData.verificationOption || '');
    const [selectedType, setSelectedType] = useState(formData.applicationType || '');
    const [showData, setShowData] = useState(!!formData.verificationNumber);

    const [localFormData, setLocalFormData] = useState({
        first_name: formData.personalDetails?.first_name || '',
        middle_name: formData.personalDetails?.middle_name || '',
        last_name: formData.personalDetails?.last_name || '',
        DOB: formData.personalDetails?.DOB || '',
        gender: formData.personalDetails?.gender || '',
        mobile: formData.personalDetails?.mobile || '',
        verifynumber: formData.verificationNumber || '',
        complex_name: formData.personalDetails?.complex_name || '',
        flat_no: formData.personalDetails?.flat_no || '',
        area: formData.personalDetails?.area || '',
        landmark: formData.personalDetails?.landmark || '',
        country: formData.personalDetails?.country || '',
        pincode: formData.personalDetails?.pincode || '',
        city: formData.personalDetails?.city || '',
        district: formData.personalDetails?.district || '',
        state: formData.personalDetails?.state || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const fetchShowData = (e) => {
        e.preventDefault();
        if (localFormData.verifynumber) {
            setShowData(true);
        }
    };

    const handleNextStep = async () => {
        // update central from / in varibles
        updateFormData(1, {
            ...formData,
            applicationType: selectedType,
            verificationOption: selectedOption,
            verificationNumber: localFormData.verifynumber,
            personalDetails: {
                ...formData,
                first_name: localFormData.first_name,
                middle_name: localFormData.middle_name,
                last_name: localFormData.last_name,
                DOB: localFormData.DOB,
                gender: localFormData.gender,
                mobile: localFormData.mobile,
                complex_name: localFormData.complex_name,
                flat_no: localFormData.flat_no,
                area: localFormData.area,
                landmark: localFormData.landmark,
                country: localFormData.country,
                pincode: localFormData.pincode,
                city: localFormData.city,
                district: localFormData.district,
                state: localFormData.state
            }
        });

        // integration to send data below
        const payload = {
            auth_type: selectedOption,
            auth_code: localFormData.verifynumber,
            first_name: localFormData.first_name,
            auth_status: "Pending", // or get from form if needed
            middle_name: localFormData.middle_name,
            last_name: localFormData.last_name,
            DOB: localFormData.DOB,
            gender: localFormData.gender,
            mobile: localFormData.mobile,
            complex_name: localFormData.complex_name,
            flat_no: localFormData.flat_no,
            area: localFormData.area,
            landmark: localFormData.landmark,
            country: localFormData.country,
            pincode: localFormData.pincode,
            city: localFormData.city,
            district: localFormData.district,
            state: localFormData.state,
        };

        try {
            const response = await agentService.agentEnroll(payload);
            if (response && response.application_no && response.application_id) {
                updateFormData(1, {
                    ...formData,
                    application_no: response.application_no,
                    application_id: response.application_id,
                });
                localStorage.setItem('application_no', response.application_no);
                localStorage.setItem('application_id', response.application_id);
                onNext();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: error,
            });
        }
        onNext();
    };

    return (
        <>
            <div className='form-container'>
                <div className="flex flex-wrap items-top ">
                    <div className="lg:w-1/2 md:full sm:w-full my-4">
                        <h2 className="text-xl font-bold mb-2">Choose Application Type</h2>
                        <div className="application-type-container">
                            <label className="application-type">
                                <input
                                    type="radio"
                                    name="applicationType"
                                    value="new"
                                    className="hidden peer"
                                    checked={selectedType === 'new'}
                                    onChange={() => setSelectedType('new')}
                                />
                                <div className="border rounded-lg p-2 flex items-center gap-4 peer-checked:border-green-600 transition-colors">
                                    <i className="bi bi-person-fill-add"></i>
                                    <span className="font-medium">New Customer</span>
                                </div>
                            </label>

                            <label className="application-type ">
                                <input
                                    type="radio"
                                    name="applicationType"
                                    value="rekyc"
                                    className="hidden peer"
                                    checked={selectedType === 'rekyc'}
                                    onChange={() => setSelectedType('rekyc')}
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
                                <form className="flex flex-wrap items-center justify-start">
                                    <label className="flex me-4">
                                        <input
                                            className="me-2"
                                            type="radio"
                                            name="option"
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
                                            name="option"
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
                                            name="option"
                                            value="DigiLocker"
                                            checked={selectedOption === 'DigiLocker'}
                                            onChange={handleRadioChange}
                                        />
                                        DigiLocker
                                    </label>
                                </form>

                                {selectedOption && (
                                    <div className="mt-6">
                                        <div className="flex items-center">
                                            <div className="md:w-1/2 me-4">
                                                <CommanInput
                                                    type="text"
                                                    label={`Enter ${selectedOption}`}
                                                    value={localFormData.verifynumber}
                                                    onChange={handleChange}
                                                    name="verifynumber"
                                                    placeholder={`Enter ${selectedOption}`}
                                                    required
                                                />
                                            </div>
                                            <div className="md:w-1/2">
                                                <CommonButton
                                                    className="btn-login"
                                                    onClick={fetchShowData}
                                                    disabled={!localFormData.verifynumber}
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
                                value={localFormData.first_name}
                                required
                                max={50}
                                validationType="TEXT_ONLY"
                            />

                            <CommanInput
                                onChange={handleChange}
                                label={labels.middlename.label}
                                type="text"
                                name="middle_name"
                                value={localFormData.middle_name}
                                required
                                max={50}
                                validationType="TEXT_ONLY"
                            />

                            <CommanInput
                                onChange={handleChange}
                                label={labels.lastname.label}
                                type="text"
                                name="last_name"
                                value={localFormData.last_name}
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
                                value={localFormData.DOB}
                                required
                                validationType="DATE"
                            />

                            {/* Gender - Text with 20 char limit */}
                            <CommanSelect
                                onChange={handleChange}
                                label={labels.gender.label}
                                value={localFormData.gender}
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
                                value={localFormData.mobile}
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
                                value={localFormData.complex_name}
                                required
                                max={50}
                                validationType="ALPHANUMERIC"
                            />

                            {/* Flat/Room No - Alphanumeric with 20 char limit */}
                            <CommanInput
                                onChange={handleChange}
                                label={labels.roomno.label}
                                type="text"
                                name="flat_no"
                                value={localFormData.flat_no}
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
                                value={localFormData.area}
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
                                value={localFormData.landmark}
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
                                value={localFormData.country}
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
                                value={localFormData.pincode}
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
                                value={localFormData.city}
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
                                value={localFormData.district}
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
                                value={localFormData.state}
                                required
                                max={30}
                                validationType="ALPHABETS_AND_SPACE"
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="next-back-btns">
                <CommonButton className="btn-back" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>

                <CommonButton
                    className="btn-next"
                    onClick={handleNextStep}
                >
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div>
        </>
    );
}

export default P1;
