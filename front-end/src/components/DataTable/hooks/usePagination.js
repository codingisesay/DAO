import { useState } from 'react';
import { TABLE_CONFIG } from '../config/tableConfig';

export const usePagination = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(TABLE_CONFIG.pageSize);

  return { page, pageSize, setPage, setPageSize };
};