import React, { useState, useEffect } from 'react';
import { accountPersonalDetailsService } from '../../services/apiServices';
import CommanInput from '../../components/CommanInput';
import CommanSelect from '../../components/CommanSelect';
import { maritalStatusOptions } from '../../data/data';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
function PersonalOccupationForm({ formData, updateFormData, onBack, onNext }) {
    const [localFormData, setLocalFormData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({ ...prev, [name]: value }));
    };

    const submitpd = async () => {
        try {
            // Prepare the payload from localFormData
            const payload = {
                application_id: formData.application_id, // <-- Always include this!
                father_prefix_name: localFormData.fatherSpousePrefixName,
                father_first_name: localFormData.fatherSpouseFirstName,
                father_middle_name: localFormData.fatherSpouseMiddleName,
                father_last_name: localFormData.fatherSpouseLastName,
                mother_prefix_name: localFormData.motherPrefixName,
                mother_first_name: localFormData.motherFirstName,
                mother_middle_name: localFormData.motherMiddleName,
                mother_last_name: localFormData.motherLastName,
                birth_place: localFormData.birthPlaceCity,
                birth_country: localFormData.birthPlaceCountry,
                occoupation_type: localFormData.occupationType,
                occupation_name: localFormData.businessName,
                if_salaryed: localFormData.salariedWith,
                designation: localFormData.designation,
                nature_of_occoupation: localFormData.organisationNature,
                qualification: localFormData.educationQualification,
                anual_income: localFormData.annualIncome,
                remark: localFormData.remark,
                status: "APPROVED", // or get from form if needed
            };

            const response = await accountPersonalDetailsService.create(payload);

            Swal.fire({
                icon: 'success',
                title: response.data.message || 'Account personal details saved!',
                showConfirmButton: false,
                timer: 1500
            });

            // Optionally, call onNext() to go to the next step
            if (onNext) onNext();

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.message || 'Failed to save details'
            });
        }
    }
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


            <div className="flex justify-between mt-6 z-10" style={{ zIndex: '999' }}>
                <CommonButton onClick={onBack} variant="outlined">
                    Back
                </CommonButton>
                <CommonButton onClick={submitpd} variant="contained">
                    Save & Continue
                </CommonButton>
            </div>
        </div >
    );
}

export default PersonalOccupationForm;