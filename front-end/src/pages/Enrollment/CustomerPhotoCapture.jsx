import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

const ImageCaptureValidator = ({ onCapture, photoType = 'customer', showLocation = true }) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null); // Track captured image
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [validation, setValidation] = useState({
    hasFace: false,
    lightingOk: false,
    singlePerson: false
  });
  const [hints, setHints] = useState('Position your face in the frame');
  const [personCount, setPersonCount] = useState(0);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  // Get geolocation if enabled
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

  // Camera control functions
  const startCamera = () => {
    setIsCameraActive(true);
    setImgSrc(null); // Clear any previous image when starting camera
  };

  const stopCamera = () => setIsCameraActive(false);

  // Face Detection Setup
  useEffect(() => {
    let mounted = true;
    let model;

    const loadModel = async () => {
      if (!isCameraActive) return;

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

            // Update hints based on detection
            setPersonCount(people.length);
            if (people.length === 0) {
              setHints('No face detected. Position your face in the frame');
            } else if (people.length > 1) {
              setHints('Multiple people detected. Only one person should be in frame');
            } else if (!hasFace) {
              setHints('Face not clearly visible. Move into better lighting');
            } else if (!lightingOk) {
              setHints('Lighting not optimal. Adjust your environment');
            } else {
              setHints('Ready to capture');
            }
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

    if (isCameraActive) {
      loadModel();
    }

    return () => {
      mounted = false;
      model?.dispose();
    };
  }, [isCameraActive]);

  // Frame analysis for face and lighting
  const analyzeFrame = () => {
    if (!webcamRef.current?.video) {
      return { hasFace: false, lightingOk: false };
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

  // Convert base64 to Blob
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Capture image
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc); // Store the captured image
    
    const blob = dataURLtoBlob(imageSrc);
    const file = blob;
    const previewUrl = URL.createObjectURL(file);

    const capturedData = {
      file: file,
      previewUrl: previewUrl,
      timestamp: new Date().toISOString(),
      metadata: {
        location: location || null,
        locationError: locationError || null,
        validation: photoType === 'customer' ? validation : null
      }
    };

    if (onCapture) {
      onCapture(capturedData);
    }
    
    stopCamera();
  };

  // Retake photo
  const retake = () => {
    setImgSrc(null); // Clear the captured image
    startCamera(); // Restart the camera
  };

  // Check if all validations pass
  const allValid = () => {
    return validation.hasFace && validation.singlePerson && validation.lightingOk;
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Image Capture Validation</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Camera/Image Preview */}
        <div className="flex-1">
          <div className={`border-2 rounded-lg overflow-hidden transition-all ${
            imgSrc ? 'border-gray-300' : 
            allValid() ? 'border-green-500' : 'border-red-500'
          }`}>
            {imgSrc ? (
              // Show captured image
              <div className="relative" style={{ aspectRatio: '4/3' }}>
                <img
                  src={imgSrc}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : isCameraActive ? (
              // Show live camera feed
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
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-2 border-dashed border-white rounded-full w-48 h-64 opacity-50"></div>
                </div>
              </div>
            ) : (
              // Show start camera button
              <div
                className="flex flex-col items-center justify-center bg-gray-100 p-8 h-full"
                style={{ aspectRatio: '4/3' }}
              >
                <button
                  onClick={startCamera}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg disabled:opacity-50"
                >
                  {isLoading ? 'Loading...' : 'Start Camera'}
                </button>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            {imgSrc ? (
              // Show retake button when image is captured
              <button
                onClick={retake}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                Retake Photo
              </button>
            ) : isCameraActive ? (
              // Show capture button when camera is active
              <button
                onClick={capture}
                disabled={!allValid() || isLoading}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  allValid() && !isLoading
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isLoading ? 'Processing...' : 'Capture Photo'}
              </button>
            ) : (
              // Show start camera button when no camera is active
              <button
                onClick={startCamera}
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Start Camera'}
              </button>
            )}
          </div>
        </div>
        
        {/* Validation Panel */}
        <div className="flex-1">
          <div className="bg-white p-4 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Validation Requirements</h2>
            
            <div className="space-y-3">
              <div className={`flex items-center p-3 rounded ${
                validation.hasFace ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="font-medium mr-2">
                  {validation.hasFace ? '✓' : '✗'} Face detected:
                </span>
                {personCount} person(s) in frame
              </div>
              <div className={`flex items-center p-3 rounded ${
                validation.lightingOk ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="font-medium mr-2">
                  {validation.lightingOk ? '✓' : '✗'} Good lighting
                </span>
              </div>
              <div className={`flex items-center p-3 rounded ${
                validation.singlePerson ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="font-medium mr-2">
                  {validation.singlePerson ? '✓' : '✗'} Single person in frame
                </span>
              </div>
              {showLocation && (
                <div className={`flex items-center p-3 rounded ${
                  location ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <span className="font-medium mr-2">
                    {location ? '✓' : '✗'} Location captured
                  </span>
                  {locationError ? (
                    <span className="text-red-500 text-sm">Error: {locationError}</span>
                  ) : location ? (
                    <span className="text-green-500 text-sm">
                      {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
                    </span>
                  ) : (
                    <span className="text-yellow-500 text-sm">Acquiring location...</span>
                  )}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded mt-4">
              {hints}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCaptureValidator;














// import React, { useState, useRef, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import * as cocoSsd from '@tensorflow-models/coco-ssd';
// import '@tensorflow/tfjs';

// const ImageCaptureValidator = ({ onCapture, photoType = 'customer', showLocation = true }) => {
//   const webcamRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const [validation, setValidation] = useState({
//     hasFace: false,
//     lightingOk: false,
//     singlePerson: false
//   });
//   const [hints, setHints] = useState('Position your face in the frame');
//   const [personCount, setPersonCount] = useState(0);
//   const [location, setLocation] = useState(null);
//   const [locationError, setLocationError] = useState(null);

//   // Get geolocation if enabled
//   useEffect(() => {
//     if (!showLocation) return;

//     const getLocation = () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             setLocation({
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//               accuracy: position.coords.accuracy,
//               timestamp: new Date(position.timestamp).toISOString()
//             });
//           },
//           (error) => {
//             setLocationError(error.message);
//             console.error("Geolocation error:", error);
//           },
//           {
//             enableHighAccuracy: true,
//             timeout: 10000,
//             maximumAge: 0
//           }
//         );
//       } else {
//         setLocationError("Geolocation not supported");
//       }
//     };

//     getLocation();
//   }, [showLocation]);

//   // Camera control functions
//   const startCamera = () => setIsCameraActive(true);
//   const stopCamera = () => setIsCameraActive(false);

//   // Face Detection Setup
//   useEffect(() => {
//     let mounted = true;
//     let model;

//     const loadModel = async () => {
//       if (!isCameraActive) return;

//       try {
//         setIsLoading(true);
//         model = await cocoSsd.load();

//         const detect = async () => {
//           if (!mounted || !webcamRef.current?.video?.readyState === 4) return;

//           try {
//             const predictions = await model.detect(webcamRef.current.video);
//             const people = predictions.filter(p => p.class === "person");
//             const { hasFace, lightingOk } = analyzeFrame();

//             setValidation({
//               hasFace,
//               lightingOk,
//               singlePerson: people.length === 1
//             });

//             // Update hints based on detection
//             setPersonCount(people.length);
//             if (people.length === 0) {
//               setHints('No face detected. Position your face in the frame');
//             } else if (people.length > 1) {
//               setHints('Multiple people detected. Only one person should be in frame');
//             } else if (!hasFace) {
//               setHints('Face not clearly visible. Move into better lighting');
//             } else if (!lightingOk) {
//               setHints('Lighting not optimal. Adjust your environment');
//             } else {
//               setHints('Ready to capture');
//             }
//           } catch (error) {
//             console.error("Detection error:", error);
//           }

//           if (mounted) requestAnimationFrame(detect);
//         };

//         detect();
//       } catch (error) {
//         console.error("Model loading error:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (isCameraActive) {
//       loadModel();
//     }

//     return () => {
//       mounted = false;
//       model?.dispose();
//     };
//   }, [isCameraActive]);

//   // Frame analysis for face and lighting
//   const analyzeFrame = () => {
//     if (!webcamRef.current?.video) {
//       return { hasFace: false, lightingOk: false };
//     }

//     const video = webcamRef.current.video;
//     const canvas = document.createElement('canvas');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//     const data = imageData.data;

//     let brightnessSum = 0;
//     let skinTonePixels = 0;

//     // Analyze image data
//     for (let i = 0; i < data.length; i += 4) {
//       const r = data[i];
//       const g = data[i + 1];
//       const b = data[i + 2];
//       brightnessSum += (r + g + b) / 3;

//       // Skin tone detection
//       if (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
//         skinTonePixels++;
//       }
//     }

//     const avgBrightness = brightnessSum / (data.length / 4);
//     const skinToneRatio = skinTonePixels / (data.length / 4);

//     return {
//       hasFace: skinToneRatio > 0.05,
//       lightingOk: avgBrightness > 100 && avgBrightness < 220
//     };
//   };

//   // Convert base64 to Blob
//   const dataURLtoBlob = (dataURL) => {
//     const arr = dataURL.split(',');
//     const mime = arr[0].match(/:(.*?);/)[1];
//     const bstr = atob(arr[1]);
//     let n = bstr.length;
//     const u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new Blob([u8arr], { type: mime });
//   };

//   // Capture image
//   const capture = () => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     const blob = dataURLtoBlob(imageSrc);
//     const file = blob;
//     const previewUrl = URL.createObjectURL(file);

//     const capturedData = {
//       file: file,
//       previewUrl: previewUrl,
//       timestamp: new Date().toISOString(),
//       metadata: {
//         location: location || null,
//         locationError: locationError || null,
//         validation: photoType === 'customer' ? validation : null
//       }
//     };

//     if (onCapture) {
//       onCapture(capturedData);
//     }
    
//     stopCamera();
//   };

//   // Retake photo
//   const retake = () => {
//     startCamera();
//   };

//   // Check if all validations pass
//   const allValid = () => {
//     return validation.hasFace && validation.singlePerson && validation.lightingOk;
//   };

//   return (
//     <div className="container mx-auto p-4 max-w-4xl">
//       <h1 className="text-2xl font-bold mb-6 text-center">Image Capture Validation</h1>
      
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Camera/Image Preview */}
//         <div className="flex-1">
//           <div className={`border-2 rounded-lg overflow-hidden transition-all ${
//             allValid() ? 'border-green-500' : 'border-red-500'
//           }`}>
//             {isCameraActive ? (
//               <div className="relative" style={{ aspectRatio: '4/3' }}>
//                 <Webcam
//                   audio={false}
//                   ref={webcamRef}
//                   screenshotFormat="image/jpeg"
//                   videoConstraints={{
//                     facingMode: 'user',
//                     width: 1280,
//                     height: 720
//                   }}
//                   className="w-full h-full object-cover"
//                 />
//                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                   <div className="border-2 border-dashed border-white rounded-full w-48 h-64 opacity-50"></div>
//                 </div>
//               </div>
//             ) : (
//               <div
//                 className="flex flex-col items-center justify-center bg-gray-100 p-8 h-full"
//                 style={{ aspectRatio: '4/3' }}
//               >
//                 <button
//                   onClick={startCamera}
//                   disabled={isLoading}
//                   className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg disabled:opacity-50"
//                 >
//                   {isLoading ? 'Loading...' : 'Start Camera'}
//                 </button>
//               </div>
//             )}
//           </div>
          
//           <div className="mt-4">
//             {isCameraActive ? (
//               <button
//                 onClick={capture}
//                 disabled={!allValid() || isLoading}
//                 className={`w-full py-3 rounded-lg font-medium transition-colors ${
//                   allValid() && !isLoading
//                     ? 'bg-green-600 hover:bg-green-700 text-white'
//                     : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 }`}
//               >
//                 {isLoading ? 'Processing...' : 'Capture Photo'}
//               </button>
//             ) : (
//               <button
//                 onClick={retake}
//                 className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
//               >
//                 Retake Photo
//               </button>
//             )}
//           </div>
//         </div>
        
//         {/* Validation Panel */}
//         <div className="flex-1">
//           <div className="bg-white p-4 rounded-lg border">
//             <h2 className="text-xl font-semibold mb-4">Validation Requirements</h2>
            
//             <div className="space-y-3">
//               <div className={`flex items-center p-3 rounded ${
//                 validation.hasFace ? 'bg-green-100' : 'bg-red-100'
//               }`}>
//                 <span className="font-medium mr-2">
//                   {validation.hasFace ? '✓' : '✗'} Face detected:
//                 </span>
//                 {personCount} person(s) in frame
//               </div>
//               <div className={`flex items-center p-3 rounded ${
//                 validation.lightingOk ? 'bg-green-100' : 'bg-red-100'
//               }`}>
//                 <span className="font-medium mr-2">
//                   {validation.lightingOk ? '✓' : '✗'} Good lighting
//                 </span>
//               </div>
//               <div className={`flex items-center p-3 rounded ${
//                 validation.singlePerson ? 'bg-green-100' : 'bg-red-100'
//               }`}>
//                 <span className="font-medium mr-2">
//                   {validation.singlePerson ? '✓' : '✗'} Single person in frame
//                 </span>
//               </div>
//               {showLocation && (
//                 <div className={`flex items-center p-3 rounded ${
//                   location ? 'bg-green-100' : 'bg-red-100'
//                 }`}>
//                   <span className="font-medium mr-2">
//                     {location ? '✓' : '✗'} Location captured
//                   </span>
//                   {locationError ? (
//                     <span className="text-red-500 text-sm">Error: {locationError}</span>
//                   ) : location ? (
//                     <span className="text-green-500 text-sm">
//                       {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
//                     </span>
//                   ) : (
//                     <span className="text-yellow-500 text-sm">Acquiring location...</span>
//                   )}
//                 </div>
//               )}
//             </div>
//             <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded mt-4">
//               {hints}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageCaptureValidator;


 