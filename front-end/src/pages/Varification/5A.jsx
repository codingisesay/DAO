import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import CommanSelect from '../../components/CommanSelect';
import { maritalStatusOptions } from '../../data/data';
import labels from '../../components/labels'; // Adjust the path as needed

function PersonalOccupationForm() {
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div className="max-w-screen-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
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
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
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
