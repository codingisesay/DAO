import { useAuth } from '../../auth/AuthContext';
import { adminService, kycReviewApplicationsService } from '../../services/apiServices';
import DataTable from '../../components/DataTable';
import { COLUMN_DEFINITIONS } from '../../components/DataTable/config/columnConfig';
import React, { useState, useEffect } from "react";

function KycReviewTable() {
  const [tbldata, setTbldata] = React.useState([]);
  const [countLoading, setCountLoading] = useState(false);
  const [countData, setCountData] = useState({ content: [] });
  const [data, setData] = useState({ content: [] });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortConfig, setSortConfig] = useState({ field: "", order: "asc" });
  const [filters, setFilters] = useState({});
  const [activeView, setActiveView] = useState('applications'); // 'applications' or 'agents'

  const getReviewComments = (item) => { 
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
    
    return comments.length > 0 ? comments.join('; ') : 'No review comments';
  };

  const countColumns = [
    { header: "Agent ID", field: "kyc_agent_id", type: "text" },
    { header: "Review Count", field: "review_count", type: "text" }
  ];

  const columns = [
    { ...COLUMN_DEFINITIONS.id, field: "id", type: "text" },
    { ...COLUMN_DEFINITIONS.created_at, field: "created_at", type: "date" }, 
    { 
      header: "First Name", 
      field: "kyc_vscbs_first_name", 
      type: "text" 
    },
    { 
      header: "Admin ID", 
      field: "kyc_admin_id", 
      type: "text" 
    },  
    {
      header: "Review Comments", 
      field: "review_comments", 
      type: "text",
      render: (rowData) => getReviewComments(rowData)
    },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await kycReviewApplicationsService.getList({
        page: currentPage,
        sort: sortConfig.field ? `${sortConfig.field},${sortConfig.order}` : "",
        ...filters,
      });
      
      const processedData = response.data ? response.data.map(item => ({
        ...item,
        review_comments: getReviewComments(item)
      })) : [];
      
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
      const response = await adminService.kycReviewApplicationCountByAgent;
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
            Review Applications
          </button>
          <button
            onClick={() => toggleView('agents')}
            className={`px-4 py-2 rounded-r ${activeView === 'agents' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          >
            Reviews by Agent
          </button>
        </div>

        {/* Review Applications Table */}
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
              hidePagination={true}  showActions={false} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default KycReviewTable;
















// import { useAuth } from '../../auth/AuthContext';
// import { adminService, kycReviewApplicationsService } from '../../services/apiServices';
// import DataTable from '../../components/DataTable';
// import { COLUMN_DEFINITIONS } from '../../components/DataTable/config/columnConfig';
// import React, { useState, useEffect } from "react";

// function KycReviewTable() {
 
//   const [countLoading, setCountLoading] = useState(false);
//   const [countData, setCountData] = useState({ content: [] });

//   const [tbldata, setTbldata] = React.useState([]);
//   const [data, setData] = useState({ content: [] });
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [sortConfig, setSortConfig] = useState({ field: "", order: "asc" });
//   const [filters, setFilters] = useState({});

//   const getReviewComments = (item) => { 
//     const comments = [];
    
//     // Check all possible status comment fields
//     const statusFields = [
//       'kyc_data_after_vs_cbs_status_comment',
//       'kyc_document_approved_status_comment', 
//     ];
    
//     statusFields.forEach(field => {
//       if (item[field]) {
//         // Format the field name for display
//         const fieldName = field
//           .replace('kyc_', '')
//           .replace(/_comment$/, '')
//           .replace(/_/g, ' ')
//           .replace(/\b\w/g, l => l.toUpperCase());
//         comments.push(`${fieldName}: ${item[field]}`);
//       }
//     });
    
//     return comments.length > 0 ? comments.join('; ') : 'No review comments';
//   };

  
    
//   const countColumns = [
//     { header: "Agent ID", field: "kyc_agent_id", type: "text" },
//     { header: "Review Count", field: "review_count", type: "text" }
//   ];

//   const columns = [
//     { ...COLUMN_DEFINITIONS.id, field: "id", type: "text" },
//     { ...COLUMN_DEFINITIONS.created_at, field: "created_at", type: "date" }, 
//     { 
//       header: "First Name", 
//       field: "kyc_vscbs_first_name", 
//       type: "text" 
//     },
//     { 
//       header: "Admin ID", 
//       field: "kyc_admin_id", 
//       type: "text" 
//     },  
//     {
//       header: "Review Comments", 
//       field: "review_comments", 
//       type: "text",
//       render: (rowData) => getReviewComments(rowData)
//     },
//   ];

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const response = await kycReviewApplicationsService.getList({
//         page: currentPage,
//         sort: sortConfig.field ? `${sortConfig.field},${sortConfig.order}` : "",
//         ...filters,
//       });
      
//       // Process the data to include review_comments field
//       const processedData = response.data ? response.data.map(item => ({
//         ...item,
//         review_comments: getReviewComments(item) // Add the computed review comments
//       })) : [];
      
//       setTbldata(processedData);
//       setData({ content: processedData });
    
//     } catch (error) {
//       console.error("Failed to fetch pending applications:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

  
//   const fetchDataCount = async () => {
//     try {
//       setCountLoading(true);
//       const response = await adminService.kycReviewApplicationCountByAgent;
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
//     <div className="container mx-auto">
//       <br />
//       <div
//         className="Usermaster-main-div"
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           borderRadius: "30px",
//         }}
//       >
//         <div className="bank-master">
//           <DataTable
//             data={data}
//             columns={columns}
//             basePath="/kyc-verification"
//             onSort={handleSort}
//             onFilter={handleFilter}
//             onPageChange={handlePageChange}
//             loading={loading}
//             primaryKeys={["kyc_application_id"]}
//             editButtonDisabled={true}
//           />
//         </div>
//                      <div className="bank-master w-300px min-w-300px">
//                     <DataTable
//                       data={countData}
//                       columns={countColumns}
//                       basePath=""
//                       loading={countLoading}
//                       primaryKeys={["agent_id"]}
//                       hidePagination={true}
//                     />
//                   </div>
//       </div>
//     </div>
//   );
// }

// export default KycReviewTable;
 