import React, { useState, useEffect } from 'react';
import DAOExtraction from './RND_DND_GetSignphoto_abstraction';
import DocUpload from './RND_DND_GetSignphoto_DocUpload';
import { apiService } from '../../utils/storage';
import { kycService } from '../../services/apiServices';
import Swal from 'sweetalert2';
import CommonButton from '../../components/CommonButton';

function base64ToFile(base64, filename, mimeType = 'image/jpeg') {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1] || mimeType;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

const P3 = ({ nextStep, prevStep }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [documents, setDocuments] = useState(() => {
        try {
            const saved = localStorage.getItem('documentData');
            if (!saved) return [];
            const docs = JSON.parse(saved);
            // Reconstruct File objects for each doc
            return docs.map(doc => ({
                ...doc,
                file: doc.file instanceof File
                    ? doc.file
                    : base64ToFile(doc.image, doc.name + '.jpg')
            }));
        } catch (error) {
            console.error('Failed to load documents from localStorage:', error);
            return [];
        }
    });
    const storedId = localStorage.getItem('application_id');
    const [processingDoc, setProcessingDoc] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem('documentData', JSON.stringify(documents));
        } catch (error) {
            console.error('Failed to save documents to localStorage:', error);
        }
    }, [documents]);

    const handleDocumentsUpdate = (updatedDocuments) => {
        setDocuments(updatedDocuments);
    };

    const handleProcessDocument = (doc) => {
        setProcessingDoc(doc);
        setIsProcessing(true);
    };

    const handleExtractionComplete = (docId, extractions) => {
        const updatedDocs = documents.map(doc => {
            if (doc.id === docId) {
                return {
                    ...doc,
                    signatures: extractions.signatures,
                    photographs: extractions.photographs
                };
            }
            return doc;
        });
        setDocuments(updatedDocs);
        setProcessingDoc(null);
        setIsProcessing(false);
    };

    const validateDocuments = () => {
        const hasAddressDoc = documents.some(doc => doc.documentCategory === 'address');
        const hasSignatureDoc = documents.some(doc => doc.documentCategory === 'signature');
        const hasIdentityDoc = documents.some(doc => doc.documentCategory === 'identity');

        if (!hasAddressDoc || !hasSignatureDoc || !hasIdentityDoc) {
            return {
                isValid: false,
                message: 'Please upload at least one document for each category: Identity, Address, and Signature.'
            };
        }

        // Check for Aadhaar front/back dependency
        const hasAadhaarFront = documents.some(doc => doc.type === 'AADHAAR_CARD_FRONT');
        const hasAadhaarBack = documents.some(doc => doc.type === 'AADHAAR_CARD_BACK');

        if (hasAadhaarFront && !hasAadhaarBack) {
            return {
                isValid: false,
                message: 'You have uploaded Aadhaar Card Front. Aadhaar Card Back is also required.'
            };
        }
        if (hasAadhaarBack && !hasAadhaarFront) {
            return {
                isValid: false,
                message: 'You have uploaded Aadhaar Card Back. Aadhaar Card Front is also required.'
            };
        }

        return { isValid: true };
    };

    const handleSubmit = async () => {
        const validation = validateDocuments();
        if (!validation.isValid) {
            Swal.fire({
                icon: 'warning',
                title: 'Document Requirements',
                text: validation.message,
            });
            return;
        }

        let localStorageDocuments;
        try {
            const saved = localStorage.getItem('documentData');
            localStorageDocuments = saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load documents from localStorage:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load documents. Please try again.',
            });
            return;
        }

        if (localStorageDocuments.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No Documents',
                text: 'Please upload at least one document before proceeding.',
            });
            return;
        }

        setIsLoading(true);

        try {
            const formDataObj = new FormData();
            formDataObj.append('kyc_application_id', storedId);

            const documentsWithFiles = documents.filter(doc => doc.file instanceof File);

            if (documentsWithFiles.length === 0) {
                throw new Error('No valid documents found. Please re-upload your documents.');
            }

            documentsWithFiles.forEach((doc) => {
                formDataObj.append('kyc_application_id', storedId);
                formDataObj.append('files[]', doc.file);
                formDataObj.append('document_types[]', doc.type || doc.name);
            });

            const response = await kycService.kycDocumentUpload(formDataObj);

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Documents saved successfully.',
                showConfirmButton: false,
                timer: 1500
            });
            nextStep();

        } catch (error) {
            console.error('Upload error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'An error occurred while uploading documents.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='form-container pb-10'>
            <div className="relative ">
                {isProcessing && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                                <p>Processing document, please wait...</p>
                            </div>
                        </div>
                    </div>
                )}

                <DocUpload
                    onDocumentsUpdate={handleDocumentsUpdate}
                    onProcessDocument={handleProcessDocument}
                    documents={documents}
                />
                {processingDoc && (
                    <DAOExtraction
                        document={processingDoc}
                        onClose={() => {
                            setProcessingDoc(null);
                            setIsProcessing(false);
                        }}
                        onExtractionComplete={(extractions) => handleExtractionComplete(processingDoc.id, extractions)}
                    />
                )}
            </div>
            <div className="next-back-btns mt-6 z-10">
                <CommonButton className="btn-back" onClick={prevStep}>
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
        </div>
    );
};

export default P3;

 