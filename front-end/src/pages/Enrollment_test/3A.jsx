import { useState, useRef } from 'react';

const DocumentUpload = () => {
    const [selectedIdentityProof, setSelectedIdentityProof] = useState('');
    const [selectedAddressProof, setSelectedAddressProof] = useState('');
    const [selectedSignatureProof, setSelectedSignatureProof] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [uploadSide, setUploadSide] = useState(''); // 'front' or 'back' for Aadhaar
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
        if (documentValue === 'AADHAAR') {
            // For Aadhaar, check if both front and back are uploaded
            const frontUploaded = documents.some(doc => doc.type === 'AADHAAR_FRONT_JPG');
            const backUploaded = documents.some(doc => doc.type === 'AADHAAR_BACK_JPG');
            return frontUploaded && backUploaded;
        }
        return documents.some(doc => doc.type.includes(documentValue));
    };

    // Check if Aadhaar front is uploaded
    const isAadhaarFrontUploaded = () => {
        return documents.some(doc => doc.type === 'AADHAAR_FRONT_JPG');
    };

    // Check if Aadhaar back is uploaded
    const isAadhaarBackUploaded = () => {
        return documents.some(doc => doc.type === 'AADHAAR_BACK_JPG');
    };

    const handleFileChange = (e, documentType, documentValue, side) => {
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

            // Determine document type with side if Aadhaar
            let docType = `${documentValue}_JPG`;
            let docName = `${documentValue.toLowerCase()} document`;

            if (documentValue === 'AADHAAR') {
                docType = `AADHAAR_${side.toUpperCase()}_JPG`;
                docName = `Aadhaar Card (${side})`;
            }

            // Add to documents table
            const newDocument = {
                id: Date.now(),
                type: docType,
                name: docName,
                image: reader.result,
                uploadedAt: new Date().toLocaleString(),
                documentCategory: documentType
            };

            setDocuments([...documents, newDocument]);

            // Reset the corresponding dropdown selection if completed
            if (documentValue === 'AADHAAR') {
                if (isAadhaarFrontUploaded() && isAadhaarBackUploaded()) {
                    setSelectedAddressProof('');
                }
            } else {
                if (documentType === 'identity') setSelectedIdentityProof('');
                if (documentType === 'address') setSelectedAddressProof('');
                if (documentType === 'signature') setSelectedSignatureProof('');
            }

            setUploadSide('');
        };
        reader.readAsDataURL(file);
    };

    const removeDocument = (id) => {
        setDocuments(documents.filter(doc => doc.id !== id));
        if (documents.length === 1) {
            setPreviewImage(null);
        }
    };

    const triggerFileInput = (documentType, documentValue, side) => {
        if (!documentValue || (documentValue !== 'AADHAAR' && isDocumentUploaded(documentValue))) return;

        // Set which side we're uploading
        if (documentValue === 'AADHAAR') {
            setUploadSide(side);
        }

        // Clear previous file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        // Trigger click on hidden file input
        fileInputRef.current.click();

        // Update the onChange handler temporarily
        const originalOnChange = fileInputRef.current.onchange;
        fileInputRef.current.onchange = (e) => {
            handleFileChange(e, documentType, documentValue, side);
            fileInputRef.current.onchange = originalOnChange;
        };
    };

    return (
        <div className="document-upload-container p-4 mx-auto">
            <h2 className="text-2xl font-bold mb-1">Upload Documents</h2>
            <div className="text-sm text-gray-600 mb-6 flex items-center">
                <input type="checkbox" className="mr-2" />
                <span>All documents must be scanned copy in jpg/png format - size must not exceed 5mb</span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className="space-y-6">
                    {/* Identity Proof Section */}
                    <div className="document-section">
                        <div className="flex items-center relative">
                            <span className='absolute top-0 text-xs mx-2 bg-white px-1'>Identity Proof</span>
                            <select
                                className="flex-1 p-2 border rounded mt-2"
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
                                <span
                                    onClick={() => triggerFileInput('identity', selectedIdentityProof, '')}
                                    className="bi bi-cloud-upload ms-4 text-xl text-blue-600 cursor-pointer"
                                    title="Upload"
                                > </span>
                            )}
                        </div>
                    </div>

                    {/* Address Proof Section */}
                    <div className="document-section">
                        <div className="flex items-center relative">
                            <span className='absolute top-0 text-xs mx-2 bg-white px-1'>Address Proof</span>
                            <select
                                className="flex-1 p-2 border rounded mt-2"
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
                                <div className="flex items-center ms-4 gap-2">
                                    {selectedAddressProof === 'AADHAAR' ? (
                                        <>
                                            {!isAadhaarFrontUploaded() && (
                                                <button
                                                    onClick={() => triggerFileInput('address', selectedAddressProof, 'front')}
                                                    className="text-blue-600 text-sm px-2 py-1 border border-blue-600 rounded"
                                                >
                                                    Upload Front
                                                </button>
                                            )}
                                            {!isAadhaarBackUploaded() && (
                                                <button
                                                    onClick={() => triggerFileInput('address', selectedAddressProof, 'back')}
                                                    className="text-blue-600 text-sm px-2 py-1 border border-blue-600 rounded"
                                                >
                                                    Upload Back
                                                </button>
                                            )}
                                        </>
                                    ) : (
                                        <span
                                            onClick={() => triggerFileInput('address', selectedAddressProof, '')}
                                            className="bi bi-cloud-upload text-xl text-blue-600 cursor-pointer"
                                            title="Upload"
                                        > </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Signature Proof Section */}
                    <div className="document-section">
                        <div className="flex items-center relative">
                            <span className='absolute top-0 text-xs mx-2 bg-white px-1'>Signature</span>
                            <select
                                className="flex-1 p-2 border rounded mt-2"
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
                                <span
                                    onClick={() => triggerFileInput('signature', selectedSignatureProof, '')}
                                    className="bi bi-cloud-upload ms-4 text-xl text-blue-600 cursor-pointer"
                                    title="Upload"
                                > </span>
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
                    <div className="preview-section my-1">
                        <div className="text-center p-1 rounded">
                            <img src={previewImage} alt="Document preview" className="h-[200px] w-auto mx-auto border-2 rounded-lg" />
                            {uploadSide && (
                                <p className="mt-2 text-sm font-medium">Uploading: Aadhaar {uploadSide}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* Documents Table */}
            <div className="documents-table mt-8">
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
                                        <td className="border p-2">{doc.name}</td>
                                        <td className="border p-2">
                                            {doc.image && (
                                                <img
                                                    src={doc.image}
                                                    alt={doc.name}
                                                    className="thumbnail max-w-xs max-h-15"
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