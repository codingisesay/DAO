import React, {useState, useEffect} from "react";
import clsx from "clsx";
import Swal from 'sweetalert2'
import CommonButton from "../../components/CommonButton";
import { useNominationForm } from "./Step5B_Nomination_useNominationForm";
import NomineeDetailsForm from "./Step5B_Nomination_NomineeDetailsForm";
import NomineeAddressForm from "./Step5B_Nomination_NomineeAddressForm";
import NomineesList from "./Step5B_Nomination_NomineesList";
import {pendingAccountStatusUpdate} from '../../services/apiServices'
import { useParams } from "react-router-dom";

function NominationForm({ onBack, onNext }) {
  
    const [isAdmin, setIsAdmin] = useState(false);
    const [isView, setIsView] = useState(false);
    const admin_id= localStorage.getItem('userCode');
    const {id} = useParams();
    useEffect(() => {
        const role = localStorage.getItem("roleName");
        setIsAdmin(role.includes("admin") || role.includes("Admin"));
        setIsView(window.location.href.includes("view")); 
      }, []);
    

  const {
    nominees,
    currentNominee,
    errors,
    touchedFields,
    isSameAsPermanent,
    isPinCodeValid,
    isFetchingPincode,
    isAddNomineeDisabled,
    handleChange,
    handleBlur,
    handleSameAddressToggle,
    addNominee,
    removeNominee,
    submitNominees,
    getRemainingPercentage,
  } = useNominationForm();

  const handleSubmit = async () => {
    const success = await submitNominees();
    if (success && onNext) {
      onNext();
    }
  };


  // admin controller below

    const rejNomineeDetails = async () => {
        const result = await Swal.fire({
            title: 'Reason for Rejection',
            input: 'text',
            inputLabel: 'Nominee  Details Rejection Reason',
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
            await pendingAccountStatusUpdate.updateS5B(id, payload); 
           onNext();
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    };

    const revNomineeDetails = async () => {
        const result = await Swal.fire({
            title: 'Reason for Review',
            input: 'text',
            inputLabel: 'Nominee  Details Review Reason',
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
            await pendingAccountStatusUpdate.updateS5B(id, payload); 
           onNext();
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    };

    const apprvNomineeDetails = () => {
        try {
            const payload = {
                applicaiton_id: Number(id),
                status: 'Approved',
                status_comment: '',
                admin_id: admin_id
            }
            pendingAccountStatusUpdate.updateS5A(id, payload);
            Swal.fire({
                icon: 'success',
                title: 'Nominee  Details Approved Successfully',
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

  // admin controller above

  return (
    <div className="max-w-screen-xl mx-auto">
       
      {isAdmin || isView  ?
      <>
      
      </>:<>
      <h2 className="text-xl font-bold mb-4">Add Nominee Details</h2>
      <NomineeDetailsForm
        currentNominee={currentNominee}
        errors={errors}
        touchedFields={touchedFields}
        handleChange={handleChange}
        handleBlur={handleBlur}
        getRemainingPercentage={getRemainingPercentage}
      />

      <NomineeAddressForm
        currentNominee={currentNominee}
        errors={errors}
        touchedFields={touchedFields}
        isSameAsPermanent={isSameAsPermanent}
        isPinCodeValid={isPinCodeValid}
        isFetchingPincode={isFetchingPincode}
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleSameAddressToggle={handleSameAddressToggle}
      />

      <div className="flex justify-end mb-6 mt-3">
        <CommonButton
          onClick={addNominee}
          disabled={isAddNomineeDisabled}
          className={clsx(
            "border rounded-md px-3 py-1",
            isAddNomineeDisabled
              ? "grayscale opacity-50 cursor-not-allowed border-gray-400 text-gray-400"
              : "border-green-500 text-green-500"
          )}
        >
          Add Nominee
        </CommonButton>
      </div>
</>
      
      }
      {nominees.length > 0 && (
        <NomineesList nominees={nominees} removeNominee={removeNominee} />
      )}

      <div className="next-back-btns z-10">
        <CommonButton onClick={onBack} variant="outlined" className="btn-back">
          <i className="bi bi-chevron-double-left"></i>&nbsp;Back
        </CommonButton>
 
        {!isView ? (<>                              
            {isAdmin ? (                            
                <>
                <CommonButton
                    className="text-red-500 border border-red-500 hover:bg-red-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
                    onClick={rejNomineeDetails}
                >
                    Reject & Continue
                </CommonButton>

                <CommonButton
                    className="text-amber-500 border border-amber-500 hover:bg-amber-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
                    onClick={revNomineeDetails}
                >
                    Review & Continue
                </CommonButton>

                <CommonButton
                    className="btn-next"
                    onClick={apprvNomineeDetails}
                >
                    Accept & Continue
                </CommonButton>
                </>
            ) 
            : (
            <>
                <CommonButton
                className="btn-next"
                onClick={handleSubmit} 
                >
              
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i> 
                </CommonButton>
            </>
            )} 
        </>) : (<>
            <CommonButton  className="btn-next"  onClick={onNext}  >  
                Next&nbsp;<i className="bi bi-chevron-double-right"></i> 
            </CommonButton>                            
        </>)}
                                      



        {/* <CommonButton
          onClick={handleSubmit}
          variant="contained"
          className="btn-next"
        >
          Next&nbsp;<i className="bi bi-chevron-double-right"></i>
        </CommonButton> */}
      </div>
    </div>
  );
}

export default NominationForm;