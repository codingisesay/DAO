import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/DataTable.css';

const TableActions = ({ row, basePath, actions = { edit: true, view: true } }) => {
  return (
    <td className="action-cell">
      {actions.edit && (
        <NavLink 
          to={`${basePath}/edit/${row.branchCode}/${row.bankCode}`} 
          className="action-button edit-button"
          title="Edit"
        >
          ✏️
        </NavLink>
      )}
      {actions.view && (
        <NavLink 
          to={`${basePath}/view/${row.branchCode}/${row.bankCode}`}
          className="action-button view-button"
          title="View"
        >
          👁️
        </NavLink>
      )}
    </td>
  );
};

export default TableActions;