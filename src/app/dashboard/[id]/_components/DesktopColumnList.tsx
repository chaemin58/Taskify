import { ColumnList as Column } from "../page";

import { ColumnList } from "./ColumnList";

interface DesktopColumnListProps {
  columnList: Column[];
}
export function DesktopColumnList({ columnList }: DesktopColumnListProps) {
  return (
    <div className="hidden gap-15 pb-20 lg:flex">
      {columnList?.map((column) => (
        <ColumnList key={column.id} column={column} />
      ))}
    </div>
  );
}
