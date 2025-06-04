import React, { useState, useEffect } from 'react';
import { accountPersonalDetailsService } from '../../services/apiServices';
import CommanInput from '../../components/CommanInput';
import CommanSelect from '../../components/CommanSelect';
import { maritalStatusOptions } from '../../data/data';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { salutation, religion, caste, salaryrange } from '../../data/data';

function PersonalOccupationForm({ formData, updateFormData, onBack, onNext }) {
    const [localFormData, setLocalFormData] = useState({
        maidenPrefixName: formData.maidenPrefixName || '',
        maidenFirstName: formData.maidenFirstName || '',
        maidenMiddleName: formData.maidenMiddleName || '',
        maidenLastName: formData.maidenLastName || '',
        fatherSpousePrefixName: formData.fatherSpousePrefixName || '',
        fatherSpouseFirstName: formData.fatherSpouseFirstName || '',
        fatherSpouseMiddleName: formData.fatherSpouseMiddleName || '',
        fatherSpouseLastName: formData.fatherSpouseLastName || '',
        motherPrefixName: formData.motherPrefixName || '',
        motherFirstName: formData.motherFirstName || '',
        motherMiddleName: formData.motherMiddleName || '',
        motherLastName: formData.motherLastName || '',
        birthPlaceCity: formData.birthPlaceCity || '',
        birthPlaceCountry: formData.birthPlaceCountry || '',
        maritalStatus: formData.maritalStatus || '',
        nationality: formData.nationality || '',
        religion: formData.religion || '',
        caste: formData.caste || '',
        occupationType: formData.occupationType || '',
        businessName: formData.businessName || '',
        salariedWith: formData.salariedWith || '',
        designation: formData.designation || '',
        organisationNature: formData.organisationNature || '',
        educationQualification: formData.educationQualification || '',
        annualIncome: formData.annualIncome || '',
        remark: formData.remark || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedLocalFormData = { ...localFormData, [name]: value };

        setLocalFormData(updatedLocalFormData);
        updateFormData({
            ...formData,
            personalOccupation: updatedLocalFormData
        });
    };

    const submitpd = async () => {
        try {
            // Validate required fields before submission
            if (!localFormData.fatherSpousePrefixName ||
                !localFormData.fatherSpouseFirstName ||
                !localFormData.motherPrefixName ||
                !localFormData.motherFirstName ||
                !localFormData.birthPlaceCity ||
                !localFormData.birthPlaceCountry ||
                !localFormData.maritalStatus ||
                !localFormData.nationality ||
                !localFormData.religion ||
                !localFormData.caste) {
                throw new Error('Please fill all required fields');
            }

            const payload = {
                application_id: formData.application_id,
                maiden_prefix_name: localFormData.maidenPrefixName,
                maiden_first_name: localFormData.maidenFirstName,
                maiden_middle_name: localFormData.maidenMiddleName,
                maiden_last_name: localFormData.maidenLastName,

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
                status: "Pending",
            };
            console.log('nominie :', payload)
            const response = await accountPersonalDetailsService.create(payload);

            Swal.fire({
                icon: 'success',
                title: response.data.message || 'Account personal details saved!',
                showConfirmButton: false,
                timer: 1500
            });

            if (onNext) onNext();

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.message || error.message || 'Failed to save details'
            });
        }
    }

    return (
        <div className="max-w-screen-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
                {/* Maiden Name Section */}
                <CommanSelect
                    value={localFormData.maidenPrefixName}
                    label={labels.maidenPrefixName.label}
                    name="maidenPrefixName"
                    onChange={handleChange}
                    options={salutation}
                />
                <CommanInput
                    label={labels.maidenFirstName.label}
                    name="maidenFirstName"
                    value={localFormData.maidenFirstName}
                    onChange={handleChange}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.maidenMiddleName.label}
                    name="maidenMiddleName"
                    value={localFormData.maidenMiddleName}
                    onChange={handleChange}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.maidenLastName.label}
                    name="maidenLastName"
                    value={localFormData.maidenLastName}
                    onChange={handleChange}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />

                {/* Father/Spouse Section */}
                <CommanSelect
                    value={localFormData.fatherSpousePrefixName}
                    label={labels.fatherSpousePrefixName.label}
                    name="fatherSpousePrefixName"
                    onChange={handleChange}
                    options={salutation}
                />
                <CommanInput
                    label={labels.fatherSpouseFirstName.label}
                    name="fatherSpouseFirstName"
                    value={localFormData.fatherSpouseFirstName}
                    onChange={handleChange}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.fatherSpouseMiddleName.label}
                    name="fatherSpouseMiddleName"
                    value={localFormData.fatherSpouseMiddleName}
                    onChange={handleChange}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.fatherSpouseLastName.label}
                    name="fatherSpouseLastName"
                    value={localFormData.fatherSpouseLastName}
                    onChange={handleChange}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />

                {/* Mother Section */}
                <CommanSelect
                    label={labels.motherPrefixName.label}
                    name="motherPrefixName"
                    value={localFormData.motherPrefixName}
                    onChange={handleChange}
                    options={salutation}
                />
                <CommanInput
                    label={labels.motherFirstName.label}
                    name="motherFirstName"
                    value={localFormData.motherFirstName}
                    onChange={handleChange}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.motherMiddleName.label}
                    name="motherMiddleName"
                    value={localFormData.motherMiddleName}
                    onChange={handleChange}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.motherLastName.label}
                    name="motherLastName"
                    value={localFormData.motherLastName}
                    onChange={handleChange}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />

                {/* Birth and Personal Details */}
                <CommanInput
                    label={labels.birthPlaceCity.label}
                    name="birthPlaceCity"
                    value={localFormData.birthPlaceCity}
                    onChange={handleChange}
                    required
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.birthPlaceCountry.label}
                    name="birthPlaceCountry"
                    value={localFormData.birthPlaceCountry}
                    onChange={handleChange}
                    required
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanSelect
                    label={labels.maritalStatus.label}
                    name="maritalStatus"
                    value={localFormData.maritalStatus}
                    onChange={handleChange}
                    required
                    options={maritalStatusOptions}
                />
                <CommanInput
                    label={labels.nationality.label}
                    name="nationality"
                    value={localFormData.nationality}
                    onChange={handleChange}
                    required
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanSelect
                    label={labels.religion.label}
                    name="religion"
                    value={localFormData.religion}
                    onChange={handleChange}
                    required
                    options={religion}
                />
                <CommanSelect
                    label={labels.caste.label}
                    name="caste"
                    value={localFormData.caste}
                    onChange={handleChange}
                    required
                    options={caste}
                />
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">Occupation Details</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
                <CommanInput
                    label={labels.occupationType.label}
                    name="occupationType"
                    value={localFormData.occupationType}
                    onChange={handleChange}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.businessName.label}
                    name="businessName"
                    value={localFormData.businessName}
                    onChange={handleChange}
                    validationType="ALPHANUMERIC_AND_SPACE"
                    max={30}
                />
                <CommanInput
                    label={labels.salariedWith.label}
                    name="salariedWith"
                    value={localFormData.salariedWith}
                    onChange={handleChange}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.designation.label}
                    name="designation"
                    value={localFormData.designation}
                    onChange={handleChange}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.organisationNature.label}
                    name="organisationNature"
                    value={localFormData.organisationNature}
                    onChange={handleChange}
                    validationType="ALPHABETS_AND_SPACE"
                    max={30}
                />
                <CommanInput
                    label={labels.educationQualification.label}
                    name="educationQualification"
                    value={localFormData.educationQualification}
                    onChange={handleChange}
                    validationType="ALPHABETS_AND_SPACE"
                    max={30}
                />
                {/* <CommanInput
                    label={labels.annualIncome.label}
                    name="annualIncome"
                    value={localFormData.annualIncome}
                    onChange={handleChange}
                    validationType="DECIMAL"
                    max={15}
                /> */}

                <CommanSelect
                    label={labels.annualIncome.label}
                    name="annualIncome"
                    value={localFormData.annualIncome}
                    onChange={handleChange}
                    options={salaryrange}
                />
                <CommanInput
                    label={labels.remark.label}
                    name="remark"
                    value={localFormData.remark}
                    onChange={handleChange}
                    validationType="EVERYTHING"
                    max={200}
                />
            </div>

            <div className="next-back-btns z-10" >{/* z-10 */}
                <CommonButton onClick={onBack} variant="outlined" className="btn-back">
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton onClick={submitpd} variant="contained" className="btn-next">
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div>
        </div>
    );
}

