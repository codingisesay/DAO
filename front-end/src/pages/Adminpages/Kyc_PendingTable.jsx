import { useAuth } from '../../auth/AuthContext';  
import { kycPendingApplicationsService, adminService } from '../../services/apiServices';
import DataTable from '../../components/DataTable';
import { COLUMN_DEFINITIONS } from '../../components/DataTable/config/columnConfig';
import React, { useState, useEffect } from "react";

function KycPendingTable() {
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

  const countColumns = [
    { header: "Agent ID", field: "kyc_agent_id", type: "text" },
    { header: "Pending Count", field: "pending_count", type: "text" }
  ];

  const columns = [
    { ...COLUMN_DEFINITIONS.id, field: "kyc_application_id", type: "text" },
    { ...COLUMN_DEFINITIONS.agent_id, field: "kyc_agent_id", type: "text" },
    { ...COLUMN_DEFINITIONS.created_at, field: "created_at", type: "date" },
    { ...COLUMN_DEFINITIONS.first_name, field: "kyc_vscbs_first_name", type: "text" },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await kycPendingApplicationsService.getList({
        page: currentPage,
        sort: sortConfig.field ? `${sortConfig.field},${sortConfig.order}` : "",
        ...filters,
      });
      setTbldata(response.data || []);
      setData({ content: response.data || [] });
    } catch (error) {
      console.error("Failed to fetch pending applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataCount = async () => {
    try {
      setCountLoading(true);
      const response = await adminService.kycPendingApplicationCountByAgent();
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
            Pending Applications
          </button>
          <button
            onClick={() => toggleView('agents')}
            className={`px-4 py-2 rounded-r ${activeView === 'agents' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Pending by Agent
          </button>
        </div>

        {/* Pending Applications Table */}
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
              hidePagination={true}  showActions={false} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default KycPendingTable;

