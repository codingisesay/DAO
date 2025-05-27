import React from 'react';
import PhotoCapture from './CustomerPhotoCapture';

const PhotoCaptureApp = ({ formData, updateFormData }) => {
    const storecustpic = (data) => {
        alert('photo saved');
        const customerPhoto = localStorage.getItem('customerPhotoData');
        const photo = JSON.parse(customerPhoto);
        console.log('Submitting:', photo.image);

        updateFormData(2, {
            customerPhoto: photo.image
        });

    };

    return (
        <div className="space-y-8">
            <PhotoCapture
                photoType="customer"
                onCapture={(data) => storecustpic(data)}
            />

            <div className="text-center">
                <button
                    onClick={storecustpic}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
                >
                    Submit All Photos
                </button>
            </div>
        </div>
    );
};

export default PhotoCaptureApp;


// import React from 'react';
// import PhotoCapture from './CustomerPhotoCapture';

// const PhotoCaptureApp = (formData, updateFormData) => {
//     const storecustpic = () => {
//         alert('photo saved')
//         // const customerPhoto = localStorage.getItem('customerPhotoData');
//         // const photo = JSON.parse(customerPhoto);
//         // console.log('Submitting:', photo.image);

//         // // Update the central form data before proceeding
//         // updateFormData(1, {
//         //     customerPhoto: photo.image
//         // });
//         // onNext();

//     }

//     return (
//         <div className="space-y-8 ">
//             <PhotoCapture
//                 photoType="customer"
//                 onCapture={(data) => console.log(data)}
//             />

//             <div className="text-center">
//                 <button
//                     onClick={storecustpic}
//                     className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
//                 >
//                     Submit All Photos
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default PhotoCaptureApp;