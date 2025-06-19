import { useAuth } from '../../auth/AuthContext';  
import { agentService, adminService } from '../../services/apiServices';
import DataTable from '../../components/DataTable';
import { COLUMN_DEFINITIONS } from '../../components/DataTable/config/columnConfig';
import React, { useState, useEffect } from "react";

function PendingTable() {
    const storedId = localStorage.getItem('agent_id') || 1;
    const [tbldata, setTbldata] = React.useState([]);
    const { logout } = useAuth(); 
    const [data, setData] = useState({ content: [] });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortConfig, setSortConfig] = useState({ field: "", order: "asc" });
    const [filters, setFilters] = useState({});
    const [countData, setCountData] = useState({ content: [] });
    const [countLoading, setCountLoading] = useState(false);

    // Columns for the main applications table
    const columns = [
        { ...COLUMN_DEFINITIONS.id, field: "id", type: "text" },
        { ...COLUMN_DEFINITIONS.created_at, field: "created_at", type: "date" },
        { ...COLUMN_DEFINITIONS.application_no, field: "id", type: "text" },
        { ...COLUMN_DEFINITIONS.middle_name, field: "first_name", type: "text" },
        { ...COLUMN_DEFINITIONS.open_date, field: "created_at", type: "date" },
    ];

    // Columns for the agent counts table
    const countColumns = [
        { header: "Agent ID", field: "agent_id", type: "text" },
        { header: "Pending Count", field: "pending_count", type: "text" }
    ];

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await agentService.pendingAccounts(storedId, {
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
            const response = await adminService.pendingApplicationCountByAgent;
            console.log("PENDING APPLICATION COUNT:", response);   
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

    return (
        <>
            <div className="container mx-auto">
                <br /><br />  
                <h1>Pending Applications</h1>
                <br /><br />  
                <div
                    className="Usermaster-main-div"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "30px",
                    }}
                >
                    {/* Main Applications Table */}
                    <div className="bank-master">
                        <DataTable
                            data={data}
                            columns={columns}
                            basePath="/verify-account"
                            onSort={handleSort}
                            onFilter={handleFilter}
                            onPageChange={handlePageChange}
                            loading={loading}
                            primaryKeys={["application_id"]} 
                        />
                    </div>

                    <br /><br />
                    <h2>Pending Applications Count by Agent</h2>
                    <br />

                    {/* Agent Counts Table */}
                    <div className="bank-master">
                        <DataTable
                            data={countData}
                            columns={countColumns}
                            basePath="" // No base path needed for this table
                            loading={countLoading}
                            primaryKeys={["agent_id"]}
                            hidePagination={true} // Assuming you want a simple table without pagination
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default PendingTable;
 