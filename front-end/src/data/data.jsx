
// Define form fields
const userDetails = [
    { label: 'User ID', name: 'userId', type: 'text' },
    { label: 'User Name', name: 'userName', type: 'text' },
    { label: 'Email Id', name: 'email', type: 'email' },
    { label: 'Mobile No.', name: 'mobile', type: 'text' }
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
export { userDetails, maritalStatusOptions, regionOptions, branchOptions, occupationTypeOptions };