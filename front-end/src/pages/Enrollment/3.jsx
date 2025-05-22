import React from 'react';
import DocumentUpload from './3A';
import CommonButton from '../../components/CommonButton';
import { DocumentProvider } from './DocumentContext';

function P3({ onNext, onBack, formData, updateFormData }) {
    const [documents, setDocuments] = React.useState([]);

    // Function to handle document updates
    const handleDocumentsUpdate = (newDocuments) => {
        setDocuments(newDocuments);
        // Update formData in parent component
        console.log('data to send to enrole form : ,', newDocuments)
        updateFormData(3, { documents: newDocuments });
    };

    return (
        <DocumentProvider>
            <div className="form-container">
                <DocumentUpload onDocumentsUpdate={handleDocumentsUpdate} />
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

export default P3;// import React from 'react';


// import DocumentUpload from './3A';
// import CommonButton from '../../components/CommonButton';
// import { DocumentProvider } from './DocumentContext';

// function P3({ onNext, onBack, formData, updateFormData }) {
//     const [tableData, setTableData] = React.useState([]);
//     return (
//         <DocumentProvider>
//             <div className="form-container">
//                 <DocumentUpload />
//                 <div className="next-back-btns mt-6">
//                     <CommonButton className="btn-back" onClick={onBack}>
//                         <i className="bi bi-chevron-double-left"></i>&nbsp;Back
//                     </CommonButton>
//                     <CommonButton className="btn-next" onClick={onNext}>
//                         Next&nbsp;<i className="bi bi-chevron-double-right"></i>
//                     </CommonButton>
//                 </div>
//             </div>
//         </DocumentProvider>
//     );
// }

// export default P3;