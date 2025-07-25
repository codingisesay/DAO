import React, {useState, useEffect} from 'react';
// import LivePhoto from './2C'; 
import CommonButton from '../../components/CommonButton';

import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { pendingAccountData, pendingAccountStatusUpdate } from '../../services/apiServices'; // <-- Import your service
import { daodocbase } from '../../data/data';


function p4({ onNext, onBack }) {

    const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];
    const { id } = useParams();
 const [reason, setReason] = useState(null);
    const [loading, setLoading] = useState(true); 
    const APIURL = 'https://vcall.payvance.co.in/api/fetch-video-details';

    useEffect(() => {
        const loadReason = async () => {
            try {
                setLoading(true);
                const response = await fetch(APIURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ kyc_application_id: id })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setReason(data);
            } catch (error) {
                console.error("Error loading reason:", error);
                setReason(null);
            } finally {
                setLoading(false);
            }
        };

        loadReason();
    }, [id]);
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
            // await pendingAccountStatusUpdate.updateS3(id, payload);
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
                admin_id:admin_id
            };
            // await pendingAccountStatusUpdate.updateS3(id, payload);
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
                admin_id:admin_id
            }
            // const response = pendingAccountStatusUpdate.updateS3(id, payload);
            applicationStatus.push('Approved');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            Swal.fire({
                icon: 'success',
                title: 'Video Call Approved Successfully',
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
        <>

            <p className="text-xl font-bold">Video - KYC</p>

      {reason && reason.data ? 
            
            (
            reason.data[0] ?
                <><video
                    controls
                    className="w-[50%] mx-auto mt-5 rounded-lg shadow-lg border-8 border-green-300"
                    src={`https://vcall.payvance.co.in/storage/${reason.data[0].file_path}`}
                    />

                </>
                :<></> 
                
            )
                :<>No Video Call Available</>
            }

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
        </>);
}

export default p4;