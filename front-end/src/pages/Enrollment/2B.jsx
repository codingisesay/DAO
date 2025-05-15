import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
function AddressSection({ formData, handleChange }) {
    return (
        <>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-3">
                <CommanInput label={labels.complexname.label} name="complexname" value={formData.complexname} onChange={handleChange} required />
                <CommanInput label={labels.flatnoroomno.label} name="flatnoroomno" value={formData.flatnoroomno} onChange={handleChange} required />
                <CommanInput label={labels.area.label} name="area" value={formData.area} onChange={handleChange} required />
                <CommanInput label={labels.landmark.label} name="landmark" value={formData.landmark} onChange={handleChange} required />

                <CommanInput label={labels.country.label} name="country" value={formData.country} onChange={handleChange} required />
                <CommanInput label={labels.pincode.label} name="pincode" value={formData.pincode} onChange={handleChange} required />
                <CommanInput label={labels.city.label} name="city" value={formData.city} onChange={handleChange} required />
                <CommanInput label={labels.district.label} name="district" value={formData.district} onChange={handleChange} required />

                <CommanInput label={labels.state.label} name="state" value={formData.state} onChange={handleChange} required />
                {/* Add Resident Y/N, Residence Status, Residence Document as dropdowns if needed */}
            </div>
        </>
    );
}

function AddressForm() {
    const [permanentAddress, setPermanentAddress] = useState({
        complexname: '',
        flatnoroomno: '',
        area: '',
        landmark: '',
        country: '',
        pincode: '',
        city: '',
        district: '',
        state: '',
    });

    const [correspondenceAddress, setCorrespondenceAddress] = useState({
        complexname: '',
        flatnoroomno: '',
        area: '',
        landmark: '',
        country: '',
        pincode: '',
        city: '',
        district: '',
        state: '',
    });

    const [sameAsAbove, setSameAsAbove] = useState(false);

    const handlePermanentChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...permanentAddress, [name]: value };
        setPermanentAddress(updated);

        if (sameAsAbove) {
            setCorrespondenceAddress(updated);
        }
    };

    const handleCorrespondenceChange = (e) => {
        const { name, value } = e.target;
        setCorrespondenceAddress({ ...correspondenceAddress, [name]: value });
    };

    const handleSameAsAboveToggle = () => {
        const newValue = !sameAsAbove;
        setSameAsAbove(newValue);
        if (newValue) {
            setCorrespondenceAddress(permanentAddress);
        }
    };

    const handleClearCorrespondence = () => {
        setCorrespondenceAddress({
            complexname: '',
            flatnoroomno: '',
            area: '',
            landmark: '',
            country: '',
            pincode: '',
            city: '',
            district: '',
            state: '',
        });
    };

    return (
        <>
            <h2 className="text-xl font-bold mb-2">Permanent Address</h2>
            <AddressSection formData={permanentAddress} handleChange={handlePermanentChange} />

            <div className="flex items-center mt-6 mb-2">
                <input type="checkbox" checked={sameAsAbove} onChange={handleSameAsAboveToggle} className="mr-2" />
                <label className="font-semibold">Same As Above</label>


                <CommonButton
                    onClick={handleClearCorrespondence}
                    className="ml-auto text-green-600 font-medium flex items-center"
                >
                    <i className="bi bi-arrow-clockwise mr-1"></i> Clear
                </CommonButton>

            </div>

            <h2 className="text-xl font-bold mb-2">Correspondence Address</h2>
            <AddressSection formData={correspondenceAddress} handleChange={handleCorrespondenceChange} />
        </>
    );
}

export default AddressForm;
