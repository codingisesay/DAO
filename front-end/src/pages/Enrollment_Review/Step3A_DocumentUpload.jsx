import React, { useState, useEffect } from 'react';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { pendingAccountData, pendingAccountStatusUpdate } from '../../services/apiServices';
import { daodocbase } from '../../data/data';
import axios from 'axios';

function p3({ onNext, onBack }) {
    const [localFormData, setLocalFormData] = useState([]);
    const [extractedData, setExtractedData] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const { id } = useParams();
    const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];
    const API_URL = 'https://dao.payvance.co.in:8091/ext/api/detect';
    const bearerToken = localStorage.getItem('accessToken');

    const admin_id= localStorage.getItem('userCode');
    const handleRejectClick = async () => {
        const result = await Swal.fire({
            title: 'Reason for Rejection',
            input: 'text',
            inputLabel: 'Please provide a reason',
            inputPlaceholder: 'Enter reason here...',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            className: 'btn-login',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write a reason!';
                }
            },
        });

        if (result.isConfirmed && result.value) {
            const payload = {
                application_id: Number(id),
                status: 'Rejected',
                status_comment: result.value,
                admin_id: admin_id
            };
            await pendingAccountStatusUpdate.updateS3(id, payload);
            applicationStatus.push('Reject');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            console.log('Payload:', payload);
            onNext(); // pass the payload forward
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    };

    const handleReviewClick = async () => {
        const result = await Swal.fire({
            title: 'Reason for Review',
            input: 'text',
            inputLabel: 'Please provide a reason',
            inputPlaceholder: 'Enter reason here...',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            className: 'btn-login',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write a reason!';
                }
            },
        });

        if (result.isConfirmed && result.value) {
            const payload = {
                application_id: Number(id),
                status: 'Review',
                status_comment: result.value,
                admin_id: admin_id
            };
            await pendingAccountStatusUpdate.updateS3(id, payload);
            applicationStatus.push('Review');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            console.log('Payload:', payload);
            onNext(); // pass the payload forward
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    };

    const handleNextStep = () => {
        try {
            const payload = {
                applicaiton_id: Number(id),
                status: 'Approved',
                status_comment: '',
                admin_id:admin_id
            }
            const response = pendingAccountStatusUpdate.updateS3(id, payload);
            applicationStatus.push('Approved');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            Swal.fire({
                icon: 'success',
                title: 'Enrollment Details Approved Successfully',
                timer: 2000,               // alert stays for 2 seconds
                showConfirmButton: false,  // no "OK" button
                allowOutsideClick: false,  // optional: prevent closing by clicking outside
                allowEscapeKey: false,     // optional: prevent closing with Escape key
                didOpen: () => {
                    Swal.showLoading();   // optional: show loading spinner
                },
                willClose: () => {
                    onNext(); // proceed after alert closes
                }
            });
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong while updating the status!',
            });
        }
    }

    useEffect(() => {
        const fetchAndProcessDocuments = async () => {
            try {
                if (id) {
                    setIsProcessing(true);
                    const response = await pendingAccountData.getDetailsS3(id);
                    const documents = response.documents || [];
                    setLocalFormData(documents);
                    
                    // Process each document sequentially
                    for (const doc of documents) {
                        await processDocument(doc);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to process documents. Please try again.',
                });
            } finally {
                setIsProcessing(false);
            }
        };

        const processDocument = async (doc) => {
            try {
                const fileUrl = daodocbase + doc.file_path;
                const response = await fetch(fileUrl);
                const fileBlob = await response.blob();
                
                const formData = new FormData();
                formData.append('image', fileBlob, doc.file_name || 'document.jpg');

                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${bearerToken}`
                    },
                    timeout: 30000
                };

                const apiResponse = await axios.post(API_URL, formData, config);
                
                // Get only the first signature if multiple exist
                const firstSignature = apiResponse.data.detections
                    ?.filter(d => d.class_id === 2)
                    .slice(0, 1)
                    .map(d => ({ ...d, image: d.crop })) || [];
                
                // Get only the first photograph if multiple exist
                const firstPhotograph = apiResponse.data.detections
                    ?.filter(d => d.class_id === 1)
                    .slice(0, 1)
                    .map(d => ({ ...d, image: d.crop })) || [];

                setExtractedData(prev => ({
                    ...prev,
                    [doc.id]: {
                        signatures: firstSignature,
                        photographs: firstPhotograph,
                        status: firstSignature.length > 0 || firstPhotograph.length > 0 ? 'verified' : 'failed'
                    }
                }));

            } catch (error) {
                console.error('Error processing document:', error);
                setExtractedData(prev => ({
                    ...prev,
                    [doc.id]: {
                        ...prev[doc.id],
                        status: 'failed'
                    }
                }));
            }
        };

        fetchAndProcessDocuments();
    }, [id]);

    return (
        <div className="form-container"> 
            {isProcessing && (
                <div className="mb-4 p-2 bg-blue-100 text-blue-800 rounded">
                    Processing documents... Please wait.
                </div>
            )}
            
            <DocumentDetailsTable 
                documentslist={localFormData} 
                extractedData={extractedData} 
            />

            <div className="next-back-btns">
                <CommonButton
                    className="text-red-500 border border-red-500 hover:bg-red-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
                    onClick={handleRejectClick}
                >
                    Reject & Continue
                </CommonButton>

                <CommonButton
                    className="text-amber-500 border border-amber-500 hover:bg-amber-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
                    onClick={handleReviewClick}
                >
                    Review & Continue
                </CommonButton>

                <CommonButton
                    className="btn-next"
                    onClick={handleNextStep}
                >
                    Accept & Continue
                </CommonButton>
            </div>
        </div>
    );
}

const DocumentDetailsTable = ({ documentslist, extractedData }) => {
    const [hoveredImage, setHoveredImage] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

    if (!documentslist || !Array.isArray(documentslist)) {
        return <p>No documents found.</p>;
    }

    const groupedDocs = documentslist.reduce((acc, doc) => {
        const type = doc.document_type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(doc);
        return acc;
    }, {});

    function toTitleCase(str) {
        return str
            .replace(/_?JPG$/i, '')
            .replace(/_JPG/i, '')
            .replace(/JPG$/i, '')
            .toLowerCase()
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .trim();
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString.replace(' ', 'T'));
        if (isNaN(date)) return dateString;
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'verified':
                return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Verified</span>;
            case 'failed':
                return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Failed</span>;
            default:
                return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Pending</span>;
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="mb-8">
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-200 text-left">File Name</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-left">Image</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-left">Photo</th>
                                <th className="py-2 px-4 border-b border-gray-200 text-left">Signature</th> 
                                <th className="py-2 px-4 border-b border-gray-200 text-left">Created At</th>
                            </tr>
                        </thead>
                        {Object.entries(groupedDocs).map(([type, docs]) => (
                        <tbody key={type}>
                            {docs.map((doc) => {
                                const extraction = extractedData[doc.id] || {};
                                const hasSignatures = extraction.signatures?.length > 0;
                                const hasPhotos = extraction.photographs?.length > 0;
                                
                                return (
                                    <tr key={doc.id}>
                                        <td className="py-2 px-4 border-b border-gray-200">{toTitleCase(doc.document_type)}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <img
                                                src={daodocbase + `${doc.file_path}`}
                                                alt="document"
                                                className="h-auto w-20 object-contain border rounded"
                                                onMouseEnter={(e) => {
                                                    const rect = e.target.getBoundingClientRect();
                                                    setHoveredImage(daodocbase + doc.file_path);
                                                    setHoverPosition({
                                                        x: rect.right + 10,
                                                        y: rect.top - 170,
                                                    });
                                                }}
                                                onMouseLeave={() => setHoveredImage(null)}
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            {hasPhotos ? (
                                                <img 
                                                    src={`data:image/jpeg;base64,${extraction.photographs[0].image}`}
                                                    alt="Extracted photo"
                                                    className="h-10 w-auto border rounded"
                                                />
                                            ) : (
                                                <span className="text-gray-400">Not detected</span>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            {hasSignatures ? (
                                                <img 
                                                    src={`data:image/jpeg;base64,${extraction.signatures[0].image}`}
                                                    alt="Extracted signature"
                                                    className="h-10 w-auto border rounded"
                                                />
                                            ) : (
                                                <span className="text-gray-400">Not detected</span>
                                            )}
                                        </td> 
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            {formatDate(doc.created_at)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        ))}
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
//                     // localStorage.setItem('applicationDetails', JSON.stringify(response));
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


 