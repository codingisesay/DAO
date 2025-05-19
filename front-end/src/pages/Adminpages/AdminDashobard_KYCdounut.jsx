import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const KYCVerificationChart = () => {
    const data = [
        { name: 'Verified', value: 55 },
        { name: 'Pending Verification', value: 25 },
        { name: 'Rejected', value: 20 }
    ];

    const COLORS = ['#20C475', '#FFA726', '#FF5252'];

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
                            <span style={{ color: '#333', marginLeft: '5px' }}>{value}</span>
                        )}
                    />
                    <Tooltip
                        formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default KYCVerificationChart;