import React from 'react';
import CommonButton from '../../../components/CommonButton';

const Step6ASummary = ({ formData, prevStep, handleSubmit }) => {
    // Helper function to format empty fields
    const formatValue = (value) => {
        if (value === null || value === undefined || value === '') return '-';
        if (typeof value === 'boolean') return value ? 'Yes' : 'No';
        if (Array.isArray(value)) return value.length > 0 ? value.join(', ') : '-';
        if (typeof value === 'object') return JSON.stringify(value);
        return value;
    };

    // Group data by sections
    const sections = [
        {
            title: 'Personal Information',
            fields: [
                { label: 'Salutation', key: 'salutation' },
                { label: 'First Name', key: 'first_name' },
                { label: 'Middle Name', key: 'middle_name' },
                { label: 'Last Name', key: 'last_name' },
                { label: 'Date of Birth', key: 'DOB' },
                { label: 'Gender', key: 'gender' },
                { label: 'Marital Status', key: 'marital_status' },
                { label: 'Religion', key: 'religion' },
                { label: 'Caste', key: 'caste' },
            ]
        },
        {
            title: 'Contact Information',
            fields: [
                { label: 'Mobile Number', key: 'mobile' },
                { label: 'Alternate Mobile', key: 'alt_mob_no' },
                { label: 'Email', key: 'email' },
            ]
        },
        {
            title: 'Permanent Address',
            fields: [
                { label: 'Complex/Building', key: 'complex_name' },
                { label: 'Flat No', key: 'flat_no' },
                { label: 'Area', key: 'area' },
                { label: 'Landmark', key: 'landmark' },
                { label: 'Country', key: 'country' },
                { label: 'Pincode', key: 'pincode' },
                { label: 'City', key: 'city' },
                { label: 'District', key: 'district' },
                { label: 'State', key: 'state' },
            ]
        },
        {
            title: 'Correspondence Address',
            fields: [
                { label: 'Same as Permanent', key: 'correspondenceAddressSame', transform: val => val ? 'Yes' : 'No' },
                { label: 'Complex/Building', key: 'cor_complex' },
                { label: 'Flat No', key: 'cor_flat_no' },
                { label: 'Area', key: 'cor_area' },
                { label: 'Landmark', key: 'cor_landmark' },
                { label: 'Country', key: 'cor_country' },
                { label: 'Pincode', key: 'cor_pincode' },
                { label: 'City', key: 'cor_city' },
                { label: 'District', key: 'cor_district' },
                { label: 'State', key: 'cor_state' },
            ]
        },
        {
            title: 'Family Details',
            fields: [
                { label: 'Father\'s Name', key: 'father_first_name', transform: val => `${formData.father_prefix_name} ${formData.father_first_name} ${formData.father_middle_name} ${formData.father_last_name}`.trim() },
                { label: 'Mother\'s Name', key: 'mother_first_name', transform: val => `${formData.mother_prefix_name} ${formData.mother_first_name} ${formData.mother_middle_name} ${formData.mother_last_name}`.trim() },
                { label: 'Birth Place', key: 'birth_place' },
                { label: 'Birth Country', key: 'birth_country' },
            ]
        },
        {
            title: 'Occupation Details',
            fields: [
                { label: 'Occupation Type', key: 'occoupation_type' },
                { label: 'Occupation Name', key: 'occupation_name' },
                { label: 'Salaried', key: 'if_salaryed' },
                { label: 'Designation', key: 'designation' },
                { label: 'Nature of Occupation', key: 'nature_of_occoupation' },
                { label: 'Qualification', key: 'qualification' },
                { label: 'Annual Income', key: 'anual_income' },
            ]
        },
        {
            title: 'Identity Documents',
            fields: [
                { label: 'Aadhar Number', key: 'adhar_card' },
                { label: 'PAN Number', key: 'pan_card' },
                { label: 'Passport Number', key: 'passport' },
                { label: 'Driving License', key: 'driving_license' },
                { label: 'Voter ID', key: 'voter_id' },
            ]
        },
        {
            title: 'Bank Facilities',
            fields: [
                {
                    label: 'e-Banking Services',
                    key: 'bankFacility.eBankingServices',
                    transform: val => Object.entries(val)
                        .filter(([_, selected]) => selected)
                        .map(([service]) => service)
                        .join(', ') || '-'
                },
                {
                    label: 'Credit Facilities',
                    key: 'bankFacility.creditFacilities',
                    transform: val => Object.entries(val)
                        .filter(([_, selected]) => selected)
                        .map(([facility]) => facility)
                        .join(', ') || '-'
                },
            ]
        }
    ];

    // Function to get nested object values
    const getNestedValue = (obj, path) => {
        return path.split('.').reduce((o, p) => o?.[p], obj);
    };

    return (
        <div className="summary-container">
            <h2 className="text-2xl font-bold mb-6 text-center">Application Summary</h2>

            <div className="space-y-8">
                {sections.map((section, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-xl font-semibold mb-4 border-b pb-2">{section.title}</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.fields.map((field, idx) => {
                                const value = field.key.includes('.')
                                    ? getNestedValue(formData, field.key)
                                    : formData[field.key];

                                const displayValue = field.transform
                                    ? field.transform(value)
                                    : formatValue(value);

                                return (
                                    <div key={idx} className="mb-2">
                                        <p className="text-sm font-medium text-gray-500">{field.label}</p>
                                        <p className="text-base font-normal text-gray-800 break-words">
                                            {displayValue}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between mt-8">
                <CommonButton
                    onClick={prevStep}
                    variant="outlined"
                    className="px-6 py-2"
                >
                    Back
                </CommonButton>
                <CommonButton
                    onClick={handleSubmit}
                    variant="contained"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700"
                >
                    Submit Application
                </CommonButton>
            </div>
        </div>
    );
};

export default Step6ASummary;