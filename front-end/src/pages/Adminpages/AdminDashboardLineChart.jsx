

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminService } from '../../services/apiServices';
import Swal from 'sweetalert2';

const MonthlyAccountTrends = () => {
    const [data, setData] = useState([]);
    const admin_id = localStorage.getItem('userCode')

    const fetchDetails = async () => {

        try {
            const response = await adminService.monthlyLineChart;
            // console.log('API Response:', response); // For debugging

            if (response && response.labels && response.data) {
                // Transform the API response into the format needed by the chart
                const chartData = response.labels.map((month, index) => ({
                    month: month.substring(0, 3), // Use first 3 letters of month name
                    accounts: response.data[index] || 0
                }));

                setData(chartData);
            }
        } catch (error) {
            console.error('Error fetching Monthly Trends:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error?.response?.data?.message || 'Failed to load chart data'
            });
        }


    };
    useEffect(() => {
        if (admin_id) { fetchDetails(admin_id); }
    }, [admin_id]);

    return (
        <div style={{ width: '100%', height: 340, fontFamily: 'Arial, sans-serif' }}>
            <h2 className="text-xl font-bold mb-2">
                Monthly Account Opening Trends
            </h2>

            <ResponsiveContainer width="100%" height="80%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 20,
                        bottom: 20,
                    }}
                >
                    <defs>
                        <linearGradient id="colorAccounts" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#20C475" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#20C475" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#666' }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#666' }}
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '8px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            border: 'none'
                        }}
                        formatter={(value) => [`${value} Accounts`, '']}
                        labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Area
                        type="monotone"
                        dataKey="accounts"
                        stroke="#20C475"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorAccounts)"
                        activeDot={{ r: 6, stroke: '#20C475', strokeWidth: 2, fill: '#fff' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MonthlyAccountTrends;
