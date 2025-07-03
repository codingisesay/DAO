import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import CommanCheckbox from '../../components/CommanCheckbox';
import { useParams } from 'react-router-dom';
import labels from '../../components/labels';
import { serviceToCustomerService, createAccountService, pendingAccountData } from '../../services/apiServices';
import Swal from 'sweetalert2'; 

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
          {creditFacilitiesList
    .filter(facility => facility.facility_name.toLowerCase().replace(/ /g, '') !== 'others')
    .map(facility => {
        const facilityKey = facility.facility_name.toLowerCase().replace(/ /g, '');
        return (
            <React.Fragment key={facility.facility_id}>
                <CommanCheckbox
                    label={facility.facility_name}
                    name={facilityKey}
                    checked={localFormData.creditFacilities[facilityKey] || false} 
                />
            </React.Fragment>
        );
    })}
            </div>

         
        </div>
    );
}

export default BankFacility;

 