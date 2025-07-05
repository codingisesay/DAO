
import React, { useEffect, useState } from "react";
import clsx from "clsx";import Swal from 'sweetalert2';
import CommanInput from '../../components/CommanInput';
import CommonButton from '../../components/CommonButton';
import labels from '../../components/labels';
import { pre } from 'framer-motion/client';
import { pendingKycStusUpdate, pendingKyc } from '../../services/apiServices';
import { useParams } from "react-router-dom";
import userphoto from '../../assets/imgs/user_avatar.jpg';

const FloatingInput = ({
  name,
  type = "text",
  value,
  onChange,
  label,
  required = false,
  error = false,
  touched = false,
  errorMessage = "",
  disabled = false,
  max,
  className = "",
  showToggle = false,
  onToggle = () => {},
  useAadhaarValue = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const shouldFloat = isFocused || value;

  const handleBlur = (e) => {
    setIsFocused(false);
    if (rest.onBlur) rest.onBlur(e);
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    if (rest.onChange) rest.onChange(e);
  };

  return (
    <div
      className={clsx(
        "floating-input-height relative w-full border border-gray-300 dark:border-gray-700 rounded-md",
        className
      )}
    >
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        required={required}
        className={clsx(
          "peer block w-full bg-transparent px-4 py-2 text-sm rounded-md",
          " transition-all ",
          {
            "border-red-500": error && touched,
          }
        )}
        placeholder={label}
        maxLength={max}
        disabled={disabled}
        {...rest}
      />
      <label
        htmlFor={name}
        className={clsx(
          "absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-300 transition-all duration-200 pointer-events-none",
          {
            "bg-white dark:bg-gray-900 px-1 text-xs -translate-y-4":
              shouldFloat,
            "bg-white dark:bg-gray-900 w-9/12 text-gray-500 dark:text-gray-200 translate-y-0.5":
              !shouldFloat,
          }
        )}
      >
        {label}
        {/* {required && <span className="text-red-500 ml-0.5">*</span>} */}
      </label>

      {showToggle && (
        <button
          className="absolute right-8 top-2 bg-gray-200 px-2 py-1 rounded text-xs"
          onClick={onToggle}
          type="button"
        >
          {useAadhaarValue ? "←" : "→"}
        </button>
      )}

      {error && touched && (
        <p className="mt-1 text-xs text-red-500">
          {label} : {errorMessage || error}
        </p>
      )}
    </div>
  );
};

const CustomerDetailsPage = ({ formData, handleChange, updateProgress, subProgress, onNext, onBack, kycApplicationId }) => {
 
  const { id } = useParams();
  const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];
  const [localFormData, setLocalFormData] = useState({})
  useEffect(() => { 
      const fetchAndStoreDetails = async (id) => {
            try {
                // alert('called')
                if (id) {
                    const response = await pendingKyc.pedingKyc1(id);
                    
                    setLocalFormData(response.data[0]);
                    console.log('to show : ', localFormData)
                }
            } catch (error) {
                console.error('Failed to fetch application details:', error);
            }
        };
        
        fetchAndStoreDetails(id);
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
                status: 'Rejected',
                status_comment: result.value,
                admin_id: 1
            };
            await pendingKycStusUpdate.updateKyc1( payload);

            applicationStatus.push('Reject');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            console.log('Payload:', payload);
            onNext?.(payload); // pass the payload forward
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
            await  pendingKycStusUpdate.updateKyc1( payload);
            applicationStatus.push('Review');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            console.log('Payload:', payload);
            onNext?.(payload); // pass the payload forward
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    };

    const handleNextStep = async () => {
    
        try {
            const payload = {
                kyc_application_id: Number(id),
                status: 'Approved',
                status_comment: '',
                admin_id: 1
            }
            await  pendingKycStusUpdate.updateKyc1( payload);

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
    <div className="customer-details-container form-container">
      <h1 className="text-xl font-bold flex justify-between text-gray-800 mb-0">
        Pending application 
      </h1>
      <div className="details-sections">
        {/* Aadhaar Details Section - Uneditable */}
        <div className="details-section aadhaar-section">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Aadhaar Details
          </h2>
          <img
            src={userphoto}
            width={'100px'}
            height={'100px'}
            alt="Customer Photo"
            className=" border-2 rounded-lg mb-5"
          />
          <div className="section-content grid grid-cols-2 gap-2">
            <FloatingInput
              name="aadhaar-salutation"
              label="Salutation"
              value={localFormData.kyc_vs_salutation}
              disabled
              className="mb-4"
            />

            <FloatingInput
              name="aadhaar-middleName"
              label="Middle Name"
              value={localFormData.kyc_vs_middle_name}
              disabled
              className="mb-4"
            />

            <FloatingInput
              name="aadhaar-firstName"
              label="First Name"
              value={localFormData.kyc_vs_first_name}
              disabled
              className="mb-4"
            />

            <FloatingInput
              name="aadhaar-lastName"
              label="Last Name"
              value={localFormData.kyc_vs_last_name}
              disabled
              className="mb-4"
            />

            <FloatingInput
              name="aadhaar-dob"
              label="DOB"
              value={localFormData.kyc_vs_date_of_birth}
              disabled
              className="mb-4"
            />

            <FloatingInput
              name="aadhaar-gender"
              label="Gender"
              value={localFormData.kyc_vs_gender}
              disabled
              className="mb-4"
            />

            <FloatingInput
              name="aadhaar-mobileNo"
              label="Mobile No"
              value={localFormData.kyc_vs_mobile_no}
              disabled
              className="mb-4"
            />

            <FloatingInput
              name="aadhaar-flatNo"
              label="Flat No./Bldg Name"
              value={localFormData.kyc_vs_flat_no}
              disabled
              className="mb-4"
            />

            <FloatingInput
              name="aadhaar-complexName"
              label="Complex Name"
              value={localFormData.kyc_vs_complex_name}
              disabled
              className="mb-4"
            />

            <FloatingInput
              name="aadhaar-landmark"
              label="Nearby Landmark"
              value={localFormData.kyc_vs_lankmark}
              disabled
              className="mb-4"
            />

            <FloatingInput
              name="aadhaar-area"
              label="Area"
              value={localFormData.kyc_vs_area}
              disabled
              className="mb-4"
            />

            <FloatingInput
              name="aadhaar-pinCode"
              label="Pin Code"
              value={localFormData.kyc_vs_pincode}
              disabled
              className="mb-4"
            />

            <FloatingInput
              name="aadhaar-district"
              label="District"
              value={localFormData.kyc_vs_district}
              disabled
              className="mb-4"
            />

            <FloatingInput
              name="aadhaar-country"
              label="Country"
              value={localFormData.kyc_vs_country}
              disabled
              className="mb-4"
            />

            <FloatingInput
              name="aadhaar-city"
              label="City"
              value={localFormData.kyc_vs_city}
              disabled
              className="mb-4"
            />

            <FloatingInput
              name="aadhaar-state"
              label="State"
              value={localFormData.kyc_vs_state}
              disabled
              className="mb-4"
            />
          </div>
        </div>

        {/* CBS Details Section - Editable */}
        <div className="details-section cbs-section">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            CBS Details
          </h2>
          <img
            src={userphoto}
            width={'100px'}
            height={'100px'}
            alt="Customer Photo"
            className=" border-2 rounded-lg mb-5"
          />
          <div className="section-content grid grid-cols-2 gap-2">
            {/* Editable fields for CBS */}
            <div className="relative mb-4">
              <FloatingInput
                name="cbs-salutation"
                label="Salutation"
                value={localFormData.kyc_cbs_salutation}
                onChange={(value) => handleCbsChange("kyc_vscbs_salutation", value)}
                required
              />
            
            </div>

            <div className="relative mb-4">
              <FloatingInput
                name="cbs-middleName"
                label="Middle Name"
                value={localFormData.kyc_cbs_middle_name}
                onChange={(value) => handleCbsChange("kyc_vscbs_middle_name", value)}
              />
          
            </div>

            <div className="relative mb-4">
              <FloatingInput
                name="cbs-firstName"
                label="First Name"
                value={localFormData.kyc_cbs_first_name}
                onChange={(value) => handleCbsChange("kyc_vscbs_first_name", value)}
                required
              />
            
            </div>

            <div className="relative mb-4">
              <FloatingInput
                name="cbs-lastName"
                label="Last Name"
                value={localFormData.kyc_cbs_last_name}
                onChange={(value) => handleCbsChange("kyc_vscbs_last_name", value)}
                required
              />
            
            </div>

            <div className="relative mb-4">
              <FloatingInput
                name="cbs-dob"
                label="DOB"
                value={localFormData.kyc_cbs_date_of_birth}
                onChange={(value) => handleCbsChange("kyc_vscbs_date_of_birth", value)}
                required
              />
            
            </div>

            <div className="relative mb-4">
              <FloatingInput
                name="cbs-gender"
                label="Gender"
                value={localFormData.kyc_cbs_gender}
                onChange={(value) => handleCbsChange("kyc_vscbs_gender", value)}
                required
              />
            
            </div>

            <div className="relative mb-4">
              <FloatingInput
                name="cbs-mobileNo"
                label="Mobile No"
                value={localFormData.kyc_cbs_mobile_no}
                onChange={(value) => handleCbsChange("kyc_vscbs_mobile_no", value)}
                required
          />
            </div>

            <div className="relative mb-4">
              <FloatingInput
                name="cbs-flatNo"
                label="Flat No./Bldg Name"
                value={localFormData.kyc_cbs_flat_no}
                onChange={(value) => handleCbsChange("kyc_vscbs_flat_no", value)}
                required
              />
        
            </div>

            <div className="relative mb-4">
              <FloatingInput
                name="cbs-complexName"
                label="Complex Name"
                value={localFormData.kyc_cbs_complex_name}
                onChange={(value) => handleCbsChange("kyc_vscbs_complex_name", value)}
                required
        />
            </div>

            <div className="relative mb-4">
              <FloatingInput
                name="cbs-landmark"
                label="Nearby Landmark"
                value={localFormData.kyc_cbs_lankmark}
                onChange={(value) => handleCbsChange("kyc_vscbs_lankmark", value)}
                required
              />
            
            </div>

            <div className="relative mb-4">
              <FloatingInput
                name="cbs-area"
                label="Area"
                value={localFormData.kyc_cbs_area}
                onChange={(value) => handleCbsChange("kyc_vscbs_area", value)}
                required
              />
            
            </div>

            <div className="relative mb-4">
              <FloatingInput
                name="cbs-pinCode"
                label="Pin Code"
                value={localFormData.kyc_cbs_pincode}
                onChange={(value) => handleCbsChange("kyc_vscbs_pincode", value)}
                required
              />
            
            </div>

            <div className="relative mb-4">
              <FloatingInput
                name="cbs-district"
                label="District"
                value={localFormData.kyc_cbs_district}
                onChange={(value) => handleCbsChange("kyc_vscbs_district", value)}
                required
              />
            
            </div>

            <div className="relative mb-4">
              <FloatingInput
                name="cbs-country"
                label="Country"
                value={localFormData.kyc_cbs_country}
                onChange={(value) => handleCbsChange("kyc_vscbs_country", value)}
                required
              />
            
            </div>

            <div className="relative mb-4">
              <FloatingInput
                name="cbs-city"
                label="City"
                value={localFormData.kyc_cbs_city}
                onChange={(value) => handleCbsChange("kyc_vscbs_city", value)}
                required
              />
          
            </div>

            <div className="relative mb-4">
              <FloatingInput
                name="cbs-state"
                label="State"
                value={localFormData.kyc_cbs_state}
                onChange={(value) => handleCbsChange("kyc_vscbs_state", value)}
                required
              />
            
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
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


    </div>
  );
};

export default CustomerDetailsPage;












 