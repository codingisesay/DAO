import { useAuth } from '../../auth/AuthContext';
import { adminService } from '../../services/apiServices'; // Still using adminService for getAllApllicationsRejected
import DataTable from '../../components/DataTable';
import { COLUMN_DEFINITIONS } from '../../components/DataTable/config/columnConfig';
import React, { useState, useEffect } from "react";

function PendingTable() {
  const storedId = localStorage.getItem('userCode') || 1; // Unused if fetching all rejected applications
  const [tbldata, setTbldata] = React.useState([]);
  const { logout } = useAuth();
  const [data, setData] = useState({ content: [] });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ field: "", order: "asc" });
  const [filters, setFilters] = useState({});

  // Function to collect all rejection reasons - COPIED FROM RejectTable
  const getRejectionReasons = (item) => {
    const reasons = [];

    // Check all possible status comment fields
    const statusFields = [
      'status_comment',
      'account_personal_details_status_comment',
      'application_address_details_status_comment',
      'agent_live_photos_status_comment',
      'applicant_live_photos_status_comment',
      'application_personal_details_status_comment',
      'application_service_status_status_comment',
      'document_approved_status_status_comment',
      'nominee_approved_status_status_comment'
    ];

    statusFields.forEach(field => {
      if (item[field]) {
        // Format the field name for display (remove '_comment' and make it readable)
        const fieldName = field.replace(/_comment$/, '')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        reasons.push(`${fieldName}: ${item[field]}`);
      }
    });

    return reasons.length > 0 ? reasons.join(', ') : 'No reason provided';
  };

  const columns = [
    { ...COLUMN_DEFINITIONS.id, field: "id", type: "text" },
    { ...COLUMN_DEFINITIONS.created_at, field: "created_at", type: "date" },
    // { ...COLUMN_DEFINITIONS.application_no, field: "application_no", type: "text" },
    {
      // Updated column for Applicant Name
      header: "Customer Name", // Changed header for clarity
      field: "fullName", // This field will be created in fetchData
      type: "text",
    },
    { ...COLUMN_DEFINITIONS.reject_admin_id, field: "admin_id", type: "text" },
    { // Add this new column for the aggregated rejection reason
      ...COLUMN_DEFINITIONS.rejected_reason, // Assuming you have this in COLUMN_DEFINITIONS
      field: "rejected_reason",
      type: "text",
      render: (rowData) => getRejectionReasons(rowData)
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      // Changed to adminService.getAllApllicationsRejected as per your provided code
      // If agentService also has a similar endpoint for rejected accounts, use that.
      // Assuming it's `adminService` that provides the data structure with multiple status comments.
      const response = await adminService.getAllApllicationsRejected({ // Make sure your agentService has this method or use adminService if appropriate
        page: currentPage,
        sort: sortConfig.field ? `${sortConfig.field},${sortConfig.order}` : "",
        ...filters,
      });

      // Process the data to include 'fullName' and all rejection reasons
      const processedData = response.data ? response.data.map(item => ({
        ...item,
        fullName: `${item.first_name || ''} ${item.last_name || ''}`.trim(), // Combine first_name and last_name
        rejected_reason: getRejectionReasons(item) // Add the aggregated rejection reason
      })) : [];

      setTbldata(processedData);
      setData({ content: processedData });
    } catch (error) {
      console.error("Failed to fetch rejected applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, sortConfig, filters]);

  const handleSort = (field, order) => {
    setSortConfig({ field, order });
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="container mx-auto">
        <br />
        <div
          className="Usermaster-main-div"
          style={{
            display: "flex",
            flexDirection: "column",
            borderRadius: "30px",
          }}
        >
          <div
            className="search-user-container"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div className="button-section"> </div>
          </div>

          <div className="bank-master" >
            <DataTable
              data={data}
              columns={columns}
              basePath="/verify-account"
              onSort={handleSort}
              onFilter={handleFilter}
              onPageChange={handlePageChange}
              loading={loading}
              primaryKeys={["id"]}
              editButtonDisabled={true}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default PendingTable;