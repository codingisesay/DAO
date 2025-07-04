import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { NavLink } from "react-router-dom";
import { IconButton, Tooltip, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import "./styles/DataTable.css";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const DataTable = ({
  data = { content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 },
  columns = [],
  basePath = "",
  fetchData,
  loading = false,
  primaryKeys = ["id"],
  showActions = true,
  showEditButton = true,
  showViewButton = true,
  editButtonDisabled,
  viewButtonDisabled,
}) => {
  const [page, setPage] = useState(data.number);
  const [pageSize, setPageSize] = useState(data.size);

  useEffect(() => {
    setPage(data.number);
    setPageSize(data.size);
  }, [data]);

  const getActionPath = (row) => primaryKeys.map((key) => row[key]).join("/");

  // Add serial number column as the first column
  const muiColumns = [
    // {
    //   name: 'serialNo',
    //   label: 'S.No',
    //   options: {
    //     filter: false,
    //     sort: false,
    //     customBodyRender: (value, tableMeta) => {
    //       // Calculate serial number based on current page and row index
    //       const serialNo = page * pageSize + tableMeta.rowIndex + 1;
    //       return <div style={{ textAlign: 'center' }}>{serialNo}</div>;
    //     },
    //   },
    // },
    ...columns.map((col) => ({
      name: col.field,
      label: col.header,
      options: {
        filter: true,
        sort: col.sortable,
        filterType: col.filterType || "dropdown",
        filterOptions: col.filterOptions || {},
        customBodyRender: (value) => {
          if (col.type === "date") {
            return formatDate(value);
          } else if (["integer", "float", "double"].includes(col.type)) {
            return <div style={{ textAlign: "right" }}>{value}</div>;
          } else if (col.type === "amount") {
            return (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                }}
              >
                <span>₹</span>
                <span style={{ textAlign: "right", flex: 1 }}>
                  {parseFloat(value).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            );
          }
          return <div style={{ textAlign: "left" }}>{value}</div>;
        },
      },
    })),
  ];

  if (showActions) {
    muiColumns.push({
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (_, { rowIndex }) => {
          const row = data.content[rowIndex];
          const isLoanApplication =
            window.location.pathname.includes("loanapplication");
          const rowEditDisabled = isLoanApplication
            ? editButtonDisabled || row.authorized
            : editButtonDisabled;

          return (
            <div
              className="action-cell"
              style={{ lineHeight: "1", fontSize: "10px", padding: "2px" }}
            >
              {showEditButton && (
                <Tooltip
                  title={
                    rowEditDisabled && isLoanApplication
                      ? "Cannot edit authorized record"
                      : "Edit"
                  }
                >
                  <span>
                    <IconButton
                      style={{ padding: "0px", margin: "0px" }}
                      component={rowEditDisabled ? "div" : NavLink}
                      to={
                        rowEditDisabled
                          ? undefined
                          : `${basePath}/edit/${getActionPath(row)}`
                      }
                      className={`action-link ${
                        rowEditDisabled ? "disabled-icon" : ""
                      }`}
                      aria-label="Edit record"
                      disabled={rowEditDisabled}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              {showViewButton && (
                <Tooltip title="View">
                  <span>
                    <IconButton
                      style={{ padding: "0px", margin: "0px" }}
                      component={viewButtonDisabled ? "div" : NavLink}
                      to={
                        viewButtonDisabled
                          ? undefined
                          : `${basePath}/view/${getActionPath(row)}`
                      }
                      className={`action-link ${
                        viewButtonDisabled ? "disabled-icon" : ""
                      }`}
                      aria-label="View record"
                      disabled={viewButtonDisabled}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </div>
          );
        },
      },
    });
  }

  return (
    <Paper
      className="custom-table-container action-col-width"
      style={{ padding: "2px", overflowX: "hidden" }}
    >
      <MUIDataTable
        title={loading ? "Loading..." : " "}
        data={data.content}
        columns={muiColumns}
        options={{
          filterType: "multiselect",
          selectableRows: "none",
          serverSide: true,
          count: data.totalElements,
          page,
          rowsPerPage: pageSize,
          rowsPerPageOptions: [10, 25, 50, 100],
          responsive: "standard",
          elevation: 0,
          dense: true,
          customToolbar: () => <div className="table-controls"></div>,
          setRowProps: () => ({
            style: { lineHeight: "1", fontSize: "12px", padding: "2px" },
          }),
          setTableProps: () => ({
            size: "small",
            style: { padding: "0", minWidth: "100%" },
          }),
          onChangePage: (newPage) => {
            setPage(newPage);
            fetchData?.(newPage, pageSize);
          },
          onChangeRowsPerPage: (newSize) => {
            setPageSize(newSize);
            setPage(0);
            fetchData?.(0, newSize);
          },
          onColumnSortChange: (changedColumn, direction) => {
            setPage(0);
            fetchData?.(0, pageSize, {}, changedColumn, direction);
          },
          onFilterChange: (changedColumn, filterList, type) => {
            const filters = {};
            filterList.forEach((filterVals, index) => {
              // Adjust index by -1 to account for serial number column
              const columnName = muiColumns[index + 1]?.name;
              if (filterVals.length > 0 && columnName) {
                filters[columnName] = filterVals;
              }
            });
            setPage(0);
            fetchData?.(0, pageSize, filters, changedColumn);
          },
          sort: true,
          sortIcon: <ArrowDownwardIcon style={{ color: "white" }} />,
        }}
      />
    </Paper>
  );
};

export default DataTable;
