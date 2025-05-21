import React from 'react';
import PhotoCapture from './CustomerPhotoCapture';

const PhotoCaptureApp = () => {
    return (
        <div className="space-y-8 ">
            <PhotoCapture
                photoType="customer"
                onCapture={(data) => console.log(data)}
            />

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
                </button>
            </div> */}
        </div>
    );
};

export default PhotoCaptureApp;