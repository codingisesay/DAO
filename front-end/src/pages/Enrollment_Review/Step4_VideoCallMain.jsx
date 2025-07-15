
import React, {useState, useEffect} from 'react';
// import LivePhoto from './2C';
import Swal from 'sweetalert2';
import VideoKYCInstructions from './Step4A_VideoCallScreen';
import CommonButton from '../../components/CommonButton';
import { pendingAccountData, createAccountService, agentService,pendingAccountStatusUpdate } from '../../services/apiServices';


function p4({ onNext, onBack }) {

    const [isAdmin, setIsAdmin] = useState(false);
    const [isView, setIsView] = useState(false);
    const admin_id= localStorage.getItem('userCode');

    useEffect(() => {
        const role = localStorage.getItem("roleName");
        setIsAdmin(role.includes("admin") || role.includes("Admin"));
        setIsView(window.location.href.includes("view")); 
    }, []);

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
       
        try { 
            // nothing to store if there anything then it in VideoKYCInstructions page
            Swal.fire({
                icon: 'success',
                title:  'Video call details saved successfully.',
                showConfirmButton: false,
                timer: 1500
            });
            onNext();

        } catch (error) {
            console.error("Error saving personal details:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error?.data?.message || 'Failed to save personal details',
                confirmButtonText: 'OK',
            });

        } finally {
           //set button loadings false
        }
    };
    // admin controls below

    const handleRejectClick = async () => {
        const result = await Swal.fire({
            title: 'Reason for Rejection',
            input: 'text',
            inputLabel: 'Personal Details Rejection Reason',
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
          //payloadd and api call will go here
           onNext();
        } else if (result.isDismissed) {
         //   console.log('Rejection canceled');
        }
    };

    const handleReviewClick = async () => {
        const result = await Swal.fire({
            title: 'Reason for Review',
            input: 'text',
            inputLabel: 'Personal Details Review Reason',
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
          //payloadd and api call will go here
           onNext();
        } else if (result.isDismissed) {
           // console.log('Review canceled');
        }
    };

    const handleApproveClick = () => {
        try {
    
          //payloadd and api call will go here
            Swal.fire({
                icon: 'success',
                title: 'Personal Details Approved Successfully',
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
            });
           onNext();
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error?.response?.data?.message,
            });
        }
    }

    // admin controls above


    return (
        <>
            <div className="form-container">
                <h2 className="text-xl font-bold mb-2">Video KYC</h2>
                <VideoKYCInstructions onNext={onNext} />

                <div className="next-back-btns">
                    <CommonButton className="btn-back" onClick={onBack}>
                        <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                    </CommonButton>




 
                {!isView ? (<>                    
                    {isAdmin ? (            
                    <>
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
                        onClick={handleApproveClick}
                    >
                        Accept & Continue
                    </CommonButton>
                    </>
                    ) 
                    : (
                    <> 
                    <CommonButton  className="btn-next"  onClick={handleSubmit}
                        iconRight={<i className="bi bi-chevron-double-right"></i>}  >
                      
                                Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                           
                    </CommonButton>
                    </>
                    )} 
                </>) : (<>
                    <CommonButton  className="btn-next"  onClick={onNext}  >  
                        Next&nbsp;<i className="bi bi-chevron-double-right"></i> 
                    </CommonButton>                            
                </>)}


 
                </div>

            </div>
        </>);
}

export default p4;