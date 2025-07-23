// src/components/DateRangePicker.jsx
import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { addDays, parseISO } from "date-fns"; // Import parseISO
import "react-date-range/dist/styles.css"; // default styles
import "react-date-range/dist/theme/default.css"; // theme styles
import { agentService } from "../services/apiServices";
import Swal from 'sweetalert2'; // Assuming Swal is used in StatusDashboard1

const DateRangePicker = ({ onChange }) => {
    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: "selection",
        },
    ]);

    const handleSelect = (ranges) => {
        setRange([ranges.selection]);
        if (onChange) {
            onChange(ranges.selection);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "auto",overflow:'auto' }}>
            <DateRange
                editableDateInputs={false}
                onChange={handleSelect}
                moveRangeOnFirstSelection={false}
                ranges={range}
                months={1}
                direction="horizontal"
                showMonthAndYearPickers={true}
                rangeColors={["#27ae60"]}
            />
            
            {/* Pass startDate and endDate from the selected range to StatusDashboard1 */}
            <StatusDashboard1 
                startDate={range[0].startDate} 
                endDate={range[0].endDate} 
            />
        </div>
    );
};


function StatusDashboard1({ startDate, endDate }) { // Accept startDate and endDate as props
    const storedId = localStorage.getItem("userCode") || "ANJOR"; // Use a default agent_id for testing if userCode isn't set, as per sample data
    const [statusCounts, setStatusCounts] = useState({
        Pending: 0,
        Approved: 0,
        Rejected: 0,
        Review: 0,
    });

    // State for each modal (kept for completeness, not directly used in filtering logic)
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
    const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
    const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);

    useEffect(() => {
        fetchDetails();
    }, [storedId, startDate, endDate]); // Re-fetch when storedId, startDate, or endDate changes

    const fetchDetails = async () => {
        try {
            const response = await agentService.applicationcountbyagent(storedId);
            if (response && response.data) {
                // Filter data based on the date range
                const filteredData = response.data.filter(item => {
                    const createdAtDate = parseISO(item.created_at.replace(' ', 'T')); // Convert to ISO format for parsing
                    return createdAtDate >= startDate && createdAtDate <= endDate;
                });

                const counts = filteredData.reduce((acc, item) => {
                    acc[item.status] = (acc[item.status] || 0) + 1;
                    return acc;
                }, {});

                setStatusCounts({
                    Pending: counts.Pending || 0,
                    Approved: counts.Approved || 0,
                    Rejected: counts.Rejected || 0,
                    Review: counts.Review || 0,
                });
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.response?.data?.message,
            });
        }
    };

    return (
        <div className="dashboard-top-caard-collection flex flex-wrap my-1">
            {/* Review Card */}
            <div className="w-1/2 cursor-pointer">
                <div className="recent-applyed-card">
                    <i className="bi bi-clipboard2-x"></i>
                    <div className="card-text">
                        <span className="dashboard-card-count">{statusCounts.Review}</span>
                        <small>Review</small>
                    </div>
                </div>
            </div>
            {/* Approved Card */}
            <div className="w-1/2 cursor-pointer">
                <div className="approved-card">
                    <i className="bi bi-clipboard2-check"></i>
                    <div className="card-text">
                        <span className="dashboard-card-count">{statusCounts.Approved}</span>
                        <small>Approved</small>
                    </div>
                </div>
            </div>

            {/* Pending Card */}
            <div className="w-1/2 cursor-pointer">
                <div className="pending-card">
                    <i className="bi bi-clipboard2-minus"></i>
                    <div className="card-text">
                        <span className="dashboard-card-count">{statusCounts.Pending}</span>
                        <small>Pending</small>
                    </div>
                </div>
            </div>

            {/* Rejected Card */}
            <div className="w-1/2 cursor-pointer">
                <div className="rejected-card">
                    <i className="bi bi-clipboard2-x"></i>
                    <div className="card-text">
                        <span className="dashboard-card-count">{statusCounts.Rejected}</span>
                        <small>Rejected</small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DateRangePicker;











 