import { ProfileWrapper } from "@/components/profile/Profile";
import { CardResponse } from "@/types/api";
import { getFormatDueDate } from "@/utils/date";

import { TaskDetailPanelInfo } from "./TaskDetailPanelInfo";

interface TaskDetailPanelMobileProps extends Pick<
  CardResponse,
  "dueDate" | "assignee"
> {
  dashboardName: string;
  columnName: string;
}

export function TaskDetailPanelMobile({
  dueDate,
  assignee,
  dashboardName,
  columnName,
}: TaskDetailPanelMobileProps) {
  return (
    <div className="divide-black-600 flex flex-col divide-y text-gray-100 lg:hidden">
      <TaskDetailPanelInfo label="프로젝트">
        {dashboardName} / {columnName}
      </TaskDetailPanelInfo>
      <TaskDetailPanelInfo label="담당자">
        <div className="flex items-center gap-1.5">
          {assignee && (
            <ProfileWrapper
              name={assignee.nickname}
              imageUrl={assignee.profileImageUrl}
            />
          )}
        </div>
      </TaskDetailPanelInfo>
      <TaskDetailPanelInfo label="마감일">
        {getFormatDueDate(dueDate)}
      </TaskDetailPanelInfo>
    </div>
  );
}
