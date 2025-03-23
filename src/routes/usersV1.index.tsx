import React from "react";
import DataTableV1 from "@/components/ui/data-table-v1";
import { Badge } from "@/components/ui/badge";
import { apiClient } from "@/utils/apiClient";
import type { ApiResponse } from "@/utils/types/ApiResponse";
import type { User } from "@/utils/types/User";
import { createFileRoute } from "@tanstack/react-router";
import { UserColumnDef } from "@/columnDefs/userColumnDef";

import type { SortingState } from "@tanstack/react-table";

import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";

export const Route = createFileRoute("/usersV1/")({
  loader: async () => {
    return await apiClient
      .get<ApiResponse<User[]>>("/users")
      .then((response) => response.data)
      .catch(() => {
        throw new Error("Failed to fetch users");
      });
  },
  component: Wrapper,
});

const queryClient = new QueryClient();

function Wrapper() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <UserComponent />
      </QueryClientProvider>
    </div>
  );
}

function UserComponent() {
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const pagination = Route.useLoaderData().pagination;
  const users = Route.useLoaderData().data;

  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<
    ApiResponse<User[]>
  >({
    queryKey: [
      "users",
      sorting, //refetch when sorting changes
    ],
    queryFn: async ({ pageParam }) => {
      const fetchedData = await apiClient
        .get<ApiResponse<User[]>>(
          `/users?pageSize=${30}&pageIndex=${pageParam}`
        )
        .then((r) => r.data)
        .catch(() => {
          throw new Error("Failed to fetch users");
        });
      return fetchedData;
    },
    initialPageParam: 1,
    getNextPageParam: (response) => response.pagination.nextPage,
    getPreviousPageParam: (response) => response.pagination.previousPage,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  //flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data]
  );

  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 500px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 500 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  React.useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

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
