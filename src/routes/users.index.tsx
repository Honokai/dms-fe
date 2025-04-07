import React, { use } from "react";
import { apiClient } from "@/utils/apiClient";
import type { ApiResponse } from "@/utils/types/ApiResponse";
import type { User } from "@/utils/types/User";
import { createFileRoute } from "@tanstack/react-router";
import { UserColumnDef } from "@/columnDefs/userColumnDef";

import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";

import {
  keepPreviousData,
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import DataTable from "@/components/ui/data-table";
import type { TableSet } from "@/utils/types/TableSet";

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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const constructQueryFilters = () => {
    let query = "";
    console.log("columnFilters", columnFilters);
    columnFilters.forEach((filter, index) => {
      query += `&FilterTerms[${index}].name=${filter.id}&FilterTerms[${index}].operator=${filter.value?.condition}&FilterTerms[${index}].value=${filter.value?.value}`;
    });

    return encodeURI(query);
  };

  const { data, fetchNextPage, isFetching, isLoading } = useInfiniteQuery<
    ApiResponse<User[]>
  >({
    queryKey: ["users", sorting, columnFilters],
    queryFn: async ({ pageParam }) => {
      const fetchedData = await apiClient
        .get<ApiResponse<User[]>>(
          typeof pageParam == "string"
            ? (pageParam as string) + constructQueryFilters()
            : `/users?pageSize=${30}&pageIndex=${pageParam}` +
                constructQueryFilters()
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

  const tableSet: TableSet<User> = {
    columns: UserColumnDef,
    data: flatData,
    state: {
      sorting,
    },
    isFetching,
    fetchMoreOnBottomReached: (div: HTMLDivElement | null) =>
      fetchMoreOnBottomReached(div),
    onColumnFiltersChange: setColumnFilters,
  };

  const totalDBRowCount = data?.pages?.[0]?.pagination?.totalRecords ?? 0;
  const totalFetched = flatData.length;

  const fetchMoreOnBottomReached = React.useCallback(
    (containerRefElement: HTMLDivElement | null) => {
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
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount, columnFilters]
  );

  React.useEffect(() => {
    fetchMoreOnBottomReached(containerRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <div className="mx-auto container">
      {columnFilters.map((filter) => (
        <div>{filter.id}</div>
      ))}
      <DataTable containerRef={containerRef} tableSet={tableSet} />
    </div>
  );
}
