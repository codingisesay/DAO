import React from 'react';
import DocumentUpload from './3A';
import CommonButton from '../../components/CommonButton';
import { DocumentProvider } from './DocumentContext';
import { apiService } from '../../utils/storage';
import { API_ENDPOINTS } from '../../services/api';
import Swal from 'sweetalert2';
function P3({ onNext, onBack, formData, updateFormData }) {
    const [localform, setlocalform] = React.useState([]);


    const handleDocumentsUpdate = async (newDocuments) => {
        const formData = new FormData();
        formData.append('application_id', 60);

        newDocuments.forEach((doc) => {
            if (doc.file instanceof File) {
                formData.append('files[]', doc.file);
                formData.append('document_types[]', doc.name);
            }
        });

        try {
            const response = await apiService.post(
                API_ENDPOINTS.APPLICATION_DOCUMENT.CREATE,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
            Swal.fire({
                icon: 'success',
                title: response.data.message || 'Document uploaded successfully.',
                showConfirmButton: false,
                timer: 1500
            });

            updateFormData({
                ...formData,
                correspondenceAddressSame: sameAsAbove
            });

            if (onNext) {
                onNext();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: JSON.stringify(error)
            });
        }
    }

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

