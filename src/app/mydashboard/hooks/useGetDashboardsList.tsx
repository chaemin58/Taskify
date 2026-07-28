import { getDashboardList } from "@/api/data";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useGetDashboardsList() {
  const PAGE_SIZE = 20;
  const {
    data,
    fetchNextPage,
    error,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["dashboards"],
    queryFn: ({ pageParam = 1 }) =>
      getDashboardList({
        navigationMethod: "pagination",
        page: pageParam,
        size: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const fetched = allPages.length * PAGE_SIZE;
      return fetched < lastPage.totalCount ? allPages.length + 1 : undefined;
    },
  });

  return {
    data,
    fetchNextPage,
    error,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
}

