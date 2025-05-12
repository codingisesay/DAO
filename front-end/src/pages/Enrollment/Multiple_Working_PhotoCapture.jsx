import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, Upload } from 'react-bootstrap-icons';

const PhotoCapture = ({
    title,
    instructions = [],
    validationRules = [],
    onCapture,
    aspectRatio = null
}) => {
    const [photo, setPhoto] = useState(null);
    const [validationResults, setValidationResults] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    // Clean up camera stream on unmount
    useEffect(() => {
        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const defaultValidationRules = [
        { id: 'subjectDetected', label: 'Subject detected', validator: () => true },
        { id: 'singleSubject', label: 'Single subject in frame', validator: () => true },
        { id: 'goodLighting', label: 'Good lighting', validator: () => true },
    ];

    const rulesToUse = validationRules.length > 0 ? validationRules : defaultValidationRules;

    const startCamera = async () => {
        try {
            setError(null);
            setIsCapturing(true);

            const constraints = {
                video: {
                    facingMode: 'environment',
                    ...(aspectRatio && { aspectRatio })
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            } else {
                throw new Error("Video element not available");
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please check permissions.");
            setIsCapturing(false);
        }
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setIsCapturing(false);
    };

    const capturePhoto = () => {
        try {
            if (!videoRef.current || !canvasRef.current) {
                throw new Error("Camera elements not initialized");
            }

            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (video.videoWidth === 0 || video.videoHeight === 0) {
                throw new Error("Video stream not ready");
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            if (!context) {
                throw new Error("Could not get canvas context");
            }

            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL('image/jpeg');

            setPhoto(imageData);
            const results = rulesToUse.map(rule => ({
                ...rule,
                valid: rule.validator(imageData)
            }));
            setValidationResults(results);
            stopCamera();

            if (onCapture) {
                onCapture({
                    imageData,
                    isValid: results.every(r => r.valid)
                });
            }
        } catch (err) {
            console.error("Error capturing photo:", err);
            setError(err.message);
            stopCamera();
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPhoto(event.target.result);
                const results = rulesToUse.map(rule => ({
                    ...rule,
                    valid: rule.validator(event.target.result)
                }));
                setValidationResults(results);

                if (onCapture) {
                    onCapture({
                        imageData: event.target.result,
                        isValid: results.every(r => r.valid)
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const retakePhoto = () => {
        setPhoto(null);
        setValidationResults(null);
        setError(null);
        startCamera();
    };

    return (
        <div className="border rounded-lg p-4 mb-6">
            <h3 className="text-xl font-bold mb-3">{title}</h3>

            {error && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded">
                    {error}
                </div>
            )}

            {instructions.length > 0 && (
                <div className="mb-4 bg-gray-50 p-3 rounded">
                    <h4 className="font-medium mb-2">Instructions:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                        {instructions.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            {!photo ? (
                <div className="flex flex-col items-center">
                    {isCapturing ? (
                        <>
                            <div className="relative w-full max-w-md border rounded-lg overflow-hidden">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full"
                                    style={{ aspectRatio: aspectRatio || 'auto' }}
                                />
                                <div className="absolute inset-0 border-4 border-transparent pointer-events-none"></div>
                            </div>
                            <button
                                onClick={capturePhoto}
                                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full flex items-center"
                            >
                                <Camera className="mr-2" /> Capture
                            </button>
                        </>
                    ) : (
                        <>
                            <div
                                className="w-full max-w-md h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer"
                                onClick={startCamera}
                            >
                                <div className="text-center">
                                    <Camera className="mx-auto text-3xl text-gray-400 mb-2" />
                                    <p className="text-gray-500">Click to open camera</p>
                                </div>
                            </div>
                            <p className="my-3 text-gray-500">or</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full flex items-center"
                            >
                                <Upload className="mr-2" /> Upload from device
                            </button>
                        </>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="relative w-full max-w-md mb-4">
                        <img
                            src={photo}
                            alt="Captured"
                            className="w-full border rounded-lg"
                            style={{ aspectRatio: aspectRatio || 'auto' }}
                        />
                        <button
                            onClick={retakePhoto}
                            className="absolute top-2 right-2 bg-white bg-opacity-75 p-2 rounded-full shadow"
                        >
                            <XCircle className="text-red-500" />
                        </button>
                    </div>

                    {validationResults && (
                        <div className="w-full max-w-md bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium mb-2">Validation Results:</h4>
                            <ul className="space-y-2">
                                {validationResults.map((rule) => (
                                    <li key={rule.id} className="flex items-center">
                                        {rule.valid ? (
                                            <CheckCircle className="text-green-500 mr-2" />
                                        ) : (
                                            <XCircle className="text-red-500 mr-2" />
                                        )}
                                        <span className={rule.valid ? 'text-green-700' : 'text-red-700'}>
                                            {rule.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


// Example usage for PAN Card Upload
const PanCardUpload = () => (
    <PhotoCapture
        title="Upload PAN Card"
        instructions={[
            "Document should be original",
            "Perfect and accurately scan front side",
            "Perfect and accurately scan back side"
        ]}
        validationRules={[
            {
                id: 'subjectDetected',
                label: 'PAN card detected',
                validator: (imageData) => {
                    // Implement actual validation logic here
                    return true; // Placeholder
                }
            },
            {
                id: 'documentClear',
                label: 'Document is clear and readable',
                validator: (imageData) => true // Placeholder
            }
        ]}
        aspectRatio={1.586} // Standard card aspect ratio
    />
);

// Example usage for Signature Upload
const SignatureUpload = () => (
    <PhotoCapture
        title="Upload Signature"
        instructions={[
            "Signature should be accurate as per document record",
            "Signature should be on white paper",
            "Signature should be done by blue pen"
        ]}
        aspectRatio={2.5} // Wider aspect ratio for signature
    />
);

export default PhotoCapture;
export { PanCardUpload, SignatureUpload };




// import React from 'react';

// import { PanCardUpload, SignatureUpload } from './Multiple_Working_PhotoCapture';
// function p6({ onNext, onBack }) {
//     return (
//         <>
//             <PanCardUpload />

//             <SignatureUpload />
//             <button onClick={onNext}>Next</button>
//             <button onClick={onBack}>Back</button>
//         </>);
// }

// export default p6;