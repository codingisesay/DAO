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
                    const { application, personal_details, account_personal_details, application_addresss, customerdoc, customerpic } = response.data;
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
                                <KeyValueRow label="Complex Name" value={formData.per_complex_name} />
                                <KeyValueRow label="Flat No" value={formData.cor_flat_no} />
                                <KeyValueRow label="Area" value={formData.cor_area} />
                                <KeyValueRow label="Landmark" value={formData.cor_landmark} />
                            </Column>
                            <Column>
                                <KeyValueRow label="Country" value={formData.cor_country} />
                                <KeyValueRow label="Pincode" value={formData.cor_pincode} />
                                <KeyValueRow label="City" value={formData.cor_city} />
                                <KeyValueRow label="District" value={formData.cor_district} />
                                <KeyValueRow label="State" value={formData.cor_state} />
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








 