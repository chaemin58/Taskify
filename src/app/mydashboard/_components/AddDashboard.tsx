"use client";

import Link from "next/link";

import SquarePlus from "@/assets/squareplus-icon.svg";

export function AddDashboard() {
  return (
    <Link
      href={"/new-dashboard"}
      className="bg-black-700 relative flex h-20 w-full max-w-89 min-w-55 items-center justify-center rounded-3xl border-2 border-dashed border-gray-800 p-5"
    >
      <div className="flex items-center justify-center">새로운 대시보드</div>
      <SquarePlus className="m-2" />
    </Link>
  );
}
