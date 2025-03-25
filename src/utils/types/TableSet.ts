import type { ColumnDef, TableState } from "@tanstack/react-table";
import type { User } from "./User";

export type TableSet = {
  columns: ColumnDef<User>[];
  data: User[];
  state: Partial<TableState> | undefined;
  fetchMoreOnBottomReached: (
    containerRefElement?: HTMLDivElement | null
  ) => void;
  isFetching: boolean;
};

type DataTableProps = {
  tableSet: TableSet;
  containerRef: React.RefObject<HTMLDivElement>;
};
