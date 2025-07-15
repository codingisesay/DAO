import React from "react";
import InputField from "../../components/CommanInput";

const NomineeAddressForm = ({
  currentNominee,
  errors,
  touchedFields,
  isSameAsPermanent,
  isPinCodeValid,
  isFetchingPincode,
  handleChange,
  handleBlur,
  handleSameAddressToggle,
}) => {
  return (
    <>
      <div className="flex items-center mb-2">
        <h2 className="text-xl font-bold m-0">Nominee Address</h2>&emsp;
        <div className="flex items-center">
          <input
            type="checkbox"
            id="sameAsPermanent"
            className="me-2"
            checked={isSameAsPermanent}
            onChange={handleSameAddressToggle}
          />
          <label htmlFor="sameAsPermanent">Same as permanent address</label>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-5">
        <div>
          <InputField
            label="Complex Name"
            name="nomineeComplexName"
            value={currentNominee.address.nomineeComplexName}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            max={50}
            className={
              errors.nomineeComplexName && touchedFields.address?.nomineeComplexName
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeComplexName && touchedFields.address?.nomineeComplexName && (
            <p className="text-red-500 text-xs">{errors.nomineeComplexName}</p>
          )}
        </div>

        <div>
          <InputField
            label="Building Name"
            name="nomineeBuildingName"
            value={currentNominee.address.nomineeBuildingName}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            max={20}
            className={
              errors.nomineeBuildingName && touchedFields.address?.nomineeBuildingName
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeBuildingName && touchedFields.address?.nomineeBuildingName && (
            <p className="text-red-500 text-xs">{errors.nomineeBuildingName}</p>
          )}
        </div>

        <div>
          <InputField
            label="Area"
            name="nomineeArea"
            value={currentNominee.address.nomineeArea}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            max={50}
            className={
              errors.nomineeArea && touchedFields.address?.nomineeArea
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeArea && touchedFields.address?.nomineeArea && (
            <p className="text-red-500 text-xs">{errors.nomineeArea}</p>
          )}
        </div>

        <div>
          <InputField
            label="Landmark"
            name="nomineeLandmark"
            value={currentNominee.address.nomineeLandmark}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            max={50}
            className={
              errors.nomineeLandmark && touchedFields.address?.nomineeLandmark
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeLandmark && touchedFields.address?.nomineeLandmark && (
            <p className="text-red-500 text-xs">{errors.nomineeLandmark}</p>
          )}
        </div>

        <div>
          <InputField
            label="Country"
            name="nomineeCountry"
            value={currentNominee.address.nomineeCountry}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            max={30}
            className={
              errors.nomineeCountry && touchedFields.address?.nomineeCountry
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeCountry && touchedFields.address?.nomineeCountry && (
            <p className="text-red-500 text-xs">{errors.nomineeCountry}</p>
          )}
        </div>

        <div>
          <InputField
            label="Pin Code"
            name="nomineePinCode"
            value={currentNominee.address.nomineePinCode}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            max={6}
            className={
              (errors.nomineePinCode && touchedFields.address?.nomineePinCode) ||
              (!isPinCodeValid && touchedFields.address?.nomineePinCode && !isSameAsPermanent)
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineePinCode && touchedFields.address?.nomineePinCode && (
            <p className="text-red-500 text-xs">{errors.nomineePinCode}</p>
          )}
          {!isPinCodeValid && touchedFields.address?.nomineePinCode && !errors.nomineePinCode && !isSameAsPermanent && (
            <p className="text-red-500 text-xs">Please enter a valid PIN code.</p>
          )}
          {isFetchingPincode && !isSameAsPermanent && (
            <p className="text-blue-500 text-xs">Fetching address...</p>
          )}
        </div>

        <div>
          <InputField
            label="State"
            name="nomineeState"
            value={currentNominee.address.nomineeState}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            className={
              errors.nomineeState && touchedFields.address?.nomineeState
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeState && touchedFields.address?.nomineeState && (
            <p className="text-red-500 text-xs">{errors.nomineeState}</p>
          )}
        </div>

        <div>
          <InputField
            label="City"
            name="nomineeCity"
            value={currentNominee.address.nomineeCity}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            className={
              errors.nomineeCity && touchedFields.address?.nomineeCity
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeCity && touchedFields.address?.nomineeCity && (
            <p className="text-red-500 text-xs">{errors.nomineeCity}</p>
          )}
        </div>

        <div>
          <InputField
            label="District"
            name="nomineeDistrict"
            value={currentNominee.address.nomineeDistrict}
            onChange={(e) => handleChange("address", e)}
            onBlur={(e) => handleBlur("address", e)}
            required
            className={
              errors.nomineeDistrict && touchedFields.address?.nomineeDistrict
                ? "border-red-500"
                : ""
            }
          />
          {errors.nomineeDistrict && touchedFields.address?.nomineeDistrict && (
            <p className="text-red-500 text-xs">{errors.nomineeDistrict}</p>
          )}
        </div>
      </div>
    </>
  );
};

export default NomineeAddressForm;