export default PersonalOccupationForm;

// import React, { useState, useEffect } from 'react';
// import { accountPersonalDetailsService } from '../../services/apiServices';
// import CommanInput from '../../components/CommanInput';
// import CommanSelect from '../../components/CommanSelect';
// import { maritalStatusOptions } from '../../data/data';
// import labels from '../../components/labels';
// import CommonButton from '../../components/CommonButton';
// import Swal from 'sweetalert2';
// import { salutation } from '../../data/data';

// function PersonalOccupationForm({ formData, updateFormData, onBack, onNext }) {
//     const [localFormData, setLocalFormData] = useState({
//         maidenPrefixName: '',
//         maidenFirstName: '',
//         maidenMiddleName: '',
//         maidenLastName: '',
//         fatherSpousePrefixName: '',
//         fatherSpouseFirstName: '',
//         fatherSpouseMiddleName: '',
//         fatherSpouseLastName: '',
//         motherPrefixName: '',
//         motherFirstName: '',
//         motherMiddleName: '',
//         motherLastName: '',
//         birthPlaceCity: '',
//         birthPlaceCountry: '',
//         maritalStatus: '',
//         nationality: '',
//         religion: '',
//         caste: '',
//         occupationType: '',
//         businessName: '',
//         salariedWith: '',
//         designation: '',
//         organisationNature: '',
//         educationQualification: '',
//         annualIncome: '',
//         remark: ''
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setLocalFormData(prev => ({ ...prev, [name]: value }));
//     };

