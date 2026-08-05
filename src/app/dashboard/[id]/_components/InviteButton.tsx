import Link from "next/link";
import { useParams } from "next/navigation";

import UserPlus from "@/assets/ic-user-plus-white.svg";

export function InviteButton() {
  const params = useParams();
  const dashboardId = params.id;

  return (
    <Link href={`/dashboard/${dashboardId}/invite`}>
      <div className="bg-brand-500 flex h-7.25 w-16.25 items-center justify-center gap-0.5 rounded-full">
        <span className="text-sm font-semibold text-white">초대</span>
        <UserPlus />
      </div>
    </Link>
  );
}
