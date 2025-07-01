import { useAuth } from '../../auth/AuthContext';  
import { adminService, kycApprovedApplicationsService } from '../../services/apiServices';
import DataTable from '../../components/DataTable';
import { COLUMN_DEFINITIONS } from '../../components/DataTable/config/columnConfig';
import React, { useState, useEffect } from "react";

function KycApprovedTable() {
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

  const getApprovalComments = (item) => { 
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
    
    return comments.length > 0 ? comments.join('; ') : 'No approval comments available';
  };

  const countColumns = [
    { header: "Agent ID", field: "kyc_agent_id", type: "text" },
    { header: "Approved Count", field: "approved_count", type: "text" }
  ];

  const columns = [
    { ...COLUMN_DEFINITIONS.application_no, field: "kyc_application_id", type: "text" },
    { ...COLUMN_DEFINITIONS.first_name, field: "kyc_vscbs_first_name", type: "text" },
    { ...COLUMN_DEFINITIONS.cust_no, field: "", type: "text" },
    { ...COLUMN_DEFINITIONS.approved_by, field: "updated_by", type: "text" },
    { ...COLUMN_DEFINITIONS.account_open_date, field: "updated_at", type: "date" },
    { ...COLUMN_DEFINITIONS.account_no, field: "kyc_application_no", type: "text" },
    {
      header: "Approval Comments", 
      field: "approval_comments", 
      type: "text",
      render: (rowData) => getApprovalComments(rowData)
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await kycApprovedApplicationsService.getList({
        page: currentPage,
        sort: sortConfig.field ? `${sortConfig.field},${sortConfig.order}` : "",
        ...filters,
      });
      
      const processedData = response.data ? response.data.map(item => ({
        ...item,
        approval_comments: getApprovalComments(item)
      })) : [];
      
      setTbldata(processedData);
      setData({ content: processedData });
    } catch (error) {
      console.error("Failed to fetch approved applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataCount = async () => {
    try {
      setCountLoading(true);
      const response = await adminService.kycApprovedApplicationCountByAgent;
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
            Approved Applications
          </button>
          <button
            onClick={() => toggleView('agents')}
            className={`px-4 py-2 rounded-r ${activeView === 'agents' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Approved by Agent
          </button>
        </div>

        {/* Approved Applications Table */}
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
              primaryKeys={["id"]}
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
              hidePagination={true}  showActions={false} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default KycApprovedTable;





// import { useAuth } from '../../auth/AuthContext';  
// import { adminService, kycApprovedApplicationsService } from '../../services/apiServices'; // <-- Import your service
// import DataTable from '../../components/DataTable';
// import { COLUMN_DEFINITIONS } from '../../components/DataTable/config/columnConfig'; // <-- Import your column definitions

// import React, { useState, useEffect } from "react"; // Import necessary hooks from React



// function KycApprovedTable() {
    
//   const [countLoading, setCountLoading] = useState(false);
//   const [countData, setCountData] = useState({ content: [] });
  
//   const [tbldata, setTbldata] = React.useState([]);
//   const { logout } = useAuth(); 
//   const [data, setData] = useState({ content: [] });
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [sortConfig, setSortConfig] = useState({ field: "", order: "asc" });
//   const [filters, setFilters] = useState({});
 
//   const countColumns = [
//     { header: "Agent ID", field: "kyc_agent_id", type: "text" },
//     { header: "Approved Count", field: "approved_count", type: "text" }
//   ];

//   const columns = [
//     { ...COLUMN_DEFINITIONS.application_no, field: "kyc_application_id", type: "text" },
//     { ...COLUMN_DEFINITIONS.first_name, field: "kyc_vscbs_first_name", type: "text" },
//     { ...COLUMN_DEFINITIONS.cust_no, field: "", type: "text" },
//     { ...COLUMN_DEFINITIONS.approved_by, field: "updated_by", type: "text" },
//     { ...COLUMN_DEFINITIONS.account_open_date, field: "updated_at", type: "date" },
//     { ...COLUMN_DEFINITIONS.account_no, field: "kyc_application_no", type: "text" },
//   ];

  
// const fetchData = async () => {
//   try {
//     setLoading(true);
//     const response = await kycApprovedApplicationsService.getList({
//       page: currentPage,
//       sort: sortConfig.field ? `${sortConfig.field},${sortConfig.order}` : "",
//       ...filters,
//     });
//     // Set both states correctly
//     setTbldata(response.data || []);
//     setData({ content: response.data || [] }); // This is what DataTable expects
//   } catch (error) {
//     console.error("Failed to fetch pending applications:", error);
//   } finally {
//     setLoading(false);
//   }
// };
 


//   const fetchDataCount = async () => {
//     try {
//       setCountLoading(true);
//       const response = await adminService.kycApprovedApplicationCountByAgent;
//       // console.log(response.data)
//       setCountData({ content: response.data || [] });
//     } catch (error) {
//       console.error("No agent table:", error);
//     } finally {
//       setCountLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchDataCount();
//   }, [currentPage, sortConfig, filters]);

//   const handleSort = (field, order) => {
//     setSortConfig({ field, order });
//   };

//   const handleFilter = (newFilters) => {
//     setFilters(newFilters);
//     setCurrentPage(0);
//   };
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };


//   return (
//     <>

//       <div className="container mx-auto">
//         <br />
//         <div
//           className="Usermaster-main-div"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             borderRadius: "30px",
//           }}
//         >
//           {/* Header and Search section */}
//           <div
//             className="search-user-container"
//             style={{ display: "flex", justifyContent: "space-between" }}
//           >

//             {/* Action Buttons */}
//             <div className="button-section"> </div>
//           </div>

//           <div className="bank-master" >
//             <DataTable
//               data={data}
//               columns={columns}
//               basePath="/kyc-verification"
//               onSort={handleSort}
//               onFilter={handleFilter}
//               onPageChange={handlePageChange}
//               loading={loading}
//               primaryKeys={["id"]}
//               editButtonDisabled={true}
//             />
//           </div>

//                        <div className="bank-master w-300px min-w-300px">
//             <DataTable
//               data={countData}
//               columns={countColumns}
//               basePath=""
//               loading={countLoading}
//               primaryKeys={["agent_id"]}
//               hidePagination={true}
//             />
//           </div>
//         </div>
//       </div>



//     </>);
// }

// export default KycApprovedTable;

