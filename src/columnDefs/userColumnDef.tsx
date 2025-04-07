import { Badge } from "@/components/ui/badge";
import { getFieldValue } from "@/utils/functions";
import type { User } from "@/utils/types/User";
import type { ColumnDef } from "@tanstack/react-table";

export const UserColumnDef: ColumnDef<User>[] = [
  {
    accessorKey: "userId",
    header: "ID",
    size: 60,
    enableColumnFilter: false,
  },
  {
    id: "Name",
    accessorFn: (row: User) => row.name,
    header: "Name",
    cell: (info) => info.getValue(),
  },
  {
    id: "Email",
    accessorKey: "email",
    header: "E-mail",
    cell: (info) => info.getValue(),
  },
  {
    header: "Groups",
    cell: (info) => info.getValue(),
    accessorFn: (user) => (
      <span className="flex gap-1 flex-wrap">
        {(getFieldValue("groups.name", user) as string[]).map(
          (groupName, index) => (
            <Badge key={`${index}`}>{groupName}</Badge>
          )
        )}
      </span>
    ),
  },
];
