import type { PaginationInfo } from "./PaginationInfo";

export type ApiResponse<DataType> = {
  status: string;
  message: string;
  data: DataType;
  pagination: PaginationInfo;
};
