import React, { useState, useEffect } from 'react';
import CommanSelect from '../../components/CommanSelect';
import {
    Box, FormControl, InputLabel, MenuItem, Select, Typography
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { agentService } from '../../services/apiServices';

function AccountBarChart() {
    const [timePeriod, setTimePeriod] = useState('monthly');
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleTimeChange = (event) => {
        setTimePeriod(event.target.value);
    };

    const timeduration = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
    ];

    const statusColors = {
        approved: '#20C475',
        pending: '#FFA726',
        rejected: '#F44336',
        review: '#2196F3'
    };

    const transformData = (apiData, isMonthly) => {
        return apiData.map(item => {
            const transformed = {
                period: isMonthly ? item.month : item.year.toString(),
                approved: parseInt(item.approved),
                pending: parseInt(item.pending),
                rejected: parseInt(item.rejected),
                review: parseInt(item.review)
            };
            return transformed;
        });
    };

  const storedId = localStorage.getItem("userCode") || 0;
    useEffect(() => {
        fetchData();
    }, [timePeriod]);

  const fetchData = async () => {
    setLoading(true);
    try {
        let response;
        if (timePeriod === 'monthly') {
            response = await agentService.agentapplicationmonthly(storedId);
            // Sort months in ascending order
            const sorted = transformData(response.data, true).sort((a, b) => a.period.localeCompare(b.period));
            setChartData(sorted);
        } else {
            response = await agentService.agentapplicationyearly(storedId);
            // Sort years in ascending order (numeric)
            const sorted = transformData(response.data, false).sort((a, b) => a.period - b.period);
            setChartData(sorted);
        }
    } catch (error) {
        console.error('Error fetching chart data:', error);
    } finally {
        setLoading(false);
    }
};

    return (
        <Box sx={{ width: '100%', maxWidth: '1000px', margin: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                <h2 className="text-xl font-bold mb-2">Performance Metrics</h2>

                <Box sx={{ display: 'flex', gap: 2, }}>
                    <CommanSelect 
                        value={timePeriod} 
                        label="Time Period" 
                        name="timePeriod" 
                        onChange={handleTimeChange} 
                        required 
                        options={timeduration} 
                    />
                </Box>
            </Box>
            
            {loading ? (
                <Typography>Loading data...</Typography>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        barGap={-20}
                        barCategoryGap="10%"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="approved" fill={statusColors.approved} name="Approved" radius={[10, 10, 0, 0]} barSize={30} />
                        <Bar dataKey="pending" fill={statusColors.pending} name="Pending" radius={[10, 10, 0, 0]} barSize={30} />
                        <Bar dataKey="rejected" fill={statusColors.rejected} name="Rejected" radius={[10, 10, 0, 0]} barSize={30} />
                        <Bar dataKey="review" fill={statusColors.review} name="Review" radius={[10, 10, 0, 0]} barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </Box>
    );
}

export default AccountBarChart;
 