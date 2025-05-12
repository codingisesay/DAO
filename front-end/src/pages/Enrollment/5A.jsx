import React, { useState } from 'react';
import FloatingInput from '../../components/FloatingInput';
import SelectInput from '../../components/SelectInput';
import { maritalStatusOptions } from '../../data/data';
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
                <FloatingInput label="Maiden Prefix Name" name="maidenPrefixName" value={formData.maidenPrefixName || ''} onChange={handleChange} />
                <FloatingInput label="Maiden First Name" name="maidenFirstName" value={formData.maidenFirstName || ''} onChange={handleChange} />
                <FloatingInput label="Maiden Middle Name" name="maidenMiddleName" value={formData.maidenMiddleName || ''} onChange={handleChange} />
                <FloatingInput label="Maiden Last Name" name="maidenLastName" value={formData.maidenLastName || ''} onChange={handleChange} />

                <FloatingInput label="Father Prefix Name" name="fatherSpousePrefixName" value={formData.fatherSpousePrefixName || ''} onChange={handleChange} />
                <FloatingInput label="Father First Name" name="fatherSpouseFirstName" value={formData.fatherSpouseFirstName || ''} onChange={handleChange} />
                <FloatingInput label="Father Middle Name" name="fatherSpouseMiddleName" value={formData.fatherSpouseMiddleName || ''} onChange={handleChange} />
                <FloatingInput label="Father Last Name" name="fatherSpouseLastName" value={formData.fatherSpouseLastName || ''} onChange={handleChange} />

                <FloatingInput label="Mother Prefix Name" name="motherPrefixName" value={formData.motherPrefixName || ''} onChange={handleChange} />
                <FloatingInput label="Mother First Name" name="motherFirstName" value={formData.motherFirstName || ''} onChange={handleChange} />
                <FloatingInput label="Mother Middle Name" name="motherMiddleName" value={formData.motherMiddleName || ''} onChange={handleChange} />
                <FloatingInput label="Mother Last Name" name="motherLastName" value={formData.motherLastName || ''} onChange={handleChange} />

                <FloatingInput label="Birth Place City" name="birthPlaceCity" value={formData.birthPlaceCity || ''} onChange={handleChange} required />
                <FloatingInput label="Birth Place Country" name="birthPlaceCountry" value={formData.birthPlaceCountry || ''} onChange={handleChange} required />
                <SelectInput
                    label="Marital Status"
                    name="maritalStatus"
                    value={formData.maritalStatus || ''}
                    onChange={handleChange}
                    required
                    options={maritalStatusOptions}
                />
                <FloatingInput label="Nationality" name="nationality" value={formData.nationality || ''} onChange={handleChange} required />
                <FloatingInput label="Religion" name="religion" value={formData.religion || ''} onChange={handleChange} required />
                <FloatingInput label="Caste" name="caste" value={formData.caste || ''} onChange={handleChange} required />
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Occupation Details</h2>
            <div className="grid md:grid-cols-4 gap-4">
                <FloatingInput label="Occupation Type" name="occupationType" value={formData.occupationType || ''} onChange={handleChange} />
                <FloatingInput label="If Business - Name of the Firm" name="businessName" value={formData.businessName || ''} onChange={handleChange} />
                <FloatingInput label="If Salaried employed with" name="salariedWith" value={formData.salariedWith || ''} onChange={handleChange} />
                <FloatingInput label="Designation" name="designation" value={formData.designation || ''} onChange={handleChange} />
                <FloatingInput label="Nature Of Organisation" name="organisationNature" value={formData.organisationNature || ''} onChange={handleChange} />
                <FloatingInput label="Education Qualification" name="educationQualification" value={formData.educationQualification || ''} onChange={handleChange} />
                <FloatingInput label="Annual Income" name="annualIncome" value={formData.annualIncome || ''} onChange={handleChange} />
                <FloatingInput label="Remark" name="remark" value={formData.remark || ''} onChange={handleChange} />
            </div>


        </div>
    );
}

export default PersonalOccupationForm;
