
// import React, { useState, useEffect } from 'react';
// import clsx from 'clsx';
// import CommonButton from '../../components/CommonButton';
// import { accountNomineeService , createAccountService,applicationDetailsService} from '../../services/apiServices';
// import Swal from 'sweetalert2';
// import { salutation, relation } from '../../data/data';
// import { add } from '@tensorflow/tfjs-core/dist/engine';


// function NominationForm({ formData, updateFormData, onBack, onNext }) {
//     const storedId = localStorage.getItem('application_id');
//     const savedData = loadFromLocalStorage(storedId);
//     const [nominees, setNominees] = useState(
//             savedData?.nominees || formData.nominationDetails?.nominees || []
//     );


//     const [currentNominee, setCurrentNominee] = useState({
//         details: {
//             nomineeSalutation: '',
//             nomineeFirstName: '',
//             nomineeMiddleName: '',
//             nomineeLastName: '',
//             nomineeRelation: '',
//             nomineePercentage: '100',
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

//     const calculateAge = (dob) => {
//         if (!dob) return '';

//         const birthDate = new Date(dob);
//         const today = new Date();
//         let age = today.getFullYear() - birthDate.getFullYear();
//         const monthDiff = today.getMonth() - birthDate.getMonth();

//         if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
//             age--;
//         }

//         return age.toString();
//     };

//     const getRemainingPercentage = () => {
//         const totalUsed = nominees.reduce((sum, nominee) => sum + parseFloat(nominee.details.nomineePercentage || 0), 0);
//         return 100 - totalUsed;
//     };

//     const validateNominee = (nominee) => {
//         const errors = {};

//         // Details validation
//         if (nominee.details.nomineeFirstName && nominee.details.nomineeFirstName.length > 50) 
//             errors.nomineeFirstName = 'Max 50 chars';
//         if (nominee.details.nomineeLastName && nominee.details.nomineeLastName.length > 50) 
//             errors.nomineeLastName = 'Max 50 chars';

//         // Percentage validation
//         const percentage = parseFloat(nominee.details.nomineePercentage);
//         if (isNaN(percentage)) {
//             errors.nomineePercentage = 'Must be a number';
//         } else if (percentage < 0 || percentage > 100) {
//             errors.nomineePercentage = 'Must be between 0-100';
//         }

//         if (nominee.details.nomineeAge && 
//             (isNaN(nominee.details.nomineeAge)) || 
//             nominee.details.nomineeAge < 0 || 
//             nominee.details.nomineeAge > 120
//         ) {
//             errors.nomineeAge = 'Must be 0-120';
//         }

//         // Address validation
//         if (nominee.address.nomineeComplexName && nominee.address.nomineeComplexName.length > 50) 
//             errors.nomineeComplexName = 'Max 50 chars';
//         if (nominee.address.nomineeBuildingName && nominee.address.nomineeBuildingName.length > 20) 
//             errors.nomineeBuildingName = 'Max 20 chars';
//         if (nominee.address.nomineeArea && nominee.address.nomineeArea.length > 50) 
//             errors.nomineeArea = 'Max 50 chars';
//         if (nominee.address.nomineeCountry && nominee.address.nomineeCountry.length > 30) 
//             errors.nomineeCountry = 'Max 30 chars';
//         if (nominee.address.nomineePinCode && !/^\d{6}$/.test(nominee.address.nomineePinCode)) 
//             errors.nomineePinCode = 'Must be 6 digits';

//         return errors;
//     };

//     // Function to fetch address details from PIN code API
//     const fetchAddressByPinCode = async (pincode, prefix) => {
//         try {
//             const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
//             const data = await response.json();
            
//             if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
//                 const postOffice = data[0].PostOffice[0];
//                 return {
//                     [`nomineeState`]: postOffice.State,
//                     [`nomineeDistrict`]: postOffice.District,
//                     [`nomineeCity`]: postOffice.Name || postOffice.Block || postOffice.Division,
//                     [`nomineeCountry`]: 'India'
//                 };
 
//             }
//             throw new Error('No address found for this PIN code');
//         } catch (error) {
//             console.error('Error fetching address by PIN code:', error);
//             throw error;
//         }
//     };
//     const handleChange = (section, e) => {
//         const { name, value } = e.target;

//         // Special handling for percentage field
//         if (name === 'nomineePercentage') {
//             let processedValue = value;
//             // Ensure only numbers and limit to 3 digits
//             processedValue = processedValue.replace(/[^0-9]/g, '');
//             if (processedValue.length > 3) processedValue = processedValue.slice(0, 3);
//             // Ensure value doesn't exceed 100
//             if (parseFloat(processedValue) > 100) processedValue = '100';

//             setCurrentNominee(prev => ({
//                 ...prev,
//                 details: {
//                     ...prev.details,
//                     [name]: processedValue
//                 }
//             }));
//             return;
//         }

