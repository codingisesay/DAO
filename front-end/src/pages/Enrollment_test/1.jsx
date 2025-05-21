
import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import workingman from '../../assets/imgs/workingman1.png';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';

function P1({ onNext, onBack, formData, updateFormData }) {
    const [selectedOption, setSelectedOption] = useState(formData.verificationOption || '');
    const [selectedType, setSelectedType] = useState(formData.applicationType || '');
    const [showData, setShowData] = useState(!!formData.verificationNumber);

    const [localFormData, setLocalFormData] = useState({
        firstname: formData.personalDetails?.firstName || '',
        middlename: formData.personalDetails?.middleName || '',
        lastname: formData.personalDetails?.lastName || '',
        dob: formData.personalDetails?.dob || '',
        gender: formData.personalDetails?.gender || '',
        mobile: formData.personalDetails?.mobile || '',
        verifynumber: formData.verificationNumber || '',
        complexname: formData.personalDetails?.complexName || '',
        flatnoroomno: formData.personalDetails?.flatNoRoomNo || '',
        area: formData.personalDetails?.area || '',
        landmark: formData.personalDetails?.landmark || '',
        country: formData.personalDetails?.country || '',
        pincode: formData.personalDetails?.pincode || '',
        city: formData.personalDetails?.city || '',
        district: formData.personalDetails?.district || '',
        state: formData.personalDetails?.state || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const fetchShowData = (e) => {
        e.preventDefault();
        if (localFormData.verifynumber) {
            setShowData(true);
        }
    };

    const handleNextStep = () => {
        // Update the central form data before proceeding
        updateFormData(1, {
            applicationType: selectedType,
            verificationOption: selectedOption,
            verificationNumber: localFormData.verifynumber,
            personalDetails: {
                firstName: localFormData.firstname,
                middleName: localFormData.middlename,
                lastName: localFormData.lastname,
                dob: localFormData.dob,
                gender: localFormData.gender,
                mobile: localFormData.mobile,
                complexName: localFormData.complexname,
                flatNoRoomNo: localFormData.flatnoroomno,
                area: localFormData.area,
                landmark: localFormData.landmark,
                country: localFormData.country,
                pincode: localFormData.pincode,
                city: localFormData.city,
                district: localFormData.district,
                state: localFormData.state
            }
        });
        onNext();
    };

    return (
        <>
            <div className='form-container'>
                <div className="flex flex-wrap items-top">
                    <div className="lg:w-1/2 md:full sm:w-full">
                        <h2 className="text-xl font-bold mb-2">Choose Application Type</h2>
                        <div className="application-type-container">
                            <label className="application-type">
                                <input
                                    type="radio"
                                    name="applicationType"
                                    value="new"
                                    className="hidden peer"
                                    checked={selectedType === 'new'}
                                    onChange={() => setSelectedType('new')}
                                />
                                <div className="border rounded-lg p-2 flex items-center gap-4 peer-checked:border-green-600 transition-colors">
                                    <i className="bi bi-person-fill-add"></i>
                                    <span className="text-black font-medium">New Customer</span>
                                </div>
                            </label>

                            <label className="application-type">
                                <input
                                    type="radio"
                                    name="applicationType"
                                    value="rekyc"
                                    className="hidden peer"
                                    checked={selectedType === 'rekyc'}
                                    onChange={() => setSelectedType('rekyc')}
                                />
                                <div className="border rounded-lg p-2 flex items-center gap-4 peer-checked:border-green-600 transition-colors">
                                    <i className="bi bi-person-fill-check"></i>
                                    <span className="text-black font-medium">Re-KYC</span>
                                </div>
                            </label>
                        </div>

                        {selectedType && (
                            <>
                                <h2 className="text-xl font-bold mb-2">Choose the Option to Verify</h2>
                                <form className="flex flex-wrap items-center justify-start">
                                    <label className="flex me-4">
                                        <input
                                            className="me-2"
                                            type="radio"
                                            name="option"
                                            value="Aadhar Number"
                                            checked={selectedOption === 'Aadhar Number'}
                                            onChange={handleRadioChange}
                                        />
                                        Aadhar Number
                                    </label>

                                    <label className="flex me-4">
                                        <input
                                            className="me-2"
                                            type="radio"
                                            name="option"
                                            value="Pan Number"
                                            checked={selectedOption === 'Pan Number'}
                                            onChange={handleRadioChange}
                                        />
                                        Pan Number
                                    </label>

                                    <label className="flex me-4">
                                        <input
                                            className="me-2"
                                            type="radio"
                                            name="option"
                                            value="DigiLocker"
                                            checked={selectedOption === 'DigiLocker'}
                                            onChange={handleRadioChange}
                                        />
                                        DigiLocker
                                    </label>
                                </form>

                                {selectedOption && (
                                    <div className="mt-2">
                                        <div className="flex items-center">
                                            <div className="md:w-1/2 me-4">
                                                <CommanInput
                                                    type="text"
                                                    label={`Enter ${selectedOption}`}
                                                    value={localFormData.verifynumber}
                                                    onChange={handleChange}
                                                    name="verifynumber"
                                                    placeholder={`Enter ${selectedOption}`}
                                                    required
                                                />
                                            </div>
                                            <div className="md:w-1/2">
                                                <CommonButton
                                                    className="btn-login"
                                                    onClick={fetchShowData}
                                                    disabled={!localFormData.verifynumber}
                                                >
                                                    Submit
                                                </CommonButton>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <br />
                            </>
                        )}
                    </div>
                    <div className="hidden lg:block lg:w-1/2 md:w-1/2">
                        <img src={workingman} alt="workingman" className="w-4/5 m-auto" />
                    </div>
                </div>

                {showData && (
                    <>
                        <h2 className="text-xl font-bold mb-2">{selectedOption} Details</h2>
                        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
                            <CommanInput
                                onChange={handleChange}
                                label={labels.firstname.label}
                                type="text"
                                name="firstname"
                                value={localFormData.firstname}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.middlename.label}
                                type="text"
                                name="middlename"
                                value={localFormData.middlename}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.lastname.label}
                                type="text"
                                name="lastname"
                                value={localFormData.lastname}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.dob.label}
                                type="date"
                                name="dob"
                                value={localFormData.dob}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.gender.label}
                                type="text"
                                name="gender"
                                value={localFormData.gender}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.mobile.label}
                                type="text"
                                name="mobile"
                                value={localFormData.mobile}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.complexname.label}
                                type="text"
                                name="complexname"
                                value={localFormData.complexname}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.flatnoroomno.label}
                                type="text"
                                name="flatnoroomno"
                                value={localFormData.flatnoroomno}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.area.label}
                                type="text"
                                name="area"
                                value={localFormData.area}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.landmark.label}
                                type="text"
                                name="landmark"
                                value={localFormData.landmark}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.country.label}
                                type="text"
                                name="country"
                                value={localFormData.country}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.pincode.label}
                                type="text"
                                name="pincode"
                                value={localFormData.pincode}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.city.label}
                                type="text"
                                name="city"
                                value={localFormData.city}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.district.label}
                                type="text"
                                name="district"
                                value={localFormData.district}
                                required
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.state.label}
                                type="text"
                                name="state"
                                value={localFormData.state}
                                required
                            />
                        </div>
                    </>
                )}
            </div>

            <div className="next-back-btns">
                <CommonButton className="btn-back" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>

                <CommonButton
                    className="btn-next"
                    onClick={handleNextStep}
                >
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div>
        </>
    );
}

