import { useParams, useRouter } from "next/navigation";

import Xicon from "@/assets/common/ic-x.svg";

interface DashboardEditHeaderProps {
  title: string;
}

export function DashboardEditHeader({ title }: DashboardEditHeaderProps) {
  const router = useRouter();
  const params = useParams(); // URL의 [id] 값을 가져옵니다.
  const id = params.id;

  const handleBack = () => {
    if (id) {
      router.push(`/dashboard/${id}`);
    } else {
      router.back();
    }
  };

  return (
    <div className="relative mt-7.5 mb-3.5 flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-100">{title}</h1>
      <div
        onClick={handleBack}
        className="relative top-3 left-20 flex flex-col items-center justify-center gap-1.5 max-2xl:left-0 max-lg:top-0"
      >
        <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 border-gray-300 max-lg:h-7.5 max-lg:w-7.5">
          <Xicon height={20} width={20} />
        </div>
        <span className="text-sm font-semibold text-gray-300 max-lg:hidden">
          돌아가기
        </span>
      </div>
    </div>
  );
}
