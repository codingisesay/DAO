
import React, { useState, useRef, useEffect } from "react";
import scan_face from "../../assets/imgs/scan_face.gif";
import scan_ray from "../../assets/imgs/scan_ray.gif";
import instruction from "../../assets/imgs/photo_instructions.png";
import Webcam from "react-webcam";

const ImageCaptureValidator = ({
  onCapture,
  photoType = "customer",
  showLocation = true,
  initialPhoto = null,
  hasExistingPhoto = false
}) => {
  const webcamRef = useRef(null);
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
  const [tempAddress, setTempAddress] = useState();

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

      if (data.address) {
        const addressParts = [];
        if (data.address.road) addressParts.push(data.address.road);
        if (data.address.village) addressParts.push(data.address.village);
        if (data.address.town) addressParts.push(data.address.town);
        if (data.address.city) addressParts.push(data.address.city);
        if (data.address.state) addressParts.push(data.address.state);
        if (data.address.country) addressParts.push(data.address.country);

        return addressParts.join(", ");
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
  };

  const stopCamera = () => {
    setIsCameraActive(false);
    setIsWebcamReady(false);
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
  console.log('tom convert base64 : ',new Blob([u8arr]));
    return new Blob([u8arr], { type: mime });
  } catch (error) {
    console.error("Error in dataURLtoBlob:", error);
    console.log("Problematic dataURL prefix:", dataURL.substring(0, 100)); // Log part of the dataURL for inspection
    return null; // Return null or throw the error
  }
};

  // Capture image
const capture = async () => {
    if (!webcamRef.current || !isWebcamReady) return;

    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);

    // If dataURLtoBlob was asynchronous, you would await it here
    const blob =  dataURLtoBlob(imageSrc); // Assuming dataURLtoBlob returns a Promise
    const file =  blob;
    const previewUrl = URL.createObjectURL(file);

    const capturedData = {
      file: file, // This `file` variable will be the Blob
      previewUrl: previewUrl,
      timestamp: new Date().toISOString(),
      metadata: {
        location: location || null,
        locationError: locationError || null,
        address: address || null,
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
      <h1 className="text-xl font-bold mb-2">Live Photo</h1>

      {webcamError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {webcamError}. Please try another browser or upload a photo instead.
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Camera/Image Preview */}
        <div className="flex-1">
          <div className="border-2 rounded-lg overflow-hidden transition-all border-gray-300">
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
                disabled={isLoading}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
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

        {/* Location Panel */}
        <div className="flex-1">
          <div className="text-center">
            {showLocation && location && imgSrc ? (
              <div className="text-start">
                <br />
                <div><i className="bi bi-send"></i> Latitude: {location && location.latitude && location.latitude.toFixed(5)}</div>
                <br />
                <div><i className="bi bi-send"></i> Longitude: {location && location.longitude && location.longitude.toFixed(5)}</div>
                <br />
                {address && <div><i className="bi bi-geo-alt"></i> Address: {address}</div>}
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
                      <img src={instruction} className="mt-20 mx-auto" />
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








// import React, { useState, useRef, useEffect } from "react";
// import scan_face from "../../assets/imgs/scan_face.gif";
// import scan_ray from "../../assets/imgs/scan_ray.gif";
// import instruction from "../../assets/imgs/photo_instructions.png";
// import Webcam from "react-webcam";

// const ImageCaptureValidator = ({
//   onCapture,
//   photoType = "customer",
//   showLocation = true,
//   initialPhoto = null,
//   hasExistingPhoto = false
// }) => {
//   const webcamRef = useRef(null);
//   const [imgSrc, setImgSrc] = useState(initialPhoto?.previewUrl || null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isCameraActive, setIsCameraActive] = useState(false);
//   const [isWebcamReady, setIsWebcamReady] = useState(false);
//   const [webcamError, setWebcamError] = useState(null);
//   const [location, setLocation] = useState(
//     initialPhoto?.metadata?.location || null
//   );
//   const [locationError, setLocationError] = useState(null);
//   const [address, setAddress] = useState(initialPhoto?.metadata?.address || null);
//   const [isFetchingAddress, setIsFetchingAddress] = useState(false);
//   const [tempAddress, setTempAddress] = useState();
// const latitude = location && !isNaN(Number(location.latitude)) ? Number(location.latitude).toFixed(5) : "";
// const longitude = location && !isNaN(Number(location.longitude)) ? Number(location.longitude).toFixed(5) : "";
 
//   // Check browser support
//   const isWebcamSupported = () => {
//     return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
//   };

//   // Function to fetch address from coordinates
//   const fetchAddress = async (lat, lng) => {
//     setIsFetchingAddress(true);
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
//       );
//       const data = await response.json();

//       if (data.address) {
//         const addressParts = [];
//         if (data.address.road) addressParts.push(data.address.road);
//         if (data.address.village) addressParts.push(data.address.village);
//         if (data.address.town) addressParts.push(data.address.town);
//         if (data.address.city) addressParts.push(data.address.city);
//         if (data.address.state) addressParts.push(data.address.state);
//         if (data.address.country) addressParts.push(data.address.country);

//         return addressParts.join(", ");
//       }
//       return "Address not available";
//     } catch (error) {
//       console.error("Error fetching address:", error);
//       return "Error fetching address";
//     } finally {
//       setIsFetchingAddress(false);
//     }
//   };

//   // Webcam onUserMedia handler
//   const handleUserMedia = () => {
//     setIsWebcamReady(true);
//     setWebcamError(null);
//   };

//   // Webcam error handler
//   const handleUserMediaError = (error) => {
//     console.error("Webcam error:", error);
//     setWebcamError(error.message || "Could not access camera");
//     setIsWebcamReady(false);
//     setIsCameraActive(false);
//   };

//   // Get geolocation if enabled
//   useEffect(() => {
//     if (!showLocation || location) return;

//     const getLocation = async () => {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           async (position) => {
//             const locationData = {
//               latitude: position.coords.latitude,
//               longitude: position.coords.longitude,
//               accuracy: position.coords.accuracy,
//               timestamp: new Date(position.timestamp).toISOString(),
//             };
//             setLocation(locationData);

//             const fetchedAddress = await fetchAddress(
//               locationData.latitude,
//               locationData.longitude
//             );
//             setAddress(fetchedAddress);
//           },
//           (error) => {
//             setLocationError(error.message);
//             console.error("Geolocation error:", error);
//           },
//           {
//             enableHighAccuracy: true,
//             timeout: 10000,
//             maximumAge: 0,
//           }
//         );
//       } else {
//         setLocationError("Geolocation not supported");
//       }
//     };

//     getLocation();
//   }, [showLocation, location]);

//   // Camera control functions
//   const startCamera = () => {
//     if (!isWebcamSupported()) {
//       setWebcamError("Webcam not supported in this browser");
//       return;
//     }
//     setIsCameraActive(true);
//     setImgSrc(null);
//     setWebcamError(null);
//   };

//   const stopCamera = () => {
//     setIsCameraActive(false);
//     setIsWebcamReady(false);
//   };

//   // Convert base64 to Blob
// const dataURLtoBlob = (dataURL) => {
//   try {
//     const arr = dataURL.split(",");
//     const mime = arr[0].match(/:(.*?);/)[1];
//     const bstr = atob(arr[1]);
//     let n = bstr.length;
//     const u8arr = new Uint8Array(n);
//     while (n--) {
//       u8arr[n] = bstr.charCodeAt(n);
//     }
//   console.log('tom convert base64 : ',new Blob([u8arr]));
//     return new Blob([u8arr], { type: mime });
//   } catch (error) {
//     console.error("Error in dataURLtoBlob:", error);
//     console.log("Problematic dataURL prefix:", dataURL.substring(0, 100)); // Log part of the dataURL for inspection
//     return null; // Return null or throw the error
//   }
// };

//   // Capture image
// const capture = async () => {
//     if (!webcamRef.current || !isWebcamReady) return;

//     const imageSrc = webcamRef.current.getScreenshot();
//     setImgSrc(imageSrc);

//     // If dataURLtoBlob was asynchronous, you would await it here
//     const blob =  dataURLtoBlob(imageSrc); // Assuming dataURLtoBlob returns a Promise
//     const file =  blob;
//     const previewUrl = URL.createObjectURL(file);

//     const capturedData = {
//       file: file, // This `file` variable will be the Blob
//       previewUrl: previewUrl,
//       timestamp: new Date().toISOString(),
//       metadata: {
//         location: location || null,
//         locationError: locationError || null,
//         address: address || null,
//       },
//     };

//     if (onCapture) {
//       onCapture(capturedData);
//     }

//     stopCamera();
//   };
//   // Retake photo
//   const retake = () => {
//     setImgSrc(null);
//     startCamera();
//   };

//   // Manual file upload handler
//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setImgSrc(event.target.result);
//       const blob = new Blob([file], { type: file.type });
//       const previewUrl = URL.createObjectURL(blob);

//       const capturedData = {
//         file: blob,
//         previewUrl: previewUrl,
//         timestamp: new Date().toISOString(),
//         metadata: {
//           location: location || null,
//           locationError: locationError || null,
//           address: address || null,
//         },
//       };

//       if (onCapture) {
//         onCapture(capturedData);
//       }
//     };
//     reader.readAsDataURL(file);
//   };

//   async function printAddressFromLatLng(lat, lng) {
//     try {
//       const response = await fetch(
//         `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
//       );
//       const data = await response.json();
//       if (data && data.display_name) {
//         setTempAddress(data.display_name);
//       } else {
//         console.log("Address not found");
//       }
//     } catch (error) {
//       console.error("Error fetching address:", error);
//     }
//   }

//   useEffect(() => {
//     if (hasExistingPhoto && hasExistingPhoto.latitude && hasExistingPhoto.longitude) {
//       printAddressFromLatLng(hasExistingPhoto.latitude, hasExistingPhoto.longitude);
//     }
//   }, []);

//   return (
//     <div className="container mx-auto p-4 max-w-4xl"> 
//       {webcamError && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {webcamError}. Please try another browser or upload a photo instead.
//         </div>
//       )}

//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Camera/Image Preview */}
//         <div className="flex-1">
//           <div className="border-2 rounded-lg overflow-hidden transition-all border-gray-300">
//             {imgSrc ? (
//               <div className="relative" style={{ aspectRatio: "4/3" }}>
//                 <img
//                   src={imgSrc}
//                   alt="Captured"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             ) : isCameraActive && isWebcamSupported() ? (
//               <div className="relative" style={{ aspectRatio: "4/3" }}>
//                 <Webcam
//                   audio={false}
//                   ref={webcamRef}
//                   screenshotFormat="image/jpeg"
//                   videoConstraints={{
//                     facingMode: "user",
//                     width: 1280,
//                     height: 720,
//                   }}
//                   className="w-full h-full object-cover"
//                   onUserMedia={handleUserMedia}
//                   onUserMediaError={handleUserMediaError}
//                 />
//                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                   <div className="border-2 border-dashed border-white rounded-full w-48 h-64 opacity-50"></div>
//                 </div>
//               </div>
//             ) : (
//               <div
//                 className="flex flex-col items-center justify-center bg-gray-100 p-8 h-full"
//                 style={{ aspectRatio: "4/3" }}
//               >
//                 {!isWebcamSupported() ? (
//                   <>
//                     <p className="mb-4 text-center">
//                       Webcam not supported in your browser
//                     </p>
//                     <label className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg cursor-pointer">
//                       Upload Photo
//                       <input
//                         type="file"
//                         accept="image/*"
//                         className="hidden"
//                         onChange={handleFileUpload}
//                       />
//                     </label>
//                   </>
//                 ) : (
//                   <button
//                     onClick={startCamera}
//                     disabled={isLoading}
//                     className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg disabled:opacity-50"
//                   >
//                     {isLoading ? "Loading..." : "Start Camera"}
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="mt-4">
//             {imgSrc ? (
//               <button
//                 onClick={retake}
//                 className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
//               >
//                 Retake Photo
//               </button>
//             ) : isCameraActive && isWebcamSupported() ? (
//               <button
//                 onClick={capture}
//                 disabled={isLoading}
//                 className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50"
//               >
//                 {isLoading ? "Processing..." : "Capture Photo"}
//               </button>
//             ) : (
//               !isWebcamSupported() && (
//                 <label className="w-full block py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-center cursor-pointer">
//                   Upload Photo
//                   <input
//                     type="file"
//                     accept="image/*"
//                     className="hidden"
//                     onChange={handleFileUpload}
//                   />
//                 </label>
//               )
//             )}
//           </div>
//         </div>

//         {/* Location Panel */}
//         <div className="flex-1">
//           <div className="text-center">
//             {showLocation && location && imgSrc ? (
//               <div className="text-start">
//                 <br />
//                 <div><i className="bi bi-send"></i> Latitude: {latitude}</div>
//                 <br />
//                 <div><i className="bi bi-send"></i> Longitude: {longitude}</div>
//                 <br />
//                 {address && <div><i className="bi bi-geo-alt"></i> Address: {address}</div>}
//               </div>
//             ) : (
//               <>
//                 {hasExistingPhoto ? (
//                   <>
//                     <div className="max-w-sm mx-auto overflow-hidden space-y-4">
//                       <img
//                         className="h-52 w-52 object-cover border rounded-lg mx-auto"
//                         src={`data:image/jpeg;base64,${hasExistingPhoto.path}`}
//                         alt="Uploaded"
//                       />

//                       <div className="text-gray-700 space-y-2">
//                         <div className="flex gap-2">
//                           <i className="bi bi-send text-green-500" style={{ transform: 'rotate(-45deg)' }}></i>
//                           <p><strong className="inline-block w-15 text-start">Latitude:</strong> {hasExistingPhoto.latitude}</p>
//                         </div>

//                         <div className="flex gap-2">
//                           <i className="bi bi-send text-green-500"></i>
//                           <p><strong className="inline-block w-15 text-start">Longitude:</strong> {hasExistingPhoto.longitude}</p>
//                         </div>

//                         {tempAddress && (
//                           <div className="flex text-start gap-2">
//                             <i className="bi bi-geo-alt text-green-500"></i>
//                             <p><strong className="inline-block w-15 text-start">Address:</strong> {tempAddress}</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="">
//                       <div className="relative py-8 w-[160px] mx-auto">
//                         <img
//                           src={scan_face}
//                           className="absolute top-0 w-[130px] h-[130px]"
//                           alt="scan"
//                         />
//                         <img
//                           src={scan_ray}
//                           className="absolute top-0 w-[130px] h-[130px]"
//                           alt="scan"
//                         />
//                       </div>
//                       <img src={instruction} className="mt-20 mx-auto" />
//                     </div>
//                   </>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageCaptureValidator;