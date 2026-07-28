import { getColumnList, getDashboardDetail } from "@/api/data";
import { DashboardTag } from "@/components/DashboardTag/DashboardTag";

import { ColumnPlusButton } from "./_components/ColumnPlusButton";
import { DesktopColumnList } from "./_components/DesktopColumnList";
import { MoblieColumnList } from "./_components/MoblieColumnList";
import {
  defaultShouldDehydrateQuery,
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cardListQueryOptions } from "@/hooks/cardQueries";

export interface ColumnList {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  teamId: string;
}

export interface Dashboard {
  id: number;
  title: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  createdByMe: boolean;
  userId: number;
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const dashboardId = Number(id);

  const [dashboardDetail, columnListResponse] = await Promise.all([
    getDashboardDetail(dashboardId),
    getColumnList(dashboardId),
  ]);

  const columnList = columnListResponse.data;

  const queryClient = new QueryClient({
    defaultOptions: {
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });

  //카드 결과를 기다리지 않음
  columnList.map((column) => {
    void queryClient.prefetchQuery(cardListQueryOptions(column.id));
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mt-5 flex flex-col gap-5 text-gray-100 max-md:px-4 lg:gap-10 lg:px-12.5">
        <DashboardTag
          title={dashboardDetail.title}
          color={dashboardDetail.color}
          className="text-2xl font-bold"
        />
        <MoblieColumnList columnList={columnList} dashboardId={dashboardId} />
        <div className="hidden gap-15 pb-20 lg:flex">
          <DesktopColumnList columnList={columnList} />
          <ColumnPlusButton id={dashboardId} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
