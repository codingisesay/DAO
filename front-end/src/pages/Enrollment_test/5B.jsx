import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels'; // adjust the path if needed
import CommonButton from '../../components/CommonButton';

function PersonalOccupationForm() {
    const [nominees, setNominees] = useState([{
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
    }]);

    const handleChange = (id, section, e) => {
        const { name, value } = e.target;
        setNominees(nominees.map(nominee => {
            if (nominee.id === id) {
                return {
                    ...nominee,
                    [section]: {
                        ...nominee[section],
                        [name]: value
                    }
                };
            }
            return nominee;
        }));
    };

    const addNominee = () => {
        const newId = nominees.length > 0 ? Math.max(...nominees.map(n => n.id)) + 1 : 1;
        setNominees([
            ...nominees,
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
            setNominees(nominees.filter(nominee => nominee.id !== id));
        }
    };

    return (
        <div className=" max-w-screen-xl mx-auto">
            {nominees.map((nominee, index) => (
                <div key={nominee.id} className="mb-8 border-b pb-6">
                    <div className="flex justify-between items-center ">
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

                    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-5">
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
                    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-5">
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
        </div>
    );
}

export default PersonalOccupationForm;