import React, { useState } from 'react';
import CommanInput from '../../../components/CommanInput';
import labels from '../../../components/labels';
import CommonButton from '../../../components/CommonButton';

function AddressForm({ formData, handleChange, nextStep, prevStep }) {
  const [sameAsAbove, setSameAsAbove] = useState(
    formData.correspondenceAddressSame || false
  );

  const [localFormData, setLocalFormData] = useState({
    // Permanent Address
    complex_name: formData.complex_name || '',
    flat_no: formData.flat_no || '',
    area: formData.area || '',
    landmark: formData.landmark || '',
    country: formData.country || '',
    pincode: formData.pincode || '',
    city: formData.city || '',
    district: formData.district || '',
    state: formData.state || '',

    // Correspondence Address
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

  const handlePermanentChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };

      if (sameAsAbove) {
        // Update correspondence fields when "Same as above" is checked
        const corField = `cor_${name}`;
        if (corField in prev) {
          updated[corField] = value;
        }
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
      // Copy permanent address to correspondence address
      setLocalFormData(prev => ({
        ...prev,
        cor_complex: prev.complex_name,
        cor_flat_no: prev.flat_no,
        cor_area: prev.area,
        cor_landmark: prev.landmark,
        cor_country: prev.country,
        cor_pincode: prev.pincode,
        cor_city: prev.city,
        cor_district: prev.district,
        cor_state: prev.state,
      }));
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

  const handleSubmit = () => {
    handleChange({
      // Permanent Address
      complex_name: localFormData.complex_name,
      flat_no: localFormData.flat_no,
      area: localFormData.area,
      landmark: localFormData.landmark,
      country: localFormData.country,
      pincode: localFormData.pincode,
      city: localFormData.city,
      district: localFormData.district,
      state: localFormData.state,

      // Correspondence Address
      correspondenceAddressSame: sameAsAbove,
      cor_complex: localFormData.cor_complex,
      cor_flat_no: localFormData.cor_flat_no,
      cor_area: localFormData.cor_area,
      cor_landmark: localFormData.cor_landmark,
      cor_country: localFormData.cor_country,
      cor_pincode: localFormData.cor_pincode,
      cor_city: localFormData.cor_city,
      cor_district: localFormData.cor_district,
      cor_state: localFormData.cor_state,
    });
    nextStep();
  };

  return (
    <div className="address-form">
      <h2 className="text-xl font-bold mb-2">Permanent Address</h2>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
        <CommanInput
          label={labels.complexname.label}
          name="complex_name"
          value={localFormData.complex_name}
          onChange={handlePermanentChange}
          required
        />
        <CommanInput
          label={labels.roomno.label}
          name="flat_no"
          value={localFormData.flat_no}
          onChange={handlePermanentChange}
          required
        />
        <CommanInput
          label={labels.area.label}
          name="area"
          value={localFormData.area}
          onChange={handlePermanentChange}
          required
        />
        <CommanInput
          label={labels.landmark.label}
          name="landmark"
          value={localFormData.landmark}
          onChange={handlePermanentChange}
          required
        />
        <CommanInput
          label={labels.country.label}
          name="country"
          value={localFormData.country}
          onChange={handlePermanentChange}
          required
        />
        <CommanInput
          label={labels.pincode.label}
          name="pincode"
          value={localFormData.pincode}
          onChange={handlePermanentChange}
          required
        />
        <CommanInput
          label={labels.city.label}
          name="city"
          value={localFormData.city}
          onChange={handlePermanentChange}
          required
        />
        <CommanInput
          label={labels.district.label}
          name="district"
          value={localFormData.district}
          onChange={handlePermanentChange}
          required
        />
        <CommanInput
          label={labels.state.label}
          name="state"
          value={localFormData.state}
          onChange={handlePermanentChange}
          required
        />
      </div>

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
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3">
        <CommanInput
          label={labels.complexname.label}
          name="cor_complex"
          value={localFormData.cor_complex}
          onChange={handleCorrespondenceChange}
          required={!sameAsAbove}
          disabled={sameAsAbove}
        />
        <CommanInput
          label={labels.roomno.label}
          name="cor_flat_no"
          value={localFormData.cor_flat_no}
          onChange={handleCorrespondenceChange}
          required={!sameAsAbove}
          disabled={sameAsAbove}
        />
        <CommanInput
          label={labels.area.label}
          name="cor_area"
          value={localFormData.cor_area}
          onChange={handleCorrespondenceChange}
          required={!sameAsAbove}
          disabled={sameAsAbove}
        />
        <CommanInput
          label={labels.landmark.label}
          name="cor_landmark"
          value={localFormData.cor_landmark}
          onChange={handleCorrespondenceChange}
          required={!sameAsAbove}
          disabled={sameAsAbove}
        />
        <CommanInput
          label={labels.country.label}
          name="cor_country"
          value={localFormData.cor_country}
          onChange={handleCorrespondenceChange}
          required={!sameAsAbove}
          disabled={sameAsAbove}
        />
        <CommanInput
          label={labels.pincode.label}
          name="cor_pincode"
          value={localFormData.cor_pincode}
          onChange={handleCorrespondenceChange}
          required={!sameAsAbove}
          disabled={sameAsAbove}
        />
        <CommanInput
          label={labels.city.label}
          name="cor_city"
          value={localFormData.cor_city}
          onChange={handleCorrespondenceChange}
          required={!sameAsAbove}
          disabled={sameAsAbove}
        />
        <CommanInput
          label={labels.district.label}
          name="cor_district"
          value={localFormData.cor_district}
          onChange={handleCorrespondenceChange}
          required={!sameAsAbove}
          disabled={sameAsAbove}
        />
        <CommanInput
          label={labels.state.label}
          name="cor_state"
          value={localFormData.cor_state}
          onChange={handleCorrespondenceChange}
          required={!sameAsAbove}
          disabled={sameAsAbove}
        />
      </div>

      <div className="next-back-btns z-10">
        <CommonButton className="btn-back border-0" onClick={prevStep}>
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