import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import CommanCheckbox from '../../components/CommanCheckbox';
import { useParams } from 'react-router-dom';
import labels from '../../components/labels';
import { serviceToCustomerService, createAccountService, pendingAccountData } from '../../services/apiServices';
import Swal from 'sweetalert2';
import CommonButton from '../../components/CommonButton';   

function BankFacility({ formData, updateFormData, onBack, onNext }) {

    const { id } = useParams();
    const [bankingServices, setBankingServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFacilities, setSelectedFacilities] = useState([]);

    const [localFormData, setLocalFormData] = useState({
        eBankingServices: formData.bankFacility?.eBankingServices || {},
        creditFacilities: formData.bankFacility?.creditFacilities || {},
        otherFacilityText: formData.bankFacility?.otherFacilityText || ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all available banking services
                const servicesResponse = await createAccountService.getBankingFacilitiesService();
                setBankingServices(servicesResponse.data);

                // Fetch user's selected services
                const selectedResponse = await pendingAccountData.getDetailsS5C(id);
                const selectedIds = selectedResponse.services.map(service => service.banking_services_facilities_id);
                setSelectedFacilities(selectedIds);

                // Initialize form data with user's selections
                const initialEBanking = {};
                const initialCredit = {};

                servicesResponse.data.forEach(item => {
                    const facilityKey = item.facility_name.toLowerCase().replace(/ /g, '');
                    const isSelected = selectedIds.includes(item.facility_id);

                    if (item.service_id === 1) { // E-Banking Services
                        initialEBanking[facilityKey] = isSelected || 
                            formData.bankFacility?.eBankingServices?.[facilityKey] || 
                            false;
                    } else if (item.service_id === 2) { // Credit Facilities
                        initialCredit[facilityKey] = isSelected || 
                            formData.bankFacility?.creditFacilities?.[facilityKey] || 
                            false;
                    }
                });

                setLocalFormData({
                    eBankingServices: initialEBanking,
                    creditFacilities: initialCredit,
                    otherFacilityText: formData.bankFacility?.otherFacilityText || ''
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                Swal.fire('Error', 'Failed to load banking services', 'error');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);
 
    if (loading) {
        return <div>Loading banking services...</div>;
    }

    // Filter facilities by service type
    const eBankingFacilities = bankingServices.filter(item => item.service_id === 1);
    const creditFacilitiesList = bankingServices.filter(item => item.service_id === 2);

    return (
        <div className="mx-auto">
            <h2 className="text-xl font-bold mb-2">E-Banking Services</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
                {eBankingFacilities.map(facility => {
                    const facilityKey = facility.facility_name.toLowerCase().replace(/ /g, '');
                    return (
                        <CommanCheckbox
                            key={facility.facility_id}
                            label={facility.facility_name}
                            name={facilityKey}
                            checked={localFormData.eBankingServices[facilityKey] || false} 
                        />
                    );
                })}
            </div>
            <br />
            <h2 className="text-xl font-bold mb-2">Existing Credit Facilities, If any</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
                {creditFacilitiesList.map(facility => {
                    const facilityKey = facility.facility_name.toLowerCase().replace(/ /g, '');
                    return (
                        <React.Fragment key={facility.facility_id}>
                            <CommanCheckbox
                                label={facility.facility_name}
                                name={facilityKey}
                                checked={localFormData.creditFacilities[facilityKey] || false} 
                            />
                            {facilityKey === 'others' && localFormData.creditFacilities.others && (
                                <div className="md:col-span-4">
                                    <CommanInput
                                        label={labels.otherFacilityText.label}
                                        name="otherFacilityText"
                                        value={localFormData.otherFacilityText} 
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

         
        </div>
    );
}

export default BankFacility;



// import React, { useState, useEffect } from 'react';
// import CommanInput from '../../components/CommanInput';
// import CommanCheckbox from '../../components/CommanCheckbox';
// import labels from '../../components/labels';
// import { serviceToCustomerService , createAccountService} from '../../services/apiServices';
// import axios from 'axios';

// function BankFacility() {
//     const [bankingServices, setBankingServices] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedFacilities, setSelectedFacilities] = useState([]);

//     const [eBankingServices, setEBankingServices] = useState({
//         atmCard: false,
//         upi: false,
//         internetBanking: false,
//         imps: false
//     });

//     const [creditFacilities, setCreditFacilities] = useState({
//         consumerLoan: false,
//         homeLoan: false,
//         businessLoan: false,
//         educationLoan: false,
//         carLoan: false,
//         staff: false,
//         relativeFriend: false,
//         other: false
//     });

//     const [otherFacilityText, setOtherFacilityText] = useState('');

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetch all banking services
//                 //  const response = await createAccountService.getBankingFacilitiesService();
//                 const servicesResponse = await createAccountService.getBankingFacilitiesService();
//                 setBankingServices(servicesResponse.data);

//                 // Fetch selected services for application ID 29
//                 const selectedResponse = await createAccountService.getBankingFacilitiesService();
//                 const selectedIds = selectedResponse.services.map(service => service.banking_services_facilities_id);
//                 setSelectedFacilities(selectedIds);

//                 // Initialize checkboxes based on selected facilities
//                 const initialEBanking = {};
//                 const initialCredit = {};

//                 servicesResponse.data.forEach(item => {
//                     const isSelected = selectedIds.includes(item.facility_id);
//                     const facilityKey = item.facility_name.toLowerCase().replace(/ /g, '');

//                     if (item.service_id === 1) { // E-Banking Services
//                         initialEBanking[facilityKey] = isSelected;
//                     } else if (item.service_id === 2) { // Credit Facilities
//                         initialCredit[facilityKey] = isSelected;
//                     }
//                 });

//                 setEBankingServices(initialEBanking);
//                 setCreditFacilities(initialCredit);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, []);

//     const handleEBankingChange = (e) => {
//         const { name, checked } = e.target;
//         setEBankingServices(prev => ({
//             ...prev,
//             [name]: checked
//         }));
//     };

//     const handleCreditFacilityChange = (e) => {
//         const { name, checked } = e.target;
//         setCreditFacilities(prev => ({
//             ...prev,
//             [name]: checked
//         }));
//     };

//     if (loading) {
//         return <div>Loading banking services...</div>;
//     }

//     // Filter facilities by service type
//     const eBankingFacilities = bankingServices.filter(item => item.service_id === 1);
//     const creditFacilitiesList = bankingServices.filter(item => item.service_id === 2);

//     return (
//         <div className="mx-auto">
//             <h2 className="text-xl font-bold mb-2">E-Banking Services</h2>
//             <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
//                 {eBankingFacilities.map(facility => {
//                     const facilityKey = facility.facility_name.toLowerCase().replace(/ /g, '');
//                     return (
//                         <CommanCheckbox
//                             key={facility.facility_id}
//                             label={facility.facility_name}
//                             name={facilityKey}
//                             checked={eBankingServices[facilityKey] || false}
//                             onChange={handleEBankingChange}
//                         />
//                     );
//                 })}
//             </div>
//             <br />
//             <h2 className="text-xl font-bold mb-2">Existing Credit Facilities, If any</h2>
//             <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
//                 {creditFacilitiesList.map(facility => {
//                     const facilityKey = facility.facility_name.toLowerCase().replace(/ /g, '');
//                     return (
//                         <React.Fragment key={facility.facility_id}>
//                             <CommanCheckbox
//                                 label={facility.facility_name}
//                                 name={facilityKey}
//                                 checked={creditFacilities[facilityKey] || false}
//                                 onChange={handleCreditFacilityChange}
//                             />
//                             {facilityKey === 'other' && creditFacilities.other && (
//                                 <div className="md:col-span-4">
//                                     <CommanInput
//                                         label={labels.otherFacilityText.label}
//                                         name="otherFacilityText"
//                                         value={otherFacilityText}
//                                         onChange={(e) => setOtherFacilityText(e.target.value)}
//                                     />
//                                 </div>
//                             )}
//                         </React.Fragment>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }

// export default BankFacility;

 