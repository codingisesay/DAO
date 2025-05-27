import React from 'react';
// import LivePhoto from './2C';
import VideoKYCInstructions from './4A';
import CommonButton from '../../components/CommonButton';
function p4({ onNext, onBack }) {
    return (
        <>
            <div className="form-container">
                <h2 className="text-xl font-bold mb-2">Video KYC</h2>
                <VideoKYCInstructions />

                <div className="next-back-btns">
                    <CommonButton className="btn-back" onClick={onBack}>
                        <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                    </CommonButton>

                    <CommonButton className="btn-next" onClick={onNext}>
                        Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                    </CommonButton>
                </div>

            </div>
        </>);
}

export default p4;