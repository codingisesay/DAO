// FloatingInput.jsx


import React, { useState, useRef } from "react";
import clsx from "clsx"; 
import CommonButton from '../../components/CommonButton';
 import userphoto from '../../assets/imgs/user_avatar.jpg';
import Swal from 'sweetalert2';
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
  disabled = false, // This prop controls the disabled state
  max,
  className = "",
  showToggle = false, // This prop controls the visibility of the toggle button
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
          "border-green-500": isMatched && !disabled, // Green border if matched AND not disabled
          "border-red-500": !isMatched && !disabled,  // Red border if NOT matched AND not disabled
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
            "cursor-not-allowed bg-gray-100 dark:bg-gray-800": disabled, // Visual indication for disabled state
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

      {/* Show toggle button only if `showToggle` is true */}
      {showToggle && (
        <button
          className="absolute right-1 top-2 ps-2 py-1 rounded text-xs fw-bold text-2xl"
          onClick={onToggle}
          type="button"
        >
          {useAadhaarValue ? "➜" : "➜"}
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
    kyc_vs_pincode: "400070",
    kyc_vs_district: "Thane",
    kyc_vs_gender: "Male",
    kyc_vs_complex_name: "Kalpcity Phase 2",
    kyc_vs_area: "Near Old Petrol Pump",
    kyc_vs_country: "India",
    kyc_vs_city: "Badlapur",
    kyc_vs_state: "Maharashtra",
  });

  const [cbsData, setCbsData] = useState({
    kyc_cbs_salutation: "Mrs",
    kyc_cbs_middle_name: "Subhash",
    kyc_cbs_first_name: "Sushant",
    kyc_cbs_last_name: "Nikam",
    kyc_cbs_date_of_birth: "1992-12-12",
    kyc_cbs_mobile_no: "8433843848",
    kyc_cbs_flat_no: "Kalpgreen G4/106/02",
    kyc_cbs_lankmark: "Kattap Pada, Kulgoana",
    kyc_cbs_pincode: "400080",
    kyc_cbs_district: "Mulund",
    kyc_cbs_gender: "Male",
    kyc_cbs_complex_name: "Kalpcity Phase 2",
    kyc_cbs_area: "Near Old Petrol Pumpa",
    kyc_cbs_country: "India",
    kyc_cbs_city: "Badlapur",
    kyc_cbs_state: "Maharashtra",
  });

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

  // List of all fields that can be toggled
  const ALL_TOGGLEABLE_FIELDS = [
    'salutation', 'middle_name', 'first_name', 'last_name', 'date_of_birth',
    'mobile_no', 'flat_no', 'lankmark', 'pincode', 'district', 'gender',
    'complex_name', 'area', 'country', 'city', 'state'
  ];

  // Initialize useAadhaarValues for all fields
  const [useAadhaarValues, setUseAadhaarValues] = useState(
    ALL_TOGGLEABLE_FIELDS.reduce((acc, field) => ({ ...acc, [field]: false }), {})
  );

  // Ref to store original CBS values for all fields before syncing with Aadhaar
  const previousCbsData = useRef(
    ALL_TOGGLEABLE_FIELDS.reduce((acc, field) => ({
      ...acc,
      [field]: cbsData[`kyc_cbs_${field}`]
    }), {})
  );

  // Toggles an individual field's value between Aadhaar and original CBS
  // const toggleFieldValue = (field) => {
  //   const newUseAadhaarValue = !useAadhaarValues[field];

  //   setUseAadhaarValues((prev) => ({
  //     ...prev,
  //     [field]: newUseAadhaarValue,
  //   }));

  //   if (newUseAadhaarValue) {
  //     // Save current CBS value before overwriting with Aadhaar value
  //     previousCbsData.current[field] = cbsData[`kyc_cbs_${field}`];
  //     setCbsData((prev) => ({
  //       ...prev,
  //       [`kyc_cbs_${field}`]: aadhaarData[`kyc_vs_${field}`],
  //     }));
  //     setAfterVsCbsData((prev) => ({ 
  //       ...prev,
  //       [`kyc_vscbs_${field}`]: aadhaarData[`kyc_vs_${field}`],
  //     }));
  //   } else {
  //     // Restore original CBS value
  //     setCbsData((prev) => ({
  //       ...prev,
  //       [`kyc_cbs_${field}`]: previousCbsData.current[field],
  //     }));
  //     setAfterVsCbsData((prev) => ({ 
  //       ...prev,
  //       [`kyc_vscbs_${field}`]: previousCbsData.current[field],
  //     }));
  //   }
  // };