//           // Check if the input is for the date of birth
//             if (name === "nomineeDOB") {
//                 const selectedDate = new Date(value);
//                 const today = new Date();

//                 // Remove time portion for accurate comparison
//                 selectedDate.setHours(0, 0, 0, 0);
//                 today.setHours(0, 0, 0, 0);

//                 if (selectedDate > today) {
//                     // alert("Future dates are not allowed.");
//                     Swal.fire({
//                             icon: 'error',
//                             title: 'Future dates are not allowed.',
//                             // text: error.response?.data?.message || 'Required field contains invalid data.',
//                         });
//                     return; // prevent updating state with invalid date
//                 }
//             }


//         // If DOB is being changed, calculate age
//         if (name === 'nomineeDOB') {
//             const age = calculateAge(value);
//             setCurrentNominee(prev => ({
//                 ...prev,
//                 details: {
//                     ...prev.details,
//                     [name]: value,
//                     nomineeAge: age
//                 }
//             }));
//         } else {
//             setCurrentNominee(prev => ({
//                 ...prev,
//                 [section]: {
//                     ...prev[section],
//                     [name]: value
//                 }
//             }));
//         }
//     };

//     const addNominee = () => {
//         // First check if required fields are filled
//         const requiredFields = [
//             currentNominee.details.nomineeSalutation,
//             currentNominee.details.nomineeFirstName,
//             currentNominee.details.nomineeLastName,
//             currentNominee.details.nomineeRelation,
//             currentNominee.details.nomineePercentage,
//             currentNominee.details.nomineeDOB,
//             currentNominee.address.nomineeComplexName,
//             currentNominee.address.nomineeBuildingName,
//             currentNominee.address.nomineeArea,
//             currentNominee.address.nomineeCountry,
//             currentNominee.address.nomineePinCode
//         ];

//         if (requiredFields.some(field => !field)) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Incomplete Form',
//                 text: 'Please fill all required fields before adding nominee.'
//             });
//             return;
//         }
//          if (
//                 /\d/.test(currentNominee.details.nomineeFirstName) ||
//                 /\d/.test(currentNominee.details.nomineeMiddleName) ||
//                 /\d/.test(currentNominee.details.nomineeLastName)
//             ) {
//                 Swal.fire({
//                     icon: 'error',
//                     text: 'Nominee name fields should contain only alphabets. Numbers are not allowed.',
//                 });
//                 return;
//             }

//         // Then check for validation errors
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

//         const remainingPercentage = getRemainingPercentage();
//         const currentPercentage = parseFloat(currentNominee.details.nomineePercentage);

//         if (remainingPercentage <= 0) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Percentage Exhausted',
//                 text: 'All your percentage value (100%) has been used'
//             });
//             return;
//         }

//         if (currentPercentage > remainingPercentage) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Invalid Percentage',
//                 text: `You can only allocate up to ${remainingPercentage}% for this nominee`
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
//         const remainingPercentage = getRemainingPercentage();
//         setCurrentNominee({
//             details: {
//                 nomineeSalutation: '',
//                 nomineeFirstName: '',
//                 nomineeMiddleName: '',
//                 nomineeLastName: '',
//                 nomineeRelation: '',
//                 // nomineePercentage: remainingPercentage > 0 ? Math.min(remainingPercentage, 100).toString() : '0',
//                 nomineePercentage: remainingPercentage,
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

//         // Check if total percentage is exactly 100
//         const totalPercentage = nominees.reduce((sum, nominee) => sum + parseFloat(nominee.details.nomineePercentage), 0);
//         if (totalPercentage !== 100) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Invalid Total Percentage',
//                 text: `Total percentage must be exactly 100% (current: ${totalPercentage}%)`
//             });
//             return;
//         }
   
//         try {
//             // Prepare nominees array for API
//             const nomineesPayload = nominees.map(nominee => ({
//                 salutation: nominee.details.nomineeSalutation,
//                 first_name: nominee.details.nomineeFirstName,
//                 middle_name: nominee.details.nomineeMiddleName,
//                 last_name: nominee.details.nomineeLastName,
//                 relationship: nominee.details.nomineeRelation,
//                 percentage: nominee.details.nomineePercentage,
//                 dob: nominee.details.nomineeDOB,
//                 age: nominee.details.nomineeAge,
//                 nom_complex_name: nominee.address.nomineeComplexName,
//                 nom_flat_no: nominee.address.nomineeBuildingName,
//                 nom_area: nominee.address.nomineeArea,
//                 nom_landmark: nominee.address.nomineeLandmark,
//                 nom_country: nominee.address.nomineeCountry,
//                 nom_pincode: nominee.address.nomineePinCode,
//                 nom_city: nominee.address.nomineeCity,
//                 nom_district: nominee.address.nomineeDistrict,
//                 nom_state: nominee.address.nomineeState,
//                 status: "APPROVED"
//             }));

