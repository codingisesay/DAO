import React, { useState } from 'react';
import PhotoCapture from './CustomerPhotoCapture';
import { daoApi } from '../../utils/storage';
import { API_ENDPOINTS } from '../../services/api';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2'
const PhotoCaptureApp = ({ formData, updateFormData, onNext, onBack }) => {
    const [localFormData, setLocalFormData] = useState();


    const submitaddress = async (localFormData) => {
        const payload = {
            application_id: 43,
            longitude: JSON.stringify(localFormData.metadata.location.longitude),
            latitude: JSON.stringify(localFormData.metadata.location.latitude),
            photo: localFormData.file,
            // ...localFormData,
            // status: formData.status,
        };
        console.log('ready photodata to send : ', payload.photo)

        try {
            const response = await daoApi.post(API_ENDPOINTS.LIVE_PHOTO.CREATE, payload);
            Swal.fire({
                icon: 'success',
                title: response.data.message || 'Address details saved successfully.',
                showConfirmButton: false,
                timer: 1500
            });

            updateFormData({
                ...localFormData,
                correspondenceAddressSame: sameAsAbove
            });

            if (onNext) {
                onNext();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to save address details'
            });
        }
    }


    return (
        <div className="space-y-8 ">
            <PhotoCapture
                photoType="customer"
                onCapture={(data) => { setLocalFormData(data); console.log('After cature : ', data) }}
            />


            {/* om integration button
            <div className="flex justify-between mt-6">
                <CommonButton onClick={onBack} variant="outlined">
                    Back
                </CommonButton>
                <CommonButton onClick={() => submitaddress(localFormData)} variant="contained">
                    Save & Continue
                </CommonButton>
            </div> */}
            {/* ankita test buttons
            
            <div className="text-center">
                <button
                    onClick={() => {
                        const customerPhoto = localStorage.getItem('customerPhoto');
                        console.log('Submitting:', { customerPhoto, agentPhoto });
                        // Submit to your backend
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
                >
                    Submit All Photos
                </button>
            </div> */}
        </div>
    );
};

export default PhotoCaptureApp;