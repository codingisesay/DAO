import React, { useState, useEffect } from 'react';
import DAOExtraction from './RND_DND_GetSignphoto_abstraction';
import DocUpload from './RND_DND_GetSignphoto_DocUpload';
import { apiService } from './utils/storage';
import { applicationDocumentService } from './services/apiServices';
import Swal from 'sweetalert2'
const MyComponent = () => {
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

        const formDataObj = new FormData();
        formDataObj.append('application_id', storedId);

        // Filter out documents that don't have files (like those loaded from localStorage)
        const documentsWithFiles = documents.filter(doc => doc.file instanceof File);

        if (documentsWithFiles.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'No Valid Documents',
                text: 'Please re-upload your documents before submitting.',
            });
            setIsLoading(false);
            return;
        }

        documentsWithFiles.forEach((doc) => {
            formDataObj.append('files[]', doc.file);
            formDataObj.append('document_types[]', doc.type || doc.name);
        });

        try {
            const response = await apiService.post(applicationDocumentService.upload(formDataObj));

            if (response.data.success) {
              alert('done')

                // onNext();
            } else {
                throw new Error(response.data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Upload Failed',
            //     text: error.message || 'Failed to upload documents. Please try again.',
            // });
  

                // onNext();
        } finally {
            setIsLoading(false);
        }
    };



  return (
    <div className="relative">
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

      <button     onClick={handleSubmit}>Button</button>
    </div>
  );
};

export default MyComponent;







