import React, { useState } from 'react';
import CommanInput from '../../../components/CommanInput';
import CommanCheckbox from '../../../components/CommanCheckbox';
import labels from '../../../components/labels';
import CommonButton from '../../../components/CommonButton';
const Step5CBankDetails = ({
  formData,
  handleChange,
  nextStep,
  prevStep,
}) => {
  const [bankFacility, setBankFacility] = useState({
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
    const updatedFacility = {
      ...bankFacility,
      eBankingServices: {
        ...bankFacility.eBankingServices,
        [name]: checked
      }
    };
    setBankFacility(updatedFacility);
    handleChange({
      ...formData,
      bankFacility: updatedFacility
    });
  };

  const handleCreditFacilityChange = (e) => {
    const { name, checked } = e.target;
    const updatedFacility = {
      ...bankFacility,
      creditFacilities: {
        ...bankFacility.creditFacilities,
        [name]: checked
      }
    };
    setBankFacility(updatedFacility);
    handleChange({
      ...formData,
      bankFacility: updatedFacility
    });
  };

  const handleOtherFacilityTextChange = (e) => {
    const updatedFacility = {
      ...bankFacility,
      otherFacilityText: e.target.value
    };
    setBankFacility(updatedFacility);
    handleChange({
      ...formData,
      bankFacility: updatedFacility
    });
  };

  const handleNext = () => {
    handleChange({
      ...formData,
      bankFacility: bankFacility
    });
    nextStep();
  };

  return (
    <div className="mx-auto">
      <h2 className="text-xl font-bold mb-2">E-Banking Services</h2>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-5">
        <CommanCheckbox
          label={labels.atmCard.label}
          name="atmCard"
          checked={bankFacility.eBankingServices.atmCard}
          onChange={handleEBankingChange}
        />
        <CommanCheckbox
          label={labels.upi.label}
          name="upi"
          checked={bankFacility.eBankingServices.upi}
          onChange={handleEBankingChange}
        />
        <CommanCheckbox
          label={labels.internetBanking.label}
          name="internetBanking"
          checked={bankFacility.eBankingServices.internetBanking}
          onChange={handleEBankingChange}
        />
        <CommanCheckbox
          label={labels.imps.label}
          name="imps"
          checked={bankFacility.eBankingServices.imps}
          onChange={handleEBankingChange}
        />
      </div>
      <br />
      <h2 className="text-xl font-bold mb-2">Existing Credit Facilities, If any</h2>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-5">
        <CommanCheckbox
          label={labels.consumerLoan.label}
          name="consumerLoan"
          checked={bankFacility.creditFacilities.consumerLoan}
          onChange={handleCreditFacilityChange}
        />
        <CommanCheckbox
          label={labels.homeLoan.label}
          name="homeLoan"
          checked={bankFacility.creditFacilities.homeLoan}
          onChange={handleCreditFacilityChange}
        />
        <CommanCheckbox
          label={labels.businessLoan.label}
          name="businessLoan"
          checked={bankFacility.creditFacilities.businessLoan}
          onChange={handleCreditFacilityChange}
        />
        <CommanCheckbox
          label={labels.educationLoan.label}
          name="educationLoan"
          checked={bankFacility.creditFacilities.educationLoan}
          onChange={handleCreditFacilityChange}
        />
        <CommanCheckbox
          label={labels.carLoan.label}
          name="carLoan"
          checked={bankFacility.creditFacilities.carLoan}
          onChange={handleCreditFacilityChange}
        />
        <CommanCheckbox
          label={labels.staff.label}
          name="staff"
          checked={bankFacility.creditFacilities.staff}
          onChange={handleCreditFacilityChange}
        />
        <CommanCheckbox
          label={labels.relativeFriend.label}
          name="relativeFriend"
          checked={bankFacility.creditFacilities.relativeFriend}
          onChange={handleCreditFacilityChange}
        />
        <CommanCheckbox
          label={labels.other.label}
          name="other"
          checked={bankFacility.creditFacilities.other}
          onChange={handleCreditFacilityChange}
        />
        {bankFacility.creditFacilities.other && (
          <div className="md:col-span-4">
            <CommanInput
              label={labels.otherFacilityText.label}
              name="otherFacilityText"
              value={bankFacility.otherFacilityText}
              onChange={handleOtherFacilityTextChange}
            />
          </div>
        )}
      </div>


      <div className="next-back-btns z-10">
        <CommonButton className="btn-back border-0" onClick={prevStep}>
          <i className="bi bi-chevron-double-left"></i>&nbsp;Back
        </CommonButton>
        <CommonButton
          className="btn-next border-0"
          onClick={handleNext}
        >
          Next&nbsp;<i className="bi bi-chevron-double-right"></i>
        </CommonButton>
      </div>


    </div>
  );
};

export default Step5CBankDetails;