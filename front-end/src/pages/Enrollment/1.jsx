import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import CommanSelect from '../../components/CommanSelect';
import workingman from '../../assets/imgs/workingman1.png';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { agentService } from '../../services/apiServices';
import { gender } from '../../data/data';
import Swal from 'sweetalert2';


function P1({ onNext, onBack, formData, updateFormData }) {
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showData, setShowData] = useState(!!formData.verificationNumber);

    const [localFormData, setLocalFormData] = useState({
        auth_type: formData.personalDetails.auth_type || '',
        verificationOption: formData.personalDetails.verificationOption || '',
        verifynumber: formData.personalDetails.verifynumber || '',
        first_name: formData.personalDetails.first_name || '',
        middle_name: formData.personalDetails.middle_name || '',
        last_name: formData.personalDetails.last_name || '',
        DOB: formData.personalDetails.DOB || '',
        gender: formData.personalDetails.gender || '',
        mobile: formData.personalDetails.mobile || '',
        complex_name: formData.personalDetails.complex_name || '',
        flat_no: formData.personalDetails.flat_no || '',
        area: formData.personalDetails.area || '',
        landmark: formData.personalDetails.landmark || '',
        country: formData.personalDetails.country || '',
        pincode: formData.personalDetails.pincode || '',
        city: formData.personalDetails.city || '',
        district: formData.personalDetails.district || '',
        state: formData.personalDetails.state || '',
    });

    const handleChange = (e) => {
        let { name, value } = e.target;
        setLocalFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRadioChange = (e) => {
        setSelectedOption(e.target.value);
        setLocalFormData(prev => ({ ...prev, verifynumber: '' }));
    };

    const fetchShowData = () => {
        const val = localFormData.verifynumber;

        if (selectedOption === 'AadharNumber' && val.length !== 12) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Aadhaar',
                text: 'Aadhaar number must be exactly 12 digits.',
            });
            return;
        }

        if (
            selectedOption === 'PanNumber' &&
            !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val)
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid PAN Format',
                text: 'PAN should be in format: ABCDE1234F',
            });
            return;
        }
        setShowData(true);
    };


    const handleNextStep = async () => {
        // Update formData before API call
        updateFormData(1, {
            applicationType: selectedType,
            verificationOption: selectedOption,
            verificationNumber: localFormData.verifynumber,
            personalDetails: {
                auth_type: selectedOption,
                verificationOption: selectedOption,
                verifynumber: localFormData.verifynumber,
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
            }
        })

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
            lankmark: localFormData.lankmark,
            country: localFormData.country,
            pincode: localFormData.pincode,
            city: localFormData.city,
            district: localFormData.district,
            state: localFormData.state,
        };

        try {
            const response = await agentService.agentEnroll(payload);
            // Save application_id to formData for next steps
            updateFormData(1, {
                ...formData,
                personalDetails: localFormData,
                application_id: response.data.application_id // <-- Save this!
            });
            onNext();

        } catch (error) {
            Swal.fire({
                icon: 'error',
                text: JSON.stringify(error),
            });
        }
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
                            <div className="my-5">
                                <h2 className="text-xl font-bold my-2">Choose the Option to Verify</h2>
                                <form className="flex flex-wrap items-center justify-start">
                                    <label className="flex me-4">
                                        <input
                                            className="me-2"
                                            type="radio"
                                            name="Aadhar Card"
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
                                            name="Pan Card"
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
                                            name="DigiLocker"
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
                        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
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

                            <CommanInput
                                onChange={handleChange}
                                label={labels.dob.label}
                                type="date"
                                name="DOB"
                                value={localFormData.DOB}
                                required
                                validationType="DATE"
                            />

                            <CommanSelect
                                value={localFormData.gender}
                                label={labels.gender.label}
                                name="gender"
                                onChange={handleChange}
                                required
                                options={gender}
                            />

                            <CommanInput
                                onChange={handleChange}
                                label={labels.mobile.label}
                                type="text"
                                name="mobile"
                                value={localFormData.mobile}
                                required
                                max={15}
                                validationType="PHONE"
                            />

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

                            <CommanInput
                                onChange={handleChange}
                                label={labels.flatnoroomno.label}
                                type="text"
                                name="flat_no"
                                value={localFormData.flat_no}
                                required
                                max={20}
                                validationType="ALPHANUMERIC"
                            />

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