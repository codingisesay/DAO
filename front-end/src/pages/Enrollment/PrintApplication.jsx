import React, { useState, useEffect, useRef } from 'react';
import workingman from '../../assets/imgs/workingman1.png';
import labels from '../../components/labels';
import { gender, salutation, religion, caste, maritalStatusOptions } from '../../data/data';
import Swal from 'sweetalert2';
import { applicationDetailsService } from '../../services/apiServices';
import { daodocbase } from '../../data/data';
import { usePDF } from 'react-to-pdf';
import { useNavigate } from 'react-router-dom';

const ApplicationPdf = () => {
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const { toPDF, targetRef } = usePDF({ filename: 'application-form.pdf' });

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

                        photo: customerpic ? daodocbase + customerpic[0].path : null,
                        signature: daodocbase + signatureDoc.file_path || null,
                    });
                }
            } catch (error) {
                console.log(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text:  error?.response?.data?.message
                });
            }
        };
        fetchDetails();
    }, [applicationId]);

    // Helper component to render key-value pairs
    const KeyValueRow = ({ label, value, emptyValue = 'N/A' }) => (
        <div style={{ display: 'flex', marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold', width: '200px' }}>{label}:</span>
            <span>{value || emptyValue}</span>
        </div>
    );

    // Helper component for sections
    const Section = ({ title, children }) => (
        <div className="section" style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>{title}</h2>
            {children}
        </div>
    );

    // Helper component for columns layout
    const ColumnsLayout = ({ children }) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {children}
        </div>
    );

    // Helper component for column
    const Column = ({ children, width = '48%' }) => (
        <div style={{ width, minWidth: '300px' }}>
            {children}
        </div>
    );

    return (
        <div className="container mx-auto p-4" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div ref={targetRef} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" style={{ boxSizing: 'border-box' }}>
                <style>
                    {`
                    @media print {
                        body {
                            font-family: Arial, sans-serif;
                        }
                        .section {
                            page-break-after: avoid;
                            page-break-inside: avoid;
                        }
                        img {
                            max-width: 100%;
                            height: auto;
                        }
                    }
                    `}
                </style>

                <div style={{ display: 'flex', marginBottom: '20px' }}>
                    <img src={formData.photo} alt="Applicant Photo" style={{ width: '160px', height: '160px', border: '2px solid #10B981', borderRadius: '4px', marginRight: '16px' }} />
                    <div style={{ flex: 1, alignSelf: 'center' }}>
                        <KeyValueRow label="Name" value={`${formData.first_name || ''} ${formData.middle_name || ''} ${formData.last_name || ''}`.trim()} />
                        <KeyValueRow label="DOB" value={formData.DOB} />
                        <KeyValueRow label="Gender" value={formData.gender} />
                        <KeyValueRow label="PAN No." value={formData.pan_card} />
                        <KeyValueRow label="Aadhar No." value={formData.adhar_card} />
                    </div>
                </div>

                {/* Personal Information */}
                <Section title="Personal Information">
                    <ColumnsLayout>
                        <Column>
                            <KeyValueRow label={labels.salutation.label} value={formData.salutation} />
                            <KeyValueRow label={labels.firstname.label} value={formData.first_name} />
                            <KeyValueRow label={labels.middlename.label} value={formData.middle_name} />
                            <KeyValueRow label={labels.lastname.label} value={formData.last_name} />
                            <KeyValueRow label={labels.dob.label} value={formData.DOB} />
                        </Column>
                        <Column>
                            <KeyValueRow label={labels.gender.label} value={formData.gender} />
                            <KeyValueRow label={labels.religion.label} value={formData.religion} />
                            <KeyValueRow label={labels.caste.label} value={formData.caste} />
                            <KeyValueRow label={labels.maritalStatus.label} value={formData.marital_status} />
                        </Column>
                    </ColumnsLayout>
                </Section>

                {/* Contact Information */}
                <Section title="Contact Information">
                    <ColumnsLayout>
                        <Column>
                            <KeyValueRow label={labels.mobile.label} value={formData.mobile} />
                            <KeyValueRow label={labels.alt_mob_no.label} value={formData.alt_mob_no} />
                            <KeyValueRow label={labels.email.label} value={formData.email} />
                        </Column>
                    </ColumnsLayout>
                </Section>

                {/* Permanent Address */}
                <Section title="Permanent Address">
                    <ColumnsLayout>
                        <Column>
                            <KeyValueRow label={labels.complexname.label} value={formData.complex_name} />
                            <KeyValueRow label={labels.roomno.label} value={formData.flat_no} />
                            <KeyValueRow label={labels.area.label} value={formData.area} />
                            <KeyValueRow label={labels.landmark.label} value={formData.landmark} />
                        </Column>
                        <Column>
                            <KeyValueRow label={labels.country.label} value={formData.country} />
                            <KeyValueRow label={labels.pincode.label} value={formData.pincode} />
                            <KeyValueRow label={labels.city.label} value={formData.city} />
                            <KeyValueRow label={labels.district.label} value={formData.district} />
                            <KeyValueRow label={labels.state.label} value={formData.state} />
                        </Column>
                    </ColumnsLayout>
                </Section>

                {/* Correspondence Address */}
                {formData.correspondenceAddressSame !== "YES" && (
                    <Section title="Correspondence Address">
                        <ColumnsLayout>
                            <Column>
                                <KeyValueRow label="Correspondence Complex Name" value={formData.per_complex_name} />
                                <KeyValueRow label="Correspondence Flat No" value={formData.cor_flat_no} />
                                <KeyValueRow label="Correspondence Area" value={formData.cor_area} />
                                <KeyValueRow label="Correspondence Landmark" value={formData.cor_landmark} />
                            </Column>
                            <Column>
                                <KeyValueRow label="Correspondence Country" value={formData.cor_country} />
                                <KeyValueRow label="Correspondence Pincode" value={formData.cor_pincode} />
                                <KeyValueRow label="Correspondence City" value={formData.cor_city} />
                                <KeyValueRow label="Correspondence District" value={formData.cor_district} />
                                <KeyValueRow label="Correspondence State" value={formData.cor_state} />
                            </Column>
                        </ColumnsLayout>
                    </Section>
                )}

                {/* Identity Documents */}
                <Section title="Identity Documents">
                    <ColumnsLayout>
                        <Column>
                            <KeyValueRow label={labels.adhar_card.label} value={formData.adhar_card} />
                            <KeyValueRow label={labels.pannumber.label} value={formData.pan_card} />
                            <KeyValueRow label={labels.passportno.label} value={formData.passport} />
                        </Column>
                        <Column>
                            <KeyValueRow label={labels.drivinglicence.label} value={formData.driving_license} />
                            <KeyValueRow label={labels.voterid.label} value={formData.voter_id} />
                        </Column>
                    </ColumnsLayout>
                </Section>

                {/* Family Details */}
                <Section title="Family Details">
                    <ColumnsLayout>
                        <Column>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Father's Details</h3>
                            <KeyValueRow label="Prefix" value={formData.father_prefix_name} />
                            <KeyValueRow label="First Name" value={formData.father_first_name} />
                            <KeyValueRow label="Middle Name" value={formData.father_middle_name} />
                            <KeyValueRow label="Last Name" value={formData.father_last_name} />
                        </Column>
                        <Column>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Mother's Details</h3>
                            <KeyValueRow label="Prefix" value={formData.mother_prefix_name} />
                            <KeyValueRow label="First Name" value={formData.mother_first_name} />
                            <KeyValueRow label="Middle Name" value={formData.mother_middle_name} />
                            <KeyValueRow label="Last Name" value={formData.mother_last_name} />
                        </Column>
                    </ColumnsLayout>
                    <ColumnsLayout>
                        <Column>
                            <KeyValueRow label="Birth Place" value={formData.birth_place} />
                            <KeyValueRow label="Birth Country" value={formData.birth_country} />
                        </Column>
                    </ColumnsLayout>
                </Section>

                {/* Occupation Details */}
                <Section title="Occupation Details">
                    <ColumnsLayout>
                        <Column>
                            <KeyValueRow label="Occupation Type" value={formData.occoupation_type} />
                            <KeyValueRow label="Occupation Name" value={formData.occupation_name} />
                            <KeyValueRow label="Salaried With" value={formData.if_salaryed} />
                        </Column>
                        <Column>
                            <KeyValueRow label="Designation" value={formData.designation} />
                            <KeyValueRow label="Nature of Occupation" value={formData.nature_of_occoupation} />
                            <KeyValueRow label="Qualification" value={formData.qualification} />
                        </Column>
                    </ColumnsLayout>
                    <KeyValueRow label="Annual Income" value={formData.anual_income} />
                    <KeyValueRow label="Remark" value={formData.remark} />
                </Section>

                {/* File Uploads */}
                <Section title="File Uploads">
                    <ColumnsLayout>
                        <Column>
                            <div>
                                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Signature</label>
                                {formData.signature ? (
                                    <img
                                        src={typeof formData.signature === 'string' ? formData.signature : URL.createObjectURL(formData.signature)}
                                        alt="Signature"
                                        style={{ maxWidth: '100%', height: 'auto', maxHeight: '160px' }}
                                    />
                                ) : (
                                    <span>No signature uploaded</span>
                                )}
                            </div>
                        </Column>
                    </ColumnsLayout>
                </Section>
            </div>
        </div>
    );
};

