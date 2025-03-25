import { Badge } from "@/components/ui/badge";
import { getFieldValue } from "@/utils/functions";
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
    header: "Name",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "email",
    header: "E-mail",
    cell: (info) => info.getValue(),
  },
  {
    header: "Groups",
    cell: (info) => info.getValue(),
    accessorFn: (user) => (
      <span className="flex gap-1 flex-wrap">
        {(getFieldValue("groups.name", user) as string[]).map((groupName) => (
          <Badge>{groupName}</Badge>
        ))}
      </span>
    ),
  },
];
