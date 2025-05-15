

import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import photoinstruction from '../../assets/imgs/photo_instructions.png';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import CommonButton from '../../components/CommonButton';

const PhotoValidator = () => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [validation, setValidation] = useState({
        hasSubject: null,
        singleSubject: null,
        goodLighting: null
    });

    const [isLoading, setIsLoading] = useState(false);
    const [hints, setHints] = useState('');
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [personCount, setPersonCount] = useState(0);

    // Pre-capture checks
    const [preCaptureChecks, setPreCaptureChecks] = useState({
        hasFace: false,
        lightingOk: false,
        singlePerson: false
    });

    // Load COCO-SSD model and start person detection
    useEffect(() => {
        let mounted = true;

        const loadModel = async () => {
            try {
                const model = await cocoSsd.load();
                const detect = async () => {
                    if (mounted && webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
                        try {
                            const predictions = await model.detect(webcamRef.current.video);
                            const people = predictions.filter((p) => p.class === "person");
                            setPersonCount(people.length);

                            // Update preCaptureChecks with single person status
                            setPreCaptureChecks(prev => ({
                                ...prev,
                                singlePerson: people.length === 1
                            }));
                        } catch (error) {
                            console.error("Detection error:", error);
                        }
                    }
                    if (mounted) {
                        requestAnimationFrame(detect);
                    }
                };
                detect();
            } catch (error) {
                console.error("Model loading error:", error);
            }
        };

        loadModel();

        return () => {
            mounted = false;
        };
    }, []);

    // Request geolocation permission when component mounts
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => {
                    setLocationError(error.message);
                    console.error("Geolocation error:", error);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setLocationError("Geolocation is not supported by this browser.");
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!imgSrc && webcamRef.current) {
                const video = webcamRef.current.video;
                if (video && video.readyState === video.HAVE_ENOUGH_DATA) {
                    analyzeVideoFrame(video);
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [imgSrc]);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);

        // Include location data when validating
        validateImage(imageSrc, location);
    };

    const validateImage = (imageSrc, locationData) => {
        setIsLoading(true);
        setValidation({
            hasSubject: null,
            singleSubject: null,
            goodLighting: null
        });

        console.log('Image captured with location:', locationData); // Log the location

        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            // ... (keep your existing validation logic)

            // After validation, you might want to do something with the location data
            if (locationData) {
                console.log(`Image location: Lat ${locationData.latitude}, Long ${locationData.longitude}`);
                // You could add this to your validation results display
            }

            setIsLoading(false);
        };
    };

    const analyzeVideoFrame = (video) => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { hasFace, lightingOk } = analyzeFrame(imageData);

        setPreCaptureChecks(prev => ({
            ...prev,
            hasFace,
            lightingOk
        }));
        setHints(getHints(hasFace, lightingOk, personCount));
    };

    const analyzeFrame = (imageData) => {
        const data = imageData.data;
        let brightnessSum = 0;
        let contrastSum = 0;
        let skinTonePixels = 0;
        let faceLikeContrast = 0;

        // Analyze each pixel
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = (r + g + b) / 3;
            brightnessSum += brightness;

            // Simple skin tone detection (in RGB space)
            if (r > 95 && g > 40 && b > 20 &&
                r > g && r > b &&
                Math.abs(r - g) > 15) {
                skinTonePixels++;
            }
        }

        const avgBrightness = brightnessSum / (data.length / 4);
        const skinToneRatio = skinTonePixels / (data.length / 4);

        // Calculate contrast in potential face area
        const centerX = imageData.width / 2;
        const centerY = imageData.height / 2;
        const faceWidth = imageData.width * 0.3;
        const faceHeight = imageData.height * 0.4;

        for (let y = centerY - faceHeight / 2; y < centerY + faceHeight / 2; y++) {
            for (let x = centerX - faceWidth / 2; x < centerX + faceWidth / 2; x++) {
                if (x >= 0 && x < imageData.width && y >= 0 && y < imageData.height) {
                    const idx = (y * imageData.width + x) * 4;
                    const r = data[idx];
                    const g = data[idx + 1];
                    const b = data[idx + 2];
                    const brightness = (r + g + b) / 3;

                    // Compare with surrounding pixels
                    if (x > centerX - faceWidth / 2 + 5) {
                        const leftIdx = (y * imageData.width + (x - 5)) * 4;
                        const leftBrightness = (data[leftIdx] + data[leftIdx + 1] + data[leftIdx + 2]) / 3;
                        contrastSum += Math.abs(brightness - leftBrightness);
                    }
                }
            }
        }

        const hasFace = skinToneRatio > 0.05 && contrastSum > 100000;
        const lightingOk = avgBrightness > 100 && avgBrightness < 220;

        return { hasFace, lightingOk };
    };

    const getHints = (hasFace, lightingOk, count) => {
        if (count === 0) return 'No person detected. Please stand in frame.';
        if (count > 1) return 'Multiple people detected. Only one person should be in frame.';
        if (!hasFace) return 'Center your face in the frame.';
        if (!lightingOk) return 'Adjust lighting properly';
        return 'Ready to capture';
    };

    const isSkinTone = (r, g, b) => {
        // Enhanced skin tone detection in multiple color spaces
        const y = r * 0.299 + g * 0.587 + b * 0.114; // Luminance
        const cb = r * -0.168736 + g * -0.331264 + b * 0.5 + 128;
        const cr = r * 0.5 + g * -0.418688 + b * -0.081312 + 128;

        return (
            // RGB space check
            (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) ||
            // YCbCr space check
            (y > 80 && cb > 85 && cb < 135 && cr > 135 && cr < 180)
        );
    };

    const analyzeRegion = (data, width, x, y, w, h) => {
        let contrast = 0;
        let pixelCount = 0;

        const startX = Math.max(0, Math.floor(x));
        const startY = Math.max(0, Math.floor(y));
        const endX = Math.min(width, Math.floor(x + w));
        const endY = Math.min(data.length / (4 * width), Math.floor(y + h));

        for (let py = startY; py < endY; py++) {
            for (let px = startX; px < endX; px++) {
                const idx = (py * width + px) * 4;
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                const brightness = (r + g + b) / 3;

                if (px > startX) {
                    const leftIdx = (py * width + (px - 1)) * 4;
                    const leftBrightness = (data[leftIdx] + data[leftIdx + 1] + data[leftIdx + 2]) / 3;
                    contrast += Math.abs(brightness - leftBrightness);
                }
                pixelCount++;
            }
        }

        return {
            contrast: pixelCount > 0 ? contrast / pixelCount : 0
        };
    };

    const retake = () => {
        setImgSrc(null);
    };

    const allValid = () => {
        return validation.hasSubject &&
            validation.singleSubject &&
            validation.goodLighting;
    };

    return (
        <div className=" ">
            <h2 className="text-xl font-bold mb-2">Upload Live Photo</h2>

            <div className='flex flex-wrap justify-center mb-4'>
                <div className="md:w-1/2 sm:w-full  ">
                    <div className="camera-container">
                        {!imgSrc ? (
                            <>
                                <Webcam width={'500px'}
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{
                                        facingMode: 'user',
                                        width: 1280,
                                        height: 720
                                    }}
                                    className="webcam rounded-lg"
                                />
                                <div className="face-guide"></div>
                            </>
                        ) : (
                            <img src={imgSrc} alt="Captured" className="captured-image" />
                        )}

                        <div className="controls mt-3">

                            {!imgSrc ? (
                                <CommonButton
                                    className="w-full btn-login"
                                    onClick={capture}
                                    disabled={isLoading || !preCaptureChecks.hasFace || !preCaptureChecks.lightingOk || personCount !== 1}
                                >
                                    Capture Photo
                                </CommonButton>
                            ) : (
                                <CommonButton
                                    className="w-full btn-login"
                                    onClick={retake}
                                >
                                    Retake Photo
                                </CommonButton>
                            )}

                        </div>

                    </div>
                </div>

                <div className="md:w-1/2 w-full  ">
                    <img src={photoinstruction} alt="Photo Instructions" className='w-3/5 mb-3 m-auto' />
                    <div className="status">
                        {!imgSrc && (
                            <>
                                <div className={`status-indicator ${preCaptureChecks.hasFace ? 'good' : 'bad'}`}>
                                    {preCaptureChecks.hasFace ? '✓' : '✗'} Face detected
                                </div>
                                <div className={`status-indicator ${preCaptureChecks.lightingOk ? 'good' : 'bad'}`}>
                                    {preCaptureChecks.lightingOk ? '✓' : '✗'} Good lighting
                                </div>
                                <div className={`status-indicator ${personCount === 1 ? 'good' : 'bad'}`}>
                                    {personCount === 1 ? '✓' : '✗'} Single person detected ({personCount})
                                </div>
                                <div className="hints">{hints}</div>
                            </>
                        )}
                        {/* Display location status */}
                        {locationError && (
                            <div className="location-error">
                                Warning: {locationError} Photo will be captured without location data.
                            </div>
                        )}
                        {location && (
                            <div className="location-info text-center">
                                Location enabled: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                                {/* (Accuracy: ~{Math.round(location.accuracy)} meters) */}
                            </div>
                        )}
                    </div>

                    {!isLoading && imgSrc && (
                        <div className="validation-results">
                            <h2>Validation Results:</h2>
                            <ul>
                                <li className={validation.hasSubject === false ? 'invalid' : 'valid'}>
                                    {validation.hasSubject === false ? '✗' : '✓'} Subject detected
                                </li>
                                <li className={validation.singleSubject === false ? 'invalid' : 'valid'}>
                                    {validation.singleSubject === false ? '✗' : '✓'} Single subject in frame
                                </li>
                                <li className={validation.goodLighting === false ? 'invalid' : 'valid'}>
                                    {validation.goodLighting === false ? '✗' : '✓'} Good lighting
                                </li>
                            </ul>

                            {allValid() ? (
                                <div className="success-message">All validations passed!</div>
                            ) : (
                                <div className="error">
                                    {/* One or more validations failed. Please retake the photo. */}
                                </div>
                            )}
                        </div>
                    )}

                    {isLoading && <div className="loading">Validating image...</div>}
                </div>
            </div>
        </div>
    );
};

export default PhotoValidator;