
import React, { useEffect, useState } from 'react';
import PhotoCapture from './CustomerPhotoCapture';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { daoApi } from '../../utils/storage';
import { agentlivephotoSave  ,createAccountService} from '../../services/apiServices';

const PhotoCaptureApp = ({ formData, updateFormData, onNext, onBack }) => {
    const [localFormData, setLocalFormData] = useState();
    const application_id = localStorage.getItem('application_id') || formData.application_id;

    useEffect(() => {
        const storedData = localStorage.getItem('agentPhotoData');

        if (!storedData) {
            console.error('No agentPhotoData found in localStorage');
            return;
        }
        setLocalFormData(JSON.parse(storedData));
    }, []);

    const submitAgentPic = async (localFormData) => {
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
            const response = await daoApi.post(createAccountService.agentLivePhoto_s6b(payload));
            Swal.fire({
                title: 'Account Created Successfully!',
                text: 'Your account has been created successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/agentdashboard'; // Redirect to the desired page
                }
            });
            localStorage.removeItem('customerPhotoData');

        } catch (error) {
            console.log(error)
            Swal.fire({
                title: 'Account Created Successfully!',
                text: 'Your account has been created successfully.',
                icon: 'success',
                confirmButtonText: 'OK',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/agentdashboard'; // Redirect to the desired page
                }
            });

        }
    }

    return (
        <div className="space-y-8 ">
            <PhotoCapture
                photoType="agent"
                onCapture={(data) => { setLocalFormData(data); console.log('After capture : ', data); }}
            />

            <div className="next-back-btns z-10">
                <CommonButton onClick={onBack} variant="outlined" className="btn-back">
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton
                    onClick={() => submitAgentPic(localFormData)}
                    variant="contained"
                    className="btn-next"
                >
                    Submit 
                </CommonButton>
            </div>



        </div>
    );
};

export default PhotoCaptureApp;