export default P1;
// import React, { useState } from 'react';
// import CommanInput from '../../components/CommanInput';
// import workingman from '../../assets/imgs/workingman1.png';
// import labels from '../../components/labels';
// import CommonButton from '../../components/CommonButton';
// function p1({ onNext, onBack, formData, updateFormData }) {
//     const [selectedOption, setSelectedOption] = useState('');
//     const [selectedType, setSelectedType] = useState('');
//     const [showData, setShowData] = useState(false);

//     const [localFormData, setLocalFormData] = useState({
//         ...formData.personalDetails,
//         verifynumber: formData.verificationNumber || ''
//     });
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setLocalFormData({ ...localFormData, [name]: value });
//     };
//     // Handle the change of radio button selection
//     const handleRadioChange = (e) => {
//         setSelectedOption(e.target.value);
//     };
//     const fetchShowData = (e) => {
//         e.preventDefault();
//         setShowData(true);
//     }

//     const handleNextStep = () => {
//         // Update the central form data before proceeding
//         updateFormData(1, {
//             applicationType: selectedType,
//             verificationOption: selectedOption,
//             verificationNumber: localFormData.verifynumber,
//             personalDetails: {
//                 firstName: localFormData.firstname,
//                 middleName: localFormData.middlename,
//                 lastName: localFormData.lastname,
//                 dob: localFormData.dob,
//                 gender: localFormData.gender,
//                 mobile: localFormData.mobile,
//                 complexName: localFormData.complexname, // Added complexName field
//                 flatNoRoomNo: localFormData.flatnoroomno, // Added flatNoRoomNo field
//                 area: localFormData.area, // Added area field
//                 landmark: localFormData.landmark, // Added landmark field
//                 country: localFormData.country, // Added country field
//                 pincode: localFormData.pincode, // Added pincode field
//                 city: localFormData.city, // Added city field
//                 district: localFormData.district, // Added district field
//                 state: localFormData.state // Added state field
//             }
//         });