//             // Send all nominees in one request
//             await createAccountService.accountNominee_s5b({
//                 application_id: storedId,
//                 nominees: nomineesPayload
//             });

//             // Clear saved data on successful submission
//             // clearLocalStorage();

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

//     const sameAddress= async() =>{
        
//         const response = await applicationDetailsService.getFullDetails(storedId);
//         if (response.data) {
//         const {  application_addresss} = response.data;
//         const address = Array.isArray(application_addresss) ? application_addresss[0] : application_addresss;
//         console.log('to show : ', address);
//                 setCurrentNominee(prev => ({
//             ...prev,
//             address: {
//                 nomineeComplexName: address.per_complex_name,
//                 nomineeBuildingName: address.per_flat_no,
//                 nomineeArea: address.per_area,
//                 nomineeLandmark: address.per_landmark,
//                 nomineeCountry: address.per_country,
//                 nomineePinCode: address.per_pincode,
//                 nomineeCity: address.per_city,
//                 nomineeDistrict: address.per_district,
//                 nomineeState: address.per_state
//             }
//         }
//         ))
    
//         } 

                    
//     }

//     useEffect(() => {
//         saveToLocalStorage({
//             nominees,
//             currentNominee
//         });
//     }, [nominees, currentNominee]);
//     return (
//         <div className="max-w-screen-xl mx-auto">
//             <h2 className="text-2xl font-bold mb-4">Add Nominee Details</h2>
//             {/* Nominee Form */}
//             <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 mb-3">
//                 <SelectField
//                     label="Salutation"
//                     name="nomineeSalutation"
//                     value={currentNominee.details.nomineeSalutation}
//                     onChange={(e) => handleChange('details', e)}
//                     required
//                     options={salutation}
//                     error={errors.nomineeSalutation}
//                 />
//                 <InputField
//                     label="First Name"
//                     name="nomineeFirstName"
//                     value={currentNominee.details.nomineeFirstName}
//                     onChange={(e) => handleChange('details', e)}
//                     required
//                     max={50}
//                     error={errors.nomineeFirstName}
//                 />
//                 <InputField
//                     label="Middle Name"
//                     name="nomineeMiddleName"
//                     value={currentNominee.details.nomineeMiddleName}
//                     onChange={(e) => handleChange('details', e)}
//                     max={50}
//                     error={errors.nomineeMiddleName}
//                 />
//                 <InputField
//                     label="Last Name"
//                     name="nomineeLastName"
//                     value={currentNominee.details.nomineeLastName}
//                     onChange={(e) => handleChange('details', e)}
//                     required
//                     max={50}
//                     error={errors.nomineeLastName}
//                 />
//                 <SelectField
//                     label="Relation"
//                     name="nomineeRelation"
//                     value={currentNominee.details.nomineeRelation}
//                     onChange={(e) => handleChange('details', e)}
//                     required
//                     options={relation}
//                     error={errors.nomineeRelation}
//                 />
//                 <InputField
//                     label={`Percentage (Remaining: ${getRemainingPercentage()}%)`}
//                     name="nomineePercentage"
//                     value={currentNominee.details.nomineePercentage}
//                     onChange={(e) => handleChange('details', e)}
//                     required
//                     max={3}
//                     error={errors.nomineePercentage}
//                 />
//                 <InputField
//                     label="Date of Birth"
//                     name="nomineeDOB"
//                     type="date"
//                     value={currentNominee.details.nomineeDOB}
//                     onChange={(e) => handleChange('details', e)}
//                     required
//                     error={errors.nomineeDOB}
//                 />
//                 <InputField
//                     label="Age"
//                     name="nomineeAge"
//                     value={currentNominee.details.nomineeAge}
//                     onChange={(e) => handleChange('details', e)}
//                     required
//                     max={3}
//                     error={errors.nomineeAge}
//                     disabled={true}
//                 />
//             </div>

//             <div className='flex  items-center mb-2'>
//             <h2 className="text-xl font-bold m-0 ">Nominee Address</h2>    &emsp;
//             {/* <div className='flex items-center'> */}
//             <input type='checkbox' className='me-2' onClick={sameAddress} /> Same as permenant address
//             {/* </div> */}
                
//             </div>
 
