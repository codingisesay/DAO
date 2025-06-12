import { useState } from 'react';

export const useSort = (onSortChange) => {
  const [sortConfig, setSortConfig] = useState(null);

  const handleSort = (field) => {
    const direction = sortConfig?.field === field && sortConfig.direction === 'asc' 
      ? 'desc' 
      : 'asc';
    setSortConfig({ field, direction });
    onSortChange(field, direction);
  };

  return { sortConfig, handleSort };
};