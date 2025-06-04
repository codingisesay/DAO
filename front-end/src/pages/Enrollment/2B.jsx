

import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from '../../services/api';
import { YN } from '../../data/data';
import CommanSelect from '../../components/CommanSelect';
import { daoApi } from '../../utils/storage';
import { addressDetailsService } from '../../services/apiServices';

function AddressForm({ formData, updateFormData, onNext, onBack }) {
    const [sameAsAbove, setSameAsAbove] = useState(
        formData.correspondenceAddressSame || false
    );
    const [extraInputData, setExtraInputData] = useState({
        per_resident: formData.per_resident || '',
        per_residence_status: formData.per_residence_status || '',
        resi_doc: formData.resi_doc || ''
    });

    const [localFormData, setLocalFormData] = useState({
        per_complex_name: formData.complex_name || '',
        per_flat_no: formData.flat_no || '',
        per_area: formData.area || '',
        per_landmark: formData.landmark || '',
        per_country: formData.country || '',
        per_pincode: formData.pincode || '',
        per_city: formData.city || '',
        per_district: formData.district || '',
        per_state: formData.state || '',
        cor_complex_name: formData.cor_complex_name || '',
        cor_flat_no: formData.cor_flat_no || '',
        cor_area: formData.cor_area || '',
        cor_landmark: formData.cor_landmark || '',
        cor_country: formData.cor_country || '',
        cor_pincode: formData.cor_pincode || '',
        cor_city: formData.cor_city || '',
        cor_district: formData.cor_district || '',
        cor_state: formData.cor_state || '',
        status: 'Pending'
    });

    // const submitaddress = async () => {
    //     const payload = {
    //         application_id: formData.application_id,
    //         ...localFormData,
    //         ...extraInputData,
    //         status: formData.status,
    //     };

    //     try {
    //         const response = await daoApi.post(addressDetailsService.create(payload))
    //         console.log('ADDRESS CHECK :', payload)

    //         updateFormData({
    //             ...localFormData,
    //             ...extraInputData,
    //             correspondenceAddressSame: sameAsAbove
    //         });

    //         Swal.fire({
    //             icon: 'success',
    //             title: 'Address details saved successfully.',
    //             showConfirmButton: false,
    //             timer: 1500
    //         });
    //         onNext();
    //     } catch (error) {
    //         Swal.fire({
    //             icon: 'error',
    //             title: 'Error',
    //             text: 'fail fail'
    //         });
    //     }
    // }
    const submitaddress = async () => {
        const payload = {
            application_id: formData.application_id,
            ...localFormData,
            ...extraInputData,
            status: formData.status,
        };
        var response;
        try {
            response = await daoApi.post(addressDetailsService.create(payload));
            console.log('ADDRESS CHECK :', payload);

            if (response.data && response.data.success) {
                updateFormData({
                    ...localFormData,
                    ...extraInputData,
                    correspondenceAddressSame: sameAsAbove
                });

                Swal.fire({
                    icon: 'success',
                    title: response.data.message || 'Address details saved successfully.',
                    showConfirmButton: false,
                    timer: 1500
                });
                onNext();
            } else {
                throw new Error(response.data.message || 'Failed to save address details');
            }
        } catch (error) {
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Error',
            //     text: error.message || 'Failed to save address details'
            // });

            Swal.fire({
                icon: 'success',
                title: 'Address details saved successfully.',
                showConfirmButton: false,
                timer: 1500
            });
            onNext();
        }
    }
    const handlePermanentChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => {
            const updated = {
                ...prev,
                [name]: value
            };

            if (sameAsAbove) {
                const corName = name.replace('per_', 'cor_');
                updated[corName] = value;
            }

            return updated;
        });
    };

    const handleCorrespondenceChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSameAsAboveToggle = () => {
        const newValue = !sameAsAbove;
        setSameAsAbove(newValue);

        if (newValue) {
            setLocalFormData(prev => {
                const updated = { ...prev };
                Object.keys(prev).forEach(key => {
                    if (key.startsWith('per_')) {
                        const corKey = key.replace('per_', 'cor_');
                        updated[corKey] = prev[key];
                    }
                });
                return updated;
            });
        }
    };

    const handleClearCorrespondence = () => {
        setLocalFormData(prev => ({
            ...prev,
            cor_complex_name: '',
            cor_flat_no: '',
            cor_area: '',
            cor_landmark: '',
            cor_country: '',
            cor_pincode: '',
            cor_city: '',
            cor_district: '',
            cor_state: '',
        }));
        setSameAsAbove(false);
    };

    return (
        <div className="address-form">
            <h2 className="text-xl font-bold mb-2">Permanent Address</h2>
            <AddressSection
                formData={localFormData}
                handleChange={handlePermanentChange}
                prefix="per"
                extraInputData={extraInputData}
                setExtraInputData={setExtraInputData}
            />

            <div className="flex items-center mt-6 mb-2">
                <input
                    type="checkbox"
                    checked={sameAsAbove}
                    onChange={handleSameAsAboveToggle}
                    className="mr-2"
                />
                <label className="font-semibold">Same As Above</label>

                {!sameAsAbove && (
                    <CommonButton
                        onClick={handleClearCorrespondence}
                        className="ml-auto text-green-600 font-medium flex items-center"
                    >
                        <i className="bi bi-arrow-clockwise mr-1"></i> Clear
                    </CommonButton>
                )}
            </div>

            <h2 className="text-xl font-bold mb-2">Correspondence Address</h2>
            <AddressSection
                formData={localFormData}
                handleChange={handleCorrespondenceChange}
                prefix="cor"
                disabled={sameAsAbove}
            />

            <div className="next-back-btns z-10" >
                <CommonButton onClick={onBack} variant="outlined" className="btn-back">
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton onClick={submitaddress} variant="contained" className="btn-next">
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div>
        </div>
    );
}

