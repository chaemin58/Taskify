"use client";

import { Button } from "@/components/Button";
import { Modal } from "@/components/modal/Modal";
import { useRouter } from "next/navigation";

export default function LogoutModal() {
  const router = useRouter();

  const handleCloseModal = (e: React.MouseEvent) => {
    router.back();
    e.stopPropagation();
    e.preventDefault();
  };

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  };

  return (
    <Modal>
      <div className="flex flex-col gap-2 md:gap-5 lg:px-7 lg:py-3">
        <div className="text-xl text-[#ffffff]">로그아웃 하시겠습니까?</div>
        <div className="flex gap-2">
          <Button colorType="secondary" size="md" onClick={handleCloseModal}>
            취소
          </Button>
          <Button size="md" onClick={handleLogout}>
            확인
          </Button>
        </div>
      </div>
    </Modal>
  );
}
