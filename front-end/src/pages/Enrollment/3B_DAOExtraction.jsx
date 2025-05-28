import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DAOExtraction = ({ splitfile }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [signatures, setSignatures] = useState([]);
  const [photographs, setPhotographs] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);

  // API configuration
  const API_URL = 'http://172.16.1.224:5001/api/detect';

  useEffect(() => {
    const processImage = async () => {
      if (!splitfile) {
        setError('No file provided');
        return;
      }

      setIsLoading(true);
      setError(null);
      setApiResponse(null);
      setSignatures([]);
      setPhotographs([]);

      try {
        const formData = new FormData();
        formData.append('image', splitfile);

        const response = await axios.post(API_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setApiResponse(response.data);
        console.log('API Response:', response.data);
        
        // Process detections into signatures and photographs
        if (response.data.detections && response.data.detections.length > 0) {
          const sigs = response.data.detections.filter(d => d.class_id === 1);
          const photos = response.data.detections.filter(d => d.class_id === 2);
          
          setSignatures(sigs);
          setPhotographs(photos);
          
          console.log('Signatures:', sigs);
          console.log('Photographs:', photos);
        }
      } catch (err) {
        let errorMessage = 'An error occurred while processing the image.';
        
        if (err.response) {
          if (err.response.status === 400) {
            errorMessage = 'Invalid image file. Please upload a valid JPEG or PNG.';
          } else if (err.response.status === 500) {
            errorMessage = 'Server error during image processing.';
          }
        } else if (err.request) {
          errorMessage = 'Could not connect to the API server.';
        }
        
        setError(errorMessage);
        console.error('Error:', errorMessage, err);
      } finally {
        setIsLoading(false);
      }
    };

    processImage();
  }, [splitfile]);

  return (
    <div style={{ display: 'none' }}>
      {/* This component doesn't render anything visible */}
      {isLoading && <p>Processing image...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DAOExtraction;