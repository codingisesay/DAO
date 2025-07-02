import React, { useState, useRef } from "react";
import clsx from "clsx";
import CommanInput from '../../components/CommanInput';
import CommonButton from '../../components/CommonButton';
import labels from '../../components/labels';
import { pre } from 'framer-motion/client';
import { kycService } from '../../services/apiServices';
import userphoto from '../../assets/imgs/user_avatar.jpg';
import Swal from 'sweetalert2';

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
  isMatched = false,
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
        {
          "border-green-500": isMatched,
          "border-red-500": !isMatched && showToggle,
        },
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
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {showToggle && (
        <button
          className="absolute right-3 top-2 bg-gray-200 px-2 py-1 rounded text-xs"
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

const CustomerDetailsPage = ({ formData, handleChange, subProgress, nextStep, prevStep, kycApplicationId }) => {
  const application_id = localStorage.getItem('application_id');
  
  const [aadhaarData] = useState({
    kyc_vs_salutation: "Mrs",
    kyc_vs_middle_name: "Subhash",
    kyc_vs_first_name: "Sushant",
    kyc_vs_last_name: "Nikam",
    kyc_vs_date_of_birth: "1992-12-12",
    kyc_vs_mobile_no: "8433843848",
    kyc_vs_flat_no: "Kalpgreen G4/106/01",
    kyc_vs_lankmark: "Kattap Pada, Kulgoan",
    kyc_vs_pincode: "42IS03",
    kyc_vs_district: "Thane",
    kyc_vs_gender: "Male",
    kyc_vs_complex_name: "Kalpcity Phase 2",
    kyc_vs_area: "Near Old Petrol Pump",
    kyc_vs_country: "India",
    kyc_vs_city: "Badlapur",
    kyc_vs_state: "Maharashtra",
  });

  // CBS data (right side) - editable
  const [cbsData, setCbsData] = useState({
    kyc_cbs_salutation: "Mrs",
    kyc_cbs_middle_name: "Subhash",
    kyc_cbs_first_name: "Sushant",
    kyc_cbs_last_name: "Nikam",
    kyc_cbs_date_of_birth: "1992-12-12",
    kyc_cbs_mobile_no: "8433843848",
    kyc_cbs_flat_no: "Kalpgreen G4/106/01",
    kyc_cbs_lankmark: "Kattap Pada, Kulgoan",
    kyc_cbs_pincode: "42IS03",
    kyc_cbs_district: "Thane",
    kyc_cbs_gender: "Male",
    kyc_cbs_complex_name: "Kalpcity Phase 2",
    kyc_cbs_area: "Near Old Petrol Pump",
    kyc_cbs_country: "India",
    kyc_cbs_city: "Badlapur",
    kyc_cbs_state: "Maharashtra",
  });

  // After VS CBS data - will store modified CBS data
  const [afterVsCbsData, setAfterVsCbsData] = useState({
    kyc_vscbs_salutation: "Mrs",
    kyc_vscbs_middle_name: "Subhash",
    kyc_vscbs_first_name: "Sushant",
    kyc_vscbs_last_name: "Nikam",
    kyc_vscbs_date_of_birth: "1995-12-12",
    kyc_vscbs_mobile_no: "8433843848",
    kyc_vscbs_flat_no: "Kalpgreen G4/106/01",
    kyc_vscbs_lankmark: "Kattap Pada, Kulgoan",
    kyc_vscbs_pincode: "42IS03",
    kyc_vscbs_district: "Thane",
    kyc_vscbs_gender: "Male",
    kyc_vscbs_complex_name: "Kalpcity Phase 2",
    kyc_vscbs_area: "Near Old Petrol Pump",
    kyc_vscbs_country: "India",
    kyc_vscbs_city: "Badlapur",
    kyc_vscbs_state: "Maharashtra",
    status: "Pending"
  });

  // Fields that can be toggled between Aadhaar and CBS values
  const [useAadhaarValues, setUseAadhaarValues] = useState({
    flat_no: false,
    area: false,
    lankmark: false,
    city: false,
  });

  // Ref to store previous CBS values before sync
  const previousCbsData = useRef({
    flat_no: cbsData.kyc_cbs_flat_no,
    area: cbsData.kyc_cbs_area,
    lankmark: cbsData.kyc_cbs_lankmark,
    city: cbsData.kyc_cbs_city,
  });

  // Toggle between Aadhaar and CBS values for a specific field
  const toggleFieldValue = (field) => {
    const newUseAadhaarValue = !useAadhaarValues[field];

    setUseAadhaarValues((prev) => ({
      ...prev,
      [field]: newUseAadhaarValue,
    }));

    if (newUseAadhaarValue) {
      // Save current CBS value before overwriting
      previousCbsData.current[field] = cbsData[`kyc_cbs_${field}`];
      // Update with Aadhaar value
      setCbsData((prev) => ({
        ...prev,
        [`kyc_cbs_${field}`]: aadhaarData[`kyc_vs_${field}`],
      }));
    } else {
      // Restore original CBS value
      setCbsData((prev) => ({
        ...prev,
        [`kyc_cbs_${field}`]: previousCbsData.current[field],
      }));
    }
  };

  // Toggle all fields to use Aadhaar values or restore original CBS values
  const toggleAllFields = (useAadhaar) => {
    if (useAadhaar) {
      // Before syncing all, save current CBS values
      previousCbsData.current = {
        flat_no: cbsData.kyc_cbs_flat_no,
        area: cbsData.kyc_cbs_area,
        lankmark: cbsData.kyc_cbs_lankmark,
        city: cbsData.kyc_cbs_city,
      };

      // Update all fields to use Aadhaar values
      setUseAadhaarValues({
        flat_no: true,
        area: true,
        lankmark: true,
        city: true,
      });

      // Update CBS data with Aadhaar values
      setCbsData((prev) => ({
        ...prev,
        kyc_cbs_flat_no: aadhaarData.kyc_vs_flat_no,
        kyc_cbs_area: aadhaarData.kyc_vs_area,
        kyc_cbs_lankmark: aadhaarData.kyc_vs_lankmark,
        kyc_cbs_city: aadhaarData.kyc_vs_city,
      }));
    } else {
      // Restore original CBS values
      setUseAadhaarValues({
        flat_no: false,
        area: false,
        lankmark: false,
        city: false,
      });

      setCbsData((prev) => ({
        ...prev,
        kyc_cbs_flat_no: previousCbsData.current.flat_no,
        kyc_cbs_area: previousCbsData.current.area,
        kyc_cbs_lankmark: previousCbsData.current.lankmark,
        kyc_cbs_city: previousCbsData.current.city,
      }));
    }
  };

  // Check if all toggleable fields are using Aadhaar values
  const allFieldsUsingAadhaar = Object.values(useAadhaarValues).every(
    (val) => val
  );

  // Check if a field's Aadhaar and CBS values match
  const valuesMatch = (field) => {
    return aadhaarData[`kyc_vs_${field}`] === cbsData[`kyc_cbs_${field}`];
  };

  // Handle changes to CBS data
  const handleCbsChange = (field, value) => {
    const cbsField = field.replace('kyc_vscbs_', 'kyc_cbs_');
    const newCbsData = {
      ...cbsData,
      [cbsField]: value
    };
    
    setCbsData(newCbsData);
    
    // Update afterVsCbsData if the field is not toggled to use Aadhaar value
    const fieldName = field.replace('kyc_vscbs_', '');
    if (!useAadhaarValues[fieldName]) {
      setAfterVsCbsData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handelSubmit = async () => {
    const payload = {
      kyc_application_id: application_id,
      from_verify_sources: aadhaarData,     // Aadhaar data goes to kyc_data_from_verify_sources
      from_verify_cbs: cbsData,             // Original CBS data goes to kyc_data_from_verify_cbs
      after_vs_cbs: afterVsCbsData,         // Modified data (including toggled fields) goes to kyc_data_after_vs_cbs
    };
    console.log('Data to send back : ', payload)
    
    try {
      const response = await kycService.saveAllKycData(payload);
      console.log('KYC Data Saved:', response.data);
      Swal.fire({
        icon: 'success',
        title: `Form Submitted`,
        showConfirmButton: false,
        timer: 1500
      });
      nextStep();
    } catch (error) {
      console.error('Error saving KYC data:', error);
    }
  };

  return (
    <div className="customer-details-container">
      <h1 className="text-xl font-bold flex justify-between text-gray-800 mb-6">
        Customer Details
        <small className="text-gray-500">
          <input 
            type="checkbox" 
            id="syncAll" 
            checked={allFieldsUsingAadhaar}
            onChange={(e) => toggleAllFields(e.target.checked)}
            className="mr-2"
          />
          Sync All
        </small>
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
          <div className="section-content grid grid-cols-3 gap-4">
            <FloatingInput
              name="aadhaar-salutation"
              label="Salutation"
              value={aadhaarData.kyc_vs_salutation}
              disabled
              className="mb-4"
              isMatched={valuesMatch("salutation")}
            />

            <FloatingInput
              name="aadhaar-middleName"
              label="Middle Name"
              value={aadhaarData.kyc_vs_middle_name}
              disabled
              className="mb-4"
              isMatched={valuesMatch("middle_name")}
            />

            <FloatingInput
              name="aadhaar-firstName"
              label="First Name"
              value={aadhaarData.kyc_vs_first_name}
              disabled
              className="mb-4"
              isMatched={valuesMatch("first_name")}
            />

            <FloatingInput
              name="aadhaar-lastName"
              label="Last Name"
              value={aadhaarData.kyc_vs_last_name}
              disabled
              className="mb-4"
              isMatched={valuesMatch("last_name")}
            />

            <FloatingInput
              name="aadhaar-dob"
              label="DOB"
              value={aadhaarData.kyc_vs_date_of_birth}
              disabled
              className="mb-4"
              isMatched={valuesMatch("date_of_birth")}
            />

            <FloatingInput
              name="aadhaar-gender"
              label="Gender"
              value={aadhaarData.kyc_vs_gender}
              disabled
              className="mb-4"
              isMatched={valuesMatch("gender")}
            />

            <FloatingInput
              name="aadhaar-mobileNo"
              label="Mobile No"
              value={aadhaarData.kyc_vs_mobile_no}
              disabled
              className="mb-4"
              isMatched={valuesMatch("mobile_no")}
            />

            <FloatingInput
              name="aadhaar-flatNo"
              label="Flat No./Bldg Name"
              value={aadhaarData.kyc_vs_flat_no}
              disabled
              className="mb-4"
              showToggle={true}
              onToggle={() => toggleFieldValue("flat_no")}
              useAadhaarValue={useAadhaarValues.flat_no}
              isMatched={valuesMatch("flat_no")}
            />

            <FloatingInput
              name="aadhaar-complexName"
              label="Complex Name"
              value={aadhaarData.kyc_vs_complex_name}
              disabled
              className="mb-4"
              isMatched={valuesMatch("complex_name")}
            />

            <FloatingInput
              name="aadhaar-landmark"
              label="Nearby Landmark"
              value={aadhaarData.kyc_vs_lankmark}
              disabled
              className="mb-4"
              showToggle={true}
              onToggle={() => toggleFieldValue("lankmark")}
              useAadhaarValue={useAadhaarValues.lankmark}
              isMatched={valuesMatch("lankmark")}
            />

            <FloatingInput
              name="aadhaar-area"
              label="Area"
              value={aadhaarData.kyc_vs_area}
              disabled
              className="mb-4"
              showToggle={true}
              onToggle={() => toggleFieldValue("area")}
              useAadhaarValue={useAadhaarValues.area}
              isMatched={valuesMatch("area")}
            />

            <FloatingInput
              name="aadhaar-pinCode"
              label="Pin Code"
              value={aadhaarData.kyc_vs_pincode}
              disabled
              className="mb-4"
              isMatched={valuesMatch("pincode")}
            />

            <FloatingInput
              name="aadhaar-district"
              label="District"
              value={aadhaarData.kyc_vs_district}
              disabled
              className="mb-4"
              isMatched={valuesMatch("district")}
            />

            <FloatingInput
              name="aadhaar-country"
              label="Country"
              value={aadhaarData.kyc_vs_country}
              disabled
              className="mb-4"
              isMatched={valuesMatch("country")}
            />

            <FloatingInput
              name="aadhaar-city"
              label="City"
              value={aadhaarData.kyc_vs_city}
              disabled
              className="mb-4"
              showToggle={true}
              onToggle={() => toggleFieldValue("city")}
              useAadhaarValue={useAadhaarValues.city}
              isMatched={valuesMatch("city")}
            />

            <FloatingInput
              name="aadhaar-state"
              label="State"
              value={aadhaarData.kyc_vs_state}
              disabled
              className="mb-4"
              isMatched={valuesMatch("state")}
            />
          </div>
        </div>

        {/* CBS Details Section - Editable */}
        <div className="details-section cbs-section">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">CBS Details</h2>
            {/* <div className="flex items-center">
              <input
                type="checkbox"
                id="syncAll"
                checked={allFieldsUsingAadhaar}
                onChange={(e) => toggleAllFields(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="syncAll">Sync All</label>
            </div> */}
          </div>
          <img
            src={userphoto}
            width={'100px'}
            height={'100px'}
            alt="Customer Photo"
            className=" border-2 rounded-lg mb-5"
          />
          <div className="section-content grid grid-cols-3 gap-4">
            <FloatingInput
              name="cbs-salutation"
              label="Salutation"
              value={cbsData.kyc_cbs_salutation}
              onChange={(value) => handleCbsChange("kyc_vscbs_salutation", value)}
              required
              isMatched={valuesMatch("salutation")}
            />

            <FloatingInput
              name="cbs-middleName"
              label="Middle Name"
              value={cbsData.kyc_cbs_middle_name}
              onChange={(value) => handleCbsChange("kyc_vscbs_middle_name", value)}
              isMatched={valuesMatch("middle_name")}
            />

            <FloatingInput
              name="cbs-firstName"
              label="First Name"
              value={cbsData.kyc_cbs_first_name}
              onChange={(value) => handleCbsChange("kyc_vscbs_first_name", value)}
              required
              isMatched={valuesMatch("first_name")}
            />

            <FloatingInput
              name="cbs-lastName"
              label="Last Name"
              value={cbsData.kyc_cbs_last_name}
              onChange={(value) => handleCbsChange("kyc_vscbs_last_name", value)}
              required
              isMatched={valuesMatch("last_name")}
            />

            <FloatingInput
              name="cbs-dob"
              label="DOB"
              value={cbsData.kyc_cbs_date_of_birth}
              onChange={(value) => handleCbsChange("kyc_vscbs_date_of_birth", value)}
              required
              isMatched={valuesMatch("date_of_birth")}
            />

            <FloatingInput
              name="cbs-gender"
              label="Gender"
              value={cbsData.kyc_cbs_gender}
              onChange={(value) => handleCbsChange("kyc_vscbs_gender", value)}
              required
              isMatched={valuesMatch("gender")}
            />

            <FloatingInput
              name="cbs-mobileNo"
              label="Mobile No"
              value={cbsData.kyc_cbs_mobile_no}
              onChange={(value) => handleCbsChange("kyc_vscbs_mobile_no", value)}
              required
              isMatched={valuesMatch("mobile_no")}
            />

            <FloatingInput
              name="cbs-flatNo"
              label="Flat No./Bldg Name"
              value={cbsData.kyc_cbs_flat_no}
              onChange={(value) => handleCbsChange("kyc_vscbs_flat_no", value)}
              required
              showToggle={true}
              onToggle={() => toggleFieldValue("flat_no")}
              useAadhaarValue={useAadhaarValues.flat_no}
              isMatched={valuesMatch("flat_no")}
            />

            <FloatingInput
              name="cbs-complexName"
              label="Complex Name"
              value={cbsData.kyc_cbs_complex_name}
              onChange={(value) => handleCbsChange("kyc_vscbs_complex_name", value)}
              required
              isMatched={valuesMatch("complex_name")}
            />

            <FloatingInput
              name="cbs-landmark"
              label="Nearby Landmark"
              value={cbsData.kyc_cbs_lankmark}
              onChange={(value) => handleCbsChange("kyc_vscbs_lankmark", value)}
              required
              showToggle={true}
              onToggle={() => toggleFieldValue("lankmark")}
              useAadhaarValue={useAadhaarValues.lankmark}
              isMatched={valuesMatch("lankmark")}
            />

            <FloatingInput
              name="cbs-area"
              label="Area"
              value={cbsData.kyc_cbs_area}
              onChange={(value) => handleCbsChange("kyc_vscbs_area", value)}
              required
              showToggle={true}
              onToggle={() => toggleFieldValue("area")}
              useAadhaarValue={useAadhaarValues.area}
              isMatched={valuesMatch("area")}
            />

            <FloatingInput
              name="cbs-pinCode"
              label="Pin Code"
              value={cbsData.kyc_cbs_pincode}
              onChange={(value) => handleCbsChange("kyc_vscbs_pincode", value)}
              required
              isMatched={valuesMatch("pincode")}
            />

            <FloatingInput
              name="cbs-district"
              label="District"
              value={cbsData.kyc_cbs_district}
              onChange={(value) => handleCbsChange("kyc_vscbs_district", value)}
              required
              isMatched={valuesMatch("district")}
            />

            <FloatingInput
              name="cbs-country"
              label="Country"
              value={cbsData.kyc_cbs_country}
              onChange={(value) => handleCbsChange("kyc_vscbs_country", value)}
              required
              isMatched={valuesMatch("country")}
            />

            <FloatingInput
              name="cbs-city"
              label="City"
              value={cbsData.kyc_cbs_city}
              onChange={(value) => handleCbsChange("kyc_vscbs_city", value)}
              required
              showToggle={true}
              onToggle={() => toggleFieldValue("city")}
              useAadhaarValue={useAadhaarValues.city}
              isMatched={valuesMatch("city")}
            />

            <FloatingInput
              name="cbs-state"
              label="State"
              value={cbsData.kyc_cbs_state}
              onChange={(value) => handleCbsChange("kyc_vscbs_state", value)}
              required
              isMatched={valuesMatch("state")}
            />
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="next-back-btns z-10">
          <CommonButton className="btn-back border-0" onClick={prevStep}>
            <i className="bi bi-chevron-double-left"></i>&nbsp;Back
          </CommonButton>
          <CommonButton className="btn-next border-0" onClick={handelSubmit}>
            Next&nbsp;<i className="bi bi-chevron-double-right"></i>
          </CommonButton>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsPage;


























// import React, { useState } from "react";
// import clsx from "clsx";
// import CommanInput from '../../components/CommanInput';
// import CommonButton from '../../components/CommonButton';
// import labels from '../../components/labels';
// import { pre } from 'framer-motion/client';
// import { kycService } from '../../services/apiServices';
// import userphoto from '../../assets/imgs/user_avatar.jpg';
// import Swal from 'sweetalert2';

// const FloatingInput = ({
//   name,
//   type = "text",
//   value,
//   onChange,
//   label,
//   required = false,
//   error = false,
//   touched = false,
//   errorMessage = "",
//   disabled = false,
//   max,
//   className = "",
//   showToggle = false,
//   onToggle = () => {},
//   useAadhaarValue = false,
//   ...rest
// }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const shouldFloat = isFocused || value;

//   const handleBlur = (e) => {
//     setIsFocused(false);
//     if (rest.onBlur) rest.onBlur(e);
//   };

//   const handleChange = (e) => {
//     onChange(e.target.value);
//     if (rest.onChange) rest.onChange(e);
//   };

//   return (
//     <div
//       className={clsx(
//         "floating-input-height relative w-full border border-gray-300 dark:border-gray-700 rounded-md",
//         className
//       )}
//     >
//       <input
//         id={name}
//         name={name}
//         type={type}
//         value={value}
//         onChange={handleChange}
//         onFocus={() => setIsFocused(true)}
//         onBlur={handleBlur}
//         required={required}
//         className={clsx(
//           "peer block w-full bg-transparent px-4 py-2 text-sm rounded-md",
//           " transition-all ",
//           {
//             "border-red-500": error && touched,
//           }
//         )}
//         placeholder={label}
//         maxLength={max}
//         disabled={disabled}
//         {...rest}
//       />
//       <label
//         htmlFor={name}
//         className={clsx(
//           "absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-300 transition-all duration-200 pointer-events-none",
//           {
//             "bg-white dark:bg-gray-900 px-1 text-xs -translate-y-4":
//               shouldFloat,
//             "bg-white dark:bg-gray-900 w-9/12 text-gray-500 dark:text-gray-200 translate-y-0.5":
//               !shouldFloat,
//           }
//         )}
//       >
//         {label}
//         {required && <span className="text-red-500 ml-0.5">*</span>}
//       </label>

//       {showToggle && (
//         <button
//           className="absolute right-3 top-2 bg-gray-200 px-2 py-1 rounded text-xs"
//           onClick={onToggle}
//           type="button"
//         >
//           {useAadhaarValue ? "←" : "→"}
//         </button>
//       )}

//       {error && touched && (
//         <p className="mt-1 text-xs text-red-500">
//           {label} : {errorMessage || error}
//         </p>
//       )}
//     </div>
//   );
// };

// const CustomerDetailsPage = ({ formData, handleChange, subProgress, nextStep, prevStep, kycApplicationId }) => {
//   const application_id = localStorage.getItem('application_id');
  
//   const [aadhaarData] = useState({
//     kyc_vs_salutation: "Mrs",
//     kyc_vs_middle_name: "Subhash",
//     kyc_vs_first_name: "Sushant",
//     kyc_vs_last_name: "Nikam",
//     kyc_vs_date_of_birth: "1992-12-12",
//     kyc_vs_mobile_no: "8433843848",
//     kyc_vs_flat_no: "Kalpgreen G4/106/01",
//     kyc_vs_lankmark: "Kattap Pada, Kulgoan",
//     kyc_vs_pincode: "42IS03",
//     kyc_vs_district: "Thane",
//     kyc_vs_gender: "Male",
//     kyc_vs_complex_name: "Kalpcity Phase 2",
//     kyc_vs_area: "Near Old Petrol Pump",
//     kyc_vs_country: "India",
//     kyc_vs_city: "Badlapur",
//     kyc_vs_state: "Maharashtra",
//   });

//   // CBS data (right side) - editable
//   const [cbsData, setCbsData] = useState({
//     kyc_cbs_salutation: "Mrs",
//     kyc_cbs_middle_name: "Subhash",
//     kyc_cbs_first_name: "Sushant",
//     kyc_cbs_last_name: "Nikam",
//     kyc_cbs_date_of_birth: "1992-12-12",
//     kyc_cbs_mobile_no: "8433843848",
//     kyc_cbs_flat_no: "Kalpgreen G4/106/01",
//     kyc_cbs_lankmark: "Kattap Pada, Kulgoan",
//     kyc_cbs_pincode: "42IS03",
//     kyc_cbs_district: "Thane",
//     kyc_cbs_gender: "Male",
//     kyc_cbs_complex_name: "Kalpcity Phase 2",
//     kyc_cbs_area: "Near Old Petrol Pump",
//     kyc_cbs_country: "India",
//     kyc_cbs_city: "Badlapur",
//     kyc_cbs_state: "Maharashtra",
//   });

//   // After VS CBS data - will store modified CBS data
//   const [afterVsCbsData, setAfterVsCbsData] = useState({
//     kyc_vscbs_salutation: "Mrs",
//     kyc_vscbs_middle_name: "Subhash",
//     kyc_vscbs_first_name: "Sushant",
//     kyc_vscbs_last_name: "Nikam",
//     kyc_vscbs_date_of_birth: "1995-12-12",
//     kyc_vscbs_mobile_no: "8433843848",
//     kyc_vscbs_flat_no: "Kalpgreen G4/106/01",
//     kyc_vscbs_lankmark: "Kattap Pada, Kulgoan",
//     kyc_vscbs_pincode: "42IS03",
//     kyc_vscbs_district: "Thane",
//     kyc_vscbs_gender: "Male",
//     kyc_vscbs_complex_name: "Kalpcity Phase 2",
//     kyc_vscbs_area: "Near Old Petrol Pump",
//     kyc_vscbs_country: "India",
//     kyc_vscbs_city: "Badlapur",
//     kyc_vscbs_state: "Maharashtra",
//     status: "Pending"
//   });

//   // Fields that can be toggled between Aadhaar and CBS values
//   const [useAadhaarValues, setUseAadhaarValues] = useState({
//     flatNo: false,
//     area: false,
//     landmark: false,
//     city: false,
//   });

//   // Toggle between Aadhaar and CBS values for a field
//   const toggleFieldValue = (field) => {
//     setUseAadhaarValues(prev => ({
//       ...prev,
//       [field]: !prev[field]
//     }));
    
//     // Update the afterVsCbsData with the toggled value
//     setAfterVsCbsData(prev => ({
//       ...prev,
//       [`kyc_vscbs_${field.toLowerCase()}`]: 
//         !useAadhaarValues[field] 
//           ? aadhaarData[`kyc_vs_${field.toLowerCase()}`] 
//           : cbsData[`kyc_cbs_${field.toLowerCase()}`]
//     }));
//   };

//   // Handle changes to CBS data
//   const handleCbsChange = (field, value) => {
//     const cbsField = field.replace('kyc_vscbs_', 'kyc_cbs_');
//     const newCbsData = {
//       ...cbsData,
//       [cbsField]: value
//     };
    
//     setCbsData(newCbsData);
    
//     // Update afterVsCbsData if the field is not toggled to use Aadhaar value
//     const fieldName = field.replace('kyc_vscbs_', '');
//     if (!useAadhaarValues[fieldName]) {
//       setAfterVsCbsData(prev => ({
//         ...prev,
//         [field]: value
//       }));
//     }
//   };

//   const handelSubmit = async () => {
//     const payload = {
//       kyc_application_id: application_id,
//       from_verify_sources: aadhaarData,     // Aadhaar data goes to kyc_data_from_verify_sources
//       from_verify_cbs: cbsData,             // Original CBS data goes to kyc_data_from_verify_cbs
//       after_vs_cbs: afterVsCbsData,         // Modified data (including toggled fields) goes to kyc_data_after_vs_cbs
//     };
//     console.log('Data to send back : ', payload)
    
//     try {
//       const response = await kycService.saveAllKycData(payload);
//       console.log('KYC Data Saved:', response.data);
//            Swal.fire({
//                 icon: 'success',
//                 title: `Form Submitted`,
//                 showConfirmButton: false,
//                 timer: 1500
//               });
//       nextStep();
//     } catch (error) {
//       console.error('Error saving KYC data:', error);
//     }
//   };

//   // Check if a field's Aadhaar and CBS values match
//   const valuesMatch = (field) => {
//     const aadhaarField = `kyc_vs_${field}`;
//     const cbsField = `kyc_cbs_${field}`;
//     return aadhaarData[aadhaarField] === cbsData[cbsField];
//   };

//   return (
//     <div className="customer-details-container">
//       <h1 className="text-xl font-bold flex justify-between text-gray-800 mb-6">
//         Customer Details
//         {/* <small className="text-gray-500">
//           <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" /> Select all
//         </small> */}
//       </h1>
//       <div className="details-sections">
//         {/* Aadhaar Details Section - Uneditable */}
//         <div className="details-section aadhaar-section">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">
//             Aadhaar Details
//           </h2>
//           <img
//             src={userphoto}
//             width={'100px'}
//             height={'100px'}
//             alt="Customer Photo"
//             className=" border-2 rounded-lg mb-5"
//           />
//           <div className="section-content grid grid-cols-3 gap-4">
//             <FloatingInput
//               name="aadhaar-salutation"
//               label="Salutation"
//               value={aadhaarData.kyc_vs_salutation}
//               disabled
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-middleName"
//               label="Middle Name"
//               value={aadhaarData.kyc_vs_middle_name}
//               disabled
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-firstName"
//               label="First Name"
//               value={aadhaarData.kyc_vs_first_name}
//               disabled
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-lastName"
//               label="Last Name"
//               value={aadhaarData.kyc_vs_last_name}
//               disabled
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-dob"
//               label="DOB"
//               value={aadhaarData.kyc_vs_date_of_birth}
//               disabled
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-gender"
//               label="Gender"
//               value={aadhaarData.kyc_vs_gender}
//               disabled
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-mobileNo"
//               label="Mobile No"
//               value={aadhaarData.kyc_vs_mobile_no}
//               disabled
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-flatNo"
//               label="Flat No./Bldg Name"
//               value={aadhaarData.kyc_vs_flat_no}
//               disabled
//               className="mb-4"
//               showToggle={true}
//               onToggle={() => toggleFieldValue("flatNo")}
//               useAadhaarValue={useAadhaarValues.flatNo}
//             />

//             <FloatingInput
//               name="aadhaar-complexName"
//               label="Complex Name"
//               value={aadhaarData.kyc_vs_complex_name}
//               disabled
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-landmark"
//               label="Nearby Landmark"
//               value={aadhaarData.kyc_vs_lankmark}
//               disabled
//               className="mb-4"
//               showToggle={true}
//               onToggle={() => toggleFieldValue("landmark")}
//               useAadhaarValue={useAadhaarValues.landmark}
//             />

//             <FloatingInput
//               name="aadhaar-area"
//               label="Area"
//               value={aadhaarData.kyc_vs_area}
//               disabled
//               className="mb-4"
//               showToggle={true}
//               onToggle={() => toggleFieldValue("area")}
//               useAadhaarValue={useAadhaarValues.area}
//             />

//             <FloatingInput
//               name="aadhaar-pinCode"
//               label="Pin Code"
//               value={aadhaarData.kyc_vs_pincode}
//               disabled
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-district"
//               label="District"
//               value={aadhaarData.kyc_vs_district}
//               disabled
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-country"
//               label="Country"
//               value={aadhaarData.kyc_vs_country}
//               disabled
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-city"
//               label="City"
//               value={aadhaarData.kyc_vs_city}
//               disabled
//               className="mb-4"
//               showToggle={true}
//               onToggle={() => toggleFieldValue("city")}
//               useAadhaarValue={useAadhaarValues.city}
//             />

//             <FloatingInput
//               name="aadhaar-state"
//               label="State"
//               value={aadhaarData.kyc_vs_state}
//               disabled
//               className="mb-4"
//             />
//           </div>
//         </div>

//         {/* CBS Details Section - Editable */}
//         <div className="details-section cbs-section">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">
//             CBS Details
//           </h2>
//           <img
//             src={userphoto}
//             width={'100px'}
//             height={'100px'}
//             alt="Customer Photo"
//             className=" border-2 rounded-lg mb-5"
//           />
//           <div className="section-content grid grid-cols-3 gap-4">
//             {/* Editable fields for CBS */}
//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-salutation"
//                 label="Salutation"
//                 value={cbsData.kyc_cbs_salutation}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_salutation", value)}
//                 required
//               />
//               {valuesMatch("salutation") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-middleName"
//                 label="Middle Name"
//                 value={cbsData.kyc_cbs_middle_name}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_middle_name", value)}
//               />
//               {valuesMatch("middle_name") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-firstName"
//                 label="First Name"
//                 value={cbsData.kyc_cbs_first_name}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_first_name", value)}
//                 required
//               />
//               {valuesMatch("first_name") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-lastName"
//                 label="Last Name"
//                 value={cbsData.kyc_cbs_last_name}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_last_name", value)}
//                 required
//               />
//               {valuesMatch("last_name") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-dob"
//                 label="DOB"
//                 value={cbsData.kyc_cbs_date_of_birth}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_date_of_birth", value)}
//                 required
//               />
//               {valuesMatch("date_of_birth") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-gender"
//                 label="Gender"
//                 value={cbsData.kyc_cbs_gender}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_gender", value)}
//                 required
//               />
//               {valuesMatch("gender") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-mobileNo"
//                 label="Mobile No"
//                 value={cbsData.kyc_cbs_mobile_no}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_mobile_no", value)}
//                 required
//               />
//               {valuesMatch("mobile_no") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-flatNo"
//                 label="Flat No./Bldg Name"
//                 value={useAadhaarValues.flatNo ? aadhaarData.kyc_vs_flat_no : cbsData.kyc_cbs_flat_no}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_flat_no", value)}
//                 required
//               />
//               {valuesMatch("flat_no") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-complexName"
//                 label="Complex Name"
//                 value={cbsData.kyc_cbs_complex_name}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_complex_name", value)}
//                 required
//               />
//               {valuesMatch("complex_name") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-landmark"
//                 label="Nearby Landmark"
//                 value={useAadhaarValues.landmark ? aadhaarData.kyc_vs_lankmark : cbsData.kyc_cbs_lankmark}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_lankmark", value)}
//                 required
//               />
//               {valuesMatch("lankmark") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-area"
//                 label="Area"
//                 value={useAadhaarValues.area ? aadhaarData.kyc_vs_area : cbsData.kyc_cbs_area}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_area", value)}
//                 required
//               />
//               {valuesMatch("area") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-pinCode"
//                 label="Pin Code"
//                 value={cbsData.kyc_cbs_pincode}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_pincode", value)}
//                 required
//               />
//               {valuesMatch("pincode") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-district"
//                 label="District"
//                 value={cbsData.kyc_cbs_district}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_district", value)}
//                 required
//               />
//               {valuesMatch("district") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-country"
//                 label="Country"
//                 value={cbsData.kyc_cbs_country}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_country", value)}
//                 required
//               />
//               {valuesMatch("country") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-city"
//                 label="City"
//                 value={useAadhaarValues.city ? aadhaarData.kyc_vs_city : cbsData.kyc_cbs_city}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_city", value)}
//                 required
//               />
//               {valuesMatch("city") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-state"
//                 label="State"
//                 value={cbsData.kyc_cbs_state}
//                 onChange={(value) => handleCbsChange("kyc_vscbs_state", value)}
//                 required
//               />
//               {valuesMatch("state") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Navigation Buttons */}
//         <div className="next-back-btns z-10">
//           <CommonButton className="btn-back border-0" onClick={prevStep}>
//             <i className="bi bi-chevron-double-left"></i>&nbsp;Back
//           </CommonButton>
//           <CommonButton className="btn-next border-0" onClick={handelSubmit}>
//             Next&nbsp;<i className="bi bi-chevron-double-right"></i>
//           </CommonButton>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerDetailsPage;














  