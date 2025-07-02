

import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { agentService, applicationDetailsService, createAccountService } from '../../services/apiServices';
import CommanSelect from '../../components/CommanSelect';
import { YN, RESIDENCE_DOCS, RESIDENTIAL_STATUS } from '../../data/data';
import { useParams } from 'react-router-dom';

function AddressForm({ formData, updateFormData, onNext, onBack, isSubmitting }) {
    const applicationId = localStorage.getItem('application_id');    
    
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState(null); 
    const {id} = useParams();
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

    const [validationErrors, setValidationErrors] = useState({});
    const [touchedFields, setTouchedFields] = useState({});

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
                        per_complex_name: addressFromDB?.per_complex_name || formData.complex_name || '',
                        per_flat_no: addressFromDB?.per_flat_no || formData.flat_no || '',
                        per_area: addressFromDB?.per_area || formData.area || '',
                        per_landmark: addressFromDB?.per_landmark || formData.landmark || '',
                        per_country: addressFromDB?.per_country || formData.country || 'INDIA',
                        per_pincode: addressFromDB?.per_pincode || formData.pincode || '',
                        per_city: addressFromDB?.per_city || formData.city || '',
                        per_district: addressFromDB?.per_district || formData.district || '',
                        per_state: addressFromDB?.per_state || formData.state || '',
                        cor_complex_name: addressFromDB?.cor_complex_name || '',
                        cor_flat_no: addressFromDB?.cor_flat_no || '',
                        cor_area: addressFromDB?.cor_area || '',
                        cor_landmark: addressFromDB?.cor_landmark || '',
                        cor_country: addressFromDB?.cor_country || '',
                        cor_pincode: addressFromDB?.cor_pincode || '',
                        cor_city: addressFromDB?.cor_city || '',
                        cor_district: addressFromDB?.cor_district || '',
                        cor_state: addressFromDB?.cor_state || '',
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
            }
        };
        fetchDetails();
    }, [applicationId]);

    useEffect(()=>{
        const fetchReason = async (id) => {  
            if (!id) return;
            try {
            setLoading(true);
            const response = await agentService.refillApplication(id); 
            setReason(response.data[0]);
            } catch (error) {
            console.error("Failed to fetch review applications:", error);
            } finally {
            setLoading(false);
            }
        };
          const fetchDetails = async () => {
            try {
                const response = await applicationDetailsService.getFullDetails(id);
                if (response.data) {
                    const { application_addresss } = response.data; 
                    const addressFromDB = application_addresss[0];

                    const resetFormData = {
                        per_complex_name: addressFromDB?.per_complex_name || formData.complex_name || '',
                        per_flat_no: addressFromDB?.per_flat_no || formData.flat_no || '',
                        per_area: addressFromDB?.per_area || formData.area || '',
                        per_landmark: addressFromDB?.per_landmark || formData.landmark || '',
                        per_country: addressFromDB?.per_country || formData.country || 'INDIA',
                        per_pincode: addressFromDB?.per_pincode || formData.pincode || '',
                        per_city: addressFromDB?.per_city || formData.city || '',
                        per_district: addressFromDB?.per_district || formData.district || '',
                        per_state: addressFromDB?.per_state || formData.state || '',
                        cor_complex_name: addressFromDB?.cor_complex_name || '',
                        cor_flat_no: addressFromDB?.cor_flat_no || '',
                        cor_area: addressFromDB?.cor_area || '',
                        cor_landmark: addressFromDB?.cor_landmark || '',
                        cor_country: addressFromDB?.cor_country || '',
                        cor_pincode: addressFromDB?.cor_pincode || '',
                        cor_city: addressFromDB?.cor_city || '',
                        cor_district: addressFromDB?.cor_district || '',
                        cor_state: addressFromDB?.cor_state || '',
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
            }
        };
        fetchDetails();
    fetchReason(id);
 
    }, [id]);
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

            return updated;
        });

        // Mark field as touched
        setTouchedFields(prev => ({ ...prev, [name]: true }));

        // Clear error when field is filled
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

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

        // Mark field as touched
        setTouchedFields(prev => ({ ...prev, [name]: true }));

        // Clear error when field is filled
        if (validationErrors[name]) {
            setValidationErrors(prev => {
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

    const validateForm = () => {
        const errors = {};
        
        // Required fields validation for permanent address
        const permanentRequiredFields = [
            'per_complex_name', 'per_flat_no', 'per_area', 'per_landmark',
            'per_country', 'per_pincode', 'per_city', 'per_district', 'per_state'
        ];

        permanentRequiredFields.forEach(field => {
            if (!localFormData[field]) {
                errors[field] = `${labels[field.replace('per_', '')]?.label || field} is required`;
            }
        });

        // PIN code validation
        if (localFormData.per_pincode && localFormData.per_pincode.length !== 6) {
            errors.per_pincode = 'PIN code must be 6 digits';
        }

        // Correspondence address validation if not same as permanent
        if (!sameAsAbove) {
            const correspondenceRequiredFields = [
                'cor_complex_name', 'cor_flat_no', 'cor_area', 'cor_landmark',
                'cor_country', 'cor_pincode', 'cor_city', 'cor_district', 'cor_state'
            ];

            correspondenceRequiredFields.forEach(field => {
                if (!localFormData[field]) {
                    errors[field] = `${labels[field.replace('cor_', '')]?.label || field} is required`;
                }
            });

            if (localFormData.cor_pincode && localFormData.cor_pincode.length !== 6) {
                errors.cor_pincode = 'PIN code must be 6 digits';
            }
        }

        // Extra input validation
        if (!extraInputData.per_resident) {
            errors.per_resident = 'Resident field is required';
        } else if (extraInputData.per_resident === 'Yes') {
            if (!extraInputData.per_residence_status) {
                errors.per_residence_status = 'Residential status is required';
            } else if (extraInputData.per_residence_status === 'Resident' && !extraInputData.resi_doc) {
                errors.resi_doc = 'Residence document is required';
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouchedFields(prev => ({ ...prev, [name]: true }));
        validateForm();
    };

    const submitaddress = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        
        // Mark all fields as touched to show all errors
        const allFields = {
            ...Object.keys(localFormData).reduce((acc, field) => {
                acc[field] = true;
                return acc;
            }, {}),
            ...Object.keys(extraInputData).reduce((acc, field) => {
                acc[field] = true;
                return acc;
            }, {})
        };
        setTouchedFields(allFields);
        
        if (!validateForm()) { return; }

        const payload = {
            application_id: formData.application_id,
            ...localFormData,
            ...extraInputData,
            status: formData.status,
        };

        try {
            const response = await createAccountService.addressDetails_s2b(payload);

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
            setValidationErrors(prev => {
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

        // Mark field as touched
        setTouchedFields(prev => ({ ...prev, [name]: true }));

        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    return (
        <div className="address-form">
            <h2 className="text-xl font-bold mb-3">Permanent Address</h2>
            
          {reason &&  <p className="text-red-500 my-3" > Review For :  {reason.application_address_details_status_comment}</p> }
            <AddressSection
                formData={localFormData}
                handleChange={handlePermanentChange}
                handleBlur={handleBlur}
                prefix="per"
                extraInputData={extraInputData}
                setTouchedFields={setTouchedFields}
                validationErrors={validationErrors}
                touchedFields={touchedFields}
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
                handleBlur={handleBlur}
                prefix="cor"
                disabled={sameAsAbove}
                validationErrors={validationErrors}
                touchedFields={touchedFields}
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

function AddressSection({ formData, handleChange, handleBlur, prefix, extraInputData, validationErrors, touchedFields,setTouchedFields, handleExtraInputChange, disabled = false, loading = false }) {
    return (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
            <div>
            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.complexname.label}
                name={`${prefix}_complex_name`}
                value={formData[`${prefix}_complex_name`] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                max={30}
                disabled={disabled}
                className={validationErrors[`${prefix}_complex_name`] && touchedFields[`${prefix}_complex_name`] ? 'border-red-500' : ''}
            />
            {validationErrors[`${prefix}_complex_name`] && touchedFields[`${prefix}_complex_name`] && (
                <p className="text-red-500 text-xs col-span-full">{validationErrors[`${prefix}_complex_name`]}</p>
            )}
            </div>
            <div>
            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.roomno.label}
                name={`${prefix}_flat_no`}
                value={formData[`${prefix}_flat_no`] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                max={5}
                disabled={disabled}
                className={validationErrors[`${prefix}_flat_no`] && touchedFields[`${prefix}_flat_no`] ? 'border-red-500' : ''}
            />
            {validationErrors[`${prefix}_flat_no`] && touchedFields[`${prefix}_flat_no`] && (
                <p className="text-red-500 text-xs col-span-full">{validationErrors[`${prefix}_flat_no`]}</p>
            )}

            </div>
            <div>
            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.area.label}
                name={`${prefix}_area`}
                value={formData[`${prefix}_area`] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                max={30}
                disabled={disabled}
                className={validationErrors[`${prefix}_area`] && touchedFields[`${prefix}_area`] ? 'border-red-500' : ''}
            />
            {validationErrors[`${prefix}_area`] && touchedFields[`${prefix}_area`] && (
                <p className="text-red-500 text-xs col-span-full">{validationErrors[`${prefix}_area`]}</p>
            )}
            </div>
            <div>

            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.landmark.label}
                name={`${prefix}_landmark`}
                value={formData[`${prefix}_landmark`] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                max={30}
                disabled={disabled}
                className={validationErrors[`${prefix}_landmark`] && touchedFields[`${prefix}_landmark`] ? 'border-red-500' : ''}
            />
            {validationErrors[`${prefix}_landmark`] && touchedFields[`${prefix}_landmark`] && (
                <p className="text-red-500 text-xs col-span-full">{validationErrors[`${prefix}_landmark`]}</p>
            )}
            </div>
            <div>

            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.country.label}
                name={`${prefix}_country`}
                value={formData[`${prefix}_country`] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                max={30}
                disabled={disabled}
                className={validationErrors[`${prefix}_country`] && touchedFields[`${prefix}_country`] ? 'border-red-500' : ''}
            />
            {validationErrors[`${prefix}_country`] && touchedFields[`${prefix}_country`] && (
                <p className="text-red-500 text-xs col-span-full">{validationErrors[`${prefix}_country`]}</p>
            )}
            </div>
            <div>

            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.pincode.label}
                name={`${prefix}_pincode`}
                value={formData[`${prefix}_pincode`] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                max={6}
                disabled={disabled}
                className={validationErrors[`${prefix}_pincode`] && touchedFields[`${prefix}_pincode`] ? 'border-red-500' : ''}
                endAdornment={loading && (
                    <i className="bi bi-arrow-repeat animate-spin"></i>
                )}
            />
            {validationErrors[`${prefix}_pincode`] && touchedFields[`${prefix}_pincode`] && (
                <p className="text-red-500 text-xs col-span-full">{validationErrors[`${prefix}_pincode`]}</p>
            )}

            </div>
            <div>
            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.city.label}
                name={`${prefix}_city`}
                value={formData[`${prefix}_city`] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                max={30}
                disabled={disabled}
                className={validationErrors[`${prefix}_city`] && touchedFields[`${prefix}_city`] ? 'border-red-500' : ''}
            />
            {validationErrors[`${prefix}_city`] && touchedFields[`${prefix}_city`] && (
                <p className="text-red-500 text-xs col-span-full">{validationErrors[`${prefix}_city`]}</p>
            )}

            </div>
            <div>
            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.district.label}
                name={`${prefix}_district`}
                value={formData[`${prefix}_district`] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                max={30}
                disabled={disabled}
                className={validationErrors[`${prefix}_district`] && touchedFields[`${prefix}_district`] ? 'border-red-500' : ''}
            />
            {validationErrors[`${prefix}_district`] && touchedFields[`${prefix}_district`] && (
                <p className="text-red-500 text-xs col-span-full">{validationErrors[`${prefix}_district`]}</p>
            )}

            </div>
            <div>
            <CommanInput
                validationType={'EVERYTHING'}
                label={labels.state.label}
                name={`${prefix}_state`}
                value={formData[`${prefix}_state`] || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                max={30}
                disabled={disabled}
                className={validationErrors[`${prefix}_state`] && touchedFields[`${prefix}_state`] ? 'border-red-500' : ''}
            />
            {validationErrors[`${prefix}_state`] && touchedFields[`${prefix}_state`] && (
                <p className="text-red-500 text-xs col-span-full">{validationErrors[`${prefix}_state`]}</p>
            )}

            </div> 
            {prefix === 'per' && (
                <ExtraInput
                    extraInputData={extraInputData}
                    validationErrors={validationErrors}
                    touchedFields={touchedFields}
                    setTouchedFields={setTouchedFields}
                    handleChange={handleExtraInputChange}
                    disabled={disabled}
                />
            )}
        </div>
    );
}

const ExtraInput = ({ extraInputData, validationErrors, touchedFields,setTouchedFields, handleChange, disabled = false }) => {
    const isResidentYes = extraInputData.per_resident === 'Yes';
    const isStatusResident = extraInputData.per_residence_status === 'Resident';

    return (
        <>
            <div className="">
                <CommanSelect
                    onChange={handleChange}
                    onBlur={() => setTouchedFields(prev => ({ ...prev, per_resident: true }))}
                    label="Resident Y/N"
                    value={extraInputData.per_resident || ''}
                    name="per_resident"
                    required
                    disabled={disabled}
                    options={YN}
                    className={validationErrors.per_resident && touchedFields.per_resident ? 'border-red-500' : ''}
                />
                {validationErrors.per_resident && touchedFields.per_resident && (
                    <p className="text-red-500 text-xs">{validationErrors.per_resident}</p>
                )}
            </div>

            {isResidentYes && (
                <div className="">
                    <CommanSelect
                        onChange={handleChange}
                        onBlur={() => setTouchedFields(prev => ({ ...prev, per_residence_status: true }))}
                        label="Residential Status"
                        value={extraInputData.per_residence_status || ''}
                        name="per_residence_status"
                        required
                        disabled={!isResidentYes || disabled}
                        options={RESIDENTIAL_STATUS}
                        className={validationErrors.per_residence_status && touchedFields.per_residence_status ? 'border-red-500' : ''}
                    />
                    {validationErrors.per_residence_status && touchedFields.per_residence_status && (
                        <p className="text-red-500 text-xs">{validationErrors.per_residence_status}</p>
                    )}
                </div>
            )}

            {isResidentYes && isStatusResident && (
                <div className="">
                    <CommanSelect
                        onChange={handleChange}
                        onBlur={() => setTouchedFields(prev => ({ ...prev, resi_doc: true }))}
                        label="Residence Document"
                        value={extraInputData.resi_doc || ''}
                        name="resi_doc"
                        required
                        disabled={disabled}
                        options={RESIDENCE_DOCS}
                        className={validationErrors.resi_doc && touchedFields.resi_doc ? 'border-red-500' : ''}
                    />
                    {validationErrors.resi_doc && touchedFields.resi_doc && (
                        <p className="text-red-500 text-xs">{validationErrors.resi_doc}</p>
                    )}
                </div>
            )}
        </>
    );
};

export default AddressForm;









// import React, { useState, useEffect } from 'react';
// import CommanInput from '../../components/CommanInput';
// import labels from '../../components/labels';
// import CommonButton from '../../components/CommonButton';
// import Swal from 'sweetalert2';
// import { agentService, applicationDetailsService, createAccountService } from '../../services/apiServices';
// import CommanSelect from '../../components/CommanSelect';
// import { YN, RESIDENCE_DOCS, RESIDENTIAL_STATUS } from '../../data/data';
// import { useParams } from 'react-router-dom';

// function AddressForm({ formData, updateFormData, onNext, onBack, isSubmitting }) {

//     const [loading, setLoading] = useState(false);
//     const [reason, setReason] = useState(null); 
//     const {id} =useParams();
//     // const id = localStorage.getItem('application_id');    

//     const [localFormData, setLocalFormData] = useState({
//         per_complex_name: formData.complex_name || '',
//         per_flat_no: formData.flat_no || '',
//         per_area: formData.area || '',
//         per_landmark: formData.landmark || '',
//         per_country: formData.country || 'INDIA',
//         per_pincode: formData.pincode || '',
//         per_city: formData.city || '',
//         per_district: formData.district || '',
//         per_state: formData.state || '',
//         cor_complex_name: formData.cor_complex_name || (formData.correspondenceAddressSame ? formData.per_complex_name : ''),
//         cor_flat_no: formData.cor_flat_no || (formData.correspondenceAddressSame ? formData.per_flat_no : ''),
//         cor_area: formData.cor_area || '',
//         cor_landmark: formData.cor_landmark || '',
//         cor_country: formData.cor_country || 'INDIA',
//         cor_pincode: formData.cor_pincode || '',
//         cor_city: formData.cor_city || '',
//         cor_district: formData.cor_district || '',
//         cor_state: formData.cor_state || '',
//         status: 'Pending'
//     });

//     const [extraInputData, setExtraInputData] = useState({
//         per_resident: formData.per_resident || '',
//         per_residence_status: formData.per_residence_status || '',
//         resi_doc: formData.resi_doc || ''
//     });

//     const [sameAsAbove, setSameAsAbove] = useState(
//         formData.correspondenceAddressSame || false
//     );

//     const [loadingPinCode, setLoadingPinCode] = useState({
//         per: false,
//         cor: false
//     });

//     // Fetch address details when component mounts
//     useEffect(() => {
//         if (!id) return;
//         const fetchDetails = async () => {
//             try {
//                 const response = await applicationDetailsService.getFullDetails(id);
//                 if (response.data) {
//                     const { application_addresss } = response.data; 
//                     const addressFromDB = application_addresss[0];

//                  const resetFormData = {
//                     // Permanent Address (fallback to formData if addressFromDB is not available)
//                     per_complex_name: addressFromDB?.per_complex_name || formData.complex_name || '',
//                     per_flat_no: addressFromDB?.per_flat_no || formData.flat_no || '',
//                     per_area: addressFromDB?.per_area || formData.area || '',
//                     per_landmark: addressFromDB?.per_landmark || formData.landmark || '',
//                     per_country: addressFromDB?.per_country || formData.country || 'INDIA',
//                     per_pincode: addressFromDB?.per_pincode || formData.pincode || '',
//                     per_city: addressFromDB?.per_city || formData.city || '',
//                     per_district: addressFromDB?.per_district || formData.district || '',
//                     per_state: addressFromDB?.per_state || formData.state || '',

//                     // Correspondence Address (only from DB if available, else empty)
//                     cor_complex_name: addressFromDB?.cor_complex_name || '',
//                     cor_flat_no: addressFromDB?.cor_flat_no || '',
//                     cor_area: addressFromDB?.cor_area || '',
//                     cor_landmark: addressFromDB?.cor_landmark || '',
//                     cor_country: addressFromDB?.cor_country || '',
//                     cor_pincode: addressFromDB?.cor_pincode || '',
//                     cor_city: addressFromDB?.cor_city || '',
//                     cor_district: addressFromDB?.cor_district || '',
//                     cor_state: addressFromDB?.cor_state || '',

//                     // Status
//                     status: addressFromDB?.status || 'Pending'
//                 };


//                     setLocalFormData(resetFormData);

//                     const resetExtraInputData = {
//                         per_resident: addressFromDB?.per_resident || '',
//                         per_residence_status: addressFromDB?.per_residence_status || '',
//                         resi_doc: addressFromDB?.resi_doc || ''
//                     };

//                     setExtraInputData(resetExtraInputData);
//                 }
//             } catch (error) {
//                 console.log(error)
//                 // Swal.fire({
//                 //     icon: 'error',
//                 //     title: 'Error',
//                 //     text: error?.response?.data?.message
//                 // });
//             }
//         }; 
        
//           const fetchReason = async (id) => {  
//                     if (!id) return;
//                     try {
//                         setLoading(true);
//                         const response = await agentService.refillApplication(id); 
//                         setReason(response.data[0]);
//                     } catch (error) {
//                         console.error("Failed to fetch review applications:", error);
//                     } finally {
//                         setLoading(false);
//                     }
//                 };
         
//                 fetchReason(id);

//         fetchDetails();
//     }, [id]);

//     // Function to fetch address details from PIN code API
//     const fetchAddressByPinCode = async (pincode, prefix) => {
//         try {
//             const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//             const data = await response.json();
            
//             if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
//                 const postOffice = data[0].PostOffice[0];
//                 return {
//                     [`${prefix}_state`]: postOffice.State,
//                     [`${prefix}_district`]: postOffice.District,
//                     [`${prefix}_city`]: postOffice.Name || postOffice.Block || postOffice.Division,
//                     [`${prefix}_country`]: 'India'
//                 };
//             }
//             throw new Error('No address found for this PIN code');
//         } catch (error) {
//             console.error('Error fetching address by PIN code:', error);
//             throw error;
//         }
//     };

//     const handlePermanentChange = async (e) => {
//         const { name, value } = e.target;
        
//         setLocalFormData(prev => {
//             const updated = {
//                 ...prev,
//                 [name]: value
//             };

//             if (sameAsAbove && name.startsWith('per_')) {
//                 const corName = name.replace('per_', 'cor_');
//                 updated[corName] = value;
//             }

//             // Clear error when field is filled
//             if (errors[name]) {
//                 setErrors(prev => {
//                     const newErrors = { ...prev };
//                     delete newErrors[name];
//                     return newErrors;
//                 });
//             }

//             return updated;
//         });

//         // Auto-fill address when PIN code is entered (6 digits)
//         if (name === 'per_pincode' && value.length === 6) {
//             setLoadingPinCode(prev => ({ ...prev, per: true }));
//             try {
//                 const addressData = await fetchAddressByPinCode(value, 'per');
//                 setLocalFormData(prev => ({
//                     ...prev,
//                     ...addressData,
//                     ...(sameAsAbove ? Object.fromEntries(
//                         Object.entries(addressData).map(([key, val]) => [
//                             key.replace('per_', 'cor_'), 
//                             val
//                         ])
//                     ) : {})
//                 }));
//             } catch (error) {
//                 Swal.fire({
//                     icon: 'warning',
//                     title: 'PIN Code Not Found',
//                     text: 'Could not find address details for this PIN code. Please enter manually.',
//                 });
//             } finally {
//                 setLoadingPinCode(prev => ({ ...prev, per: false }));
//             }
//         }
//     };

//     const handleCorrespondenceChange = async (e) => {
//         const { name, value } = e.target;
        
//         setLocalFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));

//         // Clear error when field is filled
//         if (errors[name]) {
//             setErrors(prev => {
//                 const newErrors = { ...prev };
//                 delete newErrors[name];
//                 return newErrors;
//             });
//         }

//         // Auto-fill address when PIN code is entered (6 digits)
//         if (name === 'cor_pincode' && value.length === 6 && !sameAsAbove) {
//             setLoadingPinCode(prev => ({ ...prev, cor: true }));
//             try {
//                 const addressData = await fetchAddressByPinCode(value, 'cor');
//                 setLocalFormData(prev => ({
//                     ...prev,
//                     ...addressData
//                 }));
//             } catch (error) {
//                 Swal.fire({
//                     icon: 'warning',
//                     title: 'PIN Code Not Found',
//                     text: 'Could not find address details for this PIN code. Please enter manually.',
//                 });
//             } finally {
//                 setLoadingPinCode(prev => ({ ...prev, cor: false }));
//             }
//         }
//     };

//     const [errors, setErrors] = useState({});

//     const validateForm = () => {
//         const newErrors = {};
//         const requiredFields = [
//             'per_complex_name', 'per_flat_no', 'per_area', 'per_landmark',
//             'per_country', 'per_pincode', 'per_city', 'per_district', 'per_state'
//         ];

//         requiredFields.forEach(field => {
//             if (!localFormData[field]) {
//                 newErrors[field] = 'This field is required';
//             }
//         });

//         if (!sameAsAbove) {
//             const corRequiredFields = [
//                 'cor_complex_name', 'cor_flat_no', 'cor_area', 'cor_landmark',
//                 'cor_country', 'cor_pincode', 'cor_city', 'cor_district', 'cor_state'
//             ];

//             corRequiredFields.forEach(field => {
//                 if (!localFormData[field]) {
//                     newErrors[field] = 'This field is required';
//                 }
//             });
//         }

//         if (!extraInputData.per_resident) {
//             newErrors.per_resident = 'This field is required';
//         } else if (extraInputData.per_resident === 'YES' && !extraInputData.per_residence_status) {
//             newErrors.per_residence_status = 'This field is required';
//         } else if (extraInputData.per_residence_status === 'RESIDENT' && !extraInputData.resi_doc) {
//             newErrors.resi_doc = 'This field is required';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const submitaddress = async () => {
//         if (!validateForm()) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Validation Error',
//                 text: 'Please fill all required fields correctly',
//             });
//             return;
//         }

//         const payload = {
//             application_id: formData.application_id,
//             ...localFormData,
//             ...extraInputData,
//             status: formData.status,
//         };

//         try {
//             const response = await createAccountService.addressDetails_s2b(payload);
//             // console.log('ADDRESS CHECK :', payload);

//             updateFormData({
//                 ...localFormData,
//                 ...extraInputData,
//                 correspondenceAddressSame: sameAsAbove
//             });

//             Swal.fire({
//                 icon: 'success',
//                 title: response.data.message || 'Address details saved successfully.',
//                 showConfirmButton: false,
//                 timer: 1500
//             });
//             onNext();
//         } catch (error) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: error.message || 'Failed to save address details'
//             });
//         }
//     }

//     const handleSameAsAboveToggle = () => {
//         const newValue = !sameAsAbove;
//         setSameAsAbove(newValue);

//         setLocalFormData(prev => {
//             if (newValue) {
//                 return {
//                     ...prev,
//                     cor_complex_name: prev.per_complex_name,
//                     cor_flat_no: prev.per_flat_no,
//                     cor_area: prev.per_area,
//                     cor_landmark: prev.per_landmark,
//                     cor_country: prev.per_country,
//                     cor_pincode: prev.per_pincode,
//                     cor_city: prev.per_city,
//                     cor_district: prev.per_district,
//                     cor_state: prev.per_state
//                 };
//             }
//             return prev;
//         });

//         if (newValue) {
//             setErrors(prev => {
//                 const newErrors = { ...prev };
//                 Object.keys(newErrors).forEach(key => {
//                     if (key.startsWith('cor_')) {
//                         delete newErrors[key];
//                     }
//                 });
//                 return newErrors;
//             });
//         }
//     };

//     const handleClearCorrespondence = () => {
//         setLocalFormData(prev => ({
//             ...prev,
//             cor_complex_name: '',
//             cor_flat_no: '',
//             cor_area: '',
//             cor_landmark: '',
//             cor_country: '',
//             cor_pincode: '',
//             cor_city: '',
//             cor_district: '',
//             cor_state: '',
//         }));
//         setSameAsAbove(false);
//     };

//     const handleExtraInputChange = (e) => {
//         const { name, value } = e.target;
//         setExtraInputData(prev => ({
//             ...prev,
//             [name]: value
//         }));

//         if (errors[name]) {
//             setErrors(prev => {
//                 const newErrors = { ...prev };
//                 delete newErrors[name];
//                 return newErrors;
//             });
//         }
//     };

//     return (
//         <div className="address-form">
//             <h2 className="text-xl font-bold mb-2">Permanent Address</h2>
//             <p className="text-red-500" > Review For : {reason && reason.application_address_details_status_comment}</p> <br />
//             <AddressSection
//                 formData={localFormData}
//                 handleChange={handlePermanentChange}
//                 prefix="per"
//                 extraInputData={extraInputData}
//                 errors={errors}
//                 handleExtraInputChange={handleExtraInputChange}
//                 loading={loadingPinCode.per}
//             />

//             <div className='flex items-center mb-2'>
//                 <h2 className="text-xl font-bold m-2">Correspondence Address</h2>
//                 <div className="flex items-center m-2">
//                     <input
//                         type="checkbox"
//                         checked={sameAsAbove}
//                         onChange={handleSameAsAboveToggle}
//                         className="mr-2"
//                     />
//                     <label className="font-light">Same As Above</label>
//                 </div>

//                 {!sameAsAbove && (
//                     <CommonButton
//                         onClick={handleClearCorrespondence}
//                         className="ml-auto text-green-600 font-medium flex items-center"
//                     >
//                         <i className="bi bi-arrow-clockwise mr-1"></i> Clear
//                     </CommonButton>
//                 )}
//             </div>

//             <AddressSection
//                 formData={localFormData}
//                 handleChange={handleCorrespondenceChange}
//                 prefix="cor"
//                 disabled={sameAsAbove}
//                 errors={errors}
//                 loading={loadingPinCode.cor}
//             />

//             <div className="next-back-btns z-10">
//                 <CommonButton
//                     onClick={onBack}
//                     variant="outlined"
//                     className="btn-back"
//                     disabled={isSubmitting}
//                 >
//                     <i className="bi bi-chevron-double-left"></i>&nbsp;Back
//                 </CommonButton>
//                 <CommonButton
//                     onClick={submitaddress}
//                     variant="contained"
//                     className="btn-next"
//                     disabled={isSubmitting}
//                 >
//                     {isSubmitting ? (
//                         <>
//                             <span className="animate-spin inline-block mr-2">↻</span>
//                             Processing...
//                         </>
//                     ) : (
//                         <>
//                             Next&nbsp;<i className="bi bi-chevron-double-right"></i>
//                         </>
//                     )}
//                 </CommonButton>
//             </div>
//         </div>
//     );
// }

// function AddressSection({ formData, handleChange, prefix, extraInputData, errors, handleExtraInputChange, disabled = false, loading = false }) {
//     return (
//         <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
//             <CommanInput
//                 label={labels.complexname.label}
//                 name={`${prefix}_complex_name`}
//                 value={formData[`${prefix}_complex_name`] || ''}
//                 onChange={handleChange}
//                 required
//                 max={30}
                
//                 disabled={disabled}
//                 error={errors[`${prefix}_complex_name`]}
//             />
//             <CommanInput
//                 label={labels.roomno.label}
//                 name={`${prefix}_flat_no`}
//                 value={formData[`${prefix}_flat_no`] || ''}
//                 onChange={handleChange}
//                 required
//                 max={5}
//                 validationType={'ALPHANUMERIC'}
//                 disabled={disabled}
//                 error={errors[`${prefix}_flat_no`]}
//             />
//             <CommanInput
//                 label={labels.area.label}
//                 name={`${prefix}_area`}
//                 value={formData[`${prefix}_area`] || ''}
//                 onChange={handleChange}
//                 required
//                 max={30}
//                 validationType="ALPHABETS_AND_SPACE"
//                 disabled={disabled}
//                 error={errors[`${prefix}_area`]}
//             />
//             <CommanInput
//                 label={labels.landmark.label}
//                 name={`${prefix}_landmark`}
//                 value={formData[`${prefix}_landmark`] || ''}
//                 onChange={handleChange}
//                 required
//                 max={30}
//                 validationType="EVERYTHING"
//                 disabled={disabled}
//                 error={errors[`${prefix}_landmark`]}
//             />
//             <CommanInput
//                 label={labels.country.label}
//                 name={`${prefix}_country`}
//                 value={formData[`${prefix}_country`] || ''}
//                 onChange={handleChange}
//                 required
//                 max={30}
//                 validationType="ALPHABETS_AND_SPACE"
//                 disabled={disabled}
//                 error={errors[`${prefix}_country`]}
//             />
//             <CommanInput
//                 label={labels.pincode.label}
//                 name={`${prefix}_pincode`}
//                 value={formData[`${prefix}_pincode`] || ''}
//                 onChange={handleChange}
//                 required
//                 max={6}
//                 validationType="NUMBER_ONLY"
//                 disabled={disabled}
//                 error={errors[`${prefix}_pincode`]}
//                 endAdornment={loading && (
//                     <i className="bi bi-arrow-repeat animate-spin"></i>
//                 )}
//             />
//             <CommanInput
//                 label={labels.city.label}
//                 name={`${prefix}_city`}
//                 value={formData[`${prefix}_city`] || ''}
//                 onChange={handleChange}
//                 required
//                 max={30}
//                 validationType="ALPHABETS_AND_SPACE"
//                 disabled={disabled}
//                 error={errors[`${prefix}_city`]}
//             />
//             <CommanInput
//                 label={labels.district.label}
//                 name={`${prefix}_district`}
//                 value={formData[`${prefix}_district`] || ''}
//                 onChange={handleChange}
//                 required
//                 max={30}
//                 validationType="ALPHABETS_AND_SPACE"
//                 disabled={disabled}
//                 error={errors[`${prefix}_district`]}
//             />
//             <CommanInput
//                 label={labels.state.label}
//                 name={`${prefix}_state`}
//                 value={formData[`${prefix}_state`] || ''}
//                 onChange={handleChange}
//                 required
//                 max={30}
//                 validationType="ALPHABETS_AND_SPACE"
//                 disabled={disabled}
//                 error={errors[`${prefix}_state`]}
//             />
//             {prefix === 'per' && (
//                 <ExtraInput
//                     extraInputData={extraInputData}
//                     errors={errors}
//                     handleChange={handleExtraInputChange}
//                     disabled={disabled}
//                 />
//             )}
//         </div>
//     );
// }

// const ExtraInput = ({ extraInputData, errors, handleChange, disabled = false }) => {
//     const isResidentYes = extraInputData.per_resident === 'YES';
//     const isStatusResident = extraInputData.per_residence_status === 'Resident';

//     return (
//         <>
//             <CommanSelect
//                 onChange={handleChange}
//                 label="Resident Y/N"
//                 value={extraInputData.per_resident || ''}
//                 name="per_resident"
//                 required
//                 disabled={disabled}
//                 options={YN}
//                 error={errors.per_resident}
//             />

//             {isResidentYes && (
//                 <CommanSelect
//                     onChange={handleChange}
//                     label="Residential Status"
//                     value={extraInputData.per_residence_status || ''}
//                     name="per_residence_status"
//                     required
//                     disabled={!isResidentYes || disabled}
//                     options={RESIDENTIAL_STATUS}
//                     error={errors.per_residence_status}
//                 />
//             )}

//             {isResidentYes && isStatusResident && (
//                 <CommanSelect
//                     onChange={handleChange}
//                     label="Residence Document"
//                     value={extraInputData.resi_doc || ''}
//                     name="resi_doc"
//                     required
//                     disabled={disabled}
//                     options={RESIDENCE_DOCS}
//                     error={errors.resi_doc}
//                 />
//             )}
//         </>
//     );
// };

// export default AddressForm; 