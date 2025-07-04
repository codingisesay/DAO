import React, { useState, useEffect } from 'react';
import { accountPersonalDetailsService, applicationDetailsService ,createAccountService} from '../../services/apiServices';
import CommanInput from '../../components/CommanInput';
import CommanSelect from '../../components/CommanSelect';
import { maritalStatusOptions } from '../../data/data';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { salutation, religion, caste, salaryrange } from '../../data/data';

function PersonalOccupationForm({ formData, updateFormData, onBack, onNext }) {
    
    const applicationId = localStorage.getItem('application_id');
    const [localFormData, setLocalFormData] = useState({
        application_id: applicationId,
         maidenPrefixName: '',
        maidenFirstName:  '',
        maidenMiddleName:   '',
        maidenLastName: '',
        fatherSpousePrefixName:  '',
        fatherSpouseFirstName:   '',
        fatherSpouseMiddleName:   '',
        fatherSpouseLastName:  '',
        motherPrefixName:   '',
        motherFirstName:  '',
        motherMiddleName:  '',
        motherLastName:   '',
        birthPlaceCity:  '',
        birthPlaceCountry:  '',
        maritalStatus:   '',
        nationality: '',
        religion:  '',
        caste: '',
        occupationType:  '',
        businessName: '',
        salariedWith:   '',
        designation:  '',
        organisationNature:  '',
        educationQualification:  '',
        annualIncome:   '',
        remark:   ''
    });
 
    
    
useEffect(() => {
    const fetchDetails = async () => {
        try {
            const response = await applicationDetailsService.getFullDetails(applicationId);
            if (response && response.data) {
                const { personal_details, account_personal_details } = response.data;
                
                setLocalFormData(prev => ({
                    ...prev,
                    // Maiden details (from account_personal_details)
                    maidenPrefixName: account_personal_details?.maiden_prefix || prev.maidenPrefixName,
                    maidenFirstName: account_personal_details?.maiden_first_name || prev.maidenFirstName,
                    maidenMiddleName: account_personal_details?.maiden_middle_name || prev.maidenMiddleName,
                    maidenLastName: account_personal_details?.maiden_last_name || prev.maidenLastName,
                    
                    // Father/Spouse details (from account_personal_details)
                    fatherSpousePrefixName: account_personal_details?.father_prefix_name || prev.fatherSpousePrefixName,
                    fatherSpouseFirstName: account_personal_details?.father_first_name || prev.fatherSpouseFirstName,
                    fatherSpouseMiddleName: account_personal_details?.father_middle_name || prev.fatherSpouseMiddleName,
                    fatherSpouseLastName: account_personal_details?.father_last_name || prev.fatherSpouseLastName,
                    
                    // Mother details (from account_personal_details)
                    motherPrefixName: account_personal_details?.mother_prefix_name || prev.motherPrefixName,
                    motherFirstName: account_personal_details?.mother_first_name || prev.motherFirstName,
                    motherMiddleName: account_personal_details?.mother_middle_name || prev.motherMiddleName,
                    motherLastName: account_personal_details?.mother_last_name || prev.motherLastName,
                    
                    // Birth details (from account_personal_details)
                    birthPlaceCity: account_personal_details?.birth_place || prev.birthPlaceCity,
                    birthPlaceCountry: account_personal_details?.birth_country || prev.birthPlaceCountry,
                    
                    // Personal details (from personal_details with fallback to account_personal_details)
                    maritalStatus: personal_details?.marital_status || prev.maritalStatus,
                    religion: personal_details?.religion || prev.religion,
                    caste: personal_details?.caste || prev.caste,
                    nationality:'Indian', 
                    
                    // Occupation details (from account_personal_details)
                    occupationType: account_personal_details?.occoupation_type || prev.occupationType,
                    businessName: account_personal_details?.occupation_name || prev.businessName,
                    salariedWith: account_personal_details?.if_salaryed || prev.salariedWith,
                    designation: account_personal_details?.designation || prev.designation,
                    organisationNature: account_personal_details?.nature_of_occoupation || prev.organisationNature,
                    educationQualification: account_personal_details?.qualification || prev.educationQualification,
                    annualIncome: account_personal_details?.anual_income || prev.annualIncome,
                    remark: account_personal_details?.remark || prev.remark
                }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (applicationId) {
        fetchDetails();
    }
}, [applicationId]);

 
    return (
        <div className="max-w-screen-xl mx-auto pb-20">
            <h2 className="text-xl font-bold mb-4">Personal Details</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
                {/* Maiden Name Section */}
                <CommanSelect
                    value={localFormData.maidenPrefixName}
                    label={labels.maidenPrefixName.label}
                    name="maidenPrefixName"
                    options={salutation}
                />
                <CommanInput
                    label={labels.maidenFirstName.label}
                    name="maidenFirstName"
                    value={localFormData.maidenFirstName}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.maidenMiddleName.label}
                    name="maidenMiddleName"
                    value={localFormData.maidenMiddleName}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.maidenLastName.label}
                    name="maidenLastName"
                    value={localFormData.maidenLastName}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />

                {/* Father/Spouse Section */}
                <CommanSelect
                    value={localFormData.fatherSpousePrefixName}
                    label={labels.fatherSpousePrefixName.label}
                    name="fatherSpousePrefixName"
                    options={salutation}
                />
                <CommanInput
                    label={labels.fatherSpouseFirstName.label}
                    name="fatherSpouseFirstName"
                    value={localFormData.fatherSpouseFirstName}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.fatherSpouseMiddleName.label}
                    name="fatherSpouseMiddleName"
                    value={localFormData.fatherSpouseMiddleName}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.fatherSpouseLastName.label}
                    name="fatherSpouseLastName"
                    value={localFormData.fatherSpouseLastName}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />

                {/* Mother Section */}
                <CommanSelect
                    label={labels.motherPrefixName.label}
                    name="motherPrefixName"
                    value={localFormData.motherPrefixName}
                    options={salutation}
                />
                <CommanInput
                    label={labels.motherFirstName.label}
                    name="motherFirstName"
                    value={localFormData.motherFirstName}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.motherMiddleName.label}
                    name="motherMiddleName"
                    value={localFormData.motherMiddleName}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.motherLastName.label}
                    name="motherLastName"
                    value={localFormData.motherLastName}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />

                {/* Birth and Personal Details */}
                <CommanInput
                    label={labels.birthPlaceCity.label}
                    name="birthPlaceCity"
                    value={localFormData.birthPlaceCity}
                    required
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.birthPlaceCountry.label}
                    name="birthPlaceCountry"
                    value={localFormData.birthPlaceCountry}
                    required
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanSelect
                    label={labels.maritalStatus.label}
                    name="maritalStatus"
                    value={localFormData.maritalStatus}
                    required
                    options={maritalStatusOptions}
                />
                <CommanInput
                    label={labels.nationality.label}
                    name="nationality"
                    value={localFormData.nationality}
                    required
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanSelect
                    label={labels.religion.label}
                    name="religion"
                    value={localFormData.religion}
                    required
                    options={religion}
                />
                <CommanSelect
                    label={labels.caste.label}
                    name="caste"
                    value={localFormData.caste}
                    required
                    options={caste}
                />
            </div>

            <h2 className="text-xl font-bold mt-2 mb-2">Occupation Details</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
                <CommanInput
                    label={labels.occupationType.label}
                    name="occupationType"
                    value={localFormData.occupationType}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.businessName.label}
                    name="businessName"
                    value={localFormData.businessName}
                    validationType="ALPHANUMERIC_AND_SPACE"
                    max={30}
                />
                <CommanInput
                    label={labels.salariedWith.label}
                    name="salariedWith"
                    value={localFormData.salariedWith}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.designation.label}
                    name="designation"
                    value={localFormData.designation}
                    validationType="ALPHABETS_AND_SPACE"
                    max={10}
                />
                <CommanInput
                    label={labels.organisationNature.label}
                    name="organisationNature"
                    value={localFormData.organisationNature}
                    validationType="ALPHABETS_AND_SPACE"
                    max={30}
                />
                <CommanInput
                    label={labels.educationQualification.label}
                    name="educationQualification"
                    value={localFormData.educationQualification}
                    validationType="ALPHABETS_AND_SPACE"
                    max={30}
                />
                {/* <CommanInput
                    label={labels.annualIncome.label}
                    name="annualIncome"
                    value={localFormData.annualIncome}
                    validationType="DECIMAL"
                    max={15}
                /> */}

                <CommanSelect
                    label={labels.annualIncome.label}
                    name="annualIncome"
                    value={localFormData.annualIncome}
                    options={salaryrange}
                />
                <CommanInput
                    label={labels.remark.label}
                    name="remark"
                    value={localFormData.remark}
                    validationType="EVERYTHING"
                    max={200}
                />
            </div>

            <div className="next-back-btns z-10" >{/* z-10 */}
                <CommonButton onClick={onBack} variant="outlined" className="btn-back">
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton onClick={onNext} variant="contained" className="btn-next">
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div>
        </div>
    );
}

export default PersonalOccupationForm;
