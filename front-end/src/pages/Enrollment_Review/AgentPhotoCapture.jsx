import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

const AgentPhotoCapture = ({ instructionImage }) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(localStorage.getItem('agentPhoto') || null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const startCamera = () => setIsCameraActive(true);
    const stopCamera = () => setIsCameraActive(false);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        localStorage.setItem('agentPhoto', imageSrc);
        stopCamera();
    };

    const retake = () => {
        setImgSrc(null);
        localStorage.removeItem('agentPhoto');
        startCamera();
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4 text-center">Agent Photo</h2>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <div className={`border-2 rounded-lg overflow-hidden ${imgSrc ? 'border-gray-300' : 'border-blue-500'}`}>
                        {!imgSrc ? (
                            isCameraActive ? (
                                <div className="relative" style={{ aspectRatio: '4/3' }}>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={{ facingMode: 'user' }}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center bg-gray-100 p-8" style={{ aspectRatio: '4/3' }}>
                                    Capture
                                    <button
                                        onClick={startCamera}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
                                    >
                                        Start Camera
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="relative" style={{ aspectRatio: '4/3' }}>
                                <img src={imgSrc} alt="Agent" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        {!imgSrc ? (
                            isCameraActive && (
                                <button
                                    onClick={capture}
                                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                                >
                                    Capture
                                </button>
                            )
                        ) : (
                            <button
                                onClick={retake}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                            >
                                Retake
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center">
                    {instructionImage && (
                        <img src={instructionImage} alt="Instructions" className="w-full max-w-xs mb-6" />
                    )}

                    <div className="w-full bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium mb-2">Photo Requirements:</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center text-gray-700">
                                ✓ Agent's face clearly visible
                            </li>
                            <li className="flex items-center text-gray-700">
                                ✓ Agent ID badge visible
                            </li>
                            <li className="flex items-center text-gray-700">
                                ✓ Plain background preferred
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentPhotoCapture;