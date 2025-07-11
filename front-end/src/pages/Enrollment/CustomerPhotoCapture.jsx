

import React, { useState, useRef, useEffect } from "react";
import scan_face from "../../assets/imgs/scan_face.gif";
import scan_ray from "../../assets/imgs/scan_ray.gif";
import instruction from "../../assets/imgs/photo_instructions.png";
import Webcam from "react-webcam";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs";

const ImageCaptureValidator = ({
  onCapture,
  photoType = "customer",
  showLocation = true,
  initialPhoto = null,
  hasExistingPhoto =false
}) => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(initialPhoto?.previewUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isWebcamReady, setIsWebcamReady] = useState(false);
  const [webcamError, setWebcamError] = useState(null);const [tempAddress, setTempAddress] = useState();
  const [validation, setValidation] = useState(
    initialPhoto?.metadata?.validation || {
      hasFace: false,
      lightingOk: false,
      singlePerson: false,
    }
  );
  
  const [hints, setHints] = useState(
    hasExistingPhoto ? "Existing photo loaded" : "Position your face in the frame"
  );
  const [personCount, setPersonCount] = useState(0);
  const [location, setLocation] = useState(
    initialPhoto?.metadata?.location || null
  );
  const [locationError, setLocationError] = useState(null);
  const [address, setAddress] = useState(initialPhoto?.metadata?.address || null);
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  // Check browser support
  const isWebcamSupported = () => {
    return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
  };

  // Function to fetch address from coordinates

//   // Function to fetch address from coordinates
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

  // Webcam onUserMedia handler
  const handleUserMedia = () => {
    setIsWebcamReady(true);
    setWebcamError(null);
  };

  // Webcam error handler
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
  const startCamera = () => {
    if (!isWebcamSupported()) {
      setWebcamError("Webcam not supported in this browser");
      return;
    }
    setIsCameraActive(true);
    setImgSrc(null);
    setWebcamError(null);
    setHints("Position your face in the frame");
  };

  const stopCamera = () => {
    setIsCameraActive(false);
    setIsWebcamReady(false);
  };

  // Face Detection Setup
  useEffect(() => {
    let mounted = true;
    let model;
    let detectionInterval;

    const loadModel = async () => {
      if (!isCameraActive || !isWebcamReady) return;

      try {
        setIsLoading(true);
        model = await cocoSsd.load();

        const detect = async () => {
          if (!mounted || !webcamRef.current || !webcamRef.current.video) {
            return;
          }

          const video = webcamRef.current.video;

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

            if (mounted) {
              setValidation({
                hasFace,
                lightingOk,
                singlePerson: people.length === 1,
              });

              setPersonCount(people.length);
              if (people.length === 0) {
                setHints("No face detected. Position your face in the frame");
              } else if (people.length > 1) {
                setHints(
                  "Multiple people detected. Only one person should be in frame"
                );
              } else if (!hasFace) {
                setHints("Face not clearly visible. Move into better lighting");
              } else if (!lightingOk) {
                setHints("Lighting not optimal. Adjust your environment");
              } else {
                setHints("Ready to capture");
              }
            }
          } catch (error) {
            console.error("Detection error:", error);
          }
        };

        detectionInterval = setInterval(detect, 500);
      } catch (error) {
        console.error("Model loading error:", error);
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
      hasFace: skinToneRatio > 0.05,
      lightingOk: avgBrightness > 100 && avgBrightness < 220,
    };
  };

  // Convert base64 to Blob
  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(",");
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
    if (!webcamRef.current || !isWebcamReady) return;

    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);

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
        address: address || null,
        validation: photoType === "customer" ? validation : null,
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

  // Check if all validations pass
  const allValid = () => {
    return (
      validation.hasFace && validation.singlePerson && validation.lightingOk
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
        // console.log('to show at address : ',  data)
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
      <h1 className="text-xl font-bold mb-6 text-center">
        Image Capture Validation
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
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    facingMode: "user",
                    width: 1280,
                    height: 720,
                  }}
                  className="w-full h-full object-cover"
                  onUserMedia={handleUserMedia}
                  onUserMediaError={handleUserMediaError}
                />
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
                disabled={!allValid() || isLoading}
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

        {/* Validation Panel */}
        <div className="flex-1">
          <div className="text-center">
            {showLocation && location && imgSrc ? (
              <div className=" text-start"><br />
                <div> <i className="bi bi-send"></i> Latitude : {location.latitude.toFixed(5)}</div><br />
                <div> <i className="bi bi-send"></i> Longitude : {location.longitude.toFixed(5)}</div><br />
                 {address && <div> <i className="bi bi-geo-alt"></i> Address : {address}</div>} 

                 <hr />
                 
                  <div className="space-y-3">
                    {photoType === 'customer' && (
                      <>
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
                      </>
                    )}
                  </div>
                    </div>
                  ) : (
                    <> 
                      {hasExistingPhoto ?
                        ( 
                          <>
                        <img className="border rounded-lg h-[200px] w-[200px] mx-auto" src={`data:image/jpeg;base64,${hasExistingPhoto.path}`} /> 
                          <br />
                        {/* <div> <i className="bi bi-send"></i> Latitude : {hasExistingPhoto.latitude}</div> 
                        <div> <i className="bi bi-send"></i> Longitude : {hasExistingPhoto.longitude}</div><br /> */}
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
                        </>
                      ):
                        (<>
                        <div className="">
                            <div className="relative py-8 w-[160px] mx-auto">
                        <img
                          src={scan_face}
                          className="absolute top-0 w-[130px] h-[130px]"
                          alt="scan"
                        />
                        <img
                          src={scan_ray}
                          className="absolute top-0 w-[130px] h-[130px]"
                          alt="scan"
                        />
                      </div>
                      <img src={instruction} className="  mt-20 mx-auto" />

                      <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded mt-3">
                        {hints}
                      </div>

                        </div>
                        </>   
                        ) 
                      }
                    </>
                   )}
          </div>
        </div>




      </div>
    </div>
  );
};

export default ImageCaptureValidator;














 