import labels from '../../components/labels';
import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import CommanSelect from '../../components/CommanSelect';
import { pendingAccountData, pendingAccountStatusUpdate } from '../../services/apiServices';
import { YN, RESIDENCE_DOCS, RESIDENTIAL_STATUS } from '../../data/data';


const AddressInputs = () => {

    const [formData, setFormData] = useState({
        application_id: '',
        // Permanent Address
        per_complex_name: '',
        per_flat_no: '',
        per_area: '',
        per_landmark: '',
        per_country: '',
        per_pincode: '',
        per_city: '',
        per_district: '',
        per_state: '',
        // Correspondence Address
        cor_complex: '',
        cor_flat_no: '',
        cor_area: '',
        cor_landmark: '',
        cor_country: '',
        cor_pincode: '',
        cor_city: '',
        cor_district: '',
        cor_state: '', 
        per_resident: "",
        per_residence_status: "",
        resi_doc: "",
        status: 'APPROVED'
    });
    const { id } = useParams();

    useEffect(() => {
        const fetchAndStoreDetails = async () => {
            try {
                // alert('called')
                if (id) {
                    const response = await pendingAccountData.getDetailsS2B(id);
                    // localStorage.setItem('applicationDetails', JSON.stringify(response));
                    // console.log('got data addr:', response.data.details);
                    const application = response.details || {};
                    // const personal = response?.data?.personal_details || {};

                    setFormData({
                        application_id: application.application_id || '',
                        // Permanent Address
                        per_complex_name: application.per_complex_name || '',
                        per_flat_no: application.per_flat_no || '',
                        per_area: application.per_area || '',
                        per_landmark: application.per_landmark || '',
                        per_country: application.per_country || '',
                        per_pincode: application.per_pincode || '',
                        per_city: application.per_city || '',
                        per_district: application.per_district || '',
                        per_state: application.per_state || '',
                        per_resident: application.per_resident,
                        per_residence_status: application.per_residence_status,
                        resi_doc: application.resi_doc,
                        // Correspondence Address
                        cor_complex: application.cor_complex_name || '',
                        cor_flat_no: application.cor_flat_no || '',
                        cor_area: application.cor_area || '',
                        cor_landmark: application.cor_landmark || '',
                        cor_country: application.cor_country || '',
                        cor_pincode: application.cor_pincode || '',
                        cor_city: application.cor_city || '',
                        cor_district: application.cor_district || '',
                        cor_state: application.cor_state || '',
                        status: 'Pending'
                    });

                }
            } catch (error) {
                console.error('Failed to fetch application details:', error);
            }
        };

        fetchAndStoreDetails();
    }, [id]);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    return (
        <div className="max-w-screen-xl mx-auto ">

            <form  >
                {/* Permanent Address Section */}
                <div className=" pb-3">
                    <h2 className="text-xl font-bold mb-4">Permanent Address</h2>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
                        <CommanInput
                            label="Complex Name"
                            name="per_complex_name"
                            value={formData.per_complex_name}
                            onChange={handleChange}
                            max={191}
                            error={errors.per_complex_name}
                            readOnly={true} />
                        <CommanInput
                            label="Flat/Building No"
                            name="per_flat_no"
                            value={formData.per_flat_no}
                            onChange={handleChange}
                            max={191}
                            error={errors.per_flat_no}
                            readOnly={true} />
                        <CommanInput
                            label="Area"
                            name="per_area"
                            value={formData.per_area}
                            onChange={handleChange}
                            max={191}
                            error={errors.per_area}
                            readOnly={true} />
                        <CommanInput
                            label="Landmark"
                            name="per_landmark"
                            value={formData.per_landmark}
                            onChange={handleChange}
                            max={191}
                            error={errors.per_landmark}
                            readOnly={true} />
                        <CommanInput
                            label="Country"
                            name="per_country"
                            value={formData.per_country}
                            onChange={handleChange}
                            max={191}
                            error={errors.per_country}
                            readOnly={true} />
                        <CommanInput
                            label="Pincode"
                            name="per_pincode"
                            value={formData.per_pincode}
                            onChange={handleChange}
                            max={191}
                            validationType="NUMBER_ONLY"
                            error={errors.per_pincode}
                            readOnly={true} />
                        <CommanInput
                            label="City"
                            name="per_city"
                            value={formData.per_city}
                            onChange={handleChange}
                            max={191}
                            error={errors.per_city}
                            readOnly={true} />
                        <CommanInput
                            label="District"
                            name="per_district"
                            value={formData.per_district}
                            onChange={handleChange}
                            max={191}
                            error={errors.per_district}
                            readOnly={true} />
                        <CommanInput
                            label="State"
                            name="per_state"
                            value={formData.per_state}
                            onChange={handleChange}
                            max={191}
                            error={errors.per_state}
                            readOnly={true} />

 
            <CommanSelect
                label="Resident Y/N"
                value={formData.per_resident || ''}
                name="per_resident"
                required 
                options={YN}
                error={errors.per_resident}
                     disabled={true}              readOnly={true}
            />

       
                <CommanSelect
                    onChange={handleChange}
                    label="Residential Status"
                    value={formData.per_residence_status || ''}
                    name="per_residence_status"
                    required 
                    options={RESIDENTIAL_STATUS}
                    error={errors.per_residence_status}
                     disabled={true}              readOnly={true}
                />
     

     
                <CommanSelect
                    onChange={handleChange}
                    label="Residence Document"
                    value={formData.resi_doc || ''}
                    name="resi_doc"
                    required 
                    options={RESIDENCE_DOCS}
                    error={errors.resi_doc}
                    disabled={true}        readOnly={true}
                />
            

                    </div>
                </div>

                {/* Correspondence Address Section */}
                <div className="  pb-2">
                    <h2 className="text-xl font-bold mb-4">Correspondence Address</h2>
                    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
                        <CommanInput
                            label="Complex Name"
                            name="cor_complex"
                            value={formData.cor_complex}
                            onChange={handleChange}
                            max={191}
                            error={errors.cor_complex}
                            readOnly={true} />
                        <CommanInput
                            label="Flat/Building No"
                            name="cor_flat_no"
                            value={formData.cor_flat_no}
                            onChange={handleChange}
                            max={191}
                            error={errors.cor_flat_no}
                            readOnly={true} />
                        <CommanInput
                            label="Area"
                            name="cor_area"
                            value={formData.cor_area}
                            onChange={handleChange}
                            max={191}
                            error={errors.cor_area}
                            readOnly={true} />
                        <CommanInput
                            label="Landmark"
                            name="cor_landmark"
                            value={formData.cor_landmark}
                            onChange={handleChange}
                            max={191}
                            error={errors.cor_landmark}
                            readOnly={true} />
                        <CommanInput
                            label="Country"
                            name="cor_country"
                            value={formData.cor_country}
                            onChange={handleChange}
                            max={191}
                            error={errors.cor_country}
                            readOnly={true} />
                        <CommanInput
                            label="Pincode"
                            name="cor_pincode"
                            value={formData.cor_pincode}
                            onChange={handleChange}
                            max={191}
                            validationType="NUMBER_ONLY"
                            error={errors.cor_pincode}
                            readOnly={true} />
                        <CommanInput
                            label="City"
                            name="cor_city"
                            value={formData.cor_city}
                            onChange={handleChange}
                            max={191}
                            error={errors.cor_city}
                            readOnly={true} />
                        <CommanInput
                            label="District"
                            name="cor_district"
                            value={formData.cor_district}
                            onChange={handleChange}
                            max={191}
                            error={errors.cor_district}
                            readOnly={true} />
                        <CommanInput
                            label="State"
                            name="cor_state"
                            value={formData.cor_state}
                            onChange={handleChange}
                            max={191}
                            error={errors.cor_state}
                            readOnly={true} />
                    </div>
                </div>


            </form>
        </div>
    );
};



function AddressForm({ formData, updateFormData, onNext, onBack }) {

    const { id } = useParams();

    const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];
 

    return (
        <div className="address-form">

            <AddressInputs />

 
            <div className="next-back-btns z-10">
                <CommonButton
                    className="btn-back"
                    onClick={onBack}
                    iconLeft={<i className="bi bi-chevron-double-left"></i>} 
                >
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>

                <CommonButton
                    className="btn-next"
                    onClick={onNext }
                    iconRight={<i className="bi bi-chevron-double-right"></i>} 
                >
                    
                            Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                     
                </CommonButton>
            </div>
        </div>
    );
}

export default AddressForm; 