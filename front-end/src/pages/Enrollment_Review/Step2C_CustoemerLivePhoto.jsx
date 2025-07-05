// Step2C_CustoemerLivePhoto.jsx
import React, { useEffect, useState, useCallback } from "react"; // Import useCallback
import ImageCaptureValidator from "./CustomerPhotoCapture";
import CommonButton from "../../components/CommonButton";
import Swal from "sweetalert2";
import {useParams} from "react-router-dom";
import { agentService,
  createAccountService,
  pendingAccountData,
} from "../../services/apiServices";

const PhotoCaptureApp = ({ formData, onNext, onBack, isSubmitting }) => {
  const [photoData, setPhotoData] = useState(null);
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [apiPhotoData, setApiPhotoData] = useState(null); 
        const [loading, setLoading] = useState(false);
        const [reason, setReason] = useState(null);   const {id}=useParams();
  const application_id =
    localStorage.getItem("application_id") || formData.application_id;
  
  const storageKey = "customerPhotoData";

  // Use useCallback for fetchAndShowDetails to prevent unnecessary re-renders/re-creations
  const fetchAndShowDetails = useCallback(async (id) => {
    try {
      if (id) {
        const response = await pendingAccountData.getDetailsS2C(id);
        const application = response.photos || null;

        if (application && application.length > 0) {
          const fetchedApiPhoto = application[0];
          setApiPhotoData(fetchedApiPhoto);

          // Fetch the blob for initial display if needed, but don't store in photoData if a new photo is to be taken
          // For display purposes only, we can construct a previewUrl without storing the actual file in state
          // if you want to explicitly avoid having a "file" object in photoData when it comes from API.
          // However, to keep it consistent, let's try to get a blob if possible.
          let photoBlob = null;
          let previewUrl = null;
          try {
            // Assuming fetchedApiPhoto.path is a URL or base64
            if (fetchedApiPhoto.path.startsWith("data:")) {
              // If it's a base64 string, convert it to Blob
              const arr = fetchedApiPhoto.path.split(",");
              const mime = arr[0].match(/:(.*?);/)[1];
              const bstr = atob(arr[1]);
              let n = bstr.length;
              const u8arr = new Uint8Array(n);
              while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
              }
              photoBlob = new Blob([u8arr], { type: mime });
            } else {
              // If it's a URL, fetch it
              const res = await fetch(fetchedApiPhoto.path);
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
            file: photoBlob, // This will be null if fetching/conversion failed for existing photo
            previewUrl: previewUrl,
            timestamp: fetchedApiPhoto.created_at,
            metadata: {
              location: {
                longitude: fetchedApiPhoto.longitude,
                latitude: fetchedApiPhoto.latitude,
              },
              validation: {
                hasFace: true, // Assuming this from API response structure
                lightingOk: true,
                singlePerson: true,
              },
            },
          };

          setPhotoData(preparedPhotoData); // Set photoData to the API provided photo
          // Also store in localStorage if desired, but prioritize API data
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              previewUrl: preparedPhotoData.previewUrl,
              timestamp: preparedPhotoData.timestamp,
              metadata: preparedPhotoData.metadata,
            })
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch application details:", error);
      // Even if API fetch fails, try to load from local storage
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
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    const id = localStorage.getItem("application_id");
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
  }, [fetchAndShowDetails]); // Add fetchAndShowDetails to dependencies to prevent stale closure if it changes

  const handlePhotoCapture = (capturedData) => {
    // UNCONDITIONALLY update photoData with the newly captured data
    setPhotoData(capturedData);
    // Also clear apiPhotoData because a new photo has been taken
    setApiPhotoData(null);

    // Prepare the data for localStorage (without the file object as it's not JSON serializable)
    const storageData = {
      previewUrl: capturedData.previewUrl,
      timestamp: capturedData.timestamp,
      metadata: capturedData.metadata,
    };
    localStorage.setItem(storageKey, JSON.stringify(storageData));
  };

  
    useEffect(() => {     
        const fetchReason = async (id) => { 
            if (!id) return;
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
     
        fetchReason(id);
    }, [id]); 
  const submitPhoto = async (e) => {
    // Removed the check for apiPhotoData here.
    // If a new photo is captured (photoData will be updated), it will be submitted.
    // If no new photo is captured but there's an existing API photo,
    // photoData will contain that (though its 'file' property might be null depending on fetchAndShowDetails),
    // but the prompt below will handle the no-photo scenario.

    if (apiPhotoData) {
      Swal.fire({
        icon: "success",
        title:  "Customer Photo saved successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      onNext();
    } else {
      if (!photoData || !photoData.file) {
        const result = await Swal.fire({
          icon: "warning",
          title: "No Photo Captured",
          text: "You have not captured a photo. Do you want to proceed without uploading a photo?",
          showCancelButton: true,
          confirmButtonText: "Yes, Skip",
          cancelButtonText: "No, Go Back",
        });
        if (result.isConfirmed) {
          onNext();
        }
        return;
      }

      setLocalIsSubmitting(true);

      const submitFormData = new FormData();
      submitFormData.append(
        "application_id",
        formData.application_id || application_id
      );

      if (photoData.metadata?.location) {
        submitFormData.append(
          "longitude",
          photoData.metadata.location.longitude ?? ""
        );
        submitFormData.append(
          "latitude",
          photoData.metadata.location.latitude ?? ""
        );
      }

      if (photoData.metadata?.validation) {
        submitFormData.append(
          "validation",
          JSON.stringify(photoData.metadata.validation)
        );
      }

      // Ensure photoData.file is present and a Blob
      if (photoData.file instanceof Blob) {
        submitFormData.append("photo", photoData.file, "customer_photo.jpeg"); // Add a filename
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

      submitFormData.append("timestamp", photoData.timestamp);
      submitFormData.append("status", "Pending");

      try {
        const response = await createAccountService.livePhoto_s2c(
          submitFormData
        );
        Swal.fire({
          icon: "success",
          title:  "Customer Photo saved successfully",
          showConfirmButton: false,
          timer: 1500,
        });

        onNext();
      } catch (error) {
        console.error("Photo submission error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error?.response?.data?.message ||
            "Failed to save photo. Please try again.", // Use error.response.data.message for Axios errors
        });
      } finally {
        setLocalIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      {(isSubmitting || localIsSubmitting) && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}

   <h2 className="text-xl font-bold m-2">Customer Photo</h2>
      {reason &&  <p className="text-red-500 mb-3 " > Review For :{ reason.application_address_details_status_comment}</p> }
      <ImageCaptureValidator
        onCapture={handlePhotoCapture}
        photoType="customer"
        showLocation={true}
        initialPhoto={photoData} // Pass photoData here to reflect the current state (either API or newly captured)
        hasExistingPhoto={apiPhotoData} // Keep this for displaying existing photo details
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
          {isSubmitting || localIsSubmitting ? (
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
