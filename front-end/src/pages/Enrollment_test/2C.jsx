
import React from 'react';
import PhotoCapture from './CustomerPhotoCapture';

const PhotoCaptureApp = ({ formData, updateFormData, }) => {
    const [localFormData, setLocalFormData] = useState({})
    return (
        <div className="space-y-8 ">
            <PhotoCapture
                photoType="customer"
                onCapture={(data) => console.log(data)}
            />

        </div>
    );
};

export default PhotoCaptureApp;