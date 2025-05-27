import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { accountNomineeService } from '../../services/apiServices';
import Swal from 'sweetalert2';

function NominationForm({ formData, updateFormData, onBack, onNext }) {
    const [nominees, setNominees] = useState(
        formData.nominationDetails?.nominees || [{
            id: 1,
            details: {
                nomineeSalutation: '',
                nomineeFirstName: '',
                nomineeMiddleName: '',
                nomineeLastName: '',
                nomineeRelation: '',
                nomineePercentage: '',
                nomineeDOB: '',
                nomineeAge: ''
            },
            address: {
                nomineeComplexName: '',
                nomineeBuildingName: '',
                nomineeArea: '',
                nomineeLandmark: '',
                nomineeCountry: '',
                nomineePinCode: '',
                nomineeCity: '',
                nomineeDistrict: '',
                nomineeState: ''
            }
        }]
    );

    const handleChange = (id, section, e) => {
        const { name, value } = e.target;
        setNominees(prevNominees =>
            prevNominees.map(nominee =>
                nominee.id === id
                    ? {
                        ...nominee,
                        [section]: {
                            ...nominee[section],
                            [name]: value
                        }
                    }
                    : nominee
            )
        );
    };

    const addNominee = () => {
        const newId = nominees.length > 0 ? Math.max(...nominees.map(n => n.id)) + 1 : 1;
        setNominees(prevNominees => [
            ...prevNominees,
            {
                id: newId,
                details: {
                    nomineeSalutation: '',
                    nomineeFirstName: '',
                    nomineeMiddleName: '',
                    nomineeLastName: '',
                    nomineeRelation: '',
                    nomineePercentage: '',
                    nomineeDOB: '',
                    nomineeAge: ''
                },
                address: {
                    nomineeComplexName: '',
                    nomineeBuildingName: '',
                    nomineeArea: '',
                    nomineeLandmark: '',
                    nomineeCountry: '',
                    nomineePinCode: '',
                    nomineeCity: '',
                    nomineeDistrict: '',
                    nomineeState: ''
                }
            }
        ]);
    };

    const removeNominee = (id) => {
        if (nominees.length > 1) {
            setNominees(prevNominees => prevNominees.filter(nominee => nominee.id !== id));
        }
    };


    const submitnomini = async () => {
        try {
            // Loop through each nominee and send to API
            for (const nominee of nominees) {
                const payload = {
                    // If application_id is hardcoded in backend, you can omit it
                    salutation: nominee.details.nomineeSalutation,
                    first_name: nominee.details.nomineeFirstName,
                    middle_name: nominee.details.nomineeMiddleName,
                    last_name: nominee.details.nomineeLastName,
                    relationship: nominee.details.nomineeRelation,
                    percentage: nominee.details.nomineePercentage,
                    dob: nominee.details.nomineeDOB,
                    age: nominee.details.nomineeAge,
                    nom_complex_name: nominee.address.nomineeComplexName,
                    nom_flat_no: nominee.address.nomineeBuildingName,
                    nom_area: nominee.address.nomineeArea,
                    nom_landmark: nominee.address.nomineeLandmark,
                    nom_country: nominee.address.nomineeCountry,
                    nom_pincode: nominee.address.nomineePinCode,
                    nom_city: nominee.address.nomineeCity,
                    nom_district: nominee.address.nomineeDistrict,
                    nom_state: nominee.address.nomineeState,
                    status: "APPROVED"
                };

                await accountNomineeService.create(payload);
            }

            Swal.fire({
                icon: 'success',
                title: 'Nominee(s) saved successfully!',
                showConfirmButton: false,
                timer: 1500
            });

            if (onNext) onNext();

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.message || 'Failed to save nominee(s)'
            });
        }
    }
    // useEffect(() => {
    //     updateFormData({
    //         ...formData,
    //         nominationDetails: {
    //             nominees: nominees
    //         }
    //     });
    // }, [nominees]);

    return (
        <div className="max-w-screen-xl mx-auto">
            {nominees.map((nominee, index) => (
                <div key={nominee.id} className="mb-8 border-b pb-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Nominee {index + 1} Details</h2>
                        {nominees.length > 1 && (
                            <CommonButton
                                onClick={() => removeNominee(nominee.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                            >
                                Remove
                            </CommonButton>
                        )}
                    </div>

                    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
                        <CommanInput
                            label={labels.nomineeSalutation.label}
                            name="nomineeSalutation"
                            value={nominee.details.nomineeSalutation}
                            onChange={(e) => handleChange(nominee.id, 'details', e)}
                            required
                        />
                        <CommanInput
                            label={labels.nomineeFirstName.label}
                            name="nomineeFirstName"
                            value={nominee.details.nomineeFirstName}
                            onChange={(e) => handleChange(nominee.id, 'details', e)}
                            required
                        />
                        <CommanInput
                            label={labels.nomineeMiddleName.label}
                            name="nomineeMiddleName"
                            value={nominee.details.nomineeMiddleName}
                            onChange={(e) => handleChange(nominee.id, 'details', e)}
                            required
                        />
                        <CommanInput
                            label={labels.nomineeLastName.label}
                            name="nomineeLastName"
                            value={nominee.details.nomineeLastName}
                            onChange={(e) => handleChange(nominee.id, 'details', e)}
                            required
                        />
                        <CommanInput
                            label={labels.nomineeRelation.label}
                            name="nomineeRelation"
                            value={nominee.details.nomineeRelation}
                            onChange={(e) => handleChange(nominee.id, 'details', e)}
                            required
                        />
                        <CommanInput
                            label={labels.nomineePercentage.label}
                            name="nomineePercentage"
                            value={nominee.details.nomineePercentage}
                            onChange={(e) => handleChange(nominee.id, 'details', e)}
                            required
                        />
                        <CommanInput
                            label={labels.nomineeDOB.label}
                            name="nomineeDOB"
                            type="date"
                            value={nominee.details.nomineeDOB}
                            onChange={(e) => handleChange(nominee.id, 'details', e)}
                            required
                        />
                        <CommanInput
                            label={labels.nomineeAge.label}
                            name="nomineeAge"
                            value={nominee.details.nomineeAge}
                            onChange={(e) => handleChange(nominee.id, 'details', e)}
                            required
                        />
                    </div>

                    <h2 className="text-xl font-bold mt-8 mb-4">Nominee {index + 1} Address</h2>
                    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
                        <CommanInput
                            label={labels.nomineeComplexName.label}
                            name="nomineeComplexName"
                            value={nominee.address.nomineeComplexName}
                            onChange={(e) => handleChange(nominee.id, 'address', e)}
                            required
                        />
                        <CommanInput
                            label={labels.nomineeBuildingName.label}
                            name="nomineeBuildingName"
                            value={nominee.address.nomineeBuildingName}
                            onChange={(e) => handleChange(nominee.id, 'address', e)}
                            required
                        />
                        <CommanInput
                            label={labels.nomineeArea.label}
                            name="nomineeArea"
                            value={nominee.address.nomineeArea}
                            onChange={(e) => handleChange(nominee.id, 'address', e)}
                            required
                        />
                        <CommanInput
                            label={labels.nomineeLandmark.label}
                            name="nomineeLandmark"
                            value={nominee.address.nomineeLandmark}
                            onChange={(e) => handleChange(nominee.id, 'address', e)}
                            required
                        />
                        <CommanInput
                            label={labels.nomineeCountry.label}
                            name="nomineeCountry"
                            value={nominee.address.nomineeCountry}
                            onChange={(e) => handleChange(nominee.id, 'address', e)}
                            required
                        />
                        <CommanInput
                            label={labels.nomineePinCode.label}
                            name="nomineePinCode"
                            value={nominee.address.nomineePinCode}
                            onChange={(e) => handleChange(nominee.id, 'address', e)}
                            required
                        />
                        <CommanInput
                            label={labels.nomineeCity.label}
                            name="nomineeCity"
                            value={nominee.address.nomineeCity}
                            onChange={(e) => handleChange(nominee.id, 'address', e)}
                            required
                        />
                        <CommanInput
                            label={labels.nomineeDistrict.label}
                            name="nomineeDistrict"
                            value={nominee.address.nomineeDistrict}
                            onChange={(e) => handleChange(nominee.id, 'address', e)}
                            required
                        />
                        <CommanInput
                            label={labels.nomineeState.label}
                            name="nomineeState"
                            value={nominee.address.nomineeState}
                            onChange={(e) => handleChange(nominee.id, 'address', e)}
                            required
                        />
                    </div>
                </div>
            ))}

            <div className="flex justify-end mt-6">
                <CommonButton
                    onClick={addNominee}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Add Nominee
                </CommonButton>
            </div>

            <div className="flex justify-between mt-6 z-10" style={{ zIndex: '999' }}>
                <CommonButton onClick={onBack} variant="outlined">
                    Back
                </CommonButton>
                <CommonButton onClick={submitnomini} variant="contained">
                    Save & Continue
                </CommonButton>
            </div>
        </div>
    );
}

export default NominationForm;