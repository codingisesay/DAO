import React, { useState, useEffect } from "react";
import clsx from "clsx";
import CommonButton from "../../components/CommonButton";
import {
  pendingAccountData,
  createAccountService,
  applicationDetailsService,
} from "../../services/apiServices";
import Swal from "sweetalert2";
import { salutation, relation } from "../../data/data";
import InputField from "../../components/CommanInput";
import SelectField from "../../components/CommanSelect";
// import { add } from "@tensorflow/tfjs-core/dist/engine"; // This import seems unused and might cause issues, removed it.

function NominationForm({ formData, updateFormData, onBack, onNext }) {
  const storedId = localStorage.getItem("application_id");
  const [nominees, setNominees] = useState([]);
  const [isPinCodeValid, setIsPinCodeValid] = useState(true); // New state for overall pincode validity
  const [currentNominee, setCurrentNominee] = useState({
    details: {
      nomineeSalutation: "",
      nomineeFirstName: "",
      nomineeMiddleName: "",
      nomineeLastName: "",
      nomineeRelation: "",
      nomineePercentage: "100",
      nomineeDOB: "",
      nomineeAge: "",
    },
    address: {
      nomineeComplexName: "",
      nomineeBuildingName: "",
      nomineeArea: "",
      nomineeLandmark: "",
      nomineeCountry: "",
      nomineePinCode: "",
      nomineeCity: "",
      nomineeDistrict: "",
      nomineeState: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({
    details: {},
    address: {},
  });
  const [isSameAsPermanent, setIsSameAsPermanent] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);

  // Converts a string to title case
  function toTitleCase(str) {
    return str
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  const fetchAndStoreDetails = async () => {
    try {
      if (storedId) {
        const response = await pendingAccountData.getDetailsS5B(storedId);

        if (response?.documents?.length > 0) {
          const formattedNominees = response.documents.map((nominee) => ({
            id: nominee.id,
            details: {
              nomineeSalutation: nominee.salutation,
              nomineeFirstName: nominee.first_name,
              nomineeMiddleName: nominee.middle_name,
              nomineeLastName: nominee.last_name,
              nomineeRelation: nominee.relationship,
              nomineePercentage: nominee.percentage,
              nomineeDOB: nominee.dob,
              nomineeAge: nominee.age.toString(),
            },
            address: {
              nomineeComplexName: nominee.nom_complex_name,
              nomineeBuildingName: nominee.nom_flat_no,
              nomineeArea: nominee.nom_area,
              nomineeLandmark: nominee.nom_landmark || "",
              nomineeCountry: nominee.nom_country,
              nomineePinCode: nominee.nom_pincode,
              nomineeCity: nominee.nom_city,
              nomineeDistrict: nominee.nom_district,
              nomineeState: nominee.nom_state,
            },
          }));

          setNominees(formattedNominees);

          const remainingPercentage =
            100 -
            formattedNominees.reduce(
              (sum, nominee) =>
                sum + parseFloat(nominee.details.nomineePercentage || 0),
              0
            );

          setCurrentNominee((prev) => ({
            ...prev,
            details: {
              ...prev.details,
              nomineePercentage:
                remainingPercentage > 0 ? remainingPercentage.toString() : "0",
            },
          }));
        }
      }
    } catch (error) {
      console.error("Failed to fetch nomination details:", error);
    }
  };

  useEffect(() => {
    fetchAndStoreDetails();
  }, [storedId]);

  const calculateAge = (dob) => {
    if (!dob) return "";

    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age.toString();
  };

  const getRemainingPercentage = () => {
    const totalUsed = nominees.reduce(
      (sum, nominee) =>
        sum + parseFloat(nominee.details.nomineePercentage || 0),
      0
    );
    return 100 - totalUsed;
  };

  const validateNominee = (nominee) => {
    const newErrors = {};

    // Details validation
    if (!nominee.details.nomineeSalutation) {
      newErrors.nomineeSalutation = "Salutation is required";
    }
    if (!nominee.details.nomineeFirstName) {
      newErrors.nomineeFirstName = "First name is required";
    } else if (/\d/.test(nominee.details.nomineeFirstName)) {
      newErrors.nomineeFirstName = "First name cannot contain numbers";
    }
    if (
      nominee.details.nomineeMiddleName &&
      /\d/.test(nominee.details.nomineeMiddleName)
    ) {
      newErrors.nomineeMiddleName = "Middle name cannot contain numbers";
    }
    if (!nominee.details.nomineeLastName) {
      newErrors.nomineeLastName = "Last name is required";
    } else if (/\d/.test(nominee.details.nomineeLastName)) {
      newErrors.nomineeLastName = "Last name cannot contain numbers";
    }
    if (!nominee.details.nomineeRelation) {
      newErrors.nomineeRelation = "Relation is required";
    }
    if (!nominee.details.nomineePercentage) {
      newErrors.nomineePercentage = "Percentage is required";
    } else if (
      isNaN(nominee.details.nomineePercentage) ||
      parseFloat(nominee.details.nomineePercentage) <= 0
    ) {
      newErrors.nomineePercentage = "Percentage must be greater than 0";
    } else if (parseFloat(nominee.details.nomineePercentage) > 100) {
      newErrors.nomineePercentage = "Percentage cannot exceed 100";
    }
    if (!nominee.details.nomineeDOB) {
      newErrors.nomineeDOB = "Date of birth is required";
    } else if (new Date(nominee.details.nomineeDOB) > new Date()) {
      newErrors.nomineeDOB = "Future date not allowed";
    }

    // Address validation (only if not same as permanent)
    // if (!isSameAsPermanent) {
      if (!nominee.address.nomineeComplexName) {
        newErrors.nomineeComplexName = "Complex name is required";
      }
      if (!nominee.address.nomineeBuildingName) {
        newErrors.nomineeBuildingName = "Building name is required";
      }
      if (!nominee.address.nomineeArea) {
        newErrors.nomineeArea = "Area is required";
      }
      if (!nominee.address.nomineeCountry) {
        newErrors.nomineeCountry = "Country is required";
      }
      if (!nominee.address.nomineePinCode) {
        newErrors.nomineePinCode = "Pin code is required";
      } else if (!/^\d{6}$/.test(nominee.address.nomineePinCode)) {
        newErrors.nomineePinCode = "Pin code must be 6 digits";
      }
      if (!nominee.address.nomineeCity) {
        newErrors.nomineeCity = "City is required";
      } else if (/\d/.test(nominee.address.nomineeCity)) {
        newErrors.nomineeCity = "City cannot contain numbers";
      }
      if (!nominee.address.nomineeDistrict) {
        newErrors.nomineeDistrict = "District is required";
      } else if (/\d/.test(nominee.address.nomineeDistrict)) {
        newErrors.nomineeDistrict = "District cannot contain numbers";
      }
      if (!nominee.address.nomineeState) {
        newErrors.nomineeState = "State is required";
      } else if (/\d/.test(nominee.address.nomineeState)) {
        newErrors.nomineeState = "State cannot contain numbers";
      }
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchAddressByPinCode = async (pincode) => {
    if (!pincode || pincode.length !== 6) {
      setIsPinCodeValid(false); // Mark as invalid if not 6 digits
      return;
    }

    setIsFetchingPincode(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        setCurrentNominee((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            nomineeState: postOffice.State,
            nomineeDistrict: postOffice.District,
            nomineeCity:
              postOffice.Name || postOffice.Block || postOffice.Division,
            nomineeCountry: "India",
          },
        }));
        setIsPinCodeValid(true); // Mark as valid on success
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.nomineePinCode; // Clear pincode specific error on success
          return newErrors;
        });
      } else {
        setIsPinCodeValid(false); // Mark as invalid if API returns no success or data
        Swal.fire({
          icon: 'warning',
          title: 'PIN Code Not Found',
          text: 'Could not find address details for this PIN code. Please enter manually.',
        });
        setErrors((prev) => ({
          ...prev,
          nomineePinCode: "Could not find address details for this PIN code.",
        }));
      }
    } catch (error) {
      console.error("Error fetching address by PIN code:", error);
      setIsPinCodeValid(false); // Mark as invalid on fetch error
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch PIN code details.',
      });
      setErrors((prev) => ({
        ...prev,
        nomineePinCode: "Failed to fetch PIN code details.",
      }));
    } finally {
      setIsFetchingPincode(false);
    }
  };

  const handleChange = (section, e) => {
    const { name, value } = e.target;

    if (name === "nomineeDOB") {
      const age = calculateAge(value);
      setCurrentNominee((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
          nomineeAge: age,
        },
      }));
    } else if (name === "nomineePinCode") {
      setCurrentNominee((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value,
        },
      }));

      if (!isSameAsPermanent) {
        if (value.length === 6) {
          // Optimistically clear error and set valid before fetching
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.nomineePinCode;
            return newErrors;
          });
          setIsPinCodeValid(true); // Assume valid for now, API will confirm
          fetchAddressByPinCode(value);
        } else {
          setIsPinCodeValid(false); // Invalidate if not 6 digits
          setErrors((prev) => ({
            ...prev,
            nomineePinCode: "Pin code must be 6 digits",
          }));
        }
      }
    } else {
      setCurrentNominee((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value,
        },
      }));
    }

    // Clear error when user starts typing for fields other than pincode
    // Pincode error handling is specific to its validation flow
    if (errors[name] && name !== "nomineePinCode") {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (section, e) => {
    const { name } = e.target;
    setTouchedFields((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: true,
      },
    }));
    // Re-validate the current nominee on blur to update errors
    validateNominee(currentNominee);
  };

  const addNominee = () => {
    // Mark all fields as touched
    const allTouched = {
      details: {},
      address: {},
    };
    Object.keys(currentNominee.details).forEach((field) => {
      allTouched.details[field] = true;
    });
    Object.keys(currentNominee.address).forEach((field) => {
      allTouched.address[field] = true;
    });
    setTouchedFields(allTouched);

    const remainingPercentage = getRemainingPercentage();

    // Auto-fill nomineePercentage if not set
    const filledNominee = {
      ...currentNominee,
      details: {
        ...currentNominee.details,
        nomineePercentage:
          currentNominee.details.nomineePercentage ||
          remainingPercentage.toString(),
      },
    };

    const currentPercentage = parseFloat(
      filledNominee.details.nomineePercentage
    );

    if (remainingPercentage <= 0) {
      Swal.fire({
        icon: "error",
        title: "Percentage Exhausted",
        text: "All your percentage value (100%) has been used",
      });
      return;
    }

    if (currentPercentage > remainingPercentage) {
      Swal.fire({
        icon: "error",
        title: "Percentage Exhausted",
        text: "The percentage for this nominee exceeds the remaining available percentage.",
      });
      return;
    }

    // Run validation after pre-filling
    if (!validateNominee(filledNominee)) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please correct the errors in the nominee details before adding.",
      });
      return;
    }

    // Ensure pincode is valid if not same as permanent address
    if (!isSameAsPermanent && (!isPinCodeValid || errors.nomineePinCode)) {
      Swal.fire({
        icon: "error",
        title: "PIN Code Error",
        text: "Please enter a valid PIN code or wait for validation to complete.",
      });
      return;
    }

    const newNominee = {
      id: nominees.length > 0 ? Math.max(...nominees.map((n) => n.id)) + 1 : 1,
      details: {
        ...filledNominee.details,
        nomineeSalutation: toTitleCase(filledNominee.details.nomineeSalutation),
        nomineeFirstName: toTitleCase(filledNominee.details.nomineeFirstName),
        nomineeMiddleName: toTitleCase(filledNominee.details.nomineeMiddleName),
        nomineeLastName: toTitleCase(filledNominee.details.nomineeLastName),
      },
      address: { ...filledNominee.address }
    };
    const updatedNominees = [...nominees, newNominee];
    setNominees(updatedNominees);
    resetForm(updatedNominees);
  };

  const removeNominee = (id) => {
    const updatedNominees = nominees.filter((nominee) => nominee.id !== id);
    setNominees(updatedNominees);
    resetForm(updatedNominees);

    const remainingPercentage =
      100 -
      updatedNominees.reduce(
        (sum, nominee) =>
          sum + parseFloat(nominee.details.nomineePercentage || 0),
        0
      );

    setCurrentNominee((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        nomineePercentage: remainingPercentage > 0 ? remainingPercentage.toString() : "0",
      },
    }));
  };

  const resetForm = (updatedNominees = nominees) => {
    const remainingPercentage =
      100 -
      updatedNominees.reduce(
        (sum, nominee) =>
          sum + parseFloat(nominee.details.nomineePercentage || 0),
        0
      );

    setCurrentNominee({
      details: {
        nomineeSalutation: "",
        nomineeFirstName: "",
        nomineeMiddleName: "",
        nomineeLastName: "",
        nomineeRelation: "",
        nomineePercentage: remainingPercentage > 0 ? remainingPercentage.toString() : "0",
        nomineeDOB: "",
        nomineeAge: "",
      },
      address: {
        nomineeComplexName: "",
        nomineeBuildingName: "",
        nomineeArea: "",
        nomineeLandmark: "",
        nomineeCountry: "",
        nomineePinCode: "",
        nomineeCity: "",
        nomineeDistrict: "",
        nomineeState: "",
      },
    });

    setErrors({});
    setTouchedFields({ details: {}, address: {} });
    setIsSameAsPermanent(false);
    setIsPinCodeValid(true); // Reset pincode validity on form reset
  };

  const submitnomini = async () => {
    if (nominees.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please add at least one nominee",
      });
      return;
    }

    const totalPercentage = nominees.reduce(
      (sum, nominee) => sum + parseFloat(nominee.details.nomineePercentage),
      0
    );
    if (totalPercentage !== 100) {
      Swal.fire({
        icon: "error",
        title: "Invalid Total Percentage",
        text: `Total percentage must be exactly 100% (current: ${totalPercentage}%)`,
      });
      return;
    }

    try {
      const nomineesPayload = nominees.map((nominee) => ({
        id: nominee.id,
        salutation: toTitleCase(nominee.details.nomineeSalutation),
        first_name: toTitleCase(nominee.details.nomineeFirstName),
        middle_name: toTitleCase(nominee.details.nomineeMiddleName),
        last_name: toTitleCase(nominee.details.nomineeLastName),
        relationship: nominee.details.nomineeRelation,
        percentage: nominee.details.nomineePercentage.toString(),
        dob: nominee.details.nomineeDOB,
        age: nominee.details.nomineeAge,
        nom_complex_name: nominee.address.nomineeComplexName,
        nom_flat_no: nominee.address.nomineeBuildingName,
        nom_area: nominee.address.nomineeArea,
        nom_landmark: nominee.address.nomineeLandmark,
        nom_country: nominee.address.nomineeCountry,
        nom_pincode: nominee.address.nomineePinCode,
        nom_city: nominee.address.nomineeCity,
        nom_district: nominee.address.nomineeDistrict,
        nom_state: nominee.address.nomineeState,
        status: "APPROVED",
      }));

      await createAccountService.accountNominee_s5b({
        application_id: storedId,
        nominees: nomineesPayload,
      });

      Swal.fire({
        icon: "success",
        title: "Nominee(s) saved successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      if (onNext) onNext();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Failed to save nominee(s)",
      });
    }
  };

  const handleSameAddressToggle = async (e) => {
    const isChecked = e.target.checked;
    setIsSameAsPermanent(isChecked);

    if (isChecked) {
      // Clear all address-related errors when "Same as permanent" is checked
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.nomineeComplexName;
        delete newErrors.nomineeBuildingName;
        delete newErrors.nomineeArea;
        delete newErrors.nomineeLandmark;
        delete newErrors.nomineeCountry;
        delete newErrors.nomineePinCode;
        delete newErrors.nomineeCity;
        delete newErrors.nomineeDistrict;
        delete newErrors.nomineeState;
        return newErrors;
      });
      setIsPinCodeValid(true); // Pincode is valid if copying from permanent address

      try {
        const response = await applicationDetailsService.getFullDetails(
          storedId
        );
        if (response.data) {
          const { application_addresss } = response.data;
          const address = Array.isArray(application_addresss)
            ? application_addresss[0]
            : application_addresss;
          setCurrentNominee((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              nomineeComplexName: address.per_complex_name,
              nomineeBuildingName: address.per_flat_no,
              nomineeArea: address.per_area,
              nomineeLandmark: address.per_landmark || "",
              nomineeCountry: address.per_country,
              nomineePinCode: address.per_pincode,
              nomineeCity: address.per_city,
              nomineeDistrict: address.per_district,
              nomineeState: address.per_state,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching address details:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch permanent address details",
        });
      }
    } else {
      setCurrentNominee((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          nomineeComplexName: "",
          nomineeBuildingName: "",
          nomineeArea: "",
          nomineeLandmark: "",
          nomineeCountry: "",
          nomineePinCode: "",
          nomineeCity: "",
          nomineeDistrict: "",
          nomineeState: "",
        },
      }));
      // When unchecking, re-evaluate pincode validity if it's currently invalid
      if (currentNominee.address.nomineePinCode.length !== 6) {
        setIsPinCodeValid(false);
        setErrors((prev) => ({
          ...prev,
          nomineePinCode: "Pin code must be 6 digits",
        }));
      } else {
        // If it was 6 digits, re-fetch to validate it independently
        fetchAddressByPinCode(currentNominee.address.nomineePinCode);
      }
    }
  };

  // Determine if the Add Nominee button should be disabled
  const isAddNomineeDisabled =
    getRemainingPercentage() <= 0 || // No percentage left
    (Object.keys(errors).length > 0 && !isSameAsPermanent) || // General errors (unless address is copied)
    (errors.nomineePinCode && !isSameAsPermanent) || // Specific pincode error (unless address is copied)
    (!isPinCodeValid && !isSameAsPermanent) || // Pincode not valid (unless address is copied)
    isFetchingPincode || // Pincode is being fetched
    (Object.keys(touchedFields.details).length === 0 && Object.keys(touchedFields.address).length === 0); // No fields touched yet (initial state)

  return (
    <div className="max-w-screen-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Nominee Details</h2>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 mb-3">
        <div>
          <SelectField
            label="Salutation"
            name="nomineeSalutation"
            value={currentNominee.details.nomineeSalutation}
            onChange={(e) => handleChange("details", e)}
            onBlur={(e) => handleBlur("details", e)}
            required
            options={salutation}
            className={
              errors.nomineeSalutation &&
              touchedFields.details?.nomineeSalutation
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeSalutation &&
            touchedFields.details?.nomineeSalutation && (
              <p className="text-red-500 text-xs">{errors.nomineeSalutation}</p>
            )}
        </div>

        <div>
          <InputField
            label="First Name"
            name="nomineeFirstName"
            value={currentNominee.details.nomineeFirstName}
            onChange={(e) => handleChange("details", e)}
            onBlur={(e) => handleBlur("details", e)}
            required
            max={50}
            className={
              errors.nomineeFirstName && touchedFields.details?.nomineeFirstName
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeFirstName &&
            touchedFields.details?.nomineeFirstName && (
              <p className="text-red-500 text-xs">{errors.nomineeFirstName}</p>
            )}
        </div>

        <div>
          <InputField
            label="Middle Name"
            name="nomineeMiddleName"
            value={currentNominee.details.nomineeMiddleName}
            onChange={(e) => handleChange("details", e)}
            onBlur={(e) => handleBlur("details", e)}
            max={50}
            className={
              errors.nomineeMiddleName &&
              touchedFields.details?.nomineeMiddleName
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeMiddleName &&
            touchedFields.details?.nomineeMiddleName && (
              <p className="text-red-500 text-xs">{errors.nomineeMiddleName}</p>
            )}
        </div>

        <div>
          <InputField
            label="Last Name"
            name="nomineeLastName"
            value={currentNominee.details.nomineeLastName}
            onChange={(e) => handleChange("details", e)}
            onBlur={(e) => handleBlur("details", e)}
            required
            max={50}
            className={
              errors.nomineeLastName && touchedFields.details?.nomineeLastName
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeLastName && touchedFields.details?.nomineeLastName && (
            <p className="text-red-500 text-xs">{errors.nomineeLastName}</p>
          )}
        </div>

        <div>
          <SelectField
            label="Relation"
            name="nomineeRelation"
            value={currentNominee.details.nomineeRelation}
            onChange={(e) => handleChange("details", e)}
            onBlur={(e) => handleBlur("details", e)}
            required
            options={relation}
            className={
              errors.nomineeRelation && touchedFields.details?.nomineeRelation
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeRelation && touchedFields.details?.nomineeRelation && (
            <p className="text-red-500 text-xs">{errors.nomineeRelation}</p>
          )}
        </div>

        <div>
          <InputField
            label={`Percentage (Remaining: ${getRemainingPercentage()}%)`}
            name="nomineePercentage"
            value={currentNominee.details.nomineePercentage}
            onChange={(e) => handleChange("details", e)}
            onBlur={(e) => handleBlur("details", e)}
            required type="number"
            max={3}
            className={
              errors.nomineePercentage &&
              touchedFields.details?.nomineePercentage
                ? "border-red-500"
                : ""
            }
          />

          {errors.nomineePercentage &&
            touchedFields.details?.nomineePercentage && (
              <p className="text-red-500 text-xs">{errors.nomineePercentage}</p>
            )}
        </div>

        <div>
          <InputField
            label="Date of Birth"
            name="nomineeDOB"
            type="date"
            value={currentNominee.details.nomineeDOB}
            onChange={(e) => handleChange("details", e)}
            onBlur={(e) => handleBlur("details", e)}
            required
            className={
              errors.nomineeDOB && touchedFields.details?.nomineeDOB
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeDOB && touchedFields.details?.nomineeDOB && (
            <p className="text-red-500 text-xs">{errors.nomineeDOB}</p>
          )}
        </div>

        <div>
          <InputField
            label="Age"
            name="nomineeAge"
            value={currentNominee.details.nomineeAge}
            onChange={(e) => handleChange("details", e)}
            onBlur={(e) => handleBlur("details", e)}
            required
            max={3}
            disabled={true}
          />
        </div>
      </div>

      <div className="flex items-center mb-2">
        <h2 className="text-xl font-bold m-0">Nominee Address</h2>&emsp;
        <div className="flex items-center">
          <input
            type="checkbox"
            id="sameAsPermanent"
            className="me-2"
            checked={isSameAsPermanent}
            onChange={handleSameAddressToggle}
          />
          <label htmlFor="sameAsPermanent">Same as permanent address</label>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
        <div>
          <InputField
            label="Complex Name"
            name="nomineeComplexName"
            value={currentNominee.address.nomineeComplexName}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            max={50}
            // disabled={isSameAsPermanent}
            className={
              errors.nomineeComplexName &&
              touchedFields.address?.nomineeComplexName
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeComplexName &&
            touchedFields.address?.nomineeComplexName && (
              <p className="text-red-500 text-xs">
                {errors.nomineeComplexName}
              </p>
            )}
        </div>

        <div>
          <InputField
            label="Building Name"
            name="nomineeBuildingName"
            value={currentNominee.address.nomineeBuildingName}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            max={20}
            // disabled={isSameAsPermanent}
            className={
              errors.nomineeBuildingName &&
              touchedFields.address?.nomineeBuildingName
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeBuildingName &&
            touchedFields.address?.nomineeBuildingName && (
              <p className="text-red-500 text-xs">
                {errors.nomineeBuildingName}
              </p>
            )}
        </div>

        <div>
          <InputField
            label="Area"
            name="nomineeArea"
            value={currentNominee.address.nomineeArea}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            max={50}
            // disabled={isSameAsPermanent}
            className={
              errors.nomineeArea && touchedFields.address?.nomineeArea
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeArea && touchedFields.address?.nomineeArea && (
            <p className="text-red-500 text-xs">{errors.nomineeArea}</p>
          )}
        </div>

        <div>
          <InputField
            label="Landmark"
            name="nomineeLandmark"
            value={currentNominee.address.nomineeLandmark}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            max={50}
            // disabled={isSameAsPermanent}
            className={
              errors.nomineeLandmark && touchedFields.address?.nomineeLandmark
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeLandmark && touchedFields.address?.nomineeLandmark && (
            <p className="text-red-500 text-xs">{errors.nomineeLandmark}</p>
          )}
        </div>

        <div>
          <InputField
            label="Country"
            name="nomineeCountry"
            value={currentNominee.address.nomineeCountry}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            max={30}
            // disabled={isSameAsPermanent}
            className={
              errors.nomineeCountry && touchedFields.address?.nomineeCountry
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeCountry && touchedFields.address?.nomineeCountry && (
            <p className="text-red-500 text-xs">{errors.nomineeCountry}</p>
          )}
        </div>

        <div>
          <InputField
            label="Pin Code"
            name="nomineePinCode"
            value={currentNominee.address.nomineePinCode}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            max={6}
            // disabled={isSameAsPermanent}
            className={
              (errors.nomineePinCode && touchedFields.address?.nomineePinCode) ||
              (!isPinCodeValid && touchedFields.address?.nomineePinCode && !isSameAsPermanent)
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineePinCode && touchedFields.address?.nomineePinCode && (
            <p className="text-red-500 text-xs">{errors.nomineePinCode}</p>
          )}
          {!isPinCodeValid && touchedFields.address?.nomineePinCode && !errors.nomineePinCode && !isSameAsPermanent && (
            <p className="text-red-500 text-xs">Please enter a valid PIN code.</p>
          )}
          {isFetchingPincode && !isSameAsPermanent && (
            <p className="text-blue-500 text-xs">Fetching address...</p>
          )}
        </div>

        <div>
          <InputField
            label="State"
            name="nomineeState"
            value={currentNominee.address.nomineeState}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            // disabled={isSameAsPermanent || isFetchingPincode}
            className={
              errors.nomineeState && touchedFields.address?.nomineeState
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeState && touchedFields.address?.nomineeState && (
            <p className="text-red-500 text-xs">{errors.nomineeState}</p>
          )}
        </div>

        <div>
          <InputField
            label="City"
            name="nomineeCity"
            value={currentNominee.address.nomineeCity}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            // disabled={isSameAsPermanent || isFetchingPincode}
            className={
              errors.nomineeCity && touchedFields.address?.nomineeCity
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeCity && touchedFields.address?.nomineeCity && (
            <p className="text-red-500 text-xs">{errors.nomineeCity}</p>
          )}
        </div>

        <div>
          <InputField
            label="District"
            name="nomineeDistrict"
            value={currentNominee.address.nomineeDistrict}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            // disabled={isSameAsPermanent || isFetchingPincode}
            className={
              errors.nomineeDistrict && touchedFields.address?.nomineeDistrict
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeDistrict && touchedFields.address?.nomineeDistrict && (
            <p className="text-red-500 text-xs">{errors.nomineeDistrict}</p>
          )}
        </div>
      </div>

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

      {nominees.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Nominees List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">Name of the Nominee</th>
                  <th className="py-2 px-4 border-b">Address</th>
                  <th className="py-2 px-4 border-b">Relationship</th>
                  <th className="py-2 px-4 border-b">Date of Birth</th>
                  <th className="py-2 px-4 border-b">Age</th>
                  <th className="py-2 px-4 border-b">Percentage</th>
                  <th className="py-2 px-4 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {nominees.map((nominee) => (
                  <tr key={nominee.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {toTitleCase(nominee.details.nomineeSalutation)}{" "}
                      {toTitleCase(nominee.details.nomineeFirstName)}{" "}
                      {toTitleCase(nominee.details.nomineeLastName)}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {nominee.address.nomineeComplexName},{" "}
                      {nominee.address.nomineeBuildingName},{" "}
                      {nominee.address.nomineeArea}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {nominee.details.nomineeRelation}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {
                        (() => {
                          const date = new Date(nominee.details.nomineeDOB);
                          const day = String(date.getDate()).padStart(2, '0');
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          const year = date.getFullYear();
                          return `${day}/${month}/${year}`;
                        })()
                      }
                    </td>
                    <td className="py-2 px-4 border-b">
                      {nominee.details.nomineeAge}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {nominee.details.nomineePercentage}%
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => removeNominee(nominee.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="next-back-btns z-10">
        <CommonButton onClick={onBack} variant="outlined" className="btn-back">
          <i className="bi bi-chevron-double-left"></i>&nbsp;Back
        </CommonButton>
        <CommonButton
          onClick={submitnomini}
          variant="contained"
          className="btn-next"
        >
          Next&nbsp;<i className="bi bi-chevron-double-right"></i>
        </CommonButton>
      </div>
    </div>
  );
}

export default NominationForm;




 
  