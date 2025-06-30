import React, { useState, useEffect } from 'react';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { pendingAccountData, pendingAccountStatusUpdate } from '../../services/apiServices';
import { daodocbase } from '../../data/data';
// import DAOExtraction from '../Enrollment/RND_DND_GetSignphoto_abstraction';

function p3({ onNext, onBack }) {
    const [localFormData, setLocalFormData] = useState([]);
    const [currentDocument, setCurrentDocument] = useState(null);
    const [extractedData, setExtractedData] = useState({});
    const { id } = useParams();
    const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];

    useEffect(() => {
        const fetchAndStoreDetails = async () => {
            try {
                if (id) {
                    const response = await pendingAccountData.getDetailsS3(id);
                    const application = response.documents || [];
                    setLocalFormData(application);
                    
                    if (application.length > 0) {
                        processDocumentsForExtraction(application);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch application details:', error);
            }
        };

        fetchAndStoreDetails();
    }, [id]);

    const processDocumentsForExtraction = (documents) => {
        const processDocument = async (doc) => {
            try {
                const response = await fetch(daodocbase + doc.file_path);
                const blob = await response.blob();
                return {
                    ...doc,
                    file: new File([blob], doc.file_name, { type: blob.type })
                };
            } catch (error) {
                console.error('Error processing document:', error);
                return null;
            }
        };

        documents.forEach(async (doc) => {
            const processedDoc = await processDocument(doc);
            if (processedDoc) {
                setCurrentDocument(processedDoc);
            }
        });
    };

    const handleExtractionComplete = (data) => {
        if (currentDocument) {
            const updatedData = {
                ...extractedData,
                [currentDocument.id]: data
            };
            setExtractedData(updatedData);
            
            // Update localFormData with extracted data
            setLocalFormData(prev => prev.map(doc => 
                doc.id === currentDocument.id 
                    ? { ...doc, extractedData: data } 
                    : doc
            ));
        }
        setCurrentDocument(null);
    };

    // ... (keep your existing handler functions unchanged)

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
                admin_id: 1
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
                admin_id: 1
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
        // alert('called')
        try {
            const payload = {
                applicaiton_id: Number(id),
                status: 'Approved',
                status_comment: '',
                admin_id: 1
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
            // console.error('Error updating status:', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong while updating the status!',
            });
        }
    }


    return (
        <div className="form-container">
            <h2 className="text-xl font-bold mb-2">Upload Documents</h2>
            <DocumentDetailsTable 
                documentslist={localFormData} 
                extractedData={extractedData} 
            />

            {/* <DAOExtraction 
                document={currentDocument}
                onClose={() => setCurrentDocument(null)}
                onExtractionComplete={handleExtractionComplete}
            /> */}

            {/* ... (keep your button section unchanged) */}
            
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
                    className="btn-next "
                    onClick={handleNextStep}
                >
                    Accept & Continue
                </CommonButton>
            </div>
        </div>
    );
}

