import React from "react";
import type { User } from "@/utils/types/User";
import type {
  OnChangeFn,
  SortingState,
  Row,
  ColumnDef,
  TableState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

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

const DataTable = ({ tableSet, containerRef }: DataTableProps) => {
  const { isFetching, fetchMoreOnBottomReached, columns, state } = tableSet;
  const data = React.useMemo(() => tableSet.data, [tableSet.data]);

  const table = useReactTable({
    data,
    columns,
    state,
    // onSortingChange: (updater: OnChangeFn<SortingState>) => {
    //   table.setSorting(updater);
    // },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 33, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => containerRef.current,
    //measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== "undefined" &&
      navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 2,
  });

  return (
    <div
      className="rounded-md border pb-2 overflow-auto relative h-[600px]"
      ref={containerRef}
      onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
    >
      <Table className="grid">
        <TableHeader className="grid sticky top-0 z-[1] bg-primary-foreground">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="flex w-full" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={`flex items-center ${!header.id.toLowerCase().includes("id") && "flex-1"}`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
              <TableHead key={"actions"} className={`flex flex-1 items-center`}>
                Actions
              </TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody
          className={`grid relative`}
          style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<User>;
            return (
              <TableRow
                data-index={virtualRow.index}
                key={row.id}
                ref={(node) => rowVirtualizer.measureElement(node)}
                style={{
                  display: "flex",
                  position: "absolute",
                  transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                  width: "100%",
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      key={cell.id}
                      id={cell.id}
                      className={`${!cell.id.toLowerCase().includes("id") && "flex-1"}`}
                      style={{
                        display: "flex",
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
                <TableCell className="flex flex-1"></TableCell>
              </TableRow>
            );
          })}
          {isFetching && <div>Fetching More...</div>}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
