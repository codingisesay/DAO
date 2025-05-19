import React from 'react';
import DocumentUpload from './3A';
import CommonButton from '../../components/CommonButton';
import { DocumentProvider } from './DocumentContext';

function P3({ onNext, onBack }) {
    return (
        <DocumentProvider>
            <div className="form-container">
                <h2 className="text-xl font-bold mb-2">Upload Documents</h2>
                <DocumentUpload />
                <div className="next-back-btns mt-6">
                    <CommonButton className="btn-back" onClick={onBack}>
                        <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                    </CommonButton>
                    <CommonButton className="btn-next" onClick={onNext}>
                        Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                    </CommonButton>
                </div>
            </div>
        </DocumentProvider>
    );
}

export default P3;