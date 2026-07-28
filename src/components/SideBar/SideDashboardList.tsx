"use client";

import { useCallback, useRef } from "react";

import { SideButton } from "./SideButton";
import { Dashboard } from "./SideMenu";
import { useGetDashboardsList } from "@/app/mydashboard/hooks/useGetDashboardsList";

export function SideDashboardList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    error,
    isFetchingNextPage,
    isLoading,
  } = useGetDashboardsList();

  const observerInstanceRef = useRef<IntersectionObserver | null>(null);

  const observerRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerInstanceRef.current) observerInstanceRef.current.disconnect();
      if (!node || !hasNextPage || isFetchingNextPage) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) fetchNextPage();
        },
        { threshold: 0.1 }
      );
      observer.observe(node);
      observerInstanceRef.current = observer;
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  if (error) return <p>에러 발생</p>;

  const dashboards: Dashboard[] =
    data?.pages.flatMap((page) => page.dashboards) ?? [];

  return (
    <div className="flex h-full flex-col overflow-y-auto px-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent">
      <div className="flex flex-col gap-1">
        {isLoading && (
          <div className="flex h-10 items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
          </div>
        )}

        {dashboards.map((item) => (
          <SideButton
            key={item.id}
            id={item.id}
            title={item.title}
            color={item.color}
            createdByMe={item.createdByMe}
          />
        ))}

        {hasNextPage && (
          <div
            ref={observerRef}
            className="flex h-10 w-full items-center justify-center py-4"
          >
            {isFetchingNextPage && (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
            )}
          </div>
        )}

        {!isLoading && dashboards.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-400">
            대시보드가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
