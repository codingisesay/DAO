import React, { useState } from 'react';
import CommanInput from '../../components/CommanInput';
import CommanCheckbox from '../../components/CommanCheckbox';
import labels from '../../components/labels';
function BankFacility() {
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

    return (
        <div className="mx-auto">
            <h2 className="text-xl font-bold mb-2">E-Banking Services</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-3">
                <CommanCheckbox
                    label={labels.atmCard.label}
                    name="atmCard"
                    checked={eBankingServices.atmCard}
                    onChange={handleEBankingChange}
                />
                <CommanCheckbox
                    label={labels.upi.label}
                    name="upi"
                    checked={eBankingServices.upi}
                    onChange={handleEBankingChange}
                />
                <CommanCheckbox
                    label={labels.internetBanking.label}
                    name="internetBanking"
                    checked={eBankingServices.internetBanking}
                    onChange={handleEBankingChange}
                />
                <CommanCheckbox
                    label={labels.imps.label}
                    name="imps"
                    checked={eBankingServices.imps}
                    onChange={handleEBankingChange}
                />
            </div>
            <br />
            <h2 className="text-xl font-bold mb-2">Existing Credit Facilities, If any</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-3">
                <CommanCheckbox
                    label={labels.consumerLoan.label}
                    name="consumerLoan"
                    checked={creditFacilities.consumerLoan}
                    onChange={handleCreditFacilityChange}
                />
                <CommanCheckbox
                    label={labels.homeLoan.label}
                    name="homeLoan"
                    checked={creditFacilities.homeLoan}
                    onChange={handleCreditFacilityChange}
                />
                <CommanCheckbox
                    label={labels.businessLoan.label}
                    name="businessLoan"
                    checked={creditFacilities.businessLoan}
                    onChange={handleCreditFacilityChange}
                />
                <CommanCheckbox
                    label={labels.educationLoan.label}
                    name="educationLoan"
                    checked={creditFacilities.educationLoan}
                    onChange={handleCreditFacilityChange}
                />
                <CommanCheckbox
                    label={labels.carLoan.label}
                    name="carLoan"
                    checked={creditFacilities.carLoan}
                    onChange={handleCreditFacilityChange}
                />
                <CommanCheckbox
                    label={labels.staff.label}
                    name="staff"
                    checked={creditFacilities.staff}
                    onChange={handleCreditFacilityChange}
                />
                <CommanCheckbox
                    label={labels.relativeFriend.label}
                    name="relativeFriend"
                    checked={creditFacilities.relativeFriend}
                    onChange={handleCreditFacilityChange}
                />
                <CommanCheckbox
                    label={labels.other.label}
                    name="other"
                    checked={creditFacilities.other}
                    onChange={handleCreditFacilityChange}
                />
                {creditFacilities.other && (
                    <div className="md:col-span-4">
                        <CommanInput
                            label={labels.otherFacilityText.label}
                            name="otherFacilityText"
                            value={otherFacilityText}
                            onChange={(e) => setOtherFacilityText(e.target.value)}
                        />
                    </div>
                )}
            </div>
        </div>

    );
}

export default BankFacility;