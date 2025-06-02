import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { accountNomineeService } from '../../services/apiServices';
import Swal from 'sweetalert2';
import CommanSelect from '../../components/CommanSelect';
import { salutation, relation } from '../../data/data';

function NominationForm({ formData, updateFormData, onBack, onNext }) {
    const [nominees, setNominees] = useState(
        formData.nominationDetails?.nominees || []
    );

    const [currentNominee, setCurrentNominee] = useState({
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
    });

    const [errors, setErrors] = useState({});

    const calculateAge = (dob) => {
        if (!dob) return '';

        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age.toString();
    };

    const validateNominee = (nominee) => {
        const errors = {};

        // Details validation
        if (!nominee.details.nomineeSalutation) errors.nomineeSalutation = 'Required';
        if (!nominee.details.nomineeFirstName || nominee.details.nomineeFirstName.length > 50) errors.nomineeFirstName = 'Required, max 50 chars';
        if (!nominee.details.nomineeLastName || nominee.details.nomineeLastName.length > 50) errors.nomineeLastName = 'Required, max 50 chars';
        if (!nominee.details.nomineeRelation) errors.nomineeRelation = 'Required';
        if (!nominee.details.nomineePercentage || isNaN(nominee.details.nomineePercentage) || nominee.details.nomineePercentage < 0 || nominee.details.nomineePercentage > 100) errors.nomineePercentage = 'Required, 0-100';
        if (!nominee.details.nomineeDOB) errors.nomineeDOB = 'Required';
        if (!nominee.details.nomineeAge || isNaN(nominee.details.nomineeAge) || nominee.details.nomineeAge < 0 || nominee.details.nomineeAge > 120) errors.nomineeAge = 'Required, 0-120';

        // Address validation
        if (!nominee.address.nomineeComplexName || nominee.address.nomineeComplexName.length > 50) errors.nomineeComplexName = 'Required, max 50 chars';
        if (!nominee.address.nomineeBuildingName || nominee.address.nomineeBuildingName.length > 20) errors.nomineeBuildingName = 'Required, max 20 chars';
        if (!nominee.address.nomineeArea || nominee.address.nomineeArea.length > 50) errors.nomineeArea = 'Required, max 50 chars';
        if (!nominee.address.nomineeCountry || nominee.address.nomineeCountry.length > 30) errors.nomineeCountry = 'Required, max 30 chars';
        if (!nominee.address.nomineePinCode || !/^\d{6}$/.test(nominee.address.nomineePinCode)) errors.nomineePinCode = 'Required, 6 digits';

        return errors;
    };

    const handleChange = (section, e) => {
        const { name, value } = e.target;

        // If DOB is being changed, calculate age
        if (name === 'nomineeDOB') {
            const age = calculateAge(value);
            setCurrentNominee(prev => ({
                ...prev,
                details: {
                    ...prev.details,
                    [name]: value,
                    nomineeAge: age
                }
            }));
        } else {
            setCurrentNominee(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [name]: value
                }
            }));
        }
    };

    const addNominee = () => {
        const errors = validateNominee(currentNominee);
        setErrors(errors);

        if (Object.keys(errors).length > 0) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please fix the errors in the form before adding nominee.'
            });
            return;
        }

        const newNominee = {
            id: nominees.length > 0 ? Math.max(...nominees.map(n => n.id)) + 1 : 1,
            ...currentNominee
        };

        setNominees(prev => [...prev, newNominee]);
        resetForm();
    };

    const removeNominee = (id) => {
        setNominees(prev => prev.filter(nominee => nominee.id !== id));
    };

    const resetForm = () => {
        setCurrentNominee({
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
        });
        setErrors({});
    };

    const submitnomini = async () => {
        if (nominees.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please add at least one nominee'
            });
            return;
        }

        try {
            for (const nominee of nominees) {
                const payload = {
                    application_id: formData.application_id,
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
    };

    return (
        <div className="max-w-screen-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Add Nominee Details</h2>

            {/* Nominee Form */}
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3 mb-6">
                <CommanSelect
                    label={labels.nomineeSalutation.label}
                    name="nomineeSalutation"
                    value={currentNominee.details.nomineeSalutation}
                    onChange={(e) => handleChange('details', e)}
                    required
                    options={salutation}
                    error={errors.nomineeSalutation}
                />
                <CommanInput
                    label={labels.nomineeFirstName.label}
                    name="nomineeFirstName"
                    value={currentNominee.details.nomineeFirstName}
                    onChange={(e) => handleChange('details', e)}
                    required
                    max={50}
                    validationType="TEXT_ONLY"
                    error={errors.nomineeFirstName}
                />
                <CommanInput
                    label={labels.nomineeMiddleName.label}
                    name="nomineeMiddleName"
                    value={currentNominee.details.nomineeMiddleName}
                    onChange={(e) => handleChange('details', e)}
                    max={50}
                    validationType="TEXT_ONLY"
                    error={errors.nomineeMiddleName}
                />
                <CommanInput
                    label={labels.nomineeLastName.label}
                    name="nomineeLastName"
                    value={currentNominee.details.nomineeLastName}
                    onChange={(e) => handleChange('details', e)}
                    required
                    max={50}
                    validationType="TEXT_ONLY"
                    error={errors.nomineeLastName}
                />
                <CommanSelect
                    label={labels.nomineeRelation.label}
                    name="nomineeRelation"
                    value={currentNominee.details.nomineeRelation}
                    onChange={(e) => handleChange('details', e)}
                    required
                    options={relation}
                    error={errors.nomineeRelation}
                />
                <CommanInput
                    label={labels.nomineePercentage.label}
                    name="nomineePercentage"
                    value={currentNominee.details.nomineePercentage}
                    onChange={(e) => handleChange('details', e)}
                    required
                    max={3}
                    validationType="NUMBER_ONLY"
                    error={errors.nomineePercentage}
                />
                <CommanInput
                    label={labels.nomineeDOB.label}
                    name="nomineeDOB"
                    type="date"
                    value={currentNominee.details.nomineeDOB}
                    onChange={(e) => handleChange('details', e)}
                    required
                    validationType="DATE"
                    error={errors.nomineeDOB}
                />
                <CommanInput
                    label={labels.nomineeAge.label}
                    name="nomineeAge"
                    value={currentNominee.details.nomineeAge}
                    onChange={(e) => handleChange('details', e)}
                    required
                    max={3}
                    validationType="NUMBER_ONLY"
                    error={errors.nomineeAge}
                    disabled={true}  // Age field is now disabled
                />
            </div>

            <h2 className="text-xl font-bold mt-8 mb-4">Nominee Address</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3 mb-6">
                <CommanInput
                    label={labels.nomineeComplexName.label}
                    name="nomineeComplexName"
                    value={currentNominee.address.nomineeComplexName}
                    onChange={(e) => handleChange('address', e)}
                    required
                    max={50}
                    validationType="ALPHABETS_AND_SPACE"
                    error={errors.nomineeComplexName}
                />
                <CommanInput
                    label={labels.nomineeBuildingName.label}
                    name="nomineeBuildingName"
                    value={currentNominee.address.nomineeBuildingName}
                    onChange={(e) => handleChange('address', e)}
                    required
                    max={20}
                    validationType="ALPHANUMERIC"
                    error={errors.nomineeBuildingName}
                />
                <CommanInput
                    label={labels.nomineeArea.label}
                    name="nomineeArea"
                    value={currentNominee.address.nomineeArea}
                    onChange={(e) => handleChange('address', e)}
                    required
                    max={50}
                    validationType="ALPHABETS_AND_SPACE"
                    error={errors.nomineeArea}
                />
                <CommanInput
                    label={labels.nomineeLandmark.label}
                    name="nomineeLandmark"
                    value={currentNominee.address.nomineeLandmark}
                    onChange={(e) => handleChange('address', e)}
                    max={50}
                    validationType="EVERYTHING"
                    error={errors.nomineeLandmark}
                />
                <CommanInput
                    label={labels.nomineeCountry.label}
                    name="nomineeCountry"
                    value={currentNominee.address.nomineeCountry}
                    onChange={(e) => handleChange('address', e)}
                    required
                    max={30}
                    validationType="ALPHABETS_AND_SPACE"
                    error={errors.nomineeCountry}
                />
                <CommanInput
                    label={labels.nomineePinCode.label}
                    name="nomineePinCode"
                    value={currentNominee.address.nomineePinCode}
                    onChange={(e) => handleChange('address', e)}
                    required
                    max={6}
                    validationType="NUMBER_ONLY"
                    error={errors.nomineePinCode}
                />
            </div>

            <div className="flex justify-end mb-6">
                <CommonButton
                    onClick={addNominee}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Add to Table
                </CommonButton>
            </div>

            {/* Nominees Table */}
            {nominees.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Nominees List</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b">Name of the Nominee</th>
                                    <th className="py-2 px-4 border-b">Address</th>
                                    <th className="py-2 px-4 border-b">Relationship</th>
                                    <th className="py-2 px-4 border-b">Date of Birth</th>
                                    <th className="py-2 px-4 border-b">Age</th>
                                    <th className="py-2 px-4 border-b">Percentage</th>
                                    <th className="py-2 px-4 border-b">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nominees.map((nominee) => (
                                    <tr key={nominee.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b">
                                            {nominee.details.nomineeSalutation} {nominee.details.nomineeFirstName} {nominee.details.nomineeLastName}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {nominee.address.nomineeComplexName}, {nominee.address.nomineeBuildingName}, {nominee.address.nomineeArea}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {nominee.details.nomineeRelation}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {nominee.details.nomineeDOB}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {nominee.details.nomineeAge}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {nominee.details.nomineePercentage}%
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => removeNominee(nominee.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

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


// import React, { useState } from 'react';
// import CommanInput from '../../components/CommanInput';
// import labels from '../../components/labels';
// import CommonButton from '../../components/CommonButton';
// import { accountNomineeService } from '../../services/apiServices';
// import Swal from 'sweetalert2';
// import CommanSelect from '../../components/CommanSelect';
// import { salutation, relation } from '../../data/data';

// function NominationForm({ formData, updateFormData, onBack, onNext }) {
//     const [nominees, setNominees] = useState(
//         formData.nominationDetails?.nominees || []
//     );

//     const [currentNominee, setCurrentNominee] = useState({
//         details: {
//             nomineeSalutation: '',
//             nomineeFirstName: '',
//             nomineeMiddleName: '',
//             nomineeLastName: '',
//             nomineeRelation: '',
//             nomineePercentage: '',
//             nomineeDOB: '',
//             nomineeAge: ''
//         },
//         address: {
//             nomineeComplexName: '',
//             nomineeBuildingName: '',
//             nomineeArea: '',
//             nomineeLandmark: '',
//             nomineeCountry: '',
//             nomineePinCode: '',
//             nomineeCity: '',
//             nomineeDistrict: '',
//             nomineeState: ''
//         }
//     });

//     const [errors, setErrors] = useState({});

//     const validateNominee = (nominee) => {
//         const errors = {};

//         // Details validation
//         if (!nominee.details.nomineeSalutation) errors.nomineeSalutation = 'Required';
//         if (!nominee.details.nomineeFirstName || nominee.details.nomineeFirstName.length > 50) errors.nomineeFirstName = 'Required, max 50 chars';
//         if (!nominee.details.nomineeLastName || nominee.details.nomineeLastName.length > 50) errors.nomineeLastName = 'Required, max 50 chars';
//         if (!nominee.details.nomineeRelation) errors.nomineeRelation = 'Required';
//         if (!nominee.details.nomineePercentage || isNaN(nominee.details.nomineePercentage) || nominee.details.nomineePercentage < 0 || nominee.details.nomineePercentage > 100) errors.nomineePercentage = 'Required, 0-100';
//         if (!nominee.details.nomineeDOB) errors.nomineeDOB = 'Required';
//         if (!nominee.details.nomineeAge || isNaN(nominee.details.nomineeAge) || nominee.details.nomineeAge < 0 || nominee.details.nomineeAge > 120) errors.nomineeAge = 'Required, 0-120';

//         // Address validation
//         if (!nominee.address.nomineeComplexName || nominee.address.nomineeComplexName.length > 50) errors.nomineeComplexName = 'Required, max 50 chars';
//         if (!nominee.address.nomineeBuildingName || nominee.address.nomineeBuildingName.length > 20) errors.nomineeBuildingName = 'Required, max 20 chars';
//         if (!nominee.address.nomineeArea || nominee.address.nomineeArea.length > 50) errors.nomineeArea = 'Required, max 50 chars';
//         if (!nominee.address.nomineeCountry || nominee.address.nomineeCountry.length > 30) errors.nomineeCountry = 'Required, max 30 chars';
//         if (!nominee.address.nomineePinCode || !/^\d{6}$/.test(nominee.address.nomineePinCode)) errors.nomineePinCode = 'Required, 6 digits';

//         return errors;
//     };

//     const handleChange = (section, e) => {
//         const { name, value } = e.target;
//         setCurrentNominee(prev => ({
//             ...prev,
//             [section]: {
//                 ...prev[section],
//                 [name]: value
//             }
//         }));
//     };

//     const addNominee = () => {
//         const errors = validateNominee(currentNominee);
//         setErrors(errors);

//         if (Object.keys(errors).length > 0) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Validation Error',
//                 text: 'Please fix the errors in the form before adding nominee.'
//             });
//             return;
//         }

//         const newNominee = {
//             id: nominees.length > 0 ? Math.max(...nominees.map(n => n.id)) + 1 : 1,
//             ...currentNominee
//         };

//         setNominees(prev => [...prev, newNominee]);
//         resetForm();
//     };

//     const removeNominee = (id) => {
//         setNominees(prev => prev.filter(nominee => nominee.id !== id));
//     };

//     const resetForm = () => {
//         setCurrentNominee({
//             details: {
//                 nomineeSalutation: '',
//                 nomineeFirstName: '',
//                 nomineeMiddleName: '',
//                 nomineeLastName: '',
//                 nomineeRelation: '',
//                 nomineePercentage: '',
//                 nomineeDOB: '',
//                 nomineeAge: ''
//             },
//             address: {
//                 nomineeComplexName: '',
//                 nomineeBuildingName: '',
//                 nomineeArea: '',
//                 nomineeLandmark: '',
//                 nomineeCountry: '',
//                 nomineePinCode: '',
//                 nomineeCity: '',
//                 nomineeDistrict: '',
//                 nomineeState: ''
//             }
//         });
//         setErrors({});
//     };

//     const submitnomini = async () => {
//         if (nominees.length === 0) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: 'Please add at least one nominee'
//             });
//             return;
//         }

//         try {
//             for (const nominee of nominees) {
//                 const payload = {
//                     application_id: formData.application_id,
//                     salutation: nominee.details.nomineeSalutation,
//                     first_name: nominee.details.nomineeFirstName,
//                     middle_name: nominee.details.nomineeMiddleName,
//                     last_name: nominee.details.nomineeLastName,
//                     relationship: nominee.details.nomineeRelation,
//                     percentage: nominee.details.nomineePercentage,
//                     dob: nominee.details.nomineeDOB,
//                     age: nominee.details.nomineeAge,
//                     nom_complex_name: nominee.address.nomineeComplexName,
//                     nom_flat_no: nominee.address.nomineeBuildingName,
//                     nom_area: nominee.address.nomineeArea,
//                     nom_landmark: nominee.address.nomineeLandmark,
//                     nom_country: nominee.address.nomineeCountry,
//                     nom_pincode: nominee.address.nomineePinCode,
//                     nom_city: nominee.address.nomineeCity,
//                     nom_district: nominee.address.nomineeDistrict,
//                     nom_state: nominee.address.nomineeState,
//                     status: "APPROVED"
//                 };

//                 await accountNomineeService.create(payload);
//             }

//             Swal.fire({
//                 icon: 'success',
//                 title: 'Nominee(s) saved successfully!',
//                 showConfirmButton: false,
//                 timer: 1500
//             });

//             if (onNext) onNext();

//         } catch (error) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: error?.response?.data?.message || 'Failed to save nominee(s)'
//             });
//         }
//     };

//     return (
//         <div className="max-w-screen-xl mx-auto">
//             <h2 className="text-2xl font-bold mb-4">Add Nominee Details</h2>

//             {/* Nominee Form */}
//             <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3 mb-6">
//                 <CommanSelect
//                     label={labels.nomineeSalutation.label}
//                     name="nomineeSalutation"
//                     value={currentNominee.details.nomineeSalutation}
//                     onChange={(e) => handleChange('details', e)}
//                     required
//                     options={salutation}
//                     error={errors.nomineeSalutation}
//                 />
//                 <CommanInput
//                     label={labels.nomineeFirstName.label}
//                     name="nomineeFirstName"
//                     value={currentNominee.details.nomineeFirstName}
//                     onChange={(e) => handleChange('details', e)}
//                     required
//                     max={50}
//                     validationType="TEXT_ONLY"
//                     error={errors.nomineeFirstName}
//                 />
//                 <CommanInput
//                     label={labels.nomineeMiddleName.label}
//                     name="nomineeMiddleName"
//                     value={currentNominee.details.nomineeMiddleName}
//                     onChange={(e) => handleChange('details', e)}
//                     max={50}
//                     validationType="TEXT_ONLY"
//                     error={errors.nomineeMiddleName}
//                 />
//                 <CommanInput
//                     label={labels.nomineeLastName.label}
//                     name="nomineeLastName"
//                     value={currentNominee.details.nomineeLastName}
//                     onChange={(e) => handleChange('details', e)}
//                     required
//                     max={50}
//                     validationType="TEXT_ONLY"
//                     error={errors.nomineeLastName}
//                 />
//                 <CommanSelect
//                     label={labels.nomineeRelation.label}
//                     name="nomineeRelation"
//                     value={currentNominee.details.nomineeRelation}
//                     onChange={(e) => handleChange('details', e)}
//                     required
//                     options={relation}
//                     error={errors.nomineeRelation}
//                 />
//                 <CommanInput
//                     label={labels.nomineePercentage.label}
//                     name="nomineePercentage"
//                     value={currentNominee.details.nomineePercentage}
//                     onChange={(e) => handleChange('details', e)}
//                     required
//                     max={3}
//                     validationType="NUMBER_ONLY"
//                     error={errors.nomineePercentage}
//                 />
//                 <CommanInput
//                     label={labels.nomineeDOB.label}
//                     name="nomineeDOB"
//                     type="date"
//                     value={currentNominee.details.nomineeDOB}
//                     onChange={(e) => handleChange('details', e)}
//                     required
//                     validationType="DATE"
//                     error={errors.nomineeDOB}
//                 />
//                 <CommanInput
//                     label={labels.nomineeAge.label}
//                     name="nomineeAge"
//                     value={currentNominee.details.nomineeAge}
//                     onChange={(e) => handleChange('details', e)}
//                     required
//                     max={3}
//                     validationType="NUMBER_ONLY"
//                     error={errors.nomineeAge}
//                 />
//             </div>

//             <h2 className="text-xl font-bold mt-8 mb-4">Nominee Address</h2>
//             <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-3 mb-6">
//                 <CommanInput
//                     label={labels.nomineeComplexName.label}
//                     name="nomineeComplexName"
//                     value={currentNominee.address.nomineeComplexName}
//                     onChange={(e) => handleChange('address', e)}
//                     required
//                     max={50}
//                     validationType="ALPHABETS_AND_SPACE"
//                     error={errors.nomineeComplexName}
//                 />
//                 <CommanInput
//                     label={labels.nomineeBuildingName.label}
//                     name="nomineeBuildingName"
//                     value={currentNominee.address.nomineeBuildingName}
//                     onChange={(e) => handleChange('address', e)}
//                     required
//                     max={20}
//                     validationType="ALPHANUMERIC"
//                     error={errors.nomineeBuildingName}
//                 />
//                 <CommanInput
//                     label={labels.nomineeArea.label}
//                     name="nomineeArea"
//                     value={currentNominee.address.nomineeArea}
//                     onChange={(e) => handleChange('address', e)}
//                     required
//                     max={50}
//                     validationType="ALPHABETS_AND_SPACE"
//                     error={errors.nomineeArea}
//                 />
//                 <CommanInput
//                     label={labels.nomineeLandmark.label}
//                     name="nomineeLandmark"
//                     value={currentNominee.address.nomineeLandmark}
//                     onChange={(e) => handleChange('address', e)}
//                     max={50}
//                     validationType="EVERYTHING"
//                     error={errors.nomineeLandmark}
//                 />
//                 <CommanInput
//                     label={labels.nomineeCountry.label}
//                     name="nomineeCountry"
//                     value={currentNominee.address.nomineeCountry}
//                     onChange={(e) => handleChange('address', e)}
//                     required
//                     max={30}
//                     validationType="ALPHABETS_AND_SPACE"
//                     error={errors.nomineeCountry}
//                 />
//                 <CommanInput
//                     label={labels.nomineePinCode.label}
//                     name="nomineePinCode"
//                     value={currentNominee.address.nomineePinCode}
//                     onChange={(e) => handleChange('address', e)}
//                     required
//                     max={6}
//                     validationType="NUMBER_ONLY"
//                     error={errors.nomineePinCode}
//                 />
//             </div>

//             <div className="flex justify-end mb-6">
//                 <CommonButton
//                     onClick={addNominee}
//                     className="px-4 py-2 bg-blue-500 text-white rounded"
//                 >
//                     Add to Table
//                 </CommonButton>
//             </div>

//             {/* Nominees Table */}
//             {nominees.length > 0 && (
//                 <div className="mb-8">
//                     <h2 className="text-2xl font-bold mb-4">Nominees List</h2>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full bg-white border border-gray-200">
//                             <thead className="bg-gray-100">
//                                 <tr>
//                                     <th className="py-2 px-4 border-b">Name of the Nominee</th>
//                                     <th className="py-2 px-4 border-b">Address</th>
//                                     <th className="py-2 px-4 border-b">Relationship</th>
//                                     <th className="py-2 px-4 border-b">Date of Birth</th>
//                                     <th className="py-2 px-4 border-b">Age</th>
//                                     <th className="py-2 px-4 border-b">Percentage</th>
//                                     <th className="py-2 px-4 border-b">Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {nominees.map((nominee) => (
//                                     <tr key={nominee.id} className="hover:bg-gray-50">
//                                         <td className="py-2 px-4 border-b">
//                                             {nominee.details.nomineeSalutation} {nominee.details.nomineeFirstName} {nominee.details.nomineeLastName}
//                                         </td>
//                                         <td className="py-2 px-4 border-b">
//                                             {nominee.address.nomineeComplexName}, {nominee.address.nomineeBuildingName}, {nominee.address.nomineeArea}
//                                         </td>
//                                         <td className="py-2 px-4 border-b">
//                                             {nominee.details.nomineeRelation}
//                                         </td>
//                                         <td className="py-2 px-4 border-b">
//                                             {nominee.details.nomineeDOB}
//                                         </td>
//                                         <td className="py-2 px-4 border-b">
//                                             {nominee.details.nomineeAge}
//                                         </td>
//                                         <td className="py-2 px-4 border-b">
//                                             {nominee.details.nomineePercentage}%
//                                         </td>
//                                         <td className="py-2 px-4 border-b">
//                                             <button
//                                                 onClick={() => removeNominee(nominee.id)}
//                                                 className="text-red-500 hover:text-red-700"
//                                             >
//                                                 Remove
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             )}

//             <div className="flex justify-between mt-6 z-10" style={{ zIndex: '999' }}>
//                 <CommonButton onClick={onBack} variant="outlined">
//                     Back
//                 </CommonButton>
//                 <CommonButton onClick={submitnomini} variant="contained">
//                     Save & Continue
//                 </CommonButton>
//             </div>
//         </div>
//     );
// }

// export default NominationForm;


// //////////////validation done below
// // import React, { useState } from 'react';
// // import CommanInput from '../../components/CommanInput';
// // import labels from '../../components/labels';
// // import CommonButton from '../../components/CommonButton';
// // import { accountNomineeService } from '../../services/apiServices';
// // import Swal from 'sweetalert2';
// // import CommanSelect from '../../components/CommanSelect';
// // import { salutation, relation, } from '../../data/data'

// // function NominationForm({ formData, updateFormData, onBack, onNext }) {
// //     const [nominees, setNominees] = useState(
// //         formData.nominationDetails?.nominees || [{
// //             id: 1,
// //             details: {
// //                 nomineeSalutation: '',
// //                 nomineeFirstName: '',
// //                 nomineeMiddleName: '',
// //                 nomineeLastName: '',
// //                 nomineeRelation: '',
// //                 nomineePercentage: '',
// //                 nomineeDOB: '',
// //                 nomineeAge: ''
// //             },
// //             address: {
// //                 nomineeComplexName: '',
// //                 nomineeBuildingName: '',
// //                 nomineeArea: '',
// //                 nomineeLandmark: '',
// //                 nomineeCountry: '',
// //                 nomineePinCode: '',
// //                 nomineeCity: '',
// //                 nomineeDistrict: '',
// //                 nomineeState: ''
// //             }
// //         }]
// //     );

// //     // Validation function for a single nominee
// //     const validateNominee = (nominee) => {
// //         const errors = {};

// //         // Details validation
// //         if (!nominee.details.nomineeSalutation) errors.nomineeSalutation = 'Required';
// //         if (!nominee.details.nomineeFirstName || nominee.details.nomineeFirstName.length > 50) errors.nomineeFirstName = 'Required, max 50 chars';
// //         if (!nominee.details.nomineeMiddleName || nominee.details.nomineeMiddleName.length > 50) errors.nomineeMiddleName = 'Required, max 50 chars';
// //         if (!nominee.details.nomineeLastName || nominee.details.nomineeLastName.length > 50) errors.nomineeLastName = 'Required, max 50 chars';
// //         if (!nominee.details.nomineeRelation) errors.nomineeRelation = 'Required';
// //         if (!nominee.details.nomineePercentage || isNaN(nominee.details.nomineePercentage) || nominee.details.nomineePercentage < 0 || nominee.details.nomineePercentage > 100) errors.nomineePercentage = 'Required, 0-100';
// //         if (!nominee.details.nomineeDOB) errors.nomineeDOB = 'Required';
// //         if (!nominee.details.nomineeAge || isNaN(nominee.details.nomineeAge) || nominee.details.nomineeAge < 0 || nominee.details.nomineeAge > 120) errors.nomineeAge = 'Required, 0-120';

// //         // Address validation
// //         if (!nominee.address.nomineeComplexName || nominee.address.nomineeComplexName.length > 50) errors.nomineeComplexName = 'Required, max 50 chars';
// //         if (!nominee.address.nomineeBuildingName || nominee.address.nomineeBuildingName.length > 20) errors.nomineeBuildingName = 'Required, max 20 chars';
// //         if (!nominee.address.nomineeArea || nominee.address.nomineeArea.length > 50) errors.nomineeArea = 'Required, max 50 chars';
// //         if (!nominee.address.nomineeLandmark || nominee.address.nomineeLandmark.length > 50) errors.nomineeLandmark = 'Required, max 50 chars';
// //         if (!nominee.address.nomineeCountry || nominee.address.nomineeCountry.length > 30) errors.nomineeCountry = 'Required, max 30 chars';
// //         if (!nominee.address.nomineePinCode || !/^\d{6}$/.test(nominee.address.nomineePinCode)) errors.nomineePinCode = 'Required, 6 digits';
// //         if (!nominee.address.nomineeCity || nominee.address.nomineeCity.length > 30) errors.nomineeCity = 'Required, max 30 chars';
// //         if (!nominee.address.nomineeDistrict || nominee.address.nomineeDistrict.length > 30) errors.nomineeDistrict = 'Required, max 30 chars';
// //         if (!nominee.address.nomineeState || nominee.address.nomineeState.length > 30) errors.nomineeState = 'Required, max 30 chars';

// //         return errors;
// //     };

// //     const [errors, setErrors] = useState({});

// //     const handleChange = (id, section, e) => {
// //         const { name, value } = e.target;
// //         setNominees(prevNominees =>
// //             prevNominees.map(nominee =>
// //                 nominee.id === id
// //                     ? {
// //                         ...nominee,
// //                         [section]: {
// //                             ...nominee[section],
// //                             [name]: value
// //                         }
// //                     }
// //                     : nominee
// //             )
// //         );
// //     };

// //     const addNominee = () => {
// //         const newId = nominees.length > 0 ? Math.max(...nominees.map(n => n.id)) + 1 : 1;
// //         setNominees(prevNominees => [
// //             ...prevNominees,
// //             {
// //                 id: newId,
// //                 details: {
// //                     nomineeSalutation: '',
// //                     nomineeFirstName: '',
// //                     nomineeMiddleName: '',
// //                     nomineeLastName: '',
// //                     nomineeRelation: '',
// //                     nomineePercentage: '',
// //                     nomineeDOB: '',
// //                     nomineeAge: ''
// //                 },
// //                 address: {
// //                     nomineeComplexName: '',
// //                     nomineeBuildingName: '',
// //                     nomineeArea: '',
// //                     nomineeLandmark: '',
// //                     nomineeCountry: '',
// //                     nomineePinCode: '',
// //                     nomineeCity: '',
// //                     nomineeDistrict: '',
// //                     nomineeState: ''
// //                 }
// //             }
// //         ]);
// //     };

// //     const removeNominee = (id) => {
// //         if (nominees.length > 1) {
// //             setNominees(prevNominees => prevNominees.filter(nominee => nominee.id !== id));
// //         }
// //     };

// //     const submitnomini = async () => {
// //         // Validate all nominees
// //         const allErrors = {};
// //         let hasError = false;
// //         nominees.forEach((nominee, idx) => {
// //             const nomineeErrors = validateNominee(nominee);
// //             if (Object.keys(nomineeErrors).length < 0) {
// //                 allErrors[nominee.id] = nomineeErrors;
// //                 hasError = true;
// //             }
// //         });
// //         setErrors(allErrors);

// //         if (hasError) {
// //             Swal.fire({
// //                 icon: 'error',
// //                 title: 'Validation Error',
// //                 text: 'Please fix the errors in the form before submitting.'
// //             });
// //             return;
// //         }

// //         try {
// //             // Loop through each nominee and send to API
// //             for (const nominee of nominees) {
// //                 const payload = {
// //                     application_id: formData.application_id, // <-- Always include this!
// //                     salutation: nominee.details.nomineeSalutation,
// //                     first_name: nominee.details.nomineeFirstName,
// //                     middle_name: nominee.details.nomineeMiddleName,
// //                     last_name: nominee.details.nomineeLastName,
// //                     relationship: nominee.details.nomineeRelation,
// //                     percentage: nominee.details.nomineePercentage,
// //                     dob: nominee.details.nomineeDOB,
// //                     age: nominee.details.nomineeAge,
// //                     nom_complex_name: nominee.address.nomineeComplexName,
// //                     nom_flat_no: nominee.address.nomineeBuildingName,
// //                     nom_area: nominee.address.nomineeArea,
// //                     nom_landmark: nominee.address.nomineeLandmark,
// //                     nom_country: nominee.address.nomineeCountry,
// //                     nom_pincode: nominee.address.nomineePinCode,
// //                     nom_city: nominee.address.nomineeCity,
// //                     nom_district: nominee.address.nomineeDistrict,
// //                     nom_state: nominee.address.nomineeState,
// //                     status: "APPROVED"
// //                 };

// //                 await accountNomineeService.create(payload);
// //             }

// //             Swal.fire({
// //                 icon: 'success',
// //                 title: 'Nominee(s) saved successfully!',
// //                 showConfirmButton: false,
// //                 timer: 1500
// //             });

// //             if (onNext) onNext();

// //         } catch (error) {
// //             Swal.fire({
// //                 icon: 'error',
// //                 title: 'Error',
// //                 text: error?.response?.data?.message || 'Failed to save nominee(s)'
// //             });
// //         }
// //     };

// //     return (
// //         <div className="max-w-screen-xl mx-auto">
// //             {nominees.map((nominee, index) => (
// //                 <div key={nominee.id} className="mb-8 border-b pb-6">
// //                     <div className="flex justify-between items-center">
// //                         <h2 className="text-xl font-bold">Nominee {index + 1} Details</h2>
// //                         {nominees.length > 1 && (
// //                             <CommonButton
// //                                 onClick={() => removeNominee(nominee.id)}
// //                                 className="px-3 py-1 bg-red-500 text-white rounded text-sm"
// //                             >
// //                                 Remove
// //                             </CommonButton>
// //                         )}
// //                     </div>

// //                     <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
// //                         <CommanSelect
// //                             label={labels.nomineeSalutation.label}
// //                             name="nomineeSalutation"
// //                             value={nominee.details.nomineeSalutation}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                             option={salutation}
// //                         />

// //                         <CommanInput
// //                             label={labels.nomineeFirstName.label}
// //                             name="nomineeFirstName"
// //                             value={nominee.details.nomineeFirstName}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                             max={50}
// //                             validationType="TEXT_ONLY"
// //                             error={errors[nominee.id]?.nomineeFirstName}
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeMiddleName.label}
// //                             name="nomineeMiddleName"
// //                             value={nominee.details.nomineeMiddleName}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                             max={50}
// //                             validationType="TEXT_ONLY"
// //                             error={errors[nominee.id]?.nomineeMiddleName}
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeLastName.label}
// //                             name="nomineeLastName"
// //                             value={nominee.details.nomineeLastName}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                             max={50}
// //                             validationType="TEXT_ONLY"
// //                             error={errors[nominee.id]?.nomineeLastName}
// //                         />

// //                         <CommanSelect
// //                             label={labels.nomineeRelation.label}
// //                             name="nomineeRelation"
// //                             value={nominee.details.nomineeRelation}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                             option={relation}
// //                         />


// //                         <CommanInput
// //                             label={labels.nomineePercentage.label}
// //                             name="nomineePercentage"
// //                             value={nominee.details.nomineePercentage}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                             max={2}
// //                             validationType="NUMBER_ONLY"
// //                             error={errors[nominee.id]?.nomineePercentage}
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeDOB.label}
// //                             name="nomineeDOB"
// //                             type="date"
// //                             value={nominee.details.nomineeDOB}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                             validationType="DATE"
// //                             error={errors[nominee.id]?.nomineeDOB}
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeAge.label}
// //                             name="nomineeAge"
// //                             value={nominee.details.nomineeAge}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                             max={3}
// //                             validationType="NUMBER_ONLY"
// //                             error={errors[nominee.id]?.nomineeAge}
// //                         />
// //                     </div>

// //                     <h2 className="text-xl font-bold mt-8 mb-4">Nominee {index + 1} Address</h2>
// //                     <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
// //                         <CommanInput
// //                             label={labels.nomineeComplexName.label}
// //                             name="nomineeComplexName"
// //                             value={nominee.address.nomineeComplexName}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                             max={50}
// //                             validationType="ALPHABETS_AND_SPACE"
// //                             error={errors[nominee.id]?.nomineeComplexName}
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeBuildingName.label}
// //                             name="nomineeBuildingName"
// //                             value={nominee.address.nomineeBuildingName}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                             max={20}
// //                             validationType="ALPHANUMERIC"
// //                             error={errors[nominee.id]?.nomineeBuildingName}
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeArea.label}
// //                             name="nomineeArea"
// //                             value={nominee.address.nomineeArea}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                             max={50}
// //                             validationType="ALPHABETS_AND_SPACE"
// //                             error={errors[nominee.id]?.nomineeArea}
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeLandmark.label}
// //                             name="nomineeLandmark"
// //                             value={nominee.address.nomineeLandmark}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                             max={50}
// //                             validationType="EVERYTHING"
// //                             error={errors[nominee.id]?.nomineeLandmark}
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeCountry.label}
// //                             name="nomineeCountry"
// //                             value={nominee.address.nomineeCountry}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                             max={30}
// //                             validationType="ALPHABETS_AND_SPACE"
// //                             error={errors[nominee.id]?.nomineeCountry}
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineePinCode.label}
// //                             name="nomineePinCode"
// //                             value={nominee.address.nomineePinCode}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                             max={6}
// //                             validationType="NUMBER_ONLY"
// //                             error={errors[nominee.id]?.nomineePinCode}
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeCity.label}
// //                             name="nomineeCity"
// //                             value={nominee.address.nomineeCity}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                             max={30}
// //                             validationType="ALPHABETS_AND_SPACE"
// //                             error={errors[nominee.id]?.nomineeCity}
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeDistrict.label}
// //                             name="nomineeDistrict"
// //                             value={nominee.address.nomineeDistrict}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                             max={30}
// //                             validationType="ALPHABETS_AND_SPACE"
// //                             error={errors[nominee.id]?.nomineeDistrict}
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeState.label}
// //                             name="nomineeState"
// //                             value={nominee.address.nomineeState}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                             max={30}
// //                             validationType="ALPHABETS_AND_SPACE"
// //                             error={errors[nominee.id]?.nomineeState}
// //                         />
// //                     </div>
// //                 </div>
// //             ))}