//     const submitpd = async () => {
//         try {
//             // Validate required fields before submission
//             if (!localFormData.fatherSpousePrefixName ||
//                 !localFormData.fatherSpouseFirstName ||
//                 !localFormData.motherPrefixName ||
//                 !localFormData.motherFirstName ||
//                 !localFormData.birthPlaceCity ||
//                 !localFormData.birthPlaceCountry ||
//                 !localFormData.maritalStatus ||
//                 !localFormData.nationality ||
//                 !localFormData.religion ||
//                 !localFormData.caste) {
//                 throw new Error('Please fill all required fields');
//             }

//             const payload = {
//                 application_id: formData.application_id, // <-- Add this line!
//                 father_prefix_name: localFormData.fatherSpousePrefixName,
//                 father_first_name: localFormData.fatherSpouseFirstName,
//                 father_middle_name: localFormData.fatherSpouseMiddleName,
//                 father_last_name: localFormData.fatherSpouseLastName,
//                 mother_prefix_name: localFormData.motherPrefixName,
//                 mother_first_name: localFormData.motherFirstName,
//                 mother_middle_name: localFormData.motherMiddleName,
//                 mother_last_name: localFormData.motherLastName,
//                 birth_place: localFormData.birthPlaceCity,
//                 birth_country: localFormData.birthPlaceCountry,
//                 occoupation_type: localFormData.occupationType,
//                 occupation_name: localFormData.businessName,
//                 if_salaryed: localFormData.salariedWith,
//                 designation: localFormData.designation,
//                 nature_of_occoupation: localFormData.organisationNature,
//                 qualification: localFormData.educationQualification,
//                 anual_income: localFormData.annualIncome,
//                 remark: localFormData.remark,
//                 status: "APPROVED",
//             };

//             const response = await accountPersonalDetailsService.create(payload);

//             Swal.fire({
//                 icon: 'success',
//                 title: response.data.message || 'Account personal details saved!',
//                 showConfirmButton: false,
//                 timer: 1500
//             });

//             if (onNext) onNext();

//         } catch (error) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: error?.response?.data?.message || error.message || 'Failed to save details'
//             });
//         }
//     }

//     return (
//         <div className="max-w-screen-xl mx-auto">
//             <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
//             <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
//                 {/* Maiden Name Section */}
//                 <CommanSelect
//                     value={localFormData.maidenPrefixName}
//                     label={labels.maidenPrefixName.label}
//                     name="maidenPrefixName"
//                     onChange={handleChange}
//                     options={salutation}
//                 />
//                 <CommanInput
//                     label={labels.maidenFirstName.label}
//                     name="maidenFirstName"
//                     value={localFormData.maidenFirstName}
//                     onChange={handleChange}
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={15}
//                 />
//                 <CommanInput
//                     label={labels.maidenMiddleName.label}
//                     name="maidenMiddleName"
//                     value={localFormData.maidenMiddleName}
//                     onChange={handleChange}
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={15}
//                 />
//                 <CommanInput
//                     label={labels.maidenLastName.label}
//                     name="maidenLastName"
//                     value={localFormData.maidenLastName}
//                     onChange={handleChange}
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={15}
//                 />

//                 {/* Father/Spouse Section */}
//                 <CommanSelect
//                     value={localFormData.fatherSpousePrefixName}
//                     label={labels.fatherSpousePrefixName.label}
//                     name="fatherSpousePrefixName"
//                     onChange={handleChange}
//                     required
//                     options={salutation}
//                 />
//                 <CommanInput
//                     label={labels.fatherSpouseFirstName.label}
//                     name="fatherSpouseFirstName"
//                     value={localFormData.fatherSpouseFirstName}
//                     onChange={handleChange}
//                     required
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={15}
//                 />
//                 <CommanInput
//                     label={labels.fatherSpouseMiddleName.label}
//                     name="fatherSpouseMiddleName"
//                     value={localFormData.fatherSpouseMiddleName}
//                     onChange={handleChange}
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={15}
//                 />
//                 <CommanInput
//                     label={labels.fatherSpouseLastName.label}
//                     name="fatherSpouseLastName"
//                     value={localFormData.fatherSpouseLastName}
//                     onChange={handleChange}
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={15}
//                 />

