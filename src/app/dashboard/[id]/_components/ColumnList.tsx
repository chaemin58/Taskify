"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import { cardKeys, useCardListQuery } from "@/hooks/useCards";
import { Card, GetCardListResponse } from "@/types/api";

import { ColumnCard } from "./ColumnCard";
import { ColumnListHeader } from "./ColumnListHeader";
import { NoCard } from "./NoCard";

interface ColumnList {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  teamId: string;
}

export function ColumnList({ column }: { column: ColumnList }) {
  const queryClient = useQueryClient();

  const { title, id } = column;

  const params = useParams();
  const pathname = usePathname();
  const dashboardId =
    Number(params.dashboardId) || Number(pathname.split("/")[2]);

  const { data, isLoading } = useCardListQuery(id);

  const cardList = data?.cards ?? [];
  const totalCount = data?.totalCount ?? 0;

  const handleDropdown = (e: React.DragEvent<HTMLDivElement>) => {
    const cardId = Number(e.dataTransfer.getData("cardId"));
    const startColumnId = Number(e.dataTransfer.getData("startColumnId"));

    if (startColumnId === id) return;

    let movedCard: Card | undefined;

    queryClient.setQueryData(
      cardKeys.list(startColumnId),
      (old: GetCardListResponse) => {
        //찾아서 저장
        movedCard = old.cards.find((card) => card.id === cardId);

        //이제 제거해주기
        const newCards = old.cards.filter((c) => c.id !== cardId);
        return { ...old, cards: newCards, totalCount: old.totalCount - 1 };
      }
    );

    queryClient.setQueryData(cardKeys.list(id), (old: GetCardListResponse) => ({
      ...old,
      //카드 추가
      cards: [...old.cards, movedCard],
      totalCount: old.totalCount + 1,
    }));
  };

  return (
    <div
      className="flex min-w-83.5 flex-col gap-5 max-lg:mx-0 max-lg:w-full"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDropdown(e)}
    >
      <ColumnListHeader
        title={title}
        contentCount={totalCount}
        columnId={id}
        dashboardId={dashboardId}
      />
      {isLoading ? (
        <SkeletonTheme baseColor="#2a2a2d" highlightColor="#3f3f46">
          <div className="flex flex-col gap-4">
            <Skeleton height={130} borderRadius={12} />
            <Skeleton height={130} borderRadius={12} />
          </div>
        </SkeletonTheme>
      ) : cardList.length === 0 ? (
        <NoCard />
      ) : (
        cardList.map((colCard) => (
          <Link
            href={`/card/${colCard.id}`}
            key={colCard.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("cardId", String(colCard.id));
              e.dataTransfer.setData("startColumnId", String(id));
            }}
          >
            <ColumnCard
              cardTitle={colCard.title}
              duedate={colCard.dueDate}
              tags={colCard.tags}
              creator={colCard.assignee?.nickname}
              creatorImageUrl={colCard.assignee?.profileImageUrl}
              imgSrc={colCard.imageUrl}
            />
          </Link>
        ))
      )}
    </div>
  );
}
