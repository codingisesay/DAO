// import React, { useState } from 'react';
// import AddressForm from './address';
// import PersonalDetailsForm from './personaldetails';
// import CameraCapture from './livephoto';


// function p2({ onNext, onBack }) {

//     // Initial state for the form fields


//     // Handle change in form input fields
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });  // Update the form data state with the new value
//     };

//     return (
//         <>

//             <PersonalDetailsForm />
//             <AddressForm />
//             <CameraCapture />


//             {/* Navigation buttons */}
//             <div className="next-back-btns">
//                 <button className="btn-back" onClick={onBack}>
//                     <i className="bi bi-chevron-double-left"></i>&nbsp;Back
//                 </button>
//                 <button className="btn-next" onClick={onNext}>
//                     Next&nbsp;<i className="bi bi-chevron-double-right"></i>
//                 </button>
//             </div>
//         </>
//     );
// }

// export default p2;


import React, { useState } from 'react';
import StepperForm from './stepperForm';

function p2({ onNext, onBack }) {
    return (
        <div className="app-container">
            <StepperForm />

            <div className="next-back-btns">
                <button className="btn-back" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </button>
                <button className="btn-next" onClick={onNext}>
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </button>
            </div>

        </div>
    );
}

export default p2;