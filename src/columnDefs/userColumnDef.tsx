import type { User } from "@/utils/types/User";
import type { ColumnDef } from "@tanstack/react-table";

export const UserColumnDef: ColumnDef<User>[] = [
  {
    accessorKey: "userId",
    header: "ID",
    size: 60,
  },
  {
    accessorFn: (row: User) => row.name,
    accessorKey: "name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: "E-mail",
    cell: (info) => info.getValue(),
  },
];
