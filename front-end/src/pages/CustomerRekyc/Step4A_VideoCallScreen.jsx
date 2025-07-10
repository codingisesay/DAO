import React, { useState, useEffect } from "react";
import vcallimg from '../../assets/imgs/vcall_illustration.jpg';
import CommonButton from "../../components/CommonButton";
import Swal from 'sweetalert2';
import {pendingAccountData, createAccountService, pendingKyc} from '../../services/apiServices'; // Adjust the import path as necessary

import { useNavigate, Link } from 'react-router-dom';

const VideoKYCInstructions = ({onNext}) => {
    const id =localStorage.getItem('application_id') || null;
    const [localFormData, setLocalFormData] = useState();
    const [meetingUrl, setMeetingUrl] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState({
        guidelines: false,
        technical: false
    });
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = useState(false);
    const [assistKycCall, setAssistKycCall] = useState(false);
    const application_id = JSON.parse(localStorage.getItem('application_id')) || null;
  const [agentId, setAgentId] = useState(localStorage.getItem('userCode') || null);
  const [applicationId, setApplicationId] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
    const handleCheckboxChange = (type) => {
        setTermsAccepted(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

  useEffect(() => {
    if (id) {
      fetchAndShowDetails(id);
    }
  }, []);


  const fetchAndShowDetails = async (id) => { 
    try {
      if (id) {
        const response = await pendingKyc.pedingKyc1(id);
        const application = response.data.verify_cbs || {};  
        // console.log('detais to send vcall send : ', application[0].kyc_cbs_first_name);
        if (application) {
          setLocalFormData(application); 
            // setAgentId(application.agent_id || null);
            setApplicationId(application[0].kyc_application_id || null);
            setCustomerName( application[0].kyc_cbs_first_name || 'Sushant');
            // setCustomerEmail(application.email || '');
        
        }
      }
    } catch (error) {
      console.error('Failed to fetch application details:', error);
      toast.error('Failed to load personal details');
    }
  };
    
    const handleConfirm = async () => {
        try {
            const response = await createAccountService.vcallGuidlineAccept(id,{
            application_id: id,
            status: "checked", // or whatever status you want to send
            });

            if (response) { // Check for successful status code
                setShowOptions(true);
            } else {
                // Handle API error, maybe show a Swal alert
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data?.message || 'Failed to confirm guidelines. Please try again.',
                });
            }
        } catch (error) {
            console.error("Error confirming guidelines:", error);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Could not connect to the server. Please check your internet connection.',
            });
        }
    };


    const allTermsAccepted = termsAccepted.guidelines && termsAccepted.technical;

    const skipKyc=()=>{
            localStorage.setItem('vcall', JSON.stringify(false));
        Swal.fire({
            icon: 'info',
            title: 'VKYC Skipped',
            text: 'You have chosen to skip the video KYC process.',
            confirmButtonText: 'Continue'
            }).then(() => {
            // This runs after the user clicks "Continue"
            onNext();
            });
    }


