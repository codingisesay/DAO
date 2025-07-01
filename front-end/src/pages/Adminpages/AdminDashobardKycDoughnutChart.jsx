import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { adminService } from '../../services/apiServices';
import Swal from 'sweetalert2';

const KYCVerificationChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const admin_id = localStorage.getItem('userCode')

    const COLORS = ['#20C475', '#FFA726', '#FF5252'];

    const fetchKYCStatus = async () => {
        try {
            const response = await adminService.kycstatusperyear;

            if (response) {
                // Transform the API response into the format needed by the chart
                const chartData = [
                    { name: 'Verified', value: response.Approved || 0 },
                    { name: 'Pending Verification', value: response.Pending || 0 },
                    { name: 'Rejected', value: response.Reject || 0 }
                ];
                setData(chartData);
            }
        } catch (error) {
            console.error('Error fetching KYC status:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: JSON.stringify(error) || 'Failed to load KYC status data'
            });
            // Fallback to empty data if API fails
            setData([
                { name: 'Verified', value: 0 },
                { name: 'Pending Verification', value: 0 },
                { name: 'Rejected', value: 0 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (admin_id) { fetchKYCStatus(); }
    }, [admin_id]);

    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
        const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontWeight: 'bold', fontSize: '14px' }}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div style={{ width: '100%', height: 300 }}>
            {/* <h2 className="text-xl font-bold mb-4 text-center">KYC Verification Status</h2> */}

            {loading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                }}>
                    <p>Loading KYC data...</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={120}
                            innerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            paddingAngle={2}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            formatter={(value, entry, index) => (
                                <span style={{ color: '#333', marginLeft: '5px' }}>
                                    {value}: {data[index]?.value || 0}
                                </span>
                            )}
                        />
                        {/* <Tooltip
                            formatter={(value, name, props) => [
                                `${value} (${((value / data.reduce((sum, item) => sum + item.value, 0)) * 100}%)`,
                                name
                            ]}
                        /> */}
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default KYCVerificationChart;

