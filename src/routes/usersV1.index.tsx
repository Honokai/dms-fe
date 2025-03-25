import React from "react";
import DataTableV1 from "@/components/ui/data-table-v1";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/utils/apiClient";
import type { ApiResponse } from "@/utils/types/ApiResponse";
import type { User } from "@/utils/types/User";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/usersV1/")({
  loader: async () => {
    return await apiClient
      .get<ApiResponse<User[]>>("/users")
      .then((response) => response.data)
      .catch(() => {
        throw new Error("Failed to fetch users");
      });
  },
  component: UserComponent,
});

function UserComponent() {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const pagination = Route.useLoaderData().pagination;
  const users = Route.useLoaderData().data;

  return (
    <div>
      <DataTableV1
        containerRef={tableContainerRef}
        columns={[
          { header: "Name", accessor: "name" },
          { header: "E-mail", accessor: "email" },
          {
            header: "Groups",
            accessor: "groups.name",
            convertTo: (arr: string[]) => {
              return (
                <div className="flex gap-1 flex-wrap">
                  {arr.map((group, index) => (
                    <Badge className="p-2" key={index}>
                      {group}
                    </Badge>
                  ))}
                </div>
              );
            },
          },
        ]}
        data={users}
        pagination={pagination}
      />
    </div>
  );
}
