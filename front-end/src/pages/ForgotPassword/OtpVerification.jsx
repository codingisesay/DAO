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
import Button from "../../components/CommonButton";
import { useForm, Controller } from "react-hook-form";
import { forgotpass } from "../../services/apiServices";
import BackButton from "../../components/CommonButton";

const OtpVerification = () => {
  const [otp, setOtp] = useState("");
  const inputRefs = Array.from({ length: 6 }, () => useRef());
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

  // Refresh captcha
  const handleRefreshCaptcha = () => {
    generateCaptcha();
    setCaptchaInput("");
  };

  // Play audio captcha
  const playAudioCaptcha = () => {
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      alert("Audio is already playing!");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      captchaValue.split("").join(" ")
    );
    utterance.rate = 0.8; // Adjust the speed
    utterance.pitch = 1; // Adjust the pitch
    synth.speak(utterance);
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

    if (!username) {
      alert("Please enter your identifier.");
      return;
    }

    try {
      setIsloading(true);
      const response = await forgotpass.otpverify(username, otp);
      console.log(response);
      // ✅ Check if response exists and has status 200
      if (response) {
        alert(`OTP Verified`);
        navigate("/changepass");
      } else {
        alert(
          `Error: ${response.data?.message || "Unexpected error occurred"}`
        );
      }
    } catch (error) {
      // ✅ Check if the error is from the server or network
      if (error.response) {
        console.error("Server responded with an error:", error.response);
        alert(
          `Server Error: ${error.response.data?.message || "Try again later"}`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from server. Please check your network.");
      } else {
        console.error("Error during request:", error.message);
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

  // ankita code below
  // This effect is to log whenever the username changes
  useEffect(() => {
    // console.log('Username changed:', username);
    //fetchBranchData(username);
  }, [username]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp.join(""));
    }

    if (value && index < inputRefs.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    const newOtp = pasteData.split("");
    setOtp(newOtp.join(""));
    newOtp.forEach((digit, idx) => {
      if (inputRefs[idx]) {
        inputRefs[idx].current.value = digit;
      }
    });
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
 
              <h3 className="text-2xl font-bold">Verify your identity</h3>
              <h6 className="LogIn-Heading">
                We've just sent a text message with your security code on the
                phone or email.
              </h6>
              <form onSubmit={handleLogin} className="Main-Form login-input ">
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    marginBottom: "5px",
                  }}
                >
                  {inputRefs.map((ref, index) => (
                    <input
                      key={index}
                      ref={ref}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength="1"
                      style={{
                        width: "5%",
                        height: "30px",
                        textAlign: "center",
                        fontSize: "22px",
                        borderRadius: "30px",
                        border: "2px solid #ccc",
                        outline: "none",
                        transition: "all 0.3s",
                        padding: "0px",
                      }}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                    />
                  ))}
                </div>

                {/* <Button
                  type="submit"
                  text="Verify Code"
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

export default OtpVerification;
