import React from 'react';
import CommonButton from '../../components/CommonButton';
function p3({ onNext, onBack }) {
    return (
        <div className="form-container">
            <h2 className="text-xl font-bold mb-2">Upload Documents</h2>
            <DocumentDetailsTable />
            <div className="next-back-btns">
                <CommonButton className="btn-back" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>

                <CommonButton className="btn-next" onClick={onNext}>
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div>
        </div>
    );
}

const DocumentDetailsTable = () => {
    // Sample data - replace with your actual data
    const documents = [
        {
            title: "PAN Card Details",
            data: {
                documentFile: "Pan Card.jpg",
                documentType: "Pan Card",
                image: "image",
                signature: "image",
                face: "image"
            }
        },
        {
            title: "Aadhaar Card Details",
            data: {
                documentFile: "Aadhaar Card.jpg",
                documentType: "Aadhaar Card",
                image: "image",
                signature: "image",
                face: "image"
            }
        },
        {
            title: "Signature Details",
            data: {
                documentFile: "Signature.jpg",
                documentType: "Signature",
                image: "image",
                signature: "image",
                face: "image"
            }
        }
    ];

    return (
        <div className="p-4 max-w-4xl mx-auto">
            {documents.map((doc, index) => (
                <div key={index} className="mb-8">
                    <h2 className="text-xl font-bold mb-4">{doc.title}</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Document File</th>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Document Type</th>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Image</th>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Signature</th>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Face</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-2 px-4 border-b border-gray-200">{doc.data.documentFile}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">{doc.data.documentType}</td>
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        {doc.data.image === "image" ? (
                                            <span className="text-gray-500">image</span>
                                        ) : (
                                            <img src={doc.data.image} alt="Document" className="h-12 object-contain" />
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        {doc.data.signature === "image" ? (
                                            <span className="text-gray-500">image</span>
                                        ) : (
                                            <img src={doc.data.signature} alt="Signature" className="h-12 object-contain" />
                                        )}
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-200">
                                        {doc.data.face === "image" ? (
                                            <span className="text-gray-500">image</span>
                                        ) : (
                                            <img src={doc.data.face} alt="Face" className="h-12 object-contain" />
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default p3;