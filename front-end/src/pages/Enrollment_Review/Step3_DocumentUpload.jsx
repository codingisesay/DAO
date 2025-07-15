 



 import React, { useState, useEffect } from 'react';
import DAOExtraction from './RND_DND_GetSignphoto_abstraction';
import DocUpload from './RND_DND_GetSignphoto_DocUpload';
import { apiService } from '../../utils/storage';
import { agentService , pendingAccountData, createAccountService,pendingAccountStatusUpdate } from '../../services/apiServices';
import Swal from 'sweetalert2';
import DocView from './Step3A_DocumentUpload'
import CommonButton from '../../components/CommonButton';
import { useParams } from 'react-router-dom';

const P3 = ({ onNext, onBack }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [Loading, setLoading] = React.useState(false);
    const [localFormData, setLocalFormData]=useState([]); 
    const [isAdmin, setIsAdmin] = useState(false);
    const [isView, setIsView] = useState(false);
    const admin_id= localStorage.getItem('userCode');
    const {id} =  useParams() ;
    const application_id =localStorage.getItem('application_id');
    const [reason, setReason] = useState(null);  
    const [processingDoc, setProcessingDoc] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [documents, setDocuments] = useState(() => {
        try {
            const saved = localStorage.getItem('documentData');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Failed to load documents from localStorage:', error);
            return [];
        }
    });
    useEffect(() => {   if (!id) return;  fetchAndStoreDetails();  fetchReason();    }, [id]);
    useEffect(() => {
        const role = localStorage.getItem("roleName");
        setIsAdmin(role.includes("admin") || role.includes("Admin"));
        setIsView(window.location.href.includes("view")); 
    }, []);
    
    const fetchReason = async () => {
        try {
            setLoading(true);
            const response = await agentService.refillApplication(id);
            setReason(response.data[0]); 
        } catch (error) {
            console.error("Failed to fetch review applications:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAndStoreDetails = async () => {
        try {
            if (id) {
                const response = await pendingAccountData.getDetailsS3(id);
                const documents = response.documents || [];
                // Save only the documents array to localStorage
                localStorage.setItem('documentData', JSON.stringify(documents));
                setDocuments(documents); // Update state for DocUpload
                setLocalFormData(documents); // Optional, if you use localFormData elsewhere
                
            }
        } catch (error) {
            console.error('Failed to fetch application details:', error);
        }
    };
    

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
        const hasAadhaarFront = documents.some(doc => doc.type === 'AADHAAR_CARD_FRONT');
        const hasAadhaarBack = documents.some(doc => doc.type === 'AADHAAR_CARD_BACK');
        
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
                application_id: application_id,
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
                // onNext();
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
    // admin controls below

    const handleRejectClick = async () => {
        const result = await Swal.fire({
            title: 'Reason for Rejection',
            input: 'text',
            inputLabel: 'Please provide a reason',
            inputPlaceholder: 'Enter reason here...',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            className: 'btn-login',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write a reason!';
                }
            },
        });

        if (result.isConfirmed && result.value) {
            const payload = {
                application_id: Number(id),
                status: 'Rejected',
                status_comment: result.value,
                admin_id: admin_id
            };
            await pendingAccountStatusUpdate.updateS3(id, payload); 
            console.log('Payload:', payload);
            onNext(); // pass the payload forward
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    };

    const handleReviewClick = async () => {
        const result = await Swal.fire({
            title: 'Reason for Review',
            input: 'text',
            inputLabel: 'Please provide a reason',
            inputPlaceholder: 'Enter reason here...',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            className: 'btn-login',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write a reason!';
                }
            },
        });

        if (result.isConfirmed && result.value) {
            const payload = {
                application_id: Number(id),
                status: 'Review',
                status_comment: result.value,
                admin_id: admin_id
            };
            await pendingAccountStatusUpdate.updateS3(id, payload); 
            console.log('Payload:', payload);
            onNext(); // pass the payload forward
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    };

    const handleApproveClick = () => {
        // alert('called')
        try {
            const payload = {
                applicaiton_id: Number(id),
                status: 'Approved',
                status_comment: '',
                admin_id:admin_id
            }
            const response = pendingAccountStatusUpdate.updateS3(id, payload); 
            Swal.fire({
                icon: 'success',
                title: 'Document Details Approved Successfully',
                timer: 2000,               // alert stays for 2 seconds
                showConfirmButton: false,  // no "OK" button
                allowOutsideClick: false,  // optional: prevent closing by clicking outside
                allowEscapeKey: false,     // optional: prevent closing with Escape key
                didOpen: () => {
                    Swal.showLoading();   // optional: show loading spinner
                },
                willClose: () => {
                    onNext(); // proceed after alert closes
                }
            });
        }
        catch (error) {
            // console.error('Error updating status:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong while updating the status!',
            });
        }
    }

    // admin controls above

    return (
        <div className='form-container'>
            <div className="  ">
                <h2 className="text-xl font-bold mb-1">Upload Documents</h2>
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

                {/* consdition for handel document view format */}
 
                {isView || isAdmin || reason && !reason.document_approved_status_status_comment ?
                    <>  <DocView /> </>:
                    <> 
                        <div>
                            {reason &&  <p className="text-red-500">Review Reason : {reason.document_approved_status_status_comment}</p> }
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
                    </>
                }

                {/* consition to handle button format */}

   
                <div className="next-back-btns mt-6 z-10">
                    <CommonButton className="btn-back" onClick={onBack}>
                        <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                    </CommonButton>
 
                    {!isView ? (<>                    
                        {isAdmin ? (            
                        <>
                        <CommonButton
                            className="text-red-500 border border-red-500 hover:bg-red-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
                            onClick={handleRejectClick}
                        >
                            Reject & Continue
                        </CommonButton>

                        <CommonButton
                            className="text-amber-500 border border-amber-500 hover:bg-amber-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
                            onClick={handleReviewClick}
                        >
                            Review & Continue
                        </CommonButton>

                        <CommonButton
                            className="btn-next"
                            onClick={handleApproveClick}
                        >
                            Accept & Continue
                        </CommonButton>
                        </>
                        ) 
                        : (
                        <>  
                        {reason && reason.document_approved_status_status_comment ?
                        
                        <CommonButton
                            onClick={handleSubmit}
                            variant="contained"
                            className="btn-next" 
                        >  
                                    Next&nbsp;<i className="bi bi-chevron-double-right"></i> 
                        </CommonButton>
                        :
                            <CommonButton  className="btn-next"  onClick={onNext}  >  
                            Next&nbsp;<i className="bi bi-chevron-double-right"></i> 
                        </CommonButton>  

                    }


                        </>
                        )} 
                    </>) : (<>
                        <CommonButton  className="btn-next"  onClick={onNext}  >  
                            Next&nbsp;<i className="bi bi-chevron-double-right"></i> 
                        </CommonButton>                            
                    </>)}

 
                </div>

            </div>
        </div>
    );
};

export default P3;


 
 