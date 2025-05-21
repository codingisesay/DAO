import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';

function AddressSection({ formData, handleChange, prefix }) {
    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
            <CommanInput
                label={labels.complexname.label}
                name={`${prefix}_complex`}
                value={formData[`${prefix}_complex`] || ''}
                onChange={handleChange}
                required
                max={50}
                validationType="ALPHANUMERIC"
            />
            <CommanInput
                label={labels.flatnoroomno.label}
                name={`${prefix}_flat_no`}
                value={formData[`${prefix}_flat_no`] || ''}
                onChange={handleChange}
                required
                max={20}
                validationType="ALPHANUMERIC"
            />
            <CommanInput
                label={labels.area.label}
                name={`${prefix}_area`}
                value={formData[`${prefix}_area`] || ''}
                onChange={handleChange}
                required
                max={50}
                validationType="ALPHABETS_AND_SPACE"
            />
            <CommanInput
                label={labels.landmark.label}
                name={`${prefix}_landmark`}
                value={formData[`${prefix}_landmark`] || ''}
                onChange={handleChange}
                required
                max={50}
                validationType="EVERYTHING"
            />
            <CommanInput
                label={labels.country.label}
                name={`${prefix}_country`}
                value={formData[`${prefix}_country`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
            />
            <CommanInput
                label={labels.pincode.label}
                name={`${prefix}_pincode`}
                value={formData[`${prefix}_pincode`] || ''}
                onChange={handleChange}
                required
                max={10}
                validationType="NUMBER_ONLY"
            />
            <CommanInput
                label={labels.city.label}
                name={`${prefix}_city`}
                value={formData[`${prefix}_city`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
            />
            <CommanInput
                label={labels.district.label}
                name={`${prefix}_district`}
                value={formData[`${prefix}_district`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
            />
            <CommanInput
                label={labels.state.label}
                name={`${prefix}_state`}
                value={formData[`${prefix}_state`] || ''}
                onChange={handleChange}
                required
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
            per_complex: formData.permanentAddress?.per_complex || '',
            per_flat_no: formData.permanentAddress?.per_flat_no || '',
            per_area: formData.permanentAddress?.per_area || '',
            per_landmark: formData.permanentAddress?.per_landmark || '',
            per_country: formData.permanentAddress?.per_country || '',
            per_pincode: formData.permanentAddress?.per_pincode || '',
            per_city: formData.permanentAddress?.per_city || '',
            per_district: formData.permanentAddress?.per_district || '',
            per_state: formData.permanentAddress?.per_state || '',
        },
        correspondenceAddress: {
            cor_complex: formData.correspondenceAddress?.cor_complex || '',
            cor_flat_no: formData.correspondenceAddress?.cor_flat_no || '',
            cor_area: formData.correspondenceAddress?.cor_area || '',
            cor_landmark: formData.correspondenceAddress?.cor_landmark || '',
            cor_country: formData.correspondenceAddress?.cor_country || '',
            cor_pincode: formData.correspondenceAddress?.cor_pincode || '',
            cor_city: formData.correspondenceAddress?.cor_city || '',
            cor_district: formData.correspondenceAddress?.cor_district || '',
            cor_state: formData.correspondenceAddress?.cor_state || '',
        }
    });

    // Update parent formData when localFormData changes
    React.useEffect(() => {
        updateFormData({
            permanentAddress: localFormData.permanentAddress,
            correspondenceAddress: localFormData.correspondenceAddress,
        });
    }, [localFormData, updateFormData]);

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
                updated.correspondenceAddress = Object.fromEntries(
                    Object.entries(updated.permanentAddress).map(([k, v]) => [
                        k.replace('per_', 'cor_'), v
                    ])
                );
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
                ? Object.fromEntries(
                    Object.entries(prev.permanentAddress).map(([k, v]) => [
                        k.replace('per_', 'cor_'), v
                    ])
                )
                : prev.correspondenceAddress
        }));
    };

    const handleClearCorrespondence = () => {
        setLocalFormData(prev => ({
            ...prev,
            correspondenceAddress: {
                cor_complex: '',
                cor_flat_no: '',
                cor_area: '',
                cor_landmark: '',
                cor_country: '',
                cor_pincode: '',
                cor_city: '',
                cor_district: '',
                cor_state: '',
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
                prefix="per"
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
                prefix="cor"
            />
        </div>
    );
}

export default AddressForm;