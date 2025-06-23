import React, {useState, useEffect} from 'react';
import { Box, Typography } from '@mui/material';
import { agentService } from '../../services/apiServices';
import Swal from 'sweetalert2'
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
} from 'recharts';

const ageDistributionData = [
    { ageRange: '18-25', count: 120 },
    { ageRange: '26-35', count: 220 },
    { ageRange: '36-50', count: 180 },
    { ageRange: '50+', count: 95 },
];

const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'];



function DemographicsBarChart() {
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] =useState();
     const storedId = localStorage.getItem('agent_id') || 1;
    
    useEffect(() => {
        const fetchKYCData = async () => {
            try {
                setLoading(true);
                const response = await agentService.demographicReport(storedId);
                console.log('DR : ', response)
            } catch (error) {
                console.error('Error fetching KYC data:', error);
              
            } finally {
                setLoading(false);
            }
        };

        fetchKYCData();
    }, [storedId]);


    return (
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 5 }}>
            {/* <Typography variant="h5" gutterBottom>
                Demographics Report: Age Distribution of Customers
            </Typography> */}

            <ResponsiveContainer width="100%" height={400}>
                <BarChart
                    data={ageDistributionData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                    barCategoryGap="20%"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageRange" label={{ value: 'Age Range', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Customer Count', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Customers" radius={[10, 10, 0, 0]}>
                        {ageDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default DemographicsBarChart;
