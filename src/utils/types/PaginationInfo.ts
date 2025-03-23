export type PaginationInfo = {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  nextPage: number | null;
  previousPage: number | null;
};
