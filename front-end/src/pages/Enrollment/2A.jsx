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
        pannumber: formData.pannumber || '',
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

            // Use application1 as base, then overwrite with application2 values if they exist
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
                    pannumber: application.pan_card || (verificationMethod === 'Pan Card' ? application.auth_code : ''),
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
            'salutation', 'first_name', 'last_name', 'DOB', 'gender',
            'religion', 'caste', 'maritalStatus', 'mobile', 'email'
        ];

        requiredFields.forEach(field => {
            if (!localFormData[field]) {
                errors[field] = `${labels[field]?.label || field} is required`;
            }
        });

        // Field-specific validations
        if (localFormData.mobile && localFormData.mobile.length !== 10) {
            errors.mobile = 'Mobile number must be 10 digits';
        }

        if (localFormData.alt_mob_no && localFormData.alt_mob_no.length !== 10) {
            errors.alt_mob_no = 'Alternate mobile number must be 10 digits';
        }

        if (localFormData.pannumber && localFormData.pannumber.length !== 10) {
            errors.pannumber = 'PAN number must be 10 characters';
        }

        if (localFormData.mobile === localFormData.alt_mob_no && localFormData.alt_mob_no) {
            errors.alt_mob_no = 'Mobile numbers must be different';
        }

        if (localFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localFormData.email)) {
            errors.email = 'Invalid email format';
        }

        // Name fields should not contain numbers
        if (/\d/.test(localFormData.first_name)) {
            errors.first_name = 'First name should not contain numbers';
        }

        if (/\d/.test(localFormData.middle_name)) {
            errors.middle_name = 'Middle name should not contain numbers';
        }

        if (/\d/.test(localFormData.last_name)) {
            errors.last_name = 'Last name should not contain numbers';
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
                toast.error('Future dates are not allowed for date of birth');
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

    const comapremobileno=()=>{     
        if (localFormData.mobile === localFormData.alt_mob_no) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Mobile numbers must be different',
                })
            }

    }
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouchedFields(prev => ({ ...prev, [name]: true }));
        validateForm();
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        
        // Mark all fields as touched to show all errors
        const allFieldsTouched = Object.keys(localFormData).reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {});
        setTouchedFields(allFieldsTouched);
        
        if (!validateForm()) {
            toast.error('Please fill all required fields correctly');
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
                pan_card: localFormData.pannumber,
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
                    // handleNext();
            onNext();

        } catch (error) {
            console.error("Error saving personal details:", error);
            toast.error(error.response?.data?.message || 'Failed to save personal details');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ... (rest of your component code remains the same)
    return (
        <form className="personal-details-form">
            {/* Your existing form JSX */}
            {/* Make sure to add error and touched props to all form fields */}
            <h2 className="text-xl font-bold mb-2">Personal Details</h2>
             <div className='block sm:flex'>
                 <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-5">

                     {/* Salutation - Select field */}
                     <CommanSelect
                        onChange={handleChange}
                        label={labels.salutation.label}
                        name="salutation"
                        value={localFormData.salutation}
                        options={salutation}
                        required
                    />

                    {/* First Name - Text only, 50 char limit */}
                    <CommanInput
                        onChange={handleChange}
                        label={labels.firstname.label} 
                        name="first_name"
                        value={localFormData.first_name}
                        required
                        max={30}
                        validationType="TEXT_ONLY" 
                    />

                    {/* Middle Name - Text only, 50 char limit */}
                    <CommanInput
                        onChange={handleChange}
                        label={labels.middlename.label} 
                        name="middle_name"
                        value={localFormData.middle_name}
                        max={30}
                        validationType="TEXT_ONLY"
                    />

                    {/* Last Name - Text only, 50 char limit */}
                    <CommanInput
                        onChange={handleChange}
                        label={labels.lastname.label} 
                        name="last_name"
                        value={localFormData.last_name}
                        required
                        max={30}
                        validationType="TEXT_ONLY"
                    />

                    {/* Date of Birth - Date validation */}
                    <CommanInput
                        onChange={handleChange}
                        label={labels.dob.label}
                        type="date"
                        name="DOB"
                        value={localFormData.DOB}
                        max={  new Date().toISOString().split("T")[0] } 
                        required 
                    />

                    {/* Gender - Select field */}
                    <CommanSelect
                        onChange={handleChange}
                        label={labels.gender.label}
                        name="gender"
                        value={localFormData.gender}
                        options={gender}
                        required
                    />

                    {/* Religion - Select field */}
                    <CommanSelect
                        onChange={handleChange}
                        label={labels.religion.label}
                        name="religion"
                        value={localFormData.religion}
                        options={religion}
                        required
                    />

                    {/* Caste - Select field */}
                    <CommanSelect
                        onChange={handleChange}
                        label={labels.caste.label}
                        name="caste"
                        value={localFormData.caste}
                        options={caste}
                        required
                    />

                    {/* Marital Status - Select field */}
                    <CommanSelect
                        onChange={handleChange}
                        label={labels.maritalStatus.label}
                        name="maritalStatus"
                        value={localFormData.maritalStatus}
                        options={maritalStatusOptions}
                        required={true}
                    />

                    {/* Mobile - Phone number validation */}
                    <CommanInput
                        onChange={handleChange}
                        label={labels.mobile.label}
                        type="number"
                        name="mobile"
                        value={localFormData.mobile}
                        required
                        max={10} min={10}
                        validationType="PHONE"
                    />

                    {/* Alternate Mobile - Phone number validation */}
                    <CommanInput
                        onChange={handleChange}
                        label={labels.alt_mob_no.label}
                        type="number"
                        name="alt_mob_no"
                        value={localFormData.alt_mob_no}
                        onBlur={comapremobileno}
                        required
                        max={10} min={10}
                        validationType="PHONE"
                    />

                    {/* Email - Email validation */}
                    <CommanInput
                        onChange={handleChange}
                        label={labels.email.label}
                        type="email"
                        name="email"
                        value={localFormData.email}
                        required
                        validationType="EMAIL"
                    />


                    <CommanInput
                        onChange={handleChange}
                        label={labels.adhar_card.label}
                        type="text"
                        name="adhar_card"
                        value={localFormData.adhar_card}
                        required={true} // Required if this was verification method
                        max={12}
                        validationType="NUMBER_ONLY"
                        disabled={verificationMethod === 'Aadhar Card'} // Disable if this was verification method
                    />

                    {/* Always show PAN field */}
                    <CommanInput
                        onChange={handleChange}
                        label={labels.pannumber.label}
                        type="text"
                        name="pannumber"
                        value={localFormData.pannumber}
                        required={true}
                        // required={verificationMethod === 'Pan Card'}
                        max={10}
                        validationType="PAN"
                        disabled={verificationMethod === 'Pan Card'} // Disable if this was verification method
                        onInput={(e) => {
                            e.target.value = e.target.value.toUpperCase();
                        }}
                    />

                    {/* Passport Number - Alphanumeric */}
                    <CommanInput
                        onChange={handleChange}
                        label={labels.passportno.label}
                        type="text"
                        name="passport"
                        value={localFormData.passport}
                        max={8}
                        validationType="ALPHANUMERIC"
                    />

                    {/* Voter ID - Alphanumeric with special chars */}
                    <CommanInput
                        onChange={handleChange}
                        label={labels.voterid.label}
                        type="text"
                        name="voterid"
                        value={localFormData.voterid}
                        max={10}
                        validationType="ALPHANUMERIC"
                    />

                    {/* Driving License - Alphanumeric with special chars */}
                    <CommanInput
                        onChange={handleChange}
                        label={labels.drivinglicence.label}
                        type="text"
                        name="driving_license"
                        value={localFormData.driving_license}
                        max={16}
                        validationType="driving_license"
                    />


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




















// import React, { useState, useEffect } from 'react';
// import CommanInput from '../../components/CommanInput';
// import labels from '../../components/labels';
// import CommanSelect from '../../components/CommanSelect';
// import CommonButton from '../../components/CommonButton';
// import { maritalStatusOptions } from '../../data/data';
// import { salutation, gender, religion, caste } from '../../data/data';
// import workingman from '../../assets/imgs/workingman2.png';
// import Swal from 'sweetalert2'; 
// import { pendingAccountData, createAccountService } from '../../services/apiServices';



// function PersonalDetailsForm({ formData, updateFormData,  onNext, onBack}) {
//     const verificationMethod = formData.verificationOption || '';
    
//         const [isSubmitting, setIsSubmitting] = useState(false);
//         const [localFormData, setLocalFormData] = useState({
//             salutation: formData.salutation || '',
//             first_name: formData.first_name || '',
//             middle_name: formData.middle_name || '',
//             last_name: formData.last_name || '',
//             DOB: formData.DOB || '',
//             gender: formData.gender || '',
//             religion: formData.religion || '',
//             caste: formData.caste || '',
//             maritalStatus: formData.maritalStatus || '',
//             mobile: formData.mobile || '',
//             alt_mob_no: formData.alt_mob_no || '',
//             email: formData.email || '',
//             adhar_card: formData.adhar_card || '',
//             pannumber: formData.pannumber || '',
//             driving_license: formData.driving_license || '',
//             voterid: formData.voterid || '',
//             passport: formData.passport || '',
//             status: 'Pending'
//         });
//         useEffect(() => {
//             const id = localStorage.getItem('application_id');
//             if (id) { 
//             fetchAndShowDetails(id);
//             }
//         }, []);
        
//         const fetchAndShowDetails = async (id) => {
//             try { 
//                 if (id) {
//                     const response = await pendingAccountData.getDetailsS2A(id);
                    
//                     const application = response.details || {}; 

//                         if(application){
//                         const verificationMethod = application.auth_type;

//                         setLocalFormData({
//                         salutation: application.salutation || '',
//                         first_name: application.first_name || '',
//                         middle_name: application.middle_name || '',
//                         last_name: application.last_name || '',
//                         DOB: application.DOB || '',
//                         gender: application.gender || '',
//                         religion: application.religion || '',
//                         caste: application.caste || '',
//                         maritalStatus: application.marital_status || '',
//                         mobile: application.mobile || '',
//                         alt_mob_no: application.alt_mob_no || '',
//                         email: application.email || '',
                        
//                         adhar_card: application.adhar_card || (verificationMethod === 'Aadhar Card' ? application.auth_code : ''),
//                         pannumber: application.pan_card || (verificationMethod === 'Pan Card' ? application.auth_code : ''),
//                         driving_license: application.driving_license || '',
//                         voterid: application.voter_id || '',
//                         passport: application.passport || '',
                        
//                         complex_name: application.complex_name || '',
//                         flat_no: application.flat_no || '',
//                         area: application.area || '',
//                         landmark: application.landmark || '',
//                         country: application.country || '',
//                         pincode: application.pincode || '',
//                         city: application.city || '',
//                         district: application.district || '',
//                         state: application.state || '',

//                         status: application.status || 'Pending'
//                         });

//                         }
//                     // alert(localFormData.photo);
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch application details:', error);
//             }
//         };


//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         const updatedLocalFormData = { ...localFormData, [name]: value };
//         // Check if the input is for the date of birth
//             if (name === "DOB") {
//                 const selectedDate = new Date(value);
//                 const today = new Date();

//                 // Remove time portion for accurate comparison
//                 selectedDate.setHours(0, 0, 0, 0);
//                 today.setHours(0, 0, 0, 0);

//                 if (selectedDate > today) {
//                     // alert("Future dates are not allowed.");
//                     Swal.fire({
//                             icon: 'error',
//                             title: 'Future dates are not allowed.',
//                             // text: error.response?.data?.message || 'Required field contains invalid data.',
//                         });
//                     return; // prevent updating state with invalid date
//                 }
//             }
//         setLocalFormData(updatedLocalFormData);
//         updateFormData({
//             ...formData,
//             personalDetails: updatedLocalFormData
//         });
//     };

//     const comapremobileno=()=>{     
//         if (localFormData.mobile === localFormData.alt_mob_no) {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Error',
//                     text: 'Mobile numbers must be different',
//                 })
//             }

//     }
// // const today = new Date().toISOString().split("T")[0];

//     const handleSubmit = async (e) => {
//         if (e && e.preventDefault) e.preventDefault();
//         setIsSubmitting(true);

//         try { 
//                 console.log('2A formadta : ', localFormData)
//                 const pd = localFormData || {};
//                 if (
//                     /\d/.test(pd.first_name) ||
//                     /\d/.test(pd.middle_name) ||
//                     /\d/.test(pd.last_name)
//                 ) {
//                     Swal.fire({
//                         icon: 'error',
//                         text: 'Only alphabets allowed. Numbers are not allowed in name fields.',
//                     });
//                     return;
//                 }

//              let missingFields = [];

//             if (!pd.email) missingFields.push("Email");
//             if (!pd.caste) missingFields.push("Caste");
//             if (!pd.religion) missingFields.push("Religion");

//             if (missingFields.length > 0) {
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Missing Required Fields',
//                     html: 'Please fill the following fields:<br><b>' + missingFields.join('</b><br><b>') + '</b>',
//                 });
//                 return;
//             } 

//                 else if (pd.mobile.length != 10) {
//                     Swal.fire({
//                         icon: 'error',
//                         title: 'Error saving personal details',
//                         text: '10 Digit Must for Mobile Number ',
//                     }); return
//                 }
//                 else if (pd.alt_mob_no.length != 10) {
//                     Swal.fire({
//                         icon: 'error',
//                         title: 'Error saving personal details',
//                         text: '10 Digit Must for Alternate Mobile Number ',
//                     }); return
//                 }
//                 else if (pd.pannumber.length != 10) {
//                     Swal.fire({
//                         icon: 'error',
//                         title: 'Error saving personal details',
//                         text: 'Invalid PAN Number',
//                     }); return
//                 }

//                 const payload = {
//                     application_id: formData.application_id,
//                     salutation: pd.salutation,
//                     religion: pd.religion,
//                     caste: pd.caste,
//                     marital_status: pd.maritalStatus ? pd.maritalStatus.toUpperCase() : undefined,
//                     alt_mob_no: pd.alt_mob_no,
//                     email: pd.email,
//                     adhar_card: pd.adhar_card,
//                     pan_card: pd.pannumber,
//                     passport: pd.passport,
//                     driving_license: pd.driving_license,
//                     voter_id: pd.voterid,
//                     status: 'Pending'
//                 };

//                 try {
//                     let response = await createAccountService.personalDetails_s2a(payload);

//                     Swal.fire({
//                         icon: 'success',
//                         title: response.data.message || 'Personal details saved successfully.',
//                         showConfirmButton: false,
//                         timer: 1500
//                     });
//                     handleNext();

//                 } catch (error) {
//                     console.error("Error saving personal details:", error);
//                     Swal.fire({
//                         icon: 'error',
//                         title: 'Error saving personal details',
//                         text: error.response?.data?.message || 'Required field contains invalid data.',
//                     });
//                 }
       
//         } catch (err) {
//             console.error("Submission error:", err);
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//     return (
//         <form className="personal-details-form">
//             <h2 className="text-xl font-bold mb-2">Personal Details</h2>
//             <div className='block sm:flex'>
//                 <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-5">

//                     {/* Salutation - Select field */}
//                     <CommanSelect
//                         onChange={handleChange}
//                         label={labels.salutation.label}
//                         name="salutation"
//                         value={localFormData.salutation}
//                         options={salutation}
//                         required
//                     />

//                     {/* First Name - Text only, 50 char limit */}
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.firstname.label} 
//                         name="first_name"
//                         value={localFormData.first_name}
//                         required
//                         max={30}
//                         validationType="TEXT_ONLY" 
//                     />

//                     {/* Middle Name - Text only, 50 char limit */}
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.middlename.label} 
//                         name="middle_name"
//                         value={localFormData.middle_name}
//                         max={30}
//                         validationType="TEXT_ONLY"
//                     />

