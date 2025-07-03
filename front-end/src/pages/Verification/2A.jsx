import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import { useParams } from 'react-router-dom';
import { salutation, gender, religion, caste } from '../../data/data';

import { pendingAccountData } from '../../services/apiServices';


function PersonalDetailsForm({ formData, updateFormData, }) {
    const { id } = useParams();
  const [localFormData, setLocalFormData] = useState({
        salutation: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        DOB: '',
        gender: '',
        mobile: '',
        alt_mob_no: '',
        email: '',
        religion: '',
        caste: '',
        marital_status: '', 
        adhar_card: '',
        pan_card: '',
        passport: '',
        driving_license: '',
        voter_id: '',
        application_no: '',
        auth_type: '',
        auth_code: '',
        auth_status: '',
        agent_id: '',
        admin_id: ''
    });

    useEffect(() => {
        const fetchAndStoreDetails = async () => {
            try {
                // alert('called')
                if (id) {
                    const response = await pendingAccountData.getDetailsS2A(id);
                    // localStorage.setItem('applicationDetails', JSON.stringify(response));
                    // console.log('got data :', response.data.details);
                    const application = response.details || {};
                    // const personal = response?.data?.personal_details || {};
 setLocalFormData({
                        salutation: application.salutation || '',
                        first_name: application.first_name || '',
                        middle_name: application.middle_name || '',
                        last_name: application.last_name || '',
                        DOB: application.DOB || '',
                        gender: application.gender || '',
                        mobile: application.mobile || '',
                        alt_mob_no: application.alt_mob_no || '',
                        email: application.email || '',
                        religion: application.religion || '',
                        caste: application.caste || '',
                        marital_status: application.marital_status || '',
                        adhar_card: application.adhar_card || '',
                        pan_card: application.pan_card || '',
                        passport: application.passport || '',
                        driving_license: application.driving_license || '',
                        voter_id: application.voter_id || '',
                        application_no: application.application_no || '',
                        auth_type: application.auth_type || '',
                        auth_code: application.auth_code || '',
                        auth_status: application.auth_status || '',
                        agent_id: application.agent_id || '',
                        admin_id: application.admin_id || ''
                    });
                }
            } catch (error) {
                console.error('Failed to fetch application details:', error);
            }
        };

        fetchAndStoreDetails();
    }, [id]);







    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        updateFormData({
            personalDetails: {
                ...localFormData
            }
        });
        onNext();
    };

    return (
        <div className="personal-details-form">
            <h2 className="text-xl font-bold mb-2">Personal Details</h2>
  <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
                {/* Personal Information */}
        
                <CommanInput
                    label={labels.salutation.label}
                    name="salutation"
                    value={localFormData.salutation}
                    readOnly={true}
                />
                <CommanInput
                    label={labels.firstname.label}
                    type="text"
                    name="first_name"
                    value={localFormData.first_name}
                    readOnly={true}
                />
                <CommanInput
                    label={labels.middlename.label}
                    type="text"
                    name="middle_name"
                    value={localFormData.middle_name}
                    readOnly={true}
                />
                <CommanInput
                    label={labels.lastname.label}
                    type="text"
                    name="last_name"
                    value={localFormData.last_name}
                    readOnly={true}
                />
                <CommanInput
                    label={labels.dob.label}
                    type="date"
                    name="DOB"
                    value={localFormData.DOB}
                    readOnly={true}
                />
                <CommanInput
                    label={labels.gender.label}
                    type="text"
                    name="gender"
                    value={localFormData.gender}
                    readOnly={true}
                />
                <CommanInput
                    label="Religion"
                    type="text"
                    name="religion"
                    value={localFormData.religion}
                    readOnly={true}
                />
                <CommanInput
                    label="Caste"
                    type="text"
                    name="caste"
                    value={localFormData.caste}
                    readOnly={true}
                />
                <CommanInput
                    label="Marital Status"
                    type="text"
                    name="marital_status"
                    value={localFormData.marital_status}
                    readOnly={true}
                />

                {/* Contact Information */}
                <CommanInput
                    label={labels.mobile.label}
                    type="text"
                    name="mobile"
                    value={localFormData.mobile}
                    readOnly={true}
                />
                <CommanInput
                    label="Alternate Mobile"
                    type="text"
                    name="alt_mob_no"
                    value={localFormData.alt_mob_no}
                    readOnly={true}
                />
                <CommanInput
                    label="Email"
                    type="email"
                    name="email"
                    value={localFormData.email}
                    readOnly={true}
                />
  

                {/* Identity Documents */}
                <CommanInput
                    label="Aadhar Card"
                    type="text"
                    name="adhar_card"
                    value={localFormData.adhar_card}
                    readOnly={true}
                />
                <CommanInput
                    label="PAN Card"
                    type="text"
                    name="pan_card"
                    value={localFormData.pan_card}
                    readOnly={true}
                />
                <CommanInput
                    label="Passport"
                    type="text"
                    name="passport"
                    value={localFormData.passport}
                    readOnly={true}
                />
                <CommanInput
                    label="Driving License"
                    type="text"
                    name="driving_license"
                    value={localFormData.driving_license}
                    readOnly={true}
                />
                <CommanInput
                    label="Voter ID"
                    type="text"
                    name="voter_id"
                    value={localFormData.voter_id}
                    readOnly={true}
                />

       

 
            </div>


        </div>
    );
}

export default PersonalDetailsForm;