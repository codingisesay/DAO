import React from 'react';
// import LivePhoto from './2C'; 
import CommonButton from '../../components/CommonButton';
function p4({ onNext, onBack }) {
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
            onNext(); // Called when user confirms with valid input
        } else if (result.isDismissed) {
            // onReject?.(); // Called when user cancels or dismisses the alert
        }
    };

    const handleNextStep = () => { onNext(); };

    return (
        <>

            <p className="text-xl font-bold">Video - KYC</p>

            <div className="next-back-btns">
                <CommonButton
                    className="text-red-500 border border-red-500 hover:bg-red-50 transition-colors my-auto px-4 rounded-md py-1"
                    onClick={handleRejectClick}
                >
                    Reject & Continue
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