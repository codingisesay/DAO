
import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import CommanCheckbox from '../../components/CommanCheckbox';
import labels from '../../components/labels';
import axios from 'axios';

function BankFacility() {
    const [bankingServices, setBankingServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFacilities, setSelectedFacilities] = useState([]);

    const [eBankingServices, setEBankingServices] = useState({
        atmCard: false,
        upi: false,
        internetBanking: false,
        imps: false
    });

    const [creditFacilities, setCreditFacilities] = useState({
        consumerLoan: false,
        homeLoan: false,
        businessLoan: false,
        educationLoan: false,
        carLoan: false,
        staff: false,
        relativeFriend: false,
        other: false
    });

    const [otherFacilityText, setOtherFacilityText] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all banking services
                const servicesResponse = await axios.get('http://127.0.0.1:8000/api/agent/bankingServices');
                setBankingServices(servicesResponse.data.data);

                // Fetch selected services for application ID 29
                const selectedResponse = await axios.get('http://127.0.0.1:8000/api/admin/fetchServiceToCustomer/29');
                const selectedIds = selectedResponse.data.services.map(service => service.banking_services_facilities_id);
                setSelectedFacilities(selectedIds);

                // Initialize checkboxes based on selected facilities
                const initialEBanking = {};
                const initialCredit = {};

                servicesResponse.data.data.forEach(item => {
                    const isSelected = selectedIds.includes(item.facility_id);
                    const facilityKey = item.facility_name.toLowerCase().replace(/ /g, '');

                    if (item.service_id === 1) { // E-Banking Services
                        initialEBanking[facilityKey] = isSelected;
                    } else if (item.service_id === 2) { // Credit Facilities
                        initialCredit[facilityKey] = isSelected;
                    }
                });

                setEBankingServices(initialEBanking);
                setCreditFacilities(initialCredit);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEBankingChange = (e) => {
        const { name, checked } = e.target;
        setEBankingServices(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleCreditFacilityChange = (e) => {
        const { name, checked } = e.target;
        setCreditFacilities(prev => ({
            ...prev,
            [name]: checked
        }));
    };

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
                            checked={eBankingServices[facilityKey] || false}
                            onChange={handleEBankingChange}
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
                                checked={creditFacilities[facilityKey] || false}
                                onChange={handleCreditFacilityChange}
                            />
                            {facilityKey === 'other' && creditFacilities.other && (
                                <div className="md:col-span-4">
                                    <CommanInput
                                        label={labels.otherFacilityText.label}
                                        name="otherFacilityText"
                                        value={otherFacilityText}
                                        onChange={(e) => setOtherFacilityText(e.target.value)}
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


// import React, { useState } from 'react';
// import CommanInput from '../../components/CommanInput';
// import CommanCheckbox from '../../components/CommanCheckbox';
// import labels from '../../components/labels';
// function BankFacility() {
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

//     return (
//         <div className="mx-auto">
//             <h2 className="text-xl font-bold mb-2">E-Banking Services</h2>
//             <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-5">
//                 <CommanCheckbox
//                     label={labels.atmCard.label}
//                     name="atmCard"
//                     checked={eBankingServices.atmCard}
//                     onChange={handleEBankingChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.upi.label}
//                     name="upi"
//                     checked={eBankingServices.upi}
//                     onChange={handleEBankingChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.internetBanking.label}
//                     name="internetBanking"
//                     checked={eBankingServices.internetBanking}
//                     onChange={handleEBankingChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.imps.label}
//                     name="imps"
//                     checked={eBankingServices.imps}
//                     onChange={handleEBankingChange}
//                 />
//             </div>
//             <br />
//             <h2 className="text-xl font-bold mb-2">Existing Credit Facilities, If any</h2>
//             <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2  gap-5">
//                 <CommanCheckbox
//                     label={labels.consumerLoan.label}
//                     name="consumerLoan"
//                     checked={creditFacilities.consumerLoan}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.homeLoan.label}
//                     name="homeLoan"
//                     checked={creditFacilities.homeLoan}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.businessLoan.label}
//                     name="businessLoan"
//                     checked={creditFacilities.businessLoan}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.educationLoan.label}
//                     name="educationLoan"
//                     checked={creditFacilities.educationLoan}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.carLoan.label}
//                     name="carLoan"
//                     checked={creditFacilities.carLoan}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.staff.label}
//                     name="staff"
//                     checked={creditFacilities.staff}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.relativeFriend.label}
//                     name="relativeFriend"
//                     checked={creditFacilities.relativeFriend}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 <CommanCheckbox
//                     label={labels.other.label}
//                     name="other"
//                     checked={creditFacilities.other}
//                     onChange={handleCreditFacilityChange}
//                 />
//                 {creditFacilities.other && (
//                     <div className="md:col-span-4">
//                         <CommanInput
//                             label={labels.otherFacilityText.label}
//                             name="otherFacilityText"
//                             value={otherFacilityText}
//                             onChange={(e) => setOtherFacilityText(e.target.value)}
//                         />
//                     </div>
//                 )}
//             </div>
//         </div>

//     );
// }

// export default BankFacility;