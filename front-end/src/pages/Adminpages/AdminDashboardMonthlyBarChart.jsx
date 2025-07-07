import React, { useState, useEffect } from 'react';
import CommanSelect from '../../components/CommanSelect';
import { adminService } from '../../services/apiServices';
import {
    Box, FormControl, InputLabel, MenuItem, Select, Typography
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import Swal from 'sweetalert2';

function ValidationBarChart() {
    const [timePeriod, setTimePeriod] = useState('monthly');
    const [selectedValidation, setSelectedValidation] = useState('all');
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const role = localStorage.getItem('roleName')
    const admin_id = localStorage.getItem('userCode')

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
        { value: 'aadhaar', label: 'Aadhaar Card' },
        { value: 'pan', label: 'PAN Card' },
        { value: 'digilocker', label: 'DigiLocker ' },
        { value: 'all', label: 'All Validations' },
    ];

    const colors = {
        Aadhaar: '#20C475',
        PAN: '#0CB4FB',
        DigiLocker: '#FFA726'
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            let response;
            if (timePeriod === 'monthly') {
                response = await adminService.monthlyauthbarchart();
            } else {
                response = await adminService.weeklyauthbarchart();
            }

            if (response && response.labels && response.data) {
                // Transform the API response into the format needed by the chart
                const transformedData = response.labels.map((timeLabel, index) => {
                    const dataPoint = {
                        label: timePeriod === 'monthly'
                            ? timeLabel.substring(0, 3) // Shorten month names
                            : timeLabel // Keep full week names
                    };

                    response.data.forEach(validationType => {
                        const key = validationType.label === 'Aadhaar Card' ? 'Aadhaar'
                            : validationType.label === 'Pan Card' ? 'PAN'
                                : 'DigiLocker';
                        dataPoint[key] = validationType.data[index] || 0;
                    });

                    return dataPoint;
                });

                setChartData(transformedData);
            }
        } catch (error) {
            console.error('Error fetching chart data:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.message || 'Failed to load chart data'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [timePeriod, admin_id]);

    const getXAxisKey = () => 'label';

    return (
        <Box sx={{ width: '100%', maxWidth: '1000px', margin: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                <h2 className="text-xl font-bold mb-2">Validation</h2>

                <Box sx={{ display: 'flex', gap: 2, }}>
                    <CommanSelect
                        value={timePeriod}
                        label="Period"
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
                        required  style={{ minWidth: 150 }}
                        options={validationTypes}  
                    />
                </Box>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                    <Typography>Loading chart data...</Typography>
                </Box>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={chartData}
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
            )}
        </Box>
    );
}

export default ValidationBarChart;

