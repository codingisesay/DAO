import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { Box, Typography, Grid, MenuItem, Select } from '@mui/material';
import { agentService } from '../../services/apiServices';
import Swal from 'sweetalert2';

const KYCgue = () => {
    const [timePeriod, setTimePeriod] = useState('Monthly');
    const [chartData, setChartData] = useState([]);
    const [total, setTotal] = useState(0);
    const [approved, setApproved] = useState(0);
    const [pending, setPending] = useState(0);
    const [loading, setLoading] = useState(true);

    const storedId = localStorage.getItem('agent_id') || 1;

        const fetchKYCData = async () => {
            try {
                setLoading(true);
                const response = await agentService.kycapplicationstatus(storedId);
                
                if (response && response.data) {
                    const periodData = timePeriod === 'Monthly' ? response.data.monthly : response.data.weekly;
                    
                    // Calculate totals for each status
                    let approvedCount = 0;
                    let pendingCount = 0;
                    
                    periodData.forEach(item => {
                        if (item.status === 'Approved') {
                            approvedCount += item.total;
                        } else if (item.status === 'Pending') {
                            pendingCount += item.total;
                        }
                    });

                    const totalCount = approvedCount + pendingCount;
                    
                    setTotal(totalCount);
                    setApproved(approvedCount);
                    setPending(pendingCount);

                    // Prepare data for the chart
                    setChartData([
                        { name: 'Approved KYC', value: approvedCount, color: '#00CFFF' },
                        { name: 'Pending KYC', value: pendingCount, color: '#FFD500' },
                    ]);
                }
            } catch (error) {
                console.error('Error fetching KYC data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error?.response?.data?.message || 'Failed to load KYC data'
                });
                // Set default values on error
                setChartData([
                    { name: 'Approved KYC', value: 0, color: '#00CFFF' },
                    { name: 'Pending KYC', value: 0, color: '#FFD500' },
                ]);
                setTotal(0);
            } finally {
                setLoading(false);
            }
        };
    useEffect(() => {

        fetchKYCData();
    }, [storedId, timePeriod]);

    const handleTimePeriodChange = (event) => {
        setTimePeriod(event.target.value);
    };

    return (
        <Box textAlign="center">
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Select 
                    size="small" 
                    value={timePeriod}
                    onChange={handleTimePeriodChange}
                    disabled={loading}
                >
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                </Select>
            </Box>

            {loading ? (
                <Box height={190} display="flex" alignItems="center" justifyContent="center">
                    <Typography>Loading KYC data...</Typography>
                </Box>
            ) : (
                <>
                    <Box position="relative" width={285} height={190} fontStyle={{ marginLeft: '-10px', marginTop: '-30px' }}>
                        <PieChart width={300} height={200}>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="100%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={90}
                                outerRadius={130}
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>

                        {/* Total text in center */}
                        <Box position="absolute" top="60%" left="37%" transform="translate(-50%, -50%)">
                            <small variant="p">Total</small>
                            <Typography variant="h4" fontWeight="bold">{total}</Typography>
                        </Box>
                    </Box>

                    <Grid container justifyContent="space-around" mt={2}>
                        {chartData.map((item, index) => (
                            <Grid item key={index}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Box
                                        width={10}
                                        height={10}
                                        borderRadius="50%"
                                        bgcolor={item.color}
                                    />
                                    <small className='text-small'>{item.name}</small>
                                </Box>
                                <Typography variant="small" fontWeight="bold">
                                    {item.value}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Box>
    );
};

export default KYCgue;





// import React from 'react';
// import { PieChart, Pie, Cell } from 'recharts';
// import { Box, Typography, Grid, MenuItem, Select } from '@mui/material';

// import { agentService } from '../../services/apiServices';

// const KYCgue = ({ total, approved, pending }) => {
//     const data = [
//         { name: 'Approved KYC', value: approved, color: '#00CFFF' },
//         { name: 'Pending KYC', value: pending, color: '#FFD500' },
//     ];

//      const storedId = localStorage.getItem('agent_id') || 1;

//      // to get data for chart
//      agentService.kycapplicationstatus(storedId)
//     return (
//         <Box textAlign="center ">
//             <Box display="flex" justifyContent="flex-end" mb={2}>
//                 <Select size="small" defaultValue="Monthly">
//                     <MenuItem value="Monthly">Monthly</MenuItem>
//                     <MenuItem value="Weekly">Weekly</MenuItem>
//                 </Select>
//             </Box>

//             <Box position="relative" width={285} height={190} fontStyle={{ marginLeft: '-10px', marginTop: '-30px' }}>
//                 <PieChart width={300} height={200}>
//                     <Pie
//                         data={data}
//                         cx="50%"
//                         cy="100%"
//                         startAngle={180}
//                         endAngle={0}
//                         innerRadius={90}
//                         outerRadius={130}
//                         dataKey="value"
//                     >
//                         {data.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                     </Pie>
//                 </PieChart>

//                 {/* Total text in center */}
//                 <Box position="absolute" top="60%" left="37%" transform="translate(-50%, -50%)">
//                     <small variant="p">Total</small>
//                     <Typography variant="h4" fontWeight="bold">{total}</Typography>
//                 </Box>
//             </Box>

//             <Grid container justifyContent="space-around" mt={2}>
//                 {data.map((item, index) => (
//                     <Grid item key={index}>
//                         <Box display="flex" alignItems="center" gap={1}>
//                             <Box
//                                 width={10}
//                                 height={10}
//                                 borderRadius="50%"
//                                 bgcolor={item.color}
//                             />
//                             <small className='text-small'>{item.name}</small>
//                         </Box>
//                         <Typography variant="small" fontWeight="bold">
//                             {item.value}
//                         </Typography>
//                     </Grid>
//                 ))}
//             </Grid>
//         </Box>
//     );
// };

// export default KYCgue;