//                     {/* Last Name - Text only, 50 char limit */}
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.lastname.label} 
//                         name="last_name"
//                         value={localFormData.last_name}
//                         required
//                         max={30}
//                         validationType="TEXT_ONLY"
//                     />

//                     {/* Date of Birth - Date validation */}
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.dob.label}
//                         type="date"
//                         name="DOB"
//                         value={localFormData.DOB}
//                         max={  new Date().toISOString().split("T")[0] } 
//                         required 
//                     />

//                     {/* Gender - Select field */}
//                     <CommanSelect
//                         onChange={handleChange}
//                         label={labels.gender.label}
//                         name="gender"
//                         value={localFormData.gender}
//                         options={gender}
//                         required
//                     />

//                     {/* Religion - Select field */}
//                     <CommanSelect
//                         onChange={handleChange}
//                         label={labels.religion.label}
//                         name="religion"
//                         value={localFormData.religion}
//                         options={religion}
//                         required
//                     />

//                     {/* Caste - Select field */}
//                     <CommanSelect
//                         onChange={handleChange}
//                         label={labels.caste.label}
//                         name="caste"
//                         value={localFormData.caste}
//                         options={caste}
//                         required
//                     />

//                     {/* Marital Status - Select field */}
//                     <CommanSelect
//                         onChange={handleChange}
//                         label={labels.maritalStatus.label}
//                         name="maritalStatus"
//                         value={localFormData.maritalStatus}
//                         options={maritalStatusOptions}
//                         required={true}
//                     />

