import React, { useEffect, useState } from 'react';
import { getsignabstract } from '../../services/apiServices';
import axios from 'axios';
import {
    Box,
    CircularProgress,
    Typography,
    Grid,
    Paper,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ClearIcon from '@mui/icons-material/Clear';

const ExtractionResult = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const DAOExtraction = ({ document,setDocuments, onClose, onExtractionComplete }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('No Signature or Photo found');
    const [signatures, setSignatures] = useState([]);
    const [photographs, setPhotographs] = useState([]);
    const [apiResponse, setApiResponse] = useState(null);

    // API configuration
    // const API_URL = 'http://172.16.1.224:5001/api/detect';
    const API_URL ='https://dao.payvance.co.in:8091/ext/api/detect';
    const bearer =localStorage.getItem('accessToken')

    useEffect(() => {
        if (document) {
            processImage();
        }
    }, [document]);

    const processImage = async () => {
        if (!document) {
            setError('No document selected');
            return;
        }

        setIsLoading(true);
        setError();
        setApiResponse(null);
        setSignatures([]);
        setPhotographs([]);

        try {
            const formData = new FormData();
            formData.append('image', document.file);

            const response = await getsignabstract.upload(formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                },
                timeout: 30000 // 30 seconds timeout
            });

            setApiResponse(response);

            // Process detections into signatures and photographs
       if (response.detections && response.detections.length > 0) {
            const sigs = response.detections
                .filter(d => d.class_id === 2)
                .map(d => ({ ...d, image: d.crop }));
            const photos = response.detections
                .filter(d => d.class_id === 1)
                .map(d => ({ ...d, image: d.crop }));

            setSignatures(sigs);
            setPhotographs(photos);

            // Show error if both arrays are empty
            if (sigs.length === 0 && photos.length === 0) {
                setError('No signatures or photographs detected in the document');
            } else {
                setError(undefined);
            }

            onExtractionComplete({
                signatures: sigs,
                photographs: photos
            });
        } else {
            setError('No signatures or photographs detected in the document');
        }
        } catch (err) {
            handleApiError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApiError = (err) => {
        let errorMessage = 'An error occurred while processing the image.';

        if (err.response) {
            if (err.response.status === 400) {
                errorMessage = 'Invalid image file. Please upload a valid JPEG or PNG.';
            } else if (err.response.status === 413) {
                errorMessage = 'File too large. Please upload an image smaller than 5MB.';
            } else if (err.response.status === 500) {
                errorMessage = 'Server error during image processing. Please try again.';
            } else if (err.response && err.response.message) {
                errorMessage = err.response.message;
            }
        } else if (err.request) {
            if (err.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout. The server took too long to respond.';
            } else {
                errorMessage = 'Could not connect to the API server. Please check your network connection.';
            }
        } else if (err.message) {
            errorMessage = err.message;
        }

        setError(errorMessage);
        console.error('Error:', errorMessage, err);
    };

    // Add this to the renderExtractionResult function for signatures
const renderExtractionResult = (items, title) => {
  if (!items || items.length === 0) return null;

  return (
    <ExtractionResult elevation={3}>
      <Typography variant="h6" gutterBottom>
        {title} ({items.length})
      </Typography>
      <Grid container spacing={2}>
        {items.map((item, index) => (
          <Grid item xs={12} md={6} key={index}> {/* Changed from xs={6} md={4} to make signatures wider */}
            <Box
              component="img"
              src={`data:image/jpeg;base64,${item.image}`}
              alt={`${title.slice(0, -1)} ${index + 1}`}
              sx={{
                width: title === 'Extracted Signatures' ? '100%' : 'auto', // Wider for signatures
                maxWidth: '100%',
                maxHeight: title === 'Extracted Signatures' ? 80 : 150, // Different height for signatures
                border: '1px solid #ddd',
                borderRadius: 1
              }}
            />
            <Typography variant="caption" display="block">
              Confidence: {item.confidence ? `${(item.confidence * 100).toFixed(1)}%` : 'N/A'}
            </Typography>
            <Typography variant="caption" display="block">
              Type: {item.label || 'Unknown'}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </ExtractionResult>
  );
};
// Add this effect to auto-close after processing
useEffect(() => {
    if (!isLoading && document) {
        // Wait a short moment to let user see the spinner, then close
        const timer = setTimeout(() => {
            onClose();
        }, 1000); // 1 second delay, adjust as needed
        return () => clearTimeout(timer);
    }
}, [isLoading, document, onClose]);
    return (
<>
    <Dialog open={!!document} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Processing Document: {document?.name}</Typography>
                {/* <IconButton onClick={onClose}>
                    <ClearIcon />
                </IconButton> */}
            </Box>
        </DialogTitle>
        <DialogContent>
            <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                    <CircularProgress />
                    <Typography variant="body1" sx={{ ml: 2 }}>
                        Processing document...
                    </Typography>
                </Box>
            </Box>
        </DialogContent>
        {/* Optionally, you can remove DialogActions if you want to auto-close only */}
    </Dialog>
</>
    );
};

export default DAOExtraction;