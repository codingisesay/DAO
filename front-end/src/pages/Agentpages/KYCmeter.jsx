import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { Box, Typography, Grid, MenuItem, Select } from '@mui/material';

const KYCgue = ({ total, approved, pending }) => {
    const data = [
        { name: 'Approved KYC', value: approved, color: '#00CFFF' },
        { name: 'Pending KYC', value: pending, color: '#FFD500' },
    ];

    return (
        <Box textAlign="center ">
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <Select size="small" defaultValue="Monthly">
                    <MenuItem value="Monthly">Monthly</MenuItem>
                    <MenuItem value="Weekly">Weekly</MenuItem>
                </Select>
            </Box>

            <Box position="relative" width={285} height={190} fontStyle={{ marginLeft: '-10px', marginTop: '-30px' }}>
                <PieChart width={300} height={200}>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={90}
                        outerRadius={130}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
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
                {data.map((item, index) => (
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
        </Box>
    );
};

export default KYCgue;