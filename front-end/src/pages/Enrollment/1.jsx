
import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import workingman from '../../assets/imgs/workingman1.png';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { agentService } from '../../services/apiServices';

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
        // Prepare the data in the flat structure expected by the backend
        const payload = {
            auth_type: selectedOption,
            auth_code: localFormData.verifynumber,
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
            state: localFormData.state,
        };

        try {
            const response = await agentService.agentEnroll(payload);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
        onNext();
    };

    return (
        <>
            <div className='form-container'>
                <div className="flex flex-wrap items-top">
                    <div className="lg:w-1/2 md:full sm:w-full">
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
                                    <span className="text-black font-medium">New Customer</span>
                                </div>
                            </label>

                            <label className="application-type">
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
                                    <span className="text-black font-medium">Re-KYC</span>
                                </div>
                            </label>
                        </div>

                        {selectedType && (
                            <div class="my-5">
                                <h2 className="text-xl font-bold my-2">Choose the Option to Verify</h2>
                                <form className="flex flex-wrap items-center justify-start">
                                    <label className="flex me-4">
                                        <input
                                            className="me-2"
                                            type="radio"
                                            name="auth_code"
                                            value="Aadhar Card"
                                            checked={selectedOption === 'Aadhar Number'}
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
                                            checked={selectedOption === 'Pan Number'}
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
                                    <div className="my-2">
                                        <div className="flex items-center mt-5">
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
                                <br />
                            </div>
                        )}
                    </div>
                    <div className="hidden lg:block lg:w-1/2 md:w-1/2">
                        <img src={workingman} alt="workingman" className="w-4/5 m-auto" />
                    </div>
                </div>

                {showData && (
                    <>
                        <h2 className="text-xl font-bold mb-2">{selectedOption} Details</h2>
                        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
                            <CommanInput
                                onChange={handleChange}
                                label={labels.firstname.label}
                                type="text"
                                name="first_name"
                                value={localFormData.first_name}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.middlename.label}
                                type="text"
                                name="middle_name"
                                value={localFormData.middle_name}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.lastname.label}
                                type="text"
                                name="last_name"
                                value={localFormData.last_name}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.dob.label}
                                type="date"
                                name="DOB"
                                value={localFormData.DOB}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.gender.label}
                                type="text"
                                name="gender"
                                value={localFormData.gender}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.mobile.label}
                                type="text"
                                name="mobile"
                                value={localFormData.mobile}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.complexname.label}
                                type="text"
                                name="complex_name"
                                value={localFormData.complex_name}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.flatnoroomno.label}
                                type="text"
                                name="flat_no"
                                value={localFormData.flat_no}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.area.label}
                                type="text"
                                name="area"
                                value={localFormData.area}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.landmark.label}
                                type="text"
                                name="landmark"
                                value={localFormData.landmark}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.country.label}
                                type="text"
                                name="country"
                                value={localFormData.country}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.pincode.label}
                                type="text"
                                name="pincode"
                                value={localFormData.pincode}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.city.label}
                                type="text"
                                name="city"
                                value={localFormData.city}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.district.label}
                                type="text"
                                name="district"
                                value={localFormData.district}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.state.label}
                                type="text"
                                name="state"
                                value={localFormData.state}
                                required
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