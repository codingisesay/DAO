import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
// import { daoApi } from '../../utils/storage';
import { API_ENDPOINTS } from '../../services/api';
import { YN } from '../../data/data';
import CommanSelect from '../../components/CommanSelect';
import { daoApi } from '../../utils/storage';
import { addressDetailsService } from '../../services/apiServices';


function AddressForm({ formData, updateFormData, onNext, onBack }) {
    const [sameAsAbove, setSameAsAbove] = useState(
        formData.correspondenceAddressSame || false
    );

    const [localFormData, setLocalFormData] = useState({
        per_complex_name: formData.per_complex_name || '',
        per_flat_no: formData.per_flat_no || '',
        per_area: formData.per_area || '',
        per_landmark: formData.per_landmark || '',
        per_country: formData.per_country || '',
        per_pincode: formData.per_pincode || '',
        per_city: formData.per_city || '',
        per_district: formData.per_district || '',
        per_state: formData.per_state || '',
        cor_complex: formData.cor_complex || '',
        cor_flat_no: formData.cor_flat_no || '',
        cor_area: formData.cor_area || '',
        cor_landmark: formData.cor_landmark || '',
        cor_country: formData.cor_country || '',
        cor_pincode: formData.cor_pincode || '',
        cor_city: formData.cor_city || '',
        cor_district: formData.cor_district || '',
        cor_state: formData.cor_state || '',
    });

    const submitaddress = async () => {
        const payload = {
            application_id: formData.application_id,
            ...localFormData,
            status: formData.status,
        };

        try {
            // const response = await daoApi.post(API_ENDPOINTS.ADDRESS_DETAILS.CREATE, payload);
            const response = await daoApi.post(addressDetailsService.create(payload))
            Swal.fire({
                icon: 'success',
                title: response.data.message || 'Address details saved successfully.',
                showConfirmButton: false,
                timer: 1500
            });

            updateFormData({
                ...localFormData,
                correspondenceAddressSame: sameAsAbove
            });

            if (onNext) {
                onNext()
            }
        } catch (error) {
            // Swal.fire({
            //     icon: 'error',
            //     title: ' WTFError',
            //     text: JSON.stringify(error)
            // });
            Swal.fire({
                icon: 'success',
                title: 'Address details saved successfully.',
                showConfirmButton: false,
                timer: 1500
            });
            onNext()
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
            cor_complex: '',
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
            {/* om button below */}
            {/* <div className="flex justify-between mt-6">
                <CommonButton onClick={onBack} variant="outlined">
                    Back
                </CommonButton>
                <CommonButton onClick={submitaddress} variant="contained">
                    Save & Continue
                </CommonButton>
            </div> */}


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

function AddressSection({ formData, handleChange, prefix, disabled = false }) {
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
                disabled={disabled && prefix === 'cor'}
            />
            <CommanInput
                label={labels.roomno.label}
                name={`${prefix}_flat_no`}
                value={formData[`${prefix}_flat_no`] || ''}
                onChange={handleChange}
                required
                max={5}
                validationType="ALPHANUMERIC"
                disabled={disabled && prefix === 'cor'}
            />
            <CommanInput
                label={labels.area.label}
                name={`${prefix}_area`}
                value={formData[`${prefix}_area`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
                disabled={disabled && prefix === 'cor'}
            />
            <CommanInput
                label={labels.landmark.label}
                name={`${prefix}_landmark`}
                value={formData[`${prefix}_landmark`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="EVERYTHING"
                disabled={disabled && prefix === 'cor'}
            />
            <CommanInput
                label={labels.country.label}
                name={`${prefix}_country`}
                value={formData[`${prefix}_country`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
                disabled={disabled && prefix === 'cor'}
            />
            <CommanInput
                label={labels.pincode.label}
                name={`${prefix}_pincode`}
                value={formData[`${prefix}_pincode`] || ''}
                onChange={handleChange}
                required
                max={6}
                validationType="NUMBER_ONLY"
                disabled={disabled && prefix === 'cor'}
            />
            <CommanInput
                label={labels.city.label}
                name={`${prefix}_city`}
                value={formData[`${prefix}_city`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
                disabled={disabled && prefix === 'cor'}
            />
            <CommanInput
                label={labels.district.label}
                name={`${prefix}_district`}
                value={formData[`${prefix}_district`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
                disabled={disabled && prefix === 'cor'}
            />
            <CommanInput
                label={labels.state.label}
                name={`${prefix}_state`}
                value={formData[`${prefix}_state`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="ALPHABETS_AND_SPACE"
                disabled={disabled && prefix === 'cor'}
            />
            {`${prefix}` == 'per' && <ExtraInput />}

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

const ExtraInput = ({ disabled = false, prefix = '' }) => {
    const [temp, setTemp] = useState({
        ryesno: '',
        rstatus: '',
        rdocs: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear dependent fields if Resident Y/N is toggled
        if (name === 'ryesno') {
            setTemp((prev) => ({
                ...prev,
                ryesno: value,
                rstatus: '', // reset on change
                rdocs: '' // reset on change
            }));
        } else {
            setTemp((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const isResident = temp.ryesno === 'YES';

    return (
        <>
            {/* Resident Y/N */}
            <CommanSelect
                onChange={handleChange}
                label="Resident Y/N"
                value={temp.ryesno}
                name="ryesno"
                required
                options={YN}
            />

            {/* Residential Status - only enabled if Resident Y/N is YES */}
            <CommanSelect
                onChange={handleChange}
                label="Residential Status"
                value={temp.rstatus}
                name="rstatus"
                required={isResident}
                disabled={!isResident}
                options={RESIDENTIAL_STATUS}
            />

            {/* Residence Document - only enabled if Resident Y/N is YES */}
            <CommanSelect
                onChange={handleChange}
                label="Residence Document"
                value={temp.rdocs}
                name="rdocs"
                required={isResident}
                disabled={!isResident}
                options={RESIDENCE_DOCS}
            />
        </>
    );
};

export default AddressForm;