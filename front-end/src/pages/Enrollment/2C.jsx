import React, { useEffect, useState } from 'react';
import PhotoCapture from './CustomerPhotoCapture';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { livePhotoService } from '../../services/apiServices';

const PhotoCaptureApp = ({ formData, updateFormData, onNext, onBack, isSubmitting }) => {
    const [localFormData, setLocalFormData] = useState();
    const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
    const application_id = localStorage.getItem('application_id') || formData.application_id;
    const [isSubmitted, setIsSubmitted] =useState(0)
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
        if(isSubmitted===0){
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
            setIsSubmitted(prev => prev + 1)
            onNext();
        } catch (error) {   
            console.error('Photo submission error:',  error?.response?.data?.message.includes('photo'));

            if ( error?.response?.data?.message.includes('photo')){
                
            Swal.fire({
                icon: 'success',
                title: 'Photo saved successfully',
                showConfirmButton: false,
                timer: 1500
            }); 
            setIsSubmitted(prev => prev + 1)
            onNext();
            }
            else{

                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: error.response?.data?.message || 'Failed to save photo. Please try again.'
                        });
            }
        } finally {
            setLocalIsSubmitting(false);
        }
    }
    else{
        
            Swal.fire({
                icon: 'success',
                title: response.data.message || 'Photo saved successfully',
                showConfirmButton: false,
                timer: 1500
            });
            onNext();
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





 