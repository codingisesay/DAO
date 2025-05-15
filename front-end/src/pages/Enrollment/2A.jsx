import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
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
        flatnoroomno: '',
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

            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-3">
                <div>
                    <CommanInput
                        onChange={handleChange}
                        label={labels.firstname.label}
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        required
                    />
                </div>

                <div>
                    <CommanInput
                        onChange={handleChange}
                        label={labels.middlename.label}
                        type="text"
                        name="middlename"
                        value={formData.middlename}
                        required
                    />
                </div>

                <div>
                    <CommanInput
                        onChange={handleChange}
                        label={labels.lastname.label}
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        required
                    />
                </div>

                <div>
                    <CommanInput
                        onChange={handleChange}
                        label={labels.dob.label}
                        type="date"
                        name="dob"
                        value={formData.dob}
                        required
                    />
                </div>

                <div>
                    <CommanInput
                        onChange={handleChange}
                        label={labels.gender.label}
                        type="text"
                        name="gender"
                        value={formData.gender}
                        required
                    />
                </div>

                <div>
                    <CommanInput
                        onChange={handleChange}
                        label={labels.mobile.label}
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        required
                    />
                </div>

                <div>
                    <CommanInput
                        onChange={handleChange}
                        label={labels.complexname.label}
                        type="text"
                        name="complexname"
                        value={formData.complexname}
                        required
                    />
                </div>

                <div>
                    <CommanInput
                        onChange={handleChange}
                        label={labels.flatnoroomno.label}
                        type="text"
                        name="flatnoroomno"
                        value={formData.flatnoroomno}
                        required
                    />
                </div>

                <div>
                    <CommanInput
                        onChange={handleChange}
                        label={labels.area.label}
                        type="text"
                        name="area"
                        value={formData.area}
                        required
                    />
                </div>

                <div>
                    <CommanInput
                        onChange={handleChange}
                        label={labels.landmark.label}
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        required
                    />
                </div>

                <div>
                    <CommanInput
                        onChange={handleChange}
                        label={labels.country.label}
                        type="text"
                        name="country"
                        value={formData.country}
                        required
                    />
                </div>

                <div>
                    <CommanInput
                        onChange={handleChange}
                        label={labels.pincode.label}
                        type="text"
                        name="pincode"
                        value={formData.pincode}
                        required
                    />
                </div>

                <div>
                    <CommanInput
                        onChange={handleChange}
                        label={labels.city.label}
                        type="text"
                        name="city"
                        value={formData.city}
                        required
                    />
                </div>

                <div>
                    <CommanInput
                        onChange={handleChange}
                        label={labels.district.label}
                        type="text"
                        name="district"
                        value={formData.district}
                        required
                    />
                </div>

                <div>
                    <CommanInput
                        onChange={handleChange}
                        label={labels.state.label}
                        type="text"
                        name="state"
                        value={formData.state}
                        required
                    />
                </div>
            </div>


        </div>
    );
}

export default PersonalDetailsForm;
