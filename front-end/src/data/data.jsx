
// Define form fields

const userDetails = [
    { label: 'User ID', name: 'userId', type: 'text' },
    { label: 'User Name', name: 'userName', type: 'text' },
    { label: 'Email Id', name: 'email', type: 'email' },
    { label: 'Mobile No', name: 'mobile', type: 'text' }
];

const gender = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
];
const salutation = [
    { value: 'MR', label: 'Mr' },
    { value: 'MRS', label: 'Mrs' },
    // { value: 'MS', label: 'Ms' },
    // { value: 'DR', label: 'Dr' },
    // { value: 'PROF', label: 'Prof' },
    // { value: 'MASTER', label: 'Master' },
    // { value: 'MISS', label: 'Miss' },
    // { value: 'MX', label: 'Mx' },
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


const userdummydata = {
    aadhardetails: {
        auth_type: "Aadhar Card",
        auth_code: "987654321098",
        auth_status: "Verified",
        first_name: "Rahul",
        middle_name: "Kumar",
        last_name: "Sharma",
        DOB: "15/07/1985",
        gender: "Male",
        mobile: "9876543210",
        complex_name: "Sunshine Apartments",
        flat_no: "B-204",
        area: "MG Road",
        landmark: "Near City Mall",
        country: "India",
        pincode: "560001",
        city: "Bangalore",
        district: "Bangalore Urban",
        state: "Karnataka"
    }

}


export { userDetails, maritalStatusOptions, regionOptions, branchOptions, occupationTypeOptions, gender, salutation, religion, caste };