//         onNext()
//     }


//     return (
//         <>
//             <div className='form-container'>
//                 <div className="flex flex-wrap items-top  ">
//                     <div className="lg:w-1/2 md:full sm:w-full">
//                         {/* application type selection below */}
//                         <>
//                             <h2 className="text-xl font-bold mb-2">Choose Application Type</h2>

//                             <div className="application-type-container">
//                                 <label className="application-type">
//                                     <input
//                                         type="radio"
//                                         name="applicationType"
//                                         value="new"
//                                         className="hidden peer"
//                                         checked={selectedType === 'new'}
//                                         onChange={() => setSelectedType('new')}
//                                     />
//                                     <div className="border rounded-lg p-2 flex items-center gap-4 peer-checked:border-green-600 transition-colors">
//                                         <i className="bi bi-person-fill-add"></i>
//                                         <span className="text-black font-medium">New Customer</span>
//                                     </div>
//                                 </label>

//                                 <label className="application-type">
//                                     <input
//                                         type="radio"
//                                         name="applicationType"
//                                         value="rekyc"
//                                         className="hidden peer"
//                                         checked={selectedType === 'rekyc'}
//                                         onChange={() => setSelectedType('rekyc')}
//                                     />
//                                     <div className="border rounded-lg p-2 flex items-center gap-4 peer-checked:border-green-600 transition-colors">
//                                         <i className="bi bi-person-fill-check"></i>
//                                         <span className="text-black font-medium">Re-KYC</span>
//                                     </div>
//                                 </label>
//                             </div>

//                             {selectedType &&
//                                 <>
//                                     {/* aadhar pan digilocker input below */}
//                                     <h2 className="text-xl font-bold mb-2">Choose  the Option to Verify</h2>
//                                     <form className="flex flex-wrap items-center justify-start">
//                                         <label className=" flex me-4">
//                                             <input className="me-2"
//                                                 type="radio"
//                                                 name="option"
//                                                 value="Aadhar Number"
//                                                 checked={selectedOption === 'Aadhar Number'}
//                                                 onChange={handleRadioChange}
//                                             />
//                                             Aadhar Number
//                                         </label>

//                                         <label className=" flex me-4">
//                                             <input className="me-2"
//                                                 type="radio"
//                                                 name="option"
//                                                 value="Pan Number"
//                                                 checked={selectedOption === 'Pan Number'}
//                                                 onChange={handleRadioChange}
//                                             />
//                                             Pan Number
//                                         </label>

//                                         <label className=" flex me-4">
//                                             <input className="me-2"
//                                                 type="radio"
//                                                 name="option"
//                                                 value="DigiLocker"
//                                                 checked={selectedOption === 'DigiLocker'}
//                                                 onChange={handleRadioChange}
//                                             />
//                                             DigiLocker
//                                         </label>
//                                     </form>

//                                     {selectedOption && (
//                                         <div className="mt-2">
//                                             {/* <p>Enter {selectedOption}:</p> */}
//                                             <div className="flex items-center ">
//                                                 <div className="md:w-1/2 me-4">
//                                                     <CommanInput
//                                                         type="text" label={`Enter ${selectedOption}`}
//                                                         value={localFormData.verifynumber}
//                                                         onChange={handleChange} name="verifynumber"
//                                                         placeholder={`Enter ${selectedOption}`} required
//                                                     />
//                                                 </div>
//                                                 <div className="md:w-1/2">
//                                                     <CommonButton className="btn-login" onClick={fetchShowData}>  Submit</CommonButton>

