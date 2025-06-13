

import React, { useState, useEffect } from 'react';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import   { pendingKycStusUpdate, pendingKyc } from '../../services/apiServices'; // <-- Import your service
import { daodocbase } from '../../data/data';


function p3({ onNext, onBack }) {
    const [localFormData, setLocalFormData] = useState();
    const { id } = useParams();
    const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];

    useEffect(() => {
        const fetchAndStoreDetails = async () => {
            try {
                // alert('called')
                if (id) {
                    const response = await pendingKyc.pendingKyc2(id);
                    localStorage.setItem('applicationDetails', JSON.stringify(response));
                    console.log('documants :', response.data);
                    const application = response.data || {};
                    setLocalFormData(application);


                }
            } catch (error) {
                console.error('Failed to fetch application details:', error);
            }
        };

        fetchAndStoreDetails();
    }, [id]);


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
                kyc_application_id: Number(id),
                status: 'Reject',
                status_comment: result.value,
                admin_id: 1
            };
            await pendingKycStusUpdate.updateKyc2( payload);
            applicationStatus.push('Reject');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            console.log('Payload:', payload);
            onNext() // pass the payload forward
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
                kyc_application_id: Number(id),
                status: 'Review',
                status_comment: result.value,
                admin_id: 1
            };
            await pendingKycStusUpdate.updateKyc2( payload);
            applicationStatus.push('Review');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            console.log('Payload:', payload);
            onNext() // pass the payload forward
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    };

    const handleNextStep = () => {
        // alert('called')
        try {
            const payload = {
                kyc_application_id: Number(id),
                status: 'Approved',
                status_comment: '',
                admin_id: 1
            }
            const response = pendingKycStusUpdate.updateKyc2( payload);
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
                    onNext() // proceed after alert closes
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
            <DocumentDetailsTable documentslist={localFormData} />





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



const DocumentDetailsTable = ({ documentslist }) => {
    if (!documentslist || !Array.isArray(documentslist)) {
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
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {docs.map((doc) => (
                                    <tr key={doc.id}>
                                        <td className="py-2 px-4 border-b border-gray-200">{doc.id}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{doc.kyc_file_name}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <a href={daodocbase + `/${doc.kyc_file_path}`} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={daodocbase + `/${doc.kyc_file_path}`}
                                                    alt="document"
                                                    className="h-auto w-20 object-contain border rounded"
                                                />
                                            </a>
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">{doc.created_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};


export default p3;