//                     {/* Mobile - Phone number validation */}
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.mobile.label}
//                         type="number"
//                         name="mobile"
//                         value={localFormData.mobile}
//                         required
//                         max={10} min={10}
//                         validationType="PHONE"
//                     />

//                     {/* Alternate Mobile - Phone number validation */}
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.alt_mob_no.label}
//                         type="number"
//                         name="alt_mob_no"
//                         value={localFormData.alt_mob_no}
//                         onBlur={comapremobileno}
//                         required
//                         max={10} min={10}
//                         validationType="PHONE"
//                     />

//                     {/* Email - Email validation */}
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.email.label}
//                         type="email"
//                         name="email"
//                         value={localFormData.email}
//                         required
//                         validationType="EMAIL"
//                     />


//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.adhar_card.label}
//                         type="text"
//                         name="adhar_card"
//                         value={localFormData.adhar_card}
//                         required={true} // Required if this was verification method
//                         max={12}
//                         validationType="NUMBER_ONLY"
//                         disabled={verificationMethod === 'Aadhar Card'} // Disable if this was verification method
//                     />

//                     {/* Always show PAN field */}
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.pannumber.label}
//                         type="text"
//                         name="pannumber"
//                         value={localFormData.pannumber}
//                         required={true}
//                         // required={verificationMethod === 'Pan Card'}
//                         max={10}
//                         validationType="PAN"
//                         disabled={verificationMethod === 'Pan Card'} // Disable if this was verification method
//                         onInput={(e) => {
//                             e.target.value = e.target.value.toUpperCase();
//                         }}
//                     />

