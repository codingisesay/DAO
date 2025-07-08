import React, { useState, useEffect } from 'react';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { pendingKycStusUpdate, pendingKyc } from '../../services/apiServices';
import { daodocbase } from '../../data/data';
import axios from 'axios';
import { Paper, Typography, Box } from '@mui/material';

function p3({ onNext, onBack }) {
    const [localFormData, setLocalFormData] = useState();
    const [extractionResults, setExtractionResults] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const { id } = useParams();
    const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];
    const API_URL = 'https://dao.payvance.co.in:8091/ext/api/detect';
    const bearerToken = localStorage.getItem('accessToken');
    // Removed hoveredImage and hoverPosition from here, moving to DocumentDetailsTable

    useEffect(() => {
        const fetchAndProcessDocuments = async () => {
            try {
                if (id) {
                    setIsProcessing(true);
                    const response = await pendingKyc.pendingKyc2(id);
                    localStorage.setItem('applicationDetails', JSON.stringify(response));
                    const application = response.data.documents || [];
                    console.log(response)
                    // Initialize extraction results
                    const initialResults = {};
                    application.forEach(doc => {
                        initialResults[doc.id] = {
                            signatures: [],
                            photographs: [],
                            status: 'processing'
                        };
                    });
                    setExtractionResults(initialResults);
                    setLocalFormData(application);
                    
                    // Process each document sequentially
                    for (const doc of application) {
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
                const fileUrl = daodocbase + `${doc.kyc_file_path}`;
                const response = await fetch(fileUrl);
                const fileBlob = await response.blob();
                
                const formData = new FormData();
                formData.append('image', fileBlob, doc.kyc_file_name || 'document.jpg');

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
                    .slice(0, 1)
                    .map(d => ({ ...d, image: d.crop })) || [];
                
                // Get only the first photograph if multiple exist
                const firstPhotograph = apiResponse.data.detections
                    ?.filter(d => d.class_id === 1)
                    .slice(0, 1)
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
                kyc_application_id: Number(id),
                status: 'Rejected',
                status_comment: result.value,
                admin_id: 1
            };
            await pendingKycStusUpdate.updateKyc2(payload);
            applicationStatus.push('Reject');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            console.log('Payload:', payload);
            onNext();
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
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
                kyc_application_id: Number(id),
                status: 'Review',
                status_comment: result.value,
                admin_id: 1
            };
            await pendingKycStusUpdate.updateKyc2(payload);
            applicationStatus.push('Review');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            console.log('Payload:', payload);
            onNext();
        } else if (result.isDismissed) {
            console.log('Rejection canceled');
        }
    };

    const handleNextStep = () => {
        try {
            const payload = {
                kyc_application_id: Number(id),
                status: 'Approved',
                status_comment: '',
                admin_id: 1
            }
            const response = pendingKycStusUpdate.updateKyc2(payload);
            applicationStatus.push('Approved');
            localStorage.setItem("approveStatusArray", JSON.stringify(applicationStatus));
            Swal.fire({
                icon: 'success',
                title: 'Enrollment Details Approved Successfully',
                timer: 2000,
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                willClose: () => {
                    onNext();
                }
            });
        }
        catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong while updating the status!',
            });
        }
    }

    return (
        <div className="form-container">
            <h2 className="text-xl font-bold mb-2">Upload Documents</h2>
            <DocumentDetailsTable 
                documentslist={localFormData} 
                extractionResults={extractionResults}
                isProcessing={isProcessing}
            />

            <div className="next-back-btns">
                <CommonButton
                    className="text-red-500 border border-red-500 hover:bg-red-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
                    onClick={handleRejectClick}
                >
                    Reject & Continue
                </CommonButton>

                <CommonButton
                    className="text-amber-500 border border-amber-500 hover:bg-amber-50 transition-colors my-auto px-4 rounded-md py-1 mx-2"
                    onClick={handleReviewClick}
                >
                    Review & Continue
                </CommonButton>

                <CommonButton
                    className="btn-next"
                    onClick={handleNextStep}
                >
                    Accept & Continue
                </CommonButton>
            </div>
        </div>
    );
}

const DocumentDetailsTable = ({ documentslist, extractionResults, isProcessing }) => {
    // Moved hoveredImage and hoverPosition states here
    const [hoveredImage, setHoveredImage] = useState(null);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

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

    const renderExtractedItems = (items, docId, type) => {
        if (!extractionResults[docId] || extractionResults[docId].status === 'processing') {
            return <Typography variant="caption">Processing...</Typography>;
        }
        
        if (!items || items.length === 0) return 'Not detected';
        
        // Only show the first item
        const item = items[0];
        
        return (
            <Box>
                <Box
                    component="img"
                    src={`data:image/jpeg;base64,${item.image}`}
                    alt={`Extracted ${type}`}
                    sx={{
                        width: type === 'photograph' ? '60px' : '120px',
                        height: type === 'photograph' ? '60px' : '30px',
                        objectFit: 'contain',
                        borderRadius: '6px',
                        border: '1px solid #ddd'
                    }}
                    onMouseEnter={(e) => handleImageHover(e, `data:image/jpeg;base64,${item.image}`)}
                    onMouseLeave={() => setHoveredImage(null)}
                />
                <Typography variant="caption" display="block">
                    {item.confidence ? `${(item.confidence * 100).toFixed(1)}%` : ' '}
                </Typography>
            </Box>
        );
    };

    const handleImageHover = (e, imageUrl) => {
        const rect = e.target.getBoundingClientRect();
        setHoveredImage(imageUrl);
        setHoverPosition({
            x: rect.right + 10,
            y: rect.top - 170,
        });
    };

    return (
        <div className="p-4  mx-auto">
            {isProcessing && (
                <Paper elevation={3} sx={{ p: 0, mb: 0, boxShadow:'none' }}>
                    <Typography variant="body1" align="center">Processing documents...</Typography> 
                </Paper>
            )}
            
            {Object.entries(groupedDocs).map(([type, docs]) => (
                <div key={type} className="mb-8"> 
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">File Name</th>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Preview</th>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Signature</th>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Photograph</th>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {docs.map((doc) => (
                                    <tr key={doc.id}>
                                        <td className="py-2 px-4 border-b border-gray-200">{toTitleCase(doc.kyc_document_type)}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <a href={daodocbase + `${doc.kyc_file_path}`} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={daodocbase + `${doc.kyc_file_path}`}
                                                    alt="document"
                                                    className="h-auto w-20 object-contain border rounded"
                                                    onMouseEnter={(e) => handleImageHover(e, daodocbase + doc.kyc_file_path)} // Corrected path
                                                    onMouseLeave={() => setHoveredImage(null)}
                                                />
                                            </a>
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            {renderExtractedItems(extractionResults[doc.id]?.signatures, doc.id, 'signature')}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            {renderExtractedItems(extractionResults[doc.id]?.photographs, doc.id, 'photograph')}
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
            
            {hoveredImage && (
                <div
                    className="fixed z-50 bg-white border rounded shadow-lg p-2 transition-opacity duration-200"
                    style={{
                        top: `${hoverPosition.y}px`,
                        left: `${hoverPosition.x}px`,
                    }}
                >
                    <img
                        src={hoveredImage}
                        alt="Zoomed Preview"
                        className="h-[200px] w-auto rounded"
                    />
                </div>
            )}
        </div>
    );
};

export default p3;





 