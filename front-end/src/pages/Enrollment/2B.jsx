import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';

function AddressSection({ formData, handleChange }) {
    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
            <CommanInput
                label={labels.complexname.label}
                name="complexname"
                value={formData.complexname}
                onChange={handleChange}
                required
            />
            <CommanInput
                label={labels.flatnoroomno.label}
                name="flatnoroomno"
                value={formData.flatnoroomno}
                onChange={handleChange}
                required
            />
            <CommanInput
                label={labels.area.label}
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
            />
            <CommanInput
                label={labels.landmark.label}
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                required
            />
            <CommanInput
                label={labels.country.label}
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
            />
            <CommanInput
                label={labels.pincode.label}
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
            />
            <CommanInput
                label={labels.city.label}
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
            />
            <CommanInput
                label={labels.district.label}
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
            />
            <CommanInput
                label={labels.state.label}
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
            />
        </div>
    );
}

function AddressForm({ formData, updateFormData, onNext, onBack }) {
    const [sameAsAbove, setSameAsAbove] = useState(
        formData.correspondenceAddressSame || false
    );

    const [localFormData, setLocalFormData] = useState({
        permanentAddress: {
            ...formData.permanentAddress,
            complexname: formData.permanentAddress?.complexName || '',
            flatnoroomno: formData.permanentAddress?.flatNo || '',
            // Map other fields as needed
        },
        correspondenceAddress: {
            ...formData.correspondenceAddress,
            complexname: formData.correspondenceAddress?.complexName || '',
            flatnoroomno: formData.correspondenceAddress?.flatNo || '',
            // Map other fields as needed
        }
    });

    const handlePermanentChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => {
            const updated = {
                ...prev,
                permanentAddress: {
                    ...prev.permanentAddress,
                    [name]: value
                }
            };

            if (sameAsAbove) {
                updated.correspondenceAddress = { ...updated.permanentAddress };
            }
            return updated;
        });
    };

    const handleCorrespondenceChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({
            ...prev,
            correspondenceAddress: {
                ...prev.correspondenceAddress,
                [name]: value
            }
        }));
    };

    const handleSameAsAboveToggle = () => {
        const newValue = !sameAsAbove;
        setSameAsAbove(newValue);

        setLocalFormData(prev => ({
            ...prev,
            correspondenceAddress: newValue
                ? { ...prev.permanentAddress }
                : prev.correspondenceAddress
        }));
    };

    const handleClearCorrespondence = () => {
        setLocalFormData(prev => ({
            ...prev,
            correspondenceAddress: {
                complexname: '',
                flatnoroomno: '',
                area: '',
                landmark: '',
                country: '',
                pincode: '',
                city: '',
                district: '',
                state: '',
            }
        }));
        setSameAsAbove(false);
    };



    return (
        <div className="address-form">
            <h2 className="text-xl font-bold mb-2">Permanent Address</h2>
            <AddressSection
                formData={localFormData.permanentAddress}
                handleChange={handlePermanentChange}
            />

            <div className="flex items-center mt-6 mb-2">
                <input
                    type="checkbox"
                    checked={sameAsAbove}
                    onChange={handleSameAsAboveToggle}
                    className="mr-2"
                />
                <label className="font-semibold">Same As Above</label>

                <CommonButton
                    onClick={handleClearCorrespondence}
                    className="ml-auto text-green-600 font-medium flex items-center"
                >
                    <i className="bi bi-arrow-clockwise mr-1"></i> Clear
                </CommonButton>
            </div>

            <h2 className="text-xl font-bold mb-2">Correspondence Address</h2>
            <AddressSection
                formData={localFormData.correspondenceAddress}
                handleChange={handleCorrespondenceChange}
            />


        </div>
    );
}

export default AddressForm; 