//                 {/* Mother Section */}
//                 <CommanSelect
//                     label={labels.motherPrefixName.label}
//                     name="motherPrefixName"
//                     value={localFormData.motherPrefixName}
//                     onChange={handleChange}
//                     required
//                     options={salutation}
//                 />
//                 <CommanInput
//                     label={labels.motherFirstName.label}
//                     name="motherFirstName"
//                     value={localFormData.motherFirstName}
//                     onChange={handleChange}
//                     required
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={15}
//                 />
//                 <CommanInput
//                     label={labels.motherMiddleName.label}
//                     name="motherMiddleName"
//                     value={localFormData.motherMiddleName}
//                     onChange={handleChange}
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={15}
//                 />
//                 <CommanInput
//                     label={labels.motherLastName.label}
//                     name="motherLastName"
//                     value={localFormData.motherLastName}
//                     onChange={handleChange}
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={15}
//                 />

//                 {/* Birth and Personal Details */}
//                 <CommanInput
//                     label={labels.birthPlaceCity.label}
//                     name="birthPlaceCity"
//                     value={localFormData.birthPlaceCity}
//                     onChange={handleChange}
//                     required
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={15}
//                 />
//                 <CommanInput
//                     label={labels.birthPlaceCountry.label}
//                     name="birthPlaceCountry"
//                     value={localFormData.birthPlaceCountry}
//                     onChange={handleChange}
//                     required
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={15}
//                 />
//                 <CommanSelect
//                     label={labels.maritalStatus.label}
//                     name="maritalStatus"
//                     value={localFormData.maritalStatus}
//                     onChange={handleChange}
//                     required
//                     options={maritalStatusOptions}
//                 />
//                 <CommanInput
//                     label={labels.nationality.label}
//                     name="nationality"
//                     value={localFormData.nationality}
//                     onChange={handleChange}
//                     required
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={10}
//                 />
//                 <CommanInput
//                     label={labels.religion.label}
//                     name="religion"
//                     value={localFormData.religion}
//                     onChange={handleChange}
//                     required
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={10}
//                 />
//                 <CommanInput
//                     label={labels.caste.label}
//                     name="caste"
//                     value={localFormData.caste}
//                     onChange={handleChange}
//                     required
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={10}
//                 />
//             </div>

//             <h2 className="text-2xl font-bold mt-8 mb-4">Occupation Details</h2>
//             <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
//                 <CommanInput
//                     label={labels.occupationType.label}
//                     name="occupationType"
//                     value={localFormData.occupationType}
//                     onChange={handleChange}
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={15}
//                 />
//                 <CommanInput
//                     label={labels.businessName.label}
//                     name="businessName"
//                     value={localFormData.businessName}
//                     onChange={handleChange}
//                     validationType="ALPHANUMERIC_AND_SPACE"
//                     max={30}
//                 />
//                 <CommanInput
//                     label={labels.salariedWith.label}
//                     name="salariedWith"
//                     value={localFormData.salariedWith}
//                     onChange={handleChange}
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={15}
//                 />
//                 <CommanInput
//                     label={labels.designation.label}
//                     name="designation"
//                     value={localFormData.designation}
//                     onChange={handleChange}
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={15}
//                 />
//                 <CommanInput
//                     label={labels.organisationNature.label}
//                     name="organisationNature"
//                     value={localFormData.organisationNature}
//                     onChange={handleChange}
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={30}
//                 />
//                 <CommanInput
//                     label={labels.educationQualification.label}
//                     name="educationQualification"
//                     value={localFormData.educationQualification}
//                     onChange={handleChange}
//                     validationType="ALPHABETS_AND_SPACE"
//                     max={30}
//                 />
//                 <CommanInput
//                     label={labels.annualIncome.label}
//                     name="annualIncome"
//                     value={localFormData.annualIncome}
//                     onChange={handleChange}
//                     validationType="DECIMAL"
//                     max={15}
//                 />
//                 <CommanInput
//                     label={labels.remark.label}
//                     name="remark"
//                     value={localFormData.remark}
//                     onChange={handleChange}
//                     validationType="EVERYTHING"
//                     max={200}
//                 />
//             </div>

//             <div className="flex justify-between mt-6 z-10" style={{ zIndex: '999' }}>
//                 <CommonButton onClick={onBack} variant="outlined">
//                     Back
//                 </CommonButton>
//                 <CommonButton onClick={submitpd} variant="contained">
//                     Save & Continue
//                 </CommonButton>
//             </div>
//         </div>
//     );
// }

