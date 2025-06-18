import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';

function PersonalDetailsForm({ formData, updateFormData, }) {
    const [localFormData, setLocalFormData] = useState({
        firstName: formData.personalDetails?.firstName || '',
        middleName: formData.personalDetails?.middleName || '',
        lastName: formData.personalDetails?.lastName || '',
        dob: formData.personalDetails?.dob || '',
        gender: formData.personalDetails?.gender || '',
        mobile: formData.personalDetails?.mobile || '',
        complexName: formData.personalDetails?.complexName || '',
        roomno: formData.personalDetails?.roomno || '',
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

    updateFormData({
        personalDetails: {
            ...localFormData
        }
    });

    return (
        <div className="personal-details-form">
            <h2 className="text-xl font-bold mb-2">Personal Details</h2>

            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-5">
                <CommanInput
                    onChange={handleChange}
                    label={labels.firstname.label}
                    type="text"
                    name="firstName"
                    value={localFormData.firstName}
                    required
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.middlename.label}
                    type="text"
                    name="middleName"
                    value={localFormData.middleName}
                    required
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.lastname.label}
                    type="text"
                    name="lastName"
                    value={localFormData.lastName}
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
                    name="complexName"
                    value={localFormData.complexName}
                    required
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.roomno.label}
                    type="text"
                    name="oomno"
                    value={localFormData.roomno}
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


        </div>
    );
}

export default PersonalDetailsForm;