export type PaginationQuery = {
  page: number;
  size: number;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
};