export default ApplicationPdf;


























// import React, { useState, useEffect, useRef } from 'react';
// import CommanInput from '../../components/CommanInput';
// import workingman from '../../assets/imgs/workingman1.png';
// import labels from '../../components/labels';
// import CommonButton from '../../components/CommonButton';
// import { gender, salutation, religion, caste, maritalStatusOptions } from '../../data/data';
// import CommanSelect from '../../components/CommanSelect';
// import Swal from 'sweetalert2';
// import { applicationDetailsService } from '../../services/apiServices';
// import { daodocbase } from '../../data/data';
// import { usePDF } from 'react-to-pdf';
// import { useNavigate } from 'react-router-dom';

// const ApplicationPdf = () => {
//     const [formData, setFormData] = useState({});
//     const navigate = useNavigate();
//     const { toPDF, targetRef } = usePDF({ filename: 'application-form.pdf' });
//     const handleChange = () => { };

//     const applicationId = localStorage.getItem('application_id');

//     useEffect(() => {
//         // alert(applicationId)
//         if (!applicationId) return;
//         const fetchDetails = async () => {
//             try {
//                 const response = await applicationDetailsService.getFullDetails(applicationId);
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
//                         status: application.auth_status,

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
//                         landmark: application.lankmark,
//                         country: application.country,
//                         pincode: application.pincode,
//                         city: application.city,
//                         district: application.district,
//                         state: application.state,

