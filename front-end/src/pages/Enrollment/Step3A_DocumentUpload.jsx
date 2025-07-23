import React, { useState, useEffect } from 'react';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { pendingAccountData, pendingAccountStatusUpdate } from '../../services/apiServices'; // <-- Import your service
// import { daodocbase } from '../../data/data'; // No longer needed for base64 files

// Placeholder base64 data for demonstration. In a real app, doc.file_path would contain this.
// For a PNG image:
const PLACEHOLDER_IMAGE_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
// For a very simple PDF (a blank one, for example, or a small text PDF converted to base64)
// This is a minimal valid PDF base64 string for demonstration purposes.
const PLACEHOLDER_PDF_BASE64 = "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOzAwoxIDAgb2JqPDwvUGFnZXMgMiAwIFIvVHlwZS9DYXRhbG9nPj4KMiAwIG9iajw8L0NvdW50IDEvS2lkc1sgMyAwIFJdL1R5cGUvUGFnZXM+PgoyIDAgb2JqPDwvQ291bnQgMS9LaWRzWyAzIDAgUl0vVHlwZS9QYWdlcz4+CjMgMCBvYmo8PC9NZWRpYUJveFswIDAgNjEyIDc5Ml0vUGFyZW50IDIgMCBSL1Jlc291cmNlczw8L0ZvbnQ8PC9GMTEgNSAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9UeXBlL1BhZ2U+PgoxIDAgb2JqPDwvUGFnZXMgMiAwIFIvVHlwZS9DYXRhbG9nPj4KMiAwIG9iajw8L0NvdW50IDEvS2lkc1sgMyAwIFJdL1R5cGUvUGFnZXM+PgoyIDAgb2JqPDwvQ291bnQgMS9LaWRzWyAzIDAgUl0vVHlwZS9QYWdlcz4+CjMgMCBvYmo8PC9NZWRpYUJveFswIDAgNjEyIDc5Ml0vUGFyZW50IDIgMCBSL1Jlc291cmNlczw8L0ZvbnQ8PC9GMTEgNSAwIFI+Pi9Qcm9jU2V0Wy9QREYvVGV4dF0+Pi9UeXBlL1BhZ2U+PjQgMCBvYmo8PC9CYXNlRm9udC9IZWx2ZXRpY2EvRW5jb2RpbmcvV2luQW5zaVJlYm9sYXRpbmcvTmFtZS9GMTEvSub2Rlb2R5cGUvRm9udC9UeXBlL0ZvbnQxPj4KNSAwIG9iajw8L0Jhc2VGb250L0hlbHZldGljYS9FbmNvZGluZy9XaW5BbnNpUmVib2xhdGluZy9OYW1lL0YxMS9TdWJ0eXBlL1R5cGUvRm9udDE+PjYgMCBvYmo8PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDQ3Pj4gc3RyZWFtCjcgMCBvYmo8PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDQ3Pj4gc3RyZWFtCjggMCBvYmo8PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDQ3Pj4gc3RyZWFtCjkgMCBvYmo8PC9GaWx0ZXIvRmxhdGVEZWNvZGUvTGVuZ3RoIDQ3Pj4gc3RyZWFtCjEwIDAgb2JqPDwvRmlsdGVyL0ZsYXRlRGVjb2RlL0xlbmd0aCA0Nz4+IHN0cmVhbQoxMSAwIG9iajw8L0ZpbHRlci9GbGF0ZURlY29kZS9MZW5ndGggNDc+PiBzdHJlYW0KeGhyZWYKMCAxMgp0cmFpbGVyPDwvUm9vdCAxIDAgUi9TaXplIDEyPj4Kc3RhcnR4cmVmCjY4MAolJUVPRgo=";


