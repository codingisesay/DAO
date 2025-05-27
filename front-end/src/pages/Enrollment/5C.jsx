import React, { useState, useEffect } from 'react';
import CommanInput from '../../components/CommanInput';
import CommanCheckbox from '../../components/CommanCheckbox';
import labels from '../../components/labels';
import CommonButton from '../../components/CommonButton';
import { serviceToCustomerService } from '../../services/apiServices';
import Swal from 'sweetalert2';

function BankFacility({ formData, updateFormData, onBack, onNext }) {
    const [localFormData, setLocalFormData] = useState({
        eBankingServices: formData.bankFacility?.eBankingServices || {
            atmCard: false,
            upi: false,
            internetBanking: false,
            imps: false
        },
        creditFacilities: formData.bankFacility?.creditFacilities || {
            consumerLoan: false,
            homeLoan: false,
            businessLoan: false,
            educationLoan: false,
            carLoan: false,
            staff: false,
            relativeFriend: false,
            other: false
        },
        otherFacilityText: formData.bankFacility?.otherFacilityText || ''
    });

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
            // Prepare the payload
            const payload = {
                // If application_id is hardcoded in backend, you can omit it
                banking_services_id: 1, // Replace with your actual field
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

    return (
        <div className="mx-auto">
            <h2 className="text-xl font-bold mb-2">E-Banking Services</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-3">
                <CommanCheckbox
                    label={labels.atmCard.label}
                    name="atmCard"
                    checked={localFormData.eBankingServices.atmCard}
                    onChange={handleEBankingChange}
                />
                <CommanCheckbox
                    label={labels.upi.label}
                    name="upi"
                    checked={localFormData.eBankingServices.upi}
                    onChange={handleEBankingChange}
                />
                <CommanCheckbox
                    label={labels.internetBanking.label}
                    name="internetBanking"
                    checked={localFormData.eBankingServices.internetBanking}
                    onChange={handleEBankingChange}
                />
                <CommanCheckbox
                    label={labels.imps.label}
                    name="imps"
                    checked={localFormData.eBankingServices.imps}
                    onChange={handleEBankingChange}
                />
            </div>
            <br />
            <h2 className="text-xl font-bold mb-2">Existing Credit Facilities, If any</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-3">
                <CommanCheckbox
                    label={labels.consumerLoan.label}
                    name="consumerLoan"
                    checked={localFormData.creditFacilities.consumerLoan}
                    onChange={handleCreditFacilityChange}
                />
                <CommanCheckbox
                    label={labels.homeLoan.label}
                    name="homeLoan"
                    checked={localFormData.creditFacilities.homeLoan}
                    onChange={handleCreditFacilityChange}
                />
                <CommanCheckbox
                    label={labels.businessLoan.label}
                    name="businessLoan"
                    checked={localFormData.creditFacilities.businessLoan}
                    onChange={handleCreditFacilityChange}
                />
                <CommanCheckbox
                    label={labels.educationLoan.label}
                    name="educationLoan"
                    checked={localFormData.creditFacilities.educationLoan}
                    onChange={handleCreditFacilityChange}
                />
                <CommanCheckbox
                    label={labels.carLoan.label}
                    name="carLoan"
                    checked={localFormData.creditFacilities.carLoan}
                    onChange={handleCreditFacilityChange}
                />
                <CommanCheckbox
                    label={labels.staff.label}
                    name="staff"
                    checked={localFormData.creditFacilities.staff}
                    onChange={handleCreditFacilityChange}
                />
                <CommanCheckbox
                    label={labels.relativeFriend.label}
                    name="relativeFriend"
                    checked={localFormData.creditFacilities.relativeFriend}
                    onChange={handleCreditFacilityChange}
                />
                <CommanCheckbox
                    label={labels.other.label}
                    name="other"
                    checked={localFormData.creditFacilities.other}
                    onChange={handleCreditFacilityChange}
                />
                {localFormData.creditFacilities.other && (
                    <div className="md:col-span-4">
                        <CommanInput
                            label={labels.otherFacilityText.label}
                            name="otherFacilityText"
                            value={localFormData.otherFacilityText}
                            onChange={handleOtherFacilityTextChange}
                        />
                    </div>
                )}
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