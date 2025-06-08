import React, { useEffect, useState } from 'react';
import PhotoCapture from './CustomerPhotoCapture';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { livePhotoService } from '../../services/apiServices';

const PhotoCaptureApp = ({ formData, updateFormData, onNext, onBack, isSubmitting }) => {
    const [localFormData, setLocalFormData] = useState();
    const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
    const application_id = localStorage.getItem('application_id') || formData.application_id;

    useEffect(() => {
        const storedData = localStorage.getItem('customerPhotoData');
        if (!storedData) {
            console.error('No customerPhotoData found in localStorage');
            return;
        }
        setLocalFormData(JSON.parse(storedData));
    }, []);

    const submitPhoto = async () => {
        if (!localFormData) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please capture a photo before submitting'
            });
            return;
        }

        setLocalIsSubmitting(true);

        const payload = {
            application_id: formData.application_id || application_id,
            longitude: localFormData.metadata?.location?.longitude
                ? JSON.stringify(localFormData.metadata.location.longitude)
                : null,
            latitude: localFormData.metadata?.location?.latitude
                ? JSON.stringify(localFormData.metadata.location.latitude)
                : null,
            photo: localFormData.file,
            ...localFormData,
            status: 'Pending'
        };

        try {
            const response = await livePhotoService.upload(payload);

            Swal.fire({
                icon: 'success',
                title: response.data.message || 'Photo saved successfully',
                showConfirmButton: false,
                timer: 1500
            });

            // Update parent form data if needed
            updateFormData({
                ...formData,
                photoData: payload
            });

            onNext();
        } catch (error) {
            console.error('Photo submission error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to save photo. Please try again.'
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
                photoType="customer"
                onCapture={(data) => {
                    setLocalFormData(data);
                    localStorage.setItem('customerPhotoData', JSON.stringify(data));
                    console.log('Photo captured:', data);
                }}
            />

            <div className="next-back-btns z-10">
                <CommonButton
                    onClick={onBack}
                    variant="outlined"
                    className="btn-back"
                    disabled={isSubmitting || localIsSubmitting}
                >
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton
                    onClick={submitPhoto}
                    variant="contained"
                    className="btn-next"
                    disabled={!localFormData || isSubmitting || localIsSubmitting}
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
            </div>
        </div>
    );
};

export default PhotoCaptureApp;























// import React, { useEffect, useState } from 'react';
// import PhotoCapture from './CustomerPhotoCapture';
// // import { daoApi } from '../../utils/storage';
// import { API_ENDPOINTS } from '../../services/api';
// import CommonButton from '../../components/CommonButton';
// import Swal from 'sweetalert2'
// import { daoApi } from '../../utils/storage';
// import { livePhotoService, applicationDetailsService } from '../../services/apiServices';


// const PhotoCaptureApp = ({ formData, updateFormData, onNext, onBack }) => {
//     const [localFormData, setLocalFormData] = useState();
//     const application_id = localStorage.getItem('application_id') || formData.application_id;

//     useEffect(() => {
//         const storedData = localStorage.getItem('customerPhotoData');

//         if (!storedData) {
//             console.error('No customerPhotoData found in localStorage');
//             return;
//         }
//         setLocalFormData(JSON.parse(storedData));
//     }, []);



//     const submitaddress = async (localFormData) => {
//         const payload = {
//             application_id: formData.application_id || application_id,
//             longitude: JSON.stringify(localFormData.metadata.location.longitude) || null,
//             latitude: JSON.stringify(localFormData.metadata.location.latitude) || null,
//             photo: localFormData.file,
//             ...localFormData,
//             status: 'Pending'
//         };
//         console.log('ready photodata to send : ', payload)

//         try {
//             const response = await daoApi.post(livePhotoService.upload(payload));
//             // const response = await daoApi.post(API_ENDPOINTS.LIVE_PHOTO.CREATE, payload);
//             Swal.fire({
//                 icon: 'success',
//                 title: response.data.message || 'Address details saved successfully.',
//                 showConfirmButton: false,
//                 timer: 1500
//             });


//             onNext();
//         } catch (error) {
//             console.log(error)
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: JSON.stringify(error)
//             });
//         }
//     }


//     return (
//         <div className="space-y-8 ">
//             <PhotoCapture
//                 photoType="customer"
//                 onCapture={(data) => { setLocalFormData(data); console.log('After cature : ', data) }}
//             />


//             {/* om integration button/ */}
//             <div className="next-back-btns z-10">
//                 <CommonButton onClick={onBack} variant="outlined" className="btn-back">
//                     <i className="bi bi-chevron-double-left"></i>&nbsp;Back
//                 </CommonButton>
//                 <CommonButton onClick={() => submitaddress(localFormData)} variant="contained" className="btn-next">
//                     Next&nbsp;<i className="bi bi-chevron-double-right"></i>
//                 </CommonButton>
//             </div>




//         </div >
//     );
// };

// export default PhotoCaptureApp;