function p3({ onNext, onBack }) {
    const [localFormData, setLocalFormData] = useState();
    const id = localStorage.getItem('application_id');
    const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];

    useEffect(() => {
        const fetchAndStoreDetails = async () => {
            try {
                if (id) {
                    const response = await pendingAccountData.getDetailsS3(id);
                    localStorage.setItem('applicationDetails', JSON.stringify(response));
                    console.log('documents :', response);
                    // Ensure response.documents is an array
                    const applicationDocuments = response.documents || [];
                    setLocalFormData(applicationDocuments);
                }
            } catch (error) {
                console.error('Failed to fetch application details:', error);
            }
        };

        fetchAndStoreDetails();
    }, [id]);

    return (
        <div className="form-container">
            <h2 className="text-xl font-bold mb-2">Upload Documents</h2>
            <DocumentDetailsTable documentslist={localFormData} />
        </div>
    );
}

const DocumentDetailsTable = ({ documentslist }) => {
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [currentPdfUrl, setCurrentPdfUrl] = useState('');
    const [currentPdfTitle, setCurrentPdfTitle] = useState('');

    if (!documentslist || !Array.isArray(documentslist) || documentslist.length === 0) {
        return <p>No documents found.</p>;
    }

    // Grouping documents by `document_type`
    const groupedDocs = documentslist.reduce((acc, doc) => {
        const type = doc.document_type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(doc);
        return acc;
    }, {});

    const openPdfModal = (pdfBase64, title) => {
        setCurrentPdfUrl(`data:application/pdf;base64,${pdfBase64}`);
        setCurrentPdfTitle(title);
        setShowPdfModal(true);
    };

    const closePdfModal = () => {
        setShowPdfModal(false);
        setCurrentPdfUrl('');
        setCurrentPdfTitle('');
    };

    return (
        <div className="p-2 mx-auto">
            <div className="mb-2">
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 text-left">File Name</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-left">Preview</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-left">Created At</th>
                            </tr>
                        </thead>
                        {Object.entries(groupedDocs).map(([type, docs]) => (
                            <tbody key={type}>
                                {docs.map((doc) => {
                                    const fileExtension = doc.file_name.split('.').pop().toLowerCase();
                                    const isImage = ['png', 'jpg', 'jpeg'].includes(fileExtension);
                                    const isPdf = fileExtension === 'pdf';

                                    // Assuming doc.file_path contains the actual base64 string
                                    // If doc.file_path is literally "base64", you'll need to replace it with actual data
                                    const fileData = doc.file_path === "base64"
                                        ? (isImage ? PLACEHOLDER_IMAGE_BASE64 : PLACEHOLDER_PDF_BASE64) // Use placeholders for demo
                                        : `data:${isImage ? `image/${fileExtension}` : 'application/pdf'};base64,${doc.file_path}`; // Construct actual data URL

                                    return (
                                        <tr key={doc.id}>
                                            <td className="py-2 px-4 border-b border-gray-200">{doc.file_name}</td>
                                            <td className="py-2 px-4 border-b border-gray-200">
                                                {isImage ? (
                                                    <img
                                                        src={fileData}
                                                        alt="document"
                                                        className="h-auto w-20 object-contain border rounded"
                                                    />
                                                ) : isPdf ? (
                                                    <button
                                                        onClick={() => openPdfModal(doc.file_path === "base64" ? PLACEHOLDER_PDF_BASE64.split(',')[1] : doc.file_path, doc.file_name)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="View PDF"
                                                    >
                                                        <i className="bi bi-file-pdf text-2xl"></i>
                                                    </button>
                                                ) : (
                                                    <span>Unsupported File Type</span>
                                                )}
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-200">
                                                {(() => {
                                                    const date = new Date(doc.created_at);
                                                    const day = String(date.getDate()).padStart(2, '0');
                                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                                    const year = date.getFullYear();
                                                    return `${day}-${month}-${year}`;
                                                })()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        ))}
                    </table>
                </div>
            </div>

            {/* PDF Modal */}
            {showPdfModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h3 className="text-lg font-bold">{currentPdfTitle}</h3>
                            <button
                                onClick={closePdfModal}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
                            >
                               X
                            </button>
                        </div>
                        <div className="flex-grow p-4">
                            <iframe
                                src={currentPdfUrl}
                                title={currentPdfTitle}
                                className="w-full h-full border-none rounded"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default p3;



// import React, { useState, useEffect } from 'react';
// import CommonButton from '../../components/CommonButton';
// import Swal from 'sweetalert2';
// import { useParams } from 'react-router-dom';
// import { pendingAccountData, pendingAccountStatusUpdate } from '../../services/apiServices'; // <-- Import your service
// import { daodocbase } from '../../data/data';


// function p3({ onNext, onBack }) {
//     const [localFormData, setLocalFormData] = useState();
//     const  id = localStorage.getItem('application_id');
//     const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];

//     useEffect(() => {
//         const fetchAndStoreDetails = async () => {
//             try {
//                 // alert('called')
//                 if (id) {
//                     const response = await pendingAccountData.getDetailsS3(id);
//                     localStorage.setItem('applicationDetails', JSON.stringify(response));
//                     console.log('documants :', response);
//                     const application = response.documents || {};
//                     setLocalFormData(application);
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch application details:', error);
//             }
//         };

//         fetchAndStoreDetails();
//     }, [id]);

 

//     return (
//         <div className="form-container">
//             <h2 className="text-xl font-bold mb-2">Upload Documents</h2>
//             <DocumentDetailsTable documentslist={localFormData} />
 
//         </div>
//     );
// }



// const DocumentDetailsTable = ({ documentslist }) => {
//     if (!documentslist || !Array.isArray(documentslist)) {
//         return <p>No documents found.</p>;
//     }

//     // Grouping documents by `document_type`
//     const groupedDocs = documentslist.reduce((acc, doc) => {
//         const type = doc.document_type;
//         if (!acc[type]) {
//             acc[type] = [];
//         }
//         acc[type].push(doc);
//         return acc;
//     }, {});

//     return (
//         <div className="p-2 mx-auto">
//             {/* {Object.entries(groupedDocs).map(([type, docs]) => ( */}
//                 <div className="mb-2">
//                     {/* <h2 className="text-xl font-bold mb-4 capitalize">Saved Document</h2> */}
//                     {/* <span className="text-xs text-gray-500 ms-auto">Priviously submitted docsuments</span> */}
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full border border-gray-200">
//                             <thead className="bg-gray-100">
//                                 <tr>
//                                     {/* <th className="py-2 px-4 border-b border-gray-200 text-left">ID</th> */}
//                                     <th className="py-2 px-4 border-b border-gray-200 text-left">File Name</th>
//                                     <th className="py-2 px-4 border-b border-gray-200 text-left">Preview</th>
//                                     <th className="py-2 px-4 border-b border-gray-200 text-left">Created At</th>
//                                 </tr>
//                             </thead>
//                               {Object.entries(groupedDocs).map(([type, docs]) => (
//                             <tbody key={type}>
//                                 {docs.map((doc) => (
//                                     <tr key={doc.id}>
//                                         {/* <td className="py-2 px-4 border-b border-gray-200">{doc.id}</td> */}
//                                         <td className="py-2 px-4 border-b border-gray-200">{doc.file_name}</td>
//                                         <td className="py-2 px-4 border-b border-gray-200">
//                                             {/* <a href={daodocbase+`${doc.file_path}`} target="_blank" rel="noopener noreferrer"> */}
//                                             <img
//                                                 src= {daodocbase+`${doc.file_path}`}
//                                                 alt="document"
//                                                 className="h-auto w-20 object-contain border rounded"
//                                                 />
//                                             {/* </a> */}
//                                         </td>
//                                         <td className="py-2 px-4 border-b border-gray-200">
//                                         {(() => {
//                                             const date = new Date(doc.created_at);
//                                             const day = String(date.getDate()).padStart(2, '0');
//                                             const month = String(date.getMonth() + 1).padStart(2, '0');
//                                             const year = date.getFullYear();
//                                             return `${day}-${month}-${year}`;
//                                         })()}
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                               ))}
//                         </table>
//                     </div>
//                 </div>
//             {/* // ))} */}
//         </div>
//     );
// };


// export default p3;


 