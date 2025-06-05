
import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import CommanCheckbox from '../../components/CommanCheckbox';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { serviceToCustomerService } from '../../services/apiServices';
import Swal from 'sweetalert2';
import axios from 'axios';

function BankFacility({ formData, updateFormData, onBack, onNext }) {
    const storedId = localStorage.getItem('application_id');
    const [isLoading, setIsLoading] = useState(true);
    const [servicesData, setServicesData] = useState([]);
    const [localFormData, setLocalFormData] = useState({
        eBankingServices: {},
        creditFacilities: {},
        otherFacilityText: formData.bankFacility?.otherFacilityText || ''
    });

    useEffect(() => {
        const fetchBankingServices = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/agent/bankingServices');

                if (response.data && Array.isArray(response.data.data)) {
                    setServicesData(response.data.data);

                    // Initialize form data from API or existing form data
                    const eBankingServicesInit = {};
                    const creditFacilitiesInit = {};

                    response.data.data.forEach(item => {
                        const facilityKey = item.facility_name.toLowerCase().replace(/ /g, '');
                        if (item.service_name === "E-Banking Services") {
                            eBankingServicesInit[facilityKey] =
                                formData.bankFacility?.eBankingServices?.[facilityKey] || false;
                        } else if (item.service_name === "Existing Credit Facilities, If any") {
                            creditFacilitiesInit[facilityKey] =
                                formData.bankFacility?.creditFacilities?.[facilityKey] || false;
                        }
                    });

                    setLocalFormData(prev => ({
                        ...prev,
                        eBankingServices: eBankingServicesInit,
                        creditFacilities: creditFacilitiesInit
                    }));
                }
            } catch (error) {
                console.error('Error fetching banking services:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load banking services'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchBankingServices();
    }, [formData]);

    const handleEBankingChange = (e) => {
        const { name, checked } = e.target;
        setLocalFormData(prev => ({
            ...prev,
            eBankingServices: {
                ...prev.eBankingServices,
                [name]: checked
            }
        }));
    };

    const handleCreditFacilityChange = (e) => {
        const { name, checked } = e.target;
        setLocalFormData(prev => ({
            ...prev,
            creditFacilities: {
                ...prev.creditFacilities,
                [name]: checked
            }
        }));
    };

    const handleOtherFacilityTextChange = (e) => {
        setLocalFormData(prev => ({
            ...prev,
            otherFacilityText: e.target.value
        }));
    };

    const submitServiceToCustomer = async () => {
        try {
            // Update parent form data
            updateFormData({
                bankFacility: {
                    ...localFormData
                }
            });

            // Prepare the payload
            const payload = {
                application_id: Number(storedId),
                banking_services_id: 1,
                // Add other fields if needed
            };

            const response = await serviceToCustomerService.create(payload);

            Swal.fire({
                icon: 'success',
                title: response.data.message || 'Service to customer saved!',
                showConfirmButton: false,
                timer: 1500
            });

            if (onNext) onNext();

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.message || 'Failed to save service to customer'
            });
        }
    };

    if (isLoading) {
        return <div className="text-center py-4">Loading banking services...</div>;
    }

    // Filter and group services by type
    const eBankingServices = servicesData.filter(item => item.service_name === "E-Banking Services");
    const creditFacilities = servicesData.filter(item => item.service_name === "Existing Credit Facilities, If any");

    return (
        <div className="mx-auto">
            <h2 className="text-xl font-bold mb-2">E-Banking Services</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-3">
                {eBankingServices.map(service => {
                    const facilityKey = service.facility_name.toLowerCase().replace(/ /g, '');
                    return (
                        <CommanCheckbox
                            key={service.facility_id}
                            label={labels[facilityKey]?.label || service.facility_name}
                            name={facilityKey}
                            checked={localFormData.eBankingServices[facilityKey] || false}
                            onChange={handleEBankingChange}
                        />
                    );
                })}
            </div>
            <br />
            <h2 className="text-xl font-bold mb-2">Existing Credit Facilities, If any</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-3">
                {creditFacilities.map(service => {
                    const facilityKey = service.facility_name.toLowerCase().replace(/ /g, '');

                    if (facilityKey === 'others') {
                        return (
                            <React.Fragment key={service.facility_id}>
                                <CommanCheckbox
                                    label={labels[facilityKey]?.label || service.facility_name}
                                    name={facilityKey}
                                    checked={localFormData.creditFacilities[facilityKey] || false}
                                    onChange={handleCreditFacilityChange}
                                />
                                {localFormData.creditFacilities[facilityKey] && (
                                    <div className="md:col-span-4">
                                        <CommanInput
                                            label={labels.otherFacilityText?.label || 'Specify other facility'}
                                            name="otherFacilityText"
                                            value={localFormData.otherFacilityText}
                                            onChange={handleOtherFacilityTextChange}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    }

                    return (
                        <CommanCheckbox
                            key={service.facility_id}
                            label={labels[facilityKey]?.label || service.facility_name}
                            name={facilityKey}
                            checked={localFormData.creditFacilities[facilityKey] || false}
                            onChange={handleCreditFacilityChange}
                        />
                    );
                })}
            </div>
            <div className="flex justify-between mt-6 z-10" style={{ zIndex: '999' }}>
                <CommonButton onClick={onBack} variant="outlined">
                    Back
                </CommonButton>
                <CommonButton onClick={submitServiceToCustomer} variant="contained">
                    Save & Continue
                </CommonButton>
            </div>
        </div>
    );
}

export default BankFacility;






// import React, { useState, useEffect } from 'react';
// import CommanInput from '../../components/CommanInput';
// import CommanCheckbox from '../../components/CommanCheckbox';
// import labels from '../../components/labels';
// import CommonButton from '../../components/CommonButton';
// import { serviceToCustomerService } from '../../services/apiServices';
// import Swal from 'sweetalert2';
// import { a } from 'framer-motion/client';

// function BankFacility({ formData, updateFormData, onBack, onNext }) {

//     const storedId = localStorage.getItem('application_id');
//     const [localFormData, setLocalFormData] = useState({
//         eBankingServices: formData.bankFacility?.eBankingServices || {
//             atmCard: false,
//             upi: false,
//             internetBanking: false,
//             imps: false
//         },
//         creditFacilities: formData.bankFacility?.creditFacilities || {
//             consumerLoan: false,
//             homeLoan: false,
//             businessLoan: false,
//             educationLoan: false,
//             carLoan: false,
//             staff: false,
//             relativeFriend: false,
//             other: false
//         },
//         otherFacilityText: formData.bankFacility?.otherFacilityText || ''
//     });

//     const handleEBankingChange = (e) => {
//         const { name, checked } = e.target;
//         setLocalFormData(prev => ({
//             ...prev,
//             eBankingServices: {
//                 ...prev.eBankingServices,
//                 [name]: checked
//             }
//         }));
//     };

//     const handleCreditFacilityChange = (e) => {
//         const { name, checked } = e.target;
//         setLocalFormData(prev => ({
//             ...prev,
//             creditFacilities: {
//                 ...prev.creditFacilities,
//                 [name]: checked
//             }
//         }));
//     };

//     const handleOtherFacilityTextChange = (e) => {
//         setLocalFormData(prev => ({
//             ...prev,
//             otherFacilityText: e.target.value
//         }));
//     };

//     const submitServiceToCustomer = async () => {
//         try {
//             // Prepare the payload
//             const payload = {
//                 // If application_id is hardcoded in backend, you can omit it
//                 application_id: Number(storedId), // Replace with your actual field
//                 banking_services_id: 1, // Replace with your actual field
//                 // Add other fields if needed
//             };

//             const response = await serviceToCustomerService.create(payload);

//             Swal.fire({
//                 icon: 'success',
//                 title: response.data.message || 'Service to customer saved!',
//                 showConfirmButton: false,
//                 timer: 1500
//             });

//             if (onNext) onNext();

//         } catch (error) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: error?.response?.data?.message || 'Failed to save service to customer'
//             });
//         }
//     };

//     return (
//         <div className="mx-auto">
//             <h2 className="text-xl font-bold mb-2">E-Banking Services</h2>
//             <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-3">
//                 <CommanCheckbox
//                     label={labels.atmCard.label}
//                     name="atmCard"
//                     checked={localFormData.eBankingServices.atmCard}
//                     onChange={handleEBankingChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.upi.label}
//                     name="upi"
//                     checked={localFormData.eBankingServices.upi}
//                     onChange={handleEBankingChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.internetBanking.label}
//                     name="internetBanking"
//                     checked={localFormData.eBankingServices.internetBanking}
//                     onChange={handleEBankingChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.imps.label}
//                     name="imps"
//                     checked={localFormData.eBankingServices.imps}
//                     onChange={handleEBankingChange}
//                 />
//             </div>
//             <br />
//             <h2 className="text-xl font-bold mb-2">Existing Credit Facilities, If any</h2>
//             <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-3">
//                 <CommanCheckbox
//                     label={labels.consumerLoan.label}
//                     name="consumerLoan"
//                     checked={localFormData.creditFacilities.consumerLoan}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.homeLoan.label}
//                     name="homeLoan"
//                     checked={localFormData.creditFacilities.homeLoan}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.businessLoan.label}
//                     name="businessLoan"
//                     checked={localFormData.creditFacilities.businessLoan}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.educationLoan.label}
//                     name="educationLoan"
//                     checked={localFormData.creditFacilities.educationLoan}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.carLoan.label}
//                     name="carLoan"
//                     checked={localFormData.creditFacilities.carLoan}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.staff.label}
//                     name="staff"
//                     checked={localFormData.creditFacilities.staff}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.relativeFriend.label}
//                     name="relativeFriend"
//                     checked={localFormData.creditFacilities.relativeFriend}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.other.label}
//                     name="other"
//                     checked={localFormData.creditFacilities.other}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 {localFormData.creditFacilities.other && (
//                     <div className="md:col-span-4">
//                         <CommanInput
//                             label={labels.otherFacilityText.label}
//                             name="otherFacilityText"
//                             value={localFormData.otherFacilityText}
//                             onChange={handleOtherFacilityTextChange}
//                         />
//                     </div>
//                 )}
//             </div>
//             <div className="flex justify-between mt-6 z-10" style={{ zIndex: '999' }}>
//                 <CommonButton onClick={onBack} variant="outlined">
//                     Back
//                 </CommonButton>
//                 <CommonButton onClick={submitServiceToCustomer} variant="contained">
//                     Save & Continue
//                 </CommonButton>
//             </div>
//         </div>
//     );
// }

// export default BankFacility;