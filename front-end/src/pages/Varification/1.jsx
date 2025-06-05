
import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import CommanSelect from '../../components/CommanSelect';
import workingman from '../../assets/imgs/workingman1.png';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { salutation, } from '../../data/data';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { applicationDetailsService } from '../../services/apiServices'; // <-- Import your service


function P1({ onNext, onBack, updateFormData }) {
    const [localFormData, setLocalFormData] = useState();

    const { id } = useParams();

    useEffect(() => {
        const fetchAndStoreDetails = async () => {
            try {
                alert('called')
                if (id) {
                    const response = await applicationDetailsService.getFullDetails(id);
                    // localStorage.setItem('applicationDetails', JSON.stringify(response));
                    console.log('Application details saved to localStorage.');
                }
            } catch (error) {
                console.error('Failed to fetch application details:', error);
            }
        };

        fetchAndStoreDetails();
    }, [id]);









    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleRejectClick = async () => {
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
            onNext(); // Called when user confirms with valid input
        } else if (result.isDismissed) {
            // onReject?.(); // Called when user cancels or dismisses the alert
        }
    };

    const handleNextStep = () => { onNext(); };

    return (
        <> <h2 className="text-xl font-bold mb-2">Pending Application : {id}</h2>
            {/* <div className='form-container'>
                <h2 className="text-xl font-bold mb-2">Pending Application : {id}</h2>
                <div className="flex flex-wrap items-top">
                    <div className="lg:w-3/4 md:full sm:w-full"><br />
                        <p>Customer Application Form Details</p> <br />
                        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-3">
                            <CommanSelect
                                onChange={handleChange}
                                label={labels.salutation.label}
                                name="salutation"
                                value={localFormData.salutation}
                                options={salutation}
                                readOnly={true}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.firstname.label}
                                type="text"
                                name="firstname"
                                value={localFormData.firstname}
                                readOnly={true}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.middlename.label}
                                type="text"
                                name="middlename"
                                value={localFormData.middlename}
                                readOnly={true}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.lastname.label}
                                type="text"
                                name="lastname"
                                value={localFormData.lastname}
                                readOnly={true}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.dob.label}
                                type="date"
                                name="dob"
                                value={localFormData.dob}
                                readOnly={true}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.gender.label}
                                type="text"
                                name="gender"
                                value={localFormData.gender}
                                readOnly={true}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.mobile.label}
                                type="text"
                                name="mobile"
                                value={localFormData.mobile}
                                readOnly={true}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.complexname.label}
                                type="text"
                                name="complexname"
                                value={localFormData.complexname}
                                readOnly={true}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label='Flat no/Room no'
                                type="text"
                                name="flatnoroomno"
                                value={localFormData.flatnoroomno}
                                readOnly={true}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.area.label}
                                type="text"
                                name="area"
                                value={localFormData.area}
                                readOnly={true}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.landmark.label}
                                type="text"
                                name="landmark"
                                value={localFormData.landmark}
                                readOnly={true}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.country.label}
                                type="text"
                                name="country"
                                value={localFormData.country}
                                readOnly={true}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.pincode.label}
                                type="text"
                                name="pincode"
                                value={localFormData.pincode}
                                readOnly={true}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.city.label}
                                type="text"
                                name="city"
                                value={localFormData.city}
                                readOnly={true}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.district.label}
                                type="text"
                                name="district"
                                value={localFormData.district}
                                readOnly={true}
                            />
                            <CommanInput
                                onChange={handleChange}
                                label={labels.state.label}
                                type="text"
                                name="state"
                                value={localFormData.state}
                                readOnly={true}
                            />
                        </div>

                    </div>
                    <div className="lg:w-1/4 md:full sm:w-full text-center">
                        <img src='https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?semt=ais_items_boosted&w=740' width={'200px'} className='m-auto mt-20 border rounded-md' alt="client photo" />
                        <br />
                        <p>Customer Photo</p>
                    </div>
                    <div className="next-back-btns">
                        <CommonButton
                            className="text-red-500 border border-red-500 hover:bg-red-50 transition-colors my-auto px-4 rounded-md py-1"
                            onClick={handleRejectClick}
                        >
                            Reject & Continue
                        </CommonButton>


                        <CommonButton
                            className="btn-next "
                            onClick={handleNextStep}
                        >
                            Accept & Continue
                        </CommonButton>
                    </div>
                </div>
            </div> */}
        </>
    );
}

export default P1; 