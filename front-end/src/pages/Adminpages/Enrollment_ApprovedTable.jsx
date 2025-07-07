import { useAuth } from "../../auth/AuthContext";
import { adminService } from "../../services/apiServices";
import DataTable from "../../components/DataTable";
import { COLUMN_DEFINITIONS } from "../../components/DataTable/config/columnConfig";
import React, { useState, useEffect } from "react";

function ApprovedTable() {
  const [countLoading, setCountLoading] = useState(false);
  const [countData, setCountData] = useState({ content: [] });
  const [tbldata, setTbldata] = React.useState([]);
  const { logout } = useAuth();
  const [data, setData] = useState({ content: [] });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ field: "", order: "asc" });
  const [filters, setFilters] = useState({});
  const [activeView, setActiveView] = useState("applications"); // 'applications' or 'agents'

  const columns = [
    {
      ...COLUMN_DEFINITIONS.application_id,
      field: "application_id", // Changed to application_no based on provided JSON
      type: "text",
    },
    // { ...COLUMN_DEFINITIONS.status, field: "status", type: "text" }, 
    {
      ...COLUMN_DEFINITIONS.middle_name,
      field: "fullName", // New field to display full name
      header: "Applicant Name", // Change header for clarity
      type: "text",
    },
    {
      ...COLUMN_DEFINITIONS.agent_id,
      field: "agent_id", 
    },
    {
      ...COLUMN_DEFINITIONS.approved_admin_id,
      field: "admin_id", 
    },
    {
      ...COLUMN_DEFINITIONS.account_open_date,
      field: "created_at", // This field doesn't exist in the provided JSON, consider removing or mapping to created_at/updated_at if relevant
      type: "date",
    },
    { ...COLUMN_DEFINITIONS.account_no, field: "account_no", type: "text" }, // This field doesn't exist in the provided JSON
  ];

  const countColumns = [
    { header: "Agent ID", field: "agent_id", type: "text" },
    { header: "Approved Count", field: "approved_count", type: "text" },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllApprovedApplications({
        page: currentPage,
        sort: sortConfig.field ? `${sortConfig.field},${sortConfig.order}` : "",
        ...filters,
      });

      // Process the data to include a 'fullName' field
      const processedData = response.data.map(item => ({
        ...item,
        fullName: `${item.first_name || ''} ${item.last_name || ''}`.trim(),
      }));

      setTbldata(processedData || []);
      setData({ content: processedData || [] });
    } catch (error) {
      console.error("Failed to fetch approved applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataCount = async () => {
    try {
      setCountLoading(true);
      const response = await adminService.approvedApplicationCountByAgent();
      console.log('agent counts : ', response)
      setCountData({ content: response.data || [] });
    } catch (error) {
      console.error("No agent table:", error);
    } finally {
      setCountLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataCount();
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

  const toggleView = (view) => {
    setActiveView(view);
  };

  return (
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
        {/* View Toggle Buttons */}
        <div className="flex mb-4">
          <button
            onClick={() => toggleView("applications")}
            className={`px-4 py-2 rounded ${
              activeView === "applications"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            Application List
          </button>
          <button
            onClick={() => toggleView("agents")}
            className={`px-4 py-2 rounded ${
              activeView === "agents"
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
          >
            List by Agent
          </button>
        </div>

        {/* Application List Table */}
        {activeView === "applications" && (
          <div className="bank-master w-300px min-w-300px">
            <DataTable
              data={data}
              columns={columns}
              basePath="/verify-account"
              onSort={handleSort}
              onFilter={handleFilter}
              onPageChange={handlePageChange}
              loading={loading}
              primaryKeys={["application_id"]} 
              editButtonDisabled={true}
            />
          </div>
        )}

        {/* Agent Count Table */}
        {activeView === "agents" && (
          <div className="bank-master w-300px min-w-300px">
            <DataTable
              data={countData}
              columns={countColumns}
              basePath=""
              loading={countLoading}
              primaryKeys={["agent_id"]}
              hidePagination={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ApprovedTable; 
 