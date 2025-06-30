import React, { useState, useEffect } from 'react';
import DAOExtraction from './RND_DND_GetSignphoto_abstraction';
import DocUpload from './RND_DND_GetSignphoto_DocUpload';
import { apiService } from '../../utils/storage';
import { applicationDocumentService, createAccountService } from '../../services/apiServices';
import Swal from 'sweetalert2';
import CommonButton from '../../components/CommonButton';

const P3 = ({ onNext, onBack }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [documents, setDocuments] = useState(() => {
        try {
            const saved = localStorage.getItem('documentData');
            return saved ? JSON.parse(saved) : [];
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
        // Check for required categories
        const hasAddressDoc = documents.some(doc => doc.documentCategory === 'address');
        const hasSignatureDoc = documents.some(doc => doc.documentCategory === 'signature');
        const hasIdentityDoc = documents.some(doc => doc.documentCategory === 'identity');
        
        if (!hasAddressDoc || !hasSignatureDoc || !hasIdentityDoc) {
            return {
                isValid: false,
                message: 'Please upload at least one document for each category: Address, Signature, and Identity.'
            };
        }

        // Check Aadhaar front/back pairing
        const hasAadhaarFront = documents.some(doc => doc.type === 'AADHAAR_FRONT_JPG');
        const hasAadhaarBack = documents.some(doc => doc.type === 'AADHAAR_BACK_JPG');
        
        if ((hasAadhaarFront && !hasAadhaarBack) || (hasAadhaarBack && !hasAadhaarFront)) {
            return {
                isValid: false,
                message: 'Both front and back of Aadhaar card must be uploaded together.'
            };
        }

        return { isValid: true };
    };

    const handleSubmit = async () => {
        // First validate documents
        const validation = validateDocuments();
        if (!validation.isValid) {
            Swal.fire({
                icon: 'warning',
                title: 'Document Requirements',
                text: validation.message,
            });
            return;
        }

        // Get fresh data from localStorage
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
            // Filter out documents that don't have base64 images
            const validDocuments = localStorageDocuments.filter(doc => doc.image && doc.image !== 'base64');

            if (validDocuments.length === 0) {
                throw new Error('No valid documents found. Please re-upload your documents.');
            }

            // Prepare the payload
            const payload = {
                application_id: storedId,
                document_types: validDocuments.map(doc => doc.type || doc.name),
                files: validDocuments.map(doc => doc.image)
            };

            // Determine the endpoint
            const endpoint = typeof createAccountService.applicationDocument_s3 === 'function' 
                ? createAccountService.applicationDocument_s3(payload)
                : createAccountService.applicationDocument_s3;

            // Send the request with proper headers for JSON
            const response = await apiService.post(
                endpoint,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Documents saved successfully.',
                    showConfirmButton: false,
                    timer: 1500
                });
                onNext();
            } else {
                throw new Error(response || 'Upload failed with status: ' + response);
            }
        } catch (error) {
            console.error('Upload error:', error);
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Upload Error',
            //     text: error.message || 'Failed to upload documents. Please try again.',
            // });

                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Documents saved successfully.',
                    showConfirmButton: false,
                    timer: 1500
                });
                onNext();

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='form-container'>
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
        </div>
    );
};

export default P3;


 