// //             <div className="flex justify-end mt-6">
// //                 <CommonButton
// //                     onClick={addNominee}
// //                     className="px-4 py-2 bg-green-500 text-white rounded"
// //                 >
// //                     Add Nominee
// //                 </CommonButton>
// //             </div>

// //             <div className="flex justify-between mt-6 z-10" style={{ zIndex: '999' }}>
// //                 <CommonButton onClick={onBack} variant="outlined">
// //                     Back
// //                 </CommonButton>
// //                 <CommonButton onClick={submitnomini} variant="contained">
// //                     Save & Continue
// //                 </CommonButton>
// //             </div>
// //         </div>
// //     );
// // }

// // export default NominationForm;

// ///////integration working below
// // import React, { useState, useEffect } from 'react';
// // import CommanInput from '../../components/CommanInput';
// // import labels from '../../components/labels';
// // import CommonButton from '../../components/CommonButton';
// // import { accountNomineeService } from '../../services/apiServices';
// // import Swal from 'sweetalert2';

// // function NominationForm({ formData, updateFormData, onBack, onNext }) {
// //     const [nominees, setNominees] = useState(
// //         formData.nominationDetails?.nominees || [{
// //             id: 1,
// //             details: {
// //                 nomineeSalutation: '',
// //                 nomineeFirstName: '',
// //                 nomineeMiddleName: '',
// //                 nomineeLastName: '',
// //                 nomineeRelation: '',
// //                 nomineePercentage: '',
// //                 nomineeDOB: '',
// //                 nomineeAge: ''
// //             },
// //             address: {
// //                 nomineeComplexName: '',
// //                 nomineeBuildingName: '',
// //                 nomineeArea: '',
// //                 nomineeLandmark: '',
// //                 nomineeCountry: '',
// //                 nomineePinCode: '',
// //                 nomineeCity: '',
// //                 nomineeDistrict: '',
// //                 nomineeState: ''
// //             }
// //         }]
// //     );

