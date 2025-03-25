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
import DataTable, { type TableSet } from "@/components/ui/data-table";

export const Route = createFileRoute("/users/")({
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
  const containerRef = React.useRef<HTMLDivElement>({} as HTMLDivElement);
  const [sorting, setSorting] = React.useState<SortingState>([]);

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
          typeof pageParam == "string"
            ? (pageParam as string)
            : `/users?pageSize=${30}&pageIndex=${pageParam}`
        )
        .then((r) => r.data)
        .catch(() => {
          throw new Error("Failed to fetch users");
        });
      return fetchedData;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    getPreviousPageParam: (firstPage) =>
      firstPage.pagination.previousPage ?? undefined,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  //flatten the array of arrays from the useInfiniteQuery hook
  const flatData = React.useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data]
  );

  const tableSet: TableSet = {
    columns: UserColumnDef,
    data: flatData,
    state: {
      sorting,
    },
    isFetching,
    fetchMoreOnBottomReached: (e) => fetchMoreOnBottomReached(e),
  };

  const totalDBRowCount = data?.pages?.[0]?.pagination?.totalRecords ?? 0;
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
    fetchMoreOnBottomReached(containerRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <div className="mx-auto container">
      <DataTable containerRef={containerRef} tableSet={tableSet} />
    </div>
  );
}
