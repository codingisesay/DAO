import React, { useState } from 'react';

const CreateMeeting = () => {
  const [applicationId, setApplicationId] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [response, setResponse] = useState(null);

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/video-kyc/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          application_id: applicationId,
          client_email: clientEmail,
        }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      alert('Failed to create meeting.');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Video KYC Meeting (Agent)</h2>
      <div>
        <label>Application ID:</label><br />
        <input type="text" value={applicationId} onChange={(e) => setApplicationId(e.target.value)} /><br /><br />
        <label>Client Email:</label><br />
        <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} /><br /><br />
        <button onClick={handleCreate}>Create Meeting</button>
      </div>

      {response && (
        <div style={{ marginTop: 20 }}>
          <h4>✅ Meeting Created</h4>
          <p><strong>Token:</strong> {response.token}</p>
          <p><strong>Client Link:</strong> <a href={response.join_url} target="_blank" rel="noreferrer">{response.join_url}</a></p>
          <p>You can also send this link manually to the client.</p>
        </div>
      )}
    </div>
  );
};

export default CreateMeeting;
