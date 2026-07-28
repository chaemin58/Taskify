"use client";

import { useState } from "react";

import { PaginationButton } from "@/components/PaginationButton";

import { useItemsPerPage } from "../hooks/useItemsPerPage";

import { AddDashboard } from "./AddDashboard";
import { DashboardCard } from "./DashboardCard";
import { Emptydashboard } from "./Emptydashboard";
import { useGetDashboardsList } from "../hooks/useGetDashboardsList";

export function MyDashboard() {
  const showItem = useItemsPerPage();
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data, isLoading, error, fetchNextPage, hasNextPage } =
    useGetDashboardsList();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <p>에러 발생</p>;

  const dashboardList = data?.pages.flatMap((p) => p.dashboards) ?? [];
  const total = data?.pages[0]?.totalCount ?? 0;

  const totalPage = Math.ceil((total + 1) / showItem);

  const handleClickNext = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
    setCurrentPage((prev) => prev + 1);
  };

  const handleClickPrev = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const combinedStart = (currentPage - 1) * showItem;
  const isShowAddCard = combinedStart === 0;

  const start = Math.max(0, combinedStart - 1);
  const end = currentPage * showItem - 1;

  const visableDashboardList = dashboardList.slice(start, end);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-bold">내 대시보드</h2>
      {dashboardList.length === 0 && <Emptydashboard dashtype="my" />}
      {visableDashboardList.length > 0 && (
        <div className="flex gap-5">
          {isShowAddCard && <AddDashboard />}
          {visableDashboardList.map((dashboard) => (
            <DashboardCard
              title={dashboard.title}
              key={dashboard.id}
              dashboardId={dashboard.id}
              color={dashboard.color}
            />
          ))}
        </div>
      )}
      <PaginationButton
        total={totalPage}
        onClickPrev={handleClickPrev}
        onClickNext={handleClickNext}
        current={currentPage}
      />
    </div>
  );
}
