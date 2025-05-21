import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import CommanSelect from '../../components/CommanSelect';
import { maritalStatusOptions } from '../../data/data';
import labels from '../../components/labels';

function PersonalOccupationForm({ formData, updateFormData }) {
    const [localFormData, setLocalFormData] = useState({
        maidenPrefixName: formData.personalDetailsf5?.maidenPrefixName || '',
        maidenFirstName: formData.personalDetailsf5?.maidenFirstName || '',
        maidenMiddleName: formData.personalDetailsf5?.maidenMiddleName || '',
        maidenLastName: formData.personalDetailsf5?.maidenLastName || '',

        fatherSpousePrefixName: formData.personalDetailsf5?.fatherSpousePrefixName || '',
        fatherSpouseFirstName: formData.personalDetailsf5?.fatherSpouseFirstName || '',
        fatherSpouseMiddleName: formData.personalDetailsf5?.fatherSpouseMiddleName || '',
        fatherSpouseLastName: formData.personalDetailsf5?.fatherSpouseLastName || '',

        motherPrefixName: formData.personalDetailsf5?.motherPrefixName || '',
        motherFirstName: formData.personalDetailsf5?.motherFirstName || '',
        motherMiddleName: formData.personalDetailsf5?.motherMiddleName || '',
        motherLastName: formData.personalDetailsf5?.motherLastName || '',

        birthPlaceCity: formData.personalDetailsf5?.birthPlaceCity || '',
        birthPlaceCountry: formData.personalDetailsf5?.birthPlaceCountry || '',
        maritalStatus: formData.personalDetailsf5?.maritalStatus || '',
        nationality: formData.personalDetailsf5?.nationality || '',
        religion: formData.personalDetailsf5?.religion || '',
        caste: formData.personalDetailsf5?.caste || '',

        occupationType: formData.personalDetailsf5?.occupationType || '',
        businessName: formData.personalDetailsf5?.businessName || '',
        salariedWith: formData.personalDetailsf5?.salariedWith || '',
        designation: formData.personalDetailsf5?.designation || '',
        organisationNature: formData.personalDetailsf5?.organisationNature || '',
        educationQualification: formData.personalDetailsf5?.educationQualification || '',
        annualIncome: formData.personalDetailsf5?.annualIncome || '',
        remark: formData.personalDetailsf5?.remark || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        updateFormData({
            ...formData,
            personalDetailsf5: localFormData
        });
    }, [localFormData]);

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