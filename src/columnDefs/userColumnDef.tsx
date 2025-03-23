import type { User } from "@/utils/types/User";
import type { ColumnDef } from "@tanstack/react-table";

export const UserColumnDef: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 60,
  },
  {
    accessorFn: (row: User) => row.name,
    accessorKey: "name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "visits",
    size: 50,
    header: () => <span>Visits</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "progress",
    header: "Profile Progress",
    size: 80,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (info) => info.getValue<Date>().toLocaleString(),
    size: 200,
  },
];
