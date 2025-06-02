
import React from 'react';
import DocumentUpload from './3A';
import CommonButton from '../../components/CommonButton';
import { DocumentProvider } from './DocumentContext';
import { daoApi } from '../../utils/storage';
import { API_ENDPOINTS } from '../../services/api';
import Swal from 'sweetalert2';
import DAOExtraction from './3B_DAOExtraction';
import { applicationDocumentService } from '../../services/apiServices';
function P3({ onNext, onBack, formData, updateFormData }) {
    const [documents, setDocuments] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);

    // Load saved documents from localStorage on component mount
    React.useEffect(() => {
        const savedDocuments = localStorage.getItem('applicationDocuments');
        if (savedDocuments) {
            setDocuments(JSON.parse(savedDocuments));
        }
    }, []);

    const handleDocumentsUpdate = (newDocuments) => {
        // Save documents to state and localStorage
        setDocuments(newDocuments);

        DAOExtraction();
        localStorage.setItem('applicationDocuments', JSON.stringify(newDocuments)); ``
    };

    const handleSubmit = async () => {
        onNext();
        // if (documents.length === 0) {
        //     Swal.fire({
        //         icon: 'warning',
        //         title: 'No Documents',
        //         text: 'Please upload at least one document before proceeding.',
        //     });
        //     return;
        // }

        // setIsLoading(true);

        // const formDataObj = new FormData();
        // formDataObj.append('application_id', formData.id || 5); // Use the real ID from formData if available

        // // Filter out documents that don't have files (in case of placeholders)
        // const documentsWithFiles = documents.filter(doc => doc.file instanceof File);

        // if (documentsWithFiles.length === 0) {
        //     throw new Error('No valid documents to upload');
        // }

        // documentsWithFiles.forEach((doc) => {
        //     formDataObj.append('files[]', doc.file);
        //     formDataObj.append('document_types[]', doc.name);
        // });


        // try {
        //     // const response = await daoApi.post(

        //     //     API_ENDPOINTS.APPLICATION_DOCUMENT.CREATE,
        //     //     formDataObj,
        //     //     {
        //     //         headers: { 'Content-Type': 'multipart/form-data' }
        //     //     }
        //     // );
        //     const respone = daoApi.post(applicationDocumentService.upload(formDataObj))
        //     // Clear localStorage after successful upload
        //     localStorage.removeItem('applicationDocuments');

        //     Swal.fire({
        //         icon: 'success',
        //         title: response.data.message || 'Documents uploaded successfully.',
        //         showConfirmButton: false,
        //         timer: 1500
        //     });

        //     // Update form data if needed
        //     updateFormData({
        //         ...formData,
        //         documents: documents.map(doc => ({ name: doc.name })) // Save document names without files
        //     });

        //     // Proceed to next step
        //     if (onNext) {
        //         onNext();
        //     }
        // } catch (error) {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Upload Failed',
        //         text: error.message || 'Failed to upload documents. Please try again.',
        //     });
        // } finally {
        //     setIsLoading(false);
        // }
    }

    return (
        <DocumentProvider>
            <div className="form-container">
                <DocumentUpload
                    onDocumentsUpdate={handleDocumentsUpdate}
                    initialDocuments={documents}
                />
                <div className="next-back-btns mt-6">
                    <CommonButton className="btn-back" onClick={onBack}>
                        <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                    </CommonButton>
                    <CommonButton
                        className="btn-next"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            'Uploading...'
                        ) : (
                            <>
                                Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                            </>
                        )}
                    </CommonButton>
                </div>
                {/* <DAOExtraction splitfile={yourFileObject} /> */}
            </div>
        </DocumentProvider>
    );
}

export default P3; 