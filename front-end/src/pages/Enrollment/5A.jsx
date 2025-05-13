import React, { useState } from 'react';
import FloatingInput from '../../components/FloatingInput';
import SelectInput from '../../components/SelectInput';
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
            <div className="grid md:grid-cols-4 gap-4">
                <FloatingInput label={labels.maidenPrefixName.label} name="maidenPrefixName" value={formData.maidenPrefixName || ''} onChange={handleChange} />
                <FloatingInput label={labels.maidenFirstName.label} name="maidenFirstName" value={formData.maidenFirstName || ''} onChange={handleChange} />
                <FloatingInput label={labels.maidenMiddleName.label} name="maidenMiddleName" value={formData.maidenMiddleName || ''} onChange={handleChange} />
                <FloatingInput label={labels.maidenLastName.label} name="maidenLastName" value={formData.maidenLastName || ''} onChange={handleChange} />

                <FloatingInput label={labels.fatherSpousePrefixName.label} name="fatherSpousePrefixName" value={formData.fatherSpousePrefixName || ''} onChange={handleChange} />
                <FloatingInput label={labels.fatherSpouseFirstName.label} name="fatherSpouseFirstName" value={formData.fatherSpouseFirstName || ''} onChange={handleChange} />
                <FloatingInput label={labels.fatherSpouseMiddleName.label} name="fatherSpouseMiddleName" value={formData.fatherSpouseMiddleName || ''} onChange={handleChange} />
                <FloatingInput label={labels.fatherSpouseLastName.label} name="fatherSpouseLastName" value={formData.fatherSpouseLastName || ''} onChange={handleChange} />

                <FloatingInput label={labels.motherPrefixName.label} name="motherPrefixName" value={formData.motherPrefixName || ''} onChange={handleChange} />
                <FloatingInput label={labels.motherFirstName.label} name="motherFirstName" value={formData.motherFirstName || ''} onChange={handleChange} />
                <FloatingInput label={labels.motherMiddleName.label} name="motherMiddleName" value={formData.motherMiddleName || ''} onChange={handleChange} />
                <FloatingInput label={labels.motherLastName.label} name="motherLastName" value={formData.motherLastName || ''} onChange={handleChange} />

                <FloatingInput label={labels.birthPlaceCity.label} name="birthPlaceCity" value={formData.birthPlaceCity || ''} onChange={handleChange} required />
                <FloatingInput label={labels.birthPlaceCountry.label} name="birthPlaceCountry" value={formData.birthPlaceCountry || ''} onChange={handleChange} required />
                <SelectInput label={labels.maritalStatus.label} name="maritalStatus" value={formData.maritalStatus || ''} onChange={handleChange} required options={maritalStatusOptions} />
                <FloatingInput label={labels.nationality.label} name="nationality" value={formData.nationality || ''} onChange={handleChange} required />
                <FloatingInput label={labels.religion.label} name="religion" value={formData.religion || ''} onChange={handleChange} required />
                <FloatingInput label={labels.caste.label} name="caste" value={formData.caste || ''} onChange={handleChange} required />
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Occupation Details</h2>
            <div className="grid md:grid-cols-4 gap-4">
                <FloatingInput label={labels.occupationType.label} name="occupationType" value={formData.occupationType || ''} onChange={handleChange} />
                <FloatingInput label={labels.businessName.label} name="businessName" value={formData.businessName || ''} onChange={handleChange} />
                <FloatingInput label={labels.salariedWith.label} name="salariedWith" value={formData.salariedWith || ''} onChange={handleChange} />
                <FloatingInput label={labels.designation.label} name="designation" value={formData.designation || ''} onChange={handleChange} />
                <FloatingInput label={labels.organisationNature.label} name="organisationNature" value={formData.organisationNature || ''} onChange={handleChange} />
                <FloatingInput label={labels.educationQualification.label} name="educationQualification" value={formData.educationQualification || ''} onChange={handleChange} />
                <FloatingInput label={labels.annualIncome.label} name="annualIncome" value={formData.annualIncome || ''} onChange={handleChange} />
                <FloatingInput label={labels.remark.label} name="remark" value={formData.remark || ''} onChange={handleChange} />
            </div>
        </div>

    );
}

export default PersonalOccupationForm;
