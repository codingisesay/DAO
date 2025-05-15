import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import CommonButton from '../../components/CommonButton';
const useCameraWithLocation = () => {
    const [imageData, setImageData] = useState(null);
    const [location, setLocation] = useState({ latitude: '', longitude: '' });
    const [validation, setValidation] = useState({ hasFace: null, lightingOk: null, singleSubject: null });
    const webcamRef = useRef(null);

    const validateImage = (canvas) => {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let brightnessSum = 0;
        let skinTonePixels = 0;
        let faceArea = { minX: canvas.width, maxX: 0, minY: canvas.height, maxY: 0, pixelCount: 0 };

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i], g = data[i + 1], b = data[i + 2];
            brightnessSum += (r + g + b) / 3;

            if (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
                skinTonePixels++;
                const x = (i / 4) % canvas.width;
                const y = Math.floor(i / 4 / canvas.width);
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
        const hasFace = skinToneRatio > 0.05 && faceSize > canvas.width * canvas.height * 0.1;
        const singleSubject = skinToneRatio < 0.3;
        const lightingOk = avgBrightness > 100 && avgBrightness < 220;

        setValidation({ hasFace, singleSubject, lightingOk });
    };

    const captureImage = () => {
        const video = webcamRef.current.video;
        if (!video) return;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);

        const image = canvas.toDataURL('image/jpeg');
        setImageData(image);
        validateImage(canvas);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
            });
        }
    };

    return { imageData, location, captureImage, webcamRef, validation };
};

const CaptureWithLocation = () => {
    const { imageData, location, captureImage, webcamRef, validation } = useCameraWithLocation();

    return (
        <div className="p-6">
            {!imageData && (
                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: 'user', width: 640, height: 480 }}
                    className="rounded border"
                />
            )}


            <CommonButton onClick={captureImage}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                {imageData ? 'Retake Photo' : 'Capture Image with Location'}
            </CommonButton>



            {imageData && (
                <div className="mt-4">
                    <img src={imageData} alt="Captured" className="w-64 border" />
                    <p className="text-sm mt-2">Latitude: {location.latitude}</p>
                    <p className="text-sm">Longitude: {location.longitude}</p>

                    <div className="mt-2">
                        <p className={validation.hasFace ? 'text-green-600' : 'text-red-600'}>
                            {validation.hasFace ? '✓ Face detected' : '✗ No face detected'}
                        </p>
                        <p className={validation.singleSubject ? 'text-green-600' : 'text-red-600'}>
                            {validation.singleSubject ? '✓ Single subject' : '✗ Multiple subjects detected'}
                        </p>
                        <p className={validation.lightingOk ? 'text-green-600' : 'text-red-600'}>
                            {validation.lightingOk ? '✓ Good lighting' : '✗ Poor lighting'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CaptureWithLocation;
