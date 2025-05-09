import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import photoinstruction from '../../assets/imgs/photo_instructions.png';
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

    // Pre-capture checks
    const [preCaptureChecks, setPreCaptureChecks] = useState({
        hasFace: false,
        lightingOk: false
    });

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

    const analyzeVideoFrame = (video) => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { hasFace, lightingOk } = analyzeFrame(imageData);

        setPreCaptureChecks({ hasFace, lightingOk });
        setHints(getHints(hasFace, lightingOk));
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

    const getHints = (hasFace, lightingOk) => {
        if (!hasFace) return 'Center your face in the frame.';
        if (!lightingOk) return 'Adjust lighting properly';
        return 'Ready to capture';
    };

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        validateImage(imageSrc);
    };

    const validateImage = (imageSrc) => {
        setIsLoading(true);
        setValidation({
            hasSubject: null,
            singleSubject: null,
            goodLighting: null
        });

        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Calculate brightness and skin tones
            let brightnessSum = 0;
            let skinTonePixels = 0;
            let faceArea = {
                minX: canvas.width,
                maxX: 0,
                minY: canvas.height,
                maxY: 0,
                pixelCount: 0
            };

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                brightnessSum += (r + g + b) / 3;

                // Enhanced skin tone detection
                if (isSkinTone(r, g, b)) {
                    skinTonePixels++;
                    const x = (i / 4) % canvas.width;
                    const y = Math.floor((i / 4) / canvas.width);

                    faceArea.minX = Math.min(faceArea.minX, x);
                    faceArea.maxX = Math.max(faceArea.maxX, x);
                    faceArea.minY = Math.min(faceArea.minY, y);
                    faceArea.maxY = Math.max(faceArea.maxY, y);
                    faceArea.pixelCount++;
                }
            }

            const avgBrightness = brightnessSum / (data.length / 4);
            const skinToneRatio = skinTonePixels / (data.length / 4);
            const faceSize = (faceArea.maxX - faceArea.minX) * (faceArea.maxY - faceArea.minY);

            // Face covering detection
            let coveringScore = 0;
            if (faceArea.pixelCount > 0) {
                const faceCenterX = (faceArea.minX + faceArea.maxX) / 2;
                const faceCenterY = (faceArea.minY + faceArea.maxY) / 2;
                const faceWidth = faceArea.maxX - faceArea.minX;
                const faceHeight = faceArea.maxY - faceArea.minY;

                // Analyze facial feature areas
                const eyeRegion = analyzeRegion(
                    data, canvas.width,
                    faceCenterX - faceWidth * 0.2, faceCenterY - faceHeight * 0.1,
                    faceWidth * 0.4, faceHeight * 0.2
                );

                const mouthRegion = analyzeRegion(
                    data, canvas.width,
                    faceCenterX - faceWidth * 0.15, faceCenterY + faceHeight * 0.2,
                    faceWidth * 0.3, faceHeight * 0.15
                );

                // If these regions don't have expected contrast, likely covered
                coveringScore = (eyeRegion.contrast < 20 ? 0.5 : 0) +
                    (mouthRegion.contrast < 15 ? 0.5 : 0);
            }

            // Validation rules
            const hasSubject = skinToneRatio > 0.05 && faceSize > (canvas.width * canvas.height * 0.1);
            const singleSubject = hasSubject && skinToneRatio < 0.3; // Prevents multiple faces
            const goodLighting = avgBrightness > 100 && avgBrightness < 220;

            setValidation({
                hasSubject,
                singleSubject,
                goodLighting
            });
            setIsLoading(false);
        };
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
                <div className="md:w-1/2 w-full flex justify-center">

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
                                <button className='btn-login'
                                    onClick={capture}
                                    disabled={isLoading || !preCaptureChecks.hasFace || !preCaptureChecks.lightingOk}
                                >
                                    Capture Photo
                                </button>
                            ) : (
                                <button onClick={retake}>Retake Photo</button>
                            )}
                        </div>

                    </div>
                </div>

                <div className="md:w-1/2 w-full  ">
                    <img src={photoinstruction} alt="Photo Instructions" className='w-4/5 m-auto' />
                    <div className="status">
                        {!imgSrc && (
                            <>
                                <div className={`status-indicator ${preCaptureChecks.hasFace ? 'good' : 'bad'}`}>
                                    {preCaptureChecks.hasFace ? '✓' : '✗'} Face detected
                                </div>
                                <div className={`status-indicator ${preCaptureChecks.lightingOk ? 'good' : 'bad'}`}>
                                    {preCaptureChecks.lightingOk ? '✓' : '✗'} Good lighting
                                </div>
                                <div className="hints">{hints}</div>

                            </>
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
                                <div className="error-message">
                                    {!validation.hasSubject && 'No face detected. '}
                                    {!validation.singleSubject && 'Multiple faces detected. '}
                                    {!validation.goodLighting && 'Lighting issues detected. '}
                                    Please retake the photo.
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