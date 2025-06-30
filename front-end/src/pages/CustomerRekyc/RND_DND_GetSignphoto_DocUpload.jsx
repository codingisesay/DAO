
import { useState, useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';
import { Upload, Camera, X, Trash2, Info } from 'lucide-react';
import workingman from '../../assets/imgs/upload_placeholder.png';

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
    const [document, setDocuments] = useState(documents || []);

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
function toTitleCase(str) {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}
    const isDocumentUploaded = (documentValue) => {
        return document.some(doc => doc.type.includes(documentValue));
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
                    return { isValid: false, error: 'This does not appear to be a valid Aadhaar card front side (gender not found)' };
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
            } else if (side === 'back') {
                const hasUIDAI = /Address/i.test(result.data.text);
                if (!hasUIDAI) {
                    return { isValid: false, error: 'This does not appear to be a valid Aadhaar card back side (UIDAI reference not found)' };
                }
            }

            return { isValid: true };

        } catch (error) {
            console.error("Aadhar validation error:", error);
            return { isValid: false, error: 'Failed to process Aadhaar card image' };
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
                return { isValid: false, error: 'This does not appear to be a valid PAN card ("INCOME" text not found)' };
            }

            if (!hasPANNumber) {
                return { isValid: false, error: 'This does not appear to be a valid PAN card (PAN number format not found)' };
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
            return { isValid: false, error: 'Failed to process PAN card image' };
        } finally {
            setLoading(false);
        }
    };

    const processImage = async (imageData, documentType, documentValue, side, skipValidation = false) => {
        let isValid = true;
        let extractedInfo = null;
        let errorMessage = '';

        if (!skipValidation) {
            let validationResult;
            if (documentValue === 'AADHAAR_FRONT' || documentValue === 'AADHAAR_BACK') {
                validationResult = await validateAadharCard(imageData, documentValue === 'AADHAAR_FRONT' ? 'front' : 'back');
            }
            else if (documentValue === 'PAN') {
                validationResult = await validatePANCard(imageData);
            }

            if (validationResult) {
                isValid = validationResult.isValid;
                extractedInfo = validationResult.extractedInfo;
                errorMessage = validationResult.error;
            }

            if (!isValid) {
                setPreviewImage(null);
                return { success: false, error: errorMessage };
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
                `${ toTitleCase(  documentValue.replace(/_/g, ' '))}` :
                `${ toTitleCase(  documentValue.replace(/_/g, ' '))}`,

            image: imageData,
            file: file,
            uploadedAt: new Date().toLocaleString(),
            documentCategory: documentType,
            isValid: isValid,
            ...(extractedInfo && { extractedInfo })
        };

        const updatedDocuments = [...document, newDocument];
        setDocuments(updatedDocuments);
        if (onDocumentsUpdate) {
            onDocumentsUpdate(updatedDocuments);
        }

        if (onProcessDocument) {
            onProcessDocument(newDocument);
        }

        return { success: true };
    };

    const handleFileChange = async (e, documentType, documentValue, side) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            return { success: false, error: 'File size must not exceed 5MB' };
        }

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            return { success: false, error: 'Only JPG/PNG files are allowed' };
        }

        const reader = new FileReader();
        reader.onload = async () => {
            const imageData = reader.result;
            setPreviewImage(imageData);
            const result = await processImage(imageData, documentType, documentValue, side);
            if (!result.success) {
                // Handle error
            }
        };
        reader.readAsDataURL(file);
    };

    const startCamera = (documentType, documentValue) => {
        setActiveDocumentType(documentType);
        setActiveDocumentValue(documentValue);
        setShowCameraModal(true);

        if (typeof window !== 'undefined' && navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(stream => {
                    setStream(stream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => {
                    console.error("Camera error:", err);
                    return { success: false, error: 'Could not access camera. Please ensure you have granted camera permissions.' };
                });
        } else {
            return { success: false, error: 'Camera access not supported in this environment.' };
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowCameraModal(false);
    };

    const capturePhoto = () => {
        if (typeof window === 'undefined' || !window.document || !videoRef.current) {
            console.error("Attempted to capture photo in a non-browser environment or without video stream.");
            return { success: false, error: 'Cannot capture photo: Browser environment or video stream not ready.' };
        }

        const canvas = window.document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/jpeg');
        setPreviewImage(imageData);

        processImage(imageData, activeDocumentType, activeDocumentValue, '', true)
            .then(result => {
                if (result.success) {
                    stopCamera();
                }
            });
    };

    const removeDocument = (id) => {
        const docToRemove = document.find(doc => doc.id === id);
        const updatedDocuments = document.filter(doc => doc.id !== id);
        setDocuments(updatedDocuments);
        if (onDocumentsUpdate) {
            onDocumentsUpdate(updatedDocuments);
        }

        if (document.length === 1) {
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

    useEffect(() => {
        setDocuments(documents || []);
    }, [documents]);

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
                            (<>  <small>  </small><img src={previewImage} alt="Document preview" className="h-[200px] w-auto mx-auto border-2 rounded-lg" /></>)
                            : (<><img src={workingman} alt="logo"  className="h-[200px] w-auto mx-auto "/></>)}
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
                                         
                                            <style>{styles}</style>
                                            
                                            <td className="border p-2">
                                            {doc.signatures && doc.signatures.length > 0 ? (
                                                <img
                                                src={`data:image/jpeg;base64,${doc.signatures[0].image}`}
                                                alt="Signature"
                                                className="signature-display max-w-xs max-h-15"
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

