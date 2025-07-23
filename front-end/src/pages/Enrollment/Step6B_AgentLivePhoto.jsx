import React, { useEffect, useState } from 'react';
import ImageCaptureValidator from './agentliveCapture'; // Make sure this path is correct
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { createAccountService, agentService, pendingAccountData } from '../../services/apiServices';

const AgentPhotoCaptureApp = ({ formData, updateFormData, onNext, onBack, isSubmitting }) => {
    const [photoData, setPhotoData] = useState(null);
    const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
    const [apiPhotoData, setApiPhotoData] = useState(null); 
    const storageKey = 'agentPhotoData';
    
    const id = localStorage.getItem('application_id');
    const application_id = localStorage.getItem('application_id');

    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState(null);

    // Fetch reason data
    useEffect(() => {
        if (!id) return;

        const fetchReason = async () => {
            try {
                setLoading(true);
                const response = await agentService.refillApplication(id);
                setReason(response.data[0]);
            } catch (error) {
                console.error("Failed to fetch review applications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReason();
    }, [id]);

    // Photo handling logic
    useEffect(() => { 
        if (id) { 
            fetchAndShowDetails(id);
        } else {
            // If no application_id, still try to load from local storage
            const storedData = localStorage.getItem(storageKey);
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    setPhotoData(parsedData);
                } catch (error) {
                    console.error("Error parsing stored photo data:", error);
                    localStorage.removeItem(storageKey);
                }
            }
        }
    }, [id]);
    
    const fetchAndShowDetails = async (id) => {
        try { 
            if (id) {
                const response = await pendingAccountData.getDetailsS6B(id);
                const application = response.services || null;
                
                if(application && application.length > 0) {
                    setApiPhotoData(application[0]);
                    
                    let photoBlob = null;
                    let previewUrl = null;
                    try {
                        if (application[0].path.startsWith("data:")) {
                            const arr = application[0].path.split(",");
                            const mime = arr[0].match(/:(.*?);/)[1];
                            const bstr = atob(arr[1]);
                            let n = bstr.length;
                            const u8arr = new Uint8Array(n);
                            while (n--) {
                                u8arr[n] = bstr.charCodeAt(n);
                            }
                            photoBlob = new Blob([u8arr], { type: mime });
                        } else {
                            const res = await fetch(application[0].path);
                            photoBlob = await res.blob();
                        }
                        previewUrl = URL.createObjectURL(photoBlob);
                    } catch (blobError) {
                        console.error(
                            "Error creating blob/previewUrl from API photo path:",
                            blobError
                        );
                    }
                    
                    const preparedPhotoData = {
                        file: photoBlob,
                        previewUrl: previewUrl,
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
            const storedData = localStorage.getItem(storageKey);
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    setPhotoData(parsedData);
                } catch (parseError) {
                    console.error("Error parsing stored photo data:", parseError);
                    localStorage.removeItem(storageKey);
                }
            }
        }
    };

    const handlePhotoCapture = (capturedData) => {
        setPhotoData(capturedData);
        setApiPhotoData(null); 

        const storageData = {
            previewUrl: capturedData.previewUrl,
            timestamp: capturedData.timestamp,
            metadata: capturedData.metadata
        };

        localStorage.setItem(storageKey, JSON.stringify(storageData));
    };

    const submitPhoto = async (e) => { 
        // if(apiPhotoData && photoData) { 
     
        //     Swal.fire({
        //         title: 'Application Created Successfully!', 
        //         text: 'Application Number : ' + id,
        //         icon: 'success',
        //         confirmButtonText: 'OK',
        //     }).then((result) => {
        //         if (result.isConfirmed) {
        //             localStorage.removeItem('customerPhotoData');
        //             localStorage.removeItem('agentPhotoData');
        //             localStorage.removeItem('documentData');
        //             window.location.href = '/agentdashboard'; 
        //         }
        //     });
        //     return;
        // }

        // if (!photoData || !photoData.file) {
        //     const result = await Swal.fire({
        //         icon: "warning",
        //         title: "No Photo Captured",
        //         text: "You have not captured a photo. Do you want to proceed without uploading a photo?",
        //         showCancelButton: true,
        //         confirmButtonText: "Yes, Skip",
        //         cancelButtonText: "No, Go Back",
        //     });
        //     if (result.isConfirmed) {
        //         localStorage.removeItem('customerPhotoData');
        //         localStorage.removeItem('agentPhotoData');
        //         localStorage.removeItem('documentData');
        //         window.location.href = '/agentdashboard'; 
        //     }
        //     return;
        // }

      
        try {
              setLocalIsSubmitting(true);

        const submitFormData = new FormData();
        submitFormData.append('application_id', localStorage.getItem('application_id'));
        
        if (photoData.metadata?.location) {
            submitFormData.append('longitude', photoData.metadata.location.longitude ?? '');
            submitFormData.append('latitude', photoData.metadata.location.latitude ?? '');
        }

        if (photoData.metadata?.validation) {
            submitFormData.append('validation', JSON.stringify(photoData.metadata.validation));
        }

        if (photoData.file instanceof Blob) {
            submitFormData.append('photo', photoData.file, "agent_photo.jpeg"); 
        } else {
            console.error(
                "photoData.file is not a Blob, cannot append to FormData."
            );
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "The captured photo data is invalid. Please retake the photo.",
            });
            setLocalIsSubmitting(false);
            return;
        }

        submitFormData.append('timestamp', photoData.timestamp);
        submitFormData.append('status', 'Pending');

            await createAccountService.agentLivePhoto_s6b(submitFormData);

            Swal.fire({
                title: 'Application Created Successfully!', 
                text: 'Application Number : ' + id,
                icon: 'success',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('customerPhotoData');
                    localStorage.removeItem('agentPhotoData');
                    localStorage.removeItem('documentData');
                    window.location.href = '/agentdashboard'; 
                }
            });
        } catch (error) {
            console.error('Photo submission error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                // text: error?.response?.data?.message || 'Failed to save photo. Please try again.'
                text: 'Photo is mendatory' || 'Failed to save photo. Please try again.' 
            });
        } finally {
            setLocalIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-1">
            {reason && <p className="text-red-500">Review For: {reason.applicant_live_photos_status_comment}</p>}
            
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
                    type="button"
                >
                    {(isSubmitting || localIsSubmitting) ? (
                        <>
                            <span className="animate-spin inline-block mr-2">↻</span>
                            Processing...
                        </>
                    ) : (
                        <>
                           Submit
                        </>
                    )}
                </CommonButton>
            </div>
        </div>
    );
};

export default AgentPhotoCaptureApp;




 