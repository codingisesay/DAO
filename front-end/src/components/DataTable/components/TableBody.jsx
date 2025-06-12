import React from 'react';
import TableActions from './TableActions';

const TableBody = ({ data, columns, basePath, loading }) => {
  if (loading) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length + 1}>Loading...</td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.content?.map((row) => (
        <tr key={row.id || row.code}>
          {columns.map((column) => (
            <td key={column.field}>
              {column.format 
                ? column.format(row[column.field])
                : row[column.field]}
            </td>
          ))}
          <TableActions row={row} basePath={basePath} />
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;