// //     const handleChange = (id, section, e) => {
// //         const { name, value } = e.target;
// //         setNominees(prevNominees =>
// //             prevNominees.map(nominee =>
// //                 nominee.id === id
// //                     ? {
// //                         ...nominee,
// //                         [section]: {
// //                             ...nominee[section],
// //                             [name]: value
// //                         }
// //                     }
// //                     : nominee
// //             )
// //         );
// //     };

// //     const addNominee = () => {
// //         const newId = nominees.length > 0 ? Math.max(...nominees.map(n => n.id)) + 1 : 1;
// //         setNominees(prevNominees => [
// //             ...prevNominees,
// //             {
// //                 id: newId,
// //                 details: {
// //                     nomineeSalutation: '',
// //                     nomineeFirstName: '',
// //                     nomineeMiddleName: '',
// //                     nomineeLastName: '',
// //                     nomineeRelation: '',
// //                     nomineePercentage: '',
// //                     nomineeDOB: '',
// //                     nomineeAge: ''
// //                 },
// //                 address: {
// //                     nomineeComplexName: '',
// //                     nomineeBuildingName: '',
// //                     nomineeArea: '',
// //                     nomineeLandmark: '',
// //                     nomineeCountry: '',
// //                     nomineePinCode: '',
// //                     nomineeCity: '',
// //                     nomineeDistrict: '',
// //                     nomineeState: ''
// //                 }
// //             }
// //         ]);
// //     };

