import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import CommanSelect from '../../components/CommanSelect';
import { maritalStatusOptions } from '../../data/data';
import labels from '../../components/labels'; // Adjust the path as needed

import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { pendingAccountData } from '../../services/apiServices';

function PersonalOccupationForm() {
    const [formData, setFormData] = useState({
        // Maiden Name Details
        maidenPrefixName: '',
        maidenFirstName: '',
        maidenMiddleName: '',
        maidenLastName: '',

        // Father/Spouse Name Details
        fatherSpousePrefixName: '',
        fatherSpouseFirstName: '',
        fatherSpouseMiddleName: '',
        fatherSpouseLastName: '',

        // Mother Name Details
        motherPrefixName: '',
        motherFirstName: '',
        motherMiddleName: '',
        motherLastName: '',

        // Birth Details
        birthPlaceCity: '',
        birthPlaceCountry: '',

        // Other Personal Details
        maritalStatus: '',
        nationality: '',
        religion: '',
        caste: '',

        // Occupation Details
        occupationType: '',
        businessName: '',
        salariedWith: '',
        designation: '',
        organisationNature: '',
        educationQualification: '',
        annualIncome: '',
        remark: ''
    });


    const { id } = useParams();

    useEffect(() => {
        const fetchAndStoreDetails = async () => {
            try {
                // alert('called')
                if (id) {
                    const response = await pendingAccountData.getDetailsS5A(id);
                    // localStorage.setItem('applicationDetails', JSON.stringify(response));
                    // console.log('%A :', response.data.documents[0]);
                    const application = response.data.documents[0] || {};
                    // const personal = response?.data?.personal_details || {};

                    setFormData({
                        // Maiden Name Details
                        maidenPrefixName: application.maiden_prefix || 'hi',
                        maidenFirstName: application.maiden_first_name || '',
                        maidenMiddleName: application.maiden_middle_name || '',
                        maidenLastName: application.maiden_last_name || '',

                        // Father/Spouse Name Details
                        fatherSpousePrefixName: application.father_prefix_name || '',
                        fatherSpouseFirstName: application.father_first_name || '',
                        fatherSpouseMiddleName: application.father_middle_name || '',
                        fatherSpouseLastName: application.father_last_name || '',

                        // Mother Name Details
                        motherPrefixName: application.mother_prefix_name || '',
                        motherFirstName: application.mother_first_name || '',
                        motherMiddleName: application.mother_middle_name || '',
                        motherLastName: application.mother_last_name || '',

                        // Birth Details
                        birthPlaceCity: application.birth_place || '',
                        birthPlaceCountry: application.birth_country || '',

                        // Other Personal Details
                        maritalStatus: application.marital_status || '',
                        nationality: application.nationality || '',
                        religion: application.religion || '',
                        caste: application.caste || '',

                        // Occupation Details
                        occupationType: application.occoupation_type || '',
                        businessName: application.occupation_name || '',
                        salariedWith: application.if_salaryed || '',
                        designation: application.designation || '',
                        organisationNature: application.nature_of_occoupation || '',
                        educationQualification: application.qualification || '',
                        annualIncome: application.anual_income || '',
                        remark: application.remark || ''
                    });
                    // alert(localFormData.photo);
                }
            } catch (error) {
                console.error('Failed to fetch application details:', error);
            }
        };

        fetchAndStoreDetails();
    }, [id]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="max-w-screen-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-5">
                <CommanInput label={labels.maidenPrefixName.label} name="maidenPrefixName" value={formData.maidenPrefixName || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.maidenFirstName.label} name="maidenFirstName" value={formData.maidenFirstName || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.maidenMiddleName.label} name="maidenMiddleName" value={formData.maidenMiddleName || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.maidenLastName.label} name="maidenLastName" value={formData.maidenLastName || ''} onChange={handleChange} readOnly={true} />

                <CommanInput label={labels.fatherSpousePrefixName.label} name="fatherSpousePrefixName" value={formData.fatherSpousePrefixName || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.fatherSpouseFirstName.label} name="fatherSpouseFirstName" value={formData.fatherSpouseFirstName || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.fatherSpouseMiddleName.label} name="fatherSpouseMiddleName" value={formData.fatherSpouseMiddleName || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.fatherSpouseLastName.label} name="fatherSpouseLastName" value={formData.fatherSpouseLastName || ''} onChange={handleChange} readOnly={true} />

                <CommanInput label={labels.motherPrefixName.label} name="motherPrefixName" value={formData.motherPrefixName || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.motherFirstName.label} name="motherFirstName" value={formData.motherFirstName || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.motherMiddleName.label} name="motherMiddleName" value={formData.motherMiddleName || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.motherLastName.label} name="motherLastName" value={formData.motherLastName || ''} onChange={handleChange} readOnly={true} />

                <CommanInput label={labels.birthPlaceCity.label} name="birthPlaceCity" value={formData.birthPlaceCity || ''} onChange={handleChange} required readOnly={true} />
                <CommanInput label={labels.birthPlaceCountry.label} name="birthPlaceCountry" value={formData.birthPlaceCountry || ''} onChange={handleChange} required readOnly={true} />
                <CommanSelect label={labels.maritalStatus.label} name="maritalStatus" value={formData.maritalStatus || ''} onChange={handleChange} required options={maritalStatusOptions} readOnly={true} />
                <CommanInput label={labels.nationality.label} name="nationality" value={formData.nationality || ''} onChange={handleChange} required readOnly={true} />
                <CommanInput label={labels.religion.label} name="religion" value={formData.religion || ''} onChange={handleChange} required readOnly={true} />
                <CommanInput label={labels.caste.label} name="caste" value={formData.caste || ''} onChange={handleChange} required readOnly={true} />
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Occupation Details</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-5">
                <CommanInput label={labels.occupationType.label} name="occupationType" value={formData.occupationType || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.businessName.label} name="businessName" value={formData.businessName || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.salariedWith.label} name="salariedWith" value={formData.salariedWith || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.designation.label} name="designation" value={formData.designation || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.organisationNature.label} name="organisationNature" value={formData.organisationNature || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.educationQualification.label} name="educationQualification" value={formData.educationQualification || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.annualIncome.label} name="annualIncome" value={formData.annualIncome || ''} onChange={handleChange} readOnly={true} />
                <CommanInput label={labels.remark.label} name="remark" value={formData.remark || ''} onChange={handleChange} readOnly={true} />
            </div>
        </div>

    );
}

export default PersonalOccupationForm;