const assistKyc = async () => {
  localStorage.setItem('vcall', JSON.stringify(true));
  setAssistKycCall(true); // Show loading state/iframe area immediately

  // Prepare your payload - Ensure application_id is dynamically fetched
  // You might want to use the `id` from state or props, not `application_id` from localStorage that is parsed as JSON
  const customerApplicationId = localStorage.getItem('application_id');
  const payload = {
    agent_id: agentId, // This might need to be dynamic based on your logic
    kyc_application_id: customerApplicationId, // Use the real application_id
    customer_name: customerName, // This should also be dynamic, from formData or user info
    customer_email: 'paresh.h@siltech.co.in', // This should also be dynamic
  };
console.log("Payload for creating meeting:", payload); // Debugging line to check payload
  try {
    const response = await fetch("https://vcall.payvance.co.in/api/create-meeting", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
        // If response is not OK (e.g., 400, 500 status), throw an error
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.meeting_link) {
      // CORRECTED LINE: Set meetingUrl to the actual URL from the API response
      setMeetingUrl(data.meeting_link);
    } else {
      setMeetingUrl(null);
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Failed to get meeting URL from the API response. Please try again.",
      });
    }
  } catch (error) {
    setMeetingUrl(null);
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: "Error creating meeting: " + error.message,
    });
    console.error("Error creating meeting:", error); // Log the full error for debugging
  }
};


    const vcallstart=async()=>{
        navigate('/startVkyc');
    }

    return (
        <>
            {assistKycCall === false
                ?
                (<>
                <div className="flex flex-col md:flex-row gap-5 justify-center items-start">
                    {/* Guidelines Box */} 
                    <div className="bg-green-100 p-3 rounded-xl w-full md:w-1/2 shadow" style={{minHeight:'100%'}}>
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                className="mt-2"
                                checked={termsAccepted.guidelines}
                                onChange={() => handleCheckboxChange('guidelines')}
                            />
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Guidelines</h2>
                                <ul className="list-decimal pl-5 text-sm space-y-2">
                                    <li>Background should be with light color.</li>
                                    <li>Keep your original documents ready before starting the process.</li>
                                    <li>
                                        Present your documents clearly in front of the camera while recording the video.
                                    </li>
                                    <li>
                                        Complete the process and click 'Confirm' button to finalize submission.
                                    </li>

                                </ul>
                            </div>
                        </div>
                    </div>


                    {/* Technical Instructions Box */}
                    <div className="bg-green-100 p-3 rounded-xl w-full md:w-1/2 shadow">
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox" 
                                className="mt-2"
                                checked={termsAccepted.technical}
                                onChange={() => handleCheckboxChange('technical')}
                            />
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Technical Instructions</h2>
                                <ul className="list-decimal pl-5 text-sm space-y-2">
                                    <li>Use the Google Chrome browser for a seamless Video KYC experience.</li>
                                    <li>Ensure a stable high-speed internet connection.</li>
                                    <li>
                                        Enable camera, location, and microphone permissions for smooth processing.
                                    </li>
                                    <li>
                                        Close any unnecessary applications or tabs to enhance your device's performance during the Video KYC process.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-4">
                    <CommonButton
                        className="btn-login my-3 w-[200px]"
                        disabled={!allTermsAccepted}
                        onClick={handleConfirm}
                    >
                        &nbsp;Confirm&nbsp;
                    </CommonButton>
                </div>

                {showOptions && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                        <div className="img-container">
                            <img
                                src={vcallimg}
                                alt="KYC"
                                className="zoom-in-image"
                            />
                        </div>
                        <div className="text-center mt-4 flex flex-col items-center justify-center">
                            
                            <CommonButton
                                className="btn-login my-3 w-[200px]"
                                disabled={true} // Re-enable this when Self V-KYC is implemented
                            >
                                Self V-KYC
                            </CommonButton>

                            <CommonButton onClick={skipKyc}
                                className="btn-login my-3 w-[200px]"
                            >
                                Skip V-KYC
                            </CommonButton>

                            <CommonButton onClick={assistKyc}
                                className="btn-login my-3 w-[200px]"
                            >
                                Assisted V-KYC
                            </CommonButton>
                        </div>
                    </div>
                )}

                </>)

                : (<>
               <div className="w-full flex flex-col items-center">
                {/* Removed the debug output of meetingUrl here for cleaner UI */} 
            {meetingUrl ? (

            <a href={meetingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mb-4">Start</a>
            // <iframe
            //     src={meetingUrl}
            //     title="Assisted V-KYC"
            //     width="100%"
            //     height="800"
            //     style={{ border: '1px solid #ccc', borderRadius: '8px' }}
            //     allow="camera; microphone; fullscreen"
            // />
            //   <embed
            //     src={meetingUrl}
            //     title="Assisted V-KYC"
            //     width="100%"
            //     height="800"
            //     style={{ border: '1px solid #ccc', borderRadius: '8px' }}
            //     allow="camera; microphone; fullscreen"
                 
            // />
            ) : (
            <div className="my-8">Creating meeting, please wait...</div>
            )}
            
            <CommonButton
            className="btn-login my-3 w-[200px]"
            onClick={() => setAssistKycCall(false)} // This will close the iframe and go back to options
            >
            Close
            </CommonButton>


          </div>
                </>)
            }


        </>
    );
};

export default VideoKYCInstructions;






 