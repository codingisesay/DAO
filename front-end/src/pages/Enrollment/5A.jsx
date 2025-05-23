import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import CommanSelect from '../../components/CommanSelect';
import { maritalStatusOptions } from '../../data/data';
import labels from '../../components/labels';

function PersonalOccupationForm({ formData, updateFormData }) {
    const [localFormData, setLocalFormData] = useState({
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
        birthPlaceCountry: '',
        maritalStatus: '',
        nationality: '',
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({ ...prev, [name]: value }));
    };

    // useEffect(() => {
    //     updateFormData({
    //         ...formData,
    //         personalDetails: localFormData
    //     });
    // }, [localFormData]);

    return (
        <div className="max-w-screen-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
                <CommanInput label={labels.maidenPrefixName.label} name="maidenPrefixName" value={localFormData.maidenPrefixName} onChange={handleChange} />
                <CommanInput label={labels.maidenFirstName.label} name="maidenFirstName" value={localFormData.maidenFirstName} onChange={handleChange} />
                <CommanInput label={labels.maidenMiddleName.label} name="maidenMiddleName" value={localFormData.maidenMiddleName} onChange={handleChange} />
                <CommanInput label={labels.maidenLastName.label} name="maidenLastName" value={localFormData.maidenLastName} onChange={handleChange} />

                <CommanInput label={labels.fatherSpousePrefixName.label} name="fatherSpousePrefixName" value={localFormData.fatherSpousePrefixName} onChange={handleChange} />
                <CommanInput label={labels.fatherSpouseFirstName.label} name="fatherSpouseFirstName" value={localFormData.fatherSpouseFirstName} onChange={handleChange} />
                <CommanInput label={labels.fatherSpouseMiddleName.label} name="fatherSpouseMiddleName" value={localFormData.fatherSpouseMiddleName} onChange={handleChange} />
                <CommanInput label={labels.fatherSpouseLastName.label} name="fatherSpouseLastName" value={localFormData.fatherSpouseLastName} onChange={handleChange} />

                <CommanInput label={labels.motherPrefixName.label} name="motherPrefixName" value={localFormData.motherPrefixName} onChange={handleChange} />
                <CommanInput label={labels.motherFirstName.label} name="motherFirstName" value={localFormData.motherFirstName} onChange={handleChange} />
                <CommanInput label={labels.motherMiddleName.label} name="motherMiddleName" value={localFormData.motherMiddleName} onChange={handleChange} />
                <CommanInput label={labels.motherLastName.label} name="motherLastName" value={localFormData.motherLastName} onChange={handleChange} />

                <CommanInput label={labels.birthPlaceCity.label} name="birthPlaceCity" value={localFormData.birthPlaceCity} onChange={handleChange} required />
                <CommanInput label={labels.birthPlaceCountry.label} name="birthPlaceCountry" value={localFormData.birthPlaceCountry} onChange={handleChange} required />
                <CommanSelect label={labels.maritalStatus.label} name="maritalStatus" value={localFormData.maritalStatus} onChange={handleChange} required options={maritalStatusOptions} />
                <CommanInput label={labels.nationality.label} name="nationality" value={localFormData.nationality} onChange={handleChange} required />
                <CommanInput label={labels.religion.label} name="religion" value={localFormData.religion} onChange={handleChange} required />
                <CommanInput label={labels.caste.label} name="caste" value={localFormData.caste} onChange={handleChange} required />
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Occupation Details</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
                <CommanInput label={labels.occupationType.label} name="occupationType" value={localFormData.occupationType} onChange={handleChange} />
                <CommanInput label={labels.businessName.label} name="businessName" value={localFormData.businessName} onChange={handleChange} />
                <CommanInput label={labels.salariedWith.label} name="salariedWith" value={localFormData.salariedWith} onChange={handleChange} />
                <CommanInput label={labels.designation.label} name="designation" value={localFormData.designation} onChange={handleChange} />
                <CommanInput label={labels.organisationNature.label} name="organisationNature" value={localFormData.organisationNature} onChange={handleChange} />
                <CommanInput label={labels.educationQualification.label} name="educationQualification" value={localFormData.educationQualification} onChange={handleChange} />
                <CommanInput label={labels.annualIncome.label} name="annualIncome" value={localFormData.annualIncome} onChange={handleChange} />
                <CommanInput label={labels.remark.label} name="remark" value={localFormData.remark} onChange={handleChange} />
            </div>
        </div>
    );
}

export default PersonalOccupationForm;