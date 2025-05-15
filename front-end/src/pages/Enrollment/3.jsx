import React from 'react';
import DocUpload from './3A';
import CommonButton from '../../components/CommonButton';
function p3({ onNext, onBack }) {
    return (
        <div className="form-container">
            <h2 className="text-xl font-bold mb-2">Upload Documents</h2>

            <DocUpload />
            <div className="next-back-btns">
                <CommonButton className="btn-back" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>

                <CommonButton className="btn-next" onClick={onNext}>
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div>
        </div>
    );
}

export default p3;