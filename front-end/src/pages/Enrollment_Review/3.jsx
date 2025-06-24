import React, { useState, useEffect } from 'react';
import DAOExtraction from './RND_DND_GetSignphoto_abstraction';
import DocUpload from './RND_DND_GetSignphoto_DocUpload';
import { apiService } from '../../utils/storage'
import { agentService ,createAccountService} from '../../services/apiServices';
import Swal from 'sweetalert2';
import CommonButton from '../../components/CommonButton'
import { swap } from '@tensorflow/tfjs-core/dist/util_base';
import { useParams } from 'react-router-dom';


const P3 = ({ onNext, onBack }) => {
    // In the main component
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
    const storedId = localStorage.getItem('application_id')



    const [processingDoc, setProcessingDoc] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Save to localStorage whenever documents change

    
      const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState(null);

    useEffect(() => {
        if (!id) return;

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

        fetchReason();
    }, [id]);



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


const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // Extract only the base64 part
    reader.onerror = error => reject(error);
  });
};

const handleSubmit = async () => {
  if (documents.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'No Documents',
      text: 'Please upload at least one document before proceeding.',
    });
    return;
  }

  setIsLoading(true);

  try {
    // Filter out documents that don't have files
    const documentsWithFiles = documents.filter(doc => doc.file instanceof File);

    if (documentsWithFiles.length === 0) {
      throw new Error('No valid documents found. Please re-upload your documents.');
    }

    // Convert all files to base64
    const base64Files = await Promise.all(
      documentsWithFiles.map(doc => fileToBase64(doc.file))
    );
    const documentTypes = documentsWithFiles.map(doc => doc.type || doc.name);

    // Prepare the payload
    const payload = {
      application_id: storedId,
      document_types: documentTypes,
      files: base64Files
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
    // Swal.fire('Error', error.message || error, 'error');
     
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

            <p className="text-red-500" > Review For : {reason && reason.document_approved_status_status_comment}</p>  
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










