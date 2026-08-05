"use client";

import { ComponentType, ReactNode, SVGProps } from "react";

interface EditSideButtonProps {
  children: ReactNode;
  handleClick?: () => void;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  isDelete?: boolean;
  isActive?: boolean;
}

export function EditSideButton({
  children,
  handleClick,
  icon: Icon,
  isDelete,
  isActive,
}: EditSideButtonProps) {
  return (
    <button
      onClick={handleClick}
      className="group relative flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-2xl px-3.5 py-4 text-left"
    >
      {/* 텍스트: 삭제 버튼이면 빨간색, 활성화 상태면 흰색(혹은 강조색) */}
      <span
        className={`relative z-10 transition-colors ${
          isDelete
            ? "text-red"
            : isActive
              ? "font-bold text-white"
              : "text-gray-300"
        }`}
      >
        {children}
      </span>

      {/* 아이콘이 있을 때만 렌더링 */}
      {Icon && <Icon width={24} height={24} className="relative z-10" />}

      {/* 배경 호버 효과 (원형이 커지는 애니메이션) */}
      <div
        className={`absolute inset-0 z-0 m-auto h-0 w-0 bg-[#2C2B30] opacity-0 transition-all duration-500 ease-out group-hover:h-[300%] group-hover:w-[300%] group-hover:opacity-100 ${isActive ? "h-[300%] w-[300%] opacity-100" : ""} `}
      />
    </button>
  );
}
