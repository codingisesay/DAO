import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import dataService from '../utils/reasonervices'; // Adjust the path as necessary

function MyPage() {
    const [reason, setReason] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams(); // Assuming 'id' is coming from URL parameters

    useEffect(() => {
        const loadReason = async () => {
            try {
                setLoading(true);
                const fetchedReason = await dataService.fetchReasonById(49);
                setReason(fetchedReason);
            } catch (error) {
                // Handle error, e.g., show a user-friendly message
                console.error("Error loading reason in component:", error);
                setReason(null); // Clear reason on error
            } finally {
                setLoading(false);
            }
        };

        loadReason();
    }, [id]); // Re-run effect if 'id' changes

    if (loading) {
        return <div>Loading reason...</div>;
    }

    if (!reason) {
        return <div>No reason found or an error occurred.</div>;
    }

    return (
        <div>
            <h1>Reason Details</h1>
            <p>Reason ID: {reason.id}</p>
            <p>Comment: {reason.status_comment}</p>
            {/* Render other properties of 'reason' as needed */}
        </div>
    );
}

export default MyPage;