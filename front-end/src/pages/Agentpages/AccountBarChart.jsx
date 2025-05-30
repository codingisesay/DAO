import React, { useState } from 'react';
import CommanSelect from '../../components/CommanSelect';
import {
    Box, FormControl, InputLabel, MenuItem, Select, Typography
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const dummyMonthlyData = [
    { month: 'Jan', Individual: 4000, Joint: 2400 },
    { month: 'Feb', Individual: 3000, Joint: 1398 },
    { month: 'Mar', Individual: 2000, Joint: 1800 },
    { month: 'Apr', Individual: 4780, Joint: 3908 },
    { month: 'May', Individual: 2890, Joint: 3800 },
    { month: 'Jun', Individual: 3390, Joint: 2800 },
    { month: 'Jul', Individual: 3490, Joint: 4300 },
];

const dummyYearlyData = [
    { year: '2020', Individual: 24000, Joint: 14000 },
    { year: '2021', Individual: 32000, Joint: 21000 },
    { year: '2022', Individual: 28000, Joint: 17000 },
    { year: '2023', Individual: 35000, Joint: 25000 },
    { year: '2024', Individual: 40000, Joint: 30000 },
];

function AccountBarChart() {
    const [timePeriod, setTimePeriod] = useState('monthly');
    const [accountType, setAccountType] = useState('both');

    const handleTimeChange = (event) => {
        setTimePeriod(event.target.value);
    };

    const handleAccountChange = (event) => {
        setAccountType(event.target.value);
    };

    const timeduration = [
        { value: 'monthly', label: 'Monthly' },
        { value: 'yearly', label: 'Yearly' },
    ];
    const accountTypes = [
        { value: 'individual', label: 'Individual' },
        { value: 'joint', label: 'Joint' },
        { value: 'both', label: 'Both' },
    ];
    const getData = () => (timePeriod === 'monthly' ? dummyMonthlyData : dummyYearlyData);

    const formatXAxis = (entry) => timePeriod === 'monthly' ? entry : entry;

    return (
        <Box sx={{ width: '100%', maxWidth: '1000px', margin: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                <h2 className="text-xl font-bold mb-2">  Performance Metrics</h2>

                <Box sx={{ display: 'flex', gap: 2, }}>

                    <CommanSelect value={timePeriod} label="Time Period" name="maritalStatus" onChange={handleTimeChange} required options={timeduration} />

                    <CommanSelect value={accountType} label="Account Type" name="maritalStatus" onChange={handleAccountChange} required options={accountTypes} />

                </Box>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={getData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barGap={-20}
                    barCategoryGap="10%"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={timePeriod === 'monthly' ? 'month' : 'year'} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {(accountType === 'individual' || accountType === 'both') && (
                        <Bar dataKey="Individual" fill="#20C475" radius={[10, 10, 0, 0]} barSize={30} />
                    )}
                    {(accountType === 'joint' || accountType === 'both') && (
                        <Bar dataKey="Joint" fill="#FFA726" radius={[10, 10, 0, 0]} barSize={30} />
                    )}
                </BarChart>

            </ResponsiveContainer>
        </Box>
    );
}

export default AccountBarChart;
