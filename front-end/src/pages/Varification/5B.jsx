import React from 'react';

const NominationDetailsTable = () => {
    // Sample data - replace with your actual data
    const nominations = [
        {
            name: "Sushant Subhash Nikam",
            address: "Kaipcity phase 2 kalpgreen G4/106 old petrol pump katrap pada Badlapur",
            relationship: "Brother",
            dob: "29/01/1992",
            age: 32,
            percentage: "50%"
        },
        {
            name: "Mahesh Ramesh Suresh",
            address: "Kaipcity phase 2 kalpgreen G4/106 old petrol pump katrap pada Badlapur",
            relationship: "Brother",
            dob: "29/01/1992",
            age: 30,
            percentage: "25%"
        },
        {
            name: "Rajesh Mahesh Rahul",
            address: "Kaipcity phase 2 kalpgreen G4/106 old petrol pump katrap pada Badlapur",
            relationship: "Brother",
            dob: "29/01/1992",
            age: 34,
            percentage: "25%"
        }
    ];

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Nomination Details</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Name of the Nominee</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Address</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Nominee's relationship with the member</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Date of Birth</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Age</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Total amount or share in percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nominations.map((nominee, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="py-3 px-4 border-b border-gray-200">{nominee.name}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{nominee.address}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{nominee.relationship}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{nominee.dob}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{nominee.age}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{nominee.percentage}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NominationDetailsTable;