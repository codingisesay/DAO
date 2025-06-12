import React from 'react';

const TableHeader = ({ columns, sortConfig, onSort }) => {
  return (
    <thead className="table-header">
      <tr>
        {columns.map((column) => (
          <th key={column.field}>
            <div className="column-header">
              {column.header}
              {column.sortable && (
                <span onClick={() => onSort(column.field)}>
                  {sortConfig?.field === column.field 
                    ? (sortConfig.direction === 'asc' ? '↑' : '↓') 
                    : '↕'}
                </span>
              )}
            </div>
          </th>
        ))}
        <th>Actions</th>
      </tr>
    </thead>
  );
};

export default TableHeader;