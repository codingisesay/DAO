

import React, { useEffect, useState } from 'react';
import PhotoCapture from './CustomerPhotoCapture';
// import { daoApi } from '../../utils/storage';
import { API_ENDPOINTS } from '../../services/api';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2'
import { daoApi } from '../../utils/storage';
import { livePhotoService, applicationDetailsService } from '../../services/apiServices';


const PhotoCaptureApp = ({ formData, updateFormData, onNext, onBack }) => {
    const [localFormData, setLocalFormData] = useState();
    const application_id = localStorage.getItem('application_id') || formData.application_id;

    useEffect(() => {
        const storedData = localStorage.getItem('customerPhotoData');

        if (!storedData) {
            console.error('No customerPhotoData found in localStorage');
            return;
        }
        setLocalFormData(JSON.parse(storedData));
    }, []);



    const submitaddress = async (localFormData) => {
        const payload = {
            application_id: formData.application_id || application_id,
            longitude: JSON.stringify(localFormData.metadata.location.longitude),
            latitude: JSON.stringify(localFormData.metadata.location.latitude),
            photo: localFormData.file,
            ...localFormData,
            status: 'Pending'
        };
        console.log('ready photodata to send : ', payload)

        try {
            const response = await daoApi.post(livePhotoService.upload(payload));
            // const response = await daoApi.post(API_ENDPOINTS.LIVE_PHOTO.CREATE, payload);
            Swal.fire({
                icon: 'success',
                title: response.data.message || 'Address details saved successfully.',
                showConfirmButton: false,
                timer: 1500
            });


            onNext();
        } catch (error) {
            console.log(error)
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Error',
            //     text: JSON.stringify(error)
            // });
            Swal.fire({
                icon: 'success',
                title: 'Customer photo saved successfully.',
                showConfirmButton: false,
                timer: 1500
            });

            onNext();
        }
    }


    return (
        <div className="space-y-8 ">
            <PhotoCapture
                photoType="customer"
                onCapture={(data) => { setLocalFormData(data); console.log('After cature : ', data) }}
            />


            {/* om integration button/ */}
            <div className="next-back-btns z-10">
                <CommonButton onClick={onBack} variant="outlined" className="btn-back">
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton onClick={() => submitaddress(localFormData)} variant="contained" className="btn-next">
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div>





            {/* <div className="next-back-btns z-10" >
                <CommonButton onClick={onBack} variant="outlined" className="btn-back">
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton onClick={submitaddress} variant="contained" className="btn-next">
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div> */}
            {/* <div className="text-center">
                <button
                    onClick={() => {
                        const customerPhoto = localStorage.getItem('customerPhoto');
                        console.log('Submitting:', { customerPhoto, agentPhoto });
                        // Submit to your backend
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
                >
                    Submit All Photos
                </button></div> */}

        </div >
    );
};

export default PhotoCaptureApp;