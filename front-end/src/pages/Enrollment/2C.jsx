import React, { useEffect, useState } from 'react';
import ImageCaptureValidator from './CustomerPhotoCapture';
import CommonButton from '../../components/CommonButton'; 
import Swal from 'sweetalert2';
import { createAccountService } from '../../services/apiServices';

const PhotoCaptureApp = ({ formData, updateFormData, onNext, onBack, isSubmitting }) => {
    const [photoData, setPhotoData] = useState(null);
    const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
    const application_id = localStorage.getItem('application_id') || formData.application_id;
    const storageKey = 'customerPhotoData';

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
        if (!photoData || !photoData.file) {  
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
            const response = await createAccountService.livePhoto_s2c(submitFormData);

            Swal.fire({
                icon: 'success',
                title: response.data.message || 'Photo saved successfully',
                showConfirmButton: false,
                timer: 1500
            });

            // Update parent component with the photo data
            updateFormData({
                ...formData,
                photoData: photoData
            });

            // Proceed to next step after successful submission
            onNext();
        } catch (error) {
            console.error('Photo submission error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.data?.message +` Retake and Save Photo` || 'Failed to save photo. Please try again.'
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
                photoType="customer"
                showLocation={true}
            />

            <div className="next-back-btns z-10">
                <CommonButton
                    onClick={onBack}
                    variant="outlined"
                    className="btn-back z-10"
                    disabled={isSubmitting || localIsSubmitting}
                    type="button"
                >
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton
                    onClick={(e) => {
                        e.preventDefault();
                        submitPhoto();
                    }}
                    variant="contained"
                    className="btn-next z-10"
                    disabled={!photoData || isSubmitting || localIsSubmitting}
                    type="button"
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



 