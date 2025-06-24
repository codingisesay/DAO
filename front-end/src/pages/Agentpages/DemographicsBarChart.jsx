import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { agentService } from '../../services/apiServices';
import Swal from 'sweetalert2';
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

const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50'];

function DemographicsBarChart() {
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const storedId = localStorage.getItem('agent_id') || 1;
    
    useEffect(() => {
        const fetchKYCData = async () => {
            try {
                setLoading(true);
                const response = await agentService.demographicReport(storedId);
                console.log('DR : ', response);
                
                if (response && response.data) {
                    // Transform the API data into the format needed for the chart
                    const transformedData = [
                        { ageRange: '18-25', count: parseInt(response.data["18_25"]) || 0 },
                        { ageRange: '26-35', count: parseInt(response.data["26_35"]) || 0 },
                        { ageRange: '36-50', count: parseInt(response.data["36_50"]) || 0 },
                        { ageRange: '50+', count: parseInt(response.data["50_plus"]) || 0 }
                    ];
                    setChartData(transformedData);
                }
            } catch (error) {
                console.error('Error fetching KYC data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to load demographic data'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchKYCData();
    }, [storedId]);

    if (loading) {
        return (
            <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 5 }}>
                <Typography variant="h6" align="center">Loading demographic data...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', mt: 5 }}>
            <Typography variant="h5" gutterBottom align="center">
                Demographics Report: Age Distribution of Customers
            </Typography>

            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                        barCategoryGap="20%"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="ageRange" 
                            label={{ value: 'Age Range', position: 'insideBottom', offset: -5 }} 
                        />
                        <YAxis 
                            label={{ value: 'Customer Count', angle: -90, position: 'insideLeft' }} 
                            domain={[0, 'dataMax + 5']} // Adjust y-axis domain dynamically
                        />
                        <Tooltip 
                            formatter={(value) => [`${value} customers`, 'Count']}
                            labelFormatter={(label) => `Age Range: ${label}`}
                        />
                        <Legend />
                        <Bar 
                            dataKey="count" 
                            name="Customers" 
                            radius={[10, 10, 0, 0]}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <Typography variant="h6" align="center">
                    No demographic data available
                </Typography>
            )}
        </Box>
    );
}

export default DemographicsBarChart;


 