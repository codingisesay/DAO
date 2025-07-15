import React from "react";
import InputField from "../../components/CommanInput";
import SelectField from "../../components/CommanSelect";
import { salutation, relation } from "../../data/data";

const NomineeDetailsForm = ({
  currentNominee,
  errors,
  touchedFields,
  handleChange,
  handleBlur,
  getRemainingPercentage,
}) => {
  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5 mb-3">
      <div>
        <SelectField
          label="Salutation"
          name="nomineeSalutation"
          value={currentNominee.details.nomineeSalutation}
          onChange={(e) => handleChange("details", e)}
          onBlur={(e) => handleBlur("details", e)}
          required
          options={salutation}
          className={
            errors.nomineeSalutation && touchedFields.details?.nomineeSalutation
              ? "border-red-500"
              : ""
          }
        />
        {errors.nomineeSalutation && touchedFields.details?.nomineeSalutation && (
          <p className="text-red-500 text-xs">{errors.nomineeSalutation}</p>
        )}
      </div>

      <div>
        <InputField
          label="First Name"
          name="nomineeFirstName"
          value={currentNominee.details.nomineeFirstName}
          onChange={(e) => handleChange("details", e)}
          onBlur={(e) => handleBlur("details", e)}
          required
          max={50}
          className={
            errors.nomineeFirstName && touchedFields.details?.nomineeFirstName
              ? "border-red-500"
              : ""
          }
        />
        {errors.nomineeFirstName && touchedFields.details?.nomineeFirstName && (
          <p className="text-red-500 text-xs">{errors.nomineeFirstName}</p>
        )}
      </div>

      <div>
        <InputField
          label="Middle Name"
          name="nomineeMiddleName"
          value={currentNominee.details.nomineeMiddleName}
          onChange={(e) => handleChange("details", e)}
          onBlur={(e) => handleBlur("details", e)}
          max={50}
          className={
            errors.nomineeMiddleName && touchedFields.details?.nomineeMiddleName
              ? "border-red-500"
              : ""
          }
        />
        {errors.nomineeMiddleName && touchedFields.details?.nomineeMiddleName && (
          <p className="text-red-500 text-xs">{errors.nomineeMiddleName}</p>
        )}
      </div>

      <div>
        <InputField
          label="Last Name"
          name="nomineeLastName"
          value={currentNominee.details.nomineeLastName}
          onChange={(e) => handleChange("details", e)}
          onBlur={(e) => handleBlur("details", e)}
          required
          max={50}
          className={
            errors.nomineeLastName && touchedFields.details?.nomineeLastName
              ? "border-red-500"
              : ""
          }
        />
        {errors.nomineeLastName && touchedFields.details?.nomineeLastName && (
          <p className="text-red-500 text-xs">{errors.nomineeLastName}</p>
        )}
      </div>

      <div>
        <SelectField
          label="Relation"
          name="nomineeRelation"
          value={currentNominee.details.nomineeRelation}
          onChange={(e) => handleChange("details", e)}
          onBlur={(e) => handleBlur("details", e)}
          required
          options={relation}
          className={
            errors.nomineeRelation && touchedFields.details?.nomineeRelation
              ? "border-red-500"
              : ""
          }
        />
        {errors.nomineeRelation && touchedFields.details?.nomineeRelation && (
          <p className="text-red-500 text-xs">{errors.nomineeRelation}</p>
        )}
      </div>

      <div>
        <InputField
          label={`Percentage (Remaining: ${getRemainingPercentage()}%)`}
          name="nomineePercentage"
          value={currentNominee.details.nomineePercentage}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^[0-9]+$/.test(value)) {
              handleChange("details", e);
            }
          }}
          onKeyDown={(e) => {
            const allowedKeys = [
              "Backspace",
              "ArrowLeft",
              "ArrowRight",
              "Delete",
              "Tab",
            ];
            if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
              e.preventDefault();
            }
          }}
          onBlur={(e) => handleBlur("details", e)}
          required
          type="number"
          max={3}
          className={
            errors.nomineePercentage && touchedFields.details?.nomineePercentage
              ? "border-red-500"
              : ""
          }
        />
        {errors.nomineePercentage && touchedFields.details?.nomineePercentage && (
          <p className="text-red-500 text-xs">{errors.nomineePercentage}</p>
        )}
      </div>

      <div>
        <InputField
          label="Date of Birth"
          name="nomineeDOB"
          type="date"
          value={currentNominee.details.nomineeDOB}
          onChange={(e) => handleChange("details", e)}
          onBlur={(e) => handleBlur("details", e)}
          max={new Date().toISOString().split("T")[0]}
          required
          className={
            errors.nomineeDOB && touchedFields.details?.nomineeDOB
              ? "border-red-500"
              : ""
          }
        />
        {errors.nomineeDOB && touchedFields.details?.nomineeDOB && (
          <p className="text-red-500 text-xs">{errors.nomineeDOB}</p>
        )}
      </div>

      <div>
        <InputField
          label="Age"
          name="nomineeAge"
          value={currentNominee.details.nomineeAge}
          onChange={(e) => handleChange("details", e)}
          onBlur={(e) => handleBlur("details", e)}
          required
          max={3}
          disabled={true}
        />
      </div>
    </div>
  );
};

export default NomineeDetailsForm;