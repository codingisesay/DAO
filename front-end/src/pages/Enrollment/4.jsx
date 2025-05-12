import React from 'react';
import LivePhoto from './2C';
function p4({ onNext, onBack }) {
    return (
        <>

            <h2 className="text-xl font-bold mb-2">Video KYC</h2>
            <LivePhoto />

            <div className="next-back-btns">
                <button className="btn-back" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </button>
                <button className="btn-next" onClick={onNext}>
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </button>
            </div>
        </>);
}

export default p4;