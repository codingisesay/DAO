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
                label={labels.roomno.label}
                name="roomno"
                value={formData.roomno}
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
            roomno: formData.permanentAddress?.flatNo || '',
            // Map other fields as needed
        },
        correspondenceAddress: {
            ...formData.correspondenceAddress,
            complexname: formData.correspondenceAddress?.complexName || '',
            roomno: formData.correspondenceAddress?.flatNo || '',
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
                roomno: '',
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

    const handleSubmit = () => {
        updateFormData({
            permanentAddress: {
                complexName: localFormData.permanentAddress.complexname,
                flatNo: localFormData.permanentAddress.roomno,
                area: localFormData.permanentAddress.area,
                landmark: localFormData.permanentAddress.landmark,
                country: localFormData.permanentAddress.country,
                pincode: localFormData.permanentAddress.pincode,
                city: localFormData.permanentAddress.city,
                district: localFormData.permanentAddress.district,
                state: localFormData.permanentAddress.state
            },
            correspondenceAddressSame: sameAsAbove,
            correspondenceAddress: {
                complexName: localFormData.correspondenceAddress.complexname,
                flatNo: localFormData.correspondenceAddress.roomno,
                area: localFormData.correspondenceAddress.area,
                landmark: localFormData.correspondenceAddress.landmark,
                country: localFormData.correspondenceAddress.country,
                pincode: localFormData.correspondenceAddress.pincode,
                city: localFormData.correspondenceAddress.city,
                district: localFormData.correspondenceAddress.district,
                state: localFormData.correspondenceAddress.state
            }
        });
        onNext();
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

            <div className="next-back-btns z-10">
                <CommonButton className="btn-back border-0" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton
                    className="btn-next border-0"
                    onClick={handleSubmit}
                >
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div>
        </div>
    );
}

export default AddressForm; 