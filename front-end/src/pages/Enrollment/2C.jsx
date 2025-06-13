
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
        const storedData = localStorage.getItem('customerPhotoData');
        if (!storedData) {
            console.error('No customerPhotoData found in localStorage');
            return;
        }
        setLocalFormData(JSON.parse(storedData));
    }, []);

 

    const submitPhoto = async (e) => {
        // Prevent default form submission if this is in a form
           onNext();

        // if (!localFormData) {  
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Error',
        //         text: 'Please capture a photo before submitting'
        //     });
        //     return;
        // }

        // setLocalIsSubmitting(true);

        // // Use FormData for file upload
        // const submitFormData = new FormData();
        // submitFormData.append('application_id', formData.application_id || application_id);
        // submitFormData.append('longitude', localFormData.metadata?.location?.longitude ?? '');
        // submitFormData.append('latitude', localFormData.metadata?.location?.latitude ?? '');
        // submitFormData.append('photo', localFormData.file);
        // submitFormData.append('status', 'Pending');
        
        // try {
        //     const response = await createAccountService.livePhoto_s2c(submitFormData);

        //     Swal.fire({
        //         icon: 'success',
        //         title: response.data.message || 'Photo saved successfully',
        //         showConfirmButton: false,
        //         timer: 1500
        //     });

        //     updateFormData({
        //         ...formData,
        //         photoData: localFormData
        //     });

        //     // Only call onNext after successful submission
        //     onNext();
        // } catch (error) {
        //     console.error('Photo submission error:', error);
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Error',
        //         text: error?.data?.message +` Retake and Save Photo` || 'Failed to save photo. Please try again.'
        //     });
        // } finally {
        //     setLocalIsSubmitting(false); 
        // }
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
            </div>
        </div>
    );
};

export default PhotoCaptureApp;

 