// //     const removeNominee = (id) => {
// //         if (nominees.length > 1) {
// //             setNominees(prevNominees => prevNominees.filter(nominee => nominee.id !== id));
// //         }
// //     };


// //     const submitnomini = async () => {
// //         try {
// //             // Loop through each nominee and send to API
// //             for (const nominee of nominees) {
// //                 const payload = {
// //                     // If application_id is hardcoded in backend, you can omit it
// //                     salutation: nominee.details.nomineeSalutation,
// //                     first_name: nominee.details.nomineeFirstName,
// //                     middle_name: nominee.details.nomineeMiddleName,
// //                     last_name: nominee.details.nomineeLastName,
// //                     relationship: nominee.details.nomineeRelation,
// //                     percentage: nominee.details.nomineePercentage,
// //                     dob: nominee.details.nomineeDOB,
// //                     age: nominee.details.nomineeAge,
// //                     nom_complex_name: nominee.address.nomineeComplexName,
// //                     nom_flat_no: nominee.address.nomineeBuildingName,
// //                     nom_area: nominee.address.nomineeArea,
// //                     nom_landmark: nominee.address.nomineeLandmark,
// //                     nom_country: nominee.address.nomineeCountry,
// //                     nom_pincode: nominee.address.nomineePinCode,
// //                     nom_city: nominee.address.nomineeCity,
// //                     nom_district: nominee.address.nomineeDistrict,
// //                     nom_state: nominee.address.nomineeState,
// //                     status: "APPROVED"
// //                 };

