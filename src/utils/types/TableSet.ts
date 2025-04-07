import type {
  ColumnDef,
  ColumnFiltersState,
  TableState,
} from "@tanstack/react-table";

export type TableSet<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  state: Partial<TableState> | undefined;
  fetchMoreOnBottomReached: (containerRefElement: HTMLDivElement) => void;
  isFetching: boolean;
  onColumnFiltersChange?: React.Dispatch<
    React.SetStateAction<ColumnFiltersState>
  >;
};

export type DataTableProps<T> = {
  tableSet: TableSet<T>;
  containerRef: React.RefObject<HTMLDivElement>;
};
