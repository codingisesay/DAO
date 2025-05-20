import React from 'react';
import CommonButton from '../../components/CommonButton';
import { useDocuments } from './DocumentContext';

const documentTypes = [
    { id: 1, name: 'Pan Card', proofType: 'identity' },
    { id: 2, name: 'Aadhaar Card', proofType: 'address' },
    { id: 3, name: 'Passport', proofType: 'identity' },
    { id: 4, name: 'Driving License', proofType: 'address' },
    { id: 5, name: 'Voter ID', proofType: 'identity' }
];

const DocumentUpload = () => {
    const { documents, setDocuments } = useDocuments();

    const handleAddRow = () => {
        if (documents.length >= documentTypes.length) return;
        setDocuments([...documents, { id: Date.now(), documentType: "", file: null, preview: null }]);
    };

    const handleDocumentTypeChange = (id, value) => {
        setDocuments(docs =>
            docs.map(doc =>
                doc.id === id ? { ...doc, documentType: value, file: null, preview: null } : doc
            )
        );
    };

    const handleFileUpload = (id, file) => {
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setDocuments(docs =>
                docs.map(doc =>
                    doc.id === id
                        ? { ...doc, file: file.name, preview: e.target.result }
                        : doc
                )
            );
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveRow = (id) => {
        if (documents.length <= 1) return;
        setDocuments(docs => docs.filter(doc => doc.id !== id));
    };

    const getAvailableDocumentTypes = (currentDocId, currentDocType) => {
        const selectedTypes = documents
            .filter(doc => doc.id !== currentDocId)
            .map(doc => doc.documentType);

        return documentTypes.filter(type =>
            !selectedTypes.includes(type.name) || type.name === currentDocType
        );
    };

    return (
        <div className="dashboard-container">
            <div className="mb-4">
                <small className="text-gray-600">
                    <i className="bi bi-info-circle"></i> &nbsp;
                    <span>All documents must be scanned copy in jpg/png format (max 5MB)</span>
                </small>
                <div className="text-end my-3">
                    <CommonButton
                        className="btn-login"
                        onClick={handleAddRow}
                        disabled={documents.length >= documentTypes.length}
                    >
                        + Add Document
                    </CommonButton>
                </div>
            </div>

            <div className="documents-table">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 text-left">Document Type</th>
                            <th className="p-2 text-left">File</th>
                            <th className="p-2 text-left">Preview</th>
                            <th className="p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.map((doc) => (
                            <tr key={doc.id} className="border-b">
                                <td className="p-2">
                                    <select
                                        value={doc.documentType}
                                        onChange={(e) => handleDocumentTypeChange(doc.id, e.target.value)}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">Select Document</option>
                                        {getAvailableDocumentTypes(doc.id, doc.documentType).map((type) => (
                                            <option key={type.id} value={type.name}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-2">
                                    {doc.documentType ? (
                                        <label className="cursor-pointer">
                                            {doc.file || "Choose File"}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(doc.id, e.target.files[0])}
                                                className="hidden"
                                            />
                                        </label>
                                    ) : (
                                        "Select document type first"
                                    )}
                                </td>
                                <td className="p-2">
                                    {doc.preview ? (
                                        <img
                                            src={doc.preview}
                                            alt="Document preview"
                                            className="h-16 object-contain"
                                        />
                                    ) : (
                                        "No preview"
                                    )}
                                </td>
                                <td className="p-2">
                                    {documents.length > 1 && (
                                        <button
                                            onClick={() => handleRemoveRow(doc.id)}
                                            className="text-red-500"
                                        >
                                            <i className="bi bi-trash-fill"></i>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DocumentUpload;