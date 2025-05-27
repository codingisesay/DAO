import React, { useState, useEffect } from 'react';
import DocumentUpload from './Step3_DocumentUpload';

const Step3Nomination = ({ formData, handleChange, nextStep, prevStep }) => {
  const [localDocuments, setLocalDocuments] = useState(formData.files || []);

  // Update local state when formData.files changes (like when coming back to this step)
  useEffect(() => {
    if (formData.files && formData.files.length > 0) {
      setLocalDocuments(formData.files);
    }
  }, [formData.files]);

  const handleDocumentsUpdate = (newDocuments) => {
    setLocalDocuments(newDocuments);
    // Update the parent formData with the new documents
    handleChange({
      files: newDocuments
    });
  };

  return (
    <div className="form-step">
      <h2>Step 3: Nomination Details</h2>

      <DocumentUpload
        onDocumentsUpdate={handleDocumentsUpdate}
        initialDocuments={localDocuments}
      />

      <div className="navigation-buttons">
        <button type="button" onClick={prevStep}>
          Previous
        </button>
        <button type="button" onClick={nextStep}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Step3Nomination;