import { useAuth } from '../../auth/AuthContext';
import { agentService } from '../../services/apiServices'; // <-- Import your service
import DataTable from '../../components/DataTable';
import { COLUMN_DEFINITIONS } from '../../components/DataTable/config/columnConfig'; // <-- Import your column definitions
import React, { useState, useEffect } from "react"; // Import necessary hooks from React


function PendingTable() {
  const storedId = localStorage.getItem('userCode') || 1;
  const [tbldata, setTbldata] = React.useState([]);
  const { logout } = useAuth();
  const [data, setData] = useState({ content: [] });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ field: "", order: "asc" });
  const [filters, setFilters] = useState({});

  const columns = [
    { ...COLUMN_DEFINITIONS.id, field: "id", type: "text" },
    { ...COLUMN_DEFINITIONS.application_id, field: "", type: "text" },
    {
      // Updated column for Applicant Name
      header: "Applicant Name", // Changed header for clarity
      field: "fullName", // This field will be created in fetchData
      type: "text",
    },
    { ...COLUMN_DEFINITIONS.created_at, field: "created_at", type: "date" },
    { ...COLUMN_DEFINITIONS.review_admin_id, field: "admin_id", type: "text" },
    { ...COLUMN_DEFINITIONS.review_status_comment, field: "status_comment", type: "text" },
  ];


  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await agentService.reviewAccounts(storedId, {
        page: currentPage,
        sort: sortConfig.field ? `${sortConfig.field},${sortConfig.order}` : "",
        ...filters,
      });

      // Process the data to include 'fullName'
      const processedData = response.data
        ? response.data.map(item => ({
          ...item,
          fullName: `${item.first_name || ''} ${item.last_name || ''}`.trim(), // Combine first_name and last_name
        }))
        : [];

      // Set both states correctly
      setTbldata(processedData || []);
      setData({ content: processedData || [] }); // This is what DataTable expects
    } catch (error) {
      console.error("Failed to fetch pending applications:", error);
    } finally {
      setLoading(false);
    }
  };

  /*
  The `useEffect` hook is used to perform side effects in the component.
  In this case, it ensures that `fetchBranches()` is called whenever
  certain dependencies change.
*/

  /*
  `fetchBranches();`
  - Calls the function to fetch bank data from the API.
  - This ensures that the latest data is retrieved whenever filters, sorting, or pagination change.
*/
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
          {/* Header and Search section */}
          <div
            className="search-user-container"
            style={{ display: "flex", justifyContent: "space-between" }}
          >

            {/* Action Buttons */}
            <div className="button-section"> </div>
          </div>

          <div className="bank-master" >
            <DataTable
              data={data}
              columns={columns}
              basePath="/enrollment_review"
              onSort={handleSort}
              onFilter={handleFilter}
              onPageChange={handlePageChange}
              loading={loading}
              primaryKeys={["id"]}
            />
          </div>
        </div>
      </div>



    </>);
}

export default PendingTable;
  