//                         // Correspondence Address
//                         per_complex_name: address?.per_complex_name,
//                         cor_flat_no: address?.cor_flat_no,
//                         cor_area: address?.cor_area,
//                         cor_landmark: address?.cor_landmark,
//                         cor_country: address?.cor_country,
//                         cor_pincode: address?.cor_pincode,
//                         cor_city: address?.cor_city,
//                         cor_district: address?.cor_district,
//                         cor_state: address?.cor_state,

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

//                         photo: customerpic ? daodocbase + customerpic[0].path : null,
//                         signature: daodocbase + signatureDoc.file_path || null,
//                     });
//                 }
//             } catch (error) {
//                 console.log(error)
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Error',
//                     text:  error?.response?.data?.message
//                 });
//             }
//         };
//         fetchDetails();
//     }, [applicationId]);

//     // Helper component to render rows with 3 inputs
//     const InputRow = ({ children }) => (
//         <div className="row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', pageBreakInside: 'avoid' }}>
//             {children}
//         </div>
//     );

//     // Helper component for input items
//     const InputItem = ({ children }) => (
//         <div className="input-item" style={{ width: '32%' }}>
//             {children}
//         </div>
//     );

//     return (
//         <div className="container mx-auto p-4" style={{ fontFamily: 'Arial, sans-serif' }}>
//             <div ref={targetRef} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" style={{ boxSizing: 'border-box' }}>
//                 <style>
//                     {`
//                     @media print {
//                         body {
//                             font-family: Arial, sans-serif;
//                         }
//                         .row {
//                             display: flex;
//                             justify-content: space-between;
//                             margin-bottom: 16px;
//                             page-break-inside: avoid;
//                         }
//                         .input-item {
//                             width: 32%;
//                         }
//                         .section {
//                             page-break-after: avoid;
//                             page-break-inside: avoid;
//                         }
//                         img {
//                             max-width: 100%;
//                             height: auto;
//                         }
//                     }
//                     `}
//                 </style>