//             <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 mb-6">
//                 <InputField
//                     label="Complex Name"
//                     name="nomineeComplexName"
//                     value={currentNominee.address.nomineeComplexName}
//                     onChange={(e) => handleChange('address', e)}
//                     required
//                     max={50}
//                     error={errors.nomineeComplexName}
//                 />
//                 <InputField
//                     label="Building Name"
//                     name="nomineeBuildingName"
//                     value={currentNominee.address.nomineeBuildingName}
//                     onChange={(e) => handleChange('address', e)}
//                     required
//                     max={20}
//                     error={errors.nomineeBuildingName}
//                 />
//                 <InputField
//                     label="Area"
//                     name="nomineeArea"
//                     value={currentNominee.address.nomineeArea}
//                     onChange={(e) => handleChange('address', e)}
//                     required
//                     max={50}
//                     error={errors.nomineeArea}
//                 />
//                 <InputField
//                     label="Landmark"
//                     name="nomineeLandmark"
//                     value={currentNominee.address.nomineeLandmark}
//                     onChange={(e) => handleChange('address', e)}
//                     max={50}
//                     error={errors.nomineeLandmark}
//                 />
//                 <InputField
//                     label="Country"
//                     name="nomineeCountry"
//                     value={currentNominee.address.nomineeCountry}
//                     onChange={(e) => handleChange('address', e)}
//                     required
//                     max={30}
//                     error={errors.nomineeCountry}
//                 />
//                 <InputField
//                     label="Pin Code"
//                     name="nomineePinCode"
//                     value={currentNominee.address.nomineePinCode}
//                     onChange={(e) => handleChange('address', e)}
//                     required
//                     max={6}
//                     error={errors.nomineePinCode}
//                 />

                
//                 <InputField
//                     label="State"
//                     name="nomineeState"
//                     value={currentNominee.address.nomineeState}
//                     onChange={(e) => handleChange('address', e)}
//                     required
//                     max={6}
//                     // error={errors.nomineePinCode}
//                 />
                
//                 <InputField
//                     label="City"
//                     name="nomineeCity"
//                     value={currentNominee.address.nomineeCity}
//                     onChange={(e) => handleChange('address', e)}
//                     required
//                     max={6}
//                     // error={errors.nomineePinCode}
//                 />
                
//                 <InputField
//                     label="District"
//                     name="nomineeDistrict"
//                     value={currentNominee.address.nomineeDistrict}
//                     onChange={(e) => handleChange('address', e)}
//                     required
//                     max={6}
//                     // error={errors.nomineePinCode}
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


//             <div className="next-back-btns z-10" >{/* z-10 */}
//                 <CommonButton onClick={onBack} variant="outlined" className="btn-back">
//                     <i className="bi bi-chevron-double-left"></i>&nbsp;Back
//                 </CommonButton>
//                 <CommonButton onClick={submitnomini} variant="contained" className="btn-next">
//                     Next&nbsp;<i className="bi bi-chevron-double-right"></i>
//                 </CommonButton>
//             </div>

 
//         </div>
//     );
// }

// export default NominationForm; 
// // Add these helper functions at the top of your component file
// const STORAGE_KEY = 'nominationFormData';

// const saveToLocalStorage = (data) => {
//   try {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
//   } catch (error) {
//     console.error('Error saving to localStorage:', error);
//   }
// };

// const loadFromLocalStorage = (storedId) => {
//   try {
//     const data = localStorage.getItem(STORAGE_KEY);

    
//     //     useEffect(() => {
//     //         if (!applicationId) return;
//     //         const fetchDetails = async () => {
//     //             try {
//     //                 const response = await applicationDetailsService.getFullDetails(applicationId);
//     //                 console.log('DATA  NOM :: ', response.data.data)
//     //             } catch (error) {
//     //             console.log(error)
//     //             Swal.fire({
//     //                 icon: 'error',
//     //                 title: 'Error',
//     //                 text:  error?.response?.data?.message
//     //             });
//     //         }
//     //     };
//     //     fetchDetails();
//     // }, [storedId]);



//     return data ? JSON.parse(data) : null;
//   } catch (error) {
//     console.error('Error loading from localStorage:', error);
//     return null;
//   }
// }; 

// const InputField = ({
//   label,
//   name,
//   type = 'text',
//   value,
//   onChange,
//   required = false,
//   max,
//   error,
//   disabled = false,
//   validationType,
//   ...rest
// }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const [touched, setTouched] = useState(false);

//   const shouldFloat = isFocused || value;

//   const handleBlur = () => {
//     setIsFocused(false);
//     setTouched(true);
//   };

//   return (
//     <div className={clsx('floating-input-height relative w-full border border-gray-300 dark:border-gray-700 rounded-md')}>
//       <input
//         id={name}
//         name={name}
//         type={type}
//         value={value}
//         onChange={onChange}
//         onFocus={() => setIsFocused(true)}
//         onBlur={handleBlur}
//         required={required}
//         className={clsx(
//           'peer block w-full bg-transparent px-4 py-2 text-sm rounded-md',
//           'transition-all',
//           {
//             'border-red-500': error && touched,
//           }
//         )}
//         placeholder={label}
//         maxLength={max}
//         disabled={disabled}
//         {...rest}
//       />
//       <label
//         htmlFor={name}
//         className={clsx(
//           'absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-300 transition-all duration-200 pointer-events-none',
//           {
//             'bg-white dark:bg-gray-900 px-1 text-xs -translate-y-4': shouldFloat,
//             'bg-white dark:bg-gray-900 w-9/12 text-gray-500 dark:text-gray-200 translate-y-0.5': !shouldFloat,
//           }
//         )}
//       >
//         {label}{required && <span className="text-red-500 ml-0.5">*</span>}
//       </label>

