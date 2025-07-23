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

import InputField from '../../components/CommanInput';
import Button from "../../components/CommonButton"; 
import { useForm, Controller } from "react-hook-form"; 
import { forgotpass } from "../../services/apiServices";
import BackButton from "../../components/CommonButton";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [usernamePasswordVisible, usernameSetPasswordVisible] = useState(false); // State for password visibility
  const [passwordVisible, setPasswordVisible] = useState(false); // State for password visibility
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);

  const [branchCode, setBranchCode] = useState("");
  const [branches, setBranches] = useState([]);
  // Hardcoded credentials
  const hardcodedUsername = "admin";
  const hardcodedPassword = "password";
  const handleBranchChange = (e) => {
    const branchCode = e.target.value;
    setBranchCode(branchCode);
  };

  const defaultFormData = {
    username: "",
    password: "",
    loginBranchId: "",
  };
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    register,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    defaultValues: defaultFormData,
    mode: "onChange",
  });

  // Function to generate random captcha
  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let captcha = "";
    for (let i = 0; i < 5; i++) {
      captcha += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setCaptchaValue(captcha);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username) {
      alert("Please enter your identifier.");
      return;
    }

    try {
      setIsloading(true);
      const response = await forgotpass.forgotPass(username);
      console.log(response);

      if (response) {
        if (response != "User not found") {
          // Store username in sessionStorage
          sessionStorage.setItem("forgotPasswordUsername", username);
          alert(`OTP sent successfully.`);
          navigate("/otpvarification");
        } else {
          alert(
            `Error: ${response.data?.message || "Unexpected error occurred"}`
          );
        }
      } else {
        alert(
          `Error: ${response.data?.message || "Unexpected error occurred"}`
        );
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

  // Generate captcha on initial render
  React.useEffect(() => {
    generateCaptcha();
  }, []);

  // ankita code above
  return (
    <body className="Login-Border">
      <div className="flex items-center justify-center h-screen">
       
        <div className="bg-white w-3/4 m-auto rounded-xl p-4 ">
          <div
            className="Login-Page-Interal-div"
            style={{ flexDirection: "row-reverse" }}
          >
      
            <div className="Login-Form" style={{ paddingTop: "1%" }}>
              <div style={{ width: "100%", display: "flex" }}>
                <BackButton to="/" />
              </div>
 
              <h3 className="text-2xl font-bold">Forgot Password</h3>
              <h6 className="LogIn-Heading my-4">Please enter your credentials</h6>
              <form onSubmit={handleLogin} className="Main-Form login-input ">
                <div style={{ position: "relative" }}>
                  <InputField
                    type={usernamePasswordVisible ? "text" : "password"}
                    label="Email, Phone or User ID"
                    onChange={(e) => setUsername(e.target.value.toUpperCase())} // Updates the username state
                    className="inputfielddiv login-Inpute"
                    required={true}
                    value={username}
                    validationType={"ALPHANUMERIC"}
                    min={2}
                    max={15}
                  />
      
                </div>
                {/* 
                <Button
                  type="submit"
                  text="Send OTP"
                  styleClass="green_btn Login-Button-Temp"
                /> */}


                <div className="text-center">
                  <button type="submit" 
                  className="bg-green-500 p-2 px-4 rounded text-white mt-10 mx-auto">SUBMIT</button>
                </div>


              </form>
            </div>
          </div>
        </div> 
      </div>
    </body>
  );
};

export default ForgotPassword;
