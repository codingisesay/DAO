import React, { useState } from 'react';
import FloatingInput from '../../components/FloatingInput';
import workingman from '../../assets/imgs/workingman1.png';
import labels from '../../components/labels';
function p1({ onNext, onBack }) {
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [showData, setShowData] = useState(false);
    const [formData, setFormData] = React.useState({
        aadharno: '',
        verifynumber: '',
        firstname: '',
        middlename: '',
        lastname: '',
        dob: '',
        gender: '',
        mobile: '',
        complexname: '',
        flatnobuildingname: '',
        area: '',
        landmark: '',
        country: '',
        pincode: '',
        city: '',
        district: '',
        state: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    // Handle the change of radio button selection
    const handleRadioChange = (e) => {
        setSelectedOption(e.target.value);
    };
    const fetchShowData = (e) => {
        e.preventDefault();
        setShowData(true);
    }
    return (
        <>
            <div className=''>
                <div className="flex flex-wrap items-top justify-center ">
                    <div className="md:w-1/2">
                        {/* application type selection below */}
                        <>
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

                            {selectedType &&
                                <>
                                    {/* aadhar pan digilocker input below */}
                                    <h2 className="text-xl font-bold mb-2">Choose  the Option to Verify</h2>
                                    <form className="flex flex-wrap items-center justify-start">
                                        <label className=" flex me-4">
                                            <input className="me-2"
                                                type="radio"
                                                name="option"
                                                value="Aadhar Number"
                                                checked={selectedOption === 'Aadhar Number'}
                                                onChange={handleRadioChange}
                                            />
                                            Aadhar Number
                                        </label>

                                        <label className=" flex me-4">
                                            <input className="me-2"
                                                type="radio"
                                                name="option"
                                                value="Pan Number"
                                                checked={selectedOption === 'Pan Number'}
                                                onChange={handleRadioChange}
                                            />
                                            Pan Number
                                        </label>

                                        <label className=" flex me-4">
                                            <input className="me-2"
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
                                            {/* <p>Enter {selectedOption}:</p> */}
                                            <div className="flex items-center ">
                                                <div className="md:w-1/2 me-4">
                                                    <FloatingInput
                                                        type="text" label={`Enter ${selectedOption}`}
                                                        value={formData.verifynumber}
                                                        onChange={handleChange} name="verifynumber"
                                                        placeholder={`Enter ${selectedOption}`} required
                                                    />
                                                </div>
                                                <div className="md:w-1/2"> <button className="btn-login" onClick={fetchShowData}>Submit</button></div>
                                            </div>

                                        </div>
                                    )}
                                </>
                            }
                        </>
                    </div>
                    <div className="md:w-1/2"><img src={workingman} alt="workingman" width='400px' className="m-auto" /></div>
                </div>
                {showData &&
                    <>
                        <h2 className="text-xl font-bold mb-2">{selectedOption} Details</h2>
                        <div className="md:grid md:grid-cols-4 gap-3">
                            <div className="">
                                <FloatingInput
                                    onChange={handleChange}
                                    label={labels.firstname.label}
                                    type="text"
                                    name="firstname"
                                    value={formData.firstname}
                                    required
                                />
                            </div>

                            <div className="">
                                <FloatingInput
                                    onChange={handleChange}
                                    label={labels.middlename.label}
                                    type="text"
                                    name="middlename"
                                    value={formData.middlename}
                                    required
                                />
                            </div>

                            <div className="">
                                <FloatingInput
                                    onChange={handleChange}
                                    label={labels.lastname.label}
                                    type="text"
                                    name="lastname"
                                    value={formData.lastname}
                                    required
                                />
                            </div>

                            <div className="">
                                <FloatingInput
                                    onChange={handleChange}
                                    label={labels.dob.label}
                                    type="date"
                                    name="dob"
                                    value={formData.dob}
                                    required
                                />
                            </div>

                            <div className="">
                                <FloatingInput
                                    onChange={handleChange}
                                    label={labels.gender.label}
                                    type="text"
                                    name="gender"
                                    value={formData.gender}
                                    required
                                />
                            </div>

                            <div className="">
                                <FloatingInput
                                    onChange={handleChange}
                                    label={labels.mobile.label}
                                    type="text"
                                    name="mobile"
                                    value={formData.mobile}
                                    required
                                />
                            </div>

                            <div className="">
                                <FloatingInput
                                    onChange={handleChange}
                                    label={labels.complexname.label}
                                    type="text"
                                    name="complexname"
                                    value={formData.complexname}
                                    required
                                />
                            </div>

                            <div className="">
                                <FloatingInput
                                    onChange={handleChange}
                                    label={labels.flatnobuildingname.label}
                                    type="text"
                                    name="flatnobuildingname"
                                    value={formData.flatnobuildingname}
                                    required
                                />
                            </div>

                            <div className="">
                                <FloatingInput
                                    onChange={handleChange}
                                    label={labels.area.label}
                                    type="text"
                                    name="area"
                                    value={formData.area}
                                    required
                                />
                            </div>

                            <div className="">
                                <FloatingInput
                                    onChange={handleChange}
                                    label={labels.landmark.label}
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    required
                                />
                            </div>

                            <div className="">
                                <FloatingInput
                                    onChange={handleChange}
                                    label={labels.country.label}
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    required
                                />
                            </div>

                            <div className="">
                                <FloatingInput
                                    onChange={handleChange}
                                    label={labels.pincode.label}
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode}
                                    required
                                />
                            </div>

                            <div className="">
                                <FloatingInput
                                    onChange={handleChange}
                                    label={labels.city.label}
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    required
                                />
                            </div>

                            <div className="">
                                <FloatingInput
                                    onChange={handleChange}
                                    label={labels.district.label}
                                    type="text"
                                    name="district"
                                    value={formData.district}
                                    required
                                />
                            </div>

                            <div className="">
                                <FloatingInput
                                    onChange={handleChange}
                                    label={labels.state.label}
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    required
                                />
                            </div>
                        </div>
                    </>
                }
            </div >


            <div className="next-back-btns">
                <button className="btn-back" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </button>
                <button className="btn-next" onClick={onNext}>
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </button>
            </div>



        </>
    );
}

export default p1;