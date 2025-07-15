import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { salutation, relation } from "../../data/data";
import { pendingAccountData, applicationDetailsService, createAccountService } from "../../services/apiServices";

export const useNominationForm = () => {
  const storedId = localStorage.getItem("application_id");
  const [nominees, setNominees] = useState([]);
  const [isPinCodeValid, setIsPinCodeValid] = useState(true);
  const [isSameAsPermanent, setIsSameAsPermanent] = useState(false);
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  
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

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

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
          updateRemainingPercentage(formattedNominees);
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
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const getRemainingPercentage = () => {
    const totalUsed = nominees.reduce(
      (sum, nominee) => sum + parseFloat(nominee.details.nomineePercentage || 0),
      0
    );
    return 100 - totalUsed;
  };

  const updateRemainingPercentage = (nomineesList = nominees) => {
    const remainingPercentage = 100 - nomineesList.reduce(
      (sum, nominee) => sum + parseFloat(nominee.details.nomineePercentage || 0),
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

  const validateNominee = (nominee) => {
    const newErrors = {};
    // Details validation
    if (!nominee.details.nomineeSalutation) newErrors.nomineeSalutation = "Salutation is Required";
    if (!nominee.details.nomineeFirstName) {
      newErrors.nomineeFirstName = "First name is Required";
    } else if (/\d/.test(nominee.details.nomineeFirstName)) {
      newErrors.nomineeFirstName = "First name cannot contain numbers";
    }
    if (nominee.details.nomineeMiddleName && /\d/.test(nominee.details.nomineeMiddleName)) {
      newErrors.nomineeMiddleName = "Middle name cannot contain numbers";
    }
    if (!nominee.details.nomineeLastName) {
      newErrors.nomineeLastName = "Last name is Required";
    } else if (/\d/.test(nominee.details.nomineeLastName)) {
      newErrors.nomineeLastName = "Last name cannot contain numbers";
    }
    if (!nominee.details.nomineeRelation) newErrors.nomineeRelation = "Relation is Required";
    if (!nominee.details.nomineePercentage) {
      newErrors.nomineePercentage = "Percentage is Required";
    } else if (isNaN(nominee.details.nomineePercentage) || parseFloat(nominee.details.nomineePercentage) <= 0) {
      newErrors.nomineePercentage = "Percentage must be greater than 0";
    } else if (parseFloat(nominee.details.nomineePercentage) > 100) {
      newErrors.nomineePercentage = "Percentage cannot exceed 100";
    }
    if (!nominee.details.nomineeDOB) {
      newErrors.nomineeDOB = "Date of birth is Required";
    } else if (new Date(nominee.details.nomineeDOB) > new Date()) {
      newErrors.nomineeDOB = "Future date not allowed";
    }

    // Address validation
    if (!nominee.address.nomineeComplexName) newErrors.nomineeComplexName = "Complex name is Required";
    if (!nominee.address.nomineeBuildingName) newErrors.nomineeBuildingName = "Building name is Required";
    if (!nominee.address.nomineeArea) newErrors.nomineeArea = "Area is Required";
    if (!nominee.address.nomineeCountry) newErrors.nomineeCountry = "Country is Required";
    if (!nominee.address.nomineePinCode) {
      newErrors.nomineePinCode = "Pin code is Required";
    } else if (!/^\d{6}$/.test(nominee.address.nomineePinCode)) {
      newErrors.nomineePinCode = "Pin code must be 6 digits";
    }
    if (!nominee.address.nomineeCity) {
      newErrors.nomineeCity = "City is Required";
    } else if (/\d/.test(nominee.address.nomineeCity)) {
      newErrors.nomineeCity = "City cannot contain numbers";
    }
    if (!nominee.address.nomineeDistrict) {
      newErrors.nomineeDistrict = "District is Required";
    } else if (/\d/.test(nominee.address.nomineeDistrict)) {
      newErrors.nomineeDistrict = "District cannot contain numbers";
    }
    if (!nominee.address.nomineeState) {
      newErrors.nomineeState = "State is Required";
    } else if (/\d/.test(nominee.address.nomineeState)) {
      newErrors.nomineeState = "State cannot contain numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchAddressByPinCode = async (pincode) => {
    if (!pincode || pincode.length !== 6) {
      setIsPinCodeValid(false);
      return;
    }

    setIsFetchingPincode(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        setCurrentNominee((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            nomineeState: postOffice.State,
            nomineeDistrict: postOffice.District,
            nomineeCity: postOffice.Name || postOffice.Block || postOffice.Division,
            nomineeCountry: "India",
          },
        }));
        setIsPinCodeValid(true);
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.nomineePinCode;
          return newErrors;
        });
      } else {
        setIsPinCodeValid(false);
        Swal.fire({
          icon: 'warning',
          title: 'PIN Code Not Found',
          text: 'Could not find address details for this PIN code.',
        });
        setErrors((prev) => ({
          ...prev,
          nomineePinCode: "Could not find address details for this PIN code.",
        }));
      }
    } catch (error) {
      console.error("Error fetching address by PIN code:", error);
      setIsPinCodeValid(false);
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

      if (value.length === 6) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.nomineePinCode;
          return newErrors;
        });
        setIsPinCodeValid(true);
        fetchAddressByPinCode(value);
      } else {
        setIsPinCodeValid(false);
        setErrors((prev) => ({
          ...prev,
          nomineePinCode: "Pin code must be 6 digits",
        }));
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
    validateNominee(currentNominee);
  };

  const addNominee = () => {
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
    const filledNominee = {
      ...currentNominee,
      details: {
        ...currentNominee.details,
        nomineePercentage: currentNominee.details.nomineePercentage || remainingPercentage.toString(),
      },
    };

    const currentPercentage = parseFloat(filledNominee.details.nomineePercentage);

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

    if (!validateNominee(filledNominee)) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please correct the errors in the nominee details before adding.",
      });
      return;
    }

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
  };

  const resetForm = (updatedNominees = nominees) => {
    const remainingPercentage = 100 - updatedNominees.reduce(
      (sum, nominee) => sum + parseFloat(nominee.details.nomineePercentage || 0),
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
    setIsPinCodeValid(true);
  };

  const handleSameAddressToggle = async (e) => {
    const isChecked = e.target.checked;
    setIsSameAsPermanent(isChecked);

    if (isChecked) {
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
      setIsPinCodeValid(true);

      try {
        const response = await applicationDetailsService.getFullDetails(storedId);
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
      setIsPinCodeValid(false);
      setErrors((prev) => ({
        ...prev,
        nomineePinCode: "Pin code must be 6 digits",
      }));
    }
  };

  const submitNominees = async () => {
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

      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error?.response?.data?.message || "Failed to save nominee(s)",
      });
      return false;
    }
  };

  const isAddNomineeDisabled =
    getRemainingPercentage() <= 0 ||
    (Object.keys(errors).length > 0 && !isSameAsPermanent) ||
    (errors.nomineePinCode && !isSameAsPermanent) ||
    (!isPinCodeValid && !isSameAsPermanent) ||
    isFetchingPincode ||
    (Object.keys(touchedFields.details).length === 0 && Object.keys(touchedFields.address).length === 0);

  return {
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
  };
};