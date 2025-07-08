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

    useEffect(() => {
        const fetchAndProcessDocuments = async () => {
            try {
                if (id) {
                    setIsProcessing(true);
                    const response = await pendingKyc.pendingKyc2(id);
                    localStorage.setItem('applicationDetails', JSON.stringify(response));
                    const application = response.data.documents || [];
                    
                    // Initialize extraction results with empty arrays
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

    return (
        <div className="form-container">
            <h2 className="text-xl font-bold mb-2">Upload Documents</h2>
            <DocumentDetailsTable 
                documentslist={localFormData} 
                extractionResults={extractionResults}
                isProcessing={isProcessing}
            />
 
            <div className="next-back-btns z-10">
                <CommonButton className="btn-back border-0" onClick={onBack}>
                    <i className="bi bi-chevron-double-left"></i>&nbsp;Back
                </CommonButton>
                <CommonButton className="btn-next border-0" onClick={onNext}>
                    Next&nbsp;<i className="bi bi-chevron-double-right"></i>
                </CommonButton>
            </div> 
        </div>
    );
}

const DocumentDetailsTable = ({ documentslist, extractionResults, isProcessing }) => {
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

    const handleImageHover = (e, imageUrl) => {
        const rect = e.target.getBoundingClientRect();
        setHoveredImage(imageUrl);
        setHoverPosition({
            x: rect.right + 10,
            y: rect.top - 170,
        });
    };

    const renderExtractedItems = (items, docId, type) => {
        // Check if we have results for this specific document and if it's still processing
        if (!extractionResults[docId] || extractionResults[docId].status === 'processing') {
            return <Typography variant="caption">Processing...</Typography>;
        }
        
        // Only show the first item, consistent with Step3_DocumentUpload.jsx
        if (!items || items.length === 0) return 'Not detected';
        
        const item = items[0];
        
        // Construct the base64 image URL
        const imageUrl = `data:image/jpeg;base64,${item.image}`;

        return (
            <Box mb={1}>
                <Box
                    component="img"
                    src={imageUrl} // Use the constructed URL
                    alt={`Extracted ${type}`}
                    sx={{
                        width: type === 'photograph' ? '60px' : '120px',
                        height: type === 'photograph' ? '60px' : '30px',
                        objectFit: 'contain',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        cursor: 'pointer' // Add a pointer cursor to indicate hoverability
                    }}
                    onMouseEnter={(e) => handleImageHover(e, imageUrl)} // Add hover event
                    onMouseLeave={() => setHoveredImage(null)} // Add mouse leave event
                />
                <Typography variant="caption" display="block">
                    {item.confidence ? `${(item.confidence * 100).toFixed(1)}%` : ' '}
                </Typography>
            </Box>
        );
    };

    return (
        <div className="p-4 mx-auto">
            {isProcessing && (
                <Paper elevation={3} sx={{ p: 0, mb: 0, boxShadow:'none' }}>
                    <Typography variant="body1" align="center">Processing documents...</Typography>
                </Paper>
            )}
            
            {Object.entries(groupedDocs).map(([type, docs]) => (
                <div key={type} className="mb-8"> 
                    <div className="overflow-x-auto">
                        <table className=" w-full border border-gray-200">
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
                                        <td className="py-2 px-4 border-b border-gray-200">{toTitleCase(doc.kyc_document_type)}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <a href={daodocbase + `/${doc.kyc_file_path}`} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={daodocbase + `${doc.kyc_file_path}`}
                                                    alt="document"
                                                    className="h-auto w-20 object-contain border rounded"
                                                    onMouseEnter={(e) => handleImageHover(e, daodocbase + doc.kyc_file_path)}
                                                    onMouseLeave={() => setHoveredImage(null)}
                                                />
                                            </a>
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            {renderExtractedItems(
                                                extractionResults[doc.id]?.signatures, 
                                                doc.id,
                                                'signature'
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            {renderExtractedItems(
                                                extractionResults[doc.id]?.photographs, 
                                                doc.id,
                                                'photograph'
                                            )}
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
 

 