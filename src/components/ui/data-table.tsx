import React from "react";
import type { User } from "@/utils/types/User";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  type OnChangeFn,
  type SortingState,
  type Row,
  type ColumnDef,
  type TableState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import type { TableSet } from "@/utils/types/TableSet";

type DataTableProps = {
  tableSet: TableSet;
  containerRef: React.RefObject<HTMLDivElement>;
};

// TODO implement sorting, filter, selection
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
    estimateSize: () => 33,
    getScrollElement: () => containerRef.current,
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
      <span className="top-0 sticky z-10">
        Is fetching {isFetching ? "yes" : "no"}
      </span>
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
                  transform: `translateY(${virtualRow.start}px)`,
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
