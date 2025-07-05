 



import labels from '../../components/labels';
import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { pendingAccountData, pendingAccountStatusUpdate } from '../../services/apiServices';
import { YN, RESIDENCE_DOCS, RESIDENTIAL_STATUS } from '../../data/data';
import CommanSelect from '../../components/CommanSelect';

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
                options={YN}
                error={errors.per_resident}
                     disabled={true}              readOnly={true}
            />

       
                <CommanSelect
                    onChange={handleChange}
                    label="Residential Status"
                    value={formData.per_residence_status || ''}
                    name="per_residence_status" 
                    options={RESIDENTIAL_STATUS}
                    error={errors.per_residence_status}
                     disabled={true}              readOnly={true}
                />
     

     
                <CommanSelect
                    onChange={handleChange}
                    label="Residence Document"
                    value={formData.resi_doc || ''}
                    name="resi_doc" 
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
    const admin_id= localStorage.getItem('userCode');

    const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];

    const handleNextStepAdder = async () => {
        
    try {
        const payload = {
            application_id: Number(id),
            status: 'Approved',
            status_comment: '',
            admin_id: admin_id
        };
        await pendingAccountStatusUpdate.updateS2B(id, payload);
        applicationStatus.push('Approved');
        localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
        Swal.fire({
            icon: 'success',
            title: 'Address Details Approved Successfully',
            timer: 2000,
            showConfirmButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
        });
        onNext();
    }
    catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: error?.response?.data?.message,
        });
    }
}
const handleReviewClickadder = async (e) => { // Add 'e' (event object) as a parameter
    e.preventDefault(); // Prevent default form submission
 
    const result = await Swal.fire({
        title: 'Reason for Review',
        input: 'text',
        inputLabel: 'Please provide a reason',
        inputPlaceholder: 'Enter reason here...',
        showCancelButton: true,
        confirmButtonText: 'Submit',
        cancelButtonText: 'Cancel',
        className: 'btn-login',
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write a reason!';
            }
        },
    });

    if (result.isConfirmed && result.value) {
        try {
            const payload = {
                application_id: Number(id),
                status: 'Review',
                status_comment: result.value,
                admin_id: admin_id
            };
            await pendingAccountStatusUpdate.updateS2B(id, payload);
            applicationStatus.push('Review');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus)); 
            onNext();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.message || 'Failed to update status',
            });
        }
    } else if (result.isDismissed) {
        console.log('Review canceled');
    }
};

    const handleRejectClickAddr  = async()=>{

        const result = await Swal.fire({
            title: 'Reason for Rejection',
            input: 'text',
            inputLabel: 'Please provide a reason',
            inputPlaceholder: 'Enter reason here...',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            className: 'btn-login',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write a reason!';
                }
            },
        });

        if (result.isConfirmed && result.value) {
            const payload = {
                application_id: Number(id),
                status: 'Rejected',
                status_comment: result.value,
                admin_id: admin_id
            };
            await pendingAccountStatusUpdate.updateS2B(id, payload);
            applicationStatus.push('Reject');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            onNext();
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    }

    return (
        <div className="address-form mb-20">

            <AddressInputs />


            <div className="next-back-btns z-10">
                <CommonButton
                    className="text-red-500 border border-red-500 hover:bg-red-50 transition-colors my-auto px-4 rounded-md py-1 mx-2 z-10"
                    onClick={handleRejectClickAddr}
                >
                    Reject & Continue
                </CommonButton>

                <CommonButton
                    className="text-amber-500 border border-amber-500 hover:bg-amber-50 transition-colors my-auto px-4 rounded-md py-1 mx-2 z-10"
                    onClick={handleReviewClickadder}
                >
                    Review & Continue
                </CommonButton>

                <CommonButton
                    className="btn-next z-10"
                    onClick={handleNextStepAdder}
                >
                    Accept & Continue
                </CommonButton>
            </div>


 
        </div>
    );
}

export default AddressForm;

 