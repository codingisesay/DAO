import React, { useState } from 'react';
import FloatingInput from '../../components/FloatingInput';
import CheckboxInput from '../../components/CheckboxInput';

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
        <div className="  mx-auto">
            <h2 className="text-xl font-bold mb-2">E-Banking Services</h2>
            <div className="grid md:grid-cols-4 gap-4">
                <CheckboxInput
                    label="ATM Card"
                    name="atmCard"
                    checked={eBankingServices.atmCard}
                    onChange={handleEBankingChange}
                />
                <CheckboxInput
                    label="UPI"
                    name="upi"
                    checked={eBankingServices.upi}
                    onChange={handleEBankingChange}
                />
                <CheckboxInput
                    label="Internet Banking"
                    name="internetBanking"
                    checked={eBankingServices.internetBanking}
                    onChange={handleEBankingChange}
                />
                <CheckboxInput
                    label="IMPS"
                    name="imps"
                    checked={eBankingServices.imps}
                    onChange={handleEBankingChange}
                />
            </div>

            <h2 className="text-xl font-bold mb-2">Existing Credit Facilities, If any</h2>
            <div className="grid md:grid-cols-4 gap-4">
                <CheckboxInput
                    label="Consumer Loan"
                    name="consumerLoan"
                    checked={creditFacilities.consumerLoan}
                    onChange={handleCreditFacilityChange}
                />
                <CheckboxInput
                    label="Home Loan"
                    name="homeLoan"
                    checked={creditFacilities.homeLoan}
                    onChange={handleCreditFacilityChange}
                />
                <CheckboxInput
                    label="Business Loan"
                    name="businessLoan"
                    checked={creditFacilities.businessLoan}
                    onChange={handleCreditFacilityChange}
                />
                <CheckboxInput
                    label="Education Loan"
                    name="educationLoan"
                    checked={creditFacilities.educationLoan}
                    onChange={handleCreditFacilityChange}
                />
                <CheckboxInput
                    label="Car Loan"
                    name="carLoan"
                    checked={creditFacilities.carLoan}
                    onChange={handleCreditFacilityChange}
                />
                <CheckboxInput
                    label="Staff"
                    name="staff"
                    checked={creditFacilities.staff}
                    onChange={handleCreditFacilityChange}
                />
                <CheckboxInput
                    label="Relative/Friend"
                    name="relativeFriend"
                    checked={creditFacilities.relativeFriend}
                    onChange={handleCreditFacilityChange}
                />
                <CheckboxInput
                    label="Other"
                    name="other"
                    checked={creditFacilities.other}
                    onChange={handleCreditFacilityChange}
                />
                {creditFacilities.other && (
                    <div className="md:col-span-4">
                        <FloatingInput
                            label="Please specify other facility"
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