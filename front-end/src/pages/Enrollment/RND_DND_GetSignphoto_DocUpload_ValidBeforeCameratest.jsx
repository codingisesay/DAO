 


import { useState, useRef, useEffect } from 'react';
// Tesseract.js import removed. It's assumed to be available globally (e.g., via a <script> tag in the environment)
// to resolve the "Could not resolve 'tesseract.js'" compilation error.
// If Tesseract is not globally available, you might need to install it via npm/yarn: npm install tesseract.js

import { Upload, Camera, X, Trash2, Info } from 'lucide-react'; // Importing icons from lucide-react

// Placeholder image for initial display
const workingman = 'https://placehold.co/400x200/cccccc/333333?text=Upload+Document';

// Custom Alert Modal Component to replace SweetAlert2
const AlertModal = ({ show, title, message, type, onClose }) => {
    if (!show) return null;

    let bgColor, borderColor, textColor;
    let icon;
    // Define styles and icons based on alert type
    switch (type) {
        case 'success':
            bgColor = 'bg-green-100';
            borderColor = 'border-green-400';
            textColor = 'text-green-700';
            icon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>;
            break;
        case 'error':
            bgColor = 'bg-red-100';
            borderColor = 'border-red-400';
            textColor = 'text-red-700';
            icon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>;
            break;
        case 'info':
            bgColor = 'bg-blue-100';
            borderColor = 'border-blue-400';
            textColor = 'text-blue-700';
            icon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
            break;
        default:
            bgColor = 'bg-gray-100';
            borderColor = 'border-gray-400';
            textColor = 'text-gray-700';
            icon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-circle"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-inter">
            <div className={`rounded-lg shadow-lg p-6 ${bgColor} border ${borderColor} max-w-sm w-full relative flex items-start space-x-3`}>
                <div className={`flex-shrink-0 ${textColor}`}>{icon}</div>
                <div className="flex-grow">
                    <h3 className={`text-lg font-bold mb-1 ${textColor}`}>{title}</h3>
                    <p className={`text-sm ${textColor}`}>{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                    aria-label="Close alert"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

const DocumentUpload = ({ onDocumentsUpdate, onProcessDocument, documents }) => {
    // State variables for selected document types
    const [selectedIdentityProof, setSelectedIdentityProof] = useState('');
    const [selectedAddressProof, setSelectedAddressProof] = useState('');
    const [selectedSignatureProof, setSelectedSignatureProof] = useState('');
    // State for image preview and file input reference
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);
    // State for loading indicator during OCR processing
    const [loading, setLoading] = useState(false);
    // State to track the currently active document type and value for camera capture
    const [activeDocumentType, setActiveDocumentType] = useState('');
    const [activeDocumentValue, setActiveDocumentValue] = useState('');
    // State to store uploaded documents, initialized with prop or empty array
    const [uploadedDocuments, setUploadedDocuments] = useState(documents || []);
    // Reference for the video element for camera stream
    const videoRef = useRef(null);
    // State to control camera modal visibility
    const [showCamera, setShowCamera] = useState(false);

    // State for custom alert modal
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: '' });

    // Function to show custom alert messages
    const showAlertMessage = (title, message, type, duration = 2000) => {
        setAlertConfig({ title, message, type });
        setShowAlert(true);
        if (duration > 0) { // Auto-close after a duration if specified
            setTimeout(() => setShowAlert(false), duration);
        }
    };

    // Options for Identity Proof dropdown
    const identityProofOptions = [
        { value: 'PAN', label: 'PAN Card' },
        { value: 'VOTER_ID', label: 'Voter ID Card' },
        { value: 'PASSPORT', label: 'Passport' },
        { value: 'DRIVING_LICENSE', label: 'Driving License' },
    ];

    // Options for Address Proof dropdown
    const addressProofOptions = [
        { value: 'AADHAAR_FRONT', label: 'Aadhaar Card Front' },
        { value: 'AADHAAR_BACK', label: 'Aadhaar Card Back' },
        { value: 'UTILITY_BILL', label: 'Electricity/Water/Gas Bill (recent)' },
        { value: 'RENT_AGREEMENT', label: 'Registered Rent Agreement' },
        { value: 'BANK_STATEMENT', label: 'Bank Account Statement (recent)' },
        { value: 'PROPERTY_TAX_RECEIPT', label: 'Property Tax Receipt' },
    ];

    // Option for Signature Proof
    const signatureProofOption = { value: 'Signature', label: 'Signature' };

    // Helper function to check if a document of a specific value has already been uploaded
    const isDocumentUploaded = (documentValue) => {
        return uploadedDocuments.some(doc => doc.type.includes(documentValue));
    };

    // Helper functions for Aadhaar card specific checks
    const isAadhaarFrontUploaded = () => {
        return uploadedDocuments.some(doc => doc.type === 'AADHAAR_FRONT_JPG');
    };

    const isAadhaarBackUploaded = () => {
        return uploadedDocuments.some(doc => doc.type === 'AADHAAR_BACK_JPG');
    };

    // OCR validation for Aadhaar Card
    const validateAadharCard = async (imageData, side) => {
        setLoading(true);
        try {
            // Ensure Tesseract is available globally
            if (typeof Tesseract === 'undefined' || !Tesseract.recognize) {
                showAlertMessage('Error', 'Tesseract.js is not loaded. Please ensure it is available in the environment.', 'error');
                return { isValid: false };
            }
            const result = await Tesseract.recognize(imageData, 'eng', {
                logger: m => console.log(m) // Log OCR progress
            });

            const extractedText = result.data.text.toLowerCase();

            if (side === 'FRONT') {
                // Check for key indicators of Aadhaar front side
                const hasGender = extractedText.includes('male') || extractedText.includes('female');
                const hasAadhaarNumber = /\d{4}\s\d{4}\s\d{4}/.test(result.data.text);
                const hasGovtIndia = /government of india/i.test(extractedText);
                const hasDOB = /\d{2}\/\d{2}\/\d{4}/.test(result.data.text);

                if (!hasGender) {
                    showAlertMessage('Error', 'This does not appear to be a valid Aadhaar card front side (gender not found)', 'error');
                    return { isValid: false };
                }

                if (hasGovtIndia && hasAadhaarNumber && hasDOB) {
                    // Extract relevant information
                    const extractedInfo = {
                        name: result.data.text.match(/([A-Z][a-z]+(\s[A-Z][a-z]+)+)/)?.[0] || 'Not found',
                        dob: result.data.text.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] || 'Not found',
                        gender: hasGender ? (extractedText.includes('female') ? 'FEMALE' : 'MALE') : 'Not found',
                        aadhaarNumber: result.data.text.match(/\d{4}\s\d{4}\s\d{4}/)?.[0] || 'Not found'
                    };
                    return { isValid: true, extractedInfo };
                }

                showAlertMessage('Error', 'This does not appear to be a valid Aadhaar card front side (missing key info)', 'error');
                return { isValid: false };
            } else if (side === 'BACK') {
                // Check for key indicators of Aadhaar back side
                const hasAddress = /address/i.test(extractedText); // Case-insensitive check for 'address'

                if (!hasAddress) {
                    showAlertMessage('Error', 'This does not appear to be a valid Aadhaar card back side (address/UIDAI reference not found)', 'error');
                    return { isValid: false };
                }
                return { isValid: true };
            }

            return { isValid: true }; // Default to true if not Aadhaar
        } catch (error) {
            console.error("Aadhar validation error:", error);
            showAlertMessage('Error', 'Failed to process Aadhaar card image', 'error');
            return { isValid: false };
        } finally {
            setLoading(false);
        }
    };

    // OCR validation for PAN Card
    const validatePANCard = async (imageData) => {
        setLoading(true);
        try {
            // Ensure Tesseract is available globally
            if (typeof Tesseract === 'undefined' || !Tesseract.recognize) {
                showAlertMessage('Error', 'Tesseract.js is not loaded. Please ensure it is available in the environment.', 'error');
                return { isValid: false };
            }
            const result = await Tesseract.recognize(imageData, 'eng', {
                logger: m => console.log(m) // Log OCR progress
            });

            const extractedText = result.data.text.toUpperCase();
            // Check for key indicators of PAN card
            const hasPANNumber = /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(extractedText);
            const hasIncomeText = /INCOME/.test(extractedText);
            const hasTaxText = /TAX|PERMANENT ACCOUNT NUMBER/.test(extractedText);
            const hasGovtIndia = /GOVERNMENT OF INDIA/.test(extractedText);

            if (!hasIncomeText) {
                showAlertMessage('Error', 'This does not appear to be a valid PAN card ("INCOME" text not found)', 'error');
                return { isValid: false };
            }

            if (!hasPANNumber) {
                showAlertMessage('Error', 'This does not appear to be a valid PAN card (PAN number format not found)', 'error');
                return { isValid: false };
            }

            if (hasPANNumber && hasIncomeText && (hasTaxText || hasGovtIndia)) {
                // Extract PAN number and attempt to extract name
                const panNumberMatch = extractedText.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);
                const extractedInfo = {
                    panNumber: panNumberMatch ? panNumberMatch[0] : 'Not found',
                    // This regex attempts to find a name near "NAME" or "FATHER'S NAME"
                    name: extractedText.match(/(?:NAME|FATHER'S NAME|FATHER NAME)\s*[:]?\s*([A-Z\s.]+)/)?.[1] || 'Not found'
                };
                return { isValid: true, extractedInfo };
            }

            showAlertMessage('Error', 'This does not appear to be a valid PAN card (missing key info)', 'error');
            return { isValid: false };
        } catch (error) {
            console.error("PAN validation error:", error);
            showAlertMessage('Error', 'Failed to process PAN card image', 'error');
            return { isValid: false };
        } finally {
            setLoading(false);
        }
    };

    // Main function to process the uploaded or captured image
    const processImage = async (imageData, documentType, documentValue, side, skipValidation = false) => {
        let isValid = true;
        let extractedInfo = null;

        // Perform OCR validation unless skipped (e.g., for signature where OCR isn't critical)
        if (!skipValidation) {
            if (documentValue.includes('AADHAAR')) {
                const validationResult = await validateAadharCard(imageData, documentValue.includes('FRONT') ? 'FRONT' : 'BACK');
                isValid = validationResult.isValid;
                extractedInfo = validationResult.extractedInfo;
            } else if (documentValue === 'PAN') {
                const validationResult = await validatePANCard(imageData);
                isValid = validationResult.isValid;
                extractedInfo = validationResult.extractedInfo;
            }

            if (!isValid) {
                setPreviewImage(null);
                return false;
            }
        }

        // Determine the final document type string
        let docType = documentValue === 'AADHAAR_FRONT' ? 'AADHAAR_FRONT_JPG' :
            documentValue === 'AADHAAR_BACK' ? 'AADHAAR_BACK_JPG' :
                `${documentValue}_JPG`;

        // Convert base64 image data to a File object
        const blob = await fetch(imageData).then(res => res.blob());
        const file = new File([blob], `${documentValue}.jpg`, { type: 'image/jpeg' });

        // Create a new document object
        const newDocument = {
            id: Date.now(), // Unique ID for the document
            type: docType,
            name: documentValue.includes('AADHAAR') ?
                `${documentValue.replace('_', ' ').toUpperCase()}` :
                `${documentValue.replace('_', ' ').toUpperCase()}`,
            image: imageData, // Base64 image data
            file: file, // File object
            uploadedAt: new Date().toLocaleString(),
            documentCategory: documentType,
            isValid: isValid,
            ...(extractedInfo && { extractedInfo }) // Add extracted info if available
        };

        // Update the list of uploaded documents
        const updatedDocuments = [...uploadedDocuments, newDocument];
        setUploadedDocuments(updatedDocuments);
        if (onDocumentsUpdate) {
            onDocumentsUpdate(updatedDocuments); // Callback to parent
        }

        if (onProcessDocument) {
            onProcessDocument(newDocument); // Callback to parent for further processing
        }

        showAlertMessage('Document Uploaded', `${newDocument.name} has been successfully uploaded`, 'success');

        // Logic to update dropdown selections based on uploaded documents
        if (!documentValue.includes('AADHAAR')) {
            if (documentType === 'identity') setSelectedIdentityProof('');
            if (documentType === 'address') setSelectedAddressProof('');
            if (documentType === 'signature') setSelectedSignatureProof('');
        } else {
            const frontUploaded = isAadhaarFrontUploaded();
            const backUploaded = isAadhaarBackUploaded();

            if (frontUploaded && backUploaded) {
                setSelectedAddressProof(''); // Both Aadhaar sides uploaded, clear address proof selection
            } else if (documentValue === 'AADHAAR_FRONT' && !backUploaded) {
                // If only front is uploaded, prompt user to upload back side
                setTimeout(() => {
                    showAlertMessage('Upload Back Side', 'Please upload the back side of your Aadhaar card to complete the process', 'info', 0); // No auto-close
                }, 1000);
            }
        }

        return true;
    };

    // Handler for file input change (upload from device)
    const handleFileChange = async (e, documentType, documentValue, side) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size and type
        if (file.size > 5 * 1024 * 1024) {
            showAlertMessage('Error', 'File size must not exceed 5MB', 'error');
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            showAlertMessage('Error', 'Only JPG/PNG files are allowed', 'error');
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

    // Function to start camera stream
    const startCamera = (documentType, documentValue) => {
        setActiveDocumentType(documentType);
        setActiveDocumentValue(documentValue);
        setShowCamera(true);

        // Request camera access only in browser environment
        if (typeof window !== 'undefined' && navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch(err => {
                    console.error("Camera error:", err);
                    showAlertMessage('Error', 'Could not access camera. Please ensure you have granted camera permissions.', 'error');
                    setShowCamera(false);
                });
        } else {
            showAlertMessage('Error', 'Camera access not supported in this environment.', 'error');
            setShowCamera(false);
        }
    };

    // Function to stop camera stream
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setShowCamera(false);
    };

    // Function to capture photo from camera stream
    const capturePhoto = () => {
        // **CRITICAL FIX**: Explicitly check for window.document to ensure browser environment
        if (typeof window === 'undefined' || !window.document || !videoRef.current) {
            console.error("Attempted to capture photo in a non-browser environment or without video stream.");
            showAlertMessage('Error', 'Cannot capture photo: Browser environment or video stream not ready.', 'error');
            return;
        }

        const canvas = window.document.createElement('canvas'); // Use window.document
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL('image/jpeg');
        setPreviewImage(imageData);

        // Process the captured image, skipping OCR validation for a smoother capture experience
        processImage(imageData, activeDocumentType, activeDocumentValue, '', true)
            .then(success => {
                if (success) {
                    stopCamera(); // Stop camera only if processing was successful
                }
            });
    };

    // Function to remove an uploaded document
    const removeDocument = (id) => {
        const docToRemove = uploadedDocuments.find(doc => doc.id === id);
        const updatedDocuments = uploadedDocuments.filter(doc => doc.id !== id);
        setUploadedDocuments(updatedDocuments);
        if (onDocumentsUpdate) {
            onDocumentsUpdate(updatedDocuments); // Callback to parent
        }

        showAlertMessage('Document Removed', `${docToRemove.name} has been removed`, 'success');

        // Logic to reset dropdown selection if an Aadhaar document is removed
        if (docToRemove?.type.includes('AADHAAR')) {
            if (docToRemove.type === 'AADHAAR_FRONT_JPG' && isAadhaarBackUploaded()) {
                // If front removed but back exists, re-enable front selection
                setSelectedAddressProof('AADHAAR_FRONT');
            } else if (docToRemove.type === 'AADHAAR_BACK_JPG' && isAadhaarFrontUploaded()) {
                // If back removed but front exists, re-enable back selection
                setSelectedAddressProof('AADHAAR_BACK');
            } else {
                setSelectedAddressProof(''); // If both removed or only one was removed, clear selection
            }
        }

        // Clear preview image if no documents are left
        if (updatedDocuments.length === 0) {
            setPreviewImage(null);
        }
    };

    // Function to programmatically trigger the hidden file input
    const triggerFileInput = (documentType, documentValue, side) => {
        if (!documentValue || isDocumentUploaded(documentValue)) return;

        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear any previously selected file
        }

        fileInputRef.current.click();

        // Dynamically assign onchange handler for the specific upload
        // This pattern can sometimes lead to unexpected behavior if not managed carefully.
        // A more robust solution for multiple file inputs might involve separate inputs or a more complex state for handling.
        const originalOnChange = fileInputRef.current.onchange;
        fileInputRef.current.onchange = (e) => {
            handleFileChange(e, documentType, documentValue, side);
            fileInputRef.current.onchange = originalOnChange; // Restore original handler
        };
    };

    // useEffect for component unmount cleanup (stop camera)
    useEffect(() => {
        return () => {
            stopCamera(); // Stop camera stream when component unmounts
        };
    }, []);

    // useEffect to sync internal uploadedDocuments state with the 'documents' prop
    useEffect(() => {
        setUploadedDocuments(documents || []);
    }, [documents]); // Rerun when 'documents' prop changes


    return (
        <div className="document-upload-container p-4 mx-auto max-w-4xl font-inter bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            {/* Custom Alert Modal */}
            {showAlert && (
                <AlertModal
                    show={showAlert}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    type={alertConfig.type}
                    onClose={() => setShowAlert(false)}
                />
            )}

            <h2 className="text-2xl font-bold mb-1 text-gray-800 dark:text-white">Upload Documents</h2>
            <div className="text-sm text-gray-600 mb-6 flex items-center text-green-700 dark:text-green-400">
                <Info size={16} className="mr-1" />
                <span>All documents must be scanned copy in jpg/png format - size must not exceed 5MB</span>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className="space-y-6">
                    {/* Identity Proof Section */}
                    <div className="document-section border border-gray-300 rounded-lg p-4 relative dark:border-gray-700">
                        <span className='absolute -top-3 left-3 bg-white px-2 text-xs font-semibold text-gray-600 dark:bg-gray-900 dark:text-gray-300'>Identity Proof</span>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                            <select
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
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
                            </select>
                            {selectedIdentityProof && !isDocumentUploaded(selectedIdentityProof) && (
                                <div className="flex gap-4 mt-2 sm:mt-0">
                                    <button
                                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md flex items-center justify-center gap-1"
                                        onClick={() => triggerFileInput('identity', selectedIdentityProof, '')}
                                        title="Upload from device"
                                    >
                                        <Upload size={18} /> <span className="hidden sm:inline">Upload</span>
                                    </button>
                                    <button
                                        className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 shadow-md flex items-center justify-center gap-1"
                                        onClick={() => startCamera('identity', selectedIdentityProof)}
                                        title="Take photo"
                                    >
                                        <Camera size={18} /> <span className="hidden sm:inline">Camera</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Address Proof Section */}
                    <div className="document-section border border-gray-300 rounded-lg p-4 relative dark:border-gray-700">
                        <span className='absolute -top-3 left-3 bg-white px-2 text-xs font-semibold text-gray-600 dark:bg-gray-900 dark:text-gray-300'>Address Proof</span>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                            <select
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                value={selectedAddressProof}
                                onChange={(e) => setSelectedAddressProof(e.target.value)}
                            >
                                <option value="">Select Address Proof</option>
                                {addressProofOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                        disabled={
                                            // Disable if already uploaded
                                            isDocumentUploaded(option.value) ||
                                            // Specific Aadhaar logic: disable if one side is uploaded and the other side is selected
                                            (option.value === 'AADHAAR_FRONT' && isAadhaarBackUploaded()) ||
                                            (option.value === 'AADHAAR_BACK' && isAadhaarFrontUploaded())
                                        }
                                    >
                                        {isDocumentUploaded(option.value) ?
                                            `${option.label} (Uploaded)` :
                                            option.label}
                                    </option>
                                ))}
                            </select>
                            {selectedAddressProof && !isDocumentUploaded(selectedAddressProof) && (
                                <div className="flex gap-4 mt-2 sm:mt-0">
                                    <button
                                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md flex items-center justify-center gap-1"
                                        onClick={() => triggerFileInput('address', selectedAddressProof, '')}
                                        title="Upload from device"
                                    >
                                        <Upload size={18} /> <span className="hidden sm:inline">Upload</span>
                                    </button>
                                    <button
                                        className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 shadow-md flex items-center justify-center gap-1"
                                        onClick={() => startCamera('address', selectedAddressProof)}
                                        title="Take photo"
                                    >
                                        <Camera size={18} /> <span className="hidden sm:inline">Camera</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Signature Proof Section */}
                    <div className="document-section border border-gray-300 rounded-lg p-4 relative dark:border-gray-700">
                        <span className='absolute -top-3 left-3 bg-white px-2 text-xs font-semibold text-gray-600 dark:bg-gray-900 dark:text-gray-300'>Signature</span>
                        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                            <select
                                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-700"
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
                            </select>
                            {selectedSignatureProof && !isDocumentUploaded(selectedSignatureProof) && (
                                <div className="flex gap-4 mt-2 sm:mt-0">
                                    <button
                                        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 shadow-md flex items-center justify-center gap-1"
                                        onClick={() => triggerFileInput('signature', selectedSignatureProof, '')}
                                        title="Upload from device"
                                    >
                                        <Upload size={18} /> <span className="hidden sm:inline">Upload</span>
                                    </button>
                                    <button
                                        className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 shadow-md flex items-center justify-center gap-1"
                                        onClick={() => startCamera('signature', selectedSignatureProof)}
                                        title="Take photo"
                                    >
                                        <Camera size={18} /> <span className="hidden sm:inline">Camera</span>
                                    </button>
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

                <div className="preview-section flex justify-center items-center p-4 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
                    <div className="text-center w-full relative">
                        {loading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-10 rounded-lg dark:bg-gray-900 dark:bg-opacity-90">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                                <p className="mt-3 text-gray-700 dark:text-gray-300">Processing document...</p>
                            </div>
                        )}
                        {previewImage ?
                            (<>
                                <small className="text-gray-600 dark:text-gray-400">Preview</small>
                                <img src={previewImage} alt="Document preview" className="h-48 sm:h-64 md:h-72 w-auto mx-auto border-2 border-gray-200 rounded-lg object-contain shadow-md dark:border-gray-600" />
                            </>)
                            : (
                                <div className="flex flex-col items-center justify-center h-48 sm:h-64 md:h-72 w-full text-gray-400">
                                    <img src={workingman} alt="placeholder" className="h-32 w-auto mb-4" />
                                    <p>Your document preview will appear here</p>
                                </div>
                            )}
                    </div>
                </div>
            </div>

            <div className="documents-table mt-8 bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Document Type</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Image</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Signature</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Photo</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                            {uploadedDocuments.length > 0 ? (
                                uploadedDocuments.map((doc) => (
                                    <tr key={doc.id}>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{doc.name}</td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {doc.image && (
                                                <img
                                                    src={doc.image}
                                                    alt={doc.name}
                                                    className="w-24 h-auto rounded-md object-contain shadow-sm"
                                                />
                                            )}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {doc.signatures && doc.signatures.length > 0 ? (
                                                <img
                                                    src={`data:image/jpeg;base64,${doc.signatures[0].image}`}
                                                    alt="Signature"
                                                    className="w-24 h-auto rounded-md object-contain shadow-sm"
                                                />
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {doc.photographs && doc.photographs.length > 0 ? (
                                                <img
                                                    src={`data:image/jpeg;base64,${doc.photographs[0].image}`}
                                                    alt="Photograph"
                                                    className="w-24 h-auto rounded-md object-contain shadow-sm"
                                                />
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => removeDocument(doc.id)}
                                                className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
                                                title="Remove Document"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-4 text-sm text-gray-500 text-center dark:text-gray-400">
                                        No documents uploaded yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Camera Modal */}
            {showCamera && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 font-inter">
                    <div className="bg-white rounded-lg max-w-md w-full shadow-xl p-6 dark:bg-gray-800">
                        <div className="flex justify-between items-center mb-4 border-b pb-3 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Take Photo</h3>
                            <button onClick={stopCamera} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200" aria-label="Close camera">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="mb-6 aspect-video overflow-hidden rounded-lg bg-black flex items-center justify-center">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={capturePhoto}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                            >
                                <Camera size={20} /> Capture
                            </button>
                        </div>
                        <div className="mt-4 text-sm text-gray-600 text-center dark:text-gray-400">
                            Position the document clearly in the frame and click Capture
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;



