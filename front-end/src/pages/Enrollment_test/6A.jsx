import React from 'react';
import PersonalOccupationForm from './5A';
import AddressForm from './2B';
import CommonButton from '../../components/CommonButton';
function p6({ onNext, onBack, formData, updateFormData }) {
    const handleSubmit = () => {
        updateFormData({
            personalDetails: {
                ...localFormData
            }
        });
        onNext();
    };
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