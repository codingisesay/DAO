 
import { useAuth } from '../../auth/AuthContext';  
import { adminService } from '../../services/apiServices'; // <-- Import your service
import DataTable from '../../components/DataTable';
import { COLUMN_DEFINITIONS } from '../../components/DataTable/config/columnConfig'; // <-- Import your column definitions

import React, { useState, useEffect } from "react"; // Import necessary hooks from React
 


function ApprovedTable() {
   
    const [tbldata, setTbldata] = React.useState([]);
    const { logout } = useAuth(); 
   const [data, setData] = useState({ content: [] });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ field: "", order: "asc" });
  const [filters, setFilters] = useState({});


  const columns = [
    { ...COLUMN_DEFINITIONS.application_id, field: "application_id", type: "text" },
    { ...COLUMN_DEFINITIONS.first_name, field: "status", type: "text" },
    { ...COLUMN_DEFINITIONS.last_name, field: "first_name", type: "date" },
    { ...COLUMN_DEFINITIONS.middle_name, field: "middle_name", type: "text" },
    { ...COLUMN_DEFINITIONS.account_open_date, field: "account_open_date", type: "date" },
    { ...COLUMN_DEFINITIONS.account_no, field: "account_no", type: "text" },
  ];

  
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await adminService.getAllApprovedApplications({
      page: currentPage,
      sort: sortConfig.field ? `${sortConfig.field},${sortConfig.order}` : "",
      ...filters,
    });
    // Set both states correctly
    setTbldata(response.data || []);
    setData({ content: response.data || [] }); // This is what DataTable expects
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
                <br />    <br />
                <h1>Approved Application</h1>    <br />    <br />
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
                        basePath="/home/bankmaster"
                        onSort={handleSort}
                        onFilter={handleFilter}
                        onPageChange={handlePageChange}
                        loading={loading}
                        primaryKeys={["bankCode"]} 
                    />
                    </div>
            </div>
        </div>
                
       

        </>);
}
 
export default ApprovedTable;

 