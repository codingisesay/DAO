import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import workingman from '../../assets/imgs/workingman1.png';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { gender, userdummydata } from '../../data/data';
import CommanSelect from '../../components/CommanSelect';
import Swal from 'sweetalert2';
import { agentService } from '../../services/apiServices';
import { toast } from 'react-toastify';
import { form } from 'framer-motion/client';
function P1({ onNext, onBack, formData, updateFormData }) {
    const [selectedOption, setSelectedOption] = useState(formData.auth_type || '');
    const [selectedType, setSelectedType] = useState('new');
    const [showData, setShowData] = useState(!!formData.auth_code);

    const [localFormData, setLocalFormData] = useState({
        first_name: formData.first_name || '',
        middle_name: formData.middle_name || '',
        last_name: formData.last_name || '',
        auth_type: formData.auth_type || '',
        auth_code: formData.auth_code || '',
        first_name: formData.first_name || '',
        DOB: formData.DOB || '',
        gender: formData.gender || '',
        mobile: formData.mobile || '',
        verifynumber: formData.auth_code || '',
        complex_name: formData.complex_name || '',
        flat_no: formData.flat_no || '',
        area: formData.area || '',
        landmark: formData.landmark || '',
        country: formData.country || '',
        pincode: formData.pincode || '',
        city: formData.city || '',
        district: formData.district || '',
        state: formData.state || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (e) => {
        setSelectedOption(e.target.value);
        setShowData(false);
    };
    const validateAadhaar = (aadhaarNumber) => {
        const aadhaarRegex = /^[0-9]{12}$/;
        return aadhaarRegex.test(aadhaarNumber);
    };
    const validatePAN = (panNumber) => {
        const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
        return panRegex.test(panNumber);
    };
    const fetchShowData = (e) => {

        e.preventDefault();
        if (selectedOption === 'Aadhar Card') {
            if (validateAadhaar(localFormData.verifynumber)) {
                Swal.fire({
                    icon: 'success',
                    title: 'Aadhar Card verified!',
                    showConfirmButton: false,
                    timer: 1500
                });
                setShowData(true);
                setLocalFormData({ ...localFormData, ...userdummydata.aadhardetails });
                // console.log(localFormData)
            } else {
                toast.error('Please enter a valid 12-digit Aadhaar number');
            }
        } else if (selectedOption === 'Pan Card') {
            if (validatePAN(localFormData.verifynumber)) {
                Swal.fire({
                    icon: 'success',
                    title: 'Pan Card verified!',
                    showConfirmButton: false,
                    timer: 1500
                });
                setShowData(true);
            } else {
                toast.error('Please enter a valid PAN number (format: AAAAA9999A)');
            }
        } else if (selectedOption === 'DigiLocker') {
            // Handle DigiLocker verification logic here
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Your data has been saved successfully.',
                showConfirmButton: false,
                timer: 1500
            });
            console.log("DigiLocker verification logic");
            setShowData(true); // Assuming DigiLocker verification is successful
        }
    };

    const handleNextStep = async (e) => {
        e.preventDefault();
        // update central from / in varibles
        updateFormData(1, {
            ...localFormData,
            ...formData,
            auth_type: selectedType,
            verificationOption: selectedOption,
            verificationNumber: localFormData.verifynumber,

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
            console.log(payload)
            const response = await agentService.agentEnroll(payload);
            console.log('heey its respone : ', response.data.application_no)
            if (response && JSON.stringify(response).includes('201')) {
                updateFormData(1, {
                    ...formData,
                    application_no: response.data.application_no,
                    application_id: response.data.application_id,
                });
                localStorage.setItem('application_no', response.data.application_no);
                localStorage.setItem('application_id', response.data.application_id);
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Your data has been saved successfully.',
                    showConfirmButton: false,
                    timer: 1500
                });
                onNext();
                // alert('hey')
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Something went wrong. Please try again.',
            });
        }

    };

    return (
        <>
            <div className='form-container'>
                <div className="flex flex-wrap items-top ">
                    <div className="lg:w-1/2 md:full sm:w-full my-4">
                        <h2 className="text-xl font-bold mb-2">New Enrollment Form</h2>
                        <div className="application-type-container">
                            <label className="application-type">
                                <input
                                    type="radio"
                                    name="auth_type"
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

                                {selectedOption === 'Aadhar Card' && (
                                    <div className="mt-3">
                                        <p className='mb-3 text-sm'>Enter 12 digit Aadhaar number (UID)</p>
                                        <div className="flex items-center">
                                            <div className="md:w-1/2 me-4">
                                                <CommanInput
                                                    onChange={handleChange}
                                                    label="Enter Aadhar Number"
                                                    type="text"
                                                    name="verifynumber"
                                                    value={localFormData.verifynumber}
                                                    required
                                                    maxLength={12}
                                                    validationType="NUMBER_ONLY"
                                                />
                                            </div>
                                            <div className="md:w-1/2">
                                                <CommonButton
                                                    className="btn-login px-6"
                                                    onClick={fetchShowData}
                                                    disabled={!localFormData.verifynumber || localFormData.verifynumber.length !== 12}
                                                >
                                                    Submit
                                                </CommonButton>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOption === 'Pan Card' && (
                                    <div className="mt-3">
                                        <p className='mb-3 text-sm'>Please enter a valid PAN (format: AAAAA9999A)</p>
                                        <div className="flex items-center">
                                            <div className="md:w-1/2 me-4">
                                                <CommanInput
                                                    onChange={handleChange}
                                                    label="Enter PAN Number"
                                                    type="text"
                                                    name="verifynumber"
                                                    value={localFormData.verifynumber}
                                                    required
                                                    maxLength={10}
                                                    validationType="PAN"
                                                    onInput={(e) => {
                                                        // Auto-uppercase the input
                                                        e.target.value = e.target.value.toUpperCase();
                                                    }}
                                                />
                                            </div>
                                            <div className="md:w-1/2">
                                                <CommonButton
                                                    className="btn-login px-6"
                                                    onClick={fetchShowData}
                                                    disabled={!localFormData.verifynumber || !validatePAN(localFormData.verifynumber)}
                                                >
                                                    Submit
                                                </CommonButton>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedOption === 'DigiLocker' && (
                                    <div className="mt-6">
                                        <CommonButton
                                            className="btn-login px-6"
                                            onClick={() => {
                                                // Add your DigiLocker linking logic here
                                                console.log("Link via DigiLocker clicked");
                                            }}
                                        >
                                            Link via DigiLocker
                                        </CommonButton>
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
                                validationType="TEXT_ONLY" disabled={true}
                            />

                            <CommanInput
                                onChange={handleChange}
                                label={labels.middlename.label}
                                type="text"
                                name="middle_name"
                                value={localFormData.middle_name}
                                max={50}
                                validationType="TEXT_ONLY" disabled={true}
                            />

                            <CommanInput
                                onChange={handleChange}
                                label={labels.lastname.label}
                                type="text"
                                name="last_name"
                                value={localFormData.last_name}
                                required
                                max={50}
                                validationType="TEXT_ONLY" disabled={true}
                            />
                            {/* Date of Birth - Using DATE validation */}
                            <CommanInput
                                onChange={handleChange}
                                label={labels.dob.label}
                                type="date"
                                name="DOB"
                                value={localFormData.DOB}
                                required
                                validationType="DATE" disabled={true}
                            />

                            {/* Gender - Text with 20 char limit */}
                            <CommanSelect
                                onChange={handleChange}
                                label={labels.gender.label}
                                value={localFormData.gender}
                                name="gender"
                                required
                                options={gender} disabled={true}
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
                                validationType="PHONE" disabled={true}
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
                                validationType="ALPHANUMERIC" disabled={true}
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
                                validationType="ALPHANUMERIC" disabled={true}
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
                                validationType="ALPHABETS_AND_SPACE" disabled={true}
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
                                validationType="EVERYTHING" disabled={true}
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
                                validationType="ALPHABETS_AND_SPACE" disabled={true}
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
                                validationType="NUMBER_ONLY" disabled={true}
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
                                validationType="ALPHABETS_AND_SPACE" disabled={true}
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
                                validationType="ALPHABETS_AND_SPACE" disabled={true}
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
                                validationType="ALPHABETS_AND_SPACE" disabled={true}
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
