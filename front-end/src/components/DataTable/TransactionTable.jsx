import React, { useEffect, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { NavLink } from 'react-router-dom';
import { IconButton, Tooltip, Paper } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './styles/DataTable.css';
import { AUTH_KEYS } from '../../../services/authService';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const isPastDate = (entryDate) => {
  const today = new Date(localStorage.getItem(AUTH_KEYS.OPERATION_DATE))
  const entry = new Date(entryDate);
  // Compare the entryDate with today's date (ignore time portion for the comparison)
  // alert(today)
  // alert(entry)
  return entry < today;
};

const DataTable = ({
  data = { content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 },
  columns = [],
  basePath = '',
  fetchData,
  loading = false,
  primaryKeys = ['id'],
  showActions = true,
  showEditButton = true,
}) => {
  const [page, setPage] = useState(data.number);
  const [pageSize, setPageSize] = useState(data.size);

  useEffect(() => {
    setPage(data.number);
    setPageSize(data.size);
  }, [data]);

  const getActionPath = (row) => primaryKeys.map(key => row[key]).join('/');

  const muiColumns = columns.map(col => ({
    name: col.field,
    label: col.header,
    options: {
      filter: true,
      sort: col.sortable,
      customBodyRender: (value) => {

        if (col.type === "date") {
          return formatDate(value);
        } else if (col.type === "integer" || col.type === "float" || col.type === "double") {
          return <div style={{ textAlign: 'right' }}>{value}</div>;
        } else if (col.type === "amount") {
          return (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <span>₹</span>
              <span style={{ textAlign: 'right', flex: 1 }}>
                {parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          );
        }
        return <div style={{ textAlign: 'left' }}>{value}</div>;
      }
    },
  }));

  if (showActions) {
    muiColumns.push({
      name: "actions",
      label: "ACTIONS",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (_, { rowIndex }) => {
          const row = data.content[rowIndex];
          console.log('Row Data:', row); // Debugging: log row data to check authFlag and cancelFlag
          const actionPath = getActionPath(row);
          const isEntryDatePast = isPastDate(row.entryDate); // Check if the entryDate is a past date

          return (
            <div className="action-cell" style={{ lineHeight: "1", fontSize: "10px", padding: "2px" }}>
              <Tooltip title="View">
                <IconButton component={NavLink} to={`${basePath}/view/${actionPath}`} className="action-link">
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Add">
                <IconButton component={NavLink} to={`${basePath}/add/${actionPath}`} className="action-link" disabled={isEntryDatePast}>
                  <ControlPointIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Cancel">
                <IconButton component={NavLink} to={`${basePath}/cancel/${actionPath}`} className="action-link" disabled={isEntryDatePast}>
                  <HighlightOffIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
    });
  }

  return (
    <Paper className="custom-table-container action-col-width" style={{ padding: '2px', overflowX: 'hidden' }}>
      <MUIDataTable
        title={loading ? 'Loading...' : ' '}
        data={data.content}
        columns={muiColumns}
        options={{
          filterType: 'checkbox',
          selectableRows: 'none',
          serverSide: true,
          count: data.totalElements,
          page,
          rowsPerPage: pageSize,
          rowsPerPageOptions: [10, 25, 50, 100],
          responsive: 'standard',
          elevation: 0,
          dense: true,
          customToolbar: () => (<div className="table-controls"></div>),
          setRowProps: (row, dataIndex) => {
            console.log('Row Data at index', '1', data.content[dataIndex].authFlag, '2', dataIndex, '3', row); // Log the entire row to see its structure

            // Check if authFlag and cancelFlag exist directly in the row or nested
            const authFlag = row.authFlag;  // Adjust if authFlag is nested
            const cancelFlag = row.cancelFlag; // Adjust if cancelFlag is nested

            // console.log('authFlag:', authFlag, 'cancelFlag:', cancelFlag); // Log authFlag and cancelFlag

            let rowClass = '';

            if (data.content[dataIndex].authFlag == 'A') {
              rowClass = 'row-green'; // Add 'row-green' class if authFlag is 'A'
            } else if (data.content[dataIndex].cancelFlag == 'C') {
              rowClass = 'row-red'; // Add 'row-red' class if cancelFlag is 'C'
            }

            return { className: rowClass }; // Return the appropriate className
          },

          setTableProps: () => ({ size: 'small', style: { padding: '0', minWidth: '100%' } }),
          onChangePage: (newPage) => {
            setPage(newPage);
            fetchData?.(newPage, pageSize);
          },
          onChangeRowsPerPage: (newSize) => {
            setPageSize(newSize);
            setPage(0);
            fetchData?.(0, newSize);
          },
          sortIcon: <ArrowDownwardIcon style={{ color: 'white' }} />,
        }}
      />
    </Paper>
  );
};

export default DataTable;
