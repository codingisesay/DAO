import React, { useEffect, useState } from 'react';
import { applicationDetailsService } from '../../services/apiServices';
import PersonalOccupationForm from './5A';
import AddressForm from './2B';
import CommonButton from '../../components/CommonButton';
function p6({ onNext, onBack, formData, updateFormData }) {
    const [applicationDetails, setApplicationDetails] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Use the correct application id (4 is hardcoded in backend)
                const response = await applicationDetailsService.getFullDetails(4);
                setApplicationDetails(response.data.data);
            } catch (error) {
                setApplicationDetails(null);
            }
        };
        fetchDetails();
    }, []);

    // Prepare data for child forms
    const personalFormData = applicationDetails?.account_personal_details
        ? {
            fatherSpousePrefixName: applicationDetails.account_personal_details.father_prefix_name,
            fatherSpouseFirstName: applicationDetails.account_personal_details.father_first_name,
            fatherSpouseMiddleName: applicationDetails.account_personal_details.father_middle_name,
            fatherSpouseLastName: applicationDetails.account_personal_details.father_last_name,
            motherPrefixName: applicationDetails.account_personal_details.mother_prefix_name,
            motherFirstName: applicationDetails.account_personal_details.mother_first_name,
            motherMiddleName: applicationDetails.account_personal_details.mother_middle_name,
            motherLastName: applicationDetails.account_personal_details.mother_last_name,
            birthPlaceCity: applicationDetails.account_personal_details.birth_place,
            birthPlaceCountry: applicationDetails.account_personal_details.birth_country,
            occupationType: applicationDetails.account_personal_details.occoupation_type,
            businessName: applicationDetails.account_personal_details.occupation_name,
            salariedWith: applicationDetails.account_personal_details.if_salaryed,
            designation: applicationDetails.account_personal_details.designation,
            organisationNature: applicationDetails.account_personal_details.nature_of_occoupation,
            educationQualification: applicationDetails.account_personal_details.qualification,
            annualIncome: applicationDetails.account_personal_details.anual_income,
            remark: applicationDetails.account_personal_details.remark,
        }
        : {};

    const addressFormData = applicationDetails?.personal_details
        ? {
            // Map fields as needed from applicationDetails.personal_details
        }
        : {};

    return (<>

        <PersonalOccupationForm />

        <AddressForm formData={formData} updateFormData={updateFormData} />

        <>
            <br /><hr />
            <h2 className="text-xl font-bold mb-2">Documwnt Details In Progress</h2>
        </>
        <CommonButton className="btn-login">
            Download
        </CommonButton>

    </>);
}

export default p6;