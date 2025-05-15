import { useState, useRef } from "react";
import Webcam from "react-webcam";
import CommonButton from "../../components/CommonButton";

const documentApload = () => {
    const documentTypes = [
        { id: 1, name: 'Pan Card', proofType: 'identity' },
        { id: 2, name: 'Aadhaar Card', proofType: 'address' },
        { id: 3, name: 'Signature', proofType: 'signature' },
        { id: 4, name: 'Passport', proofType: 'identity' },
        { id: 5, name: 'Driving License', proofType: 'address' },
        { id: 6, name: 'Voter ID', proofType: 'identity' }
    ];

    const [documents, setDocuments] = useState([
        {
            id: Date.now(),
            documentType: "", // Initialize as empty string
            file: null,
            image: null,
            signature: null,
            face: null,
            extracted: false
        }
    ]);

    const [modalImage, setModalImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const fileInputRefs = useRef({});

    const handleAddRow = () => {
        if (documents.length >= documentTypes.length) return;

        setDocuments([...documents, {
            id: Date.now(),
            documentType: "",
            file: null,
            image: null,
            signature: null,
            face: null,
            extracted: false
        }]);
    };

    const handleDocumentTypeChange = (id, value) => {
        setDocuments(docs =>
            docs.map(doc =>
                doc.id === id ? {
                    ...doc,
                    documentType: value,
                    // Reset file-related fields when changing document type
                    file: null,
                    image: null,
                    signature: null,
                    face: null,
                    extracted: false
                } : doc
            )
        );
    };

    const getAvailableDocumentTypes = (currentDocId, currentDocType) => {
        const selectedTypes = documents
            .filter(doc => doc.id !== currentDocId) // Exclude current row
            .map(doc => doc.documentType);

        return documentTypes.filter(type =>
            !selectedTypes.includes(type.name) || type.name === currentDocType
        );
    };
    // -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    const handleFileUpload = (id, file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setDocuments((docs) =>
                docs.map((doc) =>
                    doc.id === id
                        ? { ...doc, file: file.name, image: e.target.result }
                        : doc
                )
            );

            // Auto-extract if PAN or Aadhaar
            const doc = documents.find((d) => d.id === id);
            if (doc?.documentType === "Pan Card") {
                extractPanElements(e.target.result, id);
            } else if (doc?.documentType === "Aadhaar Card") {
                extractAadhaarPhoto(e.target.result, id);
            }
        };
        reader.readAsDataURL(file);
    };

    const extractPanElements = (imageSrc, id) => {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);

            // Extract photo
            const photoWidth = img.width * 0.25;
            const photoHeight = img.height * 0.35;
            const photoX = img.width - photoWidth - 15;
            const photoY = img.height - photoHeight - 10;

            const photoCanvas = document.createElement("canvas");
            photoCanvas.width = photoWidth;
            photoCanvas.height = photoHeight;
            photoCanvas
                .getContext("2d")
                .drawImage(
                    canvas,
                    photoX,
                    photoY,
                    photoWidth,
                    photoHeight,
                    0,
                    0,
                    photoWidth,
                    photoHeight
                );

            // Extract signature
            const sigWidth = img.width * 0.4;
            const sigHeight = img.height * 0.15;
            const sigX = 10;
            const sigY = img.height - sigHeight - 17;

            const sigCanvas = document.createElement("canvas");
            sigCanvas.width = sigWidth;
            sigCanvas.height = sigHeight;
            sigCanvas
                .getContext("2d")
                .drawImage(
                    canvas,
                    sigX,
                    sigY,
                    sigWidth,
                    sigHeight,
                    0,
                    0,
                    sigWidth,
                    sigHeight
                );

            setDocuments((docs) =>
                docs.map((doc) =>
                    doc.id === id
                        ? {
                            ...doc,
                            face: photoCanvas.toDataURL(),
                            signature: sigCanvas.toDataURL(),
                            extracted: true,
                        }
                        : doc
                )
            );
        };
        img.src = imageSrc;
    };

    const extractAadhaarPhoto = (imageSrc, id) => {
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);

            // Aadhaar photo extraction
            const photoWidth = img.width * 0.2;
            const photoHeight = img.height * 0.45;
            const photoX = img.width * 0.05;
            const photoY = img.height * 0.22;

            const photoCanvas = document.createElement("canvas");
            photoCanvas.width = photoWidth;
            photoCanvas.height = photoHeight;
            photoCanvas
                .getContext("2d")
                .drawImage(
                    canvas,
                    photoX,
                    photoY,
                    photoWidth,
                    photoHeight,
                    0,
                    0,
                    photoWidth,
                    photoHeight
                );

            setDocuments((docs) =>
                docs.map((doc) =>
                    doc.id === id
                        ? {
                            ...doc,
                            face: photoCanvas.toDataURL(),
                            extracted: true,
                        }
                        : doc
                )
            );
        };
        img.src = imageSrc;
    };

    const openImageModal = (imageSrc) => {
        setModalImage(imageSrc);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalImage(null);
    };



    const handleRemoveRow = (id) => {
        if (documents.length <= 1) return;
        setDocuments((docs) => docs.filter((doc) => doc.id !== id));
    };

    return (
        <div className="dashboard-container">

            <div className="">
                <div className=" ">

                    <small className="payvcane-color">
                        <i className="bi bi-info-circle"></i> &nbsp;
                        <span>All documents must be scanned copy in jpg/ png format - size must not exceed 5mb</span>
                    </small>
                    <div className=" text-end my-3"  >
                        <CommonButton
                            className="btn-login self"
                            onClick={handleAddRow}
                            disabled={documents.length >= documentTypes.length}
                        >
                            + Add Document
                        </CommonButton>
                    </div>
                </div>
                <div className="documents-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Document Type</th>
                                <th>File</th>
                                <th>Preview</th>
                                <th>Signature</th>
                                <th>Face</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.id}>

                                    <td>
                                        <select
                                            value={doc.documentType}
                                            onChange={(e) => handleDocumentTypeChange(doc.id, e.target.value)}
                                            className="document-select"
                                        >
                                            <option value="">Select Document</option>
                                            {getAvailableDocumentTypes(doc.id, doc.documentType).map((type) => (
                                                <option key={type.id} value={type.name}>
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    <td>
                                        {doc.documentType ? (
                                            <label className="file-upload-btn">
                                                {doc.file || "Choose File"}
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    onChange={(e) =>
                                                        handleFileUpload(doc.id, e.target.files[0])
                                                    }
                                                    hidden
                                                />
                                            </label>
                                        ) : (
                                            "Select document type first"
                                        )}
                                    </td>
                                    <td>
                                        {doc.image ? (
                                            <img
                                                src={doc.image}
                                                alt="Document"
                                                className="thumbnail clickable"
                                                onClick={() => openImageModal(doc.image)}
                                            />
                                        ) : (
                                            "No preview"
                                        )}
                                    </td>
                                    <td>
                                        {doc.signature ? (
                                            <img
                                                src={doc.signature}
                                                alt="Signature"
                                                className="thumbnail clickable"
                                                onClick={() => openImageModal(doc.signature)}
                                            />
                                        ) : (
                                            "Not extracted"
                                        )}
                                    </td>
                                    <td>
                                        {doc.face ? (
                                            <img
                                                src={doc.face}
                                                alt="Face"
                                                className="thumbnail clickable"
                                                onClick={() => openImageModal(doc.face)}
                                            />
                                        ) : (
                                            "Not extracted"
                                        )}
                                    </td>
                                    <td>
                                        <div className="action-buttons">

                                            {documents.length > 1 && (

                                                <i className="bi bi-trash-fill text-red-500 mx-auto "
                                                    onClick={() => handleRemoveRow(doc.id)}></i>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="modal-close" onClick={closeModal}>
                            ×
                        </span>
                        <img
                            src={modalImage}
                            alt="Enlarged preview"
                            className="modal-image"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default documentApload;
