import React from 'react';
import DocUpload from './3A';

function p3({ onNext, onBack }) {
    return (
        <>
            <h2 className="text-xl font-bold mb-2">Upload Documents</h2>

            <DocUpload />
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

export default p3;