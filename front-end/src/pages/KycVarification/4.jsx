
import React, { useState, useEffect } from 'react';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import   { pendingKycStusUpdate, pendingKyc } from '../../services/apiServices'; // <-- Import your service
import { useNavigate } from 'react-router-dom';
 
function p4({ onNext, onBack }) { 
    const navigate = useNavigate();
    const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];
    const { id } = useParams();

  
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
                  admin_id: 1
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
                  admin_id: 1
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
                  admin_id: 1
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
        <>

            <p className="text-xl font-bold">Video - KYC</p>


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