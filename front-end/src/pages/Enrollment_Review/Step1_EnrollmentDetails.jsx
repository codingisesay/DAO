import React, { useEffect, useState } from "react";
import CommanInput from "../../components/CommanInput";
import workingman from "../../assets/imgs/workingman1.png";
import labels from "../../components/labels";
import CommonButton from "../../components/CommonButton";
import { gender, userdummydata } from "../../data/data";
import CommanSelect from "../../components/CommanSelect";
import Swal from "sweetalert2";
import { agentService, createAccountService } from "../../services/apiServices";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

function P1({ onNext, onBack, formData, updateFormData }) {
  const [selectedOption, setSelectedOption] = useState();
  const [showData, setShowData] = useState(!!formData.auth_code);

  const [localFormData, setLocalFormData] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState();
  const agent_id = localStorage.getItem("userCode");
  const { id } = useParams(); // id from route

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; // Prevent API call if id is undefined
      try {
        setLoading(true);
        const response = await agentService.refillApplication(id);
        setLocalFormData(response.data[0]);
        // console.log(localFormData);
      } catch (error) {
        console.error("Failed to fetch review applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    setShowData(false);
    setLocalFormData((prev) => ({ ...prev, verifynumber: "", auth_code: "" }));
  };

  const validateAadhaar = (aadhaarNumber) => {
    const aadhaarRegex = /^[0-9]{12}$/;
    return aadhaarRegex.test(aadhaarNumber);
  };

  const validatePAN = (panNumber) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(panNumber);
  };

  const fetchShowData = (e) => {
    e.preventDefault();
    if (selectedOption === "Aadhar Card") {
      if (validateAadhaar(localFormData.verifynumber)) {
        Swal.fire({
          icon: "success",
          title: "Aadhar Card verified!",
          showConfirmButton: false,
          timer: 1500,
        });
        setShowData(true);
        setLocalFormData((prev) => ({
          ...prev,
          ...userdummydata.aadhardetails,
          auth_code: prev.verifynumber,
        }));
      } else {
        toast.error("Please enter a valid 12-digit Aadhaar number");
      }
    } else if (selectedOption === "Pan Card") {
      if (validatePAN(localFormData.verifynumber)) {
        Swal.fire({
          icon: "success",
          title: "Pan Card verified!",
          showConfirmButton: false,
          timer: 1500,
        });
        setShowData(true);
        setLocalFormData((prev) => ({
          ...prev,
          auth_code: prev.verifynumber,
        }));
      } else {
        toast.error("Please enter a valid PAN number (format: AAAAA9999A)");
      }
    } else if (selectedOption === "DigiLocker") {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Your data has been saved successfully.",
        showConfirmButton: false,
        timer: 1500,
      });
      setShowData(true);
    }
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedData = {
      ...localFormData,
      auth_type: selectedOption,
      verificationOption: selectedOption,
    };

    updateFormData(1, updatedData);

    const payload = {
      auth_type: selectedOption,
      auth_code: localFormData.auth_code,
      first_name: localFormData.first_name,
      auth_status: "Pending",
      adhar_card:
        selectedOption === "Aadhar Card" ? localFormData.auth_code : "",
      pan_card: selectedOption === "Pan Card" ? localFormData.auth_code : "",
      middle_name: localFormData.middle_name,
      last_name: localFormData.last_name,
      DOB: localFormData.DOB,
      gender: localFormData.gender,
      mobile: localFormData.mobile,
      complex_name: localFormData.complex_name,
      flat_no: localFormData.flat_no,
      area: localFormData.area,
      landmark: localFormData.landmark,
      country: localFormData.country,
      pincode: localFormData.pincode,
      city: localFormData.city,
      district: localFormData.district,
      state: localFormData.state,
      agent_id: agent_id,
      status: "Pending",
    };

    try {
      const response = await createAccountService.enrollment_s1(payload);
    //   console.log("Response from server:", response);

      updateFormData(1, {
        ...updatedData,
        application_no: response.application_no,
        application_id: response.application_id,
      });
      localStorage.setItem("application_id", response.application_id);

      // Swal.fire({
      //   icon: "success",
      //   title: "Success!",
      //   text: "Your data has been saved successfully.",
      //   showConfirmButton: false,
      //   timer: 1500,
      // });
      onNext();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        // text: 'Failed to submit data. Please try again.',
        text: error.data.message || "Server error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      {localFormData && (
        <div className="form-container">
          <div className="flex flex-wrap items-top">
            <div className="lg:w-1/2 md:full sm:w-full my-4">
              <h2 className="text-xl font-bold mb-2">Application Form : {id}</h2>
              
          {localFormData &&   <p className="text-red-500 mb-2" > Review For : {localFormData.status_comment}</p> } 
              <div className="application-type-container">
                <label className="application-type">
                  <input
                    type="radio"
                    name="auth_type"
                    value="new"
                    className="hidden peer"
                  />
                  <div className="border rounded-lg p-2 flex items-center gap-5 peer-checked:border-green-600 transition-colors">
                    <i className="bi bi-person-fill-add"></i>
                    <span className="font-medium">New Customer</span>
                  </div>
                </label>
              </div>

              <div className="my-4">
                <h2 className="text-xl font-bold mb-2">
                  Choose the Option to Verify
                </h2>
                <form className="flex flex-wrap items-center justify-start">
                  <label className="flex me-4">
                    <input
                      className="me-2"
                      type="radio"
                      name="option"
                      value="Aadhar Card"
                      checked={localFormData.auth_type === "Aadhar Card"}
                      onChange={handleRadioChange}
                      disabled
                    />
                    Aadhar Number
                  </label>

                  <label className="flex me-4">
                    <input
                      className="me-2"
                      type="radio"
                      name="option"
                      value="Pan Card"
                      checked={localFormData.auth_type === "Pan Card"}
                      onChange={handleRadioChange}
                      disabled
                    />
                    Pan Number
                  </label>

                  <label className="flex me-4">
                    <input
                      className="me-2"
                      type="radio"
                      name="option"
                      value="DigiLocker"
                      checked={localFormData.auth_type === "DigiLocker"}
                      onChange={handleRadioChange}
                      disabled
                    />
                    DigiLocker
                  </label>
                </form>

                {localFormData.auth_type === "Aadhar Card" && (
                  <div className="mt-3">
                    <p className="mb-3 text-sm">
                      Enter 12 digit Aadhaar number (format: XXXX XXXX XXXX)
                    </p>
                    <div className="flex items-center">
                      <div className="md:w-1/2 me-4">
                        <CommanInput
                          onChange={handleChange}
                          label="Enter Aadhar Number"
                          type="text"
                          name="verifynumber"
                          value={localFormData.auth_code}
                          required
                          disabled
                          maxLength={12}
                          validationType="NUMBER_ONLY"
                        />
                      </div>
                      {/* <div className="md:w-1/2">
                                                <CommonButton
                                                    className="btn-login px-6"
                                                    onClick={fetchShowData}
                                                    disabled={!localFormData.verifynumber || localFormData.verifynumber.length !== 12}
                                                >
                                                    Submit
                                                </CommonButton>
                                            </div> */}
                    </div>
                  </div>
                )}

                {localFormData.auth_type === "Pan Card" && (
                  <div className="mt-3">
                    <p className="mb-3 text-sm">
                      Please enter a valid PAN (format: AAAAA9999A)
                    </p>
                    <div className="flex items-center">
                      <div className="md:w-1/2 me-4">
                        <CommanInput
                          onChange={handleChange}
                          label="Enter PAN Number"
                          type="text"
                          name="verifynumber"
                          value={localFormData.auth_code}
                          required
                          disabled
                          maxLength={10}
                          validationType="PAN"
                          onInput={(e) => {
                            e.target.value = e.target.value.toUpperCase();
                          }}
                        />
                      </div>
                      {/* <div className="md:w-1/2">
                                                <CommonButton
                                                    className="btn-login px-6"
                                                    onClick={fetchShowData}
                                                    disabled={!localFormData.verifynumber || !validatePAN(localFormData.verifynumber)}
                                                >
                                                    Submit
                                                </CommonButton>
                                            </div> */}
                    </div>
                  </div>
                )}

                {localFormData.auth_type === "DigiLocker" && (
                  <div className="mt-6">
                    <CommonButton
                      className="btn-login px-6"
                      onClick={() => {
                        console.log("Link via DigiLocker clicked");
                      }}
                    >
                      Link via DigiLocker
                    </CommonButton>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:block lg:w-1/2 md:w-1/2">
              <img src={workingman} alt="workingman" className="w-3/4 m-auto" />
            </div>
          </div>

          <> 
            <br />
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
              {/* First Name - Text only, 50 char limit */}
              <CommanInput
                onChange={handleChange}
                label={labels.firstname.label}
                name="first_name"
                value={localFormData.first_name}
                required
                max={30}
                validationType="TEXT_ONLY"
              />

              {/* Middle Name - Text only, 50 char limit */}
              <CommanInput
                onChange={handleChange}
                label={labels.middlename.label}
                name="middle_name"
                value={localFormData.middle_name}
                max={30}
                validationType="TEXT_ONLY"
              />

              {/* Last Name - Text only, 50 char limit */}
              <CommanInput
                onChange={handleChange}
                label={labels.lastname.label}
                name="last_name"
                value={localFormData.last_name}
                required
                max={30}
                validationType="TEXT_ONLY"
              />

              <CommanInput
                onChange={handleChange}
                label={labels.firstname.label}
                type="text"
                name="first_name"
                value={localFormData.first_name}
                required
                max={50}
                validationType="TEXT_ONLY"
                disabled={true}
              />

              <CommanInput
                onChange={handleChange}
                label={labels.middlename.label}
                type="text"
                name="middle_name"
                value={localFormData.middle_name}
                max={50}
                validationType="TEXT_ONLY"
                disabled={true}
              />

              <CommanInput
                onChange={handleChange}
                label={labels.lastname.label}
                type="text"
                name="last_name"
                value={localFormData.last_name}
                required
                max={50}
                validationType="TEXT_ONLY"
                disabled={true}
              />

              <CommanInput
                onChange={handleChange}
                label={labels.dob.label}
                type="date"
                name="DOB"
                value={localFormData.DOB}
                required
                validationType="DATE"
                disabled={true}
              />

              <CommanSelect
                onChange={handleChange}
                label={labels.gender.label}
                value={localFormData.gender}
                name="gender"
                required
                options={gender}
                disabled={true}
              />

              <CommanInput
                onChange={handleChange}
                label={labels.mobile.label}
                type="text"
                name="mobile"
                value={localFormData.mobile}
                required
                max={10}
                validationType="PHONE"
                disabled={true}
              />

              <CommanInput
                onChange={handleChange}
                label={labels.complexname.label}
                type="text"
                name="complex_name"
                value={localFormData.complex_name}
                required
                max={50}
                validationType="ALPHANUMERIC"
                disabled={true}
              />

              <CommanInput
                onChange={handleChange}
                label={labels.roomno.label}
                type="text"
                name="flat_no"
                value={localFormData.flat_no}
                required
                max={5}
                validationType="ALPHANUMERIC"
                disabled={true}
              />

              <CommanInput
                onChange={handleChange}
                label={labels.area.label}
                type="text"
                name="area"
                value={localFormData.area}
                required
                max={50}
                validationType="ALPHABETS_AND_SPACE"
                disabled={true}
              />

              <CommanInput
                onChange={handleChange}
                label={labels.landmark.label}
                type="text"
                name="landmark"
                value={localFormData.landmark}
                required
                max={50}
                validationType="EVERYTHING"
                disabled={true}
              />

              <CommanInput
                onChange={handleChange}
                label={labels.country.label}
                type="text"
                name="country"
                value={localFormData.country}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
                disabled={true}
              />

              <CommanInput
                onChange={handleChange}
                label={labels.pincode.label}
                type="text"
                name="pincode"
                value={localFormData.pincode}
                required
                max={6}
                validationType="NUMBER_ONLY"
                disabled={true}
              />

              <CommanInput
                onChange={handleChange}
                label={labels.city.label}
                type="text"
                name="city"
                value={localFormData.city}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
                disabled={true}
              />

              <CommanInput
                onChange={handleChange}
                label={labels.district.label}
                type="text"
                name="district"
                value={localFormData.district}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
                disabled={true}
              />

              <CommanInput
                onChange={handleChange}
                label={labels.state.label}
                type="text"
                name="state"
                value={localFormData.state}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
                disabled={true}
              />

              {/* Other form fields remain the same... */}
            </div>

            <div className="next-back-btns">
              <CommonButton
                className="btn-next"
                onClick={handleNextStep}
                disabled={ isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin inline-block mr-2">↻</span>
                    Processing...
                  </>
                ) : (
                  <>
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                  </>
                )}
              </CommonButton>
            </div>
          </>
        </div>
      )}
    </>
  );
}

export default P1;