//       {error && touched && (
//         <p className="mt-1 text-xs text-red-500">
//           {error}
//         </p>
//       )}
//     </div>
//   );
// };

// const SelectField = ({
//   label,
//   name,
//   value,
//   onChange,
//   required = false,
//   options,
//   error,
//   disabled = false,
//   ...rest
// }) => {
//   const [isFocused, setIsFocused] = useState(false);
//   const [touched, setTouched] = useState(false);

//   const shouldFloat = isFocused || value;

//   const handleBlur = () => {
//     setIsFocused(false);
//     setTouched(true);
//   };

//   return (
//     <div className={clsx(' floating-input-height relative w-full border border-gray-300 dark:border-gray-700 rounded-md')}>
//       <select
//         id={name}
//         name={name}
//         value={value}
//         onChange={onChange}
//         onFocus={() => setIsFocused(true)}
//         onBlur={handleBlur}
//         required={required}
//         className={clsx(
//           'peer block w-full bg-transparent px-4 py-2 text-sm rounded-md',
//           'transition-all',
//           {
//             'border-red-500': error && touched,
//           }
//         )}
//         disabled={disabled}
//         {...rest}
//       >
//         <option value="">Select {label}</option>
//         {options.map((option) => (
//           <option key={option.value} value={option.value}>
//             {option.label}
//           </option>
//         ))}
//       </select>
//       <label
//         htmlFor={name}
//         className={clsx(
//           'absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-300 transition-all duration-200 pointer-events-none',
//           {
//             'bg-white dark:bg-gray-900 px-1 text-xs -translate-y-4': shouldFloat,
//             'bg-white dark:bg-gray-900 w-9/12 text-gray-500 dark:text-gray-200 translate-y-0.5': !shouldFloat,
//           }
//         )}
//       >
//         {label}{required && <span className="text-red-500 ml-0.5">*</span>}
//       </label>

//       {error && touched && (
//         <p className="mt-1 text-xs text-red-500">
//           {error}
//         </p>
//       )}
//     </div>
//   );
// };






 import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import CommonButton from '../../components/CommonButton';
import { accountNomineeService, createAccountService, applicationDetailsService } from '../../services/apiServices';
import Swal from 'sweetalert2';
import { salutation, relation } from '../../data/data';
import { add } from '@tensorflow/tfjs-core/dist/engine';

