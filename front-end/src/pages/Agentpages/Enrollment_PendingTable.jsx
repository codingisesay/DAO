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

    // Columns for the main applications table
    const columns = [
        { ...COLUMN_DEFINITIONS.id, field: "id", type: "text" },
        { ...COLUMN_DEFINITIONS.created_at, field: "created_at", type: "date" },
        { ...COLUMN_DEFINITIONS.application_no, field: "id", type: "text" },
        { ...COLUMN_DEFINITIONS.middle_name, field: "first_name", type: "text" },
        { ...COLUMN_DEFINITIONS.open_date, field: "created_at", type: "date" },
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
    useEffect(() => {
        fetchData();
        // fetchDataCount();
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
                            primaryKeys={["id"]}
                        />
                    </div>


                </div>
            </div>
        </>
    );
}

export default PendingTable;