const DocumentDetailsTable = ({ documentslist, extractedData }) => {
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

    return (
        <div className="p-4 max-w-4xl mx-auto">
            {Object.entries(groupedDocs).map(([type, docs]) => (
                <div key={type} className="mb-8">
                    <h2 className="text-xl font-bold mb-4 capitalize">{type}</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">ID</th>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">File Name</th>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Preview</th>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Photo</th>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Signature</th>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {docs.map((doc) => {
                                    const extraction = extractedData[doc.id] || {};
                                    const hasSignatures = extraction.signatures?.length > 0;
                                    const hasPhotos = extraction.photographs?.length > 0;
                                    
                                    return (
                                        <tr key={doc.id}>
                                            <td className="py-2 px-4 border-b border-gray-200">{doc.id}</td>
                                            <td className="py-2 px-4 border-b border-gray-200">{doc.file_name}</td>
                                            <td className="py-2 px-4 border-b border-gray-200">
                                                <img
                                                    src={daodocbase + `${doc.file_path}`}
                                                    alt="document"
                                                    className="h-auto w-20 object-contain border rounded"
                                                />
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-200">
                                                { hasPhotos ? (
                                                    <div className="flex flex-col space-y-2">
                                                        
                                                        {hasPhotos && (
                                                            <div>
                                                                <span className="font-medium">Photos:</span>
                                                                {extraction.photographs.map((photo, i) => (
                                                                    <img 
                                                                        key={i}
                                                                        src={`data:image/jpeg;base64,${photo.image}`}
                                                                        alt={`Photo ${i+1}`}
                                                                        className="h-10 w-auto border rounded"
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">No data extracted</span>
                                                )}
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-200">
                                                { hasPhotos ? (
                                                    <div className="flex flex-col space-y-2">
                                                        {hasSignatures && (
                                                            <div>
                                                                <span className="font-medium">Signatures:</span>
                                                                {extraction.signatures.map((sig, i) => (
                                                                    <img 
                                                                        key={i}
                                                                        src={`data:image/jpeg;base64,${sig.image}`}
                                                                        alt={`Signature ${i+1}`}
                                                                        className="h-10 w-auto border rounded"
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                      
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">No data extracted</span>
                                                )}
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-200">{doc.created_at}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
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
//     const { id } = useParams();
//     const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];

//     useEffect(() => {
//         const fetchAndStoreDetails = async () => {
//             try {
//                 // alert('called')
//                 if (id) {
//                     const response = await pendingAccountData.getDetailsS3(id);
//                     // localStorage.setItem('applicationDetails', JSON.stringify(response));
//                     console.log('documants :', response.documents);
//                     const application = response.documents || {};
//                     setLocalFormData(application);
//                 }
//             } catch (error) {
//                 console.error('Failed to fetch application details:', error);
//             }
//         };

//         fetchAndStoreDetails();
//     }, [id]);


//     const handleRejectClick = async () => {
//         const result = await Swal.fire({
//             title: 'Reason for Rejection',
//             input: 'text',
//             inputLabel: 'Please provide a reason',
//             inputPlaceholder: 'Enter reason here...',
//             showCancelButton: true,
//             confirmButtonText: 'Submit',
//             cancelButtonText: 'Cancel',
//             className: 'btn-login',
//             inputValidator: (value) => {
//                 if (!value) {
//                     return 'You need to write a reason!';
//                 }
//             },
//         });

//         if (result.isConfirmed && result.value) {
//             const payload = {
//                 application_id: Number(id),
//                 status: 'Rejected',
//                 status_comment: result.value,
//                 admin_id: 1
//             };
//             await pendingAccountStatusUpdate.updateS3(id, payload);
//             applicationStatus.push('Reject');
//             localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
//             console.log('Payload:', payload);
//             onNext(); // pass the payload forward
//         } else if (result.isDismissed) {
//             console.log('Rejection canceled');
//         }
//     };

//     const handleReviewClick = async () => {
//         const result = await Swal.fire({
//             title: 'Reason for Review',
//             input: 'text',
//             inputLabel: 'Please provide a reason',
//             inputPlaceholder: 'Enter reason here...',
//             showCancelButton: true,
//             confirmButtonText: 'Submit',
//             cancelButtonText: 'Cancel',
//             className: 'btn-login',
//             inputValidator: (value) => {
//                 if (!value) {
//                     return 'You need to write a reason!';
//                 }
//             },
//         });

//         if (result.isConfirmed && result.value) {
//             const payload = {
//                 application_id: Number(id),
//                 status: 'Review',
//                 status_comment: result.value,
//                 admin_id: 1
//             };
//             await pendingAccountStatusUpdate.updateS3(id, payload);
//             applicationStatus.push('Review');
//             localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
//             console.log('Payload:', payload);
//             onNext(); // pass the payload forward
//         } else if (result.isDismissed) {
//             console.log('Rejection canceled');
//         }
//     };

//     const handleNextStep = () => {
//         // alert('called')
//         try {
//             const payload = {
//                 applicaiton_id: Number(id),
//                 status: 'Approved',
//                 status_comment: '',
//                 admin_id: 1
//             }
//             const response = pendingAccountStatusUpdate.updateS3(id, payload);
//             applicationStatus.push('Approved');
//             localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Enrollment Details Approved Successfully',
//                 timer: 2000,               // alert stays for 2 seconds
//                 showConfirmButton: false,  // no "OK" button
//                 allowOutsideClick: false,  // optional: prevent closing by clicking outside
//                 allowEscapeKey: false,     // optional: prevent closing with Escape key
//                 didOpen: () => {
//                     Swal.showLoading();   // optional: show loading spinner
//                 },
//                 willClose: () => {
//                     onNext(); // proceed after alert closes
//                 }
//             });
//         }
//         catch (error) {
//             // console.error('Error updating status:', error);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Oops...',
//                 text: 'Something went wrong while updating the status!',
//             });
//         }
//     }




//     return (
//         <div className="form-container">
//             <h2 className="text-xl font-bold mb-2">Upload Documents</h2>
//             <DocumentDetailsTable documentslist={localFormData} />





//             <div className="next-back-btns">
//                 <CommonButton
//                     className="text-red-500 border border-red-500 hover:bg-red-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
//                     onClick={handleRejectClick}
//                 >
//                     Reject & Continue
//                 </CommonButton>

//                 <CommonButton
//                     className="text-amber-500 border border-amber-500 hover:bg-amber-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
//                     onClick={handleReviewClick}
//                 >
//                     Review & Continue
//                 </CommonButton>

//                 <CommonButton
//                     className="btn-next "
//                     onClick={handleNextStep}
//                 >
//                     Accept & Continue
//                 </CommonButton>
//             </div>


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
//         <div className="p-4 max-w-4xl mx-auto">
//             {Object.entries(groupedDocs).map(([type, docs]) => (
//                 <div key={type} className="mb-8">
//                     <h2 className="text-xl font-bold mb-4 capitalize">{type}</h2>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full border border-gray-200">
//                             <thead className="bg-gray-100">
//                                 <tr>
//                                     <th className="py-2 px-4 border-b border-gray-200 text-left">ID</th>
//                                     <th className="py-2 px-4 border-b border-gray-200 text-left">File Name</th>
//                                     <th className="py-2 px-4 border-b border-gray-200 text-left">Preview</th>
//                                     <th className="py-2 px-4 border-b border-gray-200 text-left">Created At</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {docs.map((doc) => (
//                                     <tr key={doc.id}>
//                                         <td className="py-2 px-4 border-b border-gray-200">{doc.id}</td>
//                                         <td className="py-2 px-4 border-b border-gray-200">{doc.file_name}</td>
//                                         <td className="py-2 px-4 border-b border-gray-200">
//                                                <img
//                                                 src={daodocbase+`${doc.file_path}`}
//                                                 alt="document"
//                                                 className="h-auto w-20 object-contain border rounded"
//                                                 /> 
//                                         </td>
//                                         <td className="py-2 px-4 border-b border-gray-200">{doc.created_at}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
// };


// export default p3;