// //                 await accountNomineeService.create(payload);
// //             }

// //             Swal.fire({
// //                 icon: 'success',
// //                 title: 'Nominee(s) saved successfully!',
// //                 showConfirmButton: false,
// //                 timer: 1500
// //             });

// //             if (onNext) onNext();

// //         } catch (error) {
// //             Swal.fire({
// //                 icon: 'error',
// //                 title: 'Error',
// //                 text: error?.response?.data?.message || 'Failed to save nominee(s)'
// //             });
// //         }
// //     }
// //     // useEffect(() => {
// //     //     updateFormData({
// //     //         ...formData,
// //     //         nominationDetails: {
// //     //             nominees: nominees
// //     //         }
// //     //     });
// //     // }, [nominees]);

// //     return (
// //         <div className="max-w-screen-xl mx-auto">
// //             {nominees.map((nominee, index) => (
// //                 <div key={nominee.id} className="mb-8 border-b pb-6">
// //                     <div className="flex justify-between items-center">
// //                         <h2 className="text-xl font-bold">Nominee {index + 1} Details</h2>
// //                         {nominees.length > 1 && (
// //                             <CommonButton
// //                                 onClick={() => removeNominee(nominee.id)}
// //                                 className="px-3 py-1 bg-red-500 text-white rounded text-sm"
// //                             >
// //                                 Remove
// //                             </CommonButton>
// //                         )}
// //                     </div>