//                                                     {/* <span className="btn-login" onClick={fetchShowData}>Submit</span> */}
//                                                 </div>
//                                             </div>

//                                         </div>
//                                     )} <br />
//                                 </>
//                             }
//                         </>
//                     </div>
//                     <div className="hidden lg:block lg:w-1/2 md:w-1/2"><img src={workingman} alt="workingman" className=" w-4/5 m-auto" /></div>
//                 </div>
//                 {showData &&
//                     <>
//                         <h2 className="text-xl font-bold mb-2">{selectedOption} Details</h2>
//                         <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
//                             <div className="">
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label={labels.firstname.label}
//                                     type="text"
//                                     name="firstname"
//                                     value={localFormData.firstname}
//                                     required
//                                 />
//                             </div>

//                             <div className="">
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label={labels.middlename.label}
//                                     type="text"
//                                     name="middlename"
//                                     value={localFormData.middlename}
//                                     required
//                                 />
//                             </div>

//                             <div className="">
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label={labels.lastname.label}
//                                     type="text"
//                                     name="lastname"
//                                     value={localFormData.lastname}
//                                     required
//                                 />
//                             </div>

//                             <div className="">
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label={labels.dob.label}
//                                     type="date"
//                                     name="dob"
//                                     value={localFormData.dob}
//                                     required
//                                 />
//                             </div>

//                             <div className="">
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label={labels.gender.label}
//                                     type="text"
//                                     name="gender"
//                                     value={localFormData.gender}
//                                     required
//                                 />
//                             </div>

//                             <div className="">
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label={labels.mobile.label}
//                                     type="text"
//                                     name="mobile"
//                                     value={localFormData.mobile}
//                                     required
//                                 />
//                             </div>

//                             <div className="">
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label={labels.complexname.label}
//                                     type="text"
//                                     name="complexname"
//                                     value={localFormData.complexname}
//                                     required
//                                 />
//                             </div>

//                             <div className="">
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label={labels.flatnoroomno.label}
//                                     type="text"
//                                     name="flatnoroomno"
//                                     value={localFormData.flatnoroomno}
//                                     required
//                                 />
//                             </div>

//                             <div className="">
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label={labels.area.label}
//                                     type="text"
//                                     name="area"
//                                     value={localFormData.area}
//                                     required
//                                 />
//                             </div>

//                             <div className="">
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label={labels.landmark.label}
//                                     type="text"
//                                     name="landmark"
//                                     value={localFormData.landmark}
//                                     required
//                                 />
//                             </div>

//                             <div className="">
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label={labels.country.label}
//                                     type="text"
//                                     name="country"
//                                     value={localFormData.country}
//                                     required
//                                 />
//                             </div>

//                             <div className="">
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label={labels.pincode.label}
//                                     type="text"
//                                     name="pincode"
//                                     value={localFormData.pincode}
//                                     required
//                                 />
//                             </div>

//                             <div className="">
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label={labels.city.label}
//                                     type="text"
//                                     name="city"
//                                     value={localFormData.city}
//                                     required
//                                 />
//                             </div>

//                             <div className="">
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label={labels.district.label}
//                                     type="text"
//                                     name="district"
//                                     value={localFormData.district}
//                                     required
//                                 />
//                             </div>

//                             <div className="">
//                                 <CommanInput
//                                     onChange={handleChange}
//                                     label={labels.state.label}
//                                     type="text"
//                                     name="state"
//                                     value={localFormData.state}
//                                     required
//                                 />
//                             </div>
//                         </div>
//                     </>
//                 }
//             </div >


//             <div className="next-back-btns">
//                 <CommonButton className="btn-back" onClick={onBack}>
//                     <i className="bi bi-chevron-double-left"></i>&nbsp;Back
//                 </CommonButton>

//                 <CommonButton className="btn-next" onClick={handleNextStep}>
//                     Next&nbsp;<i className="bi bi-chevron-double-right"></i>
//                 </CommonButton>
//             </div>

//         </>
//     );
// }

// export default p1;