import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommanSelect from '../../components/CommanSelect';
import CommonButton from '../../components/CommonButton';
import { maritalStatusOptions } from '../../data/data';
import { salutation, gender, religion, caste } from '../../data/data';
import workingman from '../../assets/imgs/workingman2.png';
import Swal from 'sweetalert2';
import { pendingAccountData, createAccountService } from '../../services/apiServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PersonalDetailsForm({ formData, updateFormData, onNext, onBack }) {
    const verificationMethod = formData.verificationOption || '';
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});

    const [localFormData, setLocalFormData] = useState({
        salutation: formData.salutation || '',
        first_name: formData.first_name || '',
        middle_name: formData.middle_name || '',
        last_name: formData.last_name || '',
        DOB: formData.DOB || '',
        gender: formData.gender || '',
        religion: formData.religion || '',
        caste: formData.caste || '',
        maritalStatus: formData.maritalStatus || '',
        mobile: formData.mobile || '',
        alt_mob_no: formData.alt_mob_no || '',
        email: formData.email || '',
        adhar_card: formData.adhar_card || '',
        pan_card: formData.pan_card || '',
        driving_license: formData.driving_license || '',
        voterid: formData.voterid || '',
        passport: formData.passport || '',
        status: 'Pending'
    });

    useEffect(() => {
        const id = localStorage.getItem('application_id');
        if (id) {
            fetchAndShowDetails(id);
        }
    }, []);

    const fetchAndShowDetails = async (id) => {
        try {
            if (id) {
                const response1 = await pendingAccountData.getDetailsS1(id);
                const response2 = await pendingAccountData.getDetailsS2A(id);
                const application1 = response1.details || {};
                const application2 = response2.details || {};

                const application = { ...application1, ...application2 };
                const verificationMethod = application.auth_type;

                if (application) {
                    setLocalFormData({
                        salutation: application.salutation || '',
                        first_name: application.first_name || '',
                        middle_name: application.middle_name || '',
                        last_name: application.last_name || '',
                        DOB: application.DOB || '',
                        gender: application.gender || '',
                        religion: application.religion || '',
                        caste: application.caste || '',
                        maritalStatus: application.marital_status || '',
                        mobile: application.mobile || '',
                        alt_mob_no: application.alt_mob_no || '',
                        email: application.email || '',
                        adhar_card: application.adhar_card || (verificationMethod === 'Aadhar Card' ? application.auth_code : ''),
                        pan_card: application.pan_card || (verificationMethod === 'Pan Card' ? application.auth_code : ''),
                        driving_license: application.driving_license || '',
                        voterid: application.voter_id || '',
                        passport: application.passport || '',
                        status: application.status || 'Pending'
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch application details:', error);
            toast.error('Failed to load personal details');
        }
    };
    const validateForm = () => {
        const errors = {};

        // Required fields validation
        const requiredFields = [
            'salutation', 'first_name', 'last_name', 'DOB', 'gender', 'pan_card', 'adhar_card',
            'religion', 'caste', 'maritalStatus', 'mobile', 'email', 'alt_mob_no'
        ];

        // Add PAN to required fields if verification method is Pan Card
        if (verificationMethod === 'Pan Card') {
            requiredFields.push('pan_card');
        }

        requiredFields.forEach(field => {
            if (!localFormData[field]) {
                errors[field] = `${labels[field]?.label || field} is required`;
            }
        });

        // Mobile number validation
        if (!localFormData.mobile || localFormData.mobile.length !== 10) {
            errors.mobile = 'Mobile number must be 10 digits';
        }

        // Alternate mobile number validation (only if provided)
        if (localFormData.alt_mob_no) {
            if (localFormData.alt_mob_no.length !== 10) {
                errors.alt_mob_no = 'Alternate mobile must be 10 digits';
            }
            if (localFormData.alt_mob_no === localFormData.mobile) {
                errors.alt_mob_no = 'Mobile numbers must be different';
            }
        }

        // PAN validation (if provided or required)
        if (localFormData.pan_card || verificationMethod === 'Pan Card') {
            const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

            if (!localFormData.pan_card) {
                errors.pan_card = 'PAN is required';
            } else if (!panRegex.test(localFormData.pan_card.toUpperCase())) {
                errors.pan_card = 'PAN format should be ABCDE1234F';
            }
        }


        // Email validation
        if (localFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localFormData.email)) {
            errors.email = 'Invalid email format';
        }

        // Name fields should not contain numbers
        if (/\d/.test(localFormData.first_name)) {
            errors.first_name = 'First name should not contain numbers';
        }

        if (localFormData.middle_name && /\d/.test(localFormData.middle_name)) {
            errors.middle_name = 'Middle name should not contain numbers';
        }

        if (/\d/.test(localFormData.last_name)) {
            errors.last_name = 'Last name should not contain numbers';
        }

        // Voter ID validation (only if provided)
        if (localFormData.voterid) {
            if (localFormData.voterid.length !== 10) {
                errors.voterid = 'Voter ID must be 10 characters';
            } else if (!/^[A-Z]{3}[0-9]{7}$/i.test(localFormData.voterid)) {
                errors.voterid = 'Voter ID format should be 3 letters followed by 7 digits (e.g., ABC1234567)';
            }
        }
        // Passport validation (only if provided)
        // if (localFormData.passport && localFormData.passport.length !== 8) {
        //     errors.passport = 'Passport must be 8 characters';
        // }
        if (localFormData.passport) {
            if (localFormData.passport.length !== 8) {
                errors.passport = 'Passport must be 8 characters';
            } else if (!/^[A-PR-WYa-pr-wy][0-9]{7}$/.test(localFormData.passport)) {
                errors.passport = 'Passport format should be 1 letter followed by 7 digits (e.g., A1234567)';
            }
        }

        // Driving License validation (only if provided)
        if (localFormData.driving_license && localFormData.driving_license.length !== 16) {
            errors.driving_license = 'Driving License must be 16 characters';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Mark field as touched
        setTouchedFields(prev => ({ ...prev, [name]: true }));

        // Special handling for date fields
        if (name === "DOB") {
            const selectedDate = new Date(value);
            const today = new Date();
            selectedDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (selectedDate > today) {
                setValidationErrors(prev => ({
                    ...prev,
                    DOB: 'Future dates are not allowed for date of birth'
                }));
                return;
            }
        }

        const updatedLocalFormData = { ...localFormData, [name]: value };
        setLocalFormData(updatedLocalFormData);
        updateFormData({
            ...formData,
            personalDetails: updatedLocalFormData
        });

        // Clear error when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouchedFields(prev => ({ ...prev, [name]: true }));
        validateForm();
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const allFields = {
            salutation: true,
            first_name: true,
            middle_name: true,
            last_name: true,
            DOB: true,
            gender: true,
            religion: true,
            caste: true,
            maritalStatus: true,
            mobile: true,
            alt_mob_no: true,
            email: true,
            adhar_card: true,
            pan_card: true,
            driving_license: true,
            voterid: true,
            passport: true
        };
        setTouchedFields(allFields);
        // Mark all fields as touched to show all errors
        const allFieldsTouched = Object.keys(localFormData).reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {});
        setTouchedFields(allFieldsTouched);

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                application_id: formData.application_id,
                salutation: localFormData.salutation,
                religion: localFormData.religion,
                caste: localFormData.caste,
                marital_status: localFormData.maritalStatus ? localFormData.maritalStatus.toUpperCase() : undefined,
                alt_mob_no: localFormData.alt_mob_no,
                email: localFormData.email,
                adhar_card: localFormData.adhar_card,
                pan_card: localFormData.pan_card,
                passport: localFormData.passport,
                driving_license: localFormData.driving_license,
                voter_id: localFormData.voterid,
                status: 'Pending'
            };

            const response = await createAccountService.personalDetails_s2a(payload);

            Swal.fire({
                icon: 'success',
                title: response.data.message || 'Personal details saved successfully.',
                showConfirmButton: false,
                timer: 1500
            });
            onNext();

        } catch (error) {
            console.error("Error saving personal details:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error?.data?.message || 'Failed to save personal details',
                confirmButtonText: 'OK',
            });

        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <form className="personal-details-form">
            <h2 className="text-xl font-bold mb-2">Personal Details</h2>
            <div className='block sm:flex'>
                <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-3">
                    {/* Salutation */}
                    <div>
                        <CommanSelect
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.salutation.label}
                            name="salutation"
                            value={localFormData.salutation}
                            options={salutation}
                            required
                            className={validationErrors.salutation && touchedFields.salutation ? 'border-red-500' : ''}
                        />
                        {validationErrors.salutation && touchedFields.salutation && (
                            <p className="text-red-500 text-xs">{validationErrors.salutation}</p>
                        )}
                    </div>

                    {/* First Name */}
                    <div>
                        <CommanInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.firstname.label}
                            name="first_name"
                            value={localFormData.first_name}
                            required
                            max={30}
                            validationType="TEXT_ONLY"
                            className={validationErrors.first_name && touchedFields.first_name ? 'border-red-500' : ''}
                        />
                        {validationErrors.first_name && touchedFields.first_name && (
                            <p className="text-red-500 text-xs">{validationErrors.first_name}</p>
                        )}
                    </div>

                    {/* Middle Name */}
                    <div>
                        <CommanInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.middlename.label}
                            name="middle_name"
                            value={localFormData.middle_name}
                            max={30}
                            validationType="TEXT_ONLY"
                            className={validationErrors.middle_name && touchedFields.middle_name ? 'border-red-500' : ''}
                        />
                        {validationErrors.middle_name && touchedFields.middle_name && (
                            <p className="text-red-500 text-xs">{validationErrors.middle_name}</p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <CommanInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.lastname.label}
                            name="last_name"
                            value={localFormData.last_name}
                            required
                            max={30}
                            validationType="TEXT_ONLY"
                            className={validationErrors.last_name && touchedFields.last_name ? 'border-red-500' : ''}
                        />
                        {validationErrors.last_name && touchedFields.last_name && (
                            <p className="text-red-500 text-xs">{validationErrors.last_name}</p>
                        )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <CommanInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.dob.label}
                            type="date"
                            name="DOB"
                            value={localFormData.DOB}
                            max={new Date().toISOString().split("T")[0]}
                            required
                            className={validationErrors.DOB && touchedFields.DOB ? 'border-red-500' : ''}
                        />
                        {validationErrors.DOB && touchedFields.DOB && (
                            <p className="text-red-500 text-xs">{validationErrors.DOB}</p>
                        )}
                    </div>

                    {/* Gender */}
                    <div>
                        <CommanSelect
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.gender.label}
                            name="gender"
                            value={localFormData.gender}
                            options={gender}
                            required
                            className={validationErrors.gender && touchedFields.gender ? 'border-red-500' : ''}
                        />
                        {validationErrors.gender && touchedFields.gender && (
                            <p className="text-red-500 text-xs">{validationErrors.gender}</p>
                        )}
                    </div>

                    {/* Religion */}
                    <div>
                        <CommanSelect
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.religion.label}
                            name="religion"
                            value={localFormData.religion}
                            options={religion}
                            required
                            className={validationErrors.religion && touchedFields.religion ? 'border-red-500' : ''}
                        />
                        {validationErrors.religion && touchedFields.religion && (
                            <p className="text-red-500 text-xs">{validationErrors.religion}</p>
                        )}
                    </div>

                    {/* Caste */}
                    <div>
                        <CommanSelect
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.caste.label}
                            name="caste"
                            value={localFormData.caste}
                            options={caste}
                            required
                            className={validationErrors.caste && touchedFields.caste ? 'border-red-500' : ''}
                        />
                        {validationErrors.caste && touchedFields.caste && (
                            <p className="text-red-500 text-xs">{validationErrors.caste}</p>
                        )}
                    </div>

                    {/* Marital Status */}
                    <div>
                        <CommanSelect
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.maritalStatus.label}
                            name="maritalStatus"
                            value={localFormData.maritalStatus}
                            options={maritalStatusOptions}
                            required={true}
                            className={validationErrors.maritalStatus && touchedFields.maritalStatus ? 'border-red-500' : ''}
                        />
                        {validationErrors.maritalStatus && touchedFields.maritalStatus && (
                            <p className="text-red-500 text-xs">{validationErrors.maritalStatus}</p>
                        )}
                    </div>

                    {/* Mobile */}
                    <div>
                        <CommanInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.mobile.label}
                            type="number"
                            name="mobile"
                            value={localFormData.mobile}
                            required
                            max={10} min={10}
                            validationType="PHONE"
                            className={validationErrors.mobile && touchedFields.mobile ? 'border-red-500' : ''}
                        />
                        {validationErrors.mobile && touchedFields.mobile && (
                            <p className="text-red-500 text-xs">{validationErrors.mobile}</p>
                        )}
                    </div>

                    {/* Alternate Mobile */}
                    <div>
                        <CommanInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.alt_mob_no.label}
                            type="number"
                            name="alt_mob_no"
                            value={localFormData.alt_mob_no}
                            // required
                            max={10} min={10}
                            validationType="NUMBER_ONLY"
                            className={validationErrors.alt_mob_no && touchedFields.alt_mob_no ? 'border-red-500' : ''}
                        />
                        {validationErrors.alt_mob_no && touchedFields.alt_mob_no && (
                            <p className="text-red-500 text-xs">{validationErrors.alt_mob_no}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <CommanInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.email.label}
                            type="email"
                            name="email"
                            value={localFormData.email}
                            required
                            validationType="EMAIL"
                            className={validationErrors.email && touchedFields.email ? 'border-red-500' : ''}
                        />
                        {validationErrors.email && touchedFields.email && (
                            <p className="text-red-500 text-xs">{validationErrors.email}</p>
                        )}
                    </div>

                    {/* Aadhar Card */}
                    <div>
                        <CommanInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.adhar_card.label}
                            type="number"
                            name="adhar_card"
                            value={localFormData.adhar_card}
                            required={true}
                            max={12}
                            validationType="NUMBER_ONLY"
                            disabled={verificationMethod === 'Aadhar Card'}
                            className={validationErrors.adhar_card && touchedFields.adhar_card ? 'border-red-500' : ''}
                        />
                        {validationErrors.adhar_card && touchedFields.adhar_card && (
                            <p className="text-red-500 text-xs">{validationErrors.adhar_card}</p>
                        )}
                    </div>

                    {/* PAN */}
                    <div>
                        <CommanInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.pannumber.label}
                            type="text"
                            name="pan_card"
                            value={localFormData.pan_card}
                            required={true}
                            max={10}
                            validationType="PAN"
                            disabled={verificationMethod === 'Pan Card'}
                            onInput={(e) => {
                                e.target.value = e.target.value.toUpperCase();
                            }}
                            className={validationErrors.pan_card && touchedFields.pan_card ? 'border-red-500' : ''}
                        />
                        {validationErrors.pan_card && touchedFields.pan_card && (
                            <p className="text-red-500 text-xs mt-1">{validationErrors.pan_card}</p>
                        )}
                    </div>

                    {/* Passport */}
                    <div>
                        <CommanInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.passportno.label}
                            type="text"
                            name="passport"
                            value={localFormData.passport}
                            max={8} min={8}
                            validationType="ALPHANUMERIC"
                            className={validationErrors.passport && touchedFields.passport ? 'border-red-500' : ''}
                        />
                        {validationErrors.passport && touchedFields.passport && (
                            <p className="text-red-500 text-xs">{validationErrors.passport}</p>
                        )}
                    </div>


                    {/* Voter ID */}
                    <div>
                        <CommanInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.voterid.label}
                            type="text"
                            name="voterid"
                            value={localFormData.voterid}
                            max={10} min={10}
                            validationType="ALPHANUMERIC"
                            className={validationErrors.voterid && touchedFields.voterid ? 'border-red-500' : ''}
                        />
                        {validationErrors.voterid && touchedFields.voterid && (
                            <p className="text-red-500 text-xs">{validationErrors.voterid}</p>
                        )}
                    </div>

                    {/* Driving License */}
                    <div>
                        <CommanInput
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label={labels.drivinglicence.label}
                            type="text"
                            name="driving_license"
                            value={localFormData.driving_license}
                            max={16}
                            validationType="driving_license"
                            className={validationErrors.driving_license && touchedFields.driving_license ? 'border-red-500' : ''}
                        />
                        {validationErrors.driving_license && touchedFields.driving_license && (
                            <p className="text-red-500 text-xs">{validationErrors.driving_license}</p>
                        )}
                    </div>
                </div>
                <img src={workingman} width={'400px'} alt="workingman" className='m-auto' />
            </div>

            <div className="next-back-btns z-10">
                <CommonButton
                    className="btn-back"
                    onClick={onBack}
                    iconLeft={<i className="bi bi-chevron-double-left"></i>}
                    disabled={isSubmitting}
                >
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>

                <CommonButton
                    className="btn-next"
                    onClick={handleSubmit}
                    iconRight={<i className="bi bi-chevron-double-right"></i>}
                    disabled={isSubmitting}
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
            <ToastContainer position="top-right" autoClose={5000} />
        </form>
    );
}

export default PersonalDetailsForm;









