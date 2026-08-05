import {
  getColumnList,
  getCommentList,
  getDashboardDetail,
  getMyInfo,
} from "@/api/data";
import { CardResponse } from "@/types/api";

import { CommentWrapper } from "./Comment/CommentWrapper";
import { TaskDetailContent } from "./TaskDetailContent";
import { TaskDetailHeader } from "./TaskDetailHeader";
import { TaskDetailPanel } from "./TaskDetailPanel";
import { TaskDetailPanelMobile } from "./TaskDetailPanelMobile";

interface TaskDetailProps {
  cardInfo: CardResponse;
}

export async function TaskDetail({ cardInfo }: TaskDetailProps) {
  const {
    id: cardId,
    columnId,
    title,
    tags,
    description,
    imageUrl,
    dueDate,
    assignee,
    dashboardId,
  } = cardInfo;

  const [{ title: dashboardTitle }, { data: columnList }, { comments }, user] =
    await Promise.all([
      getDashboardDetail(dashboardId),
      getColumnList(dashboardId),
      getCommentList({ cardId }),
      getMyInfo(),
    ]);

  const currentColumnName = columnList.find(
    (column) => column.id === columnId
  )?.title;

  return (
    <div className="flex h-full w-full">
      <div className="bg-modal-background custom-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto px-7.5 py-6 md:gap-7.5 md:py-7.5">
        <TaskDetailHeader
          title={title}
          tags={tags}
          dashboardId={dashboardId}
          taskId={String(cardId)}
        />
        <TaskDetailContent
          description={description ? description : "설명이 없습니다"}
          imageUrl={imageUrl}
        />
        <TaskDetailPanelMobile
          dueDate={dueDate}
          assignee={assignee}
          dashboardName={dashboardTitle}
          columnName={currentColumnName ?? ""}
        />
        <CommentWrapper
          user={user}
          initialComments={comments}
          cardId={cardId}
          columnId={columnId}
          dashboardId={dashboardId}
        />
      </div>
      <div className="hidden lg:block">
        <TaskDetailPanel
          dueDate={dueDate}
          assignee={assignee}
          dashboardName={dashboardTitle}
          columnName={currentColumnName ?? ""}
          dashboardId={dashboardId}
          taskId={String(cardId)}
        />
      </div>
    </div>
  );
}
