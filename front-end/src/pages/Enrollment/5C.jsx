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
    const [bankingServices, setBankingServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [localFormData, setLocalFormData] = useState({
        eBankingServices: formData.bankFacility?.eBankingServices || {},
        creditFacilities: formData.bankFacility?.creditFacilities || {},
        otherFacilityText: formData.bankFacility?.otherFacilityText || ''
    });

    useEffect(() => {
        const fetchBankingServices = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/agent/bankingServices');
                setBankingServices(response.data.data);

                // Initialize form data with all facilities as unchecked if not already set
                const initialEBankingServices = {};
                const initialCreditFacilities = {};

                response.data.data.forEach(item => {
                    if (item.service_id === 1) { // E-Banking Services
                        const facilityKey = item.facility_name.toLowerCase().replace(/ /g, '');
                        initialEBankingServices[facilityKey] = formData.bankFacility?.eBankingServices?.[facilityKey] || false;
                    } else if (item.service_id === 2) { // Credit Facilities
                        const facilityKey = item.facility_name.toLowerCase().replace(/ /g, '');
                        initialCreditFacilities[facilityKey] = formData.bankFacility?.creditFacilities?.[facilityKey] || false;
                    }
                });

                setLocalFormData(prev => ({
                    ...prev,
                    eBankingServices: initialEBankingServices,
                    creditFacilities: initialCreditFacilities
                }));

                setLoading(false);
            } catch (error) {
                console.error('Error fetching banking services:', error);
                setLoading(false);
            }
        };

        fetchBankingServices();
    }, []);

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
        try {
            // Get all selected facility IDs
            const selectedFacilityIds = getSelectedFacilityIds();

            // Prepare the payload
            const payload = {
                application_id: Number(storedId),
                banking_services_facilities_id: selectedFacilityIds
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

    if (loading) {
        return <div>Loading banking services...</div>;
    }

    // Group facilities by service type
    const eBankingFacilities = bankingServices.filter(item => item.service_id === 1);
    const creditFacilities = bankingServices.filter(item => item.service_id === 2);

    return (
        <div className="mx-auto">
            <h2 className="text-xl font-bold mb-2">E-Banking Services</h2>
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
                {creditFacilities.map(facility => {
                    const facilityKey = facility.facility_name.toLowerCase().replace(/ /g, '');
                    return (
                        <React.Fragment key={facility.facility_id}>
                            <CommanCheckbox
                                label={facility.facility_name}
                                name={facilityKey}
                                checked={localFormData.creditFacilities[facilityKey] || false}
                                onChange={handleCreditFacilityChange}
                            />
                            {facilityKey === 'others' && localFormData.creditFacilities.others && (
                                <div className="md:col-span-4">
                                    <CommanInput
                                        label={labels.otherFacilityText.label}
                                        name="otherFacilityText"
                                        value={localFormData.otherFacilityText}
                                        onChange={handleOtherFacilityTextChange}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>





            <div className="next-back-btns z-10" >{/* z-10 */}
                <CommonButton onClick={onBack} variant="outlined" className="btn-back">
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton onClick={submitServiceToCustomer} variant="contained" className="btn-next">
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div>











            {/* <div className="flex justify-between mt-6 z-10" style={{ zIndex: '999' }}>
                <CommonButton onClick={onBack} variant="outlined">
                    Back
                </CommonButton>
                <CommonButton onClick={submitServiceToCustomer} variant="contained">
                    Save & Continue
                </CommonButton>
            </div> */}
        </div>
    );
}

export default BankFacility;

