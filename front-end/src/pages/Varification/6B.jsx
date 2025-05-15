import React from 'react';
import PersonalOccupationForm from './5A';
import AddressForm from './2B';
import CommonButton from '../../components/CommonButton';
function p6({ onNext, onBack }) {
    return (<>

        <PersonalOccupationForm />

        <AddressForm />

        <>
            <br /><hr />
            <h2 className="text-xl font-bold mb-2">Documwnt Details In Progress</h2>
        </>



        <div className="next-back-btns">
            <CommonButton className="btn-back" onClick={onBack}>
                <i className="bi bi-chevron-double-left"></i>&nbsp;Back
            </CommonButton>

            <CommonButton className="btn-next" onClick={onNext}>
                Next&nbsp;<i className="bi bi-chevron-double-right"></i>
            </CommonButton>
        </div>

    </>);
}

export default p6;