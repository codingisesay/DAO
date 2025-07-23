
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { pendingAccountData } from '../../services/apiServices';
import dataService from '../../utils/reasonervices'; // Adjust the path as necessary

const NominationDetailsTable = () => {
    const [formData, setFormData] = useState([]); // Keep this as array

    const { id } = useParams();
        const fetchAndStoreDetails = async () => {
        try {
            if (id) {
                const response = await pendingAccountData.getDetailsS5B(id);

                console.log('nominees:', response.documents);

                // Assuming `documents` is an array of nominees
                const nominees = response.documents || [];

                setFormData(nominees); // Set as array directly
            }
        } catch (error) {
            console.error('Failed to fetch nomination details:', error);
        }
        };
    useEffect(() => { 
        fetchAndStoreDetails();
        loadReason();
    }, [id]);

    
    const [reason, setReason] = useState(null);
    const [loading, setLoading] = useState(true);
    const loadReason = async () => {
        try {
            setLoading(true);
            const fetchedReason = await dataService.fetchReasonById(id);
            setReason(fetchedReason);
        } catch (error) {
            // Handle error, e.g., show a user-friendly message
            console.error("Error loading reason in component:", error);
            setReason(null); // Clear reason on error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h1 className="text-xl font-bold mb-6">Nomination Details</h1>  {reason &&  <p className="text-red-500 mb-3 " > Review For :{ reason.nominee_approved_status_status_comment}</p> }
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Name of the Nominee</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Address</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Relationship</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Date of Birth</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Age</th>
                            <th className="py-3 px-4 border-b border-gray-200 text-left">Share (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.map((nominee, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="py-3 px-4 border-b border-gray-200">
                                    {nominee.salutation} {nominee.first_name} {nominee.middle_name} {nominee.last_name}
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">
                                    {nominee.nom_complex_name}, {nominee.nom_landmark}, {nominee.nom_district}, {nominee.nom_country}, {nominee.nom_pincode}
                                </td>
                                <td className="py-3 px-4 border-b border-gray-200">{nominee.relationship}</td>
                                <td className="py-3 px-4 border-b border-gray-200">{new Date(nominee.dob).toLocaleDateString('en-GB')}</td>
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



 