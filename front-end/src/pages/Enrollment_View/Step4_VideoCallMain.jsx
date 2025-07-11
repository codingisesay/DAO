import React, {useEffect, useState} from 'react';
// import LivePhoto from './2C';
import VideoKYCInstructions from './Step4A_VideoCallScreen';
import CommonButton from '../../components/CommonButton';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function p4({ onNext, onBack }) {

 const [reason, setReason] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); 
    const APIURL = 'https://vcall.payvance.co.in/api/fetch-video-details';

    useEffect(() => {
        const loadReason = async () => {
            try {
                setLoading(true);
                const response = await fetch(APIURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ kyc_application_id: id })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setReason(data);
            } catch (error) {
                console.error("Error loading reason:", error);
                setReason(null);
            } finally {
                setLoading(false);
            }
        };

        loadReason();
    }, [id]);
 
    return (
        <>
            <div className="form-container">
                {/* <h2 className="text-xl font-bold mb-2">Video KYC</h2>/ */} 
        <div>
            
      <h1 className="text-xl font-bold flex justify-between text-gray-800 mb-3">
        Pending application: {id}
      </h1>
            <h1 className='text-xl font-bold '>Video - KYC</h1> 
            {reason && reason.data ? 
            
            (
            reason.data[0] ?
                <><video
                    controls
                    className="w-[50%] mx-auto mt-5 rounded-lg shadow-lg border-8 border-green-300"
                    src={`https://vcall.payvance.co.in/storage/${reason.data[0].file_path}`}
                    />

                </>
                :<></> 
                
            )
                :<>No Video Call Available</>
            }

 
        </div>

                <div className="next-back-btns">
                    <CommonButton className="btn-back" onClick={onBack}>
                        <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                    </CommonButton>

                    <CommonButton className="btn-next" onClick={onNext}>
                        Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                    </CommonButton>
                </div>

            </div>
        </>);
}

export default p4;