function NominationForm({ formData, updateFormData, onBack, onNext }) {
    const storedId = localStorage.getItem('application_id');
    const savedData = loadFromLocalStorage(storedId);
    const [nominees, setNominees] = useState(
        savedData?.nominees || formData.nominationDetails?.nominees || []
    );

    const [currentNominee, setCurrentNominee] = useState({
        details: {
            nomineeSalutation: '',
            nomineeFirstName: '',
            nomineeMiddleName: '',
            nomineeLastName: '',
            nomineeRelation: '',
            nomineePercentage: '100',
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
    const [isSameAsPermanent, setIsSameAsPermanent] = useState(false);
    const [isFetchingPincode, setIsFetchingPincode] = useState(false);

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

    const getRemainingPercentage = () => {
        const totalUsed = nominees.reduce((sum, nominee) => sum + parseFloat(nominee.details.nomineePercentage || 0), 0);
        return 100 - totalUsed;
    };

    const validateNominee = (nominee) => {
        const errors = {};

        // Details validation
        if (nominee.details.nomineeFirstName && nominee.details.nomineeFirstName.length > 50) 
            errors.nomineeFirstName = 'Max 50 chars';
        if (nominee.details.nomineeLastName && nominee.details.nomineeLastName.length > 50) 
            errors.nomineeLastName = 'Max 50 chars';

        // Percentage validation
        const percentage = parseFloat(nominee.details.nomineePercentage);
        if (isNaN(percentage)) {
            errors.nomineePercentage = 'Must be a number';
        } else if (percentage < 0 || percentage > 100) {
            errors.nomineePercentage = 'Must be between 0-100';
        }

        if (nominee.details.nomineeAge && 
            (isNaN(nominee.details.nomineeAge)) || 
            nominee.details.nomineeAge < 0 || 
            nominee.details.nomineeAge > 120
        ) {
            errors.nomineeAge = 'Must be 0-120';
        }

        // Address validation
        if (nominee.address.nomineeComplexName && nominee.address.nomineeComplexName.length > 50) 
            errors.nomineeComplexName = 'Max 50 chars';
        if (nominee.address.nomineeBuildingName && nominee.address.nomineeBuildingName.length > 20) 
            errors.nomineeBuildingName = 'Max 20 chars';
        if (nominee.address.nomineeArea && nominee.address.nomineeArea.length > 50) 
            errors.nomineeArea = 'Max 50 chars';
        if (nominee.address.nomineeCountry && nominee.address.nomineeCountry.length > 30) 
            errors.nomineeCountry = 'Max 30 chars';
        if (nominee.address.nomineePinCode && !/^\d{6}$/.test(nominee.address.nomineePinCode)) 
            errors.nomineePinCode = 'Must be 6 digits';

        return errors;
    };

    const fetchAddressByPinCode = async (pincode) => {
        if (!pincode || pincode.length !== 6) return;
        
        setIsFetchingPincode(true);
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            
            if (data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
                const postOffice = data[0].PostOffice[0];
                setCurrentNominee(prev => ({
                    ...prev,
                    address: {
                        ...prev.address,
                        nomineeState: postOffice.State,
                        nomineeDistrict: postOffice.District,
                        nomineeCity: postOffice.Name || postOffice.Block || postOffice.Division,
                        nomineeCountry: 'India'
                    }
                }));
            }
        } catch (error) {
            console.error('Error fetching address by PIN code:', error);
        } finally {
            setIsFetchingPincode(false);
        }
    };

    const handleChange = (section, e) => {
        const { name, value } = e.target;

        // Special handling for percentage field
        if (name === 'nomineePercentage') {
            let processedValue = value;
            processedValue = processedValue.replace(/[^0-9]/g, '');
            if (processedValue.length > 3) processedValue = processedValue.slice(0, 3);
            if (parseFloat(processedValue) > 100) processedValue = '100';

            setCurrentNominee(prev => ({
                ...prev,
                details: {
                    ...prev.details,
                    [name]: processedValue
                }
            }));
            return;
        }

        // Check if the input is for the date of birth
        if (name === "nomineeDOB") {
            const selectedDate = new Date(value);
            const today = new Date();

            selectedDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (selectedDate > today) {
                Swal.fire({
                    icon: 'error',
                    title: 'Future dates are not allowed.',
                });
                return;
            }
        }

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

            // Auto-fetch address when pincode is entered
            if (name === 'nomineePinCode' && value.length === 6 && !isSameAsPermanent) {
                fetchAddressByPinCode(value);
            }
        }
    };

    const addNominee = () => {
        // First check if required fields are filled
        const requiredFields = [
            currentNominee.details.nomineeSalutation,
            currentNominee.details.nomineeFirstName,
            currentNominee.details.nomineeLastName,
            currentNominee.details.nomineeRelation,
            currentNominee.details.nomineePercentage,
            currentNominee.details.nomineeDOB,
            currentNominee.address.nomineeComplexName,
            currentNominee.address.nomineeBuildingName,
            currentNominee.address.nomineeArea,
            currentNominee.address.nomineeCountry,
            currentNominee.address.nomineePinCode
        ];

        if (requiredFields.some(field => !field)) {
            Swal.fire({
                icon: 'error',
                title: 'Incomplete Form',
                text: 'Please fill all required fields before adding nominee.'
            });
            return;
        }
        
        if (/\d/.test(currentNominee.details.nomineeFirstName) ||
            /\d/.test(currentNominee.details.nomineeMiddleName) ||
            /\d/.test(currentNominee.details.nomineeLastName)
        ) {
            Swal.fire({
                icon: 'error',
                text: 'Nominee name fields should contain only alphabets. Numbers are not allowed.',
            });
            return;
        }

        // Then check for validation errors
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

        const remainingPercentage = getRemainingPercentage();
        const currentPercentage = parseFloat(currentNominee.details.nomineePercentage);

        if (remainingPercentage <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Percentage Exhausted',
                text: 'All your percentage value (100%) has been used'
            });
            return;
        }

        if (currentPercentage > remainingPercentage) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Percentage',
                text: `You can only allocate up to ${remainingPercentage}% for this nominee`
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
        const remainingPercentage = getRemainingPercentage();
        setCurrentNominee({
            details: {
                nomineeSalutation: '',
                nomineeFirstName: '',
                nomineeMiddleName: '',
                nomineeLastName: '',
                nomineeRelation: '',
                nomineePercentage:  '0',
                // nomineePercentage: remainingPercentage > 0 ? remainingPercentage.toString() : '0',
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
        setIsSameAsPermanent(false);
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

        // Check if total percentage is exactly 100
        const totalPercentage = nominees.reduce((sum, nominee) => sum + parseFloat(nominee.details.nomineePercentage), 0);
        if (totalPercentage !== 100) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Total Percentage',
                text: `Total percentage must be exactly 100% (current: ${totalPercentage}%)`
            });
            return;
        }
   
        try {
            // Prepare nominees array for API
            const nomineesPayload = nominees.map(nominee => ({
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
            }));

            // Send all nominees in one request
            await createAccountService.accountNominee_s5b({
                application_id: storedId,
                nominees: nomineesPayload
            });

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

    const handleSameAddressToggle = async (e) => {
        const isChecked = e.target.checked;
        setIsSameAsPermanent(isChecked);
        
        if (isChecked) {
            try {
                const response = await applicationDetailsService.getFullDetails(storedId);
                if (response.data) {
                    const { application_addresss } = response.data;
                    const address = Array.isArray(application_addresss) ? application_addresss[0] : application_addresss;
                    
                    setCurrentNominee(prev => ({
                        ...prev,
                        address: {
                            ...prev.address,
                            nomineeComplexName: address.per_complex_name,
                            nomineeBuildingName: address.per_flat_no,
                            nomineeArea: address.per_area,
                            nomineeLandmark: address.per_landmark || '',
                            nomineeCountry: address.per_country,
                            nomineePinCode: address.per_pincode,
                            nomineeCity: address.per_city,
                            nomineeDistrict: address.per_district,
                            nomineeState: address.per_state
                        }
                    }));
                }
            } catch (error) {
                console.error('Error fetching address details:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch permanent address details'
                });
            }
        } else {
            // Clear address fields when unchecked
            setCurrentNominee(prev => ({
                ...prev,
                address: {
                    ...prev.address,
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
            }));
        }
    };

    useEffect(() => {
        saveToLocalStorage({
            nominees,
            currentNominee
        });
    }, [nominees, currentNominee]);

    return (
        <div className="max-w-screen-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Add Nominee Details</h2>
            {/* Nominee Form */}
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 mb-3">
                <SelectField
                    label="Salutation"
                    name="nomineeSalutation"
                    value={currentNominee.details.nomineeSalutation}
                    onChange={(e) => handleChange('details', e)}
                    required
                    options={salutation}
                    error={errors.nomineeSalutation}
                />
                <InputField
                    label="First Name"
                    name="nomineeFirstName"
                    value={currentNominee.details.nomineeFirstName}
                    onChange={(e) => handleChange('details', e)}
                    required
                    max={50}
                    error={errors.nomineeFirstName}
                />
                <InputField
                    label="Middle Name"
                    name="nomineeMiddleName"
                    value={currentNominee.details.nomineeMiddleName}
                    onChange={(e) => handleChange('details', e)}
                    max={50}
                    error={errors.nomineeMiddleName}
                />
                <InputField
                    label="Last Name"
                    name="nomineeLastName"
                    value={currentNominee.details.nomineeLastName}
                    onChange={(e) => handleChange('details', e)}
                    required
                    max={50}
                    error={errors.nomineeLastName}
                />
                <SelectField
                    label="Relation"
                    name="nomineeRelation"
                    value={currentNominee.details.nomineeRelation}
                    onChange={(e) => handleChange('details', e)}
                    required
                    options={relation}
                    error={errors.nomineeRelation}
                />
                <InputField
                    label={`Percentage (Remaining: ${getRemainingPercentage()}%)`}
                    name="nomineePercentage"
                    value={currentNominee.details.nomineePercentage}
                    onChange={(e) => handleChange('details', e)}
                    required
                    max={3}
                    error={errors.nomineePercentage}
                />
                <InputField
                    label="Date of Birth"
                    name="nomineeDOB"
                    type="date"
                    value={currentNominee.details.nomineeDOB}
                    onChange={(e) => handleChange('details', e)}
                    required
                    error={errors.nomineeDOB}
                />
                <InputField
                    label="Age"
                    name="nomineeAge"
                    value={currentNominee.details.nomineeAge}
                    onChange={(e) => handleChange('details', e)}
                    required
                    max={3}
                    error={errors.nomineeAge}
                    disabled={true}
                />
            </div>

            <div className='flex items-center mb-2'>
                <h2 className="text-xl font-bold m-0">Nominee Address</h2>&emsp;
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        id="sameAsPermanent" 
                        className="me-2" 
                        checked={isSameAsPermanent}
                        onChange={handleSameAddressToggle}
                    />
                    <label htmlFor="sameAsPermanent">Same as permanent address</label>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 mb-6">
                <InputField
                    label="Complex Name"
                    name="nomineeComplexName"
                    value={currentNominee.address.nomineeComplexName}
                    onChange={(e) => handleChange('address', e)}
                    required
                    max={50}
                    error={errors.nomineeComplexName}
                    disabled={isSameAsPermanent}
                />
                <InputField
                    label="Building Name"
                    name="nomineeBuildingName"
                    value={currentNominee.address.nomineeBuildingName}
                    onChange={(e) => handleChange('address', e)}
                    required
                    max={20}
                    error={errors.nomineeBuildingName}
                    disabled={isSameAsPermanent}
                />
                <InputField
                    label="Area"
                    name="nomineeArea"
                    value={currentNominee.address.nomineeArea}
                    onChange={(e) => handleChange('address', e)}
                    required
                    max={50}
                    error={errors.nomineeArea}
                    disabled={isSameAsPermanent}
                />
                <InputField
                    label="Landmark"
                    name="nomineeLandmark"
                    value={currentNominee.address.nomineeLandmark}
                    onChange={(e) => handleChange('address', e)}
                    max={50}
                    error={errors.nomineeLandmark}
                    disabled={isSameAsPermanent}
                />
                <InputField
                    label="Country"
                    name="nomineeCountry"
                    value={currentNominee.address.nomineeCountry}
                    onChange={(e) => handleChange('address', e)}
                    required
                    max={30}
                    error={errors.nomineeCountry}
                    disabled={isSameAsPermanent}
                />
                <InputField
                    label="Pin Code"
                    name="nomineePinCode"
                    value={currentNominee.address.nomineePinCode}
                    onChange={(e) => handleChange('address', e)}
                    required
                    max={6}
                    error={errors.nomineePinCode}
                    disabled={isSameAsPermanent || isFetchingPincode}
                />
                <InputField
                    label="State"
                    name="nomineeState"
                    value={currentNominee.address.nomineeState}
                    onChange={(e) => handleChange('address', e)}
                    required
                    disabled={true}
                />
                <InputField
                    label="City"
                    name="nomineeCity"
                    value={currentNominee.address.nomineeCity}
                    onChange={(e) => handleChange('address', e)}
                    required
                    disabled={true}
                />
                <InputField
                    label="District"
                    name="nomineeDistrict"
                    value={currentNominee.address.nomineeDistrict}
                    onChange={(e) => handleChange('address', e)}
                    required
                    disabled={true}
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

            <div className="next-back-btns z-10">
                <CommonButton onClick={onBack} variant="outlined" className="btn-back">
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton onClick={submitnomini} variant="contained" className="btn-next">
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div>
        </div>
    );
}

export default NominationForm;

const STORAGE_KEY = 'nominationFormData';

const saveToLocalStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromLocalStorage = (storedId) => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  max,
  error,
  disabled = false,
  validationType,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const shouldFloat = isFocused || value;

  const handleBlur = () => {
    setIsFocused(false);
    setTouched(true);
  };

  return (
    <div className={clsx('floating-input-height relative w-full border border-gray-300 dark:border-gray-700 rounded-md')}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        required={required}
        className={clsx(
          'peer block w-full bg-transparent px-4 py-2 text-sm rounded-md',
          'transition-all',
          {
            'border-red-500': error && touched,
            'bg-gray-100 cursor-not-allowed': disabled
          }
        )}
        placeholder={label}
        maxLength={max}
        disabled={disabled}
        {...rest}
      />
      <label
        htmlFor={name}
        className={clsx(
          'absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-300 transition-all duration-200 pointer-events-none',
          {
            'bg-white dark:bg-gray-900 px-1 text-xs -translate-y-4': shouldFloat,
            'bg-white dark:bg-gray-900 w-9/12 text-gray-500 dark:text-gray-200 translate-y-0.5': !shouldFloat,
          }
        )}
      >
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {error && touched && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

const SelectField = ({
  label,
  name,
  value,
  onChange,
  required = false,
  options,
  error,
  disabled = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [touched, setTouched] = useState(false);

  const shouldFloat = isFocused || value;

  const handleBlur = () => {
    setIsFocused(false);
    setTouched(true);
  };

  return (
    <div className={clsx(' floating-input-height relative w-full border border-gray-300 dark:border-gray-700 rounded-md')}>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        required={required}
        className={clsx(
          'peer block w-full bg-transparent px-4 py-2 text-sm rounded-md',
          'transition-all',
          {
            'border-red-500': error && touched,
            'bg-gray-100 cursor-not-allowed': disabled
          }
        )}
        disabled={disabled}
        {...rest}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label
        htmlFor={name}
        className={clsx(
          'absolute left-3 top-2 text-sm text-gray-500 dark:text-gray-300 transition-all duration-200 pointer-events-none',
          {
            'bg-white dark:bg-gray-900 px-1 text-xs -translate-y-4': shouldFloat,
            'bg-white dark:bg-gray-900 w-9/12 text-gray-500 dark:text-gray-200 translate-y-0.5': !shouldFloat,
          }
        )}
      >
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {error && touched && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};