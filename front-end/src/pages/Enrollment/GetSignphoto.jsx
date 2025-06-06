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
    Input,
    InputLabel,
    FormControl
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';

const ExtractionResult = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const DAOExtraction = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [signatures, setSignatures] = useState([]);
    const [photographs, setPhotographs] = useState([]);
    const [apiResponse, setApiResponse] = useState(null);
    const [originalImage, setOriginalImage] = useState(null);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // API configuration
    const API_URL = 'http://172.16.1.224:5001/api/detect';

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (!selectedFile) return;

        // Validate file type
        if (!selectedFile.type.match('image.*')) {
            setError('Please select an image file (JPEG, PNG)');
            return;
        }

        // Validate file size (5MB max)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size too large. Maximum 5MB allowed.');
            return;
        }

        setFile(selectedFile);
        setError(null);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target.result);
        };
        reader.readAsDataURL(selectedFile);
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        setError(null);
        setSignatures([]);
        setPhotographs([]);
        setApiResponse(null);
    };

    const processImage = async () => {
        if (!file) {
            setError('No file selected');
            return;
        }

        setIsLoading(true);
        setError(null);
        setApiResponse(null);
        setSignatures([]);
        setPhotographs([]);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(API_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 30000 // 30 seconds timeout
            });

            setApiResponse(response.data);

            // Process detections into signatures and photographs
            if (response.data.detections && response.data.detections.length > 0) {
                const sigs = response.data.detections
                    .filter(d => d.class_id === 2) // Signature is class_id 2
                    .map(d => ({
                        ...d,
                        image: d.crop // Use the crop field directly
                    }));

                const photos = response.data.detections
                    .filter(d => d.class_id === 1) // Photograph is class_id 1
                    .map(d => ({
                        ...d,
                        image: d.crop // Use the crop field directly
                    }));

                setSignatures(sigs);
                setPhotographs(photos);
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
                        <Grid item xs={6} md={4} key={index}>
                            <Box
                                component="img"
                                src={`data:image/jpeg;base64,${item.image}`}
                                alt={`${title.slice(0, -1)} ${index + 1}`}
                                sx={{
                                    maxWidth: '100%',
                                    maxHeight: 150,
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
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Document Signature and Photo Extraction
            </Typography>

            <Box sx={{ mb: 3 }}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Upload Document
                    </Typography>

                    {!file ? (
                        <Button
                            component="label"
                            variant="contained"
                            startIcon={<CloudUploadIcon />}
                        >
                            Select Document
                            <VisuallyHiddenInput
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body1">
                                Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                            </Typography>
                            <IconButton onClick={clearFile} color="error">
                                <ClearIcon />
                            </IconButton>
                        </Box>
                    )}

                    {preview && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Preview:</Typography>
                            <Box
                                component="img"
                                src={preview}
                                alt="Document preview"
                                sx={{
                                    maxWidth: '100%',
                                    maxHeight: 200,
                                    border: '1px solid #ddd',
                                    borderRadius: 1,
                                    mt: 1
                                }}
                            />
                        </Box>
                    )}

                    {file && !isLoading && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={processImage}
                            sx={{ mt: 2 }}
                            disabled={isLoading}
                        >
                            Process Document
                        </Button>
                    )}
                </Paper>
            </Box>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                    <CircularProgress />
                    <Typography variant="body1" sx={{ ml: 2 }}>
                        Processing document...
                    </Typography>
                </Box>
            )}

            {error && (
                <Box sx={{ color: 'error.main', p: 2, border: '1px solid', borderColor: 'error.main', borderRadius: 1 }}>
                    <Typography variant="body1">{error}</Typography>
                    <Button
                        variant="outlined"
                        color="error"
                        sx={{ mt: 1 }}
                        onClick={clearFile}
                    >
                        Upload New Document
                    </Button>
                </Box>
            )}

            {renderExtractionResult(signatures, 'Extracted Signatures')}
            {renderExtractionResult(photographs, 'Extracted Photographs')}

        </Box>
    );
};

export default DAOExtraction;