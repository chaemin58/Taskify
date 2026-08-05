"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";

import IconSettings from "@/assets/common/ic-setting.svg";
import LogoutIcon from "@/assets/LogoutIcon.svg";
import IconShare from "@/assets/common/ic-user-plus.svg";
import IcSideMenu from "@/assets/ic-sidemenu.svg";
import { useSideMenu } from "@/contexts/SideMenuContext";
import { useMemberListQuery } from "@/hooks/useCards";

import { ProfileImage } from "../profile/Profile";
import { logout } from "@/actions/auth";

const PROFILE_COLOR_KEYS = [
  "profile-green",
  "profile-violet",
  "profile-cyan",
  "profile-rose",
  "profile-cobalt",
  "profile-yellow",
  "profile-orange",
];

interface Member {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
  userId: number;
}

export function DashboardHeader() {
  const router = useRouter();
  const params = useParams();
  const { open: handleOpenSideMenu } = useSideMenu();

  const dashboardId = params?.id ? Number(params.id) : null;

  const { data: memberData } = useMemberListQuery(dashboardId || 0);

  const { members, totalCount } = useMemo(() => {
    if (!memberData?.members) return { members: [], totalCount: 0 };

    const rawMembers: Member[] = memberData.members;
    const unique = rawMembers.reduce<Member[]>((acc, current) => {
      if (!acc.find((item) => item.userId === current.userId)) {
        acc.push(current);
      }
      return acc;
    }, []);

    return { members: unique, totalCount: unique.length };
  }, [memberData]);

  const MAX_VISIBLE_MEMBERS = 6;
  const visibleMembers = members.slice(0, MAX_VISIBLE_MEMBERS);
  const extraCount =
    totalCount > MAX_VISIBLE_MEMBERS ? totalCount - MAX_VISIBLE_MEMBERS : 0;

  const membersWithColors = useMemo(() => {
    return visibleMembers.map((member) => ({
      ...member,
      colorKey: PROFILE_COLOR_KEYS[member.id % PROFILE_COLOR_KEYS.length],
    }));
  }, [visibleMembers]);

  const handleClickLogout = () => {
    //로그아웃 모달 띄우기
  };

  if (dashboardId === null || isNaN(dashboardId)) return null;

  return (
    <header className="border-black-800 flex h-12.5 w-full items-center justify-between border-b-2 bg-[#1B1A1F] px-3 md:h-15 md:justify-end md:px-6">
      <button onClick={handleOpenSideMenu} className="p-2.5 md:hidden">
        <IcSideMenu width={20} height={20} aria-label="메뉴" />
      </button>

      <div className="flex items-center gap-6 md:gap-8.5 lg:gap-12.5">
        <div className="flex items-center">
          {membersWithColors.map((member, index) => (
            <div
              key={member.id}
              style={{ backgroundColor: `var(--color-${member.colorKey})` }}
              className={`border-black-900 relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all md:h-8.5 md:w-8.5 ${
                index !== 0 ? "-ml-2 md:-ml-3.25" : ""
              } cursor-pointer hover:z-20 hover:-translate-y-1 hover:border-white`}
            >
              <ProfileImage
                name={member.nickname}
                imageUrl={member.profileImageUrl}
              />
            </div>
          ))}
          {extraCount > 0 && (
            <div className="border-black-900 z-10 -ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-pink-100 text-[10px] font-bold text-pink-500 md:-ml-3.25 md:h-8.5 md:w-8.5 md:text-[12px]">
              +{extraCount}
            </div>
          )}
        </div>

        <div className="bg-black-700 h-6 w-px shrink-0" />

        <div className="flex items-center gap-2.5 md:gap-4">
          <button
            onClick={() => router.push(`/dashboard/${dashboardId}/edit`)}
            className="group flex cursor-pointer items-center gap-2 text-gray-300 hover:text-white"
          >
            <IconSettings />
            <span className="hidden text-sm font-medium md:inline">관리</span>
          </button>
          <button
            onClick={() => router.push(`/dashboard/${dashboardId}/invite`)}
            className="group flex cursor-pointer items-center gap-2 text-gray-300 hover:text-white"
          >
            <IconShare />
            <span className="hidden text-sm font-medium md:inline">공유</span>
          </button>
          <button
            className="group flex cursor-pointer items-center gap-2 text-gray-300 hover:text-white"
            onClick={() => router.push(`/logout`)}
          >
            <LogoutIcon className="w-4 text-[#A39FB2]" />
            <span className="hidden text-sm font-medium md:inline">
              로그아웃
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
