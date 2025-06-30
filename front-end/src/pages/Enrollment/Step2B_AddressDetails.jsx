
import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { addressDetailsService, applicationDetailsService, createAccountService } from '../../services/apiServices';
import CommanSelect from '../../components/CommanSelect';
import { YN, RESIDENCE_DOCS, RESIDENTIAL_STATUS } from '../../data/data';

function AddressForm({ formData, updateFormData, onNext, onBack, isSubmitting }) {
    const applicationId = localStorage.getItem('application_id');    
    const [localFormData, setLocalFormData] = useState({
        per_complex_name: formData.complex_name || '',
        per_flat_no: formData.flat_no || '',
        per_area: formData.area || '',
        per_landmark: formData.landmark || '',
        per_country: formData.country || 'INDIA',
        per_pincode: formData.pincode || '',
        per_city: formData.city || '',
        per_district: formData.district || '',
        per_state: formData.state || '',
        cor_complex_name: formData.cor_complex_name || (formData.correspondenceAddressSame ? formData.per_complex_name : ''),
        cor_flat_no: formData.cor_flat_no || (formData.correspondenceAddressSame ? formData.per_flat_no : ''),
        cor_area: formData.cor_area || '',
        cor_landmark: formData.cor_landmark || '',
        cor_country: formData.cor_country || 'INDIA',
        cor_pincode: formData.cor_pincode || '',
        cor_city: formData.cor_city || '',
        cor_district: formData.cor_district || '',
        cor_state: formData.cor_state || '',
        status: 'Pending'
    });

    const [extraInputData, setExtraInputData] = useState({
        per_resident: formData.per_resident || '',
        per_residence_status: formData.per_residence_status || '',
        resi_doc: formData.resi_doc || ''
    });

    const [sameAsAbove, setSameAsAbove] = useState(
        formData.correspondenceAddressSame || false
    );

    const [loadingPinCode, setLoadingPinCode] = useState({
        per: false,
        cor: false
    });

    // Fetch address details when component mounts
    useEffect(() => {
        if (!applicationId) return;
        const fetchDetails = async () => {
            try {
                const response = await applicationDetailsService.getFullDetails(applicationId);
                if (response.data) {
                    const { application_addresss } = response.data; 
                    const addressFromDB = application_addresss[0];

                 const resetFormData = {
                    // Permanent Address (fallback to formData if addressFromDB is not available)
                    per_complex_name: addressFromDB?.per_complex_name || formData.complex_name || '',
                    per_flat_no: addressFromDB?.per_flat_no || formData.flat_no || '',
                    per_area: addressFromDB?.per_area || formData.area || '',
                    per_landmark: addressFromDB?.per_landmark || formData.landmark || '',
                    per_country: addressFromDB?.per_country || formData.country || 'INDIA',
                    per_pincode: addressFromDB?.per_pincode || formData.pincode || '',
                    per_city: addressFromDB?.per_city || formData.city || '',
                    per_district: addressFromDB?.per_district || formData.district || '',
                    per_state: addressFromDB?.per_state || formData.state || '',

                    // Correspondence Address (only from DB if available, else empty)
                    cor_complex_name: addressFromDB?.cor_complex_name || '',
                    cor_flat_no: addressFromDB?.cor_flat_no || '',
                    cor_area: addressFromDB?.cor_area || '',
                    cor_landmark: addressFromDB?.cor_landmark || '',
                    cor_country: addressFromDB?.cor_country || '',
                    cor_pincode: addressFromDB?.cor_pincode || '',
                    cor_city: addressFromDB?.cor_city || '',
                    cor_district: addressFromDB?.cor_district || '',
                    cor_state: addressFromDB?.cor_state || '',

                    // Status
                    status: addressFromDB?.status || 'Pending'
                };


                    setLocalFormData(resetFormData);

                    const resetExtraInputData = {
                        per_resident: addressFromDB?.per_resident || '',
                        per_residence_status: addressFromDB?.per_residence_status || '',
                        resi_doc: addressFromDB?.resi_doc || ''
                    };

                    setExtraInputData(resetExtraInputData);
                }
            } catch (error) {
                console.log(error)
                // Swal.fire({
                //     icon: 'error',
                //     title: 'Error',
                //     text: error?.response?.data?.message
                // });
            }
        };
        fetchDetails();
    }, [applicationId]);

    // Function to fetch address details from PIN code API
    const fetchAddressByPinCode = async (pincode, prefix) => {
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            
            if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
                const postOffice = data[0].PostOffice[0];
                return {
                    [`${prefix}_state`]: postOffice.State,
                    [`${prefix}_district`]: postOffice.District,
                    [`${prefix}_city`]: postOffice.Name || postOffice.Block || postOffice.Division,
                    [`${prefix}_country`]: 'India'
                };
            }
            throw new Error('No address found for this PIN code');
        } catch (error) {
            console.error('Error fetching address by PIN code:', error);
            throw error;
        }
    };

    const handlePermanentChange = async (e) => {
        const { name, value } = e.target;
        
        setLocalFormData(prev => {
            const updated = {
                ...prev,
                [name]: value
            };

            if (sameAsAbove && name.startsWith('per_')) {
                const corName = name.replace('per_', 'cor_');
                updated[corName] = value;
            }

            // Clear error when field is filled
            if (errors[name]) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[name];
                    return newErrors;
                });
            }

            return updated;
        });

        // Auto-fill address when PIN code is entered (6 digits)
        if (name === 'per_pincode' && value.length === 6) {
            setLoadingPinCode(prev => ({ ...prev, per: true }));
            try {
                const addressData = await fetchAddressByPinCode(value, 'per');
                setLocalFormData(prev => ({
                    ...prev,
                    ...addressData,
                    ...(sameAsAbove ? Object.fromEntries(
                        Object.entries(addressData).map(([key, val]) => [
                            key.replace('per_', 'cor_'), 
                            val
                        ])
                    ) : {})
                }));
            } catch (error) {
                Swal.fire({
                    icon: 'warning',
                    title: 'PIN Code Not Found',
                    text: 'Could not find address details for this PIN code. Please enter manually.',
                });
            } finally {
                setLoadingPinCode(prev => ({ ...prev, per: false }));
            }
        }
    };

    const handleCorrespondenceChange = async (e) => {
        const { name, value } = e.target;
        
        setLocalFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when field is filled
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        // Auto-fill address when PIN code is entered (6 digits)
        if (name === 'cor_pincode' && value.length === 6 && !sameAsAbove) {
            setLoadingPinCode(prev => ({ ...prev, cor: true }));
            try {
                const addressData = await fetchAddressByPinCode(value, 'cor');
                setLocalFormData(prev => ({
                    ...prev,
                    ...addressData
                }));
            } catch (error) {
                Swal.fire({
                    icon: 'warning',
                    title: 'PIN Code Not Found',
                    text: 'Could not find address details for this PIN code. Please enter manually.',
                });
            } finally {
                setLoadingPinCode(prev => ({ ...prev, cor: false }));
            }
        }
    };

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = [
            'per_complex_name', 'per_flat_no', 'per_area', 'per_landmark',
            'per_country', 'per_pincode', 'per_city', 'per_district', 'per_state'
        ];

        requiredFields.forEach(field => {
            if (!localFormData[field]) {
                newErrors[field] = 'This field is required';
            }
        });

        if (!sameAsAbove) {
            const corRequiredFields = [
                'cor_complex_name', 'cor_flat_no', 'cor_area', 'cor_landmark',
                'cor_country', 'cor_pincode', 'cor_city', 'cor_district', 'cor_state'
            ];

            corRequiredFields.forEach(field => {
                if (!localFormData[field]) {
                    newErrors[field] = 'This field is required';
                }
            });
        }

        if (!extraInputData.per_resident) {
            newErrors.per_resident = 'This field is required';
        } else if (extraInputData.per_resident === 'YES' && !extraInputData.per_residence_status) {
            newErrors.per_residence_status = 'This field is required';
        } else if (extraInputData.per_residence_status === 'RESIDENT' && !extraInputData.resi_doc) {
            newErrors.resi_doc = 'This field is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitaddress = async () => {
        if (!validateForm()) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fill all required fields correctly',
            });
            return;
        }

        const payload = {
            application_id: formData.application_id,
            ...localFormData,
            ...extraInputData,
            status: formData.status,
        };

        try {
            const response = await createAccountService.addressDetails_s2b(payload);
            // console.log('ADDRESS CHECK :', payload);

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
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to save address details'
            });
        }
    }

    const handleSameAsAboveToggle = () => {
        const newValue = !sameAsAbove;
        setSameAsAbove(newValue);

        setLocalFormData(prev => {
            if (newValue) {
                return {
                    ...prev,
                    cor_complex_name: prev.per_complex_name,
                    cor_flat_no: prev.per_flat_no,
                    cor_area: prev.per_area,
                    cor_landmark: prev.per_landmark,
                    cor_country: prev.per_country,
                    cor_pincode: prev.per_pincode,
                    cor_city: prev.per_city,
                    cor_district: prev.per_district,
                    cor_state: prev.per_state
                };
            }
            return prev;
        });

        if (newValue) {
            setErrors(prev => {
                const newErrors = { ...prev };
                Object.keys(newErrors).forEach(key => {
                    if (key.startsWith('cor_')) {
                        delete newErrors[key];
                    }
                });
                return newErrors;
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

    const handleExtraInputChange = (e) => {
        const { name, value } = e.target;
        setExtraInputData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    return (
        <div className="address-form">
            <h2 className="text-xl font-bold mb-2">Permanent Address</h2>
            <AddressSection
                formData={localFormData}
                handleChange={handlePermanentChange}
                prefix="per"
                extraInputData={extraInputData}
                errors={errors}
                handleExtraInputChange={handleExtraInputChange}
                loading={loadingPinCode.per}
            />

            <div className='flex items-center mb-2'>
                <h2 className="text-xl font-bold m-2">Correspondence Address</h2>
                <div className="flex items-center m-2">
                    <input
                        type="checkbox"
                        checked={sameAsAbove}
                        onChange={handleSameAsAboveToggle}
                        className="mr-2"
                    />
                    <label className="font-light">Same As Above</label>
                </div>

                {!sameAsAbove && (
                    <CommonButton
                        onClick={handleClearCorrespondence}
                        className="ml-auto text-green-600 font-medium flex items-center"
                    >
                        <i className="bi bi-arrow-clockwise mr-1"></i> Clear
                    </CommonButton>
                )}
            </div>

            <AddressSection
                formData={localFormData}
                handleChange={handleCorrespondenceChange}
                prefix="cor"
                disabled={sameAsAbove}
                errors={errors}
                loading={loadingPinCode.cor}
            />

            <div className="next-back-btns z-10">
                <CommonButton
                    onClick={onBack}
                    variant="outlined"
                    className="btn-back"
                    disabled={isSubmitting}
                >
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton
                    onClick={submitaddress}
                    variant="contained"
                    className="btn-next"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className="animate-spin inline-block mr-2">↻</span>
                            Processing...
                        </>
                    ) : (
                        <>
                            Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                        </>
                    )}
                </CommonButton>
            </div>
        </div>
    );
}

function AddressSection({ formData, handleChange, prefix, extraInputData, errors, handleExtraInputChange, disabled = false, loading = false }) {
    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.complexname.label}
                name={`${prefix}_complex_name`}
                value={formData[`${prefix}_complex_name`] || ''}
                onChange={handleChange}
                required
                max={30}
                
                disabled={disabled}
                error={errors[`${prefix}_complex_name`]}
            />
            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.roomno.label}
                name={`${prefix}_flat_no`}
                value={formData[`${prefix}_flat_no`] || ''}
                onChange={handleChange}
                required
                max={5} 
                disabled={disabled}
                error={errors[`${prefix}_flat_no`]}
            />
            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.area.label}
                name={`${prefix}_area`}
                value={formData[`${prefix}_area`] || ''}
                onChange={handleChange}
                required
                max={30}
                disabled={disabled}
                error={errors[`${prefix}_area`]}
            />
            <CommanInput
                // validationType={'EVERYTHING'}
                label={labels.landmark.label}
                name={`${prefix}_landmark`}
                value={formData[`${prefix}_landmark`] || ''}
                onChange={handleChange}
                required
                max={30}
                validationType="EVERYTHING"
                disabled={disabled}
                error={errors[`${prefix}_landmark`]}
            />
            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.country.label}
                name={`${prefix}_country`}
                value={formData[`${prefix}_country`] || ''}
                onChange={handleChange}
                required
                max={30}
                disabled={disabled}
                error={errors[`${prefix}_country`]}
            />
            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.pincode.label}
                name={`${prefix}_pincode`}
                value={formData[`${prefix}_pincode`] || ''}
                onChange={handleChange}
                required
                max={6} 
                disabled={disabled}
                error={errors[`${prefix}_pincode`]}
                endAdornment={loading && (
                    <i className="bi bi-arrow-repeat animate-spin"></i>
                )}
            />
            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.city.label}
                name={`${prefix}_city`}
                value={formData[`${prefix}_city`] || ''}
                onChange={handleChange}
                required
                max={30}
                disabled={disabled}
                error={errors[`${prefix}_city`]}
            />
            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.district.label}
                name={`${prefix}_district`}
                value={formData[`${prefix}_district`] || ''}
                onChange={handleChange}
                required
                max={30}
                disabled={disabled}
                error={errors[`${prefix}_district`]}
            />
            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.state.label}
                name={`${prefix}_state`}
                value={formData[`${prefix}_state`] || ''}
                onChange={handleChange}
                required
                max={30}
                disabled={disabled}
                error={errors[`${prefix}_state`]}
            />
            {prefix === 'per' && (
                <ExtraInput
                    extraInputData={extraInputData}
                    errors={errors}
                    handleChange={handleExtraInputChange}
                    disabled={disabled}
                />
            )}
        </div>
    );
}

const ExtraInput = ({ extraInputData, errors, handleChange, disabled = false }) => {
    const isResidentYes = extraInputData.per_resident === 'YES';
    const isStatusResident = extraInputData.per_residence_status === 'Resident';

    return (
        <>
            <CommanSelect
                onChange={handleChange}
                label="Resident Y/N"
                value={extraInputData.per_resident || ''}
                name="per_resident"
                required
                disabled={disabled}
                options={YN}
                error={errors.per_resident}
            />

            {isResidentYes && (
                <CommanSelect
                    onChange={handleChange}
                    label="Residential Status"
                    value={extraInputData.per_residence_status || ''}
                    name="per_residence_status"
                    required
                    disabled={!isResidentYes || disabled}
                    options={RESIDENTIAL_STATUS}
                    error={errors.per_residence_status}
                />
            )}

            {isResidentYes && isStatusResident && (
                <CommanSelect
                    onChange={handleChange}
                    label="Residence Document"
                    value={extraInputData.resi_doc || ''}
                    name="resi_doc"
                    required
                    disabled={disabled}
                    options={RESIDENCE_DOCS}
                    error={errors.resi_doc}
                />
            )}
        </>
    );
};

export default AddressForm; 