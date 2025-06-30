import { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js'; 
import Swal from 'sweetalert2';

// Add this CSS to your styles or as a style tag
const styles = `
  .signature-display { 
    height: auto;
    width: 100px;
    border-radius:4px
  }
  .thumbnail {
    max-width: 150px;
    max-height: 100px;
  }
`;

const DocumentUpload = ({ onDocumentsUpdate, onProcessDocument, documents }) => {
    const [selectedIdentityProof, setSelectedIdentityProof] = useState('');
    const [selectedAddressProof, setSelectedAddressProof] = useState('');
    const [selectedSignatureProof, setSelectedSignatureProof] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [uploadSide, setUploadSide] = useState('');
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const [activeDocumentType, setActiveDocumentType] = useState('');
    const [activeDocumentValue, setActiveDocumentValue] = useState('');
    const [activeSide, setActiveSide] = useState('');
    const [document, setDocuments ] =  useState();

    const identityProofOptions = [
        { value: 'PAN', label: 'PAN Card' },
        { value: 'VOTER_ID', label: 'Voter ID Card' },
        { value: 'PASSPORT', label: 'Passport' },
        { value: 'DRIVING_LICENSE', label: 'Driving License' },
    ];

    const addressProofOptions = [
        { value: 'AADHAAR_FRONT', label: 'Aadhaar Card Front' },
        { value: 'AADHAAR_BACK', label: 'Aadhaar Card Back' },
        { value: 'UTILITY_BILL', label: 'Electricity/Water/Gas Bill (recent)' },
        { value: 'RENT_AGREEMENT', label: 'Registered Rent Agreement' },
        { value: 'BANK_STATEMENT', label: 'Bank Account Statement (recent)' },
        { value: 'PROPERTY_TAX_RECEIPT', label: 'Property Tax Receipt' },
    ];

    const signatureProofOption = { value: 'SIGNATURE', label: 'Signature' };

    const isDocumentUploaded = (documentValue) => {
        return documents.some(doc => doc.type.includes(documentValue));
    };

    const isAadhaarFrontUploaded = () => {
        return documents.some(doc => doc.type === 'AADHAAR_FRONT_JPG');
    };

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
            
            if (side === 'front') {
                const hasGender = extractedText.includes('male') || extractedText.includes('female');
                const hasAadhaarNumber = /\d{4}\s\d{4}\s\d{4}/.test(result.data.text);
                const hasGovtIndia = /government of india/i.test(result.data.text);
                const hasDOB = /\d{2}\/\d{2}\/\d{4}/.test(result.data.text);

                if (!hasGender) {
                    Swal.fire('Error', 'This does not appear to be a valid Aadhaar card front side (gender not found)', 'error');
                    return { isValid: false };
                }

                if (hasGovtIndia && hasAadhaarNumber && hasDOB || false) {
                    const extractedInfo = {
                        name: result.data.text.match(/([A-Z][a-z]+(\s[A-Z][a-z]+)+)/)?.[0] || 'Not found',
                        dob: result.data.text.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] || 'Not found',
                        gender: hasGender ? (extractedText.includes('female') ? 'FEMALE' : 'MALE') : 'Not found',
                        aadhaarNumber: result.data.text.match(/\d{4}\s\d{4}\s\d{4}/)?.[0] || 'Not found'
                    };

                    return { isValid: true, extractedInfo };
                }

                return { isValid: true };
            } else if (side === 'back') {
                const hasUIDAI = /Address/i.test(result.data.text);

                if (!hasUIDAI) {
                    Swal.fire('Error', 'This does not appear to be a valid Aadhaar card back side (UIDAI reference not found)', 'error');
                    return { isValid: false };
                }

                return { isValid: true };
            }

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
            const hasPANNumber = /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(extractedText);
            const hasIncomeText = /INCOME/.test(extractedText);
            const hasTaxText = /TAX|PERMANENT ACCOUNT NUMBER/.test(extractedText);
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

    const processImage = async (imageData, documentType, documentValue, side, skipValidation = false) => {
        let isValid = true;
        let extractedInfo = null;

        if (!skipValidation) {
            if (documentValue === 'AADHAAR_FRONT' || documentValue === 'AADHAAR_BACK') {
                const validationResult = await validateAadharCard(imageData, documentValue === 'AADHAAR_FRONT' ? 'front' : 'back');
                isValid = validationResult.isValid;
                extractedInfo = validationResult.extractedInfo;
            }
            else if (documentValue === 'PAN') {
                const validationResult = await validatePANCard(imageData);
                isValid = validationResult.isValid;
                extractedInfo = validationResult.extractedInfo;
            }

            if (!isValid) {
                setPreviewImage(null);
                return false;
            }
        }

        let docType = documentValue === 'AADHAAR_FRONT' ? 'AADHAAR_FRONT_JPG' :
            documentValue === 'AADHAAR_BACK' ? 'AADHAAR_BACK_JPG' :
                `${documentValue}_JPG`;

        const blob = await fetch(imageData).then(res => res.blob());
        const file = new File([blob], `${documentValue}.jpg`, { type: 'image/jpeg' });

        const newDocument = {
            id: Date.now(),
            type: docType,
            name: documentValue.includes('AADHAAR') ?
                `${documentValue.replace('_', ' ').toLowerCase()}` :
                `${documentValue.toLowerCase()} document`,
            image: imageData,
            file: file,
            uploadedAt: new Date().toLocaleString(),
            documentCategory: documentType,
            isValid: isValid,
            ...(extractedInfo && { extractedInfo })
        };

        const updatedDocuments = [...documents, newDocument];
        setDocuments(updatedDocuments);
        if (onDocumentsUpdate) {
            onDocumentsUpdate(updatedDocuments);
        }

        // Immediately trigger signature and photo extraction
        if (onProcessDocument) {
            onProcessDocument(newDocument);
        }

        Swal.fire({
            icon: 'success',
            title: 'Document Uploaded',
            text: `${newDocument.name} has been successfully uploaded`,
            timer: 2000,
            showConfirmButton: false
        });

        if (!documentValue.includes('AADHAAR')) {
            if (documentType === 'identity') setSelectedIdentityProof('');
            if (documentType === 'address') setSelectedAddressProof('');
            if (documentType === 'signature') setSelectedSignatureProof('');
        } else {
            const frontUploaded = isAadhaarFrontUploaded();
            const backUploaded = isAadhaarBackUploaded();

            if (frontUploaded && backUploaded) {
                setSelectedAddressProof('');
            } else if (documentValue === 'AADHAAR_FRONT' && !backUploaded) {
                setTimeout(() => {
                    Swal.fire({
                        icon: 'info',
                        title: 'Upload Back Side',
                        text: 'Please upload the back side of your Aadhaar card to complete the process',
                        timer: 3000,
                        showConfirmButton: true
                    });
                }, 1000);
            }
        }

        return true;
    };

    const handleFileChange = async (e, documentType, documentValue, side) => {
        const file = e.target.files[0];
        if (!file) return;

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
            await processImage(imageData, documentType, documentValue, side);
        };
        reader.readAsDataURL(file);
    };

    const startCamera = async (documentType, documentValue, side) => {
        setActiveDocumentType(documentType);
        setActiveDocumentValue(documentValue);
        setActiveSide(side);

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            setStream(mediaStream);
            setShowCameraModal(true);

            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);
        } catch (err) {
            console.error("Error accessing camera:", err);
            Swal.fire('Error', 'Could not access the camera. Please check permissions.', 'error');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowCameraModal(false);
    };

    const capturePhoto = async () => {
        if (!videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/jpeg');
        setPreviewImage(imageData);

        const success = await processImage(imageData, activeDocumentType, activeDocumentValue, activeSide, true);
        if (success) {
            stopCamera();
        }
    };

    const removeDocument = (id) => {
        const docToRemove = documents.find(doc => doc.id === id);
        const updatedDocuments = documents.filter(doc => doc.id !== id);
        setDocuments(updatedDocuments);
        if (onDocumentsUpdate) {
            onDocumentsUpdate(updatedDocuments);
        }

        Swal.fire({
            icon: 'success',
            title: 'Document Removed',
            text: `${docToRemove.name} has been removed`,
            timer: 2000,
            showConfirmButton: false
        });

        if (docToRemove?.type.includes('AADHAAR')) {
            if (docToRemove.type === 'AADHAAR_FRONT_JPG') {
                setSelectedAddressProof('AADHAAR_FRONT');
            } else if (docToRemove.type === 'AADHAAR_BACK_JPG') {
                setSelectedAddressProof('AADHAAR_BACK');
            }
        }

        if (documents.length === 1) {
            setPreviewImage(null);
        }
    };

    const triggerFileInput = (documentType, documentValue, side) => {
        if (!documentValue || isDocumentUploaded(documentValue)) return;

        if (documentValue.includes('AADHAAR')) {
            setUploadSide(documentValue === 'AADHAAR_FRONT' ? 'front' : 'back');
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        fileInputRef.current.click();

        const originalOnChange = fileInputRef.current.onchange;
        fileInputRef.current.onchange = (e) => {
            handleFileChange(e, documentType, documentValue, side);
            fileInputRef.current.onchange = originalOnChange;
        };
    };

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [stream]);

    return (
        <div className="document-upload-container p-4 mx-auto">
            <h2 className="text-xl font-bold mb-1">Upload Documents</h2>
            <div className="text-sm text-gray-600 mb-6 flex items-center text-green-700">
                <i className="bi bi-info-circle"></i>&nbsp;
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
                                            `${option.label} (Uploaded)` :
                                            option.label}
                                    </option>
                                ))}
                            </select> &emsp;
                            {selectedIdentityProof && !isDocumentUploaded(selectedIdentityProof) && (
                                <div className="mt-2 flex flex-col">
                                    <div className="flex justify-center gap-4">
                                        <span className="bi bi-cloud-upload mr-2" onClick={() => triggerFileInput('identity', selectedIdentityProof, '')}></span>
                                        <span className="bi bi-camera mr-2" onClick={() => startCamera('identity', selectedIdentityProof, '')}></span>
                                    </div>
                                </div>
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
                                        disabled={
                                            option.value.includes('AADHAAR') ?
                                                isDocumentUploaded(option.value) :
                                                isDocumentUploaded(option.value)
                                        }
                                    >
                                        {isDocumentUploaded(option.value) ?
                                            `${option.label} (Uploaded)` :
                                            option.label}
                                    </option>
                                ))}
                            </select> &emsp;
                            {selectedAddressProof && !isDocumentUploaded(selectedAddressProof) && (
                                <div className="mt-2">
                                    <div className="flex flex-col">
                                        <div className="flex justify-center gap-4">
                                            <span className="bi bi-cloud-upload mr-2" onClick={() => triggerFileInput('address', selectedAddressProof, '')}></span>
                                            <span className="bi bi-camera mr-2" onClick={() => startCamera('address', selectedAddressProof, '')}></span>
                                        </div>
                                    </div>
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
                                        `${signatureProofOption.label} (Uploaded)` :
                                        signatureProofOption.label}
                                </option>
                            </select>&emsp;

                            {selectedSignatureProof && !isDocumentUploaded(selectedSignatureProof) && (
                                <div className="mt-2 flex flex-col">
                                    <div className="flex justify-center gap-4">
                                        <span className="bi bi-cloud-upload mr-2" onClick={() => triggerFileInput('signature', selectedSignatureProof, '')}></span>
                                        <span className="bi bi-camera mr-2" onClick={() => startCamera('signature', selectedSignatureProof, '')}></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/jpeg, image/png"
                    style={{ display: 'none' }}
                />

                <div className="preview-section my-1">
                    <div className="text-center p-1 rounded">
                        {previewImage ?
                            (<>  <small> Accepted </small><img src={previewImage} alt="Document preview" className="h-[200px] w-auto mx-auto border-2 rounded-lg" /></>)
                            : (<>Priview</>)}
                    </div>
                </div>
            </div>

            <div className="documents-table mt-8">
                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-left">Document Type</th>
                                <th className="border p-2 text-left">Image</th>
                                <th className="border p-2 text-left">Signature</th>
                                <th className="border p-2 text-left">Photo</th>
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
                                        {/* <td className="border p-2">
                                            {doc.signatures && doc.signatures.length > 0 ? (
                                                <img
                                                    src={`data:image/jpeg;base64,${doc.signatures[0].image}`}
                                                    alt="Signature"
                                                    className="thumbnail max-w-xs max-h-15"
                                                />
                                            ) : '-'}
                                        </td> */}
                                         
<style>{styles}</style>
 
<td className="border p-2">
  {doc.signatures && doc.signatures.length > 0 ? (
    <img
      src={`data:image/jpeg;base64,${doc.signatures[0].image}`}
      alt="Signature"
      className="signature-display"
    />
  ) : '-'}
</td>
                                        <td className="border p-2">
                                            {doc.photographs && doc.photographs.length > 0 ? (
                                                <img
                                                    src={`data:image/jpeg;base64,${doc.photographs[0].image}`}
                                                    alt="Photograph"
                                                    className="thumbnail max-w-xs max-h-15"
                                                />
                                            ) : '-'}
                                        </td>
                                        <td className="border p-2">
                                            <button
                                                onClick={() => removeDocument(doc.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <i className="bi bi-trash"></i>
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

            {showCameraModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Take Photo</h3>
                            <button onClick={stopCamera} className="text-gray-500 hover:text-gray-700">
                                <span className="bi bi-x text-xl"></span>
                            </button>
                        </div>
                        <div className="mb-4">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-auto border rounded"
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={capturePhoto}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full"
                            >
                                <span className="bi bi-camera text-xl"></span>
                            </button>
                        </div>
                        <div className="mt-4 text-sm text-gray-600 text-center">
                            Position the document clearly in the frame and click the camera button
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;