

import React, { useState, useEffect } from 'react';
import CommonButton from '../../components/CommonButton';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { pendingAccountData, pendingAccountStatusUpdate } from '../../services/apiServices'; // <-- Import your service
import { daodocbase } from '../../data/data';


function p3({ onNext, onBack }) {
    const [localFormData, setLocalFormData] = useState();
    const  id = localStorage.getItem('application_id');
    const applicationStatus = JSON.parse(localStorage.getItem("approveStatusArray")) || [];

    useEffect(() => {
        const fetchAndStoreDetails = async () => {
            try {
                // alert('called')
                if (id) {
                    const response = await pendingAccountData.getDetailsS3(id);
                    // localStorage.setItem('applicationDetails', JSON.stringify(response));
                    console.log('documants :', response);
                    const application = response.documents || {};
                    setLocalFormData(application);
                }
            } catch (error) {
                console.error('Failed to fetch application details:', error);
            }
        };

        fetchAndStoreDetails();
    }, [id]);

 

    return (
        <div className="form-container">
            <h2 className="text-xl font-bold mb-2">Upload Documents</h2>
            <DocumentDetailsTable documentslist={localFormData} />
 
        </div>
    );
}



const DocumentDetailsTable = ({ documentslist }) => {
    if (!documentslist || !Array.isArray(documentslist)) {
        return <p>No documents found.</p>;
    }

    // Grouping documents by `document_type`
    const groupedDocs = documentslist.reduce((acc, doc) => {
        const type = doc.document_type;
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(doc);
        return acc;
    }, {});

    return (
        <div className="p-2 mx-auto">
            {/* {Object.entries(groupedDocs).map(([type, docs]) => ( */}
                <div className="mb-2">
                    {/* <h2 className="text-xl font-bold mb-4 capitalize">Saved Document</h2> */}
                    {/* <span className="text-xs text-gray-500 ms-auto">Priviously submitted docsuments</span> */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    {/* <th className="py-2 px-4 border-b border-gray-200 text-left">ID</th> */}
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">File Name</th>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Preview</th>
                                    <th className="py-2 px-4 border-b border-gray-200 text-left">Created At</th>
                                </tr>
                            </thead>
                              {Object.entries(groupedDocs).map(([type, docs]) => (
                            <tbody key={type}>
                                {docs.map((doc) => (
                                    <tr key={doc.id}>
                                        {/* <td className="py-2 px-4 border-b border-gray-200">{doc.id}</td> */}
                                        <td className="py-2 px-4 border-b border-gray-200">{doc.file_name}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            {/* <a href={daodocbase+`${doc.file_path}`} target="_blank" rel="noopener noreferrer"> */}
                                            <img
                                                src= {daodocbase+`${doc.file_path}`}
                                                alt="document"
                                                className="h-auto w-20 object-contain border rounded"
                                                />
                                            {/* </a> */}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                        {(() => {
                                            const date = new Date(doc.created_at);
                                            const day = String(date.getDate()).padStart(2, '0');
                                            const month = String(date.getMonth() + 1).padStart(2, '0');
                                            const year = date.getFullYear();
                                            return `${day}-${month}-${year}`;
                                        })()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                              ))}
                        </table>
                    </div>
                </div>
            {/* // ))} */}
        </div>
    );
};


export default p3;


 