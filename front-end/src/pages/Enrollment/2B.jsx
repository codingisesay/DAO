import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';

function AddressSection({ formData, handleChange, isRequired = true }) {
    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
            <CommanInput
                label={labels.complexname.label}
                name="complexname"
                value={formData.complexname}
                onChange={handleChange}
                required={isRequired}
                max={50}
                validationType="ALPHANUMERIC"
            />
            <CommanInput
                label={labels.flatnoroomno.label}
                name="flatnoroomno"
                value={formData.flatnoroomno}
                onChange={handleChange}
                required={isRequired}
                max={20}
                validationType="ALPHANUMERIC"
            />
            <CommanInput
                label={labels.area.label}
                name="area"
                value={formData.area}
                onChange={handleChange}
                required={isRequired}
                max={50}
                validationType="ALPHABETS_AND_SPACE"
            />
            <CommanInput
                label={labels.landmark.label}
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                required={isRequired}
                max={50}
                validationType="EVERYTHING"
            />
            <CommanInput
                label={labels.country.label}
                name="country"
                value={formData.country}
                onChange={handleChange}
                required={isRequired}
                max={30}
                validationType="ALPHABETS_AND_SPACE"
            />
            <CommanInput
                label={labels.pincode.label}
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                required={isRequired}
                max={10}
                validationType="NUMBER_ONLY"
            />
            <CommanInput
                label={labels.city.label}
                name="city"
                value={formData.city}
                onChange={handleChange}
                required={isRequired}
                max={30}
                validationType="ALPHABETS_AND_SPACE"
            />
            <CommanInput
                label={labels.district.label}
                name="district"
                value={formData.district}
                onChange={handleChange}
                required={isRequired}
                max={30}
                validationType="ALPHABETS_AND_SPACE"
            />
            <CommanInput
                label={labels.state.label}
                name="state"
                value={formData.state}
                onChange={handleChange}
                required={isRequired}
                max={30}
                validationType="ALPHABETS_AND_SPACE"
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
            area: formData.permanentAddress?.area || '',
            landmark: formData.permanentAddress?.landmark || '',
            country: formData.permanentAddress?.country || '',
            pincode: formData.permanentAddress?.pincode || '',
            city: formData.permanentAddress?.city || '',
            district: formData.permanentAddress?.district || '',
            state: formData.permanentAddress?.state || ''
        },
        correspondenceAddress: {
            ...formData.correspondenceAddress,
            complexname: formData.correspondenceAddress?.complexName || '',
            flatnoroomno: formData.correspondenceAddress?.flatNo || '',
            area: formData.correspondenceAddress?.area || '',
            landmark: formData.correspondenceAddress?.landmark || '',
            country: formData.correspondenceAddress?.country || '',
            pincode: formData.correspondenceAddress?.pincode || '',
            city: formData.correspondenceAddress?.city || '',
            district: formData.correspondenceAddress?.district || '',
            state: formData.correspondenceAddress?.state || ''
        }
    });

    const validateAddress = (address, isRequired) => {
        if (!isRequired && Object.values(address).every(val => !val)) {
            return true;
        }

        if (isRequired && (!address.complexname || address.complexname.length > 50)) {
            Swal.fire('Error', 'Complex name is required and must be less than 50 characters', 'error');
            return false;
        }
        if (isRequired && (!address.flatnoroomno || address.flatnoroomno.length > 20)) {
            Swal.fire('Error', 'Flat/Room number must be less than 20 characters', 'error');
            return false;
        }
        if (isRequired && (!address.pincode || !/^\d{6}$/.test(address.pincode))) {
            Swal.fire('Error', 'Pincode must be exactly 6 digits', 'error');
            return false;
        }
        return true;
    };

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
                : {
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

    const handleSubmit = () => {
        if (!validateAddress(localFormData.permanentAddress, true)) return;

        // Only validate correspondence address if not same as above AND fields are filled
        const hasCorrespondenceData = Object.values(localFormData.correspondenceAddress).some(val => val);
        if (!sameAsAbove && hasCorrespondenceData && !validateAddress(localFormData.correspondenceAddress, false)) {
            return;
        }

        updateFormData({
            permanentAddress: {
                complexName: localFormData.permanentAddress.complexname,
                flatNo: localFormData.permanentAddress.flatnoroomno,
                area: localFormData.permanentAddress.area,
                landmark: localFormData.permanentAddress.landmark,
                country: localFormData.permanentAddress.country,
                pincode: localFormData.permanentAddress.pincode,
                city: localFormData.permanentAddress.city,
                district: localFormData.permanentAddress.district,
                state: localFormData.permanentAddress.state
            },
            correspondenceAddressSame: sameAsAbove,
            correspondenceAddress: sameAsAbove
                ? null
                : {
                    complexName: localFormData.correspondenceAddress.complexname,
                    flatNo: localFormData.correspondenceAddress.flatnoroomno,
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
                isRequired={true}
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
                formData={localFormData.correspondenceAddress}
                handleChange={handleCorrespondenceChange}
                isRequired={!sameAsAbove}
                disabled={sameAsAbove}
            />

            {/* <div className="next-back-btns z-10">
                <CommonButton className="btn-back border-0" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton
                    className="btn-next border-0"
                    onClick={handleSubmit}
                >
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div> */}
        </div>
    );
}

export default AddressForm;