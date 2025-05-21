import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import photo_instruction from '../../assets/imgs/photo_instructions.png'
import '@tensorflow/tfjs';

const PhotoCapture = ({
    photoType = 'customer', // 'customer' or 'agent'
    instructionImage,
    onCapture,
    showLocation = true
}) => {
    // Refs and state management
    const webcamRef = useRef(null);
    const storageKey = `${photoType}PhotoData`;

    const [photoData, setPhotoData] = useState(() => {
        const savedData = localStorage.getItem(storageKey);
        return savedData ? JSON.parse(savedData) : null;
    });

    const [validation, setValidation] = useState({
        hasFace: false,
        lightingOk: false,
        singlePerson: false
    });

    const [isCameraActive, setIsCameraActive] = useState(false);
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Configuration based on photo type
    const isCustomerPhoto = photoType === 'customer';
    const title = isCustomerPhoto ? 'Customer Photo' : 'Agent Photo';

    // 1. Geolocation Setup
    useEffect(() => {
        if (!showLocation) return;

        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            timestamp: new Date(position.timestamp).toISOString()
                        });
                    },
                    (error) => {
                        setLocationError(error.message);
                        console.error("Geolocation error:", error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            } else {
                setLocationError("Geolocation not supported");
            }
        };

        getLocation();
    }, [showLocation]);

    // 2. Face Detection Setup (for customer photos only)
    useEffect(() => {
        let mounted = true;
        let model;

        const loadModel = async () => {
            if (!isCustomerPhoto || !isCameraActive) return;

            try {
                setIsLoading(true);
                model = await cocoSsd.load();

                const detect = async () => {
                    if (!mounted || !webcamRef.current?.video?.readyState === 4) return;

                    try {
                        const predictions = await model.detect(webcamRef.current.video);
                        const people = predictions.filter(p => p.class === "person");
                        const { hasFace, lightingOk } = analyzeFrame();

                        setValidation({
                            hasFace,
                            lightingOk,
                            singlePerson: people.length === 1
                        });
                    } catch (error) {
                        console.error("Detection error:", error);
                    }

                    if (mounted) requestAnimationFrame(detect);
                };

                detect();
            } catch (error) {
                console.error("Model loading error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadModel();

        return () => {
            mounted = false;
            model?.dispose();
        };
    }, [isCameraActive, isCustomerPhoto]);

    // Frame analysis for face and lighting
    const analyzeFrame = () => {
        if (!webcamRef.current?.video || !isCustomerPhoto) {
            return { hasFace: true, lightingOk: true };
        }

        const video = webcamRef.current.video;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let brightnessSum = 0;
        let skinTonePixels = 0;

        // Analyze image data
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            brightnessSum += (r + g + b) / 3;

            // Skin tone detection
            if (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
                skinTonePixels++;
            }
        }

        const avgBrightness = brightnessSum / (data.length / 4);
        const skinToneRatio = skinTonePixels / (data.length / 4);

        return {
            hasFace: skinToneRatio > 0.05,
            lightingOk: avgBrightness > 100 && avgBrightness < 220
        };
    };

    // Camera control functions
    const startCamera = () => setIsCameraActive(true);
    const stopCamera = () => setIsCameraActive(false);

    // Capture photo with metadata
    const capturePhoto = () => {
        const imageSrc = webcamRef.current.getScreenshot();

        const capturedData = {
            image: imageSrc,
            timestamp: new Date().toISOString(),
            metadata: {
                location: location || null,
                locationError: locationError || null,
                validation: isCustomerPhoto ? validation : null
            }
        };

        setPhotoData(capturedData);
        localStorage.setItem(storageKey, JSON.stringify(capturedData));

        if (onCapture) onCapture(capturedData);
        stopCamera();
    };

    const retakePhoto = () => {
        setPhotoData(null);
        localStorage.removeItem(storageKey);
        startCamera();
    };

    // Validation check
    const isPhotoValid = !isCustomerPhoto || (
        validation.hasFace &&
        validation.lightingOk &&
        validation.singlePerson
    );

    // Requirements list
    const requirements = [
        ...(isCustomerPhoto ? [
            { text: 'Face clearly visible', valid: validation.hasFace },
            { text: 'Good lighting', valid: validation.lightingOk },
            { text: 'Only one person in frame', valid: validation.singlePerson }
        ] : [
            { text: 'Agent face clearly visible', valid: true },
            { text: 'ID badge visible', valid: true },
            { text: 'Plain background preferred', valid: true }
        ]),
        ...(showLocation ? [{
            text: 'Location captured',
            valid: !!location,
            extra: locationError ? (
                <span className="text-red-500 text-sm">Error: {locationError}</span>
            ) : location ? (
                <span className="text-green-500 text-sm">
                    {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                </span>
            ) : (
                <span className="text-yellow-500 text-sm">Acquiring location...</span>
            )
        }] : [])
    ];

    return (
        <div className="max-w-4xl mx-auto  bg-white rounded-lg ">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">{title}</h2>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Camera/Preview Section */}
                <div className="flex-1">
                    <div className={`border-2 rounded-lg overflow-hidden transition-all ${photoData ? 'border-gray-300' :
                        isPhotoValid ? 'border-green-500' : 'border-red-500'
                        }`}>
                        {!photoData ? (
                            isCameraActive ? (
                                <div className="relative" style={{ aspectRatio: '4/3' }}>
                                    <Webcam
                                        audio={false}
                                        ref={webcamRef}
                                        screenshotFormat="image/jpeg"
                                        videoConstraints={{
                                            facingMode: 'user',
                                            width: 1280,
                                            height: 720
                                        }}
                                        className="w-full h-full object-cover"
                                    />
                                    {isCustomerPhoto && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="border-2 border-dashed border-white rounded-full w-48 h-64 opacity-50"></div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div
                                    className="flex flex-col items-center justify-center bg-gray-100 p-8 h-full"
                                    style={{ aspectRatio: '4/3' }}
                                >
                                    Capture
                                    <button
                                        onClick={startCamera}
                                        disabled={isLoading}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg disabled:opacity-50"
                                    >
                                        {isLoading ? 'Loading...' : 'Start Camera'}
                                    </button>
                                </div>
                            )
                        ) : (
                            <div className="relative" style={{ aspectRatio: '4/3' }}>
                                <img
                                    src={photoData.image}
                                    alt={`Captured ${photoType}`}
                                    className="w-full h-full object-cover"
                                />
                                {showLocation && photoData.metadata.location && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs">
                                        <div>Lat: {photoData.metadata.location.latitude.toFixed(5)}</div>
                                        <div>Lng: {photoData.metadata.location.longitude.toFixed(5)}</div>
                                        <div>Time: {new Date(photoData.timestamp).toLocaleTimeString()}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        {!photoData ? (
                            isCameraActive && (
                                <button
                                    onClick={capturePhoto}
                                    disabled={!isPhotoValid || isLoading}
                                    className={`w-full py-3 rounded-lg font-medium transition-colors ${isPhotoValid && !isLoading
                                        ? 'bg-green-600 hover:bg-green-700 text-white'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {isLoading ? 'Processing...' : 'Capture Photo'}
                                </button>
                            )
                        ) : (
                            <button
                                onClick={retakePhoto}
                                className="w-full btn-login"
                            >
                                Retake Photo
                            </button>
                        )}
                    </div>
                </div>

                {/* Instructions Section */}
                <div className="flex-1 flex flex-col">
                    {instructionImage && (
                        <img
                            src={instructionImage}
                            alt="Photo instructions"
                            className="w-full max-w-xs mb-4 mx-auto rounded-lg"
                        />
                    )}

                    <div className="bg-gray-50 p-4 rounded-lg flex-grow">
                        <img src={photo_instruction} about='instuctions for photo' />
                        {/* <h3 className="font-medium mb-3 text-gray-700">Photo Requirements:</h3> */}
                        {/* <ul className="space-y-3">
                            {requirements.map((req, index) => (
                                <li
                                    key={index}
                                    className={`flex items-start ${req.valid ? 'text-green-600' : 'text-red-600'}`}
                                >
                                    <span className="mr-2 mt-0.5">
                                        {req.valid ? '✓' : '✗'}
                                    </span>
                                    <div>
                                        <div>{req.text}</div>
                                        {req.extra && <div className="ml-4">{req.extra}</div>}
                                    </div>
                                </li>
                            ))}
                        </ul> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PhotoCapture;
