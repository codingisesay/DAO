// RND_DND_GetSignphoto_DocUpload.jsx
import { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import { Upload, Camera, X, Trash2, Info } from "lucide-react";
import workingman from "../../assets/imgs/upload_placeholder.png";
import Swal from "sweetalert2";
 
const DocumentUpload = ({
  onDocumentsUpdate,
  onProcessDocument,
  documents,
}) => {
  const [selectedIdentityProof, setSelectedIdentityProof] = useState("");
  const [selectedAddressProof, setSelectedAddressProof] = useState("");
  const [selectedSignatureProof, setSelectedSignatureProof] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadSide, setUploadSide] = useState("");
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const [activeDocumentType, setActiveDocumentType] = useState("");
  const [activeDocumentValue, setActiveDocumentValue] = useState("");
  const [activeSide, setActiveSide] = useState("");
  const [document, setDocuments] = useState(documents || []);
  const [showAlert, setShowAlert] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    message: "",
    type: "",
  });
 
  const showAlertMessage = (title, message, type, duration = 2000) => {
    setAlertConfig({ title, message, type });
    setShowAlert(true);
    if (duration > 0) {
      setTimeout(() => setShowAlert(false), duration);
    }
  };
 
  function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  }
 
  const identityProofOptions = [
    { value: "AADHAAR_CARD_FRONT", label: "Aadhaar Card Front" },
    { value: "AADHAAR_CARD_BACK", label: "Aadhaar Card Back" },
    { value: "PAN_CARD", label: "Pan Card" },
    { value: "VOTER_ID_CARD", label: "Voter Id Card" },
    { value: "PASSPORT", label: "Passport" },
    { value: "DRIVING_LICENSE", label: "Driving License" },
  ];
 
  const addressProofOptions = [
    { value: "AADHAAR_CARD_FRONT", label: "Aadhaar Card Front" },
    { value: "AADHAAR_CARD_BACK", label: "Aadhaar Card Back" },
    {
      value: "UTILITY_BILL",
      label: "Utility Bill(Electricity/Water/Gas Bill)",
    },
    { value: "RENT_AGREEMENT", label: "Rent Agreement" },
    { value: "BANK_STATEMENT", label: "Bank Statement (recent)" },
    { value: "PROPERTY_TAX_RECEIPT", label: "Property Tax Receipt" },
  ];
 
  const signatureProofOption = { value: "SIGNATURE", label: "Signature" };
 
  const isDocumentUploaded = (documentValue) => {
    // For Aadhaar, we want to allow uploading both front and back
    if (documentValue === "AADHAAR_CARD_FRONT") {
      return document.some((doc) => doc.type === "AADHAAR_CARD_FRONT");
    }
    if (documentValue === "AADHAAR_CARD_BACK") {
      return document.some((doc) => doc.type === "AADHAAR_CARD_BACK");
    }
    // For other documents, prevent re-uploading the same type
    return document.some((doc) => doc.type.includes(documentValue));
  };
 
  const isAadhaarFrontUploaded = () => {
    return document.some((doc) => doc.type === "AADHAAR_CARD_FRONT");
  };
 
  const isAadhaarBackUploaded = () => {
    return document.some((doc) => doc.type === "AADHAAR_CARD_BACK");
  };
 
  const validateAadhaarCard = async (imageData, side) => {
    setLoading(true);
    try {
      const result = await Tesseract.recognize(imageData, "eng", {
        logger: (m) => console.log(m),
      });
 
      const extractedText = result.data.text.toLowerCase();
 
      if (side === "FRONT") {
        const hasGender =
          extractedText.includes("male") || extractedText.includes("female");
        const hasAadhaarNumber = /\d{4}\s\d{4}\s\d{4}/.test(result.data.text);
        const hasGovtIndia = /government of india/i.test(result.data.text);
        const hasDOB = /\d{2}\/\d{2}\/\d{4}/.test(result.data.text);
 
        if (!hasGender) {
          showAlertMessage(
            "Error",
            "This does not appear to be a valid Aadhaar card front side (gender not found)",
            "error"
          );
          return { isValid: false };
        }
 
        if ((hasGovtIndia && hasAadhaarNumber && hasDOB) || false) {
          const extractedInfo = {
            name:
              result.data.text.match(/([A-Z][a-z]+(\s[A-Z][a-z]+)+)/)?.[0] ||
              "Not found",
            dob:
              result.data.text.match(/\d{2}\/\d{2}\/\d{4}/)?.[0] || "Not found",
            gender: hasGender
              ? extractedText.includes("female")
                ? "FEMALE"
                : "MALE"
              : "Not found",
            aadhaarNumber:
              result.data.text.match(/\d{4}\s\d{4}\s\d{4}/)?.[0] || "Not found",
          };
 
          return { isValid: true, extractedInfo };
        }
 
        return { isValid: true };
      } else if (side === "BACK") {
        const hasUIDAI = /Address/i.test(result.data.text);
 
        if (!hasUIDAI) {
          showAlertMessage(
            "Error",
            "This does not appear to be a valid Aadhaar card back side (Address not found)",
            "error"
          );
          return { isValid: false };
        }
 
        return { isValid: true };
      }
 
      return { isValid: true };
    } catch (error) {
      console.error("Aadhaar validation error:", error);
      showAlertMessage(
        "Error",
        "Failed to process Aadhaar card image",
        "error"
      );
      return { isValid: false };
    } finally {
      setLoading(false);
    }
  };
 
  const validatePANCard = async (imageData) => {
    setLoading(true);
    try {
      const result = await Tesseract.recognize(imageData, "eng", {
        logger: (m) => console.log(m),
      });
 
      const extractedText = result.data.text.toUpperCase();
      const hasPANNumber = /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(extractedText);
      const hasIncomeText = /INCOME/.test(extractedText);
      const hasTaxText = /TAX|PERMANENT ACCOUNT NUMBER/.test(extractedText);
      const hasGovtIndia = /GOVERNMENT OF INDIA/.test(extractedText);
 
      if (!hasIncomeText) {
        showAlertMessage(
          "Error",
          'This does not appear to be a valid PAN card ("INCOME" text not found)',
          "error"
        );
        return { isValid: false };
      }
 
      if (!hasPANNumber) {
        showAlertMessage(
          "Error",
          "This does not appear to be a valid PAN card (PAN number format not found)",
          "error"
        );
        return { isValid: false };
      }
 
      if (hasPANNumber && hasIncomeText && (hasTaxText || hasGovtIndia)) {
        const panNumberMatch = extractedText.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);
        const extractedInfo = {
          panNumber: panNumberMatch ? panNumberMatch[0] : "Not found",
          name: extractedText.match(/[A-Z]+ [A-Z]+/)?.[0] || "Not found",
        };
 
        return { isValid: true, extractedInfo };
      }
 
      return { isValid: true };
    } catch (error) {
      console.error("PAN validation error:", error);
      showAlertMessage("Error", "Failed to process PAN card image", "error");
      return { isValid: false };
    } finally {
      setLoading(false);
    }
  };
 
  const processImage = async (
    imageData,
    documentType,
    documentValue,
    side,
    skipValidation = false
  ) => {
    let isValid = true;
    let extractedInfo = null;
 
    // Skip validation only for non-PAN and non-Aadhaar documents
    const shouldValidate =
      !skipValidation &&
      (documentValue === "PAN_CARD" ||
        documentValue === "AADHAAR_CARD_FRONT" ||
        documentValue === "AADHAAR_CARD_BACK");
 
    if (shouldValidate) {
      if (
        documentValue === "AADHAAR_CARD_FRONT" ||
        documentValue === "AADHAAR_CARD_BACK"
      ) {
        const validationResult = await validateAadhaarCard(
          imageData,
          documentValue === "AADHAAR_CARD_FRONT" ? "FRONT" : "BACK"
        );
        isValid = validationResult.isValid;
        extractedInfo = validationResult.extractedInfo;
      } else if (documentValue === "PAN_CARD") {
        const validationResult = await validatePANCard(imageData);
        isValid = validationResult.isValid;
        extractedInfo = validationResult.extractedInfo;
      }
 
      if (!isValid) {
        setPreviewImage(null);
        return false;
      }
    }
 
    let docType =
      documentValue === "AADHAAR_CARD_FRONT"
        ? "AADHAAR_CARD_FRONT"
        : documentValue === "AADHAAR_CARD_BACK"
        ? "AADHAAR_CARD_BACK"
        : `${documentValue}_JPG`;
 
    const blob = await fetch(imageData).then((res) => res.blob());
    const file = new File([blob], `${documentValue}.jpg`, {
      type: "image/jpeg",
    });
 
    const newDocument = {
      id: Date.now(),
      type: docType,
      name: documentValue.includes("AADHAAR")
        ? `${toTitleCase(documentValue.replace(/_/g, " "))}`
        : `${toTitleCase(documentValue.replace(/_/g, " "))}`,
      image: imageData,
      file: file,
      uploadedAt: new Date().toLocaleString(),
      documentCategory: documentType,
      isValid: isValid,
      ...(extractedInfo && { extractedInfo }),
    };
 
    const updatedDocuments = [...document, newDocument];
    setDocuments(updatedDocuments);
    if (onDocumentsUpdate) {
      onDocumentsUpdate(updatedDocuments);
    }
 
    if (onProcessDocument) {
      onProcessDocument(newDocument);
    }
 
    // New logic for Aadhaar card pairing
    if (documentValue === "AADHAAR_CARD_FRONT") {
      // If front is uploaded, and back is not, suggest uploading back
      if (!isAadhaarBackUploaded()) {
        setTimeout(() => {
          showAlertMessage(
            "Upload Back Side",
            "Please upload the back side of your Aadhaar card to complete the process.",
            "info",
            3000
          );
          // Pre-select Aadhaar Card Back in the Address Proof dropdown
          setSelectedAddressProof("AADHAAR_CARD_BACK");
        }, 1000);
      } else {
        // If both are uploaded, clear the selection for Aadhaar in both dropdowns
        setSelectedIdentityProof("");
        setSelectedAddressProof("");
      }
    } else if (documentValue === "AADHAAR_CARD_BACK") {
      // If back is uploaded, and front is not, suggest uploading front
      if (!isAadhaarFrontUploaded()) {
        setTimeout(() => {
          showAlertMessage(
            "Upload Front Side",
            "Please upload the front side of your Aadhaar card to complete the process.",
            "info",
            3000
          );
          // Pre-select Aadhaar Card Front in the Identity Proof dropdown
          setSelectedIdentityProof("AADHAAR_CARD_FRONT");
        }, 1000);
      } else {
        // If both are uploaded, clear the selection for Aadhaar in both dropdowns
        setSelectedIdentityProof("");
        setSelectedAddressProof("");
      }
    } else {
      // For non-Aadhaar documents, clear the current selection
      // if (documentType === "identity") {
      //   setSelectedIdentityProof("");
      // } else if (documentType === "address") {
      //   setSelectedAddressProof("");
      // } else if (documentType === "signature") {
      //   setSelectedSignatureProof("");
      // }
    }
 
    return true;
  };
 
  const handleFileChange = async (e, documentType, documentValue, side) => {
    const file = e.target.files[0];
    if (!file) return;
 
    if (file.size > 5 * 1024 * 1024) {
      showAlertMessage("Error", "File size must not exceed 5MB", "error");
      return;
    }
 
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      showAlertMessage("Error", "Only JPG/PNG files are allowed", "error");
      return;
    }
 
    const reader = new FileReader();
    reader.onload = async () => {
      const imageData = reader.result;
      setPreviewImage(imageData);
      await processImage(imageData, documentType, documentValue, side);
    };
    reader.readAsDataURL(file);
  };
 
  const startCamera = (documentType, documentValue) => {
    setActiveDocumentType(documentType);
    setActiveDocumentValue(documentValue);
    setShowCameraModal(true);
 
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          setStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Camera error:", err);
          showAlertMessage(
            "Error",
            "Could not access camera. Please ensure you have granted camera permissions.",
            "error"
          );
          setShowCameraModal(false);
        });
    } else {
      showAlertMessage(
        "Error",
        "Camera access not supported in this environment.",
        "error"
      );
      setShowCameraModal(false);
    }
  };
 
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setShowCameraModal(false);
  };
 
  const capturePhoto = async () => {
    if (
      typeof window === "undefined" ||
      !window.document ||
      !videoRef.current
    ) {
      console.error(
        "Attempted to capture photo in a non-browser environment or without video stream."
      );
      showAlertMessage(
        "Error",
        "Cannot capture photo: Browser environment or video stream not ready.",
        "error"
        );
      return;
    }
 
    const canvas = window.document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
 
    const imageData = canvas.toDataURL("image/jpeg");
    setPreviewImage(imageData);
 
    // Only skip validation for non-PAN and non-Aadhaar documents
    const skipValidation = ![
      "PAN_CARD",
      "AADHAAR_CARD_FRONT",
      "AADHAAR_CARD_BACK",
    ].includes(activeDocumentValue);
 
    const success = await processImage(
      imageData,
      activeDocumentType,
      activeDocumentValue,
      "",
      skipValidation
    );
 
    if (success) {
      stopCamera();
    }
  };
 
  const removeDocument = (id) => {
    const docToRemove = document.find((doc) => doc.id === id);
    const updatedDocuments = document.filter((doc) => doc.id !== id);
    setDocuments(updatedDocuments);
    if (onDocumentsUpdate) {
      onDocumentsUpdate(updatedDocuments);
    }
 
    showAlertMessage(
      "Document Removed",
      `${docToRemove.name} has been removed`,
      "success"
    );
 
    // Logic to handle Aadhaar pairing when one is removed
    if (docToRemove?.type === "AADHAAR_CARD_FRONT") {
      // If Aadhaar Front was removed, and Aadhaar Back is still present,
      // ensure Aadhaar Front can be selected again for re-upload.
      if (isAadhaarBackUploaded()) {
        setSelectedIdentityProof("AADHAAR_CARD_FRONT"); // Pre-select for re-upload
      } else {
        setSelectedIdentityProof(""); // Clear if both were removed or only front was there
      }
    } else if (docToRemove?.type === "AADHAAR_CARD_BACK") {
      // If Aadhaar Back was removed, and Aadhaar Front is still present,
      // ensure Aadhaar Back can be selected again for re-upload.
      if (isAadhaarFrontUploaded()) {
        setSelectedAddressProof("AADHAAR_CARD_BACK"); // Pre-select for re-upload
      } else {
        setSelectedAddressProof(""); // Clear if both were removed or only back was there
      }
    } 
    else {
      // For other documents, clear their respective selections
      if (docToRemove?.documentCategory === "identity") {
        setSelectedIdentityProof("");
      } else if (docToRemove?.documentCategory === "address") {
        setSelectedAddressProof("");
      } else if (docToRemove?.documentCategory === "signature") {
        setSelectedSignatureProof("");
      }
    }
 
    if (updatedDocuments.length === 0) {
      setPreviewImage(null);
    }
  };
 
  const triggerFileInput = (documentType, documentValue, side) => {
    // For Aadhaar, we specifically want to allow re-upload if the other side is missing
    if (!documentValue || (isDocumentUploaded(documentValue) && !documentValue.includes("AADHAAR"))) return;
 
    if (documentValue.includes("AADHAAR")) {
      setUploadSide(documentValue === "AADHAAR_CARD_FRONT" ? "FRONT" : "BACK");
    }
 
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
 
    fileInputRef.current.click();
 
    const originalOnChange = fileInputRef.current.onchange;
    fileInputRef.current.onchange = (e) => {
      handleFileChange(e, documentType, documentValue, side);
      fileInputRef.current.onchange = originalOnChange;
    };
  };
 
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);
 
  useEffect(() => {
    setDocuments(documents || []);
  }, [documents]);
 
  useEffect(() => {
    if (showAlert) {
      Swal.fire({
        title: alertConfig.title,
        text: alertConfig.message,
        icon: alertConfig.type || "info", // e.g., 'success', 'error', 'warning', 'info', 'question'
        confirmButtonText: "OK",
      }).then(() => {
        setShowAlert(false); // close alert after user clicks OK
      });
    }
  }, [showAlert]);
  return (
    <div className="document-upload-container p-4 mx-auto">
      <h2 className="text-xl font-bold mb-1">Upload Documents</h2>
      <div className="text-sm text-gray-600 mb-6 flex items-center text-green-700">
        <Info size={16} className="mr-1" />
        <span>
          All documents must be scanned copy in jpg/png format - size must not
          exceed 5mb
        </span>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-1 gap-6">
        <div className="space-y-6">
          {/* Identity Proof Section */}
          <div className="document-section">
            <div className="flex items-center relative">
              <span className="absolute top-0 text-xs mx-2 bg-white px-1 dark:bg-gray-900 dark:text-white">
                Identity Proof
              </span>
              <select
                className="flex-1 p-2 border rounded mt-2  dark:bg-gray-900 dark:text-white"
                value={selectedIdentityProof}
                onChange={(e) => setSelectedIdentityProof(e.target.value)}
              >
                <option value="">Select Identity Proof</option>
                {identityProofOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    // Disable if already uploaded, unless it's an Aadhaar card and the other side is missing
                    disabled={
                      isDocumentUploaded(option.value) &&
                      !(
                        (option.value === "AADHAAR_CARD_FRONT" && !isAadhaarBackUploaded()) ||
                        (option.value === "AADHAAR_CARD_BACK" && !isAadhaarFrontUploaded())
                      )
                    }
                  >
                    {isDocumentUploaded(option.value) &&
                    !(
                      (option.value === "AADHAAR_CARD_FRONT" && !isAadhaarBackUploaded()) ||
                      (option.value === "AADHAAR_CARD_BACK" && !isAadhaarFrontUploaded())
                    )
                      ? `${option.label} (Uploaded)`
                      : option.label}
                  </option>
                ))}
              </select>{" "}
              &emsp;
              {selectedIdentityProof &&
                !(isDocumentUploaded(selectedIdentityProof) &&
                  !(
                    (selectedIdentityProof === "AADHAAR_CARD_FRONT" && !isAadhaarBackUploaded()) ||
                    (selectedIdentityProof === "AADHAAR_CARD_BACK" && !isAadhaarFrontUploaded())
                  )) && (
                  <div className="mt-2 flex flex-col">
                    <div className="flex justify-center gap-4">
                      <button
                        className="text-green-500"
                        onClick={() =>
                          triggerFileInput(
                            "identity",
                            selectedIdentityProof,
                            ""
                          )
                        }
                        title="Upload from device"
                      >
                        <Upload size={18} />
                      </button>
                      <button
                        className="text-green-500"
                        onClick={() =>
                          startCamera("identity", selectedIdentityProof)
                        }
                        title="Take photo"
                      >
                        <Camera size={18} />
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
 
          {/* Address Proof Section */}
          <div className="document-section">
            <div className="flex items-center relative">
              <span className="absolute top-0 text-xs mx-2 bg-white px-1 dark:bg-gray-900 dark:text-white">
                Address Proof
              </span>
              <select
                className="flex-1 p-2 border rounded mt-2 dark:bg-gray-900 dark:text-white"
                value={selectedAddressProof}
                onChange={(e) => setSelectedAddressProof(e.target.value)}
              >
                <option value="">Select Address Proof</option>
                {addressProofOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    // Disable if already uploaded, unless it's an Aadhaar card and the other side is missing
                    disabled={
                      isDocumentUploaded(option.value) &&
                      !(
                        (option.value === "AADHAAR_CARD_FRONT" && !isAadhaarBackUploaded()) ||
                        (option.value === "AADHAAR_CARD_BACK" && !isAadhaarFrontUploaded())
                      )
                    }
                  >
                    {isDocumentUploaded(option.value) &&
                    !(
                      (option.value === "AADHAAR_CARD_FRONT" && !isAadhaarBackUploaded()) ||
                      (option.value === "AADHAAR_CARD_BACK" && !isAadhaarFrontUploaded())
                    )
                      ? `${option.label} (Uploaded)`
                      : option.label}
                  </option>
                ))}
              </select>{" "}
              &emsp;
              {selectedAddressProof &&
                !(isDocumentUploaded(selectedAddressProof) &&
                  !(
                    (selectedAddressProof === "AADHAAR_CARD_FRONT" && !isAadhaarBackUploaded()) ||
                    (selectedAddressProof === "AADHAAR_CARD_BACK" && !isAadhaarFrontUploaded())
                  )) && (
                  <div className="mt-2">
                    <div className="flex flex-col">
                      <div className="flex justify-center gap-4">
                        <button
                          className="text-green-500"
                          onClick={() =>
                            triggerFileInput(
                              "address",
                              selectedAddressProof,
                              ""
                            )
                          }
                          title="Upload from device"
                        >
                          <Upload size={18} />
                        </button>
                        <button
                          className="text-green-500"
                          onClick={() =>
                            startCamera("address", selectedAddressProof)
                          }
                          title="Take photo"
                        >
                          <Camera size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
 
          {/* Signature Proof Section */}
          <div className="document-section">
            <div className="flex items-center relative">
              <span className="absolute top-0 text-xs mx-2 bg-white px-1  dark:bg-gray-900 dark:text-white">
                Signature
              </span>
              <select
                className="flex-1 p-2 border rounded mt-2 dark:bg-gray-900 dark:text-white"
                value={selectedSignatureProof}
                onChange={(e) => setSelectedSignatureProof(e.target.value)}
              >
                <option value="">Select Signature Proof</option>
                <option
                  value={signatureProofOption.value}
                  disabled={isDocumentUploaded(signatureProofOption.value)}
                >
                  {isDocumentUploaded(signatureProofOption.value)
                    ? `${signatureProofOption.label} (Uploaded)`
                    : signatureProofOption.label}
                </option>
              </select>
              &emsp;
              {selectedSignatureProof &&
                !isDocumentUploaded(selectedSignatureProof) && (
                  <div className="mt-2 flex flex-col">
                    <div className="flex justify-center gap-4">
                      <button
                        className="text-green-500"
                        onClick={() =>
                          triggerFileInput(
                            "signature",
                            selectedSignatureProof,
                            ""
                          )
                        }
                        title="Upload from device"
                      >
                        <Upload size={18} />
                      </button>
                      <button
                        className="text-green-500"
                        onClick={() =>
                          startCamera("signature", selectedSignatureProof)
                        }
                        title="Take photo"
                      >
                        <Camera size={18} />
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
 
        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg, image/png"
          style={{ display: "none" }}
        />
 
        <div className="preview-section my-1">
          <div className="text-center p-1 rounded">
            {previewImage ? (
              <>
                {" "}
                <small> </small>
                <img
                  src={previewImage}
                  alt="Document preview"
                  className="h-[200px] w-auto mx-auto border-2 rounded-lg"
                />
              </>
            ) : (
              <>
                <img
                  src={workingman}
                  alt="logo"
                  className="h-[200px] w-auto mx-auto "
                />
              </>
            )}
          </div>
        </div>
      </div>
 
      <div className="documents-table mt-8">
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Document Type</th>
                <th className="border p-2 text-left">Image</th>
                <th className="border p-2 text-left">Signature</th>
                <th className="border p-2 text-left">Photo</th>
                <th className="border p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {document.length > 0 ? (
                document.map((doc) => (
                  <tr key={doc.id} className="border">
                    <td className="border p-2">{doc.name}</td>
                    {/* Document Image */}
                    <td className="border p-2">
                      {doc.image && (
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="thumbnail w-auto h-15 cursor-zoom-in"
                          onMouseEnter={(e) => {
                            const rect = e.target.getBoundingClientRect();
                            setHoveredImage(doc.image);
                            setHoverPosition({
                              x: rect.right + 10,
                              y: rect.top - 170,
                            });
                          }}
                          onMouseLeave={() => setHoveredImage(null)}
                        />
                      )}
                    </td>
 
                    {/* Signature Image */}
                    <td className="border p-2">
                      {doc.signatures && doc.signatures.length > 0 ? (
                        <img
                          src={`data:image/jpeg;base64,${doc.signatures[0].image}`}
                          alt="Signature"
                          className="w-auto h-100 rounded-md object-contain shadow-sm cursor-zoom-in"
                          onMouseEnter={(e) => {
                            const rect = e.target.getBoundingClientRect();
                            setHoveredImage(
                              `data:image/jpeg;base64,${doc.signatures[0].image}`
                            );
                            setHoverPosition({
                              x: rect.right + 10,
                              y: rect.top - 170,
                            });
                          }}
                          onMouseLeave={() => setHoveredImage(null)}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
 
                    {/* Photograph Image */}
                    <td className="border p-2">
                      {doc.photographs && doc.photographs.length > 0 ? (
                        <img
                          src={`data:image/jpeg;base64,${doc.photographs[0].image}`}
                          alt="Photograph"
                          className="w-auto h-[50px] rounded-md object-contain shadow-sm cursor-zoom-in"
                          onMouseEnter={(e) => {
                            const rect = e.target.getBoundingClientRect();
                            setHoveredImage(
                              `data:image/jpeg;base64,${doc.photographs[0].image}`
                            );
                            setHoverPosition({
                              x: rect.right + 10,
                              y: rect.top - 170,
                            });
                          }}
                          onMouseLeave={() => setHoveredImage(null)}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
 
                    <td className="border p-2">
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors duration-200"
                        title="Remove Document"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border">
                  <td
                    colSpan="5"
                    className="border p-2 text-center text-gray-500"
                  >
                    No documents uploaded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {hoveredImage && (
            <div
              className="fixed z-50 bg-white border rounded shadow-lg p-2 transition-opacity duration-200"
              style={{
                top: `${hoverPosition.y}px`,
                left: `${hoverPosition.x}px`,
              }}
            >
              <img
                src={hoveredImage}
                alt="Zoomed Preview"
                className="h-[200px] w-auto rounded"
              />
            </div>
          )}
        </div>
      </div>
 
      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">Take Photo</h3>
              <button
                onClick={stopCamera}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200"
                aria-label="Close camera"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-6 aspect-video overflow-hidden rounded-lg bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-center">
              <button
                onClick={capturePhoto}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <Camera size={20} /> Capture
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-600 text-center">
              Position the document clearly in the frame and click Capture
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default DocumentUpload;
  