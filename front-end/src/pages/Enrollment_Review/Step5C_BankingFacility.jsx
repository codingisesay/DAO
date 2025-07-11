import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import CommanCheckbox from '../../components/CommanCheckbox';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { agentService , createAccountService, pendingAccountData} from '../../services/apiServices';
import Swal from 'sweetalert2'; import { useParams } from 'react-router-dom';
import { apiService } from '../../utils/storage';

function BankFacility({ formData, updateFormData, onBack, onNext }) {
    const storedId = localStorage.getItem('application_id');
    const [bankingServices, setBankingServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialSelectedFacilities, setInitialSelectedFacilities] = useState([]); 
    const [reason, setReason] = useState(null);   const {id}=useParams();
    const [localFormData, setLocalFormData] = useState({
        eBankingServices: formData.bankFacility?.eBankingServices || {},
        creditFacilities: formData.bankFacility?.creditFacilities || {},
        otherFacilityText: formData.bankFacility?.otherFacilityText || ''
    });

    useEffect(() => {
        const fetchBankingServices = async () => {
            try {
                // Fetch available banking services
                const servicesResponse = await createAccountService.getBankingFacilitiesService();
                setBankingServices(servicesResponse.data);

                // Fetch user's selected services
                const userSelectionResponse = await pendingAccountData.getDetailsS5C(storedId);
                const userSelectedIds = userSelectionResponse.services.map(
                    service => service.banking_services_facilities_id
                );
                setInitialSelectedFacilities(userSelectedIds);

                // Initialize form data with user's selections
                const initialEBankingServices = {};
                const initialCreditFacilities = {};

                servicesResponse.data.forEach(item => {
                    const facilityKey = item.facility_name.toLowerCase().replace(/ /g, '');
                    const isInitiallySelected = userSelectedIds.includes(item.facility_id);

                    if (item.service_id === 1) { // E-Banking Services
                        initialEBankingServices[facilityKey] = isInitiallySelected || 
                            formData.bankFacility?.eBankingServices?.[facilityKey] || 
                            false;
                    } else if (item.service_id === 2) { // Credit Facilities
                        initialCreditFacilities[facilityKey] = isInitiallySelected || 
                            formData.bankFacility?.creditFacilities?.[facilityKey] || 
                            false;
                    }
                });

                setLocalFormData({
                    eBankingServices: initialEBankingServices,
                    creditFacilities: initialCreditFacilities,
                    otherFacilityText: formData.bankFacility?.otherFacilityText || ''
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching banking services:', error);
                setLoading(false);
            }
        };

        fetchBankingServices();
    }, [storedId]);
   useEffect(() => {     
        const fetchReason = async (id) => { 
            if (!id) return;
            try {
                setLoading(true);
                const response = await agentService.refillApplication(id); 
                setReason(response.data[0]);
            } catch (error) {
                console.error("Failed to fetch review applications:", error);
            } finally {
                setLoading(false);
            }
        };
     
        fetchReason(id);
    }, [id]); 
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

    const getSelectedFacilityIds = () => {
        const selectedIds = [];

        // Check eBankingServices
        bankingServices.forEach(item => {
            if (item.service_id === 1) {
                const facilityKey = item.facility_name.toLowerCase().replace(/ /g, '');
                if (localFormData.eBankingServices[facilityKey]) {
                    selectedIds.push(item.facility_id);
                }
            }
        });

        // Check creditFacilities
        bankingServices.forEach(item => {
            if (item.service_id === 2) {
                const facilityKey = item.facility_name.toLowerCase().replace(/ /g, '');
                if (localFormData.creditFacilities[facilityKey]) {
                    selectedIds.push(item.facility_id);
                }
            }
        });

        return selectedIds;
    };
const submitServiceToCustomer = async () => {
    // Validation for "Others"
    // if (
    //     localFormData.creditFacilities.others && 
    //     (!localFormData.otherFacilityText || localFormData.otherFacilityText.trim() === "")
    // ) {
    //     Swal.fire({
    //         icon: 'warning',
    //         title: 'Other Facility Required',
    //         text: 'Please specify the other credit facility before proceeding.'
    //     });
    //     return; // Stop submission
    // }

    try {
        // Get all selected facility IDs
        const selectedFacilityIds = getSelectedFacilityIds();

        // Prepare the payload
        const payload = {
            application_id: Number(storedId),
            banking_services_facilities_id: selectedFacilityIds
        };

        const response = await createAccountService.serviceToCustomer_s5c(payload);

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

    if (loading) {
        return <div>Loading banking services...</div>;
    }

    // Group facilities by service type
    const eBankingFacilities = bankingServices.filter(item => item.service_id === 1);
    const creditFacilities = bankingServices.filter(item => item.service_id === 2);

    return (
        <div className="mx-auto">
            <h2 className="text-xl font-bold mb-2">E-Banking Services</h2>
            {reason &&  <p className="text-red-500 mb-3 " > Review For :{ reason.application_service_status_status_comment}</p> }
            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-5">
                {eBankingFacilities.map(facility => {
                    const facilityKey = facility.facility_name.toLowerCase().replace(/ /g, '');
                    return (
                        <CommanCheckbox
                            key={facility.facility_id}
                            label={facility.facility_name}
                            name={facilityKey}
                            checked={localFormData.eBankingServices[facilityKey] || false}
                            onChange={handleEBankingChange}
                        />
                    );
                })}
            </div>
            <br />
            <h2 className="text-xl font-bold mb-2">Existing Credit Facilities, If any</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-5">
           {creditFacilities
                .filter(facility => facility.facility_name.toLowerCase().replace(/ /g, '') !== 'others')
                .map(facility => {
                    const facilityKey = facility.facility_name.toLowerCase().replace(/ /g, '');
                    return (
                        <React.Fragment key={facility.facility_id}>
                            <CommanCheckbox
                                label={facility.facility_name}
                                name={facilityKey}
                                checked={localFormData.creditFacilities[facilityKey] || false}
                                onChange={handleCreditFacilityChange}
                            />
                        </React.Fragment>
                    );
                })}
            </div>

            <div className="next-back-btns z-10">
                <CommonButton onClick={onBack} variant="outlined" className="btn-back">
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton onClick={submitServiceToCustomer} variant="contained" className="btn-next">
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div>
        </div>
    );
}

export default BankFacility;

 