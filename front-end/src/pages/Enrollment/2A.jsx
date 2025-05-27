import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommanSelect from '../../components/CommanSelect';
import { maritalStatusOptions } from '../../data/data';
import { salutation, gender, religion, caste } from '../../data/data';

function PersonalDetailsForm({ formData, updateFormData }) {
    const [localFormData, setLocalFormData] = useState({
        salutation: formData.personalDetails?.salutation || '',
        first_name: formData.personalDetails?.first_name || '',
        middle_name: formData.personalDetails?.middle_name || '',
        last_name: formData.personalDetails?.last_name || '',
        DOB: formData.personalDetails?.DOB || '',
        gender: formData.personalDetails?.gender || '',
        religion: formData.personalDetails?.religion || '',
        caste: formData.personalDetails?.caste || '',
        maritalStatus: formData.personalDetails?.maritalStatus || '',
        mobile: formData.personalDetails?.mobile || '',
        alt_mob_no: formData.personalDetails?.alt_mob_no || '',
        email: formData.personalDetails?.email || '',
        adhar_card: formData.personalDetails?.adhar_card || '',
        pannumber: formData.personalDetails?.pannumber || '',
        drivinglicence: formData.personalDetails?.drivinglicence || '',
        voterid: formData.personalDetails?.voterid || '',
        passportno: formData.personalDetails?.passportno || '',
        complex_name: formData.personalDetails?.complex_name || '',
        flat_no: formData.personalDetails?.flat_no || '',
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

        // First, compute the updated local form data
        const updatedLocalFormData = { ...localFormData, [name]: value };

        // Update local state
        setLocalFormData(updatedLocalFormData);

        // Immediately sync it with the parent
        updateFormData({
            ...formData,
            personalDetails: updatedLocalFormData
        });
    };

    return (
        <div className="personal-details-form">
            <h2 className="text-xl font-bold mb-2">Personal Details</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
                {/* Salutation - Select field */}
                <CommanSelect
                    onChange={handleChange}
                    label={labels.salutation.label}
                    name="salutation"
                    value={localFormData.salutation}
                    options={salutation}
                    required
                />

                {/* First Name - Text only, 50 char limit */}
                <CommanInput
                    onChange={handleChange}
                    label={labels.firstname.label}
                    type="text"
                    name="first_name"
                    value={localFormData.first_name}
                    required
                    max={50}
                    validationType="TEXT_ONLY"
                />

                {/* Middle Name - Text only, 50 char limit */}
                <CommanInput
                    onChange={handleChange}
                    label={labels.middlename.label}
                    type="text"
                    name="middle_name"
                    value={localFormData.middle_name}
                    required
                    max={50}
                    validationType="TEXT_ONLY"
                />

                {/* Last Name - Text only, 50 char limit */}
                <CommanInput
                    onChange={handleChange}
                    label={labels.lastname.label}
                    type="text"
                    name="last_name"
                    value={localFormData.last_name}
                    required
                    max={50}
                    validationType="TEXT_ONLY"
                />

                {/* Date of Birth - Date validation */}
                <CommanInput
                    onChange={handleChange}
                    label={labels.dob.label}
                    type="date"
                    name="DOB"
                    value={localFormData.DOB}
                    required
                    validationType="DATE"
                />

                {/* Gender - Select field */}
                <CommanSelect
                    onChange={handleChange}
                    label={labels.gender.label}
                    name="gender"
                    value={localFormData.gender}
                    options={gender}
                    required
                />

                {/* Religion - Select field */}
                <CommanSelect
                    onChange={handleChange}
                    label={labels.religion.label}
                    name="religion"
                    value={localFormData.religion}
                    options={religion}
                    required
                />

                {/* Caste - Select field */}
                <CommanSelect
                    onChange={handleChange}
                    label={labels.caste.label}
                    name="caste"
                    value={localFormData.caste}
                    options={caste}
                    required
                />

                {/* Marital Status - Select field */}
                <CommanSelect
                    onChange={handleChange}
                    label={labels.maritalStatus.label}
                    name="maritalStatus"
                    value={localFormData.maritalStatus}
                    options={maritalStatusOptions}
                    required
                />

                {/* Mobile - Phone number validation */}
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

                {/* Alternate Mobile - Phone number validation */}
                <CommanInput
                    onChange={handleChange}
                    label={labels.alt_mob_no.label}
                    type="text"
                    name="alt_mob_no"
                    value={localFormData.alt_mob_no}
                    required
                    max={10}
                    validationType="PHONE"
                />

                {/* Email - Email validation */}
                <CommanInput
                    onChange={handleChange}
                    label={labels.email.label}
                    type="email"
                    name="email"
                    value={localFormData.email}
                    required
                    validationType="EMAIL"
                />

                {/* Aadhar Number - 12 digit number */}
                <CommanInput
                    onChange={handleChange}
                    label={labels.adhar_card.label}
                    type="text"
                    name="adhar_card"
                    value={localFormData.adhar_card}
                    required
                    max={12}
                    validationType="NUMBER_ONLY"
                />

                {/* PAN Number - PAN validation */}
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

                {/* Driving License - Alphanumeric with special chars */}
                <CommanInput
                    onChange={handleChange}
                    label={labels.drivinglicence.label}
                    type="text"
                    name="drivinglicence"
                    value={localFormData.drivinglicence}
                    max={20}
                    validationType="REGISTRATION_NO"
                />

                {/* Voter ID - Alphanumeric with special chars */}
                <CommanInput
                    onChange={handleChange}
                    label={labels.voterid.label}
                    type="text"
                    name="voterid"
                    value={localFormData.voterid}
                    max={20}
                    validationType="REGISTRATION_NO"
                />

                {/* Passport Number - Alphanumeric */}
                <CommanInput
                    onChange={handleChange}
                    label={labels.passportno.label}
                    type="text"
                    name="passportno"
                    value={localFormData.passportno}
                    max={20}
                    validationType="ALPHANUMERIC"
                />

                {/* Complex Name - Text with spaces */}
                <CommanInput
                    onChange={handleChange}
                    label={labels.complexname.label}
                    type="text"
                    name="complex_name"
                    value={localFormData.complex_name}
                    required
                    max={50}
                    validationType="ALPHABETS_AND_SPACE"
                />

                {/* Room/Flat No - Alphanumeric */}
                <CommanInput
                    onChange={handleChange}
                    label={labels.roomno.label}
                    type="text"
                    name="flat_no"
                    value={localFormData.flat_no}
                    required
                    max={20}
                    validationType="ALPHANUMERIC"
                />

                {/* Area - Text with spaces */}
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

                {/* Landmark - More flexible validation */}
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

                {/* Country - Text with spaces */}
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

                {/* Pincode - 6 digit number */}
                <CommanInput
                    onChange={handleChange}
                    label={labels.pincode.label}
                    type="text"
                    name="pincode"
                    value={localFormData.pincode}
                    max={6}
                    required
                    validationType="NUMBER_ONLY"
                />

                {/* City - Text with spaces */}
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

                {/* District - Text with spaces */}
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

                {/* State - Text with spaces */}
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