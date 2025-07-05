import React, { useEffect, useState, useCallback } from 'react';
import ImageCaptureValidator from './CustomerPhotoCapture';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { createAccountService, agentService, pendingAccountData } from '../../services/apiServices';

const PhotoCaptureApp = ({ formData, updateFormData, onNext, onBack, isSubmitting }) => {
    const [photoData, setPhotoData] = useState(null);
    const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
    const [apiPhotoData, setApiPhotoData] = useState(null);
    const storageKey = 'customerPhotoData';

    const { id } = useParams(); // This 'id' is likely the application_id from the URL
    // const { application_id } = useParams(); // This seems redundant if 'id' is application_id
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState(null);

    // Fetch reason data (unchanged)
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

    // Photo handling logic - Consolidated and Prioritized
    const fetchAndShowDetails = useCallback(async (currentId) => {
        try {
            if (currentId) {
                const response = await pendingAccountData.getDetailsS2C(currentId);
                console.log('photo to show : ', response);
                const application = response.photos || null;

                if (application && application.length > 0) {
                    const fetchedApiPhoto = application[0];
                    setApiPhotoData(fetchedApiPhoto);

                    let photoBlob = null;
                    let previewUrl = null;
                    try {
                        if (fetchedApiPhoto.path.startsWith('data:image')) { // Check if it's a base64 string
                            const arr = fetchedApiPhoto.path.split(",");
                            const mime = arr[0].match(/:(.*?);/)[1];
                            const bstr = atob(arr[1]);
                            let n = bstr.length;
                            const u8arr = new Uint8Array(n);
                            while (n--) {
                                u8arr[n] = bstr.charCodeAt(n);
                            }
                            photoBlob = new Blob([u8arr], { type: mime });
                        } else { // Assume it's a URL
                            const res = await fetch(fetchedApiPhoto.path);
                            photoBlob = await res.blob();
                        }
                        previewUrl = URL.createObjectURL(photoBlob);
                    } catch (blobError) {
                        console.error('Error creating blob/previewUrl from API photo path:', blobError);
                    }

                    const preparedPhotoData = {
                        file: photoBlob,
                        previewUrl: previewUrl,
                        timestamp: fetchedApiPhoto.created_at,
                        metadata: {
                            location: {
                                longitude: fetchedApiPhoto.longitude,
                                latitude: fetchedApiPhoto.latitude
                            },
                            validation: {
                                hasFace: true,
                                lightingOk: true,
                                singlePerson: true
                            }
                        }
                    };

                    setPhotoData(preparedPhotoData); // Set photoData to the API provided photo
                    // Also store in localStorage for persistence
                    localStorage.setItem(storageKey, JSON.stringify({
                        previewUrl: preparedPhotoData.previewUrl,
                        timestamp: preparedPhotoData.timestamp,
                        metadata: preparedPhotoData.metadata
                    }));
                } else {
                    // If no API photo, try to load from local storage
                    const storedData = localStorage.getItem(storageKey);
                    if (storedData) {
                        try {
                            const parsedData = JSON.parse(storedData);
                            setPhotoData(parsedData);
                        } catch (error) {
                            console.error('Error parsing stored photo data from localStorage:', error);
                            localStorage.removeItem(storageKey);
                        }
                    }
                }
            } else {
                // If no ID is available, try to load from local storage immediately
                const storedData = localStorage.getItem(storageKey);
                if (storedData) {
                    try {
                        const parsedData = JSON.parse(storedData);
                        setPhotoData(parsedData);
                    } catch (error) {
                        console.error('Error parsing stored photo data from localStorage:', error);
                        localStorage.removeItem(storageKey);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to fetch application details or process photo:', error);
            // Even if API fetch fails, try to load from local storage as a fallback
            const storedData = localStorage.getItem(storageKey);
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    setPhotoData(parsedData);
                } catch (parseError) {
                    console.error('Error parsing stored photo data from localStorage (fallback):', parseError);
                    localStorage.removeItem(storageKey);
                }
            }
        }
    }, []);

    useEffect(() => {
        // Use the 'id' from useParams as the application ID
        if (id) {
            fetchAndShowDetails(id);
        } else {
            // If no ID, still try to load from local storage for new applications
            const storedData = localStorage.getItem(storageKey);
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    setPhotoData(parsedData);
                } catch (error) {
                    console.error('Error parsing stored photo data (initial load without ID):', error);
                    localStorage.removeItem(storageKey);
                }
            }
        }
    }, [id, fetchAndShowDetails]); // Depend on 'id' and 'fetchAndShowDetails'


    const handlePhotoCapture = (capturedData) => {
        // UNCONDITIONALLY update photoData with the newly captured data
        setPhotoData(capturedData);
        // Clear any API data when a new photo is captured
        setApiPhotoData(null);

        // Prepare the data for localStorage (without the file object as it's not JSON serializable)
        const storageData = {
            previewUrl: capturedData.previewUrl,
            timestamp: capturedData.timestamp,
            metadata: capturedData.metadata
        };

        localStorage.setItem(storageKey, JSON.stringify(storageData));
    };

    const submitPhoto = async (e) => {
        // If there's no photo data or no file associated with it, prompt the user
        if (!photoData || !photoData.file) {
            const result = await Swal.fire({
                icon: 'warning',
                title: 'No Photo Captured',
                text: 'You have not captured a photo. Do you want to proceed without uploading a photo?',
                showCancelButton: true,
                confirmButtonText: 'Yes, Skip',
                cancelButtonText: 'No, Go Back'
            });
            if (result.isConfirmed) {
                onNext();
            }
            return;
        }

        setLocalIsSubmitting(true);

        // Use FormData for file upload
        const submitFormData = new FormData();
        // Use 'id' from useParams for application_id, or fallback to formData.application_id
        submitFormData.append('application_id', id || formData.application_id || '');

        // Add location data if available
        if (photoData.metadata?.location) {
            submitFormData.append('longitude', photoData.metadata.location.longitude ?? '');
            submitFormData.append('latitude', photoData.metadata.location.latitude ?? '');
        }

        // Add validation data if available
        if (photoData.metadata?.validation) {
            submitFormData.append('validation', JSON.stringify(photoData.metadata.validation));
        }

        // Ensure photoData.file is present and a Blob
        if (photoData.file instanceof Blob) {
            submitFormData.append('photo', photoData.file, 'customer_photo.jpeg'); // Add a filename
        } else {
            console.error("photoData.file is not a Blob, cannot append to FormData.");
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'The captured photo data is invalid. Please retake the photo.'
            });
            setLocalIsSubmitting(false);
            return;
        }

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

            // Update parent component with the photo data after successful submission
            updateFormData({
                ...formData,
                photoData: photoData // Pass the successfully submitted photo data
            });

            // Proceed to next step after successful submission
            onNext();
        } catch (error) {
            console.error('Photo submission error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.message || 'Failed to save photo. Please try again.'
            });
        } finally {
            setLocalIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-1">
            {/* Reason display */}
            {reason && <p className="text-red-500">Review For: {reason.applicant_live_photos_status_comment}</p>}

            {/* Loading overlay */}
            {(isSubmitting || localIsSubmitting || loading) && ( // Added 'loading' for initial data fetch
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            )}

            <ImageCaptureValidator
                onCapture={handlePhotoCapture}
                photoType="customer"
                showLocation={true}
                initialPhoto={photoData} // Pass photoData which now always reflects the current photo state
                hasExistingPhoto={apiPhotoData} // Keep this for conditional rendering of existing photo details within ImageCaptureValidator
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
                            Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                        </>
                    )}
                </CommonButton>
            </div>
        </div>
    );
};

export default PhotoCaptureApp;

 