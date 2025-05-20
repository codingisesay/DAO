import { useState, useRef } from 'react';

const DocumentUpload = () => {
    const [selectedDocument, setSelectedDocument] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [documents, setDocuments] = useState([]);
    const fileInputRef = useRef(null);

    const documentTypes = [
        { id: 'pan', label: 'PAN Card' },
        { id: 'aadhar', label: 'Aadhar Card' },
        { id: 'signature', label: 'Signature' }
    ];

    const handleDocumentSelect = (docType) => {
        setSelectedDocument(docType);
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must not exceed 5MB');
            return;
        }

        // Check file type (jpg/png)
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            alert('Only JPG/PNG files are allowed');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewImage(reader.result);

            // Add to documents table
            const newDocument = {
                id: Date.now(),
                type: `${selectedDocument.toUpperCase()}_JPG`,
                name: `${selectedDocument} document`,
                image: reader.result,
                uploadedAt: new Date().toLocaleString()
            };

            setDocuments([...documents, newDocument]);
        };
        reader.readAsDataURL(file);
    };

    const removeDocument = (id) => {
        setDocuments(documents.filter(doc => doc.id !== id));
        if (documents.length === 1) {
            setPreviewImage(null);
        }
    };

    return (
        <div className="document-upload-container">
            <h1>Upload Documents</h1>

            <div className="instructions">
                <p>1. All documents must be scanned copy in jpg/png format - size must not exceed 5mb</p>
            </div>

            <div className="upload-section">
                <div className="document-selection">
                    <h2>1. Identity Proof</h2>
                    <div className="document-options">
                        {documentTypes.map((doc) => (
                            <button
                                key={doc.id}
                                className={`document-btn ${selectedDocument === doc.id ? 'active' : ''}`}
                                onClick={() => handleDocumentSelect(doc.id)}
                            >
                                {doc.label}
                            </button>
                        ))}
                    </div>

                    {selectedDocument && (
                        <div className="file-upload">
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/jpeg, image/png"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="upload-btn">
                                Choose File
                            </label>
                            <span className="file-requirements">(JPG/PNG, max 5MB)</span>
                        </div>
                    )}
                </div>

                <div className="preview-section">
                    {previewImage ? (
                        <div className="image-preview">
                            <img src={previewImage} alt="Document preview" />
                            <p>{selectedDocument.toUpperCase()} Document</p>
                        </div>
                    ) : (
                        <div className="preview-placeholder">
                            <p>Preview will appear here</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="documents-table">
                <h2>Document File</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Document Type</th>
                            <th>Image</th>
                            <th>Signature</th>
                            <th>Face</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.length > 0 ? (
                            documents.map((doc) => (
                                <tr key={doc.id}>
                                    <td>{doc.type}</td>
                                    <td>
                                        {doc.image && (
                                            <img
                                                src={doc.image}
                                                alt={doc.name}
                                                className="thumbnail"
                                            />
                                        )}
                                    </td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td>
                                        <button
                                            onClick={() => removeDocument(doc.id)}
                                            className="remove-btn"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-documents">
                                    No documents uploaded yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocumentUpload;