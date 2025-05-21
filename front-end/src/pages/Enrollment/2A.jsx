import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommanSelect from '../../components/CommanSelect';
import { maritalStatusOptions } from '../../data/data';
import { salutation, gender, religion, caste } from '../../data/data';
import Swal from 'sweetalert2';

function PersonalDetailsForm({ formData, updateFormData }) {
    const [localFormData, setLocalFormData] = useState({
        salutation: formData.personalDetails?.salutation || '',
        firstName: formData.personalDetails?.firstName || '',
        middleName: formData.personalDetails?.middleName || '',
        lastName: formData.personalDetails?.lastName || '',
        dob: formData.personalDetails?.dob || '',
        gender: formData.personalDetails?.gender || '',
        religion: formData.personalDetails?.religion || '',
        caste: formData.personalDetails?.caste || '',
        maritalStatus: formData.personalDetails?.maritalStatus || '',
        mobile: formData.personalDetails?.mobile || '',
        alternatemobile: formData.personalDetails?.alternatemobile || '',
        email: formData.personalDetails?.email || '',
        aadharnumber: formData.personalDetails?.aadharnumber || '',
        pannumber: formData.personalDetails?.pannumber || '',
        drivinglicence: formData.personalDetails?.drivinglicence || '',
        voterid: formData.personalDetails?.voterid || '',
        passportno: formData.personalDetails?.passportno || '',
        complexName: formData.personalDetails?.complexName || '',
        flatNoRoomNo: formData.personalDetails?.flatNoRoomNo || '',
        area: formData.personalDetails?.area || '',
        landmark: formData.personalDetails?.landmark || '',
        country: formData.personalDetails?.country || '',
        pincode: formData.personalDetails?.pincode || '',
        city: formData.personalDetails?.city || '',
        district: formData.personalDetails?.district || '',
        state: formData.personalDetails?.state || ''
    });

    useEffect(() => {
        // Update parent form data whenever localFormData changes
        updateFormData({
            ...formData,
            personalDetails: localFormData
        });
    }, [localFormData]);

    const handleChange = (e) => {
        const { name, value } = e.target;


        setLocalFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="personal-details-form">
            <h2 className="text-xl font-bold mb-2">Personal Details</h2>

            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
                <CommanSelect
                    onChange={handleChange}
                    label={labels.salutation.label}
                    name="salutation"
                    value={localFormData.salutation}
                    options={salutation}
                    required
                />

                <CommanInput
                    onChange={handleChange}
                    label={labels.firstname.label}
                    type="text"
                    name="firstName"
                    value={localFormData.firstName}
                    required
                    max={50}
                    validationType="TEXT_ONLY"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.middlename.label}
                    type="text"
                    name="middleName"
                    value={localFormData.middleName}
                    required
                    max={50}
                    validationType="TEXT_ONLY"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.lastname.label}
                    type="text"
                    name="lastName"
                    value={localFormData.lastName}
                    required
                    max={50}
                    validationType="TEXT_ONLY"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.dob.label}
                    type="date"
                    name="dob"
                    value={localFormData.dob}
                    required
                    validationType="DATE"
                />

                <CommanSelect
                    onChange={handleChange}
                    label={labels.gender.label}
                    name="gender"
                    value={localFormData.gender}
                    options={gender}
                    required
                />

                <CommanSelect
                    onChange={handleChange}
                    label={labels.religion.label}
                    name="religion"
                    value={localFormData.religion}
                    options={religion}
                    required
                />

                <CommanSelect
                    onChange={handleChange}
                    label={labels.caste.label}
                    name="caste"
                    value={localFormData.caste}
                    options={caste}
                    required
                />

                <CommanSelect
                    onChange={handleChange}
                    label={labels.maritalStatus.label}
                    name="maritalStatus"
                    value={localFormData.maritalStatus}
                    options={maritalStatusOptions}
                    required
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.mobile.label}
                    type="text"
                    name="mobile"
                    value={localFormData.mobile}
                    required
                    max={10}
                    validationType="PHONE"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.alternatemobile.label}
                    type="text"
                    name="alternatemobile"
                    value={localFormData.alternatemobile}
                    required
                    max={10}
                    validationType="PHONE"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.email.label}
                    type="email"
                    name="email"
                    value={localFormData.email}
                    required
                    validationType="EMAIL"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.aadharnumber.label}
                    type="text"
                    name="aadharnumber"
                    value={localFormData.aadharnumber}
                    required
                    max={12}
                    validationType="NUMBER_ONLY"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.pannumber.label}
                    type="text"
                    name="pannumber"
                    value={localFormData.pannumber}
                    required
                    max={10}
                    validationType="PAN"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.drivinglicence.label}
                    type="text"
                    name="drivinglicence"
                    value={localFormData.drivinglicence}
                    max={20}
                    validationType="ALPHANUMERIC"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.voterid.label}
                    type="text"
                    name="voterid"
                    value={localFormData.voterid}
                    max={20}
                    validationType="ALPHANUMERIC"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.passportno.label}
                    type="text"
                    name="passportno"
                    value={localFormData.passportno}
                    max={20}
                    validationType="ALPHANUMERIC"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.complexname.label}
                    type="text"
                    name="complexName"
                    value={localFormData.complexName}
                    required
                    max={50}
                    validationType="ALPHANUMERIC"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.flatnoroomno.label}
                    type="text"
                    name="flatNoRoomNo"
                    value={localFormData.flatNoRoomNo}
                    required
                    max={20}
                    validationType="ALPHANUMERIC"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.area.label}
                    type="text"
                    name="area"
                    value={localFormData.area}
                    required
                    max={50}
                    validationType="ALPHABETS_AND_SPACE"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.landmark.label}
                    type="text"
                    name="landmark"
                    value={localFormData.landmark}
                    required
                    max={50}
                    validationType="EVERYTHING"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.country.label}
                    type="text"
                    name="country"
                    value={localFormData.country}
                    required
                    max={30}
                    validationType="ALPHABETS_AND_SPACE"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.pincode.label}
                    type="text"
                    name="pincode"
                    value={localFormData.pincode}
                    required
                    max={10}
                    validationType="NUMBER_ONLY"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.city.label}
                    type="text"
                    name="city"
                    value={localFormData.city}
                    required
                    max={30}
                    validationType="ALPHABETS_AND_SPACE"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.district.label}
                    type="text"
                    name="district"
                    value={localFormData.district}
                    required
                    max={30}
                    validationType="ALPHABETS_AND_SPACE"
                />
                <CommanInput
                    onChange={handleChange}
                    label={labels.state.label}
                    type="text"
                    name="state"
                    value={localFormData.state}
                    required
                    max={30}
                    validationType="ALPHABETS_AND_SPACE"
                />
            </div>
        </div>
    );
}

export default PersonalDetailsForm;