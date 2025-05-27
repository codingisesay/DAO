import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import CommonButton from '../../components/CommonButton';
import labels from '../../components/labels';
import { pre } from 'framer-motion/client';

const Step2PersonalDetails = ({ formData, handleChange, updateProgress, subProgress, nextStep, prevStep }) => {
    // Initialize state with formData or default values
    const [localFormData, setLocalFormData] = useState({
        // Aadhaar Extracted Details
        aadhaarSalutation: formData.aadhaarSalutation || 'Mrs',
        aadhaarMiddleName: formData.aadhaarMiddleName || 'Subhash',
        aadhaarDOB: formData.aadhaarDOB || '2080-05-27',
        aadhaarMobile: formData.aadhaarMobile || '8433843848',
        aadhaarFlatNo: formData.aadhaarFlatNo || 'Kalpgreen G4/106/01',
        aadhaarLandmark: formData.aadhaarLandmark || 'Katrap Pada, Kulgoan',
        aadhaarPincode: formData.aadhaarPincode || '421503',
        aadhaarDistrict: formData.aadhaarDistrict || 'Thane',
        aadhaarFirstName: formData.aadhaarFirstName || 'Pushbank',
        aadhaarLastName: formData.aadhaarLastName || 'Nikam',
        aadhaarGender: formData.aadhaarGender || 'Male',
        aadhaarComplexName: formData.aadhaarComplexName || 'Kalpcity Phase 2',
        aadhaarArea: formData.aadhaarArea || 'Near Old Petrol Pump',
        aadhaarCountry: formData.aadhaarCountry || 'India',
        aadhaarCity: formData.aadhaarCity || 'Badlapur',
        aadhaarState: formData.aadhaarState || 'Maharashtra',

        // CBS Details
        cbsSalutation: formData.cbsSalutation || 'Mrs',
        cbsMiddleName: formData.cbsMiddleName || 'Subhash',
        cbsDOB: formData.cbsDOB || '2080-05-27',
        cbsMobile: formData.cbsMobile || '784547854',
        cbsFlatNo: formData.cbsFlatNo || 'Harlorn G4/106/01',
        cbsLandmark: formData.cbsLandmark || 'Khadakpada, Kalyan',
        cbsPincode: formData.cbsPincode || '421503',
        cbsDistrict: formData.cbsDistrict || 'Thane',
        cbsFirstName: formData.cbsFirstName || 'Pushbank',
        cbsLastName: formData.cbsLastName || 'Nikam',
        cbsGender: formData.cbsGender || 'Male',
        cbsComplexName: formData.cbsComplexName || 'Kalpcity Phase 2',
        cbsArea: formData.cbsArea || 'Near Old HP Pump',
        cbsCountry: formData.cbsCountry || 'India',
        cbsCity: formData.cbsCity || 'Kalyan',
        cbsState: formData.cbsState || 'Maharashtra'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Update parent form data if needed
        handleChange({ [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Update progress and complete step
        updateProgress("2A", "completed");
        updateProgress("2B", "inprogress");
        // You can also update the parent formData here if needed
    };

    return (
        <div className=" mx-auto p-4 ">
            <h1 className="text-2xl font-bold mb-6">Customer Details</h1>

            <form onSubmit={handleSubmit} className="flex flex-evenly sm:flex-row gap-4">
                {/* Aadhaar Section */}
                <section className="bg-gray-50 p-3 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Aadhaar Extracted Details</h2>
                    <img src="" width={'100px'} height={'100px'} alt="Customer Photo" className="mb-4" />
                    <div className="grid sm:grid-cols-2 gap-5">
                        <CommanInput
                            label="Salutation"
                            name="aadhaarSalutation"
                            value={localFormData.aadhaarSalutation}
                            onChange={handleInputChange}
                            required
                            max={10}
                            validationType="TEXT_ONLY"
                        />

                        <CommanInput
                            label="Middle Name"
                            name="aadhaarMiddleName"
                            value={localFormData.aadhaarMiddleName}
                            onChange={handleInputChange}
                            max={50}
                            validationType="TEXT_ONLY"
                        />

                        <CommanInput
                            label="DOB"
                            name="aadhaarDOB"
                            type="date"
                            value={localFormData.aadhaarDOB}
                            onChange={handleInputChange}
                            required
                            validationType="DATE"
                        />

                        <CommanInput
                            label="Mobile No."
                            name="aadhaarMobile"
                            value={localFormData.aadhaarMobile}
                            onChange={handleInputChange}
                            required
                            max={10}
                            validationType="PHONE"
                        />

                        <CommanInput
                            label="Flat No./Bldg Name"
                            name="aadhaarFlatNo"
                            value={localFormData.aadhaarFlatNo}
                            onChange={handleInputChange}
                            required
                            max={50}
                            validationType="ALPHANUMERIC"
                        />

                        <CommanInput
                            label="Nearby Landmark"
                            name="aadhaarLandmark"
                            value={localFormData.aadhaarLandmark}
                            onChange={handleInputChange}
                            required
                            max={50}
                            validationType="EVERYTHING"
                        />

                        <CommanInput
                            label="Pin Code"
                            name="aadhaarPincode"
                            value={localFormData.aadhaarPincode}
                            onChange={handleInputChange}
                            required
                            max={6}
                            validationType="NUMBER_ONLY"
                        />

                        <CommanInput
                            label="District"
                            name="aadhaarDistrict"
                            value={localFormData.aadhaarDistrict}
                            onChange={handleInputChange}
                            required
                            max={30}
                            validationType="ALPHABETS_AND_SPACE"
                        />

                        <CommanInput
                            label="First Name"
                            name="aadhaarFirstName"
                            value={localFormData.aadhaarFirstName}
                            onChange={handleInputChange}
                            required
                            max={50}
                            validationType="TEXT_ONLY"
                        />

                        <CommanInput
                            label="Last Name"
                            name="aadhaarLastName"
                            value={localFormData.aadhaarLastName}
                            onChange={handleInputChange}
                            required
                            max={50}
                            validationType="TEXT_ONLY"
                        />

                        <CommanInput
                            label="Gender"
                            name="aadhaarGender"
                            value={localFormData.aadhaarGender}
                            onChange={handleInputChange}
                            required
                            max={10}
                            validationType="TEXT_ONLY"
                        />

                        <CommanInput
                            label="Complex Name"
                            name="aadhaarComplexName"
                            value={localFormData.aadhaarComplexName}
                            onChange={handleInputChange}
                            required
                            max={50}
                            validationType="ALPHABETS_AND_SPACE"
                        />

                        <CommanInput
                            label="Area"
                            name="aadhaarArea"
                            value={localFormData.aadhaarArea}
                            onChange={handleInputChange}
                            required
                            max={50}
                            validationType="ALPHABETS_AND_SPACE"
                        />

                        <CommanInput
                            label="Country"
                            name="aadhaarCountry"
                            value={localFormData.aadhaarCountry}
                            onChange={handleInputChange}
                            required
                            max={30}
                            validationType="ALPHABETS_AND_SPACE"
                        />

                        <CommanInput
                            label="City"
                            name="aadhaarCity"
                            value={localFormData.aadhaarCity}
                            onChange={handleInputChange}
                            required
                            max={30}
                            validationType="ALPHABETS_AND_SPACE"
                        />

                        <CommanInput
                            label="State"
                            name="aadhaarState"
                            value={localFormData.aadhaarState}
                            onChange={handleInputChange}
                            required
                            max={30}
                            validationType="ALPHABETS_AND_SPACE"
                        />
                    </div>
                </section>

                {/* CBS Section */}
                <section className="bg-gray-50 p-3 rounded-lg shadow-sm ">
                    <h2 className="text-xl font-semibold mb-4">CBS Details</h2>
                    <img src="" width={'100px'} height={'100px'} alt="Customer Photo" className="mb-4" />
                    <div className="grid sm:grid-cols-2 gap-5">
                        <CommanInput
                            label="Salutation"
                            name="cbsSalutation"
                            value={localFormData.cbsSalutation}
                            onChange={handleInputChange}
                            required
                            max={10}
                            validationType="TEXT_ONLY"
                        />

                        <CommanInput
                            label="Middle Name"
                            name="cbsMiddleName"
                            value={localFormData.cbsMiddleName}
                            onChange={handleInputChange}
                            max={50}
                            validationType="TEXT_ONLY"
                        />

                        <CommanInput
                            label="DOB"
                            name="cbsDOB"
                            type="date"
                            value={localFormData.cbsDOB}
                            onChange={handleInputChange}
                            required
                            validationType="DATE"
                        />

                        <CommanInput
                            label="Mobile No."
                            name="cbsMobile"
                            value={localFormData.cbsMobile}
                            onChange={handleInputChange}
                            required
                            max={10}
                            validationType="PHONE"
                        />

                        <CommanInput
                            label="Flat No./Bldg Name"
                            name="cbsFlatNo"
                            value={localFormData.cbsFlatNo}
                            onChange={handleInputChange}
                            required
                            max={50}
                            validationType="ALPHANUMERIC"
                        />

                        <CommanInput
                            label="Nearby Landmark"
                            name="cbsLandmark"
                            value={localFormData.cbsLandmark}
                            onChange={handleInputChange}
                            required
                            max={50}
                            validationType="EVERYTHING"
                        />

                        <CommanInput
                            label="Pin Code"
                            name="cbsPincode"
                            value={localFormData.cbsPincode}
                            onChange={handleInputChange}
                            required
                            max={6}
                            validationType="NUMBER_ONLY"
                        />

                        <CommanInput
                            label="District"
                            name="cbsDistrict"
                            value={localFormData.cbsDistrict}
                            onChange={handleInputChange}
                            required
                            max={30}
                            validationType="ALPHABETS_AND_SPACE"
                        />

                        <CommanInput
                            label="First Name"
                            name="cbsFirstName"
                            value={localFormData.cbsFirstName}
                            onChange={handleInputChange}
                            required
                            max={50}
                            validationType="TEXT_ONLY"
                        />

                        <CommanInput
                            label="Last Name"
                            name="cbsLastName"
                            value={localFormData.cbsLastName}
                            onChange={handleInputChange}
                            required
                            max={50}
                            validationType="TEXT_ONLY"
                        />

                        <CommanInput
                            label="Gender"
                            name="cbsGender"
                            value={localFormData.cbsGender}
                            onChange={handleInputChange}
                            required
                            max={10}
                            validationType="TEXT_ONLY"
                        />

                        <CommanInput
                            label="Complex Name"
                            name="cbsComplexName"
                            value={localFormData.cbsComplexName}
                            onChange={handleInputChange}
                            required
                            max={50}
                            validationType="ALPHABETS_AND_SPACE"
                        />

                        <CommanInput
                            label="Area"
                            name="cbsArea"
                            value={localFormData.cbsArea}
                            onChange={handleInputChange}
                            required
                            max={50}
                            validationType="ALPHABETS_AND_SPACE"
                        />

                        <CommanInput
                            label="Country"
                            name="cbsCountry"
                            value={localFormData.cbsCountry}
                            onChange={handleInputChange}
                            required
                            max={30}
                            validationType="ALPHABETS_AND_SPACE"
                        />

                        <CommanInput
                            label="City"
                            name="cbsCity"
                            value={localFormData.cbsCity}
                            onChange={handleInputChange}
                            required
                            max={30}
                            validationType="ALPHABETS_AND_SPACE"
                        />

                        <CommanInput
                            label="State"
                            name="cbsState"
                            value={localFormData.cbsState}
                            onChange={handleInputChange}
                            required
                            max={30}
                            validationType="ALPHABETS_AND_SPACE"
                        />
                    </div>
                </section>


                <div className="next-back-btns z-10">
                    <CommonButton className="btn-back border-0" onClick={prevStep}>
                        <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                    </CommonButton>
                    <CommonButton
                        className="btn-next border-0"
                        onClick={nextStep}
                    >
                        Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                    </CommonButton>
                </div>
            </form>
        </div>
    );
};

export default Step2PersonalDetails;