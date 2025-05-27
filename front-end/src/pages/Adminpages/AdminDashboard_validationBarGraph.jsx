import React, { useState } from 'react';
import CommanSelect from '../../components/CommanSelect';
import {
    Box, FormControl, InputLabel, MenuItem, Select, Typography
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const dummyMonthlyData = [
    { month: 'Apr', Aadhaar: 50, PAN: 100, DigiLocker: 80 },
    { month: 'May', Aadhaar: 150, PAN: 200, DigiLocker: 120 },
    { month: 'Jun', Aadhaar: 100, PAN: 180, DigiLocker: 150 },
    { month: 'Jul', Aadhaar: 200, PAN: 220, DigiLocker: 180 },
    { month: 'Aug', Aadhaar: 180, PAN: 250, DigiLocker: 200 },
    { month: 'Sep', Aadhaar: 250, PAN: 300, DigiLocker: 220 },
];

const dummyWeeklyData = [
    { week: 'Week 1', Aadhaar: 20, PAN: 50, DigiLocker: 30 },
    { week: 'Week 2', Aadhaar: 50, PAN: 80, DigiLocker: 60 },
    { week: 'Week 3', Aadhaar: 80, PAN: 100, DigiLocker: 90 },
    { week: 'Week 4', Aadhaar: 100, PAN: 150, DigiLocker: 120 },
];

function ValidationBarChart() {
    const [timePeriod, setTimePeriod] = useState('monthly');
    const [selectedValidation, setSelectedValidation] = useState('all');

    const handleTimeChange = (event) => {
        setTimePeriod(event.target.value);
    };

    const handleValidationChange = (event) => {
        setSelectedValidation(event.target.value);
    };

    const timeOptions = [
        { value: 'weekly', label: 'Weekly' },
        { value: 'monthly', label: 'Monthly' },
    ];

    const validationTypes = [
        { value: 'aadhaar', label: 'Aadhaar Validate' },
        { value: 'pan', label: 'PAN Validate' },
        { value: 'digilocker', label: 'DigiLocker Validate' },
        { value: 'all', label: 'All Validations' },
    ];

    const getData = () => (timePeriod === 'monthly' ? dummyMonthlyData : dummyWeeklyData);
    const getXAxisKey = () => (timePeriod === 'monthly' ? 'month' : 'week');

    const colors = {
        Aadhaar: '#20C475',
        PAN: '#0CB4FB',
        DigiLocker: '#FFA726'
    };

    return (
        <Box sx={{ width: '100%', maxWidth: '1000px', margin: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                <h2 className="text-xl font-bold mb-2">Validation</h2>

                <Box sx={{ display: 'flex', gap: 2, }}>
                    <CommanSelect
                        value={timePeriod}
                        label="Time Period"
                        name="timePeriod"
                        onChange={handleTimeChange}
                        required
                        options={timeOptions}
                    />

                    <CommanSelect
                        value={selectedValidation}
                        label="Validation Type"
                        name="validationType"
                        onChange={handleValidationChange}
                        required
                        options={validationTypes}
                    />
                </Box>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    data={getData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barGap={-20}
                    barCategoryGap="20%"
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={getXAxisKey()} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {(selectedValidation === 'aadhaar' || selectedValidation === 'all') && (
                        <Bar dataKey="Aadhaar" fill={colors.Aadhaar} radius={[10, 10, 0, 0]} barSize={30} />
                    )}
                    {(selectedValidation === 'pan' || selectedValidation === 'all') && (
                        <Bar dataKey="PAN" fill={colors.PAN} radius={[10, 10, 0, 0]} barSize={30} />
                    )}
                    {(selectedValidation === 'digilocker' || selectedValidation === 'all') && (
                        <Bar dataKey="DigiLocker" fill={colors.DigiLocker} radius={[10, 10, 0, 0]} barSize={30} />
                    )}
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default ValidationBarChart;