//                 <div style={{ display: 'flex', marginBottom: '20px' }}>
//                     <img src={formData.photo} alt="Logo" style={{ width: '160px', height: '160px', border: '2px solid #10B981', borderRadius: '4px', marginRight: '16px' }} />
//                     <div style={{ flex: 1, alignSelf: 'center' }}>
//                         <p style={{ display: 'flex', margin: '4px 0' }}>
//                             <span style={{ fontWeight: 'bold', width: '128px' }}>Name:</span>
//                             <span>{formData.first_name || 'N/A'}</span>
//                         </p>
//                         <p style={{ display: 'flex', margin: '4px 0' }}>
//                             <span style={{ fontWeight: 'bold', width: '128px' }}>DOB:</span>
//                             <span>{formData.DOB || 'N/A'}</span>
//                         </p>
//                         <p style={{ display: 'flex', margin: '4px 0' }}>
//                             <span style={{ fontWeight: 'bold', width: '128px' }}>Gender:</span>
//                             <span>{formData.gender || 'N/A'}</span>
//                         </p>
//                         <p style={{ display: 'flex', margin: '4px 0' }}>
//                             <span style={{ fontWeight: 'bold', width: '128px' }}>PAN No.:</span>
//                             <span>{formData.pan_card || 'N/A'}</span>
//                         </p>
//                         <p style={{ display: 'flex', margin: '4px 0' }}>
//                             <span style={{ fontWeight: 'bold', width: '128px' }}>Aadhar No.:</span>
//                             <span>{formData.adhar_card || 'N/A'}</span>
//                         </p>
//                     </div>
//                 </div>

//                 {/* Personal Information */}
//                 <div className="section" style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
//                     <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Personal Information</h2>

//                     <InputRow>
//                         <InputItem>
//                             <CommanSelect
//                                 onChange={handleChange}
//                                 label={labels.salutation.label}
//                                 name="salutation"
//                                 value={formData.salutation || ''}
//                                 options={salutation}
//                                 readOnly
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.firstname.label}
//                                 type="text"
//                                 name="first_name"
//                                 value={formData.first_name || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.middlename.label}
//                                 type="text"
//                                 name="middle_name"
//                                 value={formData.middle_name || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                     </InputRow>

//                     <InputRow>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.lastname.label}
//                                 type="text"
//                                 name="last_name"
//                                 value={formData.last_name || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.dob.label}
//                                 type="date"
//                                 name="DOB"
//                                 value={formData.DOB || ''}
//                                 readOnly
//                                 validationType="DATE"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanSelect
//                                 onChange={handleChange}
//                                 label={labels.gender.label}
//                                 name="gender"
//                                 value={formData.gender || ''}
//                                 options={gender}
//                                 readOnly
//                             />
//                         </InputItem>
//                     </InputRow>

//                     <InputRow>
//                         <InputItem>
//                             <CommanSelect
//                                 onChange={handleChange}
//                                 label={labels.religion.label}
//                                 name="religion"
//                                 value={formData.religion || ''}
//                                 options={religion}
//                                 readOnly
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanSelect
//                                 onChange={handleChange}
//                                 label={labels.caste.label}
//                                 name="caste"
//                                 value={formData.caste || ''}
//                                 options={caste}
//                                 readOnly
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanSelect
//                                 onChange={handleChange}
//                                 label={labels.maritalStatus.label}
//                                 name="marital_status"
//                                 value={formData.marital_status || ''}
//                                 options={maritalStatusOptions}
//                                 readOnly
//                             />
//                         </InputItem>
//                     </InputRow>
//                 </div>

