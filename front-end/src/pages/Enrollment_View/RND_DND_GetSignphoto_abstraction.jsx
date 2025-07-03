import React, { useEffect, useState } from 'react';
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

const DAOExtraction = ({ document, onClose, onExtractionComplete }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [signatures, setSignatures] = useState([]);
    const [photographs, setPhotographs] = useState([]);
    const [apiResponse, setApiResponse] = useState(null);

    // API configuration - you can switch between these as needed
    const API_URL = 'https://dao.payvance.co.in:8091/ext/api/detect';
    // const API_URL = 'http://172.16.1.224:5001/api/detect';
    const bearerToken = localStorage.getItem('accessToken');

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
        setError(null);
        setApiResponse(null);
        setSignatures([]);
        setPhotographs([]);

        try {
            let fileToUpload;
            
            // Handle both URL (string) and File object cases
            if (typeof document.file === 'string') {
                // If it's a URL, fetch the image first
                const response = await fetch(document.file);
                fileToUpload = await response.blob();
            } else {
                // If it's already a File object
                fileToUpload = document.file;
            }

            const formData = new FormData();
            formData.append('image', fileToUpload, document.file_name || 'document.jpg');

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${bearerToken}`
                },
                timeout: 30000 // 30 seconds timeout
            };

            const apiResponse = await axios.post(API_URL, formData, config);
            setApiResponse(apiResponse.data);

            if (apiResponse.data.detections && apiResponse.data.detections.length > 0) {
                const sigs = apiResponse.data.detections
                    .filter(d => d.class_id === 2) // Signature class
                    .map(d => ({
                        ...d,
                        image: d.crop
                    }));

                const photos = apiResponse.data.detections
                    .filter(d => d.class_id === 1) // Photograph class
                    .map(d => ({
                        ...d,
                        image: d.crop
                    }));

                setSignatures(sigs);
                setPhotographs(photos);
                
                // Callback with extraction results
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
            } else if (err.response.data && err.response.data.message) {
                errorMessage = err.response.data.message;
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

    const renderExtractionResult = (items, title) => {
        if (!items || items.length === 0) return null;

        return (
            <ExtractionResult elevation={3}>
                <Typography variant="h6" gutterBottom>
                    {title} ({items.length})
                </Typography>
                <Grid container spacing={2}>
                    {items.map((item, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Box
                                component="img"
                                src={`data:image/jpeg;base64,${item.image}`}
                                alt={`${title.slice(0, -1)} ${index + 1}`}
                                sx={{
                                    width: title === 'Extracted Signatures' ? '100%' : 'auto',
                                    maxWidth: '100%',
                                    maxHeight: title === 'Extracted Signatures' ? 80 : 150,
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

    return (
        <Dialog open={!!document} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Processing Document: {document?.file_name || 'Document'}</Typography>
                    <IconButton onClick={onClose}>
                        <ClearIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ p: 2 }}>
                    {isLoading && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                            <CircularProgress />
                            <Typography variant="body1" sx={{ ml: 2 }}>
                                Processing document...
                            </Typography>
                        </Box>
                    )}

                    {!isLoading && error && (
                        <Box sx={{ 
                            color: 'error.main', 
                            p: 2, 
                            border: '1px solid', 
                            borderColor: 'error.main', 
                            borderRadius: 1,
                            textAlign: 'center'
                        }}>
                            <Typography variant="body1">{error}</Typography>
                            <Button 
                                variant="outlined" 
                                color="error" 
                                sx={{ mt: 2 }}
                                onClick={processImage}
                            >
                                Retry
                            </Button>
                        </Box>
                    )}

                    {!isLoading && !error && signatures.length === 0 && photographs.length === 0 && (
                        <Box sx={{ color: 'text.primary', textAlign: 'center', p: 2 }}>
                            <Typography variant="body1">No signatures or photographs detected</Typography>
                        </Box>
                    )}

                    {!isLoading && !error && (signatures.length > 0 || photographs.length > 0) && (
                        <>
                            <Box sx={{ color: 'success.main', textAlign: 'center', fontSize: '20px', p: 2 }}>
                                Document processed successfully!
                            </Box>
                            {renderExtractionResult(signatures, 'Extracted Signatures')}
                            {renderExtractionResult(photographs, 'Extracted Photographs')}
                        </>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
                {!isLoading && (signatures.length > 0 || photographs.length > 0) && (
                    <Button 
                        onClick={processImage} 
                        color="secondary"
                        variant="outlined"
                    >
                        Reprocess
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default DAOExtraction;