//                     {/* Passport Number - Alphanumeric */}
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.passportno.label}
//                         type="text"
//                         name="passport"
//                         value={localFormData.passport}
//                         max={8}
//                         validationType="ALPHANUMERIC"
//                     />

//                     {/* Voter ID - Alphanumeric with special chars */}
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.voterid.label}
//                         type="text"
//                         name="voterid"
//                         value={localFormData.voterid}
//                         max={10}
//                         validationType="ALPHANUMERIC"
//                     />

//                     {/* Driving License - Alphanumeric with special chars */}
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.drivinglicence.label}
//                         type="text"
//                         name="driving_license"
//                         value={localFormData.driving_license}
//                         max={16}
//                         validationType="driving_license"
//                     />


//                 </div>
//                 <img src={workingman} width={'400px'} alt="workingman" className='m-auto' />
//             </div>
            
//             <div className="next-back-btns z-10">
//                 <CommonButton
//                     className="btn-back"
//                     onClick={ onBack }
//                     iconLeft={<i className="bi bi-chevron-double-left"></i>}
//                     disabled={isSubmitting}
//                 >
//                     <i className="bi bi-chevron-double-left"></i>&nbsp;Back
//                 </CommonButton>

//                 <CommonButton
//                     className="btn-next"
//                     onClick={  handleSubmit  }
//                     iconRight={<i className="bi bi-chevron-double-right"></i>}
//                     disabled={isSubmitting}
//                 >
//                     {isSubmitting ? (
//                         <>
//                             <span className="animate-spin inline-block mr-2">↻</span>
//                             Processing...
//                         </>
//                     ) : (
//                         <>
//                             Next&nbsp;<i className="bi bi-chevron-double-right"></i>
//                         </>
//                     )}
//                 </CommonButton>
//             </div>
//         </form>
//     );
// }

// export default PersonalDetailsForm;


 