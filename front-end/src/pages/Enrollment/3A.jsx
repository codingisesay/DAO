import { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import Swal from 'sweetalert2';

const DocumentUpload = ({ onDocumentsUpdate }) => {
    const [selectedIdentityProof, setSelectedIdentityProof] = useState('');
    const [selectedAddressProof, setSelectedAddressProof] = useState('');
    const [selectedSignatureProof, setSelectedSignatureProof] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [uploadSide, setUploadSide] = useState(''); // 'front' or 'back' for Aadhaar
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

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

    const validateAadharCard = async (imageData, side) => {
        setLoading(true);
        try {
            const result = await Tesseract.recognize(imageData, 'eng', {
                logger: m => console.log(m)
            });

            const extractedText = result.data.text.toLowerCase();
            // console.log("Extracted Text:", extractedText);

            if (side === 'front') {
                // Front side validation - check for gender and other front-specific details
                const hasGender = extractedText.includes('male') || extractedText.includes('female');
                const hasAadhaarNumber = /\d{4}\s\d{4}\s\d{4}/.test(result.data.text);
                const hasGovtIndia = /government of india/i.test(result.data.text);
                const hasDOB = /\d{2}\/\d{2}\/\d{4}/.test(result.data.text);

                if (!hasGender) {
                    Swal.fire('Error', 'This does not appear to be a valid Aadhaar card front side (gender not found)', 'error');
                    return { isValid: false };
                }

                if (hasGovtIndia && hasAadhaarNumber && hasDOB) {
                    const extractedInfo = {
                        name: result.data.text.match(/([A-Z][a-z]+(\s[A-Z][a-z]+)+)/)?.[0] || 'Not found',
                        dob: result.data.text.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] || 'Not found',
                        gender: hasGender ? (extractedText.includes('female') ? 'FEMALE' : 'MALE') : 'Not found',
                        aadhaarNumber: result.data.text.match(/\d{4}\s\d{4}\s\d{4}/)?.[0] || 'Not found'
                    };

                    return { isValid: true, extractedInfo };
                }

                // Fallback to just gender check if specific patterns not found
                return { isValid: true };
            } else if (side === 'back') {
                // Back side validation - check for UIDAI website
                const hasUIDAI = /uidai\.gov\.in/i.test(result.data.text);
                const hasQRCode = /qr code/i.test(result.data.text);

                if (!hasUIDAI) {
                    Swal.fire('Error', 'This does not appear to be a valid Aadhaar card back side (UIDAI reference not found)', 'error');
                    return { isValid: false };
                }

                return { isValid: true };
            }

            // Default validation if side not specified
            return { isValid: true };

        } catch (error) {
            console.error("Aadhar validation error:", error);
            Swal.fire('Error', 'Failed to process Aadhaar card image', 'error');
            return { isValid: false };
        } finally {
            setLoading(false);
        }
    };

    const validatePANCard = async (imageData) => {
        setLoading(true);
        try {
            const result = await Tesseract.recognize(imageData, 'eng', {
                logger: m => console.log(m)
            });

            const extractedText = result.data.text.toUpperCase();
            // console.log("Extracted PAN Text:", extractedText);

            // Check for PAN number pattern (5 letters, 4 numbers, 1 letter)
            const hasPANNumber = /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(extractedText);

            // Check for "INCOME" text which is present on all PAN cards
            const hasIncomeText = /INCOME/.test(extractedText);

            // Check for "TAX" or "PERMANENT ACCOUNT NUMBER"
            const hasTaxText = /TAX|PERMANENT ACCOUNT NUMBER/.test(extractedText);

            // Check for "GOVERNMENT OF INDIA"
            const hasGovtIndia = /GOVERNMENT OF INDIA/.test(extractedText);

            if (!hasIncomeText) {
                Swal.fire('Error', 'This does not appear to be a valid PAN card ("INCOME" text not found)', 'error');
                return { isValid: false };
            }

            if (!hasPANNumber) {
                Swal.fire('Error', 'This does not appear to be a valid PAN card (PAN number format not found)', 'error');
                return { isValid: false };
            }

            if (hasPANNumber && hasIncomeText && (hasTaxText || hasGovtIndia)) {
                const panNumberMatch = extractedText.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);
                const extractedInfo = {
                    panNumber: panNumberMatch ? panNumberMatch[0] : 'Not found',
                    name: extractedText.match(/[A-Z]+ [A-Z]+/)?.[0] || 'Not found'
                };

                return { isValid: true, extractedInfo };
            }

            return { isValid: true };

        } catch (error) {
            console.error("PAN validation error:", error);
            Swal.fire('Error', 'Failed to process PAN card image', 'error');
            return { isValid: false };
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = async (e, documentType, documentValue, side) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size and type
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire('Error', 'File size must not exceed 5MB', 'error');
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            Swal.fire('Error', 'Only JPG/PNG files are allowed', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const imageData = reader.result;
            setPreviewImage(imageData);

            let isValid = true;
            let extractedInfo = null;

            if (documentValue === 'AADHAAR') {
                const validationResult = await validateAadharCard(imageData, side);
                isValid = validationResult.isValid;
                extractedInfo = validationResult.extractedInfo;
            }
            else if (documentValue === 'PAN') {
                const validationResult = await validatePANCard(imageData);
                isValid = validationResult.isValid;
                extractedInfo = validationResult.extractedInfo;
            }

            if (!isValid) {
                if (fileInputRef.current) fileInputRef.current.value = '';
                setPreviewImage(null);
                return;
            }

            // Determine the document type based on side for Aadhaar
            let docType = documentValue;
            if (documentValue === 'AADHAAR') {
                docType = side === 'front' ? 'AADHAAR_FRONT_JPG' : 'AADHAAR_BACK_JPG';
            } else {
                docType = `${documentValue}_JPG`;
            }

            // Add to documents table
            const newDocument = {
                id: Date.now(),
                type: docType,
                name: side ? `${documentValue.toLowerCase()} ${side}` : `${documentValue.toLowerCase()} document`,
                image: imageData,
                uploadedAt: new Date().toLocaleString(),
                documentCategory: documentType,
                isValid: isValid,
                ...(extractedInfo && { extractedInfo })
            };

            setDocuments([...documents, newDocument]);
            // After updating documents, call the callback
            const updatedDocuments = [...documents, newDocument];
            setDocuments(updatedDocuments);
            if (onDocumentsUpdate) {
                onDocumentsUpdate(updatedDocuments);
            }

            // Only reset dropdown if both sides are uploaded for Aadhaar
            if (documentValue !== 'AADHAAR' ||
                (documentValue === 'AADHAAR' && isDocumentUploaded('AADHAAR'))) {
                if (documentType === 'identity') setSelectedIdentityProof('');
                if (documentType === 'address') setSelectedAddressProof('');
                if (documentType === 'signature') setSelectedSignatureProof('');
            }

        };
        reader.readAsDataURL(file);
    };


    const removeDocument = (id) => {
        const updatedDocuments = documents.filter(doc => doc.id !== id);
        setDocuments(updatedDocuments);
        if (onDocumentsUpdate) {
            onDocumentsUpdate(updatedDocuments);
        }
        const docToRemove = documents.find(doc => doc.id === id);
        setDocuments(documents.filter(doc => doc.id !== id));

        // If removing an Aadhaar document, reset the address proof dropdown if both sides aren't complete
        if (docToRemove?.type.includes('AADHAAR')) {
            const hasFront = documents.some(doc => doc.type === 'AADHAAR_FRONT_JPG' && doc.id !== id);
            const hasBack = documents.some(doc => doc.type === 'AADHAAR_BACK_JPG' && doc.id !== id);

            if (!hasFront || !hasBack) {
                setSelectedAddressProof('AADHAAR');
            }
        }

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

            <div className='grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-6'>
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
                                            `${option.label} ` :
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
                                                    <span className='bi bi-cloud-upload'></span>&nbsp;Front
                                                </button>
                                            )}
                                            {!isAadhaarBackUploaded() && (
                                                <button
                                                    onClick={() => triggerFileInput('address', selectedAddressProof, 'back')}
                                                    className="text-blue-600 text-sm px-2 py-1 border border-blue-600 rounded"
                                                >
                                                    <span className='bi bi-cloud-upload'></span>&nbsp;Back
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