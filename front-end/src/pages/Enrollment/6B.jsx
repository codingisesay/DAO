import React from 'react';
import PhotoCapture from './CustomerPhotoCapture';
import customerInstructions from '../../assets/imgs/photo_instructions.png';
// import agentInstructions from './assets/agent-instructions.png';

const PhotoCaptureApp = () => {
    return (
        <div className="space-y-8 p-4">


            <PhotoCapture
                photoType="agent"
                showLocation={false}
            />

            <div className="text-center">
                <button
                    onClick={() => {
                        const agentPhoto = localStorage.getItem('agentPhoto');
                        // Submit to your backend
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
                >
                    Submit All Photos
                </button>
            </div>
        </div>
    );
};

export default PhotoCaptureApp;