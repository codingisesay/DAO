export interface Column {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  format?: (value: any) => string;
}

export interface TableData {
  content: any[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface TableProps {
  data: TableData;
  columns: Column[];
  basePath: string;
  onSort?: (field: string, order: string) => void;
  onFilter?: (filters: Record<string, string>) => void;
  onPageChange?: (page: number) => void;
  loading?: boolean;
}