/**
 * Copyright: © 2024 SIL Technology LTD
 *
 * Organization: SIL Technology LTD
 *
 * This is unpublished, proprietary, confidential source code of SIL Technology LTD
 * SIL Technology LTD retains all title to and intellectual property rights in these materials.
 *
 **/

/**
 *
 * author                   version     date        change description
 * Shreyash Talwekar        1.0.0       01/01/2025  component created
 *
 **/

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";    
// import InputField from "../../InputField/InputField";
import InputField from '../../components/CommanInput'
import Button from "../../components/CommonButton";  
// import { forgotpass } from "../../../services/apiServices";
import { forgotpass } from "../../services/apiServices";
import BackButton from "../../components/CommonButton";
import { useLocation } from "react-router-dom";

const ChangePassword = () => {
  const [username, setUsername] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const location = useLocation();
  const UserCode = location.state?.username || "";

  const defaultFormData = {
    password: "",
    password1: "",
  };

  // State object to track password validation criteria
  const [validation, setValidation] = useState({
    length: false, // At least 8 characters long
    uppercase: false, // Contains at least one uppercase letter (A-Z)
    lowercase: false, // Contains at least one lowercase letter (a-z)
    number: false, // Includes at least one numeric digit (0-9)
    special: false, // Has at least one special character (e.g., !@#$%)
  });

  /**
   * Validates the password based on predefined security criteria.
   *
   * This function checks if the given password meets the following conditions:
   * - At least 8 characters long.
   * - Contains at least one uppercase letter (A-Z).
   * - Contains at least one lowercase letter (a-z).
   * - Includes at least one numeric digit (0-9).
   * - Has at least one special character (non-alphanumeric).
   *
   * @param {string} value - The password entered by the user.
   */
  const validatePassword = (value) => {
    // Update the validation state with boolean values based on password criteria
    setValidation({
      length: value.length >= 8, // Ensures minimum password length of 8 characters
      uppercase: /[A-Z]/.test(value), // Checks for at least one uppercase letter
      lowercase: /[a-z]/.test(value), // Checks for at least one lowercase letter
      number: /[0-9]/.test(value), // Checks for at least one numeric digit
      special: /[\W_]/.test(value), // Checks for at least one special character
    });
  };

  useEffect(() => {
    // Retrieve username from sessionStorage
    const storedUsername = sessionStorage.getItem("forgotPasswordUsername");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (password === password1) {
        setIsloading(true);
        const response = await forgotpass.setpass(
          username || UserCode,
          password
        );
        console.log(response);

        if (response) {
          // Store username in sessionStorage
          sessionStorage.setItem("forgotPasswordUsername", username);
          alert(`Password change successfully.`);
          navigate("/");
        } else {
          alert(
            `Error: ${response.data?.message || "Unexpected error occurred"}`
          );
        }
      } else {
        alert("Password does Not match");
      }
    } catch (error) {
      if (error.response) {
        alert(
          `Server Error: ${error.response.data?.message || "Try again later"}`
        );
      } else if (error.request) {
        alert("No response from server. Please check your network.");
      } else {
        alert(`Request Error: ${error.message}`);
      }
    } finally {
      setIsloading(false);
    }
  };

  // ankita code above
  return (
    <body className="flex items-center justify-center h-screen">
      <div className="bg-white w-3/4 m-auto rounded-xl p-4 ">
     
        <div className="Login-Form-Bottom">
          <div
            className="Login-Page-Interal-div"
            style={{ flexDirection: "row-reverse" }}
          >
          
            <div className="Login-Form" style={{ paddingTop: "1%" }}>
              <div style={{ width: "100%", display: "flex" }}>
                <BackButton to="/" />
              </div>
 
              <h3 className="text-2xl font-bold">Create New Password</h3>
              <h6 className="LogIn-Heading my-6">Please set new Password</h6>
              <form onSubmit={handleLogin} className="Main-Form login-input ">
                <div style={{ position: "relative" }}>
                  <InputField
                    label="New Password"
                    placeholder="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    className="inputfielddiv login-Inpute my-6"
                    required={true}
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onFocus={() => setIsPasswordFocused(true)}
                    // onBlur={() => setIsPasswordFocused(false)}
                    onBlur={() =>
                      setTimeout(() => setIsPasswordFocused(false), 200)
                    }
                    validationType={"PASSWORD"}
                    min={8}
                    max={12}
                    validationErrors={validationErrors || {}} // Ensure it's never undefined
                    setValidationErrors={setValidationErrors}
                  />
               
                </div>
                {isPasswordFocused && (
                  <div
                    className="validation-box"
                    style={{
                      position: "absolute",
                      top: "31%",
                      left: "37%",
                    }}
                  >
                    <ul>
                      <li className={validation.lowercase ? "valid" : ""}>
                        {validation.lowercase ? (
                          <i class="bi bi-check-circle-fill"></i>
                        ) : (
                          <i class="bi bi-circle"></i>
                        )}{" "}
                        Lower Case
                      </li>
                      <li className={validation.uppercase ? "valid" : ""}>
                        {validation.uppercase ? (
                          <i class="bi bi-check-circle-fill"></i>
                        ) : (
                          <i class="bi bi-circle"></i>
                        )}{" "}
                        Upper Case
                      </li>
                      <li className={validation.number ? "valid" : ""}>
                        {validation.number ? (
                          <i class="bi bi-check-circle-fill"></i>
                        ) : (
                          <i class="bi bi-circle"></i>
                        )}{" "}
                        Number
                      </li>
                      <li className={validation.special ? "valid" : ""}>
                        {validation.special ? (
                          <i class="bi bi-check-circle-fill"></i>
                        ) : (
                          <i class="bi bi-circle"></i>
                        )}{" "}
                        Symbol
                      </li>
                      <li className={validation.length ? "valid" : ""}>
                        {validation.length ? (
                          <i class="bi bi-check-circle-fill"></i>
                        ) : (
                          <i class="bi bi-circle"></i>
                        )}{" "}
                        Minimum 8 characters
                      </li>
                    </ul>
                  </div>
                )}
                <div style={{ position: "relative" }}>
                  <InputField
                    label="Confirm Password"
                    placeholder="Password"
                    onChange={(e) => setPassword1(e.target.value)}
                    className="inputfielddiv login-Inpute"
                    required={true}
                    type={passwordVisible ? "text" : "password"}
                    value={password1}
                    validationType={"PASSWORD"}
                    min={8}
                    max={12}
                    validationErrors={validationErrors || {}} // Ensure it's never undefined
                    setValidationErrors={setValidationErrors}
                  />
             
                </div>

                <Button
                  type="submit"
                  text="Submit"
                  styleClass="green_btn Login-Button-Temp"
                  disabled={Object.values(validationErrors).some(
                    (error) => error
                  )}
                />


                  <div className="text-center">
                  <button type="submit"       className="bg-green-500 p-2 px-4 rounded text-white mt-5 mx-auto"
                  disabled={Object.values(validationErrors).some(
                    (error) => error
                  )}
             >Submit</button>
                  </div>
           
              </form>
            </div>
          </div>
        </div> 
      </div>
    </body>
  );
};

export default ChangePassword;
