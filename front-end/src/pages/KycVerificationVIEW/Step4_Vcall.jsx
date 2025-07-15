
import React, { useState, useEffect } from 'react';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import   { pendingKycStusUpdate, pendingKyc } from '../../services/apiServices'; // <-- Import your service
import { useNavigate } from 'react-router-dom';
 
function MyPage({ onNext, onBack }) {
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
                    body: JSON.stringify({ kyc_application_id: 37 })
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

    if (loading) {
        return <div>Loading reason...</div>;
    }

    if (!reason) {
        return <div>No reason found or an error occurred.</div>;
    }

    return (
   
        <div>
            
      <h1 className="text-xl font-bold flex justify-between text-gray-800 mb-3">
        Pending application: {id}
      </h1>
            <h1 className='text-xl font-bold '>Video - KYC</h1> 
            {reason.data && reason.data[0] &&
                <><video
                    controls
                    className="w-[50%] mx-auto mt-5 rounded-lg shadow-lg border-8 border-green-300"
                    src={`https://vcall.payvance.co.in/storage/${reason.data[0].file_path}`}
                    />

                </>
            }


             <div className="next-back-btns z-10">
                 <CommonButton className="btn-back border-0" onClick={onBack}>
                     <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                 </CommonButton>
                 <CommonButton className="btn-next border-0" onClick={() => navigate('/admindashboard')}>
                     Cancel
                 </CommonButton>
             </div>
        </div>
    );
}

export default MyPage;



// import React, { useState, useEffect } from 'react';
// import CommonButton from '../../components/CommonButton';
// import Swal from 'sweetalert2';
// import { useParams } from 'react-router-dom';
// import   { pendingKycStusUpdate, pendingKyc } from '../../services/apiServices'; // <-- Import your service
// import { useNavigate } from 'react-router-dom';
 
// function p4({ onNext, onBack }) { 
//     const navigate = useNavigate();
//     const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];
//     const { id } = useParams();
 
//     return (
//         <>

//             <p className="text-xl font-bold">Video - KYC</p>
 
//             <div className="next-back-btns z-10">
//                 <CommonButton className="btn-back border-0" onClick={onBack}>
//                     <i className="bi bi-chevron-double-left"></i>&nbsp;Back
//                 </CommonButton>
//                 <CommonButton className="btn-next border-0" onClick={() => navigate('/admindashboard')}>
//                     Cancel
//                 </CommonButton>
//             </div>
//         </>);
// }

// export default p4;