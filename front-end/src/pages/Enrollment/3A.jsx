import { useState, useRef } from 'react';

const DocumentUpload = () => {
    const [selectedIdentityProof, setSelectedIdentityProof] = useState('');
    const [selectedAddressProof, setSelectedAddressProof] = useState('');
    const [selectedSignatureProof, setSelectedSignatureProof] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [documents, setDocuments] = useState([]);
    const fileInputRef = useRef(null);

    const identityProofOptions = [
        { value: 'PAN', label: 'PAN Card' },
        { value: 'VOTER_ID', label: 'Voter ID Card' },
        { value: 'PASSPORT', label: 'Passport' },
        { value: 'DRIVING_LICENSE', label: 'Driving License' },
    ];

    const addressProofOptions = [
        { value: 'AADHAAR', label: 'Aadhaar Card' },
        { value: 'UTILITY_BILL', label: 'Electricity/Water/Gas Bill (recent)' },
        { value: 'RENT_AGREEMENT', label: 'Registered Rent Agreement' },
        { value: 'BANK_STATEMENT', label: 'Bank Account Statement (recent)' },
        { value: 'PROPERTY_TAX_RECEIPT', label: 'Property Tax Receipt' },
    ];

    const signatureProofOption = { value: 'SIGNATURE', label: 'Signature' };

    // Check if a document type has already been uploaded
    const isDocumentUploaded = (documentValue) => {
        return documents.some(doc => doc.type.includes(documentValue));
    };

    const handleFileChange = (e, documentType, documentValue) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must not exceed 5MB');
            return;
        }

        // Check file type (jpg/png)
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            alert('Only JPG/PNG files are allowed');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result);

            // Add to documents table
            const newDocument = {
                id: Date.now(),
                type: `${documentValue}_JPG`,
                name: `${documentValue.toLowerCase()} document`,
                image: reader.result,
                uploadedAt: new Date().toLocaleString(),
                documentCategory: documentType
            };

            setDocuments([...documents, newDocument]);

            // Reset the corresponding dropdown selection
            if (documentType === 'identity') setSelectedIdentityProof('');
            if (documentType === 'address') setSelectedAddressProof('');
            if (documentType === 'signature') setSelectedSignatureProof('');
        };
        reader.readAsDataURL(file);
    };

    const removeDocument = (id) => {
        setDocuments(documents.filter(doc => doc.id !== id));
        if (documents.length === 1) {
            setPreviewImage(null);
        }
    };

    const triggerFileInput = (documentType, documentValue) => {
        if (!documentValue || isDocumentUploaded(documentValue)) return;

        // Clear previous file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Trigger click on hidden file input
        fileInputRef.current.click();

        // Update the onChange handler temporarily
        const originalOnChange = fileInputRef.current.onchange;
        fileInputRef.current.onchange = (e) => {
            handleFileChange(e, documentType, documentValue);
            fileInputRef.current.onchange = originalOnChange;
        };
    };

    return (
        <div className="document-upload-container p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Upload Documents</h2>
            <div className="text-sm text-gray-600 mb-6 flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>All documents must be scanned copy in jpg/png format - size must not exceed 5mb</span>
            </div>

            <div className="space-y-6">
                {/* Identity Proof Section */}
                <div className="document-section">
                    <h3 className="text-lg font-semibold mb-2">1. Identity Proof</h3>
                    <div className="flex items-center space-x-4">
                        <select
                            className="flex-1 p-2 border rounded"
                            value={selectedIdentityProof}
                            onChange={(e) => setSelectedIdentityProof(e.target.value)}
                        >
                            <option value="">Select Identity Proof</option>
                            {identityProofOptions.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                    disabled={isDocumentUploaded(option.value)}
                                >
                                    {isDocumentUploaded(option.value) ?
                                        `${option.label} (Already Uploaded)` :
                                        option.label}
                                </option>
                            ))}
                        </select>
                        {selectedIdentityProof && !isDocumentUploaded(selectedIdentityProof) && (
                            <button
                                onClick={() => triggerFileInput('identity', selectedIdentityProof)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Upload
                            </button>
                        )}
                    </div>
                </div>

                {/* Address Proof Section */}
                <div className="document-section">
                    <h3 className="text-lg font-semibold mb-2">2. Address Proof</h3>
                    <div className="flex items-center space-x-4">
                        <select
                            className="flex-1 p-2 border rounded"
                            value={selectedAddressProof}
                            onChange={(e) => setSelectedAddressProof(e.target.value)}
                        >
                            <option value="">Select Address Proof</option>
                            {addressProofOptions.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                    disabled={isDocumentUploaded(option.value)}
                                >
                                    {isDocumentUploaded(option.value) ?
                                        `${option.label} (Already Uploaded)` :
                                        option.label}
                                </option>
                            ))}
                        </select>
                        {selectedAddressProof && !isDocumentUploaded(selectedAddressProof) && (
                            <button
                                onClick={() => triggerFileInput('address', selectedAddressProof)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Upload
                            </button>
                        )}
                    </div>
                </div>

                {/* Signature Proof Section */}
                <div className="document-section">
                    <h3 className="text-lg font-semibold mb-2">3. Signature Proof</h3>
                    <div className="flex items-center space-x-4">
                        <select
                            className="flex-1 p-2 border rounded"
                            value={selectedSignatureProof}
                            onChange={(e) => setSelectedSignatureProof(e.target.value)}
                        >
                            <option value="">Select Signature Proof</option>
                            <option
                                value={signatureProofOption.value}
                                disabled={isDocumentUploaded(signatureProofOption.value)}
                            >
                                {isDocumentUploaded(signatureProofOption.value) ?
                                    `${signatureProofOption.label} (Already Uploaded)` :
                                    signatureProofOption.label}
                            </option>
                        </select>
                        {selectedSignatureProof && !isDocumentUploaded(selectedSignatureProof) && (
                            <button
                                onClick={() => triggerFileInput('signature', selectedSignatureProof)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Upload
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg, image/png"
                style={{ display: 'none' }}
            />

            {/* Preview Section */}
            {previewImage && (
                <div className="preview-section mt-8">
                    <h3 className="text-lg font-semibold mb-4">Image</h3>
                    <div className="border p-4 rounded">
                        <img src={previewImage} alt="Document preview" className="max-w-full h-auto" />
                    </div>
                </div>
            )}

            {/* Documents Table */}
            <div className="documents-table mt-8">
                {/* <h3 className="text-lg font-semibold mb-4">Document File</h3> */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Document Type</th>
                                <th className="border p-2 text-left">Image</th>
                                <th className="border p-2 text-left">Signature</th>
                                <th className="border p-2 text-left">Face</th>
                                <th className="border p-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.length > 0 ? (
                                documents.map((doc) => (
                                    <tr key={doc.id} className="border">
                                        <td className="border p-2">{doc.type}</td>
                                        <td className="border p-2">
                                            {doc.image && (
                                                <img
                                                    src={doc.image}
                                                    alt={doc.name}
                                                    className="thumbnail max-w-xs max-h-20"
                                                />
                                            )}
                                        </td>
                                        <td className="border p-2">-</td>
                                        <td className="border p-2">-</td>
                                        <td className="border p-2">
                                            <button
                                                onClick={() => removeDocument(doc.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="border">
                                    <td colSpan="5" className="border p-2 text-center text-gray-500">
                                        No documents uploaded yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DocumentUpload;

