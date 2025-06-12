import React from 'react';

const TableFooter = ({ data, onPageChange }) => {
  return (
    <div className="table-footer">
      <div className="pagination-info">
        Showing {data.numberOfElements} of {data.totalElements} entries
      </div>
      <div className="pagination-controls">
        <button 
          disabled={data.first} 
          onClick={() => onPageChange(data.number - 1)}
        >
          Previous
        </button>
        <span>Page {data.number + 1} of {data.totalPages}</span>
        <button 
          disabled={data.last} 
          onClick={() => onPageChange(data.number + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableFooter;