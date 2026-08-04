import Image from "next/image";

import { BadgeContainer } from "@/components/Badge/BadgeContainer";
import { ProfileWrapper } from "@/components/profile/Profile";
import { getFormatDueDateShort } from "@/utils/date";

interface ColumnCardProps {
  cardTitle: string;
  creator?: string;
  creatorImageUrl?: string | null;
  imgSrc?: string;
  tags?: string[];
  descrip?: string;
  duedate?: string;
  onClick?: () => void; // 칼럼 카드 클릭 -> 칼럼 관리 -> 칼럼 수정/삭제 모달을 렌더링 하기 위해 추가
}
export function ColumnCard({
  cardTitle,
  tags,
  creator,
  creatorImageUrl,
  imgSrc,
  onClick,
  duedate,
}: ColumnCardProps) {
  const handleSetting = () => {
    onClick?.();
  };

  return (
    <div
      onClick={handleSetting}
      className="bg-black-700 flex cursor-pointer flex-col gap-5 rounded-[30px] border border-gray-800 p-5 text-gray-100 lg:w-83"
    >
      {imgSrc && (
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-l">
          <Image src={imgSrc} fill alt="userAddImg" className="object-cover" />
        </div>
      )}
      <h1 className="text-[18px] font-semibold">{cardTitle}</h1>
      {/* 기능구현할 때는 배지리스트 받아서 처리 */}
      {tags && <BadgeContainer tags={tags} />}
      {duedate && <div>{getFormatDueDateShort(duedate)}</div>}
      {creator && <ProfileWrapper name={creator} imageUrl={creatorImageUrl} />}
    </div>
  );
}
