import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommonButton from '../../components/CommonButton';


function MyPage() {
    const [reason, setReason] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); 
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

    if (loading) {
        return <div>Loading reason...</div>;
    }

    if (!reason) {
        return <div>No reason found or an error occurred.</div>;
    }
 
  const admin_id=localStorage.getItem('userCode') || 1; // Default to 1 if not set
  
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
                  status: 'Rejected',
                  status_comment: result.value,
                  admin_id: admin_id
              };
              await pendingKycStusUpdate.updateKyc3( payload);
              applicationStatus.push('Reject');
              localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus)); 
             navigate('/admindashboard')// pass the payload forward
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
                  admin_id: admin_id
              };
              await pendingKycStusUpdate.updateKyc3( payload);
              applicationStatus.push('Review');
              localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus)); 
              navigate('/admindashboard') // pass the payload forward
          } else if (result.isDismissed) {
              console.log('Rejection canceled');
          }
      };
  
      const handleNextStep = () => { 
          try {
              const payload = {
                  kyc_application_id: Number(id),
                  status: 'Approved',
                  status_comment: '',
                  admin_id: admin_id
              }
              const response = pendingKycStusUpdate.updateKyc3( payload);
              applicationStatus.push('Approved');
              localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
              Swal.fire({
                  icon: 'success',
                  title: 'KYC Details Approved Successfully',
                  timer: 2000,               // alert stays for 2 seconds
                  showConfirmButton: false,  // no "OK" button
                  allowOutsideClick: false,  // optional: prevent closing by clicking outside
                  allowEscapeKey: false,     // optional: prevent closing with Escape key
                  didOpen: () => {
                      Swal.showLoading();   // optional: show loading spinner
                  },
                  willClose: () => {
                    navigate('/admindashboard')// proceed after alert closes
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
        <div>
            
      <h1 className="text-xl font-bold flex justify-between text-gray-800 mb-3">
        Pending application: {id}
      </h1>
            <h1 className='text-xl font-bold '>Video - KYC</h1> 
            {reason.data && reason.data[0] &&
                <><video
                    controls
                    className="w-[50%] mx-auto mt-5 rounded-lg shadow-lg border-8 border-green-300"
                    src={`https://vcall.payvance.co.in/storage/${reason.data[0].file_path}`}
                    />

                </>
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
        </div>
    );
}

export default MyPage;

 