
import CommanInput from '../../../components/CommanInput';
import labels from '../../../components/labels';
import CommanSelect from '../../../components/CommanSelect';
import { salutation, gender, religion, caste, maritalStatusOptions } from '../../../data/data';


const Step2AJobInfo = ({ formData, handleChange, nextStep, prevStep }) => {
  return (
    <>
      <h2>Step 2A: Job Details</h2>

      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
        {/* Salutation - Select field */}
        <CommanSelect
          onChange={handleChange}
          label={labels.salutation.label}
          name="salutation"
          value={formData.salutation}
          options={salutation}
          required
        />

        {/* First Name - Text only, 50 char limit */}
        <CommanInput
          onChange={handleChange}
          label={labels.firstname.label}
          type="text"
          name="first_name"
          value={formData.first_name}
          required
          max={50}
          validationType="TEXT_ONLY"
        />

        {/* Middle Name - Text only, 50 char limit */}
        <CommanInput
          onChange={handleChange}
          label={labels.middlename.label}
          type="text"
          name="middle_name"
          value={formData.middle_name}
          required
          max={50}
          validationType="TEXT_ONLY"
        />

        {/* Last Name - Text only, 50 char limit */}
        <CommanInput
          onChange={handleChange}
          label={labels.lastname.label}
          type="text"
          name="last_name"
          value={formData.last_name}
          required
          max={50}
          validationType="TEXT_ONLY"
        />

        {/* Date of Birth - Date validation */}
        <CommanInput
          onChange={handleChange}
          label={labels.dob.label}
          type="date"
          name="DOB"
          value={formData.DOB}
          required
          validationType="DATE"
        />

        {/* Gender - Select field */}
        <CommanSelect
          onChange={handleChange}
          label={labels.gender.label}
          name="gender"
          value={formData.gender}
          options={gender}
          required
        />

        {/* Religion - Select field */}
        <CommanSelect
          onChange={handleChange}
          label={labels.religion.label}
          name="religion"
          value={formData.religion}
          options={religion}
          required
        />

        {/* Caste - Select field */}
        <CommanSelect
          onChange={handleChange}
          label={labels.caste.label}
          name="caste"
          value={formData.caste}
          options={caste}
          required
        />

        {/* Marital Status - Select field */}
        <CommanSelect
          onChange={handleChange}
          label={labels.maritalStatus.label}
          name="maritalStatus"
          value={formData.maritalStatus}
          options={maritalStatusOptions}
          required
        />

        {/* Mobile - Phone number validation */}
        <CommanInput
          onChange={handleChange}
          label={labels.mobile.label}
          type="text"
          name="mobile"
          value={formData.mobile}
          required
          max={10}
          validationType="PHONE"
        />

        {/* Alternate Mobile - Phone number validation */}
        <CommanInput
          onChange={handleChange}
          label={labels.alternatemobile.label}
          type="text"
          name="alternatemobile"
          value={formData.alternatemobile}
          required
          max={10}
          validationType="PHONE"
        />

        {/* Email - Email validation */}
        <CommanInput
          onChange={handleChange}
          label={labels.email.label}
          type="email"
          name="email"
          value={formData.email}
          required
          validationType="EMAIL"
        />

        {/* Aadhar Number - 12 digit number */}
        <CommanInput
          onChange={handleChange}
          label={labels.aadharnumber.label}
          type="text"
          name="aadharnumber"
          value={formData.aadharnumber}
          required
          max={12}
          validationType="NUMBER_ONLY"
        />

        {/* PAN Number - PAN validation */}
        <CommanInput
          onChange={handleChange}
          label={labels.pannumber.label}
          type="text"
          name="pannumber"
          value={formData.pannumber}
          required
          max={10}
          validationType="PAN"
        />

        {/* Driving License - Alphanumeric with special chars */}
        <CommanInput
          onChange={handleChange}
          label={labels.drivinglicence.label}
          type="text"
          name="drivinglicence"
          value={formData.drivinglicence}
          max={20}
          validationType="REGISTRATION_NO"
        />

        {/* Voter ID - Alphanumeric with special chars */}
        <CommanInput
          onChange={handleChange}
          label={labels.voterid.label}
          type="text"
          name="voterid"
          value={formData.voterid}
          max={20}
          validationType="REGISTRATION_NO"
        />

        {/* Passport Number - Alphanumeric */}
        <CommanInput
          onChange={handleChange}
          label={labels.passportno.label}
          type="text"
          name="passportno"
          value={formData.passportno}
          max={20}
          validationType="ALPHANUMERIC"
        />

        {/* Complex Name - Text with spaces */}
        <CommanInput
          onChange={handleChange}
          label={labels.complexname.label}
          type="text"
          name="complex_name"
          value={formData.complex_name}
          required
          max={30}
          validationType="ALPHABETS_AND_SPACE"
        />

        {/* Room/Flat No - Alphanumeric */}
        <CommanInput
          onChange={handleChange}
          label={labels.roomno.label}
          type="text"
          name="flat_no"
          value={formData.flat_no}
          required
          max={20}
          validationType="ALPHANUMERIC"
        />

        {/* Area - Text with spaces */}
        <CommanInput
          onChange={handleChange}
          label={labels.area.label}
          type="text"
          name="area"
          value={formData.area}
          required
          max={50}
          validationType="ALPHABETS_AND_SPACE"
        />

        {/* Landmark - More flexible validation */}
        <CommanInput
          onChange={handleChange}
          label={labels.landmark.label}
          type="text"
          name="landmark"
          value={formData.landmark}
          required
          max={50}
          validationType="EVERYTHING"
        />

        {/* Country - Text with spaces */}
        <CommanInput
          onChange={handleChange}
          label={labels.country.label}
          type="text"
          name="country"
          value={formData.country}
          required
          max={30}
          validationType="ALPHABETS_AND_SPACE"
        />

        {/* Pincode - 6 digit number */}
        <CommanInput
          onChange={handleChange}
          label={labels.pincode.label}
          type="text"
          name="pincode"
          value={formData.pincode}
          max={6}
          required
          validationType="NUMBER_ONLY"
        />

        {/* City - Text with spaces */}
        <CommanInput
          onChange={handleChange}
          label={labels.city.label}
          type="text"
          name="city"
          value={formData.city}
          required
          max={30}
          validationType="ALPHABETS_AND_SPACE"
        />

        {/* District - Text with spaces */}
        <CommanInput
          onChange={handleChange}
          label={labels.district.label}
          type="text"
          name="district"
          value={formData.district}
          required
          max={30}
          validationType="ALPHABETS_AND_SPACE"
        />

        {/* State - Text with spaces */}
        <CommanInput
          onChange={handleChange}
          label={labels.state.label}
          type="text"
          name="state"
          value={formData.state}
          required
          max={30}
          validationType="ALPHABETS_AND_SPACE"
        />
      </div>

      <div className="navigation-buttons">
        <button type="button" onClick={prevStep}>
          Previous
        </button>
        <button type="button" onClick={nextStep}>
          Next
        </button>
      </div>
    </>
  );
};

export default Step2AJobInfo;
