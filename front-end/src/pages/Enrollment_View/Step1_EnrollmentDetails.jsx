
import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import CommanSelect from '../../components/CommanSelect';
import workingman from '../../assets/imgs/workingman1.png';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { salutation, } from '../../data/data';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { pendingAccountData } from '../../services/apiServices'; // <-- Import your service
import { daodocbase } from '../../data/data';
import { pendingAccountStatusUpdate } from '../../services/apiServices';


function P1({ onNext, onBack, formData, updateFormData }) {
    const [localFormData, setLocalFormData] = useState({
        salutation: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        DOB: '',
        gender: '',
        mobile: '',
        complex_name: '',
        flat_no: '',
        area: '',
        landmark: '',
        country: '',
        pincode: '',
        city: '',
        district: '',
        state: '',

    });
    const { id } = useParams();

    useEffect(() => {
        localStorage.setItem('application_id', id);
        const fetchAndStoreDetails = async () => {
            try {
                // alert('called')
                if (id) {
                    const response = await pendingAccountData.getDetailsS1(id);
                    // localStorage.setItem('applicationDetails', JSON.stringify(response));
                    // console.log('got data :', response.data.details);
                    const application = response.details || {};
                    // const personal = response?.data?.personal_details || {};

                    setLocalFormData({
                        salutation: application.salutation || '',
                        first_name: application.first_name || '',
                        middle_name: application.middle_name || '',
                        last_name: application.last_name || '',
                        DOB: application.DOB || '',
                        gender: application.gender || '',
                        mobile: application.mobile || '',
                        complex_name: application.complex_name || '',
                        flat_no: application.flat_no || '',
                        area: application.area || '',
                        landmark: application.landmark || '',
                        country: application.country || '',
                        pincode: application.pincode || '',
                        city: application.city || '',
                        district: application.district || '',
                        state: application.state || '',
                        photo: daodocbase + application.live_photo_path || '',

                    });
                    // alert(localFormData.photo);
                }
            } catch (error) {
                console.error('Failed to fetch application details:', error);
            }
        };

        fetchAndStoreDetails();
    }, [id]);
    if (!localStorage.getItem("approveStatusArray")) {
        localStorage.setItem("approveStatusArray", JSON.stringify([]));


    }


    return (
        <>
            <>
                <div className='form-container'>
                    <h2 className="text-xl font-bold mb-2">Pending Application : {id}</h2>
                    <div className="flex flex-wrap items-top">
                        <div className="lg:w-3/4 md:full sm:w-full"><br />
                            <p>Customer Application Form Details</p> <br />
                            <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 gap-5">
                                {/* Salutation - Select field */}
                                <CommanSelect

                                    label={labels.salutation.label}
                                    name="salutation"
                                    value={localFormData.salutation}
                                    options={salutation}
                                    required
                                />

                                {/* First Name - Text only, 50 char limit */}
                                <CommanInput

                                    label={labels.firstname.label}
                                    name="first_name"
                                    value={localFormData.first_name}
                                    required
                                    max={30}
                                    validationType="TEXT_ONLY"
                                />

                                {/* Middle Name - Text only, 50 char limit */}
                                <CommanInput

                                    label={labels.middlename.label}
                                    name="middle_name"
                                    value={localFormData.middle_name}
                                    max={30}
                                    validationType="TEXT_ONLY"
                                />

                                {/* Last Name - Text only, 50 char limit */}
                                <CommanInput

                                    label={labels.lastname.label}
                                    name="last_name"
                                    value={localFormData.last_name}
                                    required
                                    max={30}
                                    validationType="TEXT_ONLY"
                                />

                                <CommanInput
                                    label={labels.dob.label}
                                    type="date"
                                    name="dob"
                                    value={localFormData.DOB}
                                    readOnly={true}
                                />
                                <CommanInput
                                    label={labels.gender.label}
                                    type="text"
                                    name="gender"
                                    value={localFormData.gender}
                                    readOnly={true}
                                />
                                <CommanInput

                                    label="First Name"
                                    name="first_name"
                                    value={localFormData.first_name}
                                    readOnly={true}
                                />
                                <CommanInput

                                    label="Middle Name"
                                    name="middle_name"
                                    value={localFormData.middle_name}
                                    readOnly={true}
                                />
                                <CommanInput

                                    label="Last Name"
                                    name="last_name"
                                    value={localFormData.last_name}
                                    readOnly={true}
                                />
                                <CommanInput

                                    label="Mobile No."
                                    name="mobile"
                                    value={localFormData.mobile}
                                    readOnly={true}
                                />
                                <CommanInput

                                    label="Area"
                                    name="area"
                                    value={localFormData.area}
                                    readOnly={true}
                                />
                                <CommanInput

                                    label="Complex Name"
                                    name="complex_name"
                                    value={localFormData.complex_name}
                                    readOnly={true}
                                />
                                <CommanInput

                                    label="Flat No./Bldg Name"
                                    name="flat_no"
                                    value={localFormData.flat_no}
                                    readOnly={true}
                                />
                                <CommanInput

                                    label="Nearby Landmark"
                                    name="landmark"
                                    value={localFormData.landmark}
                                    readOnly={true}
                                />
                                <CommanInput

                                    label="Country"
                                    name="country"
                                    value={localFormData.country}
                                    readOnly={true}
                                />
                                <CommanInput

                                    label="Pin Code"
                                    name="pincode"
                                    value={localFormData.pincode}
                                    readOnly={true}
                                />
                                <CommanInput

                                    label="City"
                                    name="city"
                                    value={localFormData.city}
                                    readOnly={true}
                                />
                                <CommanInput

                                    label="District"
                                    name="district"
                                    value={localFormData.district}
                                    readOnly={true}
                                />
                                <CommanInput

                                    label="State"
                                    name="state"
                                    value={localFormData.state}
                                    readOnly={true}
                                />

                            </div>

                        </div>
                        <div className="lg:w-1/4 md:full sm:w-full text-center">
                            <img src={localFormData.photo} width={'200px'} className='m-auto mt-20 border rounded-md' alt="client photo" />
                            {/* <img src='https://img.freepik.com/free-vector/user-blue-gradient_78370-4692.jpg?semt=ais_items_boosted&w=740' width={'200px'} className='m-auto mt-20 border rounded-md' alt="client photo" /> */}
                            <br />
                            <p>Customer Photo</p>
                        </div>

                    </div>
                </div>
            </>


            <div className="next-back-btns">
                <CommonButton className="btn-next" onClick={onNext}>
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>

                </CommonButton>
            </div>


        </>
    );
}

export default P1;

