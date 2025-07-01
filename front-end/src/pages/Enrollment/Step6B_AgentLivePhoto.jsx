import React, { useEffect, useState } from 'react';
import ImageCaptureValidator from './AgentPhotoCapture';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { createAccountService, pendingAccountData } from '../../services/apiServices';

const AgentPhotoCaptureApp = ({ formData, updateFormData, onBack, isSubmitting }) => {
    const [photoData, setPhotoData] = useState(null);
    const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
    const [apiPhotoData, setApiPhotoData] = useState(null);
    const application_id = localStorage.getItem('application_id') || formData.application_id;
    const storageKey = 'agentPhotoData';

    useEffect(() => {
        const id = localStorage.getItem('application_id');
        if (id) { 
            fetchAndShowDetails(id);
        }
    }, []);
    
    const fetchAndShowDetails = async (id) => {
        try { 
            if (id) {
                const response = await pendingAccountData.getDetailsS6B(id);
                const application = response.photos || null;
                
                if(application && application.length > 0) {
                    setApiPhotoData(application[0]);
                    
                    // Convert API photo data to match our expected format
                    const photoBlob = await fetch(application[0].path)
                        .then(res => res.blob());
                    
                    const preparedPhotoData = {
                        file: photoBlob,
                        previewUrl: URL.createObjectURL(photoBlob),
                        timestamp: application[0].created_at,
                        metadata: {
                            location: {
                                longitude: application[0].longitude,
                                latitude: application[0].latitude
                            },
                            validation: {
                                hasFace: true,
                                lightingOk: true,
                                singlePerson: true
                            }
                        }
                    };
                    
                    setPhotoData(preparedPhotoData);
                    localStorage.setItem(storageKey, JSON.stringify({
                        previewUrl: preparedPhotoData.previewUrl,
                        timestamp: preparedPhotoData.timestamp,
                        metadata: preparedPhotoData.metadata
                    }));
                }
            }
        } catch (error) {
            console.error('Failed to fetch application details:', error);
        }
    };

    useEffect(() => {
        // Load saved photo data from localStorage only if no API data
        if (!apiPhotoData) {
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
        }
    }, [apiPhotoData]);

    const handlePhotoCapture = (capturedData) => {
        // Store the full captured data in state
        setPhotoData(capturedData);
        setApiPhotoData(null); // Clear any API data when new photo is captured

        // Prepare the data for localStorage (without the file object)
        const storageData = {
            previewUrl: capturedData.previewUrl,
            timestamp: capturedData.timestamp,
            metadata: capturedData.metadata
        };

        localStorage.setItem(storageKey, JSON.stringify(storageData));
    };

    const submitPhoto = async (e) => {
        if(apiPhotoData){
            Swal.fire({
                title: 'Application Created Successfully!', 
                text: 'Application Id : '+ application_id,
                icon: 'success',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Clear all related localStorage data
                    localStorage.removeItem('customerPhotoData');
                    localStorage.removeItem('agentPhotoData');
                    localStorage.removeItem('documentData');
                    localStorage.removeItem('application_id');
                    window.location.href = '/agentdashboard'; // Redirect to the desired page
                }
            });
        }
        else {
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
                        localStorage.removeItem('application_id');
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
                initialPhoto={photoData}
                hasExistingPhoto={apiPhotoData}
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
                    disabled={(!photoData && !apiPhotoData) || isSubmitting || localIsSubmitting}
                >
                    {(isSubmitting || localIsSubmitting) ? (
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