//                 {/* Contact Information */}
//                 <div className="section" style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
//                     <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Contact Information</h2>

//                     <InputRow>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.mobile.label}
//                                 type="text"
//                                 name="mobile"
//                                 value={formData.mobile || ''}
//                                 readOnly
//                                 max={10}
//                                 validationType="PHONE"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.alt_mob_no.label}
//                                 type="text"
//                                 name="alt_mob_no"
//                                 value={formData.alt_mob_no || ''}
//                                 readOnly
//                                 max={10}
//                                 validationType="PHONE"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.email.label}
//                                 type="email"
//                                 name="email"
//                                 value={formData.email || ''}
//                                 readOnly
//                                 validationType="EMAIL"
//                             />
//                         </InputItem>
//                     </InputRow>
//                 </div>

//                 {/* Permanent Address */}
//                 <div className="section" style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
//                     <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Permanent Address</h2>

//                     <InputRow>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.complexname.label}
//                                 type="text"
//                                 name="complex_name"
//                                 value={formData.complex_name || ''}
//                                 readOnly
//                                 max={30}
//                                 validationType="ALPHABETS_AND_SPACE"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.roomno.label}
//                                 type="text"
//                                 name="flat_no"
//                                 value={formData.flat_no || ''}
//                                 readOnly
//                                 max={20}
//                                 validationType="ALPHANUMERIC"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.area.label}
//                                 type="text"
//                                 name="area"
//                                 value={formData.area || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="ALPHABETS_AND_SPACE"
//                             />
//                         </InputItem>
//                     </InputRow>

//                     <InputRow>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.landmark.label}
//                                 type="text"
//                                 name="landmark"
//                                 value={formData.landmark || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="EVERYTHING"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.country.label}
//                                 type="text"
//                                 name="country"
//                                 value={formData.country || ''}
//                                 readOnly
//                                 max={30}
//                                 validationType="ALPHABETS_AND_SPACE"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.pincode.label}
//                                 type="text"
//                                 name="pincode"
//                                 value={formData.pincode || ''}
//                                 readOnly
//                                 max={6}
//                                 validationType="NUMBER_ONLY"
//                             />
//                         </InputItem>
//                     </InputRow>

//                     <InputRow>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.city.label}
//                                 type="text"
//                                 name="city"
//                                 value={formData.city || ''}
//                                 readOnly
//                                 max={30}
//                                 validationType="ALPHABETS_AND_SPACE"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.district.label}
//                                 type="text"
//                                 name="district"
//                                 value={formData.district || ''}
//                                 readOnly
//                                 max={30}
//                                 validationType="ALPHABETS_AND_SPACE"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.state.label}
//                                 type="text"
//                                 name="state"
//                                 value={formData.state || ''}
//                                 readOnly
//                                 max={30}
//                                 validationType="ALPHABETS_AND_SPACE"
//                             />
//                         </InputItem>
//                     </InputRow>
//                 </div>

//                 {/* Correspondence Address */}
//                 {formData.correspondenceAddressSame !== "YES" && (
//                     <div className="section" style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
//                         <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Correspondence Address</h2>

//                         <InputRow>
//                             <InputItem>
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label="Correspondence Complex Name"
//                                     type="text"
//                                     name="per_complex_name"
//                                     value={formData.per_complex_name || ''}
//                                     readOnly
//                                     max={30}
//                                     validationType="ALPHABETS_AND_SPACE"
//                                 />
//                             </InputItem>
//                             <InputItem>
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label="Correspondence Flat No"
//                                     type="text"
//                                     name="cor_flat_no"
//                                     value={formData.cor_flat_no || ''}
//                                     readOnly
//                                     max={20}
//                                     validationType="ALPHANUMERIC"
//                                 />
//                             </InputItem>
//                             <InputItem>
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label="Correspondence Area"
//                                     type="text"
//                                     name="cor_area"
//                                     value={formData.cor_area || ''}
//                                     readOnly
//                                     max={50}
//                                     validationType="ALPHABETS_AND_SPACE"
//                                 />
//                             </InputItem>
//                         </InputRow>

