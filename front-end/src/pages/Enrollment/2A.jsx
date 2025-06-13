

import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommanSelect from '../../components/CommanSelect';
import { maritalStatusOptions } from '../../data/data';
import { salutation, gender, religion, caste } from '../../data/data';
import workingman from '../../assets/imgs/workingman2.png';
import Swal from 'sweetalert2'; 
function PersonalDetailsForm({ formData, updateFormData, isSubmitting }) {
    const verificationMethod = formData.verificationOption || '';

    const [localFormData, setLocalFormData] = useState({
        salutation: formData.personalDetails.salutation || formData.salutation || '',
        first_name: formData.personalDetails.first_name || formData.first_name || '',
        middle_name: formData.personalDetails.middle_name || formData.middle_name || '',
        last_name: formData.personalDetails.last_name || formData.last_name || '',
        DOB: formData.personalDetails.DOB || formData.DOB || '',
        gender: formData.personalDetails.gender || formData.gender || '',
        religion: formData.personalDetails.religion || formData.religion || '',
        caste: formData.personalDetails.caste || formData.caste || '',
        maritalStatus: formData.personalDetails.maritalStatus || formData.maritalStatus || '',
        mobile: formData.personalDetails.mobile || formData.mobile || '',
        alt_mob_no: formData.personalDetails.alt_mob_no || formData.alt_mob_no || '',
        email: formData.personalDetails.email || formData.email || '',
        adhar_card: formData.personalDetails.adhar_card || formData.adhar_card ||
            (verificationMethod === 'Aadhar Card' ? formData.auth_code : ''),
        pannumber: formData.personalDetails.pannumber || formData.pannumber ||
            (verificationMethod === 'Pan Card' ? formData.auth_code : ''),
        driving_license: formData.personalDetails.driving_license || formData.driving_license || '',
        voterid: formData.personalDetails.voterid || formData.voterid || '',
        passport: formData.personalDetails.passport || formData.passport || '',
        complex_name: formData.personalDetails.complex_name || formData.complex_name || '',
        flat_no: formData.personalDetails.flat_no || formData.flat_no || '',
        area: formData.personalDetails.area || formData.area || '',
        landmark: formData.personalDetails.landmark || formData.landmark || '',
        country: formData.personalDetails.country || formData.country || '',
        pincode: formData.personalDetails.pincode || formData.pincode || '',
        city: formData.personalDetails.city || formData.city || '',
        district: formData.personalDetails.district || formData.district || '',
        state: formData.personalDetails.state || formData.state || '',
        status: 'Pending'
    });

//   useEffect(() => {
//     //this page is for address data after coming backword to the page
//     if (!formData.application_id) return;
//     const fetchDetails = async () => {
//       try {
//         const response = await applicationDetailsService.getFullDetails(
//           formData.application_id
//         );
//         if (response.data) {
//           const {
//             application,
//             personal_details,
//             account_personal_details,
//             application_addresss,
//             customerdoc,
//             customerpic,
//           } = response.data.data;
        

//           const resetFormData = {
//             salutation: personal_details.salutation || "", 
//             religion: personal_details.religion || "",
//             caste: personal_details.caste || "",
//             maritalStatus: personal_details.marital_status || "", 
//             alt_mob_no: personal_details.alt_mob_no || "",
//             email: personal_details.email || "",
//             adhar_card:
//               personal_details.adhar_card ||
//               (verificationMethod === "Aadhar Card" ? formData.auth_code : ""),
//             pannumber:
//               personal_details.pan_card ||
//               (verificationMethod === "Pan Card" ? formData.auth_code : ""),
//             driving_license: personal_details.driving_license || "",
//             voterid: personal_details.voter_id || "",
//             passport: personal_details.passport || "",
//             driving_license:personal_details.driving_license || '',
//             status: "Pending",
//           };

//          setLocalFormData(prevData => ({
//   ...prevData,
//   ...resetFormData
// }));

//         }
//       } catch (error) {
//         console.log(error);
//         Swal.fire({
//           icon: "error",
//           title: "Error",
//           text: error?.response?.data?.message,
//         });
//       }
//     };
//     fetchDetails();
//   }, [formData.application_id]);




    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedLocalFormData = { ...localFormData, [name]: value };
 
        setLocalFormData(updatedLocalFormData);
        updateFormData({
            ...formData,
            personalDetails: updatedLocalFormData
        });
    };

    const comapremobileno=()=>{     if (localFormData.mobile === localFormData.alt_mob_no) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Mobile numbers must be different',
                })
            }

    }

    return (
        <div className="personal-details-form">
            <h2 className="text-xl font-bold mb-2">Personal Details</h2>
            <div className='block sm:flex'>
                <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-4">

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
                        type="text"
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
                        type="text"
                        name="middle_name"
                        value={localFormData.middle_name}
                        max={30}
                        validationType="TEXT_ONLY"
                    />

                    {/* Last Name - Text only, 50 char limit */}
                    <CommanInput
                        onChange={handleChange}
                        label={labels.lastname.label}
                        type="text"
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
                        required
                        validationType="DATE"
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
                    />

                    {/* Mobile - Phone number validation */}
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

                    {/* Alternate Mobile - Phone number validation */}
                    <CommanInput
                        onChange={handleChange}
                        label={labels.alt_mob_no.label}
                        type="text"
                        name="alt_mob_no"
                        value={localFormData.alt_mob_no}
                        onBlure={comapremobileno}
                        required
                        max={10}
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
                        required={verificationMethod === 'Aadhar Card'} // Required if this was verification method
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
        </div>
    );
}

export default PersonalDetailsForm;