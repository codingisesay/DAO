import React, { useState } from "react";
import vcallimg from '../../assets/imgs/vcall_illustration.jpg';
import CommonButton from "../../components/CommonButton";

const VideoKYCInstructions = () => {
    const [termsAccepted, setTermsAccepted] = useState({
        guidelines: false,
        technical: false
    });
    const [showOptions, setShowOptions] = useState(false);

    const handleCheckboxChange = (type) => {
        setTermsAccepted(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleConfirm = () => {
        setShowOptions(true);
    };

    const allTermsAccepted = termsAccepted.guidelines && termsAccepted.technical;

    return (
        <>
            <div className="flex flex-col md:flex-row gap-3 justify-center items-start">
                {/* Guidelines Box */}
                <div className="bg-green-100 p-3 rounded-xl w-full md:w-1/2 shadow">
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
                                    Complete the process and click the 'Confirm' button to finalize your submission.
                                </li>
                            </ul><br />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                            disabled={true}
                        >
                            Self V-KYC
                        </CommonButton>

                        <CommonButton
                            className="btn-login my-3 w-[200px]"
                        >
                            Skip V-KYC
                        </CommonButton>

                        <CommonButton
                            className="btn-login my-3 w-[200px]"
                        >
                            Assisted V-KYC
                        </CommonButton>
                    </div>
                </div>
            )}
        </>
    );
};

export default VideoKYCInstructions;