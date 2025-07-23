 import React, { useState, useRef, useEffect } from "react";
// Replaced image imports with placeholder URLs
const scan_face_placeholder = "https://placehold.co/130x130/cccccc/000000?text=Scan+Face";
const scan_ray_placeholder = "https://placehold.co/130x130/cccccc/000000?text=Scan+Ray";
const instruction_placeholder = "https://placehold.co/300x150/cccccc/000000?text=Photo+Instructions";

// Removed direct imports for Webcam, cocoSsd, and tfjs as they will be handled via native APIs or assumed global
// import Webcam from "react-webcam";
// import * as cocoSsd from "@tensorflow-models/coco-ssd";
// import "@tensorflow/tfjs";

const ImageCaptureValidator = ({
  onCapture,
  photoType = "agent",
  showLocation = true,
  initialPhoto = null,
  hasExistingPhoto = false
}) => {
  const webcamRef = useRef(null); // This will now refer to the <video> element
  const [imgSrc, setImgSrc] = useState(initialPhoto?.previewUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  const [location, setLocation] = useState(
    initialPhoto?.metadata?.location || null
  );
  const [locationError, setLocationError] = useState(null);
  const [address, setAddress] = useState(initialPhoto?.metadata?.address || null);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState('');

  // State for validation, now including faceCovered
  const [validation, setValidation] = useState(
    initialPhoto?.metadata?.validation || {
      hasFace: false,
      lightingOk: false,
      singlePerson: false,
      faceCovered: false, // New validation property
    }
  );
  const [hints, setHints] = useState(
    hasExistingPhoto ? "Existing photo loaded" : "Position your face in the frame"
  );
  const [personCount, setPersonCount] = useState(0);


  // Check browser support
  const isWebcamSupported = () => {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  };

  // Function to fetch address from coordinates
  const fetchAddress = async (lat, lng) => {
    setIsFetchingAddress(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.display_name) {
        return data.display_name;
      }
      return "Address not available";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error fetching address";
    } finally {
      setIsFetchingAddress(false);
    }
  };

  // Webcam onUserMedia handler (for native video element)
  const handleUserMedia = () => {
    setIsWebcamReady(true);
    setWebcamError(null);
  };

  // Webcam error handler (for native video element)
  const handleUserMediaError = (error) => {
    console.error("Webcam error:", error);
    setWebcamError(error.message || "Could not access camera");
    setIsWebcamReady(false);
    setIsCameraActive(false);
    setHints(
      "Camera access error. Please check permissions or try another browser."
    );
  };

  // Get geolocation if enabled
  useEffect(() => {
    if (!showLocation || location) return;

    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const locationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: new Date(position.timestamp).toISOString(),
            };
            setLocation(locationData);

            const fetchedAddress = await fetchAddress(
              locationData.latitude,
              locationData.longitude
            );
            setAddress(fetchedAddress);
          },
          (error) => {
            setLocationError(error.message);
            console.error("Geolocation error:", error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        setLocationError("Geolocation not supported");
      }
    };

    getLocation();
  }, [showLocation, location]);

  // Camera control functions
  const startCamera = async () => {
    if (!isWebcamSupported()) {
      setWebcamError("Webcam not supported in this browser");
      return;
    }
    setIsCameraActive(true);
    setImgSrc(null);
    setWebcamError(null);
    setHints("Position your face in the frame");

    // Get media stream and set to video element
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
      }
    } catch (error) {
      handleUserMediaError(error);
    }
  };

  const stopCamera = () => {
    setIsCameraActive(false);
    setIsWebcamReady(false);
    // Stop all tracks on the stream
    if (webcamRef.current && webcamRef.current.srcObject) {
      webcamRef.current.srcObject.getTracks().forEach(track => track.stop());
      webcamRef.current.srcObject = null;
    }
  };

  // Face Detection Setup
  useEffect(() => {
    let mounted = true;
    let model;
    let detectionInterval;

    const loadModel = async () => {
      if (!isCameraActive || !isWebcamReady) return;

      // Check for global availability of tf and cocoSsd
      if (!window.tf || !window.cocoSsd) {
        const errorMessage = "Face detection libraries (TensorFlow.js or COCO-SSD) not found. Please ensure they are loaded via CDN scripts.";
        console.error(errorMessage);
        setWebcamError(errorMessage); // Set a critical error
        setIsLoading(false);
        setHints(errorMessage);
        // Do not proceed with model loading or detection if libraries are missing
        return;
      }

      try {
        setIsLoading(true);
        // Use window.cocoSsd assuming it's loaded via CDN scripts
        model = await window.cocoSsd.load();

        const detect = async () => {
          if (!mounted || !webcamRef.current || !webcamRef.current.videoWidth) { // Check videoWidth for readiness
            return;
          }

          const video = webcamRef.current;

          if (
            video.readyState !== 4 ||
            video.videoWidth === 0 ||
            video.videoHeight === 0
          ) {
            return;
          }

          try {
            const predictions = await model.detect(video);
            const people = predictions.filter((p) => p.class === "person");
            const { hasFace, lightingOk } = analyzeFrame(video);

            let currentHasFace = hasFace;
            let currentLightingOk = lightingOk;
            let currentSinglePerson = people.length === 1;
            let currentFaceCovered = false; // Initialize

            if (currentSinglePerson) {
                if (!currentHasFace) {
                    // If a single person is detected by coco-ssd, but our skin tone analysis says no clear face,
                    // it's a weak indicator of a covered face.
                    currentFaceCovered = true;
                    setHints("Face might be covered. Please ensure your face is fully visible.");
                } else if (!currentLightingOk) {
                    setHints("Lighting not optimal. Adjust your environment");
                } else {
                    setHints("Ready to capture");
                }
            } else if (people.length === 0) {
                setHints("No face detected. Position your face in the frame");
            } else if (people.length > 1) {
                setHints("Multiple people detected. Only one person should be in frame");
            }

            if (mounted) {
              setValidation({
                hasFace: currentHasFace,
                lightingOk: currentLightingOk,
                singlePerson: currentSinglePerson,
                faceCovered: currentFaceCovered, // Update validation state
              });
              setPersonCount(people.length);
            }
          } catch (error) {
            console.error("Detection error:", error);
          }
        };

        detectionInterval = setInterval(detect, 500);
      } catch (error) {
        console.error("Model loading error:", error);
        setHints("Error loading detection model.");
        setWebcamError("Error loading detection model. Try refreshing."); // Set error
      } finally {
        setIsLoading(false);
      }
    };

    if (isCameraActive && isWebcamReady) {
      loadModel();
    }

    return () => {
      mounted = false;
      clearInterval(detectionInterval);
      model?.dispose();
    };
  }, [isCameraActive, isWebcamReady]);

  // Frame analysis for face and lighting
  const analyzeFrame = (video) => {
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      return { hasFace: false, lightingOk: false };
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let brightnessSum = 0;
    let skinTonePixels = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      brightnessSum += (r + g + b) / 3;

      // Simple skin tone detection (can be improved)
      if (
        r > 95 &&
        g > 40 &&
        b > 20 &&
        r > g &&
        r > b &&
        Math.abs(r - g) > 15
      ) {
        skinTonePixels++;
      }
    }

    const avgBrightness = brightnessSum / (data.length / 4);
    const skinToneRatio = skinTonePixels / (data.length / 4);

    return {
      hasFace: skinToneRatio > 0.05, // Threshold for face presence
      lightingOk: avgBrightness > 100 && avgBrightness < 220, // Optimal brightness range
    };
  };

  // Convert base64 to Blob
  const dataURLtoBlob = (dataURL) => {
    try {
      const arr = dataURL.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    } catch (error) {
      console.error("Error in dataURLtoBlob:", error);
      console.log("Problematic dataURL prefix:", dataURL.substring(0, 100));
      return null;
    }
  };

  // Capture image
  const capture = async () => {
    if (!webcamRef.current || !isWebcamReady) return;

    const video = webcamRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageSrc = canvas.toDataURL("image/jpeg"); // Get image from canvas

    setImgSrc(imageSrc);

    const blob = dataURLtoBlob(imageSrc);
    if (!blob) {
      console.error("Failed to convert image to Blob.");
      return;
    }
    const file = blob;
    const previewUrl = URL.createObjectURL(file);

    const capturedData = {
      file: file,
      previewUrl: previewUrl,
      timestamp: new Date().toISOString(),
      metadata: {
        location: location || null,
        locationError: locationError || null,
        address: address || null,
        validation: validation, // Include validation for agent photos as well
      },
    };

    if (onCapture) {
      onCapture(capturedData);
    }

    stopCamera();
  };
  
  // Retake photo
  const retake = () => {
    setImgSrc(null);
    startCamera();
  };

  // Check if all validations pass, now including faceCovered
  const allValid = () => {
    return (
      validation.hasFace && validation.singlePerson && validation.lightingOk && !validation.faceCovered
    );
  };

  // Manual file upload handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImgSrc(event.target.result);
      const blob = new Blob([file], { type: file.type });
      const previewUrl = URL.createObjectURL(blob);

      const capturedData = {
        file: blob,
        previewUrl: previewUrl,
        timestamp: new Date().toISOString(),
        metadata: {
          location: location || null,
          locationError: locationError || null,
          address: address || null,
          validation: null, // Skip validation for uploaded files
        },
      };

      if (onCapture) {
        onCapture(capturedData);
      }
    };
    reader.readAsDataURL(file);
  };

  async function printAddressFromLatLng(lat, lng) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setTempAddress(data.display_name);
      } else {
        console.log("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  }

  useEffect(() => {
    if (hasExistingPhoto && hasExistingPhoto.latitude && hasExistingPhoto.longitude) {
      printAddressFromLatLng(hasExistingPhoto.latitude, hasExistingPhoto.longitude);
    }
  }, [hasExistingPhoto]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-xl font-bold mb-2">
        {photoType === "agent" ? "Agent Live Photo" : "Customer Live Photo"}
      </h1>

      {webcamError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {webcamError}. Please try another browser or upload a photo instead.
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Camera/Image Preview */}
        <div className="flex-1">
          <div
            className={`border-2 rounded-lg overflow-hidden transition-all ${
              imgSrc
                ? "border-gray-300"
                : allValid()
                ? "border-green-500"
                : "border-red-500"
            }`}
          >
            {imgSrc ? (
              <div className="relative" style={{ aspectRatio: "4/3" }}>
                <img
                  src={imgSrc}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : isCameraActive && isWebcamSupported() ? (
              <div className="relative" style={{ aspectRatio: "4/3" }}>
                {/* Replaced Webcam component with native video element */}
                <video
                  ref={webcamRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  onLoadedMetadata={handleUserMedia} // Equivalent to onUserMedia for video readiness
                  onError={handleUserMediaError} // For video element errors
                ></video>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-2 border-dashed border-white rounded-full w-48 h-64 opacity-50"></div>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center bg-gray-100 p-8 h-full"
                style={{ aspectRatio: "4/3" }}
              >
                {!isWebcamSupported() ? (
                  <>
                    <p className="mb-4 text-center">
                      Webcam not supported in your browser
                    </p>
                    <label className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg cursor-pointer">
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </>
                ) : (
                  <button
                    onClick={startCamera}
                    disabled={isLoading}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg disabled:opacity-50"
                  >
                    {isLoading ? "Loading..." : "Start Camera"}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-4">
            {imgSrc ? (
              <button
                onClick={retake}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
              >
                Retake Photo
              </button>
            ) : isCameraActive && isWebcamSupported() ? (
              <button
                onClick={capture}
                disabled={!allValid() || isLoading} // Disable if not valid or loading
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  allValid() && !isLoading
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Processing..." : "Capture Photo"}
              </button>
            ) : (
              !isWebcamSupported() && (
                <label className="w-full block py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-center cursor-pointer">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              )
            )}
          </div>
        </div>

        {/* Validation and Location Panel */}
        <div className="flex-1">
          <div className="text-center">
            {showLocation && location && imgSrc ? (
              <div className="text-start">
                <br />
                <div><i className="bi bi-send"></i> Latitude: {location && location.latitude ? location.latitude.toFixed(5) : <></>}</div>
                <br />
                <div><i className="bi bi-send"></i> Longitude: {location && location.longitude ? location.longitude.toFixed(5) : <></>}</div>
                <br />
                {address && <div><i className="bi bi-geo-alt"></i> Address: {address}</div>}
                
                <hr />
                 
                <div className="space-y-3">
                  {/* Validation checks for agent photos */}
                  <br />
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
                      {validation.singlePerson ? '✓' : '✗'} Person in frame
                    </span>
                  </div>
                   <div className={`flex items-center p-3 rounded ${
                    !validation.faceCovered ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <span className="font-medium mr-2">
                      {!validation.faceCovered ? '✓' : '✗'} Face not covered
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {hasExistingPhoto ? (
                  <>
                    <div className="max-w-sm mx-auto overflow-hidden space-y-4">
                      <img
                        className="h-52 w-52 object-cover border rounded-lg mx-auto"
                        src={`data:image/jpeg;base64,${hasExistingPhoto.path}`}
                        alt="Uploaded"
                      />

                      <div className="text-gray-700 space-y-2">
                        <div className="flex gap-2">
                          <i className="bi bi-send text-green-500" style={{ transform: 'rotate(-45deg)' }}></i>
                          <p><strong className="inline-block w-15 text-start">Latitude:</strong> {hasExistingPhoto.latitude}</p>
                        </div>

                        <div className="flex gap-2">
                          <i className="bi bi-send text-green-500"></i>
                          <p><strong className="inline-block w-15 text-start">Longitude:</strong> {hasExistingPhoto.longitude}</p>
                        </div>

                        {tempAddress && (
                          <div className="flex text-start gap-2">
                            <i className="bi bi-geo-alt text-green-500"></i>
                            <p><strong className="inline-block w-15 text-start">Address:</strong> {tempAddress}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="">
                      <div className="relative py-8 w-[160px] mx-auto">
                        <img
                          src={scan_face_placeholder} // Using placeholder
                          className="absolute top-0 w-[130px] h-[130px]"
                          alt="scan"
                        />
                        <img
                          src={scan_ray_placeholder} // Using placeholder
                          className="absolute top-0 w-[130px] h-[130px]"
                          alt="scan"
                        />
                      </div>
                      <img src={instruction_placeholder} className="mt-20 mx-auto" alt="instructions" /> {/* Using placeholder */}
                      {/* Hints for live capture */}
                      <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded mt-3">
                        {hints}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCaptureValidator;
