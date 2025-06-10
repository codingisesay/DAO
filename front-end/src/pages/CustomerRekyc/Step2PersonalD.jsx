
import React, { useState } from "react";
import clsx from "clsx";
import CommanInput from '../../components/CommanInput';
import CommonButton from '../../components/CommonButton';
import labels from '../../components/labels';
import { pre } from 'framer-motion/client';
import { kycService } from '../../services/apiServices';

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
        {required && <span className="text-red-500 ml-0.5">*</span>}
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

const CustomerDetailsPage = ({ formData, handleChange, updateProgress, subProgress, nextStep, prevStep, kycApplicationId }) => {
  const application_id = localStorage.getItem('application_id');
  
 const [aadhaarData] = useState({
  kyc_vs_salutation: "Mrs",
  kyc_vs_middle_name: "Subhash",
  kyc_vs_first_name: "Sushant",
  kyc_vs_last_name: "Nikam",
  kyc_vs_date_of_birth: "29/01/1992",
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
  kyc_cbs_date_of_birth: "29/01/1992",
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
    ...cbsData,
    
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
        status:"Pending"
  });

  // Fields that can be toggled between Aadhaar and CBS values
  const [useAadhaarValues, setUseAadhaarValues] = useState({
    flatNo: false,
    area: false,
    landmark: false,
    city: false,
  });

  // Toggle between Aadhaar and CBS values for a specific field
  const toggleFieldValue = (field) => {
    setUseAadhaarValues((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    
    // Update the afterVsCbsData when toggling
    setAfterVsCbsData(prev => ({
      ...prev,
      [field]: useAadhaarValues[field] ? cbsData[field] : aadhaarData[field]
    }));
  };

  // Get the displayed value for a field (either from Aadhaar or CBS)
  const getDisplayedValue = (field) => {
    return useAadhaarValues[field] ? aadhaarData[field] : cbsData[field];
  };

  // Check if a field's Aadhaar and CBS values match
  const valuesMatch = (field) => {
    return aadhaarData[field] === cbsData[field];
  };

  // Handle changes to CBS data
  const handleCbsChange = (field, value) => {
    const newCbsData = {
      ...cbsData,
      [field]: value
    };
    
    setCbsData(newCbsData);
    
    // Update afterVsCbsData if the field is not toggled to use Aadhaar value
    if (!useAadhaarValues[field]) {
      setAfterVsCbsData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handelSubmit = async () => {
    const payload = {
      kyc_application_id: application_id,
      from_verify_sources:  aadhaarData,     // Aadhaar data goes to kyc_data_from_verify_sources
      from_verify_cbs: cbsData,             // Original CBS data goes to kyc_data_from_verify_cbs
      after_vs_cbs: afterVsCbsData,         // Modified data (including toggled fields) goes to kyc_data_after_vs_cbs
    };
    
    try {
      const response = await kycService.saveAllKycData(payload);
      console.log('KYC Data Saved:', response.data);
      nextStep();
    } catch (error) {
      console.error('Error saving KYC data:', error);
    }
  };

  return (
    <div className="customer-details-container">
      <h1 className="text-2xl font-bold flex justify-between text-gray-800 mb-6">
        Customer Details
        <small className="text-gray-500">
            <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" /> Select all
        </small>
      </h1>
<div className="details-sections">
  {/* Aadhaar Details Section - Uneditable */}
  <div className="details-section aadhaar-section">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">
      Aadhaar Details
    </h2>
    <img
      src=""
      width={'100px'}
      height={'100px'}
      alt="Customer Photo"
      className=" border-2 rounded-lg mb-5"
    />
    <div className="section-content grid grid-cols-3 gap-4">
      <FloatingInput
        name="aadhaar-salutation"
        label="Salutation*"
        value={aadhaarData.kyc_vs_salutation}
        disabled
        className="mb-4"
      />

      <FloatingInput
        name="aadhaar-middleName"
        label="Middle Name"
        value={aadhaarData.kyc_vs_middle_name}
        disabled
        className="mb-4"
      />

      <FloatingInput
        name="aadhaar-firstName"
        label="First Name*"
        value={aadhaarData.kyc_vs_first_name}
        disabled
        className="mb-4"
      />

      <FloatingInput
        name="aadhaar-lastName"
        label="Last Name*"
        value={aadhaarData.kyc_vs_last_name}
        disabled
        className="mb-4"
      />

      <FloatingInput
        name="aadhaar-dob"
        label="DOB*"
        value={aadhaarData.kyc_vs_date_of_birth}
        disabled
        className="mb-4"
      />

      <FloatingInput
        name="aadhaar-gender"
        label="Gender*"
        value={aadhaarData.kyc_vs_gender}
        disabled
        className="mb-4"
      />

      <FloatingInput
        name="aadhaar-mobileNo"
        label="Mobile No*"
        value={aadhaarData.kyc_vs_mobile_no}
        disabled
        className="mb-4"
      />

      <FloatingInput
        name="aadhaar-flatNo"
        label="Flat No./Bldg Name*"
        value={aadhaarData.kyc_vs_flat_no}
        disabled
        className="mb-4"
      />

      <FloatingInput
        name="aadhaar-complexName"
        label="Complex Name*"
        value={aadhaarData.kyc_vs_complex_name}
        disabled
        className="mb-4"
      />

      <FloatingInput
        name="aadhaar-landmark"
        label="Nearby Landmark*"
        value={aadhaarData.kyc_vs_lankmark}
        disabled
        className="mb-4"
      />

      <FloatingInput
        name="aadhaar-area"
        label="Area*"
        value={aadhaarData.kyc_vs_area}
        disabled
        className="mb-4"
      />

      <FloatingInput
        name="aadhaar-pinCode"
        label="Pin Code*"
        value={aadhaarData.kyc_vs_pincode}
        disabled
        className="mb-4"
      />

      <FloatingInput
        name="aadhaar-district"
        label="District*"
        value={aadhaarData.kyc_vs_district}
        disabled
        className="mb-4"
      />

      <FloatingInput
        name="aadhaar-country"
        label="Country*"
        value={aadhaarData.kyc_vs_country}
        disabled
        className="mb-4"
      />

      <FloatingInput
        name="aadhaar-city"
        label="City*"
        value={aadhaarData.kyc_vs_city}
        disabled
        className="mb-4"
      />

      <FloatingInput
        name="aadhaar-state"
        label="State*"
        value={aadhaarData.kyc_vs_state}
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
      src=""
      width={'100px'}
      height={'100px'}
      alt="Customer Photo"
      className=" border-2 rounded-lg mb-5"
    />
    <div className="section-content grid grid-cols-3 gap-4">
      {/* Editable fields for CBS */}
      <div className="relative mb-4">
        <FloatingInput
          name="cbs-salutation"
          label="Salutation*"
          value={cbsData.kyc_cbs_salutation}
          onChange={(value) => handleCbsChange("kyc_vscbs_salutation", value)}
          required
        />
        {valuesMatch("salutation") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>

      <div className="relative mb-4">
        <FloatingInput
          name="cbs-middleName"
          label="Middle Name"
          value={cbsData.kyc_cbs_middle_name}
          onChange={(value) => handleCbsChange("kyc_vscbs_middle_name", value)}
        />
        {valuesMatch("middleName") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>

      <div className="relative mb-4">
        <FloatingInput
          name="cbs-firstName"
          label="First Name*"
          value={cbsData.kyc_cbs_first_name}
          onChange={(value) => handleCbsChange("kyc_vscbs_first_name", value)}
          required
        />
        {valuesMatch("firstName") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>

      <div className="relative mb-4">
        <FloatingInput
          name="cbs-lastName"
          label="Last Name*"
          value={cbsData.kyc_cbs_last_name}
          onChange={(value) => handleCbsChange("kyc_vscbs_last_name", value)}
          required
        />
        {valuesMatch("lastName") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>

      <div className="relative mb-4">
        <FloatingInput
          name="cbs-dob"
          label="DOB*"
          value={cbsData.kyc_cbs_date_of_birth}
          onChange={(value) => handleCbsChange("kyc_vscbs_date_of_birth", value)}
          required
        />
        {valuesMatch("dob") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>

      <div className="relative mb-4">
        <FloatingInput
          name="cbs-gender"
          label="Gender*"
          value={cbsData.kyc_cbs_gender}
          onChange={(value) => handleCbsChange("kyc_vscbs_gender", value)}
          required
        />
        {valuesMatch("gender") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>

      <div className="relative mb-4">
        <FloatingInput
          name="cbs-mobileNo"
          label="Mobile No*"
          value={cbsData.kyc_cbs_mobile_no}
          onChange={(value) => handleCbsChange("kyc_vscbs_mobile_no", value)}
          required
        />
        {valuesMatch("mobileNo") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>

      <div className="relative mb-4">
        <FloatingInput
          name="cbs-flatNo"
          label="Flat No./Bldg Name*"
          value={cbsData.kyc_cbs_flat_no}
          onChange={(value) => handleCbsChange("kyc_vscbs_flat_no", value)}
          required
        />
        {valuesMatch("flatNo") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>

      <div className="relative mb-4">
        <FloatingInput
          name="cbs-complexName"
          label="Complex Name*"
          value={cbsData.kyc_cbs_complex_name}
          onChange={(value) => handleCbsChange("kyc_vscbs_complex_name", value)}
          required
        />
        {valuesMatch("complexName") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>

      <div className="relative mb-4">
        <FloatingInput
          name="cbs-landmark"
          label="Nearby Landmark*"
          value={cbsData.kyc_cbs_lankmark}
          onChange={(value) => handleCbsChange("kyc_vscbs_lankmark", value)}
          required
        />
        {valuesMatch("landmark") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>

      <div className="relative mb-4">
        <FloatingInput
          name="cbs-area"
          label="Area*"
          value={cbsData.kyc_cbs_area}
          onChange={(value) => handleCbsChange("kyc_vscbs_area", value)}
          required
        />
        {valuesMatch("area") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>

      <div className="relative mb-4">
        <FloatingInput
          name="cbs-pinCode"
          label="Pin Code*"
          value={cbsData.kyc_cbs_pincode}
          onChange={(value) => handleCbsChange("kyc_vscbs_pincode", value)}
          required
        />
        {valuesMatch("pincode") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>

      <div className="relative mb-4">
        <FloatingInput
          name="cbs-district"
          label="District*"
          value={cbsData.kyc_cbs_district}
          onChange={(value) => handleCbsChange("kyc_vscbs_district", value)}
          required
        />
        {valuesMatch("district") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>

      <div className="relative mb-4">
        <FloatingInput
          name="cbs-country"
          label="Country*"
          value={cbsData.kyc_cbs_country}
          onChange={(value) => handleCbsChange("kyc_vscbs_country", value)}
          required
        />
        {valuesMatch("country") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>

      <div className="relative mb-4">
        <FloatingInput
          name="cbs-city"
          label="City*"
          value={cbsData.kyc_cbs_city}
          onChange={(value) => handleCbsChange("kyc_vscbs_city", value)}
          required
        />
        {valuesMatch("city") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>

      <div className="relative mb-4">
        <FloatingInput
          name="cbs-state"
          label="State*"
          value={cbsData.kyc_cbs_state}
          onChange={(value) => handleCbsChange("kyc_vscbs_state", value)}
          required
        />
        {valuesMatch("state") ? (
          <span className="absolute right-2 top-3 text-green-500">✓</span>
        ) : (
          <span className="absolute right-2 top-3 text-red-500">✗</span>
        )}
      </div>
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
// import { kycService } from '../../services/apiServices'; // Add this import

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
//           className="absolute right-8 top-2 bg-gray-200 px-2 py-1 rounded text-xs"
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

// const   CustomerDetailsPage = ({ formData, handleChange, updateProgress, subProgress, nextStep, prevStep, kycApplicationId }) => {
//   // Aadhaar data (left side)
  
//   const application_id=localStorage.getItem('application_id');
//   const [aadhaarData, setAadhaarData] = useState({
//     salutation: "Mrs",
//     middleName: "Subhash",
//     firstName: "Sushant",
//     lastName: "Nikam",
//     dob: "29/01/1992",
//     mobileNo: "8433843848",
//     flatNo: "Kalpgreen G4/106/01",
//     landmark: "Kattap Pada, Kulgoan",
//     pinCode: "42IS03",
//     district: "Thane",
//     gender: "Male",
//     complexName: "Kalpcity Phase 2",
//     area: "Near Old Petrol Pump",
//     country: "India",
//     city: "Badlapur",
//     state: "Maharashtra",
//   });

//   // CBS data (right side)
//   const [cbsData, setCbsData] = useState({
//     salutation: "Mrs",
//     middleName: "Subhash",
//     firstName: "Sushant",
//     lastName: "Nikam",
//     dob: "29/01/1992",
//     mobileNo: "8433843848",
//     flatNo: "Kalpgreen G4/106/01",
//     landmark: "Kattap Pada, Kulgoan",
//     pinCode: "42IS03",
//     district: "Thane",
//     gender: "Male",
//     complexName: "Kalpcity Phase 2",
//     area: "Near Old Petrol Pump",
//     country: "India",
//     city: "Badlapur",
//     state: "Maharashtra",
//   });

//   // Fields that can be toggled between Aadhaar and CBS values
//   const [useAadhaarValues, setUseAadhaarValues] = useState({
//     flatNo: false,
//     area: false,
//     landmark: false,
//     city: false,
//   });

//   // Toggle between Aadhaar and CBS values for a specific field
//   const toggleFieldValue = (field) => {
//     setUseAadhaarValues((prev) => ({
//       ...prev,
//       [field]: !prev[field],
//     }));
//   };

//   // Get the displayed value for a field (either from Aadhaar or CBS)
//   const getDisplayedValue = (field) => {
//     return useAadhaarValues[field] ? aadhaarData[field] : cbsData[field];
//   };

//   // Check if a field's Aadhaar and CBS values match
//   const valuesMatch = (field) => {
//     return aadhaarData[field] === cbsData[field];
//   };

//   // Handle changes to Aadhaar data
//   const handleAadhaarChange = (field, value) => {
//     setAadhaarData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // Handle changes to CBS data
//   const handleCbsChange = (field, value) => {
//     setCbsData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };
// const handelSubmit = async () => {
//     const payload = {
//       kyc_application_id: application_id, // Make sure this is passed as a prop or available in state
//       from_verify_sources: aadhaarData,     // For kyc_data_from_verify_sources
//       from_verify_cbs: cbsData,             // For kyc_data_from_verify_cbs
//       after_vs_cbs: aadhaarData,            // For kyc_data_after_vs_cbs (use updatedData if different)
//     };
//     try {
//       const response = await kycService.saveAllKycData(payload);
//       // Handle success (show message, go to next step, etc.)
//       console.log('KYC Data Saved:', response.data);
//       nextStep();
//     } catch (error) {
//       // Handle error (show error message, etc.)
//       console.error('Error saving KYC data:', error);
//     }
//   };

//   return (
//     <div className="customer-details-container">
//       <h1 className="text-2xl font-bold flex justify-between text-gray-800 mb-6">
//         Customer Details
//         <small className="text-gray-500">
//             <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" /> Select all
//         </small>

//       </h1>

//       <div className="details-sections">
//         {/* Aadhaar Details Section */}
//         <div className="details-section aadhaar-section">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">
//             Aadhaar Details
//           </h2>
//               <img src="" width={'100px'} height={'100px'} alt="Customer Photo"  className=" border-2 rounded-lg mb-5" />
//           <div className="section-content grid grid-cols-3 gap-4">
//             <FloatingInput
//               name="aadhaar-salutation"
//               label="Salutation*"
//               value={aadhaarData.salutation}
//               onChange={(value) => handleAadhaarChange("salutation", value)}
//               required
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-middleName"
//               label="Middle Name"
//               value={aadhaarData.middleName}
//               onChange={(value) => handleAadhaarChange("middleName", value)}
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-firstName"
//               label="First Name*"
//               value={aadhaarData.firstName}
//               onChange={(value) => handleAadhaarChange("firstName", value)}
//               required
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-lastName"
//               label="Last Name*"
//               value={aadhaarData.lastName}
//               onChange={(value) => handleAadhaarChange("lastName", value)}
//               required
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-dob"
//               label="DOB*"
//               value={aadhaarData.dob}
//               onChange={(value) => handleAadhaarChange("dob", value)}
//               required
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-gender"
//               label="Gender*"
//               value={aadhaarData.gender}
//               onChange={(value) => handleAadhaarChange("gender", value)}
//               required
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-mobileNo"
//               label="Mobile No*"
//               value={aadhaarData.mobileNo}
//               onChange={(value) => handleAadhaarChange("mobileNo", value)}
//               required
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-flatNo"
//               label="Flat No./Bdig Name*"
//               value={aadhaarData.flatNo}
//               onChange={(value) => handleAadhaarChange("flatNo", value)}
//               required
//               className="mb-4"
//               showToggle={true}
//               onToggle={() => toggleFieldValue("flatNo")}
//               useAadhaarValue={useAadhaarValues.flatNo}
//             />

//             <FloatingInput
//               name="aadhaar-complexName"
//               label="Complex Name*"
//               value={aadhaarData.complexName}
//               onChange={(value) => handleAadhaarChange("complexName", value)}
//               required
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-landmark"
//               label="Nearby Landmark*"
//               value={aadhaarData.landmark}
//               onChange={(value) => handleAadhaarChange("landmark", value)}
//               required
//               className="mb-4"
//               showToggle={true}
//               onToggle={() => toggleFieldValue("landmark")}
//               useAadhaarValue={useAadhaarValues.landmark}
//             />

//             <FloatingInput
//               name="aadhaar-area"
//               label="Area*"
//               value={aadhaarData.area}
//               onChange={(value) => handleAadhaarChange("area", value)}
//               required
//               className="mb-4"
//               showToggle={true}
//               onToggle={() => toggleFieldValue("area")}
//               useAadhaarValue={useAadhaarValues.area}
//             />

//             <FloatingInput
//               name="aadhaar-pinCode"
//               label="Pin Code*"
//               value={aadhaarData.pinCode}
//               onChange={(value) => handleAadhaarChange("pinCode", value)}
//               required
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-district"
//               label="District*"
//               value={aadhaarData.district}
//               onChange={(value) => handleAadhaarChange("district", value)}
//               required
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-country"
//               label="Country*"
//               value={aadhaarData.country}
//               onChange={(value) => handleAadhaarChange("country", value)}
//               required
//               className="mb-4"
//             />

//             <FloatingInput
//               name="aadhaar-city"
//               label="City*"
//               value={aadhaarData.city}
//               onChange={(value) => handleAadhaarChange("city", value)}
//               required
//               className="mb-4"
//               showToggle={true}
//               onToggle={() => toggleFieldValue("city")}
//               useAadhaarValue={useAadhaarValues.city}
//             />

//             <FloatingInput
//               name="aadhaar-state"
//               label="State*"
//               value={aadhaarData.state}
//               onChange={(value) => handleAadhaarChange("state", value)}
//               required
//               className="mb-4"
//             />
//           </div>
//         </div>

//         {/* CBS Details Section */}
//         <div className="details-section cbs-section">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">
//             CBS Details
//           </h2>
//               <img src="" width={'100px'} height={'100px'} alt="Customer Photo" className=" border-2 rounded-lg mb-5" />
//           <div className="section-content grid grid-cols-3 gap-4">
//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-salutation"
//                 label="Salutation*"
//                 value={cbsData.salutation}
//                 onChange={(value) => handleCbsChange("salutation", value)}
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
//                 value={cbsData.middleName}
//                 onChange={(value) => handleCbsChange("middleName", value)}
//               />
//               {valuesMatch("middleName") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-firstName"
//                 label="First Name*"
//                 value={cbsData.firstName}
//                 onChange={(value) => handleCbsChange("firstName", value)}
//                 required
//               />
//               {valuesMatch("firstName") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-lastName"
//                 label="Last Name*"
//                 value={cbsData.lastName}
//                 onChange={(value) => handleCbsChange("lastName", value)}
//                 required
//               />
//               {valuesMatch("lastName") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-dob"
//                 label="DOB*"
//                 value={cbsData.dob}
//                 onChange={(value) => handleCbsChange("dob", value)}
//                 required
//               />
//               {valuesMatch("dob") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-gender"
//                 label="Gender*"
//                 value={cbsData.gender}
//                 onChange={(value) => handleCbsChange("gender", value)}
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
//                 label="Mobile No*"
//                 value={cbsData.mobileNo}
//                 onChange={(value) => handleCbsChange("mobileNo", value)}
//                 required
//               />
//               {valuesMatch("mobileNo") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-flatNo"
//                 label="Flat No./Bdig Name*"
//                 value={getDisplayedValue("flatNo")}
//                 onChange={(value) => handleCbsChange("flatNo", value)}
//                 required
//               />
//               {valuesMatch("flatNo") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-complexName"
//                 label="Complex Name*"
//                 value={cbsData.complexName}
//                 onChange={(value) => handleCbsChange("complexName", value)}
//                 required
//               />
//               {valuesMatch("complexName") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-landmark"
//                 label="Nearby Landmark*"
//                 value={getDisplayedValue("landmark")}
//                 onChange={(value) => handleCbsChange("landmark", value)}
//                 required
//               />
//               {valuesMatch("landmark") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-area"
//                 label="Area*"
//                 value={getDisplayedValue("area")}
//                 onChange={(value) => handleCbsChange("area", value)}
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
//                 label="Pin Code*"
//                 value={cbsData.pinCode}
//                 onChange={(value) => handleCbsChange("pinCode", value)}
//                 required
//               />
//               {valuesMatch("pinCode") ? (
//                 <span className="absolute right-2 top-3 text-green-500">✓</span>
//               ) : (
//                 <span className="absolute right-2 top-3 text-red-500">✗</span>
//               )}
//             </div>

//             <div className="relative mb-4">
//               <FloatingInput
//                 name="cbs-district"
//                 label="District*"
//                 value={cbsData.district}
//                 onChange={(value) => handleCbsChange("district", value)}
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
//                 label="Country*"
//                 value={cbsData.country}
//                 onChange={(value) => handleCbsChange("country", value)}
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
//                 label="City*"
//                 value={getDisplayedValue("city")}
//                 onChange={(value) => handleCbsChange("city", value)}
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
//                 label="State*"
//                 value={cbsData.state}
//                 onChange={(value) => handleCbsChange("state", value)}
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
        
//                 <div className="next-back-btns z-10">
//                     <CommonButton className="btn-back border-0" onClick={prevStep}>
//                     <i className="bi bi-chevron-double-left"></i>&nbsp;Back
//                 </CommonButton>
//                 <CommonButton
//                     className="btn-next border-0"
//                     onClick={handelSubmit}
//                 >
//                     Next&nbsp;<i className="bi bi-chevron-double-right"></i>
//                 </CommonButton>
//             </div>
//       </div>
//     </div>
//   );
// };

// export default CustomerDetailsPage;

