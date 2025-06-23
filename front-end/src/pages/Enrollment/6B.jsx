

import React, { useEffect, useState } from 'react';
import ImageCaptureValidator from './CustomerPhotoCapture';
import CommonButton from '../../components/CommonButton'; 
import Swal from 'sweetalert2';
import { createAccountService } from '../../services/apiServices';

const AgentPhotoCaptureApp = ({ formData, updateFormData, onBack, isSubmitting }) => {
    const [photoData, setPhotoData] = useState(null);
    const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
    const application_id = localStorage.getItem('application_id') || formData.application_id;
    const storageKey = 'agentPhotoData';

    useEffect(() => {
        // Load saved photo data from localStorage
        const storedData = localStorage.getItem(storageKey);
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setPhotoData(parsedData);
            } catch (error) {
                console.error('Error parsing stored photo data:', error);
                localStorage.removeItem(storageKey);
            }
        }
    }, []);

    const handlePhotoCapture = (capturedData) => {
        // Store the full captured data in state
        setPhotoData(capturedData);
        
        // Prepare the data for localStorage (without the file object)
        const storageData = {
            previewUrl: capturedData.previewUrl,
            timestamp: capturedData.timestamp,
            metadata: capturedData.metadata
        };
        
        localStorage.setItem(storageKey, JSON.stringify(storageData));
    };

    const submitPhoto = async (e) => {
        // if (!photoData || !photoData.file) {  
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Error',
        //         text: 'Please capture a photo before submitting'
        //     });
        //     return;
        // }

        setLocalIsSubmitting(true);

        // Use FormData for file upload
        const submitFormData = new FormData();
        submitFormData.append('application_id', formData.application_id || application_id);
        
        // Add location data if available
        if (photoData.metadata?.location) {
            submitFormData.append('longitude', photoData.metadata.location.longitude ?? '');
            submitFormData.append('latitude', photoData.metadata.location.latitude ?? '');
        }
        
        // Add validation data if available
        if (photoData.metadata?.validation) {
            submitFormData.append('validation', JSON.stringify(photoData.metadata.validation));
        }
        
        submitFormData.append('photo', photoData.file);
        submitFormData.append('timestamp', photoData.timestamp);
        submitFormData.append('status', 'Pending');
        
        try {
            const response = await createAccountService.agentLivePhoto_s6b(submitFormData);
            let app_id = JSON.stringify(response.data.application_id); 
            
            Swal.fire({
                title: 'Application Created Successfully!', 
                text: 'Application Id : '+ app_id,
                icon: 'success',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Clear all related localStorage data
                    localStorage.removeItem('customerPhotoData');
                    localStorage.removeItem('agentPhotoData');
                    localStorage.removeItem('documentData');
                    window.location.href = '/agentdashboard'; // Redirect to the desired page
                }
            });

            // Update parent component with the photo data
            if (updateFormData) {
                updateFormData({
                    ...formData,
                    photoData: photoData
                });
            }
        } catch (error) {
            console.error('Photo submission error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.data?.message || 'Failed to save photo. Please try again.'
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

            <ImageCaptureValidator
                onCapture={handlePhotoCapture}
                photoType="agent"
                showLocation={true}
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
                    onClick={(e) => {
                        e.preventDefault();
                        submitPhoto();
                    }}
                    variant="contained"
                    className="btn-next"
                    disabled={!photoData || isSubmitting || localIsSubmitting}
                >
                    {localIsSubmitting ? (
                        <>
                            <span className="animate-spin inline-block mr-2">↻</span>
                            Processing...
                        </>
                    ) : (
                        'Submit'
                    )}
                </CommonButton>
            </div>
        </div>
    );
};

export default AgentPhotoCaptureApp;




















// import React, { useEffect, useState } from 'react';
// import PhotoCapture from './CustomerPhotoCapture';
// import CommonButton from '../../components/CommonButton'; 
// import Swal from 'sweetalert2';
// import { createAccountService } from '../../services/apiServices';

// const PhotoCaptureApp = ({ formData, updateFormData, onNext, onBack, isSubmitting }) => {
//     const [localFormData, setLocalFormData] = useState();
//     const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
//     const application_id = localStorage.getItem('application_id') || formData.application_id;

//     useEffect(() => {
//         const storedData = localStorage.getItem('agentPhotoData');
//         if (!storedData) {
//             console.error('No agentPhotoData found in localStorage');
//             return;
//         }
//         setLocalFormData(JSON.parse(storedData));
//     }, []);

 

//     const submitPhoto = async (e) => {
//         // Prevent default form submission if this is in a form
//         //    onNext();

//         if (!localFormData) {  
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: 'Please capture a photo before submitting'
//             });
//             return;
//         }

//         setLocalIsSubmitting(true);

//         // Use FormData for file upload
//         const submitFormData = new FormData();
//         submitFormData.append('application_id', formData.application_id || application_id);
//         submitFormData.append('longitude', localFormData.metadata?.location?.longitude ?? '');
//         submitFormData.append('latitude', localFormData.metadata?.location?.latitude ?? '');
//         submitFormData.append('photo', localFormData.file);
//         submitFormData.append('status', 'Pending');
        
//         try {
//             const response = await createAccountService.agentLivePhoto_s6b(submitFormData);
//             let app_id= JSON.stringify( response.data.application_id ); 
//             Swal.fire({
//                 title: 'Application Created Successfully!', 
//                 text: 'Application Id : '+ app_id ,
//                 icon: 'success',
//                 confirmButtonText: 'OK',
//             }).then((result) => {
//                 if (result.isConfirmed) {
//                     window.location.href = '/agentdashboard'; // Redirect to the desired page
//                 }
//             });
//             localStorage.removeItem('customerPhotoData');
//             localStorage.removeItem('agentPhotoData');
//             localStorage.removeItem('documentData');    
 
//             // Only call onNext after successful submission
//             // onNext();
//         } catch (error) {
//             console.error('Photo submission error:', error);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: JSON.stringify(error) || 'Failed to save photo. Please try again.'
//             }); 
//         } finally {
//             setLocalIsSubmitting(false); 
//         }
//     };

//     return (
//         <div className="space-y-8">
//             {/* Loading overlay */}
//             {(isSubmitting || localIsSubmitting) && (
//                 <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
//                 </div>
//             )}

//             <PhotoCapture
//                 photoType="agent"
//                 onCapture={(data) => {
//                     setLocalFormData(data);
//                     localStorage.setItem('agentPhotoData', JSON.stringify(data));
//                     console.log('Photo captured:', data);
//                 }}
//             />


//              <div className="next-back-btns z-10">
//                  <CommonButton onClick={onBack} variant="outlined" className="btn-back">
//                      <i className="bi bi-chevron-double-left"></i>&nbsp;Back
//                 </CommonButton>
//                 <CommonButton
//                       onClick={(e) => {
//                         e.preventDefault(); // Prevent default form submission
//                         submitPhoto();
//                     }}

//                     // onClick={() => submitAgentPic(localFormData)}
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

 


 