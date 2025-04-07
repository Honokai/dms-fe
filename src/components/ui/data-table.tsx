import React, { type ChangeEvent, type ChangeEventHandler } from "react";
import type { User } from "@/utils/types/User";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  type OnChangeFn,
  type SortingState,
  type ColumnFiltersState,
  type Row,
  type ColumnDef,
  type TableState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFilter,
  type CoreHeader,
  type Column,
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
import type { DataTableProps, TableSet } from "@/utils/types/TableSet";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from "./select";

// TODO implement sorting, filter, selection
const DataTable = <T,>({ tableSet, containerRef }: DataTableProps<T>) => {
  const {
    isFetching,
    fetchMoreOnBottomReached,
    columns,
    state,
    onColumnFiltersChange,
  } = tableSet;
  const data = React.useMemo(() => tableSet.data, [tableSet.data]);

  const table = useReactTable({
    data,
    columns,
    state,
    onColumnFiltersChange,
    // onSortingChange: (updater: OnChangeFn<SortingState>) => {
    //   table.setSorting(updater);
    // },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    manualFiltering: true,
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

  // TODO: improve filter so it only updates when the user stops typing
  const handleFilterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    table
      .getColumn(e.currentTarget.id)
      ?.setFilterValue({ value: e.target.value, condition: "contains" });
  };

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
                  className={`flex items-center h-fit flex-col my-2 ${!header.id.toLowerCase().includes("id") && "flex-1"}`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getCanFilter() && (
                    <div>
                      <Select key={`${header.id}-select`}>
                        <SelectTrigger className="w-full mt-2">
                          <SelectValue placeholder="Condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contains">Contains</SelectItem>
                          <SelectItem value="not_contains">
                            Not contains
                          </SelectItem>
                          <SelectItem value="empty">Empty</SelectItem>
                          <SelectItem value="not_empty">Not empty</SelectItem>
                          <SelectItem value="equals">Equals to</SelectItem>
                          <SelectItem value="not_equals">
                            Not equal to
                          </SelectItem>
                          <SelectItem value="starts">Starts with</SelectItem>
                          <SelectItem value="ends">Ends with</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id={`${header.id}`}
                        key={`${header.id}-input`}
                        defaultValue={
                          header.column.getFilterValue()?.value as string
                        }
                        onChange={(e) => handleFilterChange(e)}
                        className="mt-2"
                        placeholder={`${header.column.columnDef.header}`}
                      />
                    </div>
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
        </TableBody>
        <TableFooter className="sticky bottom-0">
          {isFetching && <div className="text-md">Fetching More...</div>}
        </TableFooter>
      </Table>
    </div>
  );
};

export default DataTable;