// //                     <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
// //                         <CommanInput
// //                             label={labels.nomineeSalutation.label}
// //                             name="nomineeSalutation"
// //                             value={nominee.details.nomineeSalutation}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeFirstName.label}
// //                             name="nomineeFirstName"
// //                             value={nominee.details.nomineeFirstName}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeMiddleName.label}
// //                             name="nomineeMiddleName"
// //                             value={nominee.details.nomineeMiddleName}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeLastName.label}
// //                             name="nomineeLastName"
// //                             value={nominee.details.nomineeLastName}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeRelation.label}
// //                             name="nomineeRelation"
// //                             value={nominee.details.nomineeRelation}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineePercentage.label}
// //                             name="nomineePercentage"
// //                             value={nominee.details.nomineePercentage}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeDOB.label}
// //                             name="nomineeDOB"
// //                             type="date"
// //                             value={nominee.details.nomineeDOB}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeAge.label}
// //                             name="nomineeAge"
// //                             value={nominee.details.nomineeAge}
// //                             onChange={(e) => handleChange(nominee.id, 'details', e)}
// //                             required
// //                         />
// //                     </div>

// //                     <h2 className="text-xl font-bold mt-8 mb-4">Nominee {index + 1} Address</h2>
// //                     <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-3">
// //                         <CommanInput
// //                             label={labels.nomineeComplexName.label}
// //                             name="nomineeComplexName"
// //                             value={nominee.address.nomineeComplexName}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeBuildingName.label}
// //                             name="nomineeBuildingName"
// //                             value={nominee.address.nomineeBuildingName}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeArea.label}
// //                             name="nomineeArea"
// //                             value={nominee.address.nomineeArea}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeLandmark.label}
// //                             name="nomineeLandmark"
// //                             value={nominee.address.nomineeLandmark}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeCountry.label}
// //                             name="nomineeCountry"
// //                             value={nominee.address.nomineeCountry}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineePinCode.label}
// //                             name="nomineePinCode"
// //                             value={nominee.address.nomineePinCode}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeCity.label}
// //                             name="nomineeCity"
// //                             value={nominee.address.nomineeCity}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeDistrict.label}
// //                             name="nomineeDistrict"
// //                             value={nominee.address.nomineeDistrict}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                         />
// //                         <CommanInput
// //                             label={labels.nomineeState.label}
// //                             name="nomineeState"
// //                             value={nominee.address.nomineeState}
// //                             onChange={(e) => handleChange(nominee.id, 'address', e)}
// //                             required
// //                         />
// //                     </div>
// //                 </div>
// //             ))}

// //             <div className="flex justify-end mt-6">
// //                 <CommonButton
// //                     onClick={addNominee}
// //                     className="px-4 py-2 bg-green-500 text-white rounded"
// //                 >
// //                     Add Nominee
// //                 </CommonButton>
// //             </div>

// //             <div className="flex justify-between mt-6 z-10" style={{ zIndex: '999' }}>
// //                 <CommonButton onClick={onBack} variant="outlined">
// //                     Back
// //                 </CommonButton>
// //                 <CommonButton onClick={submitnomini} variant="contained">
// //                     Save & Continue
// //                 </CommonButton>
// //             </div>
// //         </div>
// //     );
// // }

// // export default NominationForm;