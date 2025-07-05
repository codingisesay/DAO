import React, { useState,useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import workingman from '../../assets/imgs/workingman1.png';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { gender, userdummydata } from '../../data/data';
import CommanSelect from '../../components/CommanSelect';
import Swal from 'sweetalert2';
import {  createAccountService, pendingAccountData, agentService } from '../../services/apiServices';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

function P1({ onNext, onBack, formData, updateFormData }) {
    const [selectedOption, setSelectedOption] = useState(formData.verificationOption || '');
    const [selectedType, setSelectedType] = useState(formData.auth_type || 'new');
    const [showData, setShowData] = useState(!!formData.auth_code);
    const [isFetchDisabled, setIsFetchDisabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const agent_id =localStorage.getItem('userCode');
        const [loading, setLoading] = useState(false);
        const [reason, setReason] = useState(null); 
    const [localFormData, setLocalFormData] = useState({
        first_name: formData.first_name || '',
        middle_name: formData.middle_name || '',
        last_name: formData.last_name || '',
        auth_type: formData.auth_type || '',
        auth_code: formData.auth_code || '',
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
        agent_id: agent_id || '',
        state: formData.state || ''
    });
      
    
    // Fetch details if application_id exists
    // const id = localStorage.getItem('application_id');
    const {id} = useParams();
    useEffect(()=>{ if (id) {  fetchAndShowDetails(id); }}, [id])
    
    useEffect(() => {     
        const fetchReason = async (id) => { 
            if (!id) return;
            try {
                setLoading(true);
                const response = await agentService.refillApplication(id); 
                setReason(response.data[0]);
            } catch (error) {
                console.error("Failed to fetch review applications:", error);
            } finally {
                setLoading(false);
            }
        };
     
        fetchReason(id);
    }, [id]); 
    

        // clear local storage from below code
        // ...existing code...
    useEffect(() => {
        setIsFetchDisabled(true)
    const checkAndClearLocalStorage = async () => {
        const hasCustomerPhoto = !!localStorage.getItem('customerPhotoData');
        const hasDocuments = !!localStorage.getItem('documentData');
        console.log('Checking for existing data:', { hasCustomerPhoto, hasDocuments });

        if (hasCustomerPhoto || hasDocuments) {
            const messages = [];
            if (hasCustomerPhoto) messages.push('Customer Photo Data');
            if (hasDocuments) messages.push('Document Data');

            console.log('About to show Swal');
            const result = await Swal.fire({
                title: 'Clear Existing Data?',
                html: `Form Contains Data :<br><strong>${messages.join(', ')}</strong><br><br>Do you want to clear this data?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, clear it!',
                cancelButtonText: 'No, keep it',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
            });
            console.log('Swal result:', result);

            if (result.isConfirmed) {
                localStorage.removeItem('customerPhotoData'); 
                localStorage.removeItem('documentData');
                localStorage.removeItem('application_id');
                await Swal.fire(
                    'Cleared!',
                    'The existing data has been cleared.',
                    'success'
                );
                window.location.reload();
            } else { console.log('no data cleared')
                // await Swal.fire(
                //     'Kept',
                //     'The existing data was not cleared.',
                //     'info'
                // );
            }
        }
    };

    checkAndClearLocalStorage();
}, []);
// ...existing code...

        const fetchAndShowDetails = async (id) => {
            try {
                // alert('called')
                if (id) {
                    const response = await pendingAccountData.getDetailsS1(id);
                    // localStorage.setItem('applicationDetails', JSON.stringify(response));
                    const application = response.details || {};
                     

                    if (application.auth_type === 'Aadhar Card') {
                    application.auth_code = application.adhar_card || '';
                    application.verifynumber = application.adhar_card || '';
                    } else if (application.auth_type === 'Pan Card') {
                    application.auth_code = application.pan_card || '';
                    application.verifynumber = application.pan_card || '';
                    }
 
                        if(application.auth_type && application.auth_code){
                            setSelectedOption(application.auth_type)
                        setLocalFormData({  ...application ,
                        first_name: application.first_name || '',
                        middle_name: application.middle_name || '',
                        last_name: application.last_name || '',
                        auth_type: application.auth_type || '',
                        auth_code: application.auth_code || '',
                        DOB: application.DOB || '',
                        gender: application.gender || '',
                        mobile: application.mobile || '',
                        verifynumber: application.auth_code || '',

                        complex_name: application.complex_name || '',
                        flat_no: application.flat_no || '',
                        area: application.area || '',
                        landmark: application.landmark || '',
                        country: application.country || '',
                        pincode: application.pincode || '',
                        city: application.city || '',
                        district: application.district || '',
                        state: application.state || '',

                        agent_id: application.agent_id || '',
                        admin_id: application.admin_id || '',
                        status: application.status || '',
                        application_id: application.application_id || '',
                        application_no: application.application_no || '',
                        salutation: application.salutation || '',
                        religion: application.religion || '',
                        caste: application.caste || '',
                        marital_status: application.marital_status || '',
                        alt_mob_no: application.alt_mob_no || '',
                        email: application.email || '',
                        adhar_card: application.adhar_card || '',
                        pan_card: application.pan_card || '',
                        passport: application.passport || '',
                        driving_license: application.driving_license || '',
                        voter_id: application.voter_id || ''
                        });
                        setShowData(true)
                        }
                    // alert(localFormData.photo);
                }
            } catch (error) {
                console.error('Failed to fetch application details:', error);
            }
        };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({ ...prev, [name]: value }));
           if (name === "verifynumber") {
            setIsFetchDisabled(false);
        }
    };

    const handleRadioChange = (e) => {
        const value = e.target.value;
        setSelectedOption(value);
        setShowData(false);
        setLocalFormData(prev => ({ ...prev, verifynumber: '', auth_code: '' }));
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
        try {
            setIsSubmitting(true);
            if (selectedOption === 'Aadhar Card') {
                if (validateAadhaar(localFormData.verifynumber)) {
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Aadhar Card verified!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setShowData(true);
                    setLocalFormData(prev => ({
                        ...prev,
                        ...userdummydata.aadhardetails,
                        auth_code: prev.verifynumber
                    }));
                    setIsFetchDisabled(true); // Disable after success
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
                    setLocalFormData(prev => ({
                        ...prev,
                        ...userdummydata.aadhardetails,
                        auth_code: prev.verifynumber
                    }));
                    setIsFetchDisabled(true); // Disable after success
                } else {
                    toast.error('Please enter a valid PAN number (format: AAAAA9999A)');
                }
            } else if (selectedOption === 'DigiLocker') {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Your data has been saved successfully.',
                    showConfirmButton: false,
                    timer: 1500
                });
                setShowData(true);
                setIsFetchDisabled(true); // Disable after success
            }
        } catch (error) {
            // handle error if needed
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNextStep = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const updatedData = {
            ...localFormData,
            auth_type: selectedOption,
            verificationOption: selectedOption,
        };

        updateFormData(1, updatedData);

        const payload = {
            auth_type: selectedOption,
            auth_code: localFormData.auth_code,
            first_name: localFormData.first_name,
            auth_status: "Pending",
            adhar_card: selectedOption === 'Aadhar Card' ? localFormData.auth_code : '',
            pan_card: selectedOption === 'Pan Card' ? localFormData.auth_code : '',
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
            state: localFormData.state, agent_id: agent_id,
            status: "Pending",
        };

        try {
            const response = await createAccountService.enrollment_s1(payload);
            // console.log("Response from server:", response);
            
                updateFormData(1, {
                    ...updatedData,
                    application_no: response.application_no,
                    application_id: response.application_id,
                });
                localStorage.setItem('application_id', response.application_id);

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Your data has been saved successfully.',
                showConfirmButton: false,
                timer: 1500
            });
            onNext();
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                // text: 'Failed to submit data. Please try again.',
                text: error.data.message || 'Server error' ,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {isSubmitting && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            )}

            <div className='form-container pb-10'>
                <div className="flex flex-wrap items-top">
                    <div className="lg:w-1/2 md:full sm:w-full my-4">
                        <h2 className="text-xl font-bold mb-2">Enrollment Form</h2>
                        {reason &&  <p className="text-red-500 mb-3 " > Review For :{ reason.status_comment}</p> }
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
                                        <p className='mb-3 text-sm'>Enter 12 digit Aadhaar number (format: XXXX XXXX XXXX)</p>
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
                                                    disabled={
                                                        !localFormData.verifynumber ||
                                                        localFormData.verifynumber.length !== 12 ||
                                                        isFetchDisabled
                                                    }
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
                                                        e.target.value = e.target.value.toUpperCase();
                                                    }}
                                                />
                                            </div>
                                            <div className="md:w-1/2">
                                                <CommonButton
                                                    className="btn-login px-6"
                                                    onClick={fetchShowData}
                                                    disabled={
                                                        !localFormData.verifynumber ||
                                                        !validatePAN(localFormData.verifynumber) ||
                                                        isFetchDisabled
                                                    }
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
                        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">

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

                            <CommanInput
                                onChange={handleChange}
                                label={labels.dob.label}
                                type="date"
                                name="DOB"
                                value={localFormData.DOB}
                                required
                                validationType="DATE" disabled={true}
                            />

                            <CommanSelect
                                onChange={handleChange}
                                label={labels.gender.label}
                                value={localFormData.gender}
                                name="gender"
                                required
                                options={gender} disabled={true}
                            />

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

                            {/* Other form fields remain the same... */}

                        </div>

                        <div className="next-back-btns">
                            <CommonButton
                                className="btn-next"
                                onClick={handleNextStep}
                                disabled={!showData || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="animate-spin inline-block mr-2">↻</span>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                                    </>
                                )}
                            </CommonButton>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default P1;

 