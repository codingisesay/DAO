import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { useParams } from 'react-router-dom';
import { salutation, gender, religion, caste } from '../../data/data';

import { pendingAccountData } from '../../services/apiServices';


function PersonalDetailsForm({ formData, updateFormData, }) {
    const { id } = useParams();
    const [localFormData, setLocalFormData] = useState({
        salutation: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        DOB: '',
        gender: '',
        mobile: '',
        complexName: '',
        flatNoRoomNo: '',
        area: '',
        landmark: '',
        country: '',
        pincode: '',
        city: '',
        district: '',
        state: ''
    });

    useEffect(() => {
        const fetchAndStoreDetails = async () => {
            try {
                // alert('called')
                if (id) {
                    const response = await pendingAccountData.getDetailsS2A(id);
                    // localStorage.setItem('applicationDetails', JSON.stringify(response));
                    // console.log('got data :', response.data.details);
                    const application = response.data.details || {};
                    // const personal = response?.data?.personal_details || {};

                    setLocalFormData({
                        salutation: application.salutation || '',
                        first_name: application.first_name || '',
                        middle_name: application.middle_name || '',
                        last_name: application.last_name || '',
                        DOB: application.DOB || '',
                        gender: application.gender || '',
                        mobile: application.mobile || '',
                        complexName: application.complex_name || '',
                        flatNoRoomNo: application.flat_no || '',
                        area: application.area || '',
                        landmark: application.landmark || '',
                        country: application.country || '',
                        pincode: application.pincode || '',
                        city: application.city || '',
                        district: application.district || '',
                        state: application.state || '',

                    });
                }
            } catch (error) {
                console.error('Failed to fetch application details:', error);
            }
        };

        fetchAndStoreDetails();
    }, [id]);







    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        updateFormData({
            personalDetails: {
                ...localFormData
            }
        });
        onNext();
    };

    return (
        <div className="personal-details-form">
            <h2 className="text-xl font-bold mb-2">Personal Details</h2>

            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
                <CommanInput
                    onChange={handleChange}
                    label={labels.salutation.label}
                    name="salutation"
                    value={localFormData.salutation}
                    // options={salutation}
                    required
                />

                <CommanInput
                    onChange={handleChange}
                    label={labels.firstname.label}
                    type="text"
                    name="firstName"
                    value={localFormData.first_name}
                    required
                    readOnly={true} />
                <CommanInput
                    onChange={handleChange}
                    label={labels.middlename.label}
                    type="text"
                    name="middleName"
                    value={localFormData.middle_name}
                    required
                    readOnly={true} />
                <CommanInput
                    onChange={handleChange}
                    label={labels.lastname.label}
                    type="text"
                    name="lastName"
                    value={localFormData.last_name}
                    required
                    readOnly={true} />
                <CommanInput
                    onChange={handleChange}
                    label={labels.dob.label}
                    type="date"
                    name="dob"
                    value={localFormData.DOB}
                    required
                    readOnly={true} />
                <CommanInput
                    onChange={handleChange}
                    label={labels.gender.label}
                    type="text"
                    name="gender"
                    value={localFormData.gender}
                    required
                    readOnly={true} />
                <CommanInput
                    onChange={handleChange}
                    label={labels.mobile.label}
                    type="text"
                    name="mobile"
                    value={localFormData.mobile}
                    required
                    readOnly={true} />
                <CommanInput
                    onChange={handleChange}
                    label={labels.complexname.label}
                    type="text"
                    name="complexName"
                    value={localFormData.complexName}
                    required
                    readOnly={true} />
                <CommanInput
                    onChange={handleChange}
                    label='Flat no/Room no'
                    type="text"
                    name="flatNoRoomNo"
                    value={localFormData.flatNoRoomNo}
                    required
                    readOnly={true} />
                <CommanInput
                    onChange={handleChange}
                    label={labels.area.label}
                    type="text"
                    name="area"
                    value={localFormData.area}
                    required
                    readOnly={true} />
                <CommanInput
                    onChange={handleChange}
                    label={labels.landmark.label}
                    type="text"
                    name="landmark"
                    value={localFormData.landmark}
                    required
                    readOnly={true} />
                <CommanInput
                    onChange={handleChange}
                    label={labels.country.label}
                    type="text"
                    name="country"
                    value={localFormData.country}
                    required
                    readOnly={true} />
                <CommanInput
                    onChange={handleChange}
                    label={labels.pincode.label}
                    type="text"
                    name="pincode"
                    value={localFormData.pincode}
                    required
                    readOnly={true} />
                <CommanInput
                    onChange={handleChange}
                    label={labels.city.label}
                    type="text"
                    name="city"
                    value={localFormData.city}
                    required
                    readOnly={true} />
                <CommanInput
                    onChange={handleChange}
                    label={labels.district.label}
                    type="text"
                    name="district"
                    value={localFormData.district}
                    required
                    readOnly={true} />
                <CommanInput
                    onChange={handleChange}
                    label={labels.state.label}
                    type="text"
                    name="state"
                    value={localFormData.state}
                    required
                    readOnly={true} />
            </div>


        </div>
    );
}

export default PersonalDetailsForm;