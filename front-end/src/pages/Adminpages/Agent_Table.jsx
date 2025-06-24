 
import React, { useState, useEffect } from "react";  
import { COLUMN_DEFINITIONS } from '../../components/DataTable/config/columnConfig';
import { userService } from "../../services/apiServices";
import DataTable from '../../components/DataTable';
import { AUTH_KEYS } from "../../services/authService";
import { useLocation } from "react-router-dom";


// import React, { useState, useEffect } from "react";
// import "../../../Theme/MasterTable.css";
// import SearchFilter2 from "../../SearchFilter2/SearchFilter2";
// import Button from "../../Button/Button";
// import { COLUMN_DEFINITIONS } from "../../common/DataTable/config/columnConfig";
// import { userService } from "../../../services/apiServices";
// import { ToastContainer, toast } from "react-toastify";
// import DataTable from "../../common/DataTable";
// import { AUTH_KEYS } from "../../../services/authService";
// import { useLocation } from "react-router-dom";

const UserMaster = () => {
  const [selectedFilter, setSelectedFilter] = useState("userName");
  const [users, setUsers] = useState({
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: 0,
    size: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filters, setFilters] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [branchName, setBranchName] = useState(null);

  /**
   * Retrieves the stored branch name from local storage on component mount.
   *
   * - Reads `AUTH_KEYS.BRANCH_NAME` from `localStorage`.
   * - If a value exists, updates the `branchName` state.
   * - Runs only once on component mount (`[]` dependency array).
   */
  useEffect(() => {
    const storedBranchName = localStorage.getItem(AUTH_KEYS.BRANCH_NAME);
    if (storedBranchName) {
      setBranchName(storedBranchName);
    }
  }, []);


  const location = useLocation();
    const currentRoute = location.pathname.split("/").pop(); // "productmaster"
  
    const [permissions, setPermissions] = useState({
      create: false,
      modify: false,
      authorize: false,
      view: false,
      delete: false,
    });
  
    useEffect(() => {
      const permissionMap = JSON.parse(localStorage.getItem("PERMISSION_MAP"));
      if (permissionMap && permissionMap[currentRoute]) {
        setPermissions(permissionMap[currentRoute]);
      }
    }, [currentRoute]);
  
  // Define table columns
  /**
   * Column definitions for user data table.
   *
   * - Uses predefined column properties from `COLUMN_DEFINITIONS`.
   * - Each column includes:
   *   - `field`: Maps to a specific property in user data.
   *   - `type`: Defines the expected data type for rendering.
   *   - Optional `format`: Customizes data presentation when needed.
   */
  const columns = [
    { ...COLUMN_DEFINITIONS.userName, field: "userName", type: "text" },
    { ...COLUMN_DEFINITIONS.employeeCode, field: "employeeCode", type: "text" },
    {
      ...COLUMN_DEFINITIONS.workingBranchId,
      field: "workingBranchId",
      type: "text",
    },
    {
      ...COLUMN_DEFINITIONS.mobileNumber,
      field: "mobileNumber",
      type: "integer",
    },
    { ...COLUMN_DEFINITIONS.emailId, field: "emailId", type: "text" },
    {
      ...COLUMN_DEFINITIONS.multiBranchAccessYN,
      field: "multiBranchAccessYN",
      format: (rowData) => (rowData.multiBranchAccessYN ? "Yes" : "No"),
      type: "text",
    },
  ];

  /**
   * Fetches user data with pagination, filtering, and transformation.
   *
   * @param {number} page - Current page number (default: 0).
   * @param {number} size - Number of records per page (default: pageSize).
   * @param {object} filtersData - Filter criteria for searching users (default: filters).
   */
  const fetchUsers = async (
    page = 0,
    size = pageSize,
    filtersData = filters
  ) => {
    try {
      setIsLoading(true);
      const users = await userService.search({ ...filtersData, page, size });

      // Transform the data
      const transformedData = {
        ...users,
        content: users.content.map((userCode) => ({
          ...userCode,
          multiBranchAccessYN: userCode.multiBranchAccessYN ? "Yes" : "No", // Transform boolean to "Yes" or "No"
          workingBranchId: branchName || userCode.workingBranchId, // Replace branch code with branch name
        })),
      };

      // Update the state with the transformed data
      setUsers(transformedData);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users. Please try again.");
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * useEffect hook to fetch users whenever dependencies change.
   *
   * This effect runs whenever `currentPage`, `filters`, or `branchName` changes.
   * It ensures that the user list is updated dynamically based on the latest filters and pagination.
   */
  useEffect(() => {
    if (branchName) {
      fetchUsers();
    }
  }, [currentPage, filters, branchName]);

  /**
   * Handles search functionality by updating filter criteria and fetching filtered user data.
   *
   * @param {object} updatedFilters - The new filter criteria provided by the user.
   */
  const handleSearch = (updatedFilters) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters, ...updatedFilters };
      fetchUsers(0, pageSize, newFilters); // Fetch data using the new filters
      return newFilters; // Update state
    });
  };

  /**
   * Handles the refresh action by resetting filters and fetching all user records.
   */
  const handleRefresh = () => {
    setFilters({}); // Reset filters
    fetchUsers(0, pageSize, {}); // Fetch all records
  };

  /**
   * Handles changes in the filter selection.
   *
   * @param {Event} e - The event object from the dropdown selection.
   */
  const handleFilterChange = (e) => {
    const newFilter = e.target.value;
    console.log("Filter changed to:", newFilter);
    setSelectedFilter(newFilter);
    setSearchValue(""); // Reset input when filter changes
    setFilters({}); // Reset filters
  };

  /**
   * Fetches user data on the initial component mount.
   * Runs only once when the component is rendered for the first time.
   */
  useEffect(() => {
    fetchUsers();
  }, []);

  // Show loading indicator while data is being fetched
  if (isLoading) return <div>Loading...</div>;

  // Display a fallback message if no user data is available
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* Main container for the UserMaster page */}
      <div
        className="Usermaster-main-div"
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          borderRadius: "30px",
        }}
      >
 

        {/* DataTable component */}
        <DataTable
          data={users}
          columns={columns}
          basePath="/home/usermaster"
          onPageChange={(page) => fetchUsers(page, pageSize, filters)} // Corrected to use fetchUsers
          primaryKeys={["userCode"]}
          fetchData={fetchUsers}
          loading={isLoading}
          editButtonDisabled={!permissions.modify}
          viewButtonDisabled={!permissions.view}
        />
      </div>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default UserMaster;