const toggleFieldValue = (field) => {
  const newUseAadhaarValue = !useAadhaarValues[field];

  setUseAadhaarValues((prev) => ({
    ...prev,
    [field]: newUseAadhaarValue,
  }));

  setAfterVsCbsData((prev) => ({
    ...prev,
    [`kyc_vscbs_${field}`]: newUseAadhaarValue
      ? aadhaarData[`kyc_vs_${field}`]
      : cbsData[`kyc_cbs_${field}`],
  }));
};


  // Toggles all applicable fields to use Aadhaar values or restore original CBS values
  const toggleAllFields = (useAadhaar) => {
    if (useAadhaar) {
      // Before syncing all, save current CBS values for restoration
      ALL_TOGGLEABLE_FIELDS.forEach(field => {
        previousCbsData.current[field] = cbsData[`kyc_cbs_${field}`];
      });

      // Update all fields to use Aadhaar values
      const newUseAadhaarValuesState = {};
      const newCbsData = { ...cbsData };
      const newAfterVsCbsData = { ...afterVsCbsData };

      ALL_TOGGLEABLE_FIELDS.forEach(field => {
        newUseAadhaarValuesState[field] = true;
        newCbsData[`kyc_cbs_${field}`] = aadhaarData[`kyc_vs_${field}`];
        newAfterVsCbsData[`kyc_vscbs_${field}`] = aadhaarData[`kyc_vs_${field}`];
      });

      setUseAadhaarValues(newUseAadhaarValuesState);
      setCbsData(newCbsData);
      setAfterVsCbsData(newAfterVsCbsData);

    } else {
      // Restore original CBS values for all fields
      const newUseAadhaarValuesState = {};
      const newCbsData = { ...cbsData };
      const newAfterVsCbsData = { ...afterVsCbsData };

      ALL_TOGGLEABLE_FIELDS.forEach(field => {
        newUseAadhaarValuesState[field] = false;
        newCbsData[`kyc_cbs_${field}`] = previousCbsData.current[field];
        newAfterVsCbsData[`kyc_vscbs_${field}`] = previousCbsData.current[field];
      });
      
      setUseAadhaarValues(newUseAadhaarValuesState);
      setCbsData(newCbsData);
      setAfterVsCbsData(newAfterVsCbsData);
    }
  };

  // Checks if all toggleable fields are currently using Aadhaar values
  const allFieldsUsingAadhaar = ALL_TOGGLEABLE_FIELDS.every(
    (field) => useAadhaarValues[field]
  );

  // Checks if a field's Aadhaar and CBS values match
  const valuesMatch = (field) => {
    return aadhaarData[`kyc_vs_${field}`] === cbsData[`kyc_cbs_${field}`];
  };

  // Handles changes to CBS data, also updates afterVsCbsData
  const handleCbsChange = (field, value) => {
    const cbsField = field.replace('kyc_vscbs_', 'kyc_cbs_');
    const fieldName = field.replace('kyc_vscbs_', ''); // Extract base field name (e.g., 'flat_no')

    const newCbsData = {
      ...cbsData,
      [cbsField]: value
    };
    
    setCbsData(newCbsData);
    
    setAfterVsCbsData(prev => ({
      ...prev,
      [field]: value
    }));

    // If this field was previously synced from Aadhaar, mark it as not synced anymore
    if (useAadhaarValues[fieldName]) {
      setUseAadhaarValues(prev => ({
        ...prev,
        [fieldName]: false,
      }));
    }
  };

  const handelSubmit = async () => {
    const payload = {
      kyc_application_id: application_id,
      from_verify_sources: aadhaarData,
      from_verify_cbs: cbsData,
      after_vs_cbs: afterVsCbsData, 
    };
    console.log('Data to send back : ', payload)
    
    try {
      const response = await kycService.saveAllKycData(payload); 
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
      <h1 className="text-xl font-bold flex justify-between text-gray-800 ">
        Customer Details
        <small className="text-gray-500">
          <input 
            type="checkbox" 
            id="syncAll" 
            checked={allFieldsUsingAadhaar}
            onChange={(e) => toggleAllFields(e.target.checked)}
            className="mr-2"
          />
          Select All
        </small>
      </h1>
      <div className="details-sections">
        {/* Aadhaar Details Section - Uneditable (Always Disabled) */}
        <div className="details-section aadhaar-section">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Aadhaar Details (Source)
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
              disabled={true}
              showToggle={!valuesMatch("salutation")}
              onToggle={() => toggleFieldValue("salutation")}
              useAadhaarValue={useAadhaarValues.salutation}
              isMatched={valuesMatch("salutation")}
            />

            <FloatingInput
              name="aadhaar-firstName"
              label="First Name"
              value={aadhaarData.kyc_vs_first_name}
              disabled={true}
              showToggle={!valuesMatch("first_name")}
              onToggle={() => toggleFieldValue("first_name")}
              useAadhaarValue={useAadhaarValues.first_name}
              isMatched={valuesMatch("first_name")}
            />

            <FloatingInput
              name="aadhaar-middleName"
              label="Middle Name"
              value={aadhaarData.kyc_vs_middle_name}
              disabled={true}
              showToggle={!valuesMatch("middle_name")}
              onToggle={() => toggleFieldValue("middle_name")}
              useAadhaarValue={useAadhaarValues.middle_name}
              isMatched={valuesMatch("middle_name")}
            />

            <FloatingInput
              name="aadhaar-lastName"
              label="Last Name"
              value={aadhaarData.kyc_vs_last_name}
              disabled={true}
              showToggle={!valuesMatch("last_name")}
              onToggle={() => toggleFieldValue("last_name")}
              useAadhaarValue={useAadhaarValues.last_name}
              isMatched={valuesMatch("last_name")}
            />

            <FloatingInput
              name="aadhaar-dob"
              label="DOB"
              value={aadhaarData.kyc_vs_date_of_birth}
              disabled={true}
              showToggle={!valuesMatch("date_of_birth")}
              onToggle={() => toggleFieldValue("date_of_birth")}
              useAadhaarValue={useAadhaarValues.date_of_birth}
              isMatched={valuesMatch("date_of_birth")}
            />

            <FloatingInput
              name="aadhaar-gender"
              label="Gender"
              value={aadhaarData.kyc_vs_gender}
              disabled={true}
              showToggle={!valuesMatch("gender")}
              onToggle={() => toggleFieldValue("gender")}
              useAadhaarValue={useAadhaarValues.gender}
              isMatched={valuesMatch("gender")}
            />

            <FloatingInput
              name="aadhaar-mobileNo"
              label="Mobile No"
              value={aadhaarData.kyc_vs_mobile_no}
              disabled={true}
              showToggle={!valuesMatch("mobile_no")}
              onToggle={() => toggleFieldValue("mobile_no")}
              useAadhaarValue={useAadhaarValues.mobile_no}
              isMatched={valuesMatch("mobile_no")}
            />

            <FloatingInput
              name="aadhaar-flatNo"
              label="Flat No./Bldg Name"
              value={aadhaarData.kyc_vs_flat_no}
              disabled={true}
              showToggle={!valuesMatch("flat_no")}
              onToggle={() => toggleFieldValue("flat_no")}
              useAadhaarValue={useAadhaarValues.flat_no}
              isMatched={valuesMatch("flat_no")}
            />

            <FloatingInput
              name="aadhaar-complexName"
              label="Complex Name"
              value={aadhaarData.kyc_vs_complex_name}
              disabled={true}
              showToggle={!valuesMatch("complex_name")}
              onToggle={() => toggleFieldValue("complex_name")}
              useAadhaarValue={useAadhaarValues.complex_name}
              isMatched={valuesMatch("complex_name")}
            />

            <FloatingInput
              name="aadhaar-landmark"
              label="Nearby Landmark"
              value={aadhaarData.kyc_vs_lankmark}
              disabled={true}
              showToggle={!valuesMatch("lankmark")}
              onToggle={() => toggleFieldValue("lankmark")}
              useAadhaarValue={useAadhaarValues.lankmark}
              isMatched={valuesMatch("lankmark")}
            />

            <FloatingInput
              name="aadhaar-area"
              label="Area"
              value={aadhaarData.kyc_vs_area}
              disabled={true}
              showToggle={!valuesMatch("area")}
              onToggle={() => toggleFieldValue("area")}
              useAadhaarValue={useAadhaarValues.area}
              isMatched={valuesMatch("area")}
            />

            <FloatingInput
              name="aadhaar-pinCode"
              label="Pin Code"
              value={aadhaarData.kyc_vs_pincode}
              disabled={true}
              showToggle={!valuesMatch("pincode")}
              onToggle={() => toggleFieldValue("pincode")}
              useAadhaarValue={useAadhaarValues.pincode}
              isMatched={valuesMatch("pincode")}
            />

            <FloatingInput
              name="aadhaar-district"
              label="District"
              value={aadhaarData.kyc_vs_district}
              disabled={true}
              showToggle={!valuesMatch("district")}
              onToggle={() => toggleFieldValue("district")}
              useAadhaarValue={useAadhaarValues.district}
              isMatched={valuesMatch("district")}
            />

            <FloatingInput
              name="aadhaar-country"
              label="Country"
              value={aadhaarData.kyc_vs_country}
              disabled={true}
              showToggle={!valuesMatch("country")}
              onToggle={() => toggleFieldValue("country")}
              useAadhaarValue={useAadhaarValues.country}
              isMatched={valuesMatch("country")}
            />

            <FloatingInput
              name="aadhaar-city"
              label="City"
              value={aadhaarData.kyc_vs_city}
              disabled={true}
              showToggle={!valuesMatch("city")}
              onToggle={() => toggleFieldValue("city")}
              useAadhaarValue={useAadhaarValues.city}
              isMatched={valuesMatch("city")}
            />

            <FloatingInput
              name="aadhaar-state"
              label="State"
              value={aadhaarData.kyc_vs_state}
              disabled={true}
              showToggle={!valuesMatch("state")}
              onToggle={() => toggleFieldValue("state")}
              useAadhaarValue={useAadhaarValues.state}
              isMatched={valuesMatch("state")}
            />
          </div>
        </div>

        {/* CBS Details Section - Editable (Not Disabled) */}
        <div className="details-section cbs-section">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-0">CBS Details (Editable)</h2>
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
              onToggle={() => toggleFieldValue("salutation")}
              useAadhaarValue={useAadhaarValues.salutation}
              isMatched={valuesMatch("salutation")} 
              readOnly
            />

            <FloatingInput
              name="cbs-firstName"
              label="First Name"
              value={cbsData.kyc_cbs_first_name}
              onChange={(value) => handleCbsChange("kyc_vscbs_first_name", value)}
              required 
              onToggle={() => toggleFieldValue("first_name")}
              useAadhaarValue={useAadhaarValues.first_name}
              isMatched={valuesMatch("first_name")}
              readOnly
            />

            <FloatingInput
              name="cbs-middleName"
              label="Middle Name"
              value={cbsData.kyc_cbs_middle_name}
              onChange={(value) => handleCbsChange("kyc_vscbs_middle_name", value)} 
              onToggle={() => toggleFieldValue("middle_name")}
              useAadhaarValue={useAadhaarValues.middle_name}
              isMatched={valuesMatch("middle_name")}
              readOnly
            />

            <FloatingInput
              name="cbs-lastName"
              label="Last Name"
              value={cbsData.kyc_cbs_last_name}
              onChange={(value) => handleCbsChange("kyc_vscbs_last_name", value)}
              required 
              onToggle={() => toggleFieldValue("last_name")}
              useAadhaarValue={useAadhaarValues.last_name}
              isMatched={valuesMatch("last_name")}
              readOnly
            />

            <FloatingInput
              name="cbs-dob"
              label="DOB"
              value={cbsData.kyc_cbs_date_of_birth}
              onChange={(value) => handleCbsChange("kyc_vscbs_date_of_birth", value)}
              required 
              onToggle={() => toggleFieldValue("date_of_birth")}
              useAadhaarValue={useAadhaarValues.date_of_birth}
              isMatched={valuesMatch("date_of_birth")}
              readOnly
            />

            <FloatingInput
              name="cbs-gender"
              label="Gender"
              value={cbsData.kyc_cbs_gender}
              onChange={(value) => handleCbsChange("kyc_vscbs_gender", value)}
              required 
              onToggle={() => toggleFieldValue("gender")}
              useAadhaarValue={useAadhaarValues.gender}
              isMatched={valuesMatch("gender")}
              readOnly
            />

            <FloatingInput
              name="cbs-mobileNo"
              label="Mobile No"
              value={cbsData.kyc_cbs_mobile_no}
              onChange={(value) => handleCbsChange("kyc_vscbs_mobile_no", value)}
              required 
              onToggle={() => toggleFieldValue("mobile_no")}
              useAadhaarValue={useAadhaarValues.mobile_no}
              isMatched={valuesMatch("mobile_no")}
              readOnly
            />

            <FloatingInput
              name="cbs-flatNo"
              label="Flat No./Bldg Name"
              value={cbsData.kyc_cbs_flat_no}
              onChange={(value) => handleCbsChange("kyc_vscbs_flat_no", value)}
              required  
              onToggle={() => toggleFieldValue("flat_no")}
              useAadhaarValue={useAadhaarValues.flat_no}
              isMatched={valuesMatch("flat_no")}
              readOnly
            />

            <FloatingInput
              name="cbs-complexName"
              label="Complex Name"
              value={cbsData.kyc_cbs_complex_name}
              onChange={(value) => handleCbsChange("kyc_vscbs_complex_name", value)}
              required 
              onToggle={() => toggleFieldValue("complex_name")}
              useAadhaarValue={useAadhaarValues.complex_name}
              isMatched={valuesMatch("complex_name")}
              readOnly
            />

            <FloatingInput
              name="cbs-landmark"
              label="Nearby Landmark"
              value={cbsData.kyc_cbs_lankmark}
              onChange={(value) => handleCbsChange("kyc_vscbs_lankmark", value)}
              required  
              onToggle={() => toggleFieldValue("lankmark")}
              useAadhaarValue={useAadhaarValues.lankmark}
              isMatched={valuesMatch("lankmark")}
              readOnly
            />

            <FloatingInput
              name="cbs-area"
              label="Area"
              value={cbsData.kyc_cbs_area}
              onChange={(value) => handleCbsChange("kyc_vscbs_area", value)}
              required  
              onToggle={() => toggleFieldValue("area")}
              useAadhaarValue={useAadhaarValues.area}
              isMatched={valuesMatch("area")}
              readOnly
            />

            <FloatingInput
              name="cbs-pinCode"
              label="Pin Code"
              value={cbsData.kyc_cbs_pincode}
              onChange={(value) => handleCbsChange("kyc_vscbs_pincode", value)}
              required 
              onToggle={() => toggleFieldValue("pincode")}
              useAadhaarValue={useAadhaarValues.pincode}
              isMatched={valuesMatch("pincode")}
              readOnly
            />

            <FloatingInput
              name="cbs-district"
              label="District"
              value={cbsData.kyc_cbs_district}
              onChange={(value) => handleCbsChange("kyc_vscbs_district", value)}
              required 
              onToggle={() => toggleFieldValue("district")}
              useAadhaarValue={useAadhaarValues.district}
              isMatched={valuesMatch("district")}
              readOnly
            />

            <FloatingInput
              name="cbs-country"
              label="Country"
              value={cbsData.kyc_cbs_country}
              onChange={(value) => handleCbsChange("kyc_vscbs_country", value)}
              required 
              onToggle={() => toggleFieldValue("country")}
              useAadhaarValue={useAadhaarValues.country}
              isMatched={valuesMatch("country")}
              readOnly
            />

            <FloatingInput
              name="cbs-city"
              label="City"
              value={cbsData.kyc_cbs_city}
              onChange={(value) => handleCbsChange("kyc_vscbs_city", value)}
              required  
              onToggle={() => toggleFieldValue("city")}
              useAadhaarValue={useAadhaarValues.city}
              isMatched={valuesMatch("city")}
              readOnly
            />

            <FloatingInput
              name="cbs-state"
              label="State"
              value={cbsData.kyc_cbs_state}
              onChange={(value) => handleCbsChange("kyc_vscbs_state", value)}
              required 
              onToggle={() => toggleFieldValue("state")}
              useAadhaarValue={useAadhaarValues.state}
              isMatched={valuesMatch("state")}
              readOnly
            />
          </div>
        </div>

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
 