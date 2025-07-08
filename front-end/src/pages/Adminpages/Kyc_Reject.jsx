import { useAuth } from '../../auth/AuthContext';
import { kycRjectedApplicationsService, adminService } from '../../services/apiServices';
import DataTable from '../../components/DataTable';
import { COLUMN_DEFINITIONS } from '../../components/DataTable/config/columnConfig';
import React, { useState, useEffect } from "react";

function KycRejectTable() {
  const [tbldata, setTbldata] = React.useState([]);
  const { logout } = useAuth();
  const [countLoading, setCountLoading] = useState(false);
  const [countData, setCountData] = useState({ content: [] });
  const [data, setData] = useState({ content: [] });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ field: "", order: "asc" });
  const [filters, setFilters] = useState({});
  const [activeView, setActiveView] = useState('applications'); // 'applications' or 'agents'

  const getRejectionComments = (item) => {
    const comments = [];

    const statusFields = [
      'kyc_data_after_vs_cbs_status_comment',
      'kyc_document_approved_status_comment',
    ];

    statusFields.forEach(field => {
      if (item[field]) {
        const fieldName = field
          .replace('kyc_', '')
          .replace(/_comment$/, '')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        comments.push(`${fieldName}: ${item[field]}`);
      }
    });

    return comments.length > 0 ? comments.join('; ') : 'No rejection comments available';
  };

  const countColumns = [
    { header: "Agent ID", field: "kyc_agent_id", type: "text" },
    { header: "Rejected Count", field: "rejected_count", type: "text" }
  ];

  const columns = [
        { ...COLUMN_DEFINITIONS.agent_id, field: "kyc_agent_id", type: "text" },
    { ...COLUMN_DEFINITIONS.id, field: "id", type: "text" },
    { ...COLUMN_DEFINITIONS.created_at, field: "created_at", type: "date" },
    {
      // Updated column for Applicant Name
      header: "Customer Name", // Changed header for clarity
      field: "fullName", // This field will be created in fetchData
      type: "text",
    },
    {...COLUMN_DEFINITIONS.reject_admin_id,
      field: "kyc_admin_id",
      type: "text"
    },
    {
      header: "Rejection Reasons",
      field: "rejection_comments",
      type: "text",
      render: (rowData) => getRejectionComments(rowData)
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await kycRjectedApplicationsService.getList({
        page: currentPage,
        sort: sortConfig.field ? `${sortConfig.field},${sortConfig.order}` : "",
        ...filters,
      });

      // Process the data to include 'fullName' and all rejection reasons
      const processedData = response.data ? response.data.map(item => ({
        ...item,
        // Assuming 'kyc_vscbs_last_name' is the field for last name
        fullName: `${item.kyc_vscbs_first_name || ''} ${item.kyc_vscbs_last_name || ''}`.trim(),
        rejection_comments: getRejectionComments(item)
      })) : [];

      setTbldata(processedData);
      setData({ content: processedData });
    } catch (error) {
      console.error("Failed to fetch rejected applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataCount = async () => {
    try {
      setCountLoading(true);
      const response = await adminService.kycRejectedApplicationCountByAgent();
      setCountData({ content: response.data || [] });
    } catch (error) {
      console.error("Failed to fetch agent counts:", error);
    } finally {
      setCountLoading(false);
    }
  };

  useEffect(() => {
    if (activeView === 'applications') {
      fetchData();
    } else {
      fetchDataCount();
    }
  }, [currentPage, sortConfig, filters, activeView]);

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

  const toggleView = (view) => {
    setActiveView(view);
    setCurrentPage(0);
  };

  return (
    <div className="container mx-auto">
      <br />
      <div className="Usermaster-main-div" style={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "30px",
      }}>
        {/* View Toggle Buttons */}
        <div className="flex mb-4">
          <button
            onClick={() => toggleView('applications')}
            className={`px-4 py-2 rounded-l ${activeView === 'applications' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Rejected Applications
          </button>
          <button
            onClick={() => toggleView('agents')}
            className={`px-4 py-2 rounded-r ${activeView === 'agents' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Rejections by Agent
          </button>
        </div>

        {/* Rejected Applications Table */}
        {activeView === 'applications' && (
          <div className="bank-master">
            <DataTable
              data={data}
              columns={columns}
              basePath="/kyc-verification"
              onSort={handleSort}
              onFilter={handleFilter}
              onPageChange={handlePageChange}
              loading={loading}
              primaryKeys={["kyc_application_id"]}
              editButtonDisabled={true}
            />
          </div>
        )}

        {/* Agent Count Table */}
        {activeView === 'agents' && (
          <div className="bank-master w-300px min-w-300px">
            <DataTable
              data={countData}
              columns={countColumns}
              basePath=""
              loading={countLoading}
              primaryKeys={["kyc_agent_id"]}
              hidePagination={true} showActions={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default KycRejectTable;





 