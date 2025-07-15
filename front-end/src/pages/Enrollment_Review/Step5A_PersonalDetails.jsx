
import React, { useState, useEffect } from 'react';
import { pendingAccountData, applicationDetailsService, createAccountService , agentService,pendingAccountStatusUpdate} from '../../services/apiServices';
import CommanInput from '../../components/CommanInput';
import CommanSelect from '../../components/CommanSelect';
import { maritalStatusOptions } from '../../data/data';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { salutation, religion, caste, salaryrange } from '../../data/data';
import { useParams } from "react-router-dom";

function PersonalOccupationForm({ formData, updateFormData, onBack, onNext }) {
    const applicationId = localStorage.getItem('application_id'); 
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState(null);   const {id}=useParams();
    const [validationErrors, setValidationErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isView, setIsView] = useState(false);
    const admin_id= localStorage.getItem('userCode');
    const [localFormData, setLocalFormData] = useState({
        application_id: applicationId,
        maidenPrefixName: '',
        maidenFirstName: '',
        maidenMiddleName: '',
        maidenLastName: '',
        fatherSpousePrefixName: '',
        fatherSpouseFirstName: '',
        fatherSpouseMiddleName: '',
        fatherSpouseLastName: '',
        motherPrefixName: '',
        motherFirstName: '',
        motherMiddleName: '',
        motherLastName: '',
        birthPlaceCity: '',
        birthPlaceCountry: 'India',
        maritalStatus: '',
        nationality: 'Indian',
        religion: '',
        caste: '',
        occupationType: '',
        businessName: '',
        salariedWith: '',
        designation: '',
        organisationNature: '',
        educationQualification: '',
        annualIncome: '',
        remark: ''
    });
 
    useEffect(() => { fetchReason(applicationId);  fetchDetails(applicationId);  fetchAndStoreDetails();  }, [applicationId]);
    useEffect(() => {
        const role = localStorage.getItem("roleName");
        setIsAdmin(role.includes("admin") || role.includes("Admin"));
        setIsView(window.location.href.includes("view")); 
     }, []);

    const fetchAndStoreDetails = async (applicationId) => {
        try { 
            const response = await pendingAccountData.getDetailsS1(applicationId);
            const application = response.details || {};
            setLocalFormData(prevData => ({
                ...prevData,
                motherLastName: application.last_name || '',
                fatherSpouseLastName: application.last_name || '',
                maidenLastName: application.last_name || '',
                fatherSpouseFirstName: application.middle_name || '',
            })); 
        } catch (error) {
            alert(JSON.stringify(error))
        }
    };
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
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedLocalFormData = { ...localFormData, [name]: value };

        setLocalFormData(updatedLocalFormData);
        updateFormData({
            ...formData,
            personalOccupation: updatedLocalFormData
        });

        // Mark field as touched
        setTouchedFields(prev => ({ ...prev, [name]: true }));

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

    const fetchDetails = async (applicationId) => {
        try { 
            const response = await applicationDetailsService.getFullDetails(applicationId);
            if (response && response.data) {
                const { personal_details, account_personal_details } = response.data;

                setLocalFormData(prev => ({
                    ...prev,
                    maidenPrefixName: account_personal_details?.maiden_prefix || prev.maidenPrefixName,
                    maidenFirstName: account_personal_details?.maiden_first_name || prev.maidenFirstName,
                    maidenMiddleName: account_personal_details?.maiden_middle_name || prev.maidenMiddleName,
                    maidenLastName: account_personal_details?.maiden_last_name || prev.maidenLastName,
                    fatherSpousePrefixName: account_personal_details?.father_prefix_name || prev.fatherSpousePrefixName,
                    fatherSpouseFirstName: account_personal_details?.father_first_name || prev.fatherSpouseFirstName,
                    fatherSpouseMiddleName: account_personal_details?.father_middle_name || prev.fatherSpouseMiddleName,
                    fatherSpouseLastName: account_personal_details?.father_last_name || prev.fatherSpouseLastName,
                    motherPrefixName: account_personal_details?.mother_prefix_name || prev.motherPrefixName,
                    motherFirstName: account_personal_details?.mother_first_name || prev.motherFirstName,
                    motherMiddleName: account_personal_details?.mother_middle_name || prev.motherMiddleName,
                    motherLastName: account_personal_details?.mother_last_name || prev.motherLastName,
                    birthPlaceCity: account_personal_details?.birth_place || prev.birthPlaceCity,
                    birthPlaceCountry: account_personal_details?.birth_country || prev.birthPlaceCountry,
                    maritalStatus: personal_details?.marital_status || prev.marital_status,
                    religion: personal_details?.religion || prev.religion,
                    caste: personal_details?.caste || prev.caste,
                    occupationType: account_personal_details?.occoupation_type || prev.occupationType,
                    businessName: account_personal_details?.occupation_name || prev.businessName,
                    salariedWith: account_personal_details?.if_salaryed || prev.salariedWith,
                    designation: account_personal_details?.designation || prev.designation,
                    organisationNature: account_personal_details?.nature_of_occoupation || prev.organisationNature,
                    educationQualification: account_personal_details?.qualification || prev.educationQualification,
                    annualIncome: account_personal_details?.anual_income || prev.annualIncome,
                    remark: account_personal_details?.remark || prev.remark
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };
 
    const validateForm = () => {
    const errors = {};

    // Required fields validation
    const requiredFields = [
        'birthPlaceCity', 'birthPlaceCountry', 'maritalStatus', 
        'nationality', 'religion', 'caste'
    ];

    requiredFields.forEach(field => {
        if (!localFormData[field]) {
            errors[field] = `${labels[field]?.label || field} Required`;
        }
    });

    // Validate name fields (should not contain numbers)
    const nameFields = [
        'maidenFirstName', 'maidenMiddleName', 'maidenLastName',
        'fatherSpouseFirstName', 'fatherSpouseMiddleName', 'fatherSpouseLastName',
        'motherFirstName', 'motherMiddleName', 'motherLastName',
        'birthPlaceCity', 'birthPlaceCountry', 'nationality'
    ];

    nameFields.forEach(field => {
        if (localFormData[field] && /\d/.test(localFormData[field])) {
            errors[field] = `${labels[field]?.label || field} should only contain letters`; 
        }
    });

    // Validate occupation fields that should be letters only
    const occupationFields = [
        'occupationType', 'salariedWith', 'designation',
        'organisationNature', 'educationQualification'
    ];

    occupationFields.forEach(field => {
        if (localFormData[field] && /\d/.test(localFormData[field])) {
            errors[field] = `${labels[field]?.label || field} should only contain letters`;
        }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
    };

    const submitpersonaldetails = async (e) => {
        if (e && e.preventDefault) e.preventDefault();        
        // Mark all fields as touched to show all errors
        const allFields = Object.keys(localFormData).reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {});
        setTouchedFields(allFields); 
        if (!validateForm()) {  return;   }
        setIsSubmitting(true);
        try {
            const payload = {
                application_id:applicationId ||  localFormData.application_id,
                maiden_prefix: localFormData.maidenPrefixName,
                maiden_first_name: localFormData.maidenFirstName,
                maiden_middle_name: localFormData.maidenMiddleName,
                maiden_last_name: localFormData.maidenLastName,
                father_prefix_name: localFormData.fatherSpousePrefixName,
                father_first_name: localFormData.fatherSpouseFirstName,
                father_middle_name: localFormData.fatherSpouseMiddleName,
                father_last_name: localFormData.fatherSpouseLastName,
                mother_prefix_name: localFormData.motherPrefixName,
                mother_first_name: localFormData.motherFirstName,
                mother_middle_name: localFormData.motherMiddleName,
                mother_last_name: localFormData.motherLastName,
                birth_place: localFormData.birthPlaceCity,
                birth_country: localFormData.birthPlaceCountry,
                occoupation_type: localFormData.occupationType,
                occupation_name: localFormData.businessName,
                if_salaryed: localFormData.salariedWith,
                designation: localFormData.designation,
                nature_of_occoupation: localFormData.organisationNature,
                qualification: localFormData.educationQualification,
                anual_income: localFormData.annualIncome,
                remark: localFormData.remark,
                status: "Pending",
            };

            const response = await createAccountService.accountPersonalDetails_s5a(payload);

            Swal.fire({
                icon: 'success',
                title: response.data.message || 'Account personal details saved!',
                showConfirmButton: false,
                timer: 1500
            });

            if (onNext) onNext();

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text:  JSON.stringify( error.data.message ) || 'Failed to save details'
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    // admin controls below

    const handleRejectClick = async () => {
        const result = await Swal.fire({
            title: 'Reason for Rejection',
            input: 'text',
            inputLabel: 'Personal Details Rejection Reason',
            inputPlaceholder: 'Enter reason here...',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            className: 'btn-login',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write a reason!';
                }
            },
        });

        if (result.isConfirmed && result.value) {
            const payload = {
                application_id: Number(id),
                status: 'Rejected',
                status_comment: result.value,
                admin_id: admin_id
            };
            await pendingAccountStatusUpdate.updateS5A(id, payload); 
            onNext();
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    };

    const handleReviewClick = async () => {
        const result = await Swal.fire({
            title: 'Reason for Review',
            input: 'text',
            inputLabel: 'Personal Details Review Reason',
            inputPlaceholder: 'Enter reason here...',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            className: 'btn-login',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write a reason!';
                }
            },
        });

        if (result.isConfirmed && result.value) {
            const payload = {
                application_id: Number(id),
                status: 'Review',
                status_comment: result.value,
                admin_id: admin_id
            };
            await pendingAccountStatusUpdate.updateS5A(id, payload); 
            onNext();
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    };

    const handleApproveClick = () => {
        try {
            const payload = {
                applicaiton_id: Number(id),
                status: 'Approved',
                status_comment: '',
                admin_id: admin_id
            }
            pendingAccountStatusUpdate.updateS5A(id, payload); 
            Swal.fire({
                icon: 'success',
                title: 'Personal Details Approved Successfully',
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
            onNext();
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error?.response?.data?.message,
            });
        }
    }
    // admin controls above

    return (
   <div className="max-w-screen-xl mx-auto mb-10" style={{ marginTop: '-6px' }}>
        <h2 className="text-xl font-bold mb-2">Personal Details</h2>
        {reason &&  <p className="text-red-500 mb-3 " > Review For :{ reason.account_personal_details_status_comment}</p> }
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3"> 
            {/* Maiden Name Section */}
            <div>
                <CommanSelect
                    value={localFormData.maidenPrefixName}
                    label={labels.maidenPrefixName.label}
                    name="maidenPrefixName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={salutation}
                    className={validationErrors.maidenPrefixName && touchedFields.maidenPrefixName ? 'border-red-500' : ''}
                />
                {validationErrors.maidenPrefixName && touchedFields.maidenPrefixName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.maidenPrefixName}</p>
                )}
            </div>
            
            <div>
                <CommanInput
                    label={labels.maidenFirstName.label}
                    name="maidenFirstName"
                    value={localFormData.maidenFirstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.maidenFirstName && touchedFields.maidenFirstName ? 'border-red-500' : ''}
                />
                {validationErrors.maidenFirstName && touchedFields.maidenFirstName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.maidenFirstName}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.maidenMiddleName.label}
                    name="maidenMiddleName"
                    value={localFormData.maidenMiddleName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.maidenMiddleName && touchedFields.maidenMiddleName ? 'border-red-500' : ''}
                />
                {validationErrors.maidenMiddleName && touchedFields.maidenMiddleName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.maidenMiddleName}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.maidenLastName.label}
                    name="maidenLastName"
                    value={localFormData.maidenLastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.maidenLastName && touchedFields.maidenLastName ? 'border-red-500' : ''}
                />
                {validationErrors.maidenLastName && touchedFields.maidenLastName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.maidenLastName}</p>
                )}
            </div>

            {/* Father/Spouse Section */}
            <div>
                <CommanSelect
                    value={localFormData.fatherSpousePrefixName}
                    label={labels.fatherSpousePrefixName.label}
                    name="fatherSpousePrefixName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={salutation}
                    className={validationErrors.fatherSpousePrefixName && touchedFields.fatherSpousePrefixName ? 'border-red-500' : ''}
                />
                {validationErrors.fatherSpousePrefixName && touchedFields.fatherSpousePrefixName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.fatherSpousePrefixName}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.fatherSpouseFirstName.label}
                    name="fatherSpouseFirstName"
                    value={localFormData.fatherSpouseFirstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.fatherSpouseFirstName && touchedFields.fatherSpouseFirstName ? 'border-red-500' : ''}
                />
                {validationErrors.fatherSpouseFirstName && touchedFields.fatherSpouseFirstName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.fatherSpouseFirstName}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.fatherSpouseMiddleName.label}
                    name="fatherSpouseMiddleName"
                    value={localFormData.fatherSpouseMiddleName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.fatherSpouseMiddleName && touchedFields.fatherSpouseMiddleName ? 'border-red-500' : ''}
                />
                {validationErrors.fatherSpouseMiddleName && touchedFields.fatherSpouseMiddleName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.fatherSpouseMiddleName}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.fatherSpouseLastName.label}
                    name="fatherSpouseLastName"
                    value={localFormData.fatherSpouseLastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.fatherSpouseLastName && touchedFields.fatherSpouseLastName ? 'border-red-500' : ''}
                />
                {validationErrors.fatherSpouseLastName && touchedFields.fatherSpouseLastName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.fatherSpouseLastName}</p>
                )}
            </div>

            {/* Mother Section */}
            <div>
                <CommanSelect
                    label={labels.motherPrefixName.label}
                    name="motherPrefixName"
                    value={localFormData.motherPrefixName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={salutation}
                    className={validationErrors.motherPrefixName && touchedFields.motherPrefixName ? 'border-red-500' : ''}
                />
                {validationErrors.motherPrefixName && touchedFields.motherPrefixName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.motherPrefixName}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.motherFirstName.label}
                    name="motherFirstName"
                    value={localFormData.motherFirstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.motherFirstName && touchedFields.motherFirstName ? 'border-red-500' : ''}
                />
                {validationErrors.motherFirstName && touchedFields.motherFirstName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.motherFirstName}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.motherMiddleName.label}
                    name="motherMiddleName"
                    value={localFormData.motherMiddleName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.motherMiddleName && touchedFields.motherMiddleName ? 'border-red-500' : ''}
                />
                {validationErrors.motherMiddleName && touchedFields.motherMiddleName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.motherMiddleName}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.motherLastName.label}
                    name="motherLastName"
                    value={localFormData.motherLastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.motherLastName && touchedFields.motherLastName ? 'border-red-500' : ''}
                />
                {validationErrors.motherLastName && touchedFields.motherLastName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.motherLastName}</p>
                )}
            </div>

            {/* Birth and Personal Details */}
            <div>
                <CommanInput
                    label={labels.birthPlaceCity.label}
                    name="birthPlaceCity"
                    value={localFormData.birthPlaceCity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.birthPlaceCity && touchedFields.birthPlaceCity ? 'border-red-500' : ''}
                />
                {validationErrors.birthPlaceCity && touchedFields.birthPlaceCity && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.birthPlaceCity}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.birthPlaceCountry.label}
                    name="birthPlaceCountry"
                    value={localFormData.birthPlaceCountry}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.birthPlaceCountry && touchedFields.birthPlaceCountry ? 'border-red-500' : ''}
                />
                {validationErrors.birthPlaceCountry && touchedFields.birthPlaceCountry && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.birthPlaceCountry}</p>
                )}
            </div>

            <div>
                <CommanSelect
                    label={labels.maritalStatus.label}
                    name="maritalStatus"
                    value={localFormData.maritalStatus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required disabled={true}
                    options={maritalStatusOptions}
                    className={validationErrors.maritalStatus && touchedFields.maritalStatus ? 'border-red-500' : ''}
                />
                {validationErrors.maritalStatus && touchedFields.maritalStatus && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.maritalStatus}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.nationality.label}
                    name="nationality"
                    value={localFormData.nationality}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.nationality && touchedFields.nationality ? 'border-red-500' : ''}
                />
                {validationErrors.nationality && touchedFields.nationality && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.nationality}</p>
                )}
            </div>

            <div>
                <CommanSelect
                    label={labels.religion.label}
                    name="religion"
                    value={localFormData.religion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required  disabled={true}
                    options={religion}
                    className={validationErrors.religion && touchedFields.religion ? 'border-red-500' : ''}
                />
                {validationErrors.religion && touchedFields.religion && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.religion}</p>
                )}
            </div>

            <div>
                <CommanSelect
                    label={labels.caste.label}
                    name="caste"
                    value={localFormData.caste}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required  disabled={true}
                    options={caste}
                    className={validationErrors.caste && touchedFields.caste ? 'border-red-500' : ''}
                />
                {validationErrors.caste && touchedFields.caste && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.caste}</p>
                )}
            </div>
        </div>

        <h2 className="text-xl font-bold mt-2 mb-2">Occupation Details</h2>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
            <div>
                <CommanInput
                    label={labels.occupationType.label}
                    name="occupationType"
                    value={localFormData.occupationType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.occupationType && touchedFields.occupationType ? 'border-red-500' : ''}
                />
                {validationErrors.occupationType && touchedFields.occupationType && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.occupationType}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.businessName.label}
                    name="businessName"
                    value={localFormData.businessName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="ALPHANUMERIC_AND_SPACE"
                    max={51}
                    className={validationErrors.businessName && touchedFields.businessName ? 'border-red-500' : ''}
                />
                {validationErrors.businessName && touchedFields.businessName && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.businessName}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.salariedWith.label}
                    name="salariedWith"
                    value={localFormData.salariedWith}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.salariedWith && touchedFields.salariedWith ? 'border-red-500' : ''}
                />
                {validationErrors.salariedWith && touchedFields.salariedWith && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.salariedWith}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.designation.label}
                    name="designation"
                    value={localFormData.designation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.designation && touchedFields.designation ? 'border-red-500' : ''}
                />
                {validationErrors.designation && touchedFields.designation && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.designation}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.organisationNature.label}
                    name="organisationNature"
                    value={localFormData.organisationNature}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.organisationNature && touchedFields.organisationNature ? 'border-red-500' : ''}
                />
                {validationErrors.organisationNature && touchedFields.organisationNature && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.organisationNature}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.educationQualification.label}
                    name="educationQualification"
                    value={localFormData.educationQualification}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="ALPHABETS_AND_SPACE"
                    max={51}
                    className={validationErrors.educationQualification && touchedFields.educationQualification ? 'border-red-500' : ''}
                />
                {validationErrors.educationQualification && touchedFields.educationQualification && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.educationQualification}</p>
                )}
            </div>

            <div>
                <CommanSelect
                    label={labels.annualIncome.label}
                    name="annualIncome"
                    value={localFormData.annualIncome}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={salaryrange}
                    className={validationErrors.annualIncome && touchedFields.annualIncome ? 'border-red-500' : ''}
                />
                {validationErrors.annualIncome && touchedFields.annualIncome && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.annualIncome}</p>
                )}
            </div>

            <div>
                <CommanInput
                    label={labels.remark.label}
                    name="remark"
                    value={localFormData.remark}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validationType="EVERYTHING"
                    max={200}
                    className={validationErrors.remark && touchedFields.remark ? 'border-red-500' : ''}
                />
                {validationErrors.remark && touchedFields.remark && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.remark}</p>
                )}
            </div>
        </div>

        <div className="next-back-btns z-10">
            <CommonButton 
                onClick={onBack} 
                variant="outlined" 
                className="btn-back"
                disabled={isSubmitting}
            >
                <i className="bi bi-chevron-double-left"></i>&nbsp;Back
            </CommonButton>


            {!isView ? (<>                              
                {isAdmin ? (                            
                    <>
                    <CommonButton
                        className="text-red-500 border border-red-500 hover:bg-red-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
                        onClick={handleRejectClick}
                    >
                        Reject & Continue
                    </CommonButton>

                    <CommonButton
                        className="text-amber-500 border border-amber-500 hover:bg-amber-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
                        onClick={handleReviewClick}
                    >
                        Review & Continue
                    </CommonButton>

                    <CommonButton
                        className="btn-next"
                        onClick={handleApproveClick}
                    >
                        Accept & Continue
                    </CommonButton>
                    </>
                ) 
                : (
                <>
                    <CommonButton
                    className="btn-next"
                    onClick={submitpersonaldetails}
                    disabled={isSubmitting}
                    >
                    {isSubmitting ? (
                        <>
                        <span className="animate-spin inline-block mr-2">
                            ↻
                        </span>
                        Processing...
                        </>
                    ) : (
                        <>
                        Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                        </>
                    )}
                    </CommonButton>
                </>
                )} 
            </>) : (<>
                <CommonButton  className="btn-next"  onClick={onNext}  >  
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i> 
                </CommonButton>                            
            </>)}
                

 
        </div>
    </div>
    );
}

export default PersonalOccupationForm;

 