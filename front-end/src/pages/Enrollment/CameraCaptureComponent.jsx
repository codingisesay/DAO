import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const CameraCaptureComponent = ({
  onCapture,
  instructionImage,
  aspectRatio = "4/3"
}) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [validation, setValidation] = useState({
    hasFace: false,
    lightingOk: false,
    singlePerson: false
  });
  const [personCount, setPersonCount] = useState(0);
  const [hints, setHints] = useState('Please align your face');

  // Load COCO-SSD model for person detection
  useEffect(() => {
    let mounted = true;
    let model;

    const loadModel = async () => {
      try {
        model = await cocoSsd.load();
        const detect = async () => {
          if (mounted && webcamRef.current?.video?.readyState === 4) {
            try {
              const predictions = await model.detect(webcamRef.current.video);
              const people = predictions.filter(p => p.class === "person");
              setPersonCount(people.length);

              // Analyze frame for face and lighting
              const { hasFace, lightingOk } = analyzeFrame();

              setValidation({
                hasFace,
                lightingOk,
                singlePerson: people.length === 1
              });

              setHints(getHints(hasFace, lightingOk, people.length));
            } catch (error) {
              console.error("Detection error:", error);
            }
          }
          if (mounted) requestAnimationFrame(detect);
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

  const analyzeFrame = () => {
    if (!webcamRef.current?.video) return { hasFace: false, lightingOk: false };

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

    // Simple analysis of the frame
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      brightnessSum += (r + g + b) / 3;

      // Basic skin tone detection
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

  const getHints = (hasFace, lightingOk, count) => {
    if (count === 0) return 'No person detected. Please stand in frame.';
    if (count > 1) return 'Multiple people detected. Only one person should be in frame.';
    if (!hasFace) return 'Center your face in the frame';
    if (!lightingOk) return 'Adjust lighting properly';
    return 'Ready to capture';
  };

  const startCamera = () => {
    setIsCameraActive(true);
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    if (onCapture) onCapture(imageSrc);
  };

  const retake = () => {
    setImgSrc(null);
  };

  const allValid = validation.hasFace && validation.lightingOk && validation.singlePerson;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4 text-center">Upload Live Photo</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Camera/Preview Section */}
        <div className="flex-1">
          <div className={`border-2 rounded-lg overflow-hidden ${allValid ? 'border-green-500' : 'border-red-500'} transition-colors`}>
            {!imgSrc ? (
              isCameraActive ? (
                <div className="relative" style={{ aspectRatio }}>
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
                  {/* Face guide overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="border-2 border-dashed border-white rounded-full w-48 h-64 opacity-50"></div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center bg-gray-100 p-8"
                  style={{ aspectRatio }}
                >
                  Capture
                  <button
                    onClick={startCamera}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                  >
                    Start Camera
                  </button>
                </div>
              )
            ) : (
              <div className="relative" style={{ aspectRatio }}>
                <img
                  src={imgSrc}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            {!imgSrc ? (
              isCameraActive && (
                <button
                  onClick={capture}
                  disabled={!allValid}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${allValid
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  Capture
                </button>
              )
            ) : (
              <button
                onClick={retake}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Retake
              </button>
            )}
          </div>
        </div>

        {/* Instructions Section */}
        <div className="flex-1 flex flex-col items-center">
          {instructionImage && (
            <img
              src={instructionImage}
              alt="Photo Instructions"
              className="w-full max-w-xs mb-6"
            />
          )}

          <div className="w-full bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Photo Requirements:</h3>
            <ul className="space-y-2">
              <li className={`flex items-center ${validation.hasFace ? 'text-green-600' : 'text-red-600'}`}>
                {validation.hasFace ? (
                  <span className="mr-2">✓</span>
                ) : (
                  <span className="mr-2">✗</span>
                )}
                Face clearly visible
              </li>
              <li className={`flex items-center ${validation.lightingOk ? 'text-green-600' : 'text-red-600'}`}>
                {validation.lightingOk ? (
                  <span className="mr-2">✓</span>
                ) : (
                  <span className="mr-2">✗</span>
                )}
                Good lighting
              </li>
              <li className={`flex items-center ${validation.singlePerson ? 'text-green-600' : 'text-red-600'}`}>
                {validation.singlePerson ? (
                  <span className="mr-2">✓</span>
                ) : (
                  <span className="mr-2">✗</span>
                )}
                Only one person in frame
              </li>
            </ul>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
              <p className="font-medium text-blue-800">{hints}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCaptureComponent;