import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { getFieldValue } from "@/utils/functions";
import { Button } from "./button";
import { Edit2, Trash } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type React from "react";
import type { PaginationInfo } from "@/utils/types/PaginationInfo";

type column = {
  header: string;
  accessor: string;
  shouldSort?: boolean;
  shouldFilter?: boolean;
  convertTo?: (arr: string[]) => React.ReactNode;
};

export type DataTableProps<DataCollection> = {
  columns: column[];
  data: DataCollection[];
  pagination: PaginationInfo;
};

const DataTableV1 = <T,>(props: DataTableProps<T>) => {
  return (
    <div className="rounded-md border mx-2 p-2">
      <Table>
        <TableHeader>
          <TableRow>
            {props.columns.map((column) => {
              return (
                <TableHead key={column.accessor} className={`w-[100px]`}>
                  {column.header}
                </TableHead>
              );
            })}
            <TableHead key={"actions"} className={`w-[100px]`}>
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.data.map((row, index) => {
            return (
              <TableRow key={index}>
                {props.columns.map((column) => {
                  return (
                    <TableCell key={column.accessor} className="w-[100px]">
                      {column.convertTo
                        ? column.convertTo(
                            getFieldValue(column.accessor, row) as string[]
                          )
                        : getFieldValue(column.accessor, row)}
                    </TableCell>
                  );
                })}
                <TableCell className="w-[100px]">
                  <span className="flex gap-1">
                    <Button
                      asChild
                      className="bg-primary hover:[&>*]:animate-writing"
                    >
                      <Link
                        to={"/users/$userId"}
                        params={{ userId: String(1) }}
                      >
                        <Edit2 />
                      </Link>
                    </Button>
                    <Button
                      className="bg-destructive hover:bg-destructive-80 hover:brightness-75 hover:[&>*]:animate-spin"
                      asChild
                    >
                      <form action="/users/$userId" method="delete">
                        <Trash />
                      </form>
                    </Button>
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTableV1;
