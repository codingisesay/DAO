 









import React, { useState, useEffect, useRef } from 'react';
import CommanInput from '../../components/CommanInput';
import workingman from '../../assets/imgs/workingman1.png';
import labels from '../../components/labels';
import { gender, salutation, religion, caste, maritalStatusOptions } from '../../data/data';
import CommanSelect from '../../components/CommanSelect';
import Swal from 'sweetalert2';
import { applicationDetailsService } from '../../services/apiServices';
import { daodocbase } from '../../data/data';
import { usePDF } from 'react-to-pdf';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ViewApplicationForm = () => {
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const { toPDF, targetRef } = usePDF({ filename: 'application-form.pdf' });
    const handleChange = () => { };
    const [nominees, setNominees] = useState([])

    // const id = localStorage.getItem('application_id');
    const { id } = useParams();

    const fetchDetails = async () => {
        try {

            const response = await applicationDetailsService.getFullDetails(id);
            if (response) {
                const { application, personal_details, account_personal_details,account_nominees, application_addresss, customerdoc, customerpic } = response.data;
                const address = Array.isArray(application_addresss) ? application_addresss[0] : application_addresss;
                const signatureDoc = customerdoc.find(doc =>
                    doc.document_type.toLowerCase().includes('signature')
                );
                console.log('photo :', customerpic[0].path);
                    if (account_nominees && account_nominees.length > 0) {
                        setNominees(account_nominees);
                    }
                setFormData({
                    application_id: id,
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

                    // Add these new address-related fields
                    per_resident: address?.per_resident || "",
                    per_residence_status: address?.per_residence_status || "",
                    resi_doc: address?.resi_doc || "",

                    // Family Details (add all these fields)
                    maiden_prefix: account_personal_details?.maiden_prefix || "",
                    maiden_first_name: account_personal_details?.maiden_first_name || "",
                    maiden_middle_name: account_personal_details?.maiden_middle_name || "",
                    maiden_last_name: account_personal_details?.maiden_last_name || "",
                    father_prefix_name: account_personal_details?.father_prefix_name || "",
                    father_first_name: account_personal_details?.father_first_name || "",
                    father_middle_name: account_personal_details?.father_middle_name || "",
                    father_last_name: account_personal_details?.father_last_name || "",
                    mother_prefix_name: account_personal_details?.mother_prefix_name || "",
                    mother_first_name: account_personal_details?.mother_first_name || "",
                    mother_middle_name: account_personal_details?.mother_middle_name || "",
                    mother_last_name: account_personal_details?.mother_last_name || "",
                    birth_place: account_personal_details?.birth_place || "",
                    birth_country: account_personal_details?.birth_country || "",

                    // Identity Documents
                    adhar_card: personal_details?.adhar_card,
                    pan_card: personal_details?.pan_card,
                    passport: personal_details?.passport,
                    driving_license: personal_details?.driving_license,
                    voter_id: personal_details?.voter_id,


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
                    photo: customerpic ? daodocbase + customerpic[0].path : null,

                    // Documents
                    passportdoc: customerdoc?.find(doc => doc.document_type.includes('PASSPORT_JPG'))
                        ? daodocbase + customerdoc.find(doc => doc.document_type.includes('PASSPORT_JPG')).file_path
                        : "",

                    aadhaarFrontdoc: customerdoc?.find(doc => doc.document_type.includes('AADHAAR_FRONT_JPG'))
                        ? daodocbase + customerdoc.find(doc => doc.document_type.includes('AADHAAR_FRONT_JPG')).file_path
                        : "",

                    aadhaarBackdoc: customerdoc?.find(doc => doc.document_type.includes('AADHAAR_BACK_JPG'))
                        ? daodocbase + customerdoc.find(doc => doc.document_type.includes('AADHAAR_BACK_JPG')).file_path
                        : "",

                    pancarddoc: customerdoc?.find(doc => doc.document_type.includes('PAN_CARD_JPG'))
                        ? daodocbase + customerdoc.find(doc => doc.document_type.includes('PAN_CARD_JPG')).file_path
                        : "",

                    voteridoc: customerdoc?.find(doc => doc.document_type.includes('VOTER_ID_CARD_JPG'))
                        ? daodocbase + customerdoc.find(doc => doc.document_type.includes('VOTER_ID_CARD_JPG')).file_path
                        : "",

                    drivinglicensedoc: customerdoc?.find(doc => doc.document_type.includes('DRIVING_LICENSE_JPG'))
                        ? daodocbase + customerdoc.find(doc => doc.document_type.includes('DRIVING_LICENSE_JPG')).file_path
                        : "",

                    utilitybilldoc: customerdoc?.find(doc => doc.document_type.includes('UTILITY_BILL_JPG'))
                        ? daodocbase + customerdoc.find(doc => doc.document_type.includes('UTILITY_BILL_JPG')).file_path
                        : "",

                    rentagreementdoc: customerdoc?.find(doc => doc.document_type.includes('RENT_AGREEMENT_JPG'))
                        ? daodocbase + customerdoc.find(doc => doc.document_type.includes('RENT_AGREEMENT_JPG')).file_path
                        : "",

                    propertytaxdoc: customerdoc?.find(doc => doc.document_type.includes('PROPERTY_TAX_RECEIPT_JPG'))
                        ? daodocbase + customerdoc.find(doc => doc.document_type.includes('PROPERTY_TAX_RECEIPT_JPG')).file_path
                        : "",

                    bankstatementdoc: customerdoc?.find(doc => doc.document_type.includes('BANK_STATEMENT_JPG'))
                        ? daodocbase + customerdoc.find(doc => doc.document_type.includes('BANK_STATEMENT_JPG')).file_path
                        : "",

                });
            }
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.message
            });
        }
    };
    useEffect(() => {
        if (!id) return;
        fetchDetails();
    }, [id]);


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
                    {/* <h1 className="text-3xl font-bold mb-2">Application Form</h1> */}
                    <div className='flex justify-between items-center mb-4'>
                        <div>
                            <p className="text-gray-600">Application ID: {formData.application_id || 'N/A'}</p>
                            <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                        </div>
                        <button className='btn-login px-5' onClick={handlePrint} > Download </button>
                    </div>
                </div>
                {/* Authentication Details */}
                <div className="pdf-section">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Authentication Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
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
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
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
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.middlename.label}
                            type="text"
                            name="middle_name"
                            value={formData.middle_name || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.lastname.label}
                            type="text"
                            name="last_name"
                            value={formData.last_name || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.dob.label}
                            type="date"
                            name="DOB"
                            value={formData.DOB || ''}
                            readOnly
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                        <CommanInput
                            onChange={handleChange}
                            label={labels.mobile.label}
                            type="text"
                            name="mobile"
                            value={formData.mobile || ''}
                            readOnly
                            max={10}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.alt_mob_no.label}
                            type="text"
                            name="alt_mob_no"
                            value={formData.alt_mob_no || ''}
                            readOnly
                            max={10}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.email.label}
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            readOnly
                        />
                    </div>
                </div>

                {/* Permanent Address */}
                <div className="pdf-section">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Permanent Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                        <CommanInput
                            onChange={handleChange}
                            label={labels.complexname.label}
                            type="text"
                            name="complex_name"
                            value={formData.complex_name || ''}
                            readOnly
                            max={30}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.roomno.label}
                            type="text"
                            name="flat_no"
                            value={formData.flat_no || ''}
                            readOnly
                            max={20}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.area.label}
                            type="text"
                            name="area"
                            value={formData.area || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.landmark.label}
                            type="text"
                            name="landmark"
                            value={formData.landmark || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.country.label}
                            type="text"
                            name="country"
                            value={formData.country || ''}
                            readOnly
                            max={30}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.pincode.label}
                            type="text"
                            name="pincode"
                            value={formData.pincode || ''}
                            readOnly
                            max={6}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.city.label}
                            type="text"
                            name="city"
                            value={formData.city || ''}
                            readOnly
                            max={30}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.district.label}
                            type="text"
                            name="district"
                            value={formData.district || ''}
                            readOnly
                            max={30}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.state.label}
                            type="text"
                            name="state"
                            value={formData.state || ''}
                            readOnly
                            max={30}
                        />

                        <CommanInput
                            label="Permanent Resident"
                            name="per_resident"
                            value={formData.per_resident || ''}
                            readOnly
                            max={10}
                        />
                        <CommanInput
                            label="Residence Status"
                            name="per_residence_status"
                            value={formData.per_residence_status || ''}
                            readOnly
                            max={20}
                        />
                        <CommanInput
                            label="Residence Document"
                            name="resi_doc"
                            value={formData.resi_doc || ''}
                            readOnly
                            max={20}
                        />
                    </div>
                </div>

                {/* Correspondence Address */}
                {formData.correspondenceAddressSame !== "YES" && (
                    <div className="pdf-section">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Correspondence Address</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                            <CommanInput
                                onChange={handleChange}
                                label="Complex Name"
                                type="text"
                                name="per_complex_name"
                                value={formData.per_complex_name || ''}
                                readOnly
                                max={30}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label="Flat No"
                                type="text"
                                name="cor_flat_no"
                                value={formData.cor_flat_no || ''}
                                readOnly
                                max={20}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label="Area"
                                type="text"
                                name="cor_area"
                                value={formData.cor_area || ''}
                                readOnly
                                max={50}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label=" Landmark"
                                type="text"
                                name="cor_landmark"
                                value={formData.cor_landmark || ''}
                                readOnly
                                max={50}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label=" Country"
                                type="text"
                                name="cor_country"
                                value={formData.cor_country || ''}
                                readOnly
                                max={30}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label=" Pincode"
                                type="text"
                                name="cor_pincode"
                                value={formData.cor_pincode || ''}
                                readOnly
                                max={6}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label=" City"
                                type="text"
                                name="cor_city"
                                value={formData.cor_city || ''}
                                readOnly
                                max={30}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label=" District"
                                type="text"
                                name="cor_district"
                                value={formData.cor_district || ''}
                                readOnly
                                max={30}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label="State"
                                type="text"
                                name="cor_state"
                                value={formData.cor_state || ''}
                                readOnly
                                max={30}
                            />
                        </div>
                    </div>
                )}

                {/* Identity Documents */}
                <div className="pdf-section">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Identity Documents</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                        <CommanInput
                            onChange={handleChange}
                            label={labels.adhar_card.label}
                            type="text"
                            name="adhar_card"
                            value={formData.adhar_card || ''}
                            readOnly
                            max={12}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.pannumber.label}
                            type="text"
                            name="pan_card"
                            value={formData.pan_card || ''}
                            readOnly
                            max={10}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.passportno.label}
                            type="text"
                            name="passport"
                            value={formData.passport || ''}
                            readOnly
                            max={20}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.drivinglicence.label}
                            type="text"
                            name="driving_license"
                            value={formData.driving_license || ''}
                            readOnly
                            max={20}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label={labels.voterid.label}
                            type="text"
                            name="voter_id"
                            value={formData.voter_id || ''}
                            readOnly
                            max={20}
                        />
                    </div>
                </div>

                   {/* Nominee Details */}
                {nominees.length > 0 && (
                    <div className="pdf-section mb-8">
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Nominee Details</h2>
                        <div className="w-full mb-8 border rounded p-4">
                        <table className="min-w-fit table-auto border border-collapse mb-4">
                            <thead>
                            <tr className="bg-gray-100 text-left">
                                <th  className="border px-4 py-2">Name of the Nominee</th>
                                <th  className="border px-4 py-2">Address</th>
                                <th  className="border px-4 py-2">Relationship</th>
                                <th  className="border px-4 py-2">Date of Birth</th>
                                <th  className="border px-4 py-2">Age</th>
                                <th  className="border px-4 py-2">Percentage</th> 
                            </tr>
                            </thead>

                            {nominees.map((nominee, index) => (
                            <tbody key={index}>
                                <tr>
                                <td className="border px-4 py-2 break-words whitespace-normal" style={{verticalAlign:'top'}} >
                                    {nominee.salutation} {nominee.first_name} {nominee.middle_name} {nominee.last_name}
                                </td>
                                <td className="border px-4 py-2 break-words whitespace-normal" style={{verticalAlign:'top'}} >
                                    {nominee.nom_complex_name} {nominee.nom_flat_no} {nominee.nom_area} {nominee.nom_landmark} {nominee.nom_country} {nominee.nom_pincode} {nominee.nom_city} {nominee.nom_district} {nominee.nom_state}
                                </td>
                                <td className="border px-4 py-2" style={{verticalAlign:'top'}} >{nominee.relationship}</td>
                                <td className="border px-4 py-2" style={{ verticalAlign: 'top', minWidth: '100px' }}>
                        {nominee.dob ? new Date(nominee.dob).toLocaleDateString('en-GB') : 'N/A'}
                        </td>

                                <td className="border px-4 py-2" style={{verticalAlign:'top'}} >{nominee.age}</td>
                                <td className="border px-4 py-2" style={{verticalAlign:'top'}} >{nominee.percentage}</td> 
                                </tr>
                            </tbody>
                            ))}
                        </table>
                        </div>


                    </div>
                )}

 
                {/* Family Details */}
                <div className="pdf-section">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Family Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                        {/* Maiden Name Fields */}
                        <CommanSelect
                            onChange={handleChange}
                            label="Maiden Prefix"
                            name="maiden_prefix"
                            value={formData.maiden_prefix || ''}
                            options={salutation}
                            readOnly
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Maiden First Name"
                            type="text"
                            name="maiden_first_name"
                            value={formData.maiden_first_name || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Maiden Middle Name"
                            type="text"
                            name="maiden_middle_name"
                            value={formData.maiden_middle_name || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Maiden Last Name"
                            type="text"
                            name="maiden_last_name"
                            value={formData.maiden_last_name || ''}
                            readOnly
                            max={50}
                        />

                        {/* Father's Details */}
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
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Father's Middle Name"
                            type="text"
                            name="father_middle_name"
                            value={formData.father_middle_name || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Father's Last Name"
                            type="text"
                            name="father_last_name"
                            value={formData.father_last_name || ''}
                            readOnly
                            max={50}
                        />

                        {/* Mother's Details */}
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
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Mother's Middle Name"
                            type="text"
                            name="mother_middle_name"
                            value={formData.mother_middle_name || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Mother's Last Name"
                            type="text"
                            name="mother_last_name"
                            value={formData.mother_last_name || ''}
                            readOnly
                            max={50}
                        />

                        {/* Birth Place & Country */}
                        <CommanInput
                            onChange={handleChange}
                            label="Birth Place"
                            type="text"
                            name="birth_place"
                            value={formData.birth_place || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Birth Country"
                            type="text"
                            name="birth_country"
                            value={formData.birth_country || ''}
                            readOnly
                            max={50}
                        />
                    </div>
                </div>

                {/* Occupation Details */}
                <div className="pdf-section">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Occupation Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                        <CommanInput
                            onChange={handleChange}
                            label="Occupation Type"
                            type="text"
                            name="occoupation_type"
                            value={formData.occoupation_type || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Occupation Name"
                            type="text"
                            name="occupation_name"
                            value={formData.occupation_name || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Salaried With"
                            type="text"
                            name="if_salaryed"
                            value={formData.if_salaryed || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Designation"
                            type="text"
                            name="designation"
                            value={formData.designation || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Nature of Occupation"
                            type="text"
                            name="nature_of_occoupation"
                            value={formData.nature_of_occoupation || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Qualification"
                            type="text"
                            name="qualification"
                            value={formData.qualification || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Annual Income"
                            type="text"
                            name="anual_income"
                            value={formData.anual_income || ''}
                            readOnly
                            max={50}
                        />
                        <CommanInput
                            onChange={handleChange}
                            label="Remark"
                            type="text"
                            name="remark"
                            value={formData.remark || ''}
                            readOnly
                            max={50}
                        />
                    </div>
                </div>

                {/* File Uploads */}
                <div className="pdf-section">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">File Uploads</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Photo</label>
                            {formData.photo ? (
                                <img
                                    src={typeof formData.photo === 'string' ? formData.photo : URL.createObjectURL(formData.photo)}
                                    alt="Photo"
                                    className="w-30 h-auto  "
                                />
                            ) : (
                                <span>No photo uploaded</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Signature</label>
                            {formData.signature ? (
                                <img
                                    src={typeof formData.signature === 'string' ? formData.signature : URL.createObjectURL(formData.signature)}
                                    alt="Signature"
                                    className="w-40 h-auto  "
                                />
                            ) : (
                                <span>No signature uploaded</span>
                            )}
                        </div>
                    </div>
                </div>




                {/* File Uploads */}
                <div className="pdf-section">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">File Uploads</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-3 gap-5 mb-6">

                        {formData.passportdoc ? (
                            <img
                                src={typeof formData.passportdoc === 'string' ? formData.passportdoc : URL.createObjectURL(formData.passportdoc)}
                                alt="Passport"
                                className="w-50 h-40"
                            />
                        ) : (
                            <></>
                        )}

                        {formData.aadhaarFrontdoc ? (
                            <img
                                src={typeof formData.aadhaarFrontdoc === 'string' ? formData.aadhaarFrontdoc : URL.createObjectURL(formData.aadhaarFrontdoc)}
                                alt="Aadhaar Front"
                                className="w-50 h-40"
                            />
                        ) : (
                            <></>
                        )}

                        {formData.aadhaarBackdoc ? (
                            <img
                                src={typeof formData.aadhaarBackdoc === 'string' ? formData.aadhaarBackdoc : URL.createObjectURL(formData.aadhaarBackdoc)}
                                alt="Aadhaar Back"
                                className="w-50 h-40"
                            />
                        ) : (
                            <></>
                        )}

                        {formData.pancarddoc ? (
                            <img
                                src={typeof formData.pancarddoc === 'string' ? formData.pancarddoc : URL.createObjectURL(formData.pancarddoc)}
                                alt="PAN"
                                className="w-50 h-40"
                            />
                        ) : (
                            <></>
                        )}

                        {formData.voteridoc ? (
                            <img
                                src={typeof formData.voteridoc === 'string' ? formData.voteridoc : URL.createObjectURL(formData.voteridoc)}
                                alt="Voter ID"
                                className="w-50 h-40"
                            />
                        ) : (
                            <></>
                        )}

                        {formData.drivinglicensedoc ? (
                            <img
                                src={typeof formData.drivinglicensedoc === 'string' ? formData.drivinglicensedoc : URL.createObjectURL(formData.drivinglicensedoc)}
                                alt="Driving License"
                                className="w-50 h-40"
                            />
                        ) : (
                            <></>
                        )}

                        {formData.utilitybilldoc ? (
                            <img
                                src={typeof formData.utilitybilldoc === 'string' ? formData.utilitybilldoc : URL.createObjectURL(formData.utilitybilldoc)}
                                alt="Utility Bill"
                                className="w-50 h-40"
                            />
                        ) : (
                            <></>
                        )}

                        {formData.rentagreementdoc ? (
                            <img
                                src={typeof formData.rentagreementdoc === 'string' ? formData.rentagreementdoc : URL.createObjectURL(formData.rentagreementdoc)}
                                alt="Rent Agreement"
                                className="w-50 h-40"
                            />
                        ) : (
                            <></>
                        )}

                        {formData.propertytaxdoc ? (
                            <img
                                src={typeof formData.propertytaxdoc === 'string' ? formData.propertytaxdoc : URL.createObjectURL(formData.propertytaxdoc)}
                                alt="Property Tax Receipt"
                                className="w-50 h-40"
                            />
                        ) : (
                            <></>
                        )}

                        {formData.bankstatementdoc ? (
                            <img
                                src={typeof formData.bankstatementdoc === 'string' ? formData.bankstatementdoc : URL.createObjectURL(formData.bankstatementdoc)}
                                alt="Bank Statement"
                                className="w-50 h-40"
                            />
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewApplicationForm;












