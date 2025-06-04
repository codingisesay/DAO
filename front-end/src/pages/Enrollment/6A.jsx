import React, { useState, useEffect, useRef } from 'react';
import CommanInput from '../../components/CommanInput';
import workingman from '../../assets/imgs/workingman1.png';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { gender, salutation, religion, caste, maritalStatusOptions } from '../../data/data';
import CommanSelect from '../../components/CommanSelect';
import Swal from 'sweetalert2';
import { applicationDetailsService } from '../../services/apiServices';
import { daodocbase } from '../../data/data';
import { usePDF } from 'react-to-pdf';
import { useNavigate } from 'react-router-dom';

const ViewApplicationForm = () => {
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const { toPDF, targetRef } = usePDF({ filename: 'application-form.pdf' });
    const handleChange = () => { };

    const applicationId = localStorage.getItem('application_id');

    useEffect(() => {
        if (!applicationId) return;
        const fetchDetails = async () => {
            try {
                const response = await applicationDetailsService.getFullDetails(applicationId);
                if (response.data) {
                    const { application, personal_details, account_personal_details, application_addresss, customerdoc, customerpic } = response.data.data;
                    const address = Array.isArray(application_addresss) ? application_addresss[0] : application_addresss;
                    const signatureDoc = customerdoc.find(doc =>
                        doc.document_type.toLowerCase().includes('signature')
                    );

                    setFormData({
                        application_id: applicationId,
                        // Authentication
                        auth_type: application.auth_type,
                        auth_code: application.auth_code,
                        status: application.auth_status,

                        // Personal Info
                        salutation: personal_details?.salutation,
                        first_name: application.first_name,
                        middle_name: application.middle_name,
                        last_name: application.last_name,
                        DOB: application.DOB,
                        gender: application.gender,
                        religion: personal_details?.religion,
                        caste: personal_details?.caste,
                        marital_status: personal_details?.marital_status,

                        // Contact
                        mobile: application.mobile,
                        alt_mob_no: personal_details?.alt_mob_no,
                        email: personal_details?.email,

                        // Permanent Address
                        complex_name: application.complex_name,
                        flat_no: application.flat_no,
                        area: application.area,
                        landmark: application.lankmark,
                        country: application.country,
                        pincode: application.pincode,
                        city: application.city,
                        district: application.district,
                        state: application.state,

                        // Correspondence Address
                        per_complex_name: address?.per_complex_name,
                        cor_flat_no: address?.cor_flat_no,
                        cor_area: address?.cor_area,
                        cor_landmark: address?.cor_landmark,
                        cor_country: address?.cor_country,
                        cor_pincode: address?.cor_pincode,
                        cor_city: address?.cor_city,
                        cor_district: address?.cor_district,
                        cor_state: address?.cor_state,

                        // Identity Documents
                        adhar_card: personal_details?.adhar_card,
                        pan_card: personal_details?.pan_card,
                        passport: personal_details?.passport,
                        driving_license: personal_details?.driving_license,
                        voter_id: personal_details?.voter_id,

                        // Family Details
                        father_prefix_name: account_personal_details?.father_prefix_name,
                        father_first_name: account_personal_details?.father_first_name,
                        father_middle_name: account_personal_details?.father_middle_name,
                        father_last_name: account_personal_details?.father_last_name,
                        mother_prefix_name: account_personal_details?.mother_prefix_name,
                        mother_first_name: account_personal_details?.mother_first_name,
                        mother_middle_name: account_personal_details?.mother_middle_name,
                        mother_last_name: account_personal_details?.mother_last_name,
                        birth_place: account_personal_details?.birth_place,
                        birth_country: account_personal_details?.birth_country,

                        // Occupation Details
                        occoupation_type: account_personal_details?.occoupation_type,
                        occupation_name: account_personal_details?.occupation_name,
                        if_salaryed: account_personal_details?.if_salaryed,
                        designation: account_personal_details?.designation,
                        nature_of_occoupation: account_personal_details?.nature_of_occoupation,
                        qualification: account_personal_details?.qualification,
                        anual_income: account_personal_details?.anual_income,
                        remark: account_personal_details?.remark,

                        signature: daodocbase + signatureDoc.file_path || null,
                    });
                }
            } catch (error) {
                console.log(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: JSON.stringify(error)
                });
            }
        };
        fetchDetails();
    }, [applicationId]);


    const handlePrint = () => {
        // Store form data in localStorage to access on the print page
        localStorage.setItem('printData', JSON.stringify(formData));
        // Navigate to print page
        // navigate('/print-application');
        window.open('/print-application', '_blank');
    };


    return (
        <div className="container mx-auto p-4">


            <div ref={targetRef} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                {/* Header for PDF */}
                <div className="pdf-header mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">Application Form</h1>
                    <p className="text-gray-600">Application ID: {formData.application_id || 'N/A'}</p>
                    <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Authentication Details */}
                <div className="pdf-section">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Authentication Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <CommanInput
                            onChange={handleChange}
                            label="Auth Type"
                            type="text"
                            name="auth_type"
                            value={formData.auth_type || ''}
                            readOnly
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Auth Code"
                            type="text"
                            name="auth_code"
                            value={formData.auth_code || ''}
                            readOnly
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Status"
                            type="text"
                            name="status"
                            value={formData.status || ''}
                            readOnly
                        />
                    </div>
                </div>

                {/* Personal Information */}
                <div className="pdf-section">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <CommanSelect
                            onChange={handleChange}
                            label={labels.salutation.label}
                            name="salutation"
                            value={formData.salutation || ''}
                            options={salutation}
                            readOnly
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.firstname.label}
                            type="text"
                            name="first_name"
                            value={formData.first_name || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.middlename.label}
                            type="text"
                            name="middle_name"
                            value={formData.middle_name || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.lastname.label}
                            type="text"
                            name="last_name"
                            value={formData.last_name || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.dob.label}
                            type="date"
                            name="DOB"
                            value={formData.DOB || ''}
                            readOnly
                            validationType="DATE"
                        />
                        <CommanSelect
                            onChange={handleChange}
                            label={labels.gender.label}
                            name="gender"
                            value={formData.gender || ''}
                            options={gender}
                            readOnly
                        />
                        <CommanSelect
                            onChange={handleChange}
                            label={labels.religion.label}
                            name="religion"
                            value={formData.religion || ''}
                            options={religion}
                            readOnly
                        />
                        <CommanSelect
                            onChange={handleChange}
                            label={labels.caste.label}
                            name="caste"
                            value={formData.caste || ''}
                            options={caste}
                            readOnly
                        />
                        <CommanSelect
                            onChange={handleChange}
                            label={labels.maritalStatus.label}
                            name="marital_status"
                            value={formData.marital_status || ''}
                            options={maritalStatusOptions}
                            readOnly
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="pdf-section">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <CommanInput
                            onChange={handleChange}
                            label={labels.mobile.label}
                            type="text"
                            name="mobile"
                            value={formData.mobile || ''}
                            readOnly
                            max={10}
                            validationType="PHONE"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.alt_mob_no.label}
                            type="text"
                            name="alt_mob_no"
                            value={formData.alt_mob_no || ''}
                            readOnly
                            max={10}
                            validationType="PHONE"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.email.label}
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            readOnly
                            validationType="EMAIL"
                        />
                    </div>
                </div>

                {/* Permanent Address */}
                <div className="pdf-section">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Permanent Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <CommanInput
                            onChange={handleChange}
                            label={labels.complexname.label}
                            type="text"
                            name="complex_name"
                            value={formData.complex_name || ''}
                            readOnly
                            max={30}
                            validationType="ALPHABETS_AND_SPACE"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.roomno.label}
                            type="text"
                            name="flat_no"
                            value={formData.flat_no || ''}
                            readOnly
                            max={20}
                            validationType="ALPHANUMERIC"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.area.label}
                            type="text"
                            name="area"
                            value={formData.area || ''}
                            readOnly
                            max={50}
                            validationType="ALPHABETS_AND_SPACE"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.landmark.label}
                            type="text"
                            name="landmark"
                            value={formData.landmark || ''}
                            readOnly
                            max={50}
                            validationType="EVERYTHING"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.country.label}
                            type="text"
                            name="country"
                            value={formData.country || ''}
                            readOnly
                            max={30}
                            validationType="ALPHABETS_AND_SPACE"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.pincode.label}
                            type="text"
                            name="pincode"
                            value={formData.pincode || ''}
                            readOnly
                            max={6}
                            validationType="NUMBER_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.city.label}
                            type="text"
                            name="city"
                            value={formData.city || ''}
                            readOnly
                            max={30}
                            validationType="ALPHABETS_AND_SPACE"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.district.label}
                            type="text"
                            name="district"
                            value={formData.district || ''}
                            readOnly
                            max={30}
                            validationType="ALPHABETS_AND_SPACE"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.state.label}
                            type="text"
                            name="state"
                            value={formData.state || ''}
                            readOnly
                            max={30}
                            validationType="ALPHABETS_AND_SPACE"
                        />
                    </div>
                </div>

                {/* Correspondence Address */}
                {formData.correspondenceAddressSame !== "YES" && (
                    <div className="pdf-section">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Correspondence Address</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <CommanInput
                                onChange={handleChange}
                                label="Correspondence Complex Name"
                                type="text"
                                name="per_complex_name"
                                value={formData.per_complex_name || ''}
                                readOnly
                                max={30}
                                validationType="ALPHABETS_AND_SPACE"
                            />
                            <CommanInput
                                onChange={handleChange}
                                label="Correspondence Flat No"
                                type="text"
                                name="cor_flat_no"
                                value={formData.cor_flat_no || ''}
                                readOnly
                                max={20}
                                validationType="ALPHANUMERIC"
                            />
                            <CommanInput
                                onChange={handleChange}
                                label="Correspondence Area"
                                type="text"
                                name="cor_area"
                                value={formData.cor_area || ''}
                                readOnly
                                max={50}
                                validationType="ALPHABETS_AND_SPACE"
                            />
                            <CommanInput
                                onChange={handleChange}
                                label="Correspondence Landmark"
                                type="text"
                                name="cor_landmark"
                                value={formData.cor_landmark || ''}
                                readOnly
                                max={50}
                                validationType="EVERYTHING"
                            />
                            <CommanInput
                                onChange={handleChange}
                                label="Correspondence Country"
                                type="text"
                                name="cor_country"
                                value={formData.cor_country || ''}
                                readOnly
                                max={30}
                                validationType="ALPHABETS_AND_SPACE"
                            />
                            <CommanInput
                                onChange={handleChange}
                                label="Correspondence Pincode"
                                type="text"
                                name="cor_pincode"
                                value={formData.cor_pincode || ''}
                                readOnly
                                max={6}
                                validationType="NUMBER_ONLY"
                            />
                            <CommanInput
                                onChange={handleChange}
                                label="Correspondence City"
                                type="text"
                                name="cor_city"
                                value={formData.cor_city || ''}
                                readOnly
                                max={30}
                                validationType="ALPHABETS_AND_SPACE"
                            />
                            <CommanInput
                                onChange={handleChange}
                                label="Correspondence District"
                                type="text"
                                name="cor_district"
                                value={formData.cor_district || ''}
                                readOnly
                                max={30}
                                validationType="ALPHABETS_AND_SPACE"
                            />
                            <CommanInput
                                onChange={handleChange}
                                label="Correspondence State"
                                type="text"
                                name="cor_state"
                                value={formData.cor_state || ''}
                                readOnly
                                max={30}
                                validationType="ALPHABETS_AND_SPACE"
                            />
                        </div>
                    </div>
                )}

                {/* Identity Documents */}
                <div className="pdf-section">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Identity Documents</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <CommanInput
                            onChange={handleChange}
                            label={labels.adhar_card.label}
                            type="text"
                            name="adhar_card"
                            value={formData.adhar_card || ''}
                            readOnly
                            max={12}
                            validationType="NUMBER_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.pannumber.label}
                            type="text"
                            name="pan_card"
                            value={formData.pan_card || ''}
                            readOnly
                            max={10}
                            validationType="PAN"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.passportno.label}
                            type="text"
                            name="passport"
                            value={formData.passport || ''}
                            readOnly
                            max={20}
                            validationType="ALPHANUMERIC"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.drivinglicence.label}
                            type="text"
                            name="driving_license"
                            value={formData.driving_license || ''}
                            readOnly
                            max={20}
                            validationType="REGISTRATION_NO"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.voterid.label}
                            type="text"
                            name="voter_id"
                            value={formData.voter_id || ''}
                            readOnly
                            max={20}
                            validationType="REGISTRATION_NO"
                        />
                    </div>
                </div>

                {/* Family Details */}
                <div className="pdf-section">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Family Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <CommanSelect
                            onChange={handleChange}
                            label="Father's Prefix"
                            name="father_prefix_name"
                            value={formData.father_prefix_name || ''}
                            options={salutation}
                            readOnly
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Father's First Name"
                            type="text"
                            name="father_first_name"
                            value={formData.father_first_name || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Father's Middle Name"
                            type="text"
                            name="father_middle_name"
                            value={formData.father_middle_name || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Father's Last Name"
                            type="text"
                            name="father_last_name"
                            value={formData.father_last_name || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanSelect
                            onChange={handleChange}
                            label="Mother's Prefix"
                            name="mother_prefix_name"
                            value={formData.mother_prefix_name || ''}
                            options={salutation}
                            readOnly
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Mother's First Name"
                            type="text"
                            name="mother_first_name"
                            value={formData.mother_first_name || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Mother's Middle Name"
                            type="text"
                            name="mother_middle_name"
                            value={formData.mother_middle_name || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Mother's Last Name"
                            type="text"
                            name="mother_last_name"
                            value={formData.mother_last_name || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Birth Place"
                            type="text"
                            name="birth_place"
                            value={formData.birth_place || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Birth Country"
                            type="text"
                            name="birth_country"
                            value={formData.birth_country || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                    </div>
                </div>

                {/* Occupation Details */}
                <div className="pdf-section">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Occupation Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <CommanInput
                            onChange={handleChange}
                            label="Occupation Type"
                            type="text"
                            name="occoupation_type"
                            value={formData.occoupation_type || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Occupation Name"
                            type="text"
                            name="occupation_name"
                            value={formData.occupation_name || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Salaried With"
                            type="text"
                            name="if_salaryed"
                            value={formData.if_salaryed || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Designation"
                            type="text"
                            name="designation"
                            value={formData.designation || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Nature of Occupation"
                            type="text"
                            name="nature_of_occoupation"
                            value={formData.nature_of_occoupation || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Qualification"
                            type="text"
                            name="qualification"
                            value={formData.qualification || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Annual Income"
                            type="text"
                            name="anual_income"
                            value={formData.anual_income || ''}
                            readOnly
                            max={50}
                            validationType="TEXT_ONLY"
                        />
                    </div>
                </div>

                {/* File Uploads */}
                <div className="pdf-section">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">File Uploads</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Signature</label>
                            {formData.signature ? (
                                <img
                                    src={typeof formData.signature === 'string' ? formData.signature : URL.createObjectURL(formData.signature)}
                                    alt="Signature"
                                    className="max-w-full h-auto max-h-40"
                                />
                            ) : (
                                <span>No signature uploaded</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewApplicationForm;















// import React, { useState, useEffect } from 'react';
// import CommanInput from '../../components/CommanInput';
// import workingman from '../../assets/imgs/workingman1.png';
// import labels from '../../components/labels';
// import CommonButton from '../../components/CommonButton';
// import { gender, salutation, religion, caste, maritalStatusOptions } from '../../data/data';
// import CommanSelect from '../../components/CommanSelect';
// import Swal from 'sweetalert2';
// import { applicationDetailsService } from '../../services/apiServices';
// import { daodocbase } from '../../data/data'

// const ViewApplicationForm = () => {
//     const [formData, setFormData] = useState({});
//     // Since we're making it read-only, we'll create a dummy handleChange
//     const handleChange = () => { };

//     const applicationId = localStorage.getItem('application_id');

//     useEffect(() => {
//         if (!applicationId) return;  // Hardcoded for testing
//         const fetchDetails = async () => {
//             try {
//                 const response = await applicationDetailsService.getFullDetails(applicationId);
//                 console.log(response.data);
//                 if (response.data) {
//                     const { application, personal_details, account_personal_details, application_addresss, customerdoc, customerpic } = response.data.data;
//                     const address = Array.isArray(application_addresss) ? application_addresss[0] : application_addresss;
//                     const signatureDoc = customerdoc.find(doc =>
//                         doc.document_type.toLowerCase().includes('signature')
//                     );

//                     setFormData({
//                         application_id: applicationId,
//                         // Authentication
//                         auth_type: application.auth_type,
//                         auth_code: application.auth_code,
//                         status: application.auth_status, // Use correct key

//                         // Personal Info
//                         salutation: personal_details?.salutation,
//                         first_name: application.first_name,
//                         middle_name: application.middle_name,
//                         last_name: application.last_name,
//                         DOB: application.DOB,
//                         gender: application.gender,
//                         religion: personal_details?.religion,
//                         caste: personal_details?.caste,
//                         marital_status: personal_details?.marital_status,

//                         // Contact
//                         mobile: application.mobile,
//                         alt_mob_no: personal_details?.alt_mob_no,
//                         email: personal_details?.email,

//                         // Permanent Address
//                         complex_name: application.complex_name,
//                         flat_no: application.flat_no,
//                         area: application.area,
//                         landmark: application.lankmark, // typo in backend, use as is or fix backend
//                         country: application.country,
//                         pincode: application.pincode,
//                         city: application.city,
//                         district: application.district,
//                         state: application.state,

//                         // Correspondence Address (if available)
//                         per_complex_name: address?.per_complex_name,
//                         cor_flat_no: address?.cor_flat_no,
//                         cor_area: address?.cor_area,
//                         cor_landmark: address?.cor_landmark,
//                         cor_country: address?.cor_country,
//                         cor_pincode: address?.cor_pincode,
//                         cor_city: address?.cor_city,
//                         cor_district: address?.cor_district,
//                         cor_state: address?.cor_state,
//                         // correspondenceAddressSame: personal_details?.correspondenceAddressSame,

//                         // Identity Documents
//                         adhar_card: personal_details?.adhar_card,
//                         pan_card: personal_details?.pan_card,
//                         passport: personal_details?.passport,
//                         driving_license: personal_details?.driving_license,
//                         voter_id: personal_details?.voter_id,

//                         // Family Details
//                         father_prefix_name: account_personal_details?.father_prefix_name,
//                         father_first_name: account_personal_details?.father_first_name,
//                         father_middle_name: account_personal_details?.father_middle_name,
//                         father_last_name: account_personal_details?.father_last_name,
//                         mother_prefix_name: account_personal_details?.mother_prefix_name,
//                         mother_first_name: account_personal_details?.mother_first_name,
//                         mother_middle_name: account_personal_details?.mother_middle_name,
//                         mother_last_name: account_personal_details?.mother_last_name,
//                         birth_place: account_personal_details?.birth_place,
//                         birth_country: account_personal_details?.birth_country,

//                         // Occupation Details
//                         occoupation_type: account_personal_details?.occoupation_type,
//                         occupation_name: account_personal_details?.occupation_name,
//                         if_salaryed: account_personal_details?.if_salaryed,
//                         designation: account_personal_details?.designation,
//                         nature_of_occoupation: account_personal_details?.nature_of_occoupation,
//                         qualification: account_personal_details?.qualification,
//                         anual_income: account_personal_details?.anual_income,
//                         remark: account_personal_details?.remark,

//                         // photo: daodocbase + response.data.data.customerpic[0].path || null,
//                         // signature: daodocbase + response.data.data.customerdoc[0].file_path || null,
//                         // photo: daodocbase + customerphoto.path || null,
//                         signature: daodocbase + signatureDoc.file_path || null,
//                     });

//                     // console.log('sign photo : ', signatureDoc.file_path)
//                 }
//             } catch (error) {
//                 console.log(error)
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Error',
//                     text: JSON.stringify(error)
//                 });
//             }
//         };
//         fetchDetails();
//     }, [applicationId]);




//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-6">Application Details</h1>

//             <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//                 {/* Authentication Details */}
//                 <h2 className="text-xl font-semibold mb-4 border-b pb-2">Authentication Details</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Auth Type"
//                         type="text"
//                         name="auth_type"
//                         value={formData.auth_type || ''}
//                         readOnly
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Auth Code"
//                         type="text"
//                         name="auth_code"
//                         value={formData.auth_code || ''}
//                         readOnly
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Status"
//                         type="text"
//                         name="status"
//                         value={formData.status || ''}
//                         readOnly
//                     />
//                 </div>

//                 {/* Personal Information */}
//                 <h2 className="text-xl font-semibold mb-4 border-b pb-2">Personal Information</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <CommanSelect
//                         onChange={handleChange}
//                         label={labels.salutation.label}
//                         name="salutation"
//                         value={formData.salutation || ''}
//                         options={salutation}
//                         readOnly
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.firstname.label}
//                         type="text"
//                         name="first_name"
//                         value={formData.first_name || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.middlename.label}
//                         type="text"
//                         name="middle_name"
//                         value={formData.middle_name || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.lastname.label}
//                         type="text"
//                         name="last_name"
//                         value={formData.last_name || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.dob.label}
//                         type="date"
//                         name="DOB"
//                         value={formData.DOB || ''}
//                         readOnly
//                         validationType="DATE"
//                     />
//                     <CommanSelect
//                         onChange={handleChange}
//                         label={labels.gender.label}
//                         name="gender"
//                         value={formData.gender || ''}
//                         options={gender}
//                         readOnly
//                     />
//                     <CommanSelect
//                         onChange={handleChange}
//                         label={labels.religion.label}
//                         name="religion"
//                         value={formData.religion || ''}
//                         options={religion}
//                         readOnly
//                     />
//                     <CommanSelect
//                         onChange={handleChange}
//                         label={labels.caste.label}
//                         name="caste"
//                         value={formData.caste || ''}
//                         options={caste}
//                         readOnly
//                     />
//                     <CommanSelect
//                         onChange={handleChange}
//                         label={labels.maritalStatus.label}
//                         name="marital_status"
//                         value={formData.marital_status || ''}
//                         options={maritalStatusOptions}
//                         readOnly
//                     />
//                 </div>

//                 {/* Contact Information */}
//                 <h2 className="text-xl font-semibold mb-4 border-b pb-2">Contact Information</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.mobile.label}
//                         type="text"
//                         name="mobile"
//                         value={formData.mobile || ''}
//                         readOnly
//                         max={10}
//                         validationType="PHONE"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.alt_mob_no.label}
//                         type="text"
//                         name="alt_mob_no"
//                         value={formData.alt_mob_no || ''}
//                         readOnly
//                         max={10}
//                         validationType="PHONE"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.email.label}
//                         type="email"
//                         name="email"
//                         value={formData.email || ''}
//                         readOnly
//                         validationType="EMAIL"
//                     />
//                 </div>

//                 {/* Permanent Address */}
//                 <h2 className="text-xl font-semibold mb-4 border-b pb-2">Permanent Address</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.complexname.label}
//                         type="text"
//                         name="complex_name"
//                         value={formData.complex_name || ''}
//                         readOnly
//                         max={30}
//                         validationType="ALPHABETS_AND_SPACE"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.roomno.label}
//                         type="text"
//                         name="flat_no"
//                         value={formData.flat_no || ''}
//                         readOnly
//                         max={20}
//                         validationType="ALPHANUMERIC"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.area.label}
//                         type="text"
//                         name="area"
//                         value={formData.area || ''}
//                         readOnly
//                         max={50}
//                         validationType="ALPHABETS_AND_SPACE"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.landmark.label}
//                         type="text"
//                         name="landmark"
//                         value={formData.landmark || ''}
//                         readOnly
//                         max={50}
//                         validationType="EVERYTHING"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.country.label}
//                         type="text"
//                         name="country"
//                         value={formData.country || ''}
//                         readOnly
//                         max={30}
//                         validationType="ALPHABETS_AND_SPACE"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.pincode.label}
//                         type="text"
//                         name="pincode"
//                         value={formData.pincode || ''}
//                         readOnly
//                         max={6}
//                         validationType="NUMBER_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.city.label}
//                         type="text"
//                         name="city"
//                         value={formData.city || ''}
//                         readOnly
//                         max={30}
//                         validationType="ALPHABETS_AND_SPACE"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.district.label}
//                         type="text"
//                         name="district"
//                         value={formData.district || ''}
//                         readOnly
//                         max={30}
//                         validationType="ALPHABETS_AND_SPACE"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.state.label}
//                         type="text"
//                         name="state"
//                         value={formData.state || ''}
//                         readOnly
//                         max={30}
//                         validationType="ALPHABETS_AND_SPACE"
//                     />
//                 </div>

//                 {/* Correspondence Address */}
//                 {formData.correspondenceAddressSame !== "YES" && (
//                     <>
//                         <h2 className="text-xl font-semibold mb-4 border-b pb-2">Correspondence Address</h2>
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Correspondence Complex Name"
//                                 type="text"
//                                 name="per_complex_name"
//                                 value={formData.per_complex_name || ''}
//                                 readOnly
//                                 max={30}
//                                 validationType="ALPHABETS_AND_SPACE"
//                             />
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Correspondence Flat No"
//                                 type="text"
//                                 name="cor_flat_no"
//                                 value={formData.cor_flat_no || ''}
//                                 readOnly
//                                 max={20}
//                                 validationType="ALPHANUMERIC"
//                             />
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Correspondence Area"
//                                 type="text"
//                                 name="cor_area"
//                                 value={formData.cor_area || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="ALPHABETS_AND_SPACE"
//                             />
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Correspondence Landmark"
//                                 type="text"
//                                 name="cor_landmark"
//                                 value={formData.cor_landmark || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="EVERYTHING"
//                             />
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Correspondence Country"
//                                 type="text"
//                                 name="cor_country"
//                                 value={formData.cor_country || ''}
//                                 readOnly
//                                 max={30}
//                                 validationType="ALPHABETS_AND_SPACE"
//                             />
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Correspondence Pincode"
//                                 type="text"
//                                 name="cor_pincode"
//                                 value={formData.cor_pincode || ''}
//                                 readOnly
//                                 max={6}
//                                 validationType="NUMBER_ONLY"
//                             />
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Correspondence City"
//                                 type="text"
//                                 name="cor_city"
//                                 value={formData.cor_city || ''}
//                                 readOnly
//                                 max={30}
//                                 validationType="ALPHABETS_AND_SPACE"
//                             />
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Correspondence District"
//                                 type="text"
//                                 name="cor_district"
//                                 value={formData.cor_district || ''}
//                                 readOnly
//                                 max={30}
//                                 validationType="ALPHABETS_AND_SPACE"
//                             />
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Correspondence State"
//                                 type="text"
//                                 name="cor_state"
//                                 value={formData.cor_state || ''}
//                                 readOnly
//                                 max={30}
//                                 validationType="ALPHABETS_AND_SPACE"
//                             />
//                         </div>
//                     </>
//                 )}

//                 {/* Identity Documents */}
//                 <h2 className="text-xl font-semibold mb-4 border-b pb-2">Identity Documents</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.adhar_card.label}
//                         type="text"
//                         name="adhar_card"
//                         value={formData.adhar_card || ''}
//                         readOnly
//                         max={12}
//                         validationType="NUMBER_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.pannumber.label}
//                         type="text"
//                         name="pan_card"
//                         value={formData.pan_card || ''}
//                         readOnly
//                         max={10}
//                         validationType="PAN"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.passportno.label}
//                         type="text"
//                         name="passport"
//                         value={formData.passport || ''}
//                         readOnly
//                         max={20}
//                         validationType="ALPHANUMERIC"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.drivinglicence.label}
//                         type="text"
//                         name="driving_license"
//                         value={formData.driving_license || ''}
//                         readOnly
//                         max={20}
//                         validationType="REGISTRATION_NO"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label={labels.voterid.label}
//                         type="text"
//                         name="voter_id"
//                         value={formData.voter_id || ''}
//                         readOnly
//                         max={20}
//                         validationType="REGISTRATION_NO"
//                     />
//                 </div>

//                 {/* Family Details */}
//                 <h2 className="text-xl font-semibold mb-4 border-b pb-2">Family Details</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <CommanSelect
//                         onChange={handleChange}
//                         label="Father's Prefix"
//                         name="father_prefix_name"
//                         value={formData.father_prefix_name || ''}
//                         options={salutation}
//                         readOnly
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Father's First Name"
//                         type="text"
//                         name="father_first_name"
//                         value={formData.father_first_name || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Father's Middle Name"
//                         type="text"
//                         name="father_middle_name"
//                         value={formData.father_middle_name || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Father's Last Name"
//                         type="text"
//                         name="father_last_name"
//                         value={formData.father_last_name || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanSelect
//                         onChange={handleChange}
//                         label="Mother's Prefix"
//                         name="mother_prefix_name"
//                         value={formData.mother_prefix_name || ''}
//                         options={salutation}
//                         readOnly
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Mother's First Name"
//                         type="text"
//                         name="mother_first_name"
//                         value={formData.mother_first_name || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Mother's Middle Name"
//                         type="text"
//                         name="mother_middle_name"
//                         value={formData.mother_middle_name || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Mother's Last Name"
//                         type="text"
//                         name="mother_last_name"
//                         value={formData.mother_last_name || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Birth Place"
//                         type="text"
//                         name="birth_place"
//                         value={formData.birth_place || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Birth Country"
//                         type="text"
//                         name="birth_country"
//                         value={formData.birth_country || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                 </div>

//                 {/* Occupation Details */}
//                 <h2 className="text-xl font-semibold mb-4 border-b pb-2">Occupation Details</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Occupation Type"
//                         type="text"
//                         name="occoupation_type"
//                         value={formData.occoupation_type || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Occupation Name"
//                         type="text"
//                         name="occupation_name"
//                         value={formData.occupation_name || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Salaried With"
//                         type="text"
//                         name="if_salaryed"
//                         value={formData.if_salaryed || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Designation"
//                         type="text"
//                         name="designation"
//                         value={formData.designation || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Nature of Occupation"
//                         type="text"
//                         name="nature_of_occoupation"
//                         value={formData.nature_of_occoupation || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Qualification"
//                         type="text"
//                         name="qualification"
//                         value={formData.qualification || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                     <CommanInput
//                         onChange={handleChange}
//                         label="Annual Income"
//                         type="text"
//                         name="anual_income"
//                         value={formData.anual_income || ''}
//                         readOnly
//                         max={50}
//                         validationType="TEXT_ONLY"
//                     />
//                 </div>

//                 {/* File Uploads */}
//                 <h2 className="text-xl font-semibold mb-4 border-b pb-2">File Uploads</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//                     <div>
//                         <label className="block text-gray-700 font-bold mb-2">Photo</label>
//                         {formData.photo ? (
//                             <img
//                                 src={typeof formData.photo === 'string' ? formData.photo : URL.createObjectURL(formData.photo)}
//                                 alt="Photo"
//                                 className="max-w-full h-auto max-h-40"
//                             />
//                         ) : (
//                             <span>No photo uploaded</span>
//                         )}
//                     </div>
//                     <div>
//                         <label className="block text-gray-700 font-bold mb-2">Signature</label>
//                         {formData.signature ? (
//                             <img
//                                 src={typeof formData.signature === 'string' ? formData.signature : URL.createObjectURL(formData.signature)}
//                                 alt="Signature"
//                                 className="max-w-full h-auto max-h-40"
//                             />
//                         ) : (
//                             <span>No signature uploaded</span>
//                         )}
//                     </div>
//                     <div>
//                         <label className="block text-gray-700 font-bold mb-2">Other Documents</label>
//                         {formData.files && formData.files.length > 0 ? (
//                             <div className="space-y-2">
//                                 {formData.files.map((file, index) => (
//                                     <div key={index}>
//                                         {file.type.startsWith('image/') ? (
//                                             <img
//                                                 src={typeof file === 'string' ? file : URL.createObjectURL(file)}
//                                                 alt={`Document ${index + 1}`}
//                                                 className="max-w-full h-auto max-h-40"
//                                             />
//                                         ) : (
//                                             <a
//                                                 href={typeof file === 'string' ? file : URL.createObjectURL(file)}
//                                                 target="_blank"
//                                                 rel="noopener noreferrer"
//                                                 className="text-blue-500 underline"
//                                             >
//                                                 View Document {index + 1}
//                                             </a>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <span>No documents uploaded</span>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ViewApplicationForm; 