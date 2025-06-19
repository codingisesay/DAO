
import React, { useEffect, useState } from 'react';
import PhotoCapture from './CustomerPhotoCapture';
import CommonButton from '../../components/CommonButton'; 
import Swal from 'sweetalert2';
import { createAccountService } from '../../services/apiServices';

const PhotoCaptureApp = ({ formData, updateFormData, onNext, onBack, isSubmitting }) => {
    const [localFormData, setLocalFormData] = useState();
    const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
    const application_id = localStorage.getItem('application_id') || formData.application_id;

    useEffect(() => {
        const storedData = localStorage.getItem('agentPhotoData');
        if (!storedData) {
            console.error('No agentPhotoData found in localStorage');
            return;
        }
        setLocalFormData(JSON.parse(storedData));
    }, []);

 

    const submitPhoto = async (e) => {
        // Prevent default form submission if this is in a form
        //    onNext();

        if (!localFormData) {  
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please capture a photo before submitting'
            });
            return;
        }

        setLocalIsSubmitting(true);

        // Use FormData for file upload
        const submitFormData = new FormData();
        submitFormData.append('application_id', formData.application_id || application_id);
        submitFormData.append('longitude', localFormData.metadata?.location?.longitude ?? '');
        submitFormData.append('latitude', localFormData.metadata?.location?.latitude ?? '');
        submitFormData.append('photo', localFormData.file);
        submitFormData.append('status', 'Pending');
        
        try {
            const response = await createAccountService.agentLivePhoto_s6b(submitFormData);

            Swal.fire({
                title: 'Application Created Successfully!',
                // text: 'Your account has been created successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/agentdashboard'; // Redirect to the desired page
                }
            });
            localStorage.removeItem('customerPhotoData');
            localStorage.removeItem('agentPhotoData');
            localStorage.removeItem('documentData');
 
            // Only call onNext after successful submission
            // onNext();
        } catch (error) {
            console.error('Photo submission error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: JSON.stringify(error) || 'Failed to save photo. Please try again.'
            }); 
        } finally {
            setLocalIsSubmitting(false); 
        }
    };

    return (
        <div className="space-y-8">
            {/* Loading overlay */}
            {(isSubmitting || localIsSubmitting) && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            )}

            <PhotoCapture
                photoType="agent"
                onCapture={(data) => {
                    setLocalFormData(data);
                    localStorage.setItem('agentPhotoData', JSON.stringify(data));
                    console.log('Photo captured:', data);
                }}
            />


             <div className="next-back-btns z-10">
                 <CommonButton onClick={onBack} variant="outlined" className="btn-back">
                     <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default form submission
                        submitPhoto();
                    }}

                    // onClick={() => submitAgentPic(localFormData)}
                    variant="contained"
                    className="btn-next"
                >
                    Submit 
                </CommonButton>
            </div>

{/* 
            <div className="next-back-btns z-10">
                <CommonButton
                    onClick={onBack}
                    variant="outlined"
                    className="btn-back z-10"
                    disabled={isSubmitting || localIsSubmitting}
                    type="button" // Ensure this doesn't submit form
                >
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton
                    onClick={(e) => {
                        e.preventDefault(); // Prevent default form submission
                        submitPhoto();
                    }}
                    variant="contained"
                    className="btn-next z-10"
                    disabled={ isSubmitting || localIsSubmitting}
                    type="button" // Important: Set type to button to prevent form submission
                >
                    {(isSubmitting || localIsSubmitting) ? (
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
            </div> */}
        </div>
    );
};

export default PhotoCaptureApp;

 




// import React, { useEffect, useState } from 'react';
// import PhotoCapture from './CustomerPhotoCapture';
// import CommonButton from '../../components/CommonButton';
// import Swal from 'sweetalert2';
// import { apiService } from '../../utils/storage';
// import { agentlivephotoSave  ,createAccountService} from '../../services/apiServices';

// const PhotoCaptureApp = ({ formData, updateFormData, onNext, onBack }) => {
//     const [localFormData, setLocalFormData] = useState();
//     const application_id = localStorage.getItem('application_id') || formData.application_id;

//     useEffect(() => {
//         const storedData = localStorage.getItem('agentPhotoData');

//         if (!storedData) {
//             console.error('No agentPhotoData found in localStorage');
//             return;
//         }
//         setLocalFormData(JSON.parse(storedData));
//     }, []);

//     const submitAgentPic = async (localFormData) => {
//         const payload = {
//             application_id: formData.application_id || application_id,
//             // longitude: JSON.stringify(localFormData.metadata.location.longitude),
//             // latitude: JSON.stringify(localFormData.metadata.location.latitude),
//             // photo: localFormData.file || '', 
//             ...localFormData,
//             status: 'Pending'
//         };
//         console.log('ready photodata to send : ', payload)

//         try {
//             const response = await apiService.post(createAccountService.agentLivePhoto_s6b(payload));
//             Swal.fire({
//                 title: 'Account Created Successfully!',
//                 text: 'Your account has been created successfully.',
//                 icon: 'success',
//                 confirmButtonText: 'OK',
//             }).then((result) => {
//                 if (result.isConfirmed) {
//                     window.location.href = '/agentdashboard'; // Redirect to the desired page
//                 }
//             });
//             localStorage.removeItem('customerPhotoData');

//         } catch (error) {
//             console.log(error)
//             Swal.fire({
//                 title: 'Account Created Successfully!',
//                 text: 'Your account has been created successfully.',
//                 icon: 'success',
//                 confirmButtonText: 'OK',
//             }).then((result) => {
//                 if (result.isConfirmed) {
//                     window.location.href = '/agentdashboard'; // Redirect to the desired page
//                 }
//             });

//         }
//     }

//     return (
//         <div className="space-y-8 ">
//             <PhotoCapture
//                 photoType="agent"
//                 onCapture={(data) => { setLocalFormData(data); console.log('After capture : ', data); }}
//             />

//             <div className="next-back-btns z-10">
//                 <CommonButton onClick={onBack} variant="outlined" className="btn-back">
//                     <i className="bi bi-chevron-double-left"></i>&nbsp;Back
//                 </CommonButton>
//                 <CommonButton
//                     onClick={() => submitAgentPic(localFormData)}
//                     variant="contained"
//                     className="btn-next"
//                 >
//                     Submit 
//                 </CommonButton>
//             </div>



//         </div>
//     );
// };

// export default PhotoCaptureApp;



