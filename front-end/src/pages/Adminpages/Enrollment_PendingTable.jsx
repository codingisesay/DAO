 
import { useAuth } from '../../auth/AuthContext';  
import { adminService } from '../../services/apiServices'; // <-- Import your service
import DataTable from '../../components/DataTable';
import { COLUMN_DEFINITIONS } from '../../components/DataTable/config/columnConfig'; // <-- Import your column definitions
import React, { useState, useEffect } from "react"; // Import necessary hooks from React
 


function PendingTable() {
   
    const [countLoading, setCountLoading] = useState(false);
       const [countData, setCountData] = useState({ content: [] });
    const [tbldata, setTbldata] = React.useState([]);
    const { logout } = useAuth(); 
    const [data, setData] = useState({ content: [] });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortConfig, setSortConfig] = useState({ field: "", order: "asc" });
    const [filters, setFilters] = useState({});


  const columns = [
    { ...COLUMN_DEFINITIONS.id, field: "id", type: "text" },
    { ...COLUMN_DEFINITIONS.created_at, field: "created_at", type: "date" },
    { ...COLUMN_DEFINITIONS.kyc_application_id, field: "kyc_application_id", type: "text" },
    { ...COLUMN_DEFINITIONS.middle_name, field: "middle_name", type: "text" },
  ];

    // Columns for the agent counts table
    const countColumns = [
        { header: "Agent ID", field: "agent_id", type: "text" },
        { header: "Pending Count", field: "pending_count", type: "text" }
    ];

  
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await adminService.getAllApplicationsPending({
      page: currentPage,
      sort: sortConfig.field ? `${sortConfig.field},${sortConfig.order}` : "",
      ...filters,
    });
    console.log("Pending Table Err:", response); // Debugging line to check the response structure
    // Set both states correctly
    setTbldata(response.data || []);
    setData({ content: response.data || [] }); // This is what DataTable expects
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
    fetchData();fetchDataCount();
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
                <br />  <br />  
                <h1>Pending Application</h1>
                  <br />  <br />  
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
                        basePath="/verify-account"
                        onSort={handleSort}
                        onFilter={handleFilter}
                        onPageChange={handlePageChange}
                        loading={loading}
                        primaryKeys={["application_id"]} 
                    />
                    </div>
            </div>
            
                    {/* <h2>Pending Applications Count by Agent</h2>
                    
                    <div className="bank-master">
                        <DataTable
                            data={countData}
                            columns={countColumns}
                            basePath="" // No base path needed for this table
                            loading={countLoading}
                            primaryKeys={["agent_id"]}
                            hidePagination={true} // Assuming you want a simple table without pagination
                        />
                    </div> */}
        </div>
                
       

        </>);
}

export default PendingTable;


 