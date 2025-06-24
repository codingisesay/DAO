

import React, { useState, useEffect } from 'react';
import { agentService } from '../../services/apiServices';
import Swal from 'sweetalert2';
// import './KYCpendingTbl.css'; // Make sure to create this CSS file for styling

const KYCpendingTbl = () => {
    const [loading, setLoading] = useState(true);
    const [kycData, setKycData] = useState([]);
    const storedId = localStorage.getItem('agent_id') || 1;
    
    useEffect(() => {
        const fetchKYCData = async () => {
            try {
                setLoading(true);
                const response = await agentService.vkycpendingtable(storedId); // Updated service method
                console.log('KYC Pending Data:', response);
                
                if (response && response.data) {
                    setKycData(response.data);
                }
            } catch (error) {
                console.error('Error fetching KYC data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error?.response?.data?.message || 'Failed to fetch pending applications'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchKYCData();
    }, [storedId]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // Formats as DD/MM/YYYY
    };

    if (loading) {
        return (
            <div className="loading-container">
                <p>Loading pending applications...</p>
            </div>
        );
    }

    return (
        <div className="table-container">
            {kycData.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Applicant Name</th>
                            <th>Date</th>
                            <th>Application No.</th>
                            <th>Verification Method</th>
                            {/* <th>Action</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {kycData.map((application, index) => (
                            <tr key={application.id}>
                                <td className="applicant-name text-left">
                                    <img 
                                        src={`https://randomuser.me/api/portraits/men/${index + 1}.jpg`} 
                                        alt={`${application.kyc_vscbs_first_name} ${application.kyc_vscbs_last_name}`} 
                                    />
                                    {`${application.kyc_vscbs_first_name} ${application.kyc_vscbs_last_name}`}
                                </td>
                                <td>{formatDate(application.created_at)}</td>
                                <td>{application.kyc_application_no}</td>
                                <td>{application.verify_from}</td>
                                {/* <td>
                                    <span className="click-span">View</span>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="no-data-message">
                    <p>No pending applications found</p>
                </div>
            )}
        </div>
    );
};

export default KYCpendingTbl;









// import React from 'react';
// import { agentService } from '../../services/apiServices';
// const KYCpendingTbl = () => {
//       const storedId = localStorage.getItem('agent_id') || 1;
        
//         useEffect(() => {
//             const fetchKYCData = async () => {
//                 try {
//                     setLoading(true);
//                     const response = await agentService(storedId);
//                     console.log('DR : ', response);
                    
//                     if (response && response.data) {
//                         // Transform the API data into the format needed for the chart
                        
//                         setChartData(transformedData);
//                     }
//                 } catch (error) {
//                     console.error('Error fetching KYC data:', error);
//                     Swal.fire({
//                         icon: 'error',
//                         title: 'Error', 
//                     });
//                 } finally {
//                     setLoading(false);
//                 }
//             };
    
//             fetchKYCData();
//         }, [storedId]);
    


//     return (
//         <>

//             <div className="table-container">

//                 <table>
//                     <thead>
//                         <tr>
//                             {/* <th>Sr. No.</th> */}
//                             <th>Applicant Name</th>
//                             <th>Date</th>
//                             <th>Application No.</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <tr>
//                             {/* <td>01</td> */}
//                             <td className="applicant-name">
//                                 <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Rakesh Sharma" />
//                                 Rakesh Sharma
//                             </td>
//                             <td>12-01-2025</td>
//                             <td>12150</td>
//                             <td><span className="click-span">View</span></td>
//                         </tr>
//                         <tr>
//                             {/* <td>02</td>/ */}
//                             <td className="applicant-name">
//                                 <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="Mahesh Singh" />
//                                 Mahesh Singh
//                             </td>
//                             <td>16-02-2025</td>
//                             <td>25321</td>
//                             <td><span className="click-span">View</span></td>
//                         </tr>
//                         <tr>
//                             {/* <td>03</td> */}
//                             <td className="applicant-name">
//                                 <img src="https://randomuser.me/api/portraits/men/3.jpg" alt="Rohit Verma" />
//                                 Rohit Verma
//                             </td>
//                             <td>18-03-2025</td>
//                             <td>30254</td>
//                             <td><span className="click-span">View</span></td>
//                         </tr>
//                         <tr>
//                             {/* <td>04</td> */}
//                             <td className="applicant-name">
//                                 <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="Nakul Ahire" />
//                                 Nakul Ahire
//                             </td>
//                             <td>18-03-2025</td>
//                             <td>75542</td>
//                             <td><span className="click-span">View</span></td>
//                         </tr>
//                         <tr>
//                             {/* <td>05</td> */}
//                             <td className="applicant-name">
//                                 <img src="https://randomuser.me/api/portraits/men/5.jpg" alt="Kunal Pagare" />
//                                 Kunal Pagare
//                             </td>
//                             <td>18-03-2025</td>
//                             <td>96545</td>
//                             <td><span className="click-span">View</span></td>
//                         </tr>
//                     </tbody>
//                 </table>
//             </div>
//         </>
//     );
// };

// export default KYCpendingTbl;
