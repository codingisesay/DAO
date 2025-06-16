import { useState } from 'react';

export const useFilter = () => {
  const [filters, setFilters] = useState({});

  const handleFilter = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    return filters;
  };

  return { filters, handleFilter };
};