//                         <InputRow>
//                             <InputItem>
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label="Correspondence Landmark"
//                                     type="text"
//                                     name="cor_landmark"
//                                     value={formData.cor_landmark || ''}
//                                     readOnly
//                                     max={50}
//                                     validationType="EVERYTHING"
//                                 />
//                             </InputItem>
//                             <InputItem>
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label="Correspondence Country"
//                                     type="text"
//                                     name="cor_country"
//                                     value={formData.cor_country || ''}
//                                     readOnly
//                                     max={30}
//                                     validationType="ALPHABETS_AND_SPACE"
//                                 />
//                             </InputItem>
//                             <InputItem>
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label="Correspondence Pincode"
//                                     type="text"
//                                     name="cor_pincode"
//                                     value={formData.cor_pincode || ''}
//                                     readOnly
//                                     max={6}
//                                     validationType="NUMBER_ONLY"
//                                 />
//                             </InputItem>
//                         </InputRow>

//                         <InputRow>
//                             <InputItem>
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label="Correspondence City"
//                                     type="text"
//                                     name="cor_city"
//                                     value={formData.cor_city || ''}
//                                     readOnly
//                                     max={30}
//                                     validationType="ALPHABETS_AND_SPACE"
//                                 />
//                             </InputItem>
//                             <InputItem>
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label="Correspondence District"
//                                     type="text"
//                                     name="cor_district"
//                                     value={formData.cor_district || ''}
//                                     readOnly
//                                     max={30}
//                                     validationType="ALPHABETS_AND_SPACE"
//                                 />
//                             </InputItem>
//                             <InputItem>
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label="Correspondence State"
//                                     type="text"
//                                     name="cor_state"
//                                     value={formData.cor_state || ''}
//                                     readOnly
//                                     max={30}
//                                     validationType="ALPHABETS_AND_SPACE"
//                                 />
//                             </InputItem>
//                         </InputRow>
//                     </div>
//                 )}

//                 {/* Identity Documents */}
//                 <div className="section" style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
//                     <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Identity Documents</h2>

//                     <InputRow>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.adhar_card.label}
//                                 type="text"
//                                 name="adhar_card"
//                                 value={formData.adhar_card || ''}
//                                 readOnly
//                                 max={12}
//                                 validationType="NUMBER_ONLY"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.pannumber.label}
//                                 type="text"
//                                 name="pan_card"
//                                 value={formData.pan_card || ''}
//                                 readOnly
//                                 max={10}
//                                 validationType="PAN"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.passportno.label}
//                                 type="text"
//                                 name="passport"
//                                 value={formData.passport || ''}
//                                 readOnly
//                                 max={20}
//                                 validationType="ALPHANUMERIC"
//                             />
//                         </InputItem>
//                     </InputRow>

//                     <InputRow>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.drivinglicence.label}
//                                 type="text"
//                                 name="driving_license"
//                                 value={formData.driving_license || ''}
//                                 readOnly
//                                 max={20}
//                                 validationType="REGISTRATION_NO"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label={labels.voterid.label}
//                                 type="text"
//                                 name="voter_id"
//                                 value={formData.voter_id || ''}
//                                 readOnly
//                                 max={20}
//                                 validationType="REGISTRATION_NO"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             {/* Empty item to maintain layout */}
//                         </InputItem>
//                     </InputRow>
//                 </div>

//                 {/* Family Details */}
//                 <div className="section" style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
//                     <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Family Details</h2>

//                     <InputRow>
//                         <InputItem>
//                             <CommanSelect
//                                 onChange={handleChange}
//                                 label="Father's Prefix"
//                                 name="father_prefix_name"
//                                 value={formData.father_prefix_name || ''}
//                                 options={salutation}
//                                 readOnly
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Father's First Name"
//                                 type="text"
//                                 name="father_first_name"
//                                 value={formData.father_first_name || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Father's Middle Name"
//                                 type="text"
//                                 name="father_middle_name"
//                                 value={formData.father_middle_name || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                     </InputRow>

//                     <InputRow>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Father's Last Name"
//                                 type="text"
//                                 name="father_last_name"
//                                 value={formData.father_last_name || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanSelect
//                                 onChange={handleChange}
//                                 label="Mother's Prefix"
//                                 name="mother_prefix_name"
//                                 value={formData.mother_prefix_name || ''}
//                                 options={salutation}
//                                 readOnly
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Mother's First Name"
//                                 type="text"
//                                 name="mother_first_name"
//                                 value={formData.mother_first_name || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                     </InputRow>

//                     <InputRow>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Mother's Middle Name"
//                                 type="text"
//                                 name="mother_middle_name"
//                                 value={formData.mother_middle_name || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Mother's Last Name"
//                                 type="text"
//                                 name="mother_last_name"
//                                 value={formData.mother_last_name || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Birth Place"
//                                 type="text"
//                                 name="birth_place"
//                                 value={formData.birth_place || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                     </InputRow>

//                     <InputRow>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Birth Country"
//                                 type="text"
//                                 name="birth_country"
//                                 value={formData.birth_country || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             {/* Empty item to maintain layout */}
//                         </InputItem>
//                         <InputItem>
//                             {/* Empty item to maintain layout */}
//                         </InputItem>
//                     </InputRow>
//                 </div>

//                 {/* Occupation Details */}
//                 <div className="section" style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
//                     <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>Occupation Details</h2>

//                     <InputRow>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Occupation Type"
//                                 type="text"
//                                 name="occoupation_type"
//                                 value={formData.occoupation_type || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Occupation Name"
//                                 type="text"
//                                 name="occupation_name"
//                                 value={formData.occupation_name || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Salaried With"
//                                 type="text"
//                                 name="if_salaryed"
//                                 value={formData.if_salaryed || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                     </InputRow>

//                     <InputRow>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Designation"
//                                 type="text"
//                                 name="designation"
//                                 value={formData.designation || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Nature of Occupation"
//                                 type="text"
//                                 name="nature_of_occoupation"
//                                 value={formData.nature_of_occoupation || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Qualification"
//                                 type="text"
//                                 name="qualification"
//                                 value={formData.qualification || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                     </InputRow>

//                     <InputRow>
//                         <InputItem>
//                             <CommanInput
//                                 onChange={handleChange}
//                                 label="Annual Income"
//                                 type="text"
//                                 name="anual_income"
//                                 value={formData.anual_income || ''}
//                                 readOnly
//                                 max={50}
//                                 validationType="TEXT_ONLY"
//                             />
//                         </InputItem>
//                         <InputItem>
//                             {/* Empty item to maintain layout */}
//                         </InputItem>
//                         <InputItem>
//                             {/* Empty item to maintain layout */}
//                         </InputItem>
//                     </InputRow>
//                 </div>

//                 {/* File Uploads */}
//                 <div className="section" style={{ marginBottom: '24px', pageBreakInside: 'avoid' }}>
//                     <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>File Uploads</h2>

//                     <InputRow>
//                         <InputItem>
//                             <div>
//                                 <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Signature</label>
//                                 {formData.signature ? (
//                                     <img
//                                         src={typeof formData.signature === 'string' ? formData.signature : URL.createObjectURL(formData.signature)}
//                                         alt="Signature"
//                                         style={{ maxWidth: '100%', height: 'auto', maxHeight: '160px' }}
//                                     />
//                                 ) : (
//                                     <span>No signature uploaded</span>
//                                 )}
//                             </div>
//                         </InputItem>
//                         <InputItem>
//                             {/* Empty item to maintain layout */}
//                         </InputItem>
//                         <InputItem>
//                             {/* Empty item to maintain layout */}
//                         </InputItem>
//                     </InputRow>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ApplicationPdf;