import React, { useState } from 'react';
import FloatingInput from '../../components/FloatingInput';
import labels from '../../components/labels';

function PersonalDetailsForm({ onNext, onBack }) {
    const [formData, setFormData] = useState({
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

    return (
        <div>
            <h2 className="text-xl font-bold mb-2">Personal Details</h2>

            <div className="md:grid md:grid-cols-4 gap-3">
                <div>
                    <FloatingInput
                        onChange={handleChange}
                        label={labels.firstname.label}
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        required
                    />
                </div>

                <div>
                    <FloatingInput
                        onChange={handleChange}
                        label={labels.middlename.label}
                        type="text"
                        name="middlename"
                        value={formData.middlename}
                        required
                    />
                </div>

                <div>
                    <FloatingInput
                        onChange={handleChange}
                        label={labels.lastname.label}
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        required
                    />
                </div>

                <div>
                    <FloatingInput
                        onChange={handleChange}
                        label={labels.dob.label}
                        type="date"
                        name="dob"
                        value={formData.dob}
                        required
                    />
                </div>

                <div>
                    <FloatingInput
                        onChange={handleChange}
                        label={labels.gender.label}
                        type="text"
                        name="gender"
                        value={formData.gender}
                        required
                    />
                </div>

                <div>
                    <FloatingInput
                        onChange={handleChange}
                        label={labels.mobile.label}
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        required
                    />
                </div>

                <div>
                    <FloatingInput
                        onChange={handleChange}
                        label={labels.complexname.label}
                        type="text"
                        name="complexname"
                        value={formData.complexname}
                        required
                    />
                </div>

                <div>
                    <FloatingInput
                        onChange={handleChange}
                        label={labels.flatnobuildingname.label}
                        type="text"
                        name="flatnobuildingname"
                        value={formData.flatnobuildingname}
                        required
                    />
                </div>

                <div>
                    <FloatingInput
                        onChange={handleChange}
                        label={labels.area.label}
                        type="text"
                        name="area"
                        value={formData.area}
                        required
                    />
                </div>

                <div>
                    <FloatingInput
                        onChange={handleChange}
                        label={labels.landmark.label}
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        required
                    />
                </div>

                <div>
                    <FloatingInput
                        onChange={handleChange}
                        label={labels.country.label}
                        type="text"
                        name="country"
                        value={formData.country}
                        required
                    />
                </div>

                <div>
                    <FloatingInput
                        onChange={handleChange}
                        label={labels.pincode.label}
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        required
                    />
                </div>

                <div>
                    <FloatingInput
                        onChange={handleChange}
                        label={labels.city.label}
                        type="text"
                        name="city"
                        value={formData.city}
                        required
                    />
                </div>

                <div>
                    <FloatingInput
                        onChange={handleChange}
                        label={labels.district.label}
                        type="text"
                        name="district"
                        value={formData.district}
                        required
                    />
                </div>

                <div>
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

            {/* <div className="next-back-btns">
                <button className="btn-back" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </button>
                <button className="btn-next" onClick={onNext}>
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </button>
            </div> */}
        </div>
    );
}

export default PersonalDetailsForm;
