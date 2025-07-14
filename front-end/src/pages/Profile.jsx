import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function MyPage() {
    const [reason, setReason] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const APIURL = 'https://vcall.payvance.co.in/api/fetch-video-details';

    useEffect(() => {
        const loadReason = async () => {
            try {
                setLoading(true);
                const response = await fetch(APIURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ kyc_application_id: 37 })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setReason(data);
            } catch (error) {
                console.error("Error loading reason:", error);
                setReason(null);
            } finally {
                setLoading(false);
            }
        };

        loadReason();
    }, [id]);

    if (loading) {
        return <div>Loading reason...</div>;
    }

    if (!reason) {
        return <div>No reason found or an error occurred.</div>;
    }

    return (
        <div>
            <h3>API Response:</h3>
            <pre>{JSON.stringify(reason, null, 2)}</pre>
            {reason.data && reason.data[0] &&
                <>
                    <video controls width="70%" className="videoPlayer" src={`https://vcall.payvance.co.in/storage/${reason.data[0].file_path}`}></video>
                    <a href={`https://vcall.payvance.co.in/storage/${reason.data[0].file_path}`}>call</a>
                </>
            }
        </div>
    );
}

export default MyPage;