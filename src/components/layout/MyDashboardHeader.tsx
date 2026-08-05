"use client";

import IcSideMenu from "@/assets/ic-sidemenu.svg";
import LogoutIcon from "@/assets/LogoutIcon.svg";
import { useSideMenu } from "@/contexts/SideMenuContext";
import { useRouter } from "next/navigation";

export function MyDashboardHeader() {
  const router = useRouter();
  const { open: handleOpenSideMenu } = useSideMenu();

  return (
    <header className="border-black-800 flex h-12.5 w-full items-center justify-end gap-7.5 border-b-2 bg-[#1B1A1F] px-3 max-md:justify-between md:h-15 md:px-6">
      <button onClick={handleOpenSideMenu} className="p-2.5 md:hidden">
        <IcSideMenu height={20} width={20} aria-label="사이드 메뉴 아이콘" />
      </button>
      <button
        className="group flex cursor-pointer items-center gap-2 text-gray-300 hover:text-white"
        onClick={() => router.push(`/logout`)}
      >
        <LogoutIcon className="w-4 text-[#A39FB2]" />
        <span className="hidden text-sm font-medium md:inline">로그아웃</span>
      </button>
    </header>
  );
}
