import { useAuth } from "../../auth/AuthContext";
import {
  kycPendingApplicationsService,
  adminService,
  agentService,
} from "../../services/apiServices";
import DataTable from "../../components/DataTable";
import { COLUMN_DEFINITIONS } from "../../components/DataTable/config/columnConfig";
import React, { useState, useEffect } from "react";

function ReviewTable() {
  const [tbldata, setTbldata] = React.useState([]);
  const { logout } = useAuth();
  const [countLoading, setCountLoading] = useState(false);
  const [countData, setCountData] = useState({ content: [] });
  const [data, setData] = useState({ content: [] });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ field: "", order: "asc" });
  const [filters, setFilters] = useState({});
  const [activeView, setActiveView] = useState("applications"); // 'applications' or 'agents'

  // Function to collect all review comments
  const getReviewComments = (item) => {
    const comments = [];

    // Check all possible status comment fields
    const statusFields = [
      "status_comment",
      "account_personal_details_status_comment",
      "application_address_details_status_comment",
      "agent_live_photos_status_comment",
      "applicant_live_photos_status_comment",
      "application_personal_details_status_comment",
      "application_service_status_status_comment",
      "document_approved_status_status_comment",
      "nominee_approved_status_status_comment",
    ];

    statusFields.forEach((field) => {
      if (item[field]) {
        // Format the field name for display (remove '_comment' and make it readable)
        const fieldName = field
          .replace(/_comment$/, "")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());
        comments.push(`${fieldName}: ${item[field]}`);
      }
    });

    return comments.length > 0 ? comments.join("; ") : "No review comments";
  };

  const columns = [
        {
          ...COLUMN_DEFINITIONS.agent_id,
          field: "agent_id", 
        },
    { ...COLUMN_DEFINITIONS.id, field: "id", type: "text" },
    { ...COLUMN_DEFINITIONS.created_at, field: "created_at", type: "date" },
    { 
      header: "Customer Name", field: "fullName",   type: "text",
    }, 
    { ...COLUMN_DEFINITIONS.review_admin_id, field: "admin_id", type: "text" },
    {
      header: "Review Reason",
      field: "review_comments",
      type: "text",
      render: (rowData) => getReviewComments(rowData),
    },
  ];

  const countColumns = [
    { header: "Agent ID", field: "agent_id", type: "text" },
    { header: "Review Count", field: "review_count", type: "text" },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllReviewApplications({
        page: currentPage,
        sort: sortConfig.field ? `${sortConfig.field},${sortConfig.order}` : "",
        ...filters,
      });

      // Process the data to include 'fullName' and all review comments
      const processedData = response.data
        ? response.data.map((item) => ({
            ...item,
            fullName: `${item.first_name || ''} ${item.last_name || ''}`.trim(), // Added fullName
            review_comments: getReviewComments(item),
          }))
        : [];

      setTbldata(processedData);
      setData({ content: processedData });
    } catch (error) {
      console.error("Failed to fetch review applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataCount = async () => {
    try {
      setCountLoading(true);
      const response = await adminService.reviewApplicationCountByAgent();
      console.log("REVIEW APPLICATION COUNT:", response);
      setCountData({ content: response.data || [] });
    } catch (error) {
      console.error("No agent tbl :", error);
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
              basePath="/enrollment_review"
              onSort={handleSort}
              onFilter={handleFilter}
              onPageChange={handlePageChange}
              loading={loading}
              primaryKeys={["id"]}
              editButtonDisabled={true}
              viewButtonDisabled={false}
            />
          </div>
        )}

        {/* Agent Count Table */}
        {activeView === "agents" && (
          <div className="bank-master w-300px min-w-300px">
            <DataTable
              data={countData}
              columns={countColumns}
              basePath="/agent"
              loading={countLoading}
              primaryKeys={["agent_id"]}
              hidePagination={true}
              editButtonDisabled={true}
              // showActions={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewTable; 