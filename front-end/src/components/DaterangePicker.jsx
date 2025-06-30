// src/components/DateRangePicker.jsx
import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import "react-date-range/dist/styles.css"; // default styles
import "react-date-range/dist/theme/default.css"; // theme styles
import { agentService } from "../services/apiServices";

// import EnrollmentApprovedTable from '../pages/Agentpages/Enrollment_ApprovedTable'
// import EnrollmentPendingTable from '../pages/Agentpages/Enrollment_PendingTable'
// import EnrollmentRejectedTable from '../pages/Agentpages/Enrollment_Reject'
// import EnrollmentReviewTable from '../pages/Agentpages/Enrollment_Review'



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
        <div style={{ maxWidth: 400, margin: "auto" }}>
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
            
<StatusDashboard1/>
        </div>
    );
};



function StatusDashboard1() {
  const storedId = localStorage.getItem("userCode") || 1;
  const [statusCounts, setStatusCounts] = useState({
    Pending: 0,
    Approved: 0,
    Rejected: 0,
    Review: 0,
  });

  // State for each modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
  const [isPendingModalOpen, setIsPendingModalOpen] = useState(false);
  const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);

  useEffect(() => {

    fetchDetails();
  }, [storedId]);
    const fetchDetails = async () => {
      try {
        const response = await agentService.applicationcountbyagent(storedId);
        if (response && response.data) {
          const counts = response.data.reduce((acc, item) => {
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
      <div  className="w-1/2 cursor-pointer">
        <div className="recent-applyed-card">
          <i className="bi bi-clipboard2-x"></i>
          <div className="card-text">
            <span className="dashboard-card-count">{statusCounts.Review}</span>
            <small>Review</small>
          </div>
        </div>
      </div>
      {/* Approved Card */}
      <div   className="w-1/2 cursor-pointer">
        <div className="approved-card">
          <i className="bi bi-clipboard2-check"></i>
          <div className="card-text">
            <span className="dashboard-card-count">{statusCounts.Approved}</span>
            <small>Approved</small>
          </div>
        </div>
      </div>

      {/* Pending Card */}
      <div  className="w-1/2 cursor-pointer">
        <div className="pending-card">
          <i className="bi bi-clipboard2-minus"></i>
          <div className="card-text">
            <span className="dashboard-card-count">{statusCounts.Pending}</span>
            <small>Pending</small>
          </div>
        </div>
      </div>

      {/* Rejected Card */}
      <div   className="w-1/2 cursor-pointer">
        <div className="rejected-card">
          <i className="bi bi-clipboard2-x"></i>
          <div className="card-text">
            <span className="dashboard-card-count">{statusCounts.Rejected}</span>
            <small>Rejected</small>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1 className='flex justify-between'>
              <span>Review Applications</span>
              <button onClick={() => setIsReviewModalOpen(false)}>X</button>
            </h1>
            <EnrollmentReviewTable agentId={storedId} />
          </div>
        </div>
      )}

      {/* Approved Modal */}
      {isApprovedModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1 className='flex justify-between'>
              <span>Approved Applications</span>
              <button onClick={() => setIsApprovedModalOpen(false)}>X</button>
            </h1>
            <EnrollmentApprovedTable agentId={storedId} />
          </div>
        </div>
      )}

      {/* Pending Modal */}
      {isPendingModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1 className='flex justify-between'>
              <span>Pending Applications</span>
              <button onClick={() => setIsPendingModalOpen(false)}>X</button>
            </h1>
            <EnrollmentPendingTable agentId={storedId} />
          </div>
        </div>
      )}

      {/* Rejected Modal */}
      {isRejectedModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1 className='flex justify-between'>
              <span>Rejected Applications</span>
              <button onClick={() => setIsRejectedModalOpen(false)}>X</button>
            </h1>
            <EnrollmentRejectedTable agentId={storedId} />
          </div>
        </div>
      )}
    </div>
  );
}

export default DateRangePicker;