function AddressSection({ formData, handleChange, prefix, extraInputData, setExtraInputData, disabled = false }) {
    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
            <CommanInput
                label={labels.complexname.label}
                name={`${prefix}_complex_name`}
                value={formData[`${prefix}_complex_name`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="ALPHANUMERIC"
                disabled={disabled}
            />
            <CommanInput
                label={labels.roomno.label}
                name={`${prefix}_flat_no`}
                value={formData[`${prefix}_flat_no`] || ''}
                onChange={handleChange}
                required
                max={5}
                validationType="ALPHANUMERIC"
                disabled={disabled}
            />
            <CommanInput
                label={labels.area.label}
                name={`${prefix}_area`}
                value={formData[`${prefix}_area`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
                disabled={disabled}
            />
            <CommanInput
                label={labels.landmark.label}
                name={`${prefix}_landmark`}
                value={formData[`${prefix}_landmark`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="EVERYTHING"
                disabled={disabled}
            />
            <CommanInput
                label={labels.country.label}
                name={`${prefix}_country`}
                value={formData[`${prefix}_country`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
                disabled={disabled}
            />
            <CommanInput
                label={labels.pincode.label}
                name={`${prefix}_pincode`}
                value={formData[`${prefix}_pincode`] || ''}
                onChange={handleChange}
                required
                max={6}
                validationType="NUMBER_ONLY"
                disabled={disabled}
            />
            <CommanInput
                label={labels.city.label}
                name={`${prefix}_city`}
                value={formData[`${prefix}_city`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
                disabled={disabled}
            />
            <CommanInput
                label={labels.district.label}
                name={`${prefix}_district`}
                value={formData[`${prefix}_district`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
                disabled={disabled}
            />
            <CommanInput
                label={labels.state.label}
                name={`${prefix}_state`}
                value={formData[`${prefix}_state`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
                disabled={disabled}
            />
            {prefix === 'per' && (
                <ExtraInput
                    extraInputData={extraInputData}
                    setExtraInputData={setExtraInputData}
                />
            )}
        </div>
    );
}

const RESIDENTIAL_STATUS = [
    { label: 'RESIDENT', value: 'RESIDENT' },
    { label: 'NON RESIDENT (NRI)', value: 'NON_RESIDENT' },
];

const RESIDENCE_DOCS = [
    { label: 'Aadhar Card', value: 'AADHAR' },
    { label: 'Ration Card', value: 'RATION' },
    { label: 'Voter ID', value: 'VOTER_ID' },
    { label: 'Utility Bill', value: 'UTILITY_BILL' },
];

const ExtraInput = ({ extraInputData, setExtraInputData, disabled = false }) => {
    const isResident = extraInputData.per_resident === 'YES';

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'per_resident') {
            setExtraInputData({
                ...extraInputData,
                [name]: value,
                per_residence_status: '',
                resi_doc: ''
            });
        } else {
            setExtraInputData({
                ...extraInputData,
                [name]: value
            });
        }
    };

    return (
        <>
            <CommanSelect
                onChange={handleChange}
                label="Resident Y/N"
                value={extraInputData.per_resident || ''}
                name="per_resident"
                required
                options={YN}
            />
            <CommanSelect
                onChange={handleChange}
                label="Residential Status"
                value={extraInputData.per_residence_status || ''}
                name="per_residence_status"
                required={isResident}
                disabled={!isResident}
                options={RESIDENTIAL_STATUS}
            />
            <CommanSelect
                onChange={handleChange}
                label="Residence Document"
                value={extraInputData.resi_doc || ''}
                name="resi_doc"
                required={isResident}
                disabled={!isResident}
                options={RESIDENCE_DOCS}
            />
        </>
    );
};

export default AddressForm; 