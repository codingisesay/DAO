import React, { useState, useEffect } from 'react';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { pendingAccountData, pendingAccountStatusUpdate } from '../../services/apiServices';
import { daodocbase } from '../../data/data';
import axios from 'axios';
import { Paper, Typography, Box, CircularProgress, Grid } from '@mui/material';

function DocumentReviewStep({ onNext, onBack }) {
    const [localFormData, setLocalFormData] = useState([]);
    const [extractionResults, setExtractionResults] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const { id } = useParams();
    const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];
    const API_URL = 'https://dao.payvance.co.in:8091/ext/api/detect';
    const bearerToken = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchAndProcessDocuments = async () => {
            try {
                if (id) {
                    setIsProcessing(true);
                    const response = await pendingAccountData.getDetailsS3(id);
                    const documents = response.documents || [];
                    
                    // Initialize extraction results
                    const initialResults = {};
                    documents.forEach(doc => {
                        initialResults[doc.id] = {
                            signatures: [],
                            photographs: [],
                            status: 'processing'
                        };
                    });
                    setExtractionResults(initialResults);
                    setLocalFormData(documents);
                    
                    // Process each document sequentially
                    for (const doc of documents) {
                        await processDocument(doc);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to process documents. Please try again.',
                });
            } finally {
                setIsProcessing(false);
            }
        };

    const processDocument = async (doc) => {
    try {
        const fileUrl = daodocbase + doc.file_path;
        const response = await fetch(fileUrl);
        const fileBlob = await response.blob();
        
        const formData = new FormData();
        formData.append('image', fileBlob, doc.file_name || 'document.jpg');

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${bearerToken}`
            },
            timeout: 30000
        };

        const apiResponse = await axios.post(API_URL, formData, config);
        
        // Get only the first signature if multiple exist
        const firstSignature = apiResponse.data.detections
            ?.filter(d => d.class_id === 2)
            .slice(0, 1) // Take only the first one
            .map(d => ({ ...d, image: d.crop })) || [];
        
        // Get only the first photograph if multiple exist
        const firstPhotograph = apiResponse.data.detections
            ?.filter(d => d.class_id === 1)
            .slice(0, 1) // Take only the first one
            .map(d => ({ ...d, image: d.crop })) || [];

        setExtractionResults(prev => ({
            ...prev,
            [doc.id]: {
                signatures: firstSignature,
                photographs: firstPhotograph,
                status: firstSignature.length > 0 || firstPhotograph.length > 0 ? 'verified' : 'failed'
            }
        }));

    } catch (error) {
        console.error('Error processing document:', error);
        setExtractionResults(prev => ({
            ...prev,
            [doc.id]: {
                ...prev[doc.id],
                status: 'failed'
            }
        }));
    }
};

        fetchAndProcessDocuments();
    }, [id]);

    const handleRejectClick = async () => {
        const result = await Swal.fire({
            title: 'Reason for Rejection',
            input: 'text',
            inputLabel: 'Please provide a reason',
            inputPlaceholder: 'Enter reason here...',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            className: 'btn-login',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write a reason!';
                }
            },
        });

        if (result.isConfirmed && result.value) {
            const payload = {
                application_id: Number(id),
                status: 'Reject',
                status_comment: result.value,
                admin_id: 1
            };
            await pendingAccountStatusUpdate.updateS3(id, payload);
            applicationStatus.push('Reject');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            onNext();
        }
    };

    const handleReviewClick = async () => {
        const result = await Swal.fire({
            title: 'Reason for Review',
            input: 'text',
            inputLabel: 'Please provide a reason',
            inputPlaceholder: 'Enter reason here...',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            className: 'btn-login',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to write a reason!';
                }
            },
        });

        if (result.isConfirmed && result.value) {
            const payload = {
                application_id: Number(id),
                status: 'Review',
                status_comment: result.value,
                admin_id: 1
            };
            await pendingAccountStatusUpdate.updateS3(id, payload);
            applicationStatus.push('Review');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            onNext();
        }
    };

    const handleNextStep = async () => {  onNext();   };

    const DocumentDetailsTable = ({ documentslist }) => {
        if (!documentslist || !Array.isArray(documentslist)) {
            return <p>No documents found.</p>;
        }

        const groupedDocs = documentslist.reduce((acc, doc) => {
            const type = doc.document_type;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(doc);
            return acc;
        }, {});

        function toTitleCase(str) {
            return str
                .replace(/_?JPG$/i, '')
                .replace(/_JPG/i, '')
                .replace(/JPG$/i, '')
                .toLowerCase()
                .split('_')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
                .trim();
        }

        function formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString.replace(' ', 'T'));
            if (isNaN(date)) return dateString;
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
const renderExtractedItems = (items) => {
    if (!items || items.length === 0) return 'Not detected';
    
    // Only show the first item
    const item = items[0];
    
    return (
        <Box>
            <Box
                component="img"
                src={`data:image/jpeg;base64,${item.image}`}
                alt={`Extracted ${item.class_id === 1 ? 'photograph' : 'signature'}`}
                sx={{
                    width: item.class_id === 1 ? '60px' : '120px',
                    height: item.class_id === 1 ? '60px' : '30px',
                    objectFit: 'contain',borderRadius:'6px',
                    border: '1px solid #ddd'
                }}
            />
            <Typography variant="caption" display="block">
                {item.confidence ? `${(item.confidence * 100).toFixed(1)}%` : ' '}
            </Typography>
        </Box>
    );
};

        const getStatusBadge = (status) => {
            switch (status) {
                case 'verified':
                    return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Verified</span>;
                case 'failed':
                    return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Failed</span>;
                case 'processing':
                    return (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            <CircularProgress size={12} thickness={5} sx={{ marginRight: 1 }} />
                            Processing
                        </span>
                    );
                default:
                    return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Pending</span>;
            }
        };

        return (
            <div className="p-4 max-w-4xl mx-auto">
                {isProcessing && (
                    <Paper elevation={3} sx={{ p: 0, mb: 0, boxShadow:'none' }}>
                        <Typography variant="body1" align="center">Getting Abstractions ...  </Typography>
                    </Paper>
                )}
                
                {Object.entries(groupedDocs).map(([type, docs]) => (
                    <div key={type} className="mb-8">
                        <h2 className="font-bold mb-4 capitalize">{toTitleCase(type)}</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="py-2 px-4 border-b border-gray-200 text-left">File Name</th>
                                        <th className="py-2 px-4 border-b border-gray-200 text-left">Preview</th>
                                        <th className="py-2 px-4 border-b border-gray-200 text-left">Signatures</th>
                                        <th className="py-2 px-4 border-b border-gray-200 text-left">Photographs</th> 
                                        <th className="py-2 px-4 border-b border-gray-200 text-left">Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {docs.map((doc) => (
                                        <tr key={doc.id}>
                                            <td className="py-2 px-4 border-b border-gray-200">{doc.file_name}</td>
                                            <td className="py-2 px-4 border-b border-gray-200">
                                                <img
                                                    src={daodocbase + `${doc.file_path}`}
                                                    alt="document"
                                                    className="h-auto w-20 object-contain border rounded"
                                                />
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-200">
                                                {renderExtractedItems(extractionResults[doc.id]?.signatures)}
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-200">
                                                {renderExtractedItems(extractionResults[doc.id]?.photographs)}
                                            </td>
                                            <td className="py-2 px-4 border-b border-gray-200">
                                                {formatDate(doc.created_at)}
                                            </td>                                          
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="form-container">
            <h2 className="text-xl font-bold mb-2">Document Verification</h2>
            <p className="mb-4 text-gray-600">
                Documents are being automatically processed for signature and photograph extraction.
            </p>
            
            <DocumentDetailsTable documentslist={localFormData} />

            <div className="next-back-btns mt-6">
                <CommonButton className="btn-back" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton className="btn-next" onClick={handleNextStep}>
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div>
        </div>
    );
}

export default DocumentReviewStep;