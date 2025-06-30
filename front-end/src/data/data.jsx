
// Define form fields

const daodocbase = 'data:image/jpeg;base64,';
const gender = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
];
const salutation = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' },
    // { value: 'MASTER', label: 'Master' },
    { value: 'MISS', label: 'Miss' },
    // { value: 'MX', label: 'Mx' },
];
const YN = [
    { value: 'YES', label: 'Yes' },
    { value: 'NO', label: 'No' },
];
const maritalStatusOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' }
];
const regionOptions = [
    { value: 'North', label: 'North' },
    { value: 'South', label: 'South' },
    { value: 'East', label: 'East' },
    { value: 'West', label: 'West' }
];
const branchOptions = [
    { value: 'Branch1', label: 'Branch 1' },
    { value: 'Branch2', label: 'Branch 2' },
    { value: 'Branch3', label: 'Branch 3' }
];


const occupationTypeOptions = [
    { value: 'Salaried', label: 'Salaried' },
    { value: 'Self-Employed', label: 'Self-Employed' },
    { value: 'Business', label: 'Business' }
];
const religion = [
    { value: 'HINDU', label: 'Hindu' },
    { value: 'MUSLIM', label: 'Muslim' },
    { value: 'CHRISTIAN', label: 'Christian' },
    { value: 'SIKH', label: 'Sikh' },
    { value: 'BUDDHIST', label: 'Buddhist' },
    { value: 'JAIN', label: 'Jain' },
    { value: 'PARSI', label: 'Parsi' },
    { value: 'JEWISH', label: 'Jewish' },
    { value: 'OTHER', label: 'Other' },
    { value: 'NOT_SPECIFIED', label: 'Prefer not to say' },
];
const caste = [
    { value: 'GENERAL', label: 'General' },
    { value: 'OBC', label: 'OBC (Other Backward Class)' },
    { value: 'SC', label: 'SC (Scheduled Caste)' },
    { value: 'ST', label: 'ST (Scheduled Tribe)' },
    { value: 'EWS', label: 'EWS (Economically Weaker Section)' },
    { value: 'OTHER', label: 'Other' },
    { value: 'NOT_SPECIFIED', label: 'Prefer not to say' },
];

const relation = [
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Son', label: 'Son' },
    { value: 'Daughter', label: 'Daughter' },
    { value: 'Brother', label: 'Brother' },
    { value: 'Sister', label: 'Sister' },
    { value: 'Guardian', label: 'Guardian' },
    { value: 'Other', label: 'Other' },
];
const salaryrange = [
    { value: 'Below ₹1,00,000', label: 'Below ₹1,00,000' },
    { value: '₹1,00,000 – ₹3,00,000', label: '₹1,00,000 – ₹3,00,000' },
    { value: '₹3,00,000 – ₹5,00,000', label: '₹3,00,000 – ₹5,00,000' },
    { value: '₹5,00,000 – ₹10,00,000', label: '₹5,00,000 – ₹10,00,000' },
    { value: '10₹10,00,000 – ₹15,00,000L_15L', label: '₹10,00,000 – ₹15,00,000' },
    { value: '₹15,00,000 – ₹25,00,000', label: '₹15,00,000 – ₹25,00,000' },
    { value: 'Above ₹25,00,000', label: 'Above ₹25,00,000' }
];


const RESIDENTIAL_STATUS = [
    { label: 'Resident', value: 'Resident' },
    { label: 'Non Resident', value: 'Non Resident' },
];

const RESIDENCE_DOCS = [
    { label: 'Aadhar Card', value: 'AADHAR' },
    { label: 'Ration Card', value: 'RATION' },
    { label: 'Voter ID', value: 'VOTER_ID' },
    { label: 'Utility Bill', value: 'UTILITY_BILL' },
];

const userdummydata = {
    aadhardetails: {
        auth_type: "Aadhar Card",
        auth_code: "987654321098",
        auth_status: "Verified",
        first_name: "Kisan",
        middle_name: "Pandya",
        last_name: "Sharma",
        DOB: '1985-07-11',
        gender: "Male",
        mobile: "9876543210",
        complex_name: "Sunshine Apartments",
        flat_no: "B204",
        area: "MG Road",
        landmark: "Near City Mall",
        country: "India",
        pincode: "560001",
        city: "Bangalore",
        district: "Bangalore Urban",
        state: "Karnataka"
    }

}


export { userdummydata, maritalStatusOptions, regionOptions, branchOptions, occupationTypeOptions, gender, salutation, religion, caste, YN, relation, salaryrange, daodocbase, RESIDENCE_DOCS, RESIDENTIAL_STATUS };