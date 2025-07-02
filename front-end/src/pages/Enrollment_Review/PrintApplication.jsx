import React, { useState, useEffect } from 'react';
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
    const { toPDF, targetRef } = usePDF({ 
        filename: 'application-form.pdf',
        page: { 
            margin: 15,
            format: 'a4',
            orientation: 'portrait'
        }
    });

    const applicationId = localStorage.getItem('application_id');

    useEffect(() => {
        if (!applicationId) return;
        const fetchDetails = async () => {
            try {
                const response = await applicationDetailsService.getFullDetails(applicationId);
                if (response.data) {
                    const { application, personal_details, account_personal_details, application_addresss, customerdoc, customerpic } = response.data;
                    const address = Array.isArray(application_addresss) ? application_addresss[0] : application_addresss;
                    const signatureDoc = customerdoc?.find(doc =>
                        doc.document_type.toLowerCase().includes('signature')
                    );

                    setFormData({
                        application_id: applicationId,
                        // Authentication
                        auth_type: application?.auth_type,
                        auth_code: application?.auth_code,
                        status: application?.auth_status,

                        // Personal Info
                        salutation: personal_details?.salutation,
                        first_name: application?.first_name,
                        middle_name: application?.middle_name,
                        last_name: application?.last_name,
                        DOB: application?.DOB,
                        gender: application?.gender,
                        religion: personal_details?.religion,
                        caste: personal_details?.caste,
                        marital_status: personal_details?.marital_status,

                        // Contact
                        mobile: application?.mobile,
                        alt_mob_no: personal_details?.alt_mob_no,
                        email: personal_details?.email,

                        // Permanent Address
                        complex_name: application?.complex_name,
                        flat_no: application?.flat_no,
                        area: application?.area,
                        landmark: application?.landmark,
                        country: application?.country,
                        pincode: application?.pincode,
                        city: application?.city,
                        district: application?.district,
                        state: application?.state,

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

                        photo: customerpic?.[0]?.path ? `${daodocbase}${customerpic[0].path}` : workingman,
                        signature: signatureDoc?.file_path ? `${daodocbase}${signatureDoc.file_path}` : null,

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
                        
                        voteridoc: customerdoc?.find(doc => doc.document_type.includes('VOTER_ID_JPG'))
                            ? daodocbase + customerdoc.find(doc => doc.document_type.includes('VOTER_ID_JPG')).file_path
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
                        
                        signaturedoc: customerdoc?.find(doc => doc.document_type.includes('SIGNATURE_JPG'))
                            ? daodocbase + customerdoc.find(doc => doc.document_type.includes('SIGNATURE_JPG')).file_path
                            : "",
                         
                        // photo: customerpic?.length > 0 ? daodocbase + customerpic[0].path : ""
                    });
                }
            } catch (error) {
                console.error('Error fetching details:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error?.response?.data?.message || 'Failed to load application details'
                });
            }
        };
        fetchDetails();
    }, [applicationId]);

    const KeyValueRow = ({ label, value, emptyValue = 'N/A', width = '200px' }) => (
        <tr style={{ pageBreakInside: 'avoid' }}>
            <td style={{ 
                fontWeight: 'bold', 
                padding: '6px 0', 
                verticalAlign: 'top', 
                width,
                pageBreakInside: 'avoid' 
            }}>
                {label}:
            </td>
            <td style={{ 
                padding: '6px 0',
                pageBreakInside: 'avoid' 
            }}>
                {value || emptyValue}
            </td>
        </tr>
    );

    const Section = ({ title, children }) => (
        <div style={{ 
            marginBottom: '24px', 
            pageBreakInside: 'avoid',
            breakInside: 'avoid-page'
        }}>
            <h2 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                marginBottom: '12px', 
                borderBottom: '1px solid #ddd', 
                paddingBottom: '6px',
                color: '#10B981',
                pageBreakAfter: 'avoid'
            }}>
                {title}
            </h2>
            <div style={{ pageBreakInside: 'avoid' }}>
                {children}
            </div>
        </div>
    );

    return (
        <div className='print-tbl' style={{ 
            fontFamily: 'Arial, sans-serif', 
            maxWidth: '1000px', 
            margin: '0 auto', 
            padding: '20px',
            pageBreakInside: 'avoid'
        }}>
            {/* Print Styles */}
            <style>
                {`
                    @media print {
                        body, div, table, tr, td, th, h2 {
                            page-break-inside: avoid !important;
                        }
                        h2 {
                            page-break-after: avoid !important;
                        }
                        .print-tbl {
                            padding: 0 !important;
                        }
                    }
                `}
            </style>

            {/* Download Button */}
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <button
                    onClick={() => toPDF()}
                    style={{
                        backgroundColor: '#10B981',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                    </svg>
                    Download PDF
                </button>
            </div>

            <div ref={targetRef} style={{ 
                backgroundColor: 'white', 
                padding: '30px', 
                borderRadius: '8px', 
                boxShadow: '0 0 10px rgba(0,0,0,0.05)',
                pageBreakInside: 'avoid'
            }}>
                {/* Header with Photo */}
                <div style={{ 
                    display: 'flex', 
                    marginBottom: '30px', 
                    alignItems: 'flex-start',
                    pageBreakInside: 'avoid'
                }}>
                    <img 
                        src={formData.photo} 
                        alt="Applicant" 
                        style={{ 
                            width: '150px', 
                            height: '150px', 
                            border: '2px solid #10B981', 
                            borderRadius: '4px',
                            objectFit: 'cover',
                            marginRight: '25px',
                            pageBreakInside: 'avoid'
                        }} 
                    />
                    <div style={{ flex: 1, pageBreakInside: 'avoid' }}>
                        <table style={{ width: '100%', pageBreakInside: 'avoid' }}>
                            <tbody>
                                <KeyValueRow 
                                    label="Name" 
                                    value={`${formData.first_name || ''} ${formData.middle_name || ''} ${formData.last_name || ''}`.trim()} 
                                    width="120px"
                                />
                                <KeyValueRow label="Application Number" value={formData.application_id} />
                                <KeyValueRow label="DOB" value={formData.DOB} />
                                <KeyValueRow label="Gender" value={formData.gender} />
                                <KeyValueRow label="Status" value={formData.status} />
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Personal Information */}
                <Section title="Personal Information">
                    <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse',
                        pageBreakInside: 'avoid'
                    }}>
                        <tbody>
                            <tr style={{ pageBreakInside: 'avoid' }}>
                                <td style={{ 
                                    width: '50%', 
                                    verticalAlign: 'top', 
                                    paddingRight: '20px',
                                    pageBreakInside: 'avoid'
                                }}>
                                    <table style={{ width: '100%', pageBreakInside: 'avoid' }}>
                                        <tbody>
                                            <KeyValueRow label={labels.salutation.label} value={formData.salutation} />
                                            <KeyValueRow label={labels.firstname.label} value={formData.first_name} />
                                            <KeyValueRow label={labels.middlename.label} value={formData.middle_name} />
                                            <KeyValueRow label={labels.lastname.label} value={formData.last_name} />
                                        </tbody>
                                    </table>
                                </td>
                                <td style={{ 
                                    verticalAlign: 'top',
                                    pageBreakInside: 'avoid'
                                }}>
                                    <table style={{ width: '100%', pageBreakInside: 'avoid' }}>
                                        <tbody>
                                            <KeyValueRow label={labels.dob.label} value={formData.DOB} />
                                            <KeyValueRow label={labels.gender.label} value={formData.gender} />
                                            <KeyValueRow label={labels.religion.label} value={formData.religion} />
                                            <KeyValueRow label={labels.caste.label} value={formData.caste} />
                                            <KeyValueRow label={labels.maritalStatus.label} value={formData.marital_status} />
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Section>

                {/* Contact Information */}
                <Section title="Contact Information">
                    <table style={{ 
                        width: '100%',
                        pageBreakInside: 'avoid'
                    }}>
                        <tbody>
                            <tr style={{ pageBreakInside: 'avoid' }}>
                                <td style={{ 
                                    width: '50%', 
                                    verticalAlign: 'top', 
                                    paddingRight: '20px',
                                    pageBreakInside: 'avoid'
                                }}>
                                    <KeyValueRow label={labels.mobile.label} value={formData.mobile} />
                                </td>
                                <td style={{ 
                                    verticalAlign: 'top',
                                    pageBreakInside: 'avoid'
                                }}>
                                    <KeyValueRow label={labels.alt_mob_no.label} value={formData.alt_mob_no} />
                                </td>
                            </tr>
                            <tr style={{ pageBreakInside: 'avoid' }}>
                                <td colSpan="2" style={{ pageBreakInside: 'avoid' }}>
                                    <KeyValueRow label={labels.email.label} value={formData.email} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Section>

                {/* Permanent Address */}
                <Section title="Permanent Address">
                    <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse',
                        pageBreakInside: 'avoid'
                    }}>
                        <tbody>
                            <tr style={{ pageBreakInside: 'avoid' }}>
                                <td style={{ 
                                    width: '50%', 
                                    verticalAlign: 'top', 
                                    paddingRight: '20px',
                                    pageBreakInside: 'avoid'
                                }}>
                                    <KeyValueRow label={labels.complexname.label} value={formData.complex_name} />
                                    <KeyValueRow label={labels.roomno.label} value={formData.flat_no} />
                                    <KeyValueRow label={labels.area.label} value={formData.area} />
                                    <KeyValueRow label={labels.landmark.label} value={formData.landmark} />
                                </td>
                                <td style={{ 
                                    verticalAlign: 'top',
                                    pageBreakInside: 'avoid'
                                }}>
                                    <KeyValueRow label={labels.country.label} value={formData.country} />
                                    <KeyValueRow label={labels.pincode.label} value={formData.pincode} />
                                    <KeyValueRow label={labels.city.label} value={formData.city} />
                                    <KeyValueRow label={labels.district.label} value={formData.district} />
                                    <KeyValueRow label={labels.state.label} value={formData.state} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Section>

                {/* Correspondence Address */}
                {formData.per_complex_name && (
                    <Section title="Correspondence Address">
                        <table style={{ 
                            width: '100%', 
                            borderCollapse: 'collapse',
                            pageBreakInside: 'avoid'
                        }}>
                            <tbody>
                                <tr style={{ pageBreakInside: 'avoid' }}>
                                    <td style={{ 
                                        width: '50%', 
                                        verticalAlign: 'top', 
                                        paddingRight: '20px',
                                        pageBreakInside: 'avoid'
                                    }}>
                                        <KeyValueRow label="Complex Name" value={formData.per_complex_name} />
                                        <KeyValueRow label="Flat No" value={formData.cor_flat_no} />
                                        <KeyValueRow label="Area" value={formData.cor_area} />
                                        <KeyValueRow label="Landmark" value={formData.cor_landmark} />
                                    </td>
                                    <td style={{ 
                                        verticalAlign: 'top',
                                        pageBreakInside: 'avoid'
                                    }}>
                                        <KeyValueRow label="Country" value={formData.cor_country} />
                                        <KeyValueRow label="Pincode" value={formData.cor_pincode} />
                                        <KeyValueRow label="City" value={formData.cor_city} />
                                        <KeyValueRow label="District" value={formData.cor_district} />
                                        <KeyValueRow label="State" value={formData.cor_state} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Section>
                )}

                {/* Identity Documents */}
                <Section title="Identity Documents">
                    <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse',
                        pageBreakInside: 'avoid'
                    }}>
                        <tbody>
                            <tr style={{ pageBreakInside: 'avoid' }}>
                                <td style={{ 
                                    width: '50%', 
                                    verticalAlign: 'top', 
                                    paddingRight: '20px',
                                    pageBreakInside: 'avoid'
                                }}>
                                    <KeyValueRow label={labels.adhar_card.label} value={formData.adhar_card} />
                                    <KeyValueRow label={labels.pannumber.label} value={formData.pan_card} />
                                </td>
                                <td style={{ 
                                    verticalAlign: 'top',
                                    pageBreakInside: 'avoid'
                                }}>
                                    <KeyValueRow label={labels.passportno.label} value={formData.passport} />
                                    <KeyValueRow label={labels.drivinglicence.label} value={formData.driving_license} />
                                    <KeyValueRow label={labels.voterid.label} value={formData.voter_id} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Section>

                {/* Occupation Details */}
                <Section title="Occupation Details">
                    <div style={{ pageBreakInside: 'avoid' }}>
                        <table style={{ 
                            width: '100%', 
                            borderCollapse: 'collapse',
                            pageBreakInside: 'avoid'
                        }}>
                            <tbody>
                                <tr style={{ pageBreakInside: 'avoid' }}>
                                    <td style={{ 
                                        width: '50%', 
                                        verticalAlign: 'top', 
                                        paddingRight: '20px',
                                        pageBreakInside: 'avoid'
                                    }}>
                                        <KeyValueRow label="Occupation Type" value={formData.occoupation_type} />
                                        <KeyValueRow label="Occupation Name" value={formData.occupation_name} />
                                        <KeyValueRow label="Salaried With" value={formData.if_salaryed} />
                                    </td>
                                    <td style={{ 
                                        verticalAlign: 'top',
                                        pageBreakInside: 'avoid'
                                    }}>
                                        <KeyValueRow label="Designation" value={formData.designation} />
                                        <KeyValueRow label="Nature of Occupation" value={formData.nature_of_occoupation} />
                                        <KeyValueRow label="Qualification" value={formData.qualification} />
                                    </td>
                                </tr>
                                <tr style={{ pageBreakInside: 'avoid' }}>
                                    <td colSpan="2" style={{ pageBreakInside: 'avoid' }}>
                                        <KeyValueRow label="Annual Income" value={formData.anual_income} />
                                        <KeyValueRow label="Remark" value={formData.remark} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Section>

                {/* Signature */}
                {formData.signature && (
                    <Section title="Signature">
                        <div style={{ 
                            textAlign: 'center', 
                            marginTop: '20px',
                            pageBreakInside: 'avoid'
                        }}>
                            <img 
                                src={formData.signature} 
                                alt="Signature" 
                                style={{ 
                                    maxWidth: '300px', 
                                    maxHeight: '100px', 
                                    border: '1px solid #ddd',
                                    objectFit: 'contain',
                                    pageBreakInside: 'avoid'
                                }} 
                            />
                        </div>
                    </Section>
                )}

                {/* File Uploads */}
                <Section title="Supporting Documents">
                    <div style={{ pageBreakInside: 'avoid' }}>
                        <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-3 gap-5 mb-6">
                            {formData.passportdoc && (
                                <div style={{ pageBreakInside: 'avoid' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Passport</p>
                                    <img
                                        src={typeof formData.passportdoc === 'string' ? formData.passportdoc : URL.createObjectURL(formData.passportdoc)}
                                        alt="Passport"
                                        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', pageBreakInside: 'avoid' }}
                                    />
                                </div>
                            )}
                            
                            {formData.aadhaarFrontdoc && (
                                <div style={{ pageBreakInside: 'avoid' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Aadhaar Front</p>
                                    <img
                                        src={typeof formData.aadhaarFrontdoc === 'string' ? formData.aadhaarFrontdoc : URL.createObjectURL(formData.aadhaarFrontdoc)}
                                        alt="Aadhaar Front"
                                        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', pageBreakInside: 'avoid' }}
                                    />
                                </div>
                            )}
                            
                            {formData.aadhaarBackdoc && (
                                <div style={{ pageBreakInside: 'avoid' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Aadhaar Back</p>
                                    <img
                                        src={typeof formData.aadhaarBackdoc === 'string' ? formData.aadhaarBackdoc : URL.createObjectURL(formData.aadhaarBackdoc)}
                                        alt="Aadhaar Back"
                                        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', pageBreakInside: 'avoid' }}
                                    />
                                </div>
                            )}
                            
                            {formData.pancarddoc && (
                                <div style={{ pageBreakInside: 'avoid' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>PAN Card</p>
                                    <img
                                        src={typeof formData.pancarddoc === 'string' ? formData.pancarddoc : URL.createObjectURL(formData.pancarddoc)}
                                        alt="PAN"
                                        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', pageBreakInside: 'avoid' }}
                                    />
                                </div>
                            )}
                            
                            {formData.voteridoc && (
                                <div style={{ pageBreakInside: 'avoid' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Voter ID</p>
                                    <img
                                        src={typeof formData.voteridoc === 'string' ? formData.voteridoc : URL.createObjectURL(formData.voteridoc)}
                                        alt="Voter ID"
                                        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', pageBreakInside: 'avoid' }}
                                    />
                                </div>
                            )}
                            
                            {formData.drivinglicensedoc && (
                                <div style={{ pageBreakInside: 'avoid' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Driving License</p>
                                    <img
                                        src={typeof formData.drivinglicensedoc === 'string' ? formData.drivinglicensedoc : URL.createObjectURL(formData.drivinglicensedoc)}
                                        alt="Driving License"
                                        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', pageBreakInside: 'avoid' }}
                                    />
                                </div>
                            )}
                            
                            {formData.utilitybilldoc && (
                                <div style={{ pageBreakInside: 'avoid' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Utility Bill</p>
                                    <img
                                        src={typeof formData.utilitybilldoc === 'string' ? formData.utilitybilldoc : URL.createObjectURL(formData.utilitybilldoc)}
                                        alt="Utility Bill"
                                        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', pageBreakInside: 'avoid' }}
                                    />
                                </div>
                            )}
                            
                            {formData.rentagreementdoc && (
                                <div style={{ pageBreakInside: 'avoid' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Rent Agreement</p>
                                    <img
                                        src={typeof formData.rentagreementdoc === 'string' ? formData.rentagreementdoc : URL.createObjectURL(formData.rentagreementdoc)}
                                        alt="Rent Agreement"
                                        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', pageBreakInside: 'avoid' }}
                                    />
                                </div>
                            )}
                            
                            {formData.propertytaxdoc && (
                                <div style={{ pageBreakInside: 'avoid' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Property Tax Receipt</p>
                                    <img
                                        src={typeof formData.propertytaxdoc === 'string' ? formData.propertytaxdoc : URL.createObjectURL(formData.propertytaxdoc)}
                                        alt="Property Tax Receipt"
                                        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', pageBreakInside: 'avoid' }}
                                    />
                                </div>
                            )}
                            
                            {formData.bankstatementdoc && (
                                <div style={{ pageBreakInside: 'avoid' }}>
                                    <p style={{ fontWeight: 'bold', marginBottom: '4px' }}>Bank Statement</p>
                                    <img
                                        src={typeof formData.bankstatementdoc === 'string' ? formData.bankstatementdoc : URL.createObjectURL(formData.bankstatementdoc)}
                                        alt="Bank Statement"
                                        style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', pageBreakInside: 'avoid' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </Section>
            </div>
        </div>
    );
};

export default ApplicationPdf;










 