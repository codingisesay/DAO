import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminService } from '../../services/apiServices';
import Swal from 'sweetalert2'

const MonthlyAccountTrends = () => {
    // const data = [
    //     { month: 'Apr', accounts: 120 },
    //     { month: 'May', accounts: 180 },
    //     { month: 'Jun', accounts: 150 },
    //     { month: 'Jul', accounts: 210 },
    //     { month: 'Aug', accounts: 190 },
    //     { month: 'Oct', accounts: 230 }
    // ];
    const [data, setData]=useState();

    
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await adminService.monthlyLineChart;
                console.log(response.data)
                if (response && response.data) {
                    // Count the statuses
                    setData(response)
                }
            } catch (error) {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error?.response?.data?.message
                });
            }
        };
        fetchDetails();
    }, []);



    return (
        <div style={{ width: '100%', height: 340, fontFamily: 'Arial, sans-serif' }}>
            <h2 className="text-xl font-bold mb-2">
                Monthly Account Opening Trends
            </h2>
            {/* <h2 className="text-xl font-bold mb-2">
                Total Account Opening
            </h2> */}

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