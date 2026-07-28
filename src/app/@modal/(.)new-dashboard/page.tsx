"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useCreateDashboardMutation } from "@/app/mydashboard/hooks/useDashboards";
import { Button } from "@/components/Button";
import {
  ColorName,
  DashboardColorChoiceList,
} from "@/components/DashboardColorChoiceList";
import { Input } from "@/components/input/input";
import { Modal } from "@/components/modal/Modal";
import { ModalHeader } from "@/components/modal/ModalHeader";

const ColorMatch = {
  red: "#ae2e24",
  orange: "#9f4b00",
  yellow: "#bd8c00",
  green: "#206e4e",
  blue: "#1458bc",
};

export default function DashboardSetupModal() {
  const { mutateAsync } = useCreateDashboardMutation();

  const [dashboardTitle, setDashboardTitle] = useState("");
  const [error, setError] = useState("");
  const [selectColor, setSelectColor] = useState<ColorName>();
  const [selectHex, setSelectHex] = useState("");
  const [hasSelection, setHasSelection] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  if (pathname !== "/new-dashboard") return null;

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDashboardTitle(e.target.value);
    if (error) setError("");
  };

  const handleColorSelect = (id: ColorName) => {
    const hexcode = typeToHex(id);
    setSelectHex(hexcode);
    setSelectColor(id);
    setHasSelection(true);
  };

  //selectColor를 헥사코드로 바꿔주는 함수
  const typeToHex = (type: ColorName) => {
    return ColorMatch[type];
  };

  //대시보드 생성하는 함수
  const handlePostNewDashboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectHex && dashboardTitle) {
      const res = await mutateAsync({
        title: dashboardTitle,
        color: selectHex,
      });
      router.replace(`/dashboard/${res.id}`);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    router.back();
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Modal>
      <div className="border-gray-stroke flex flex-col gap-5 rounded-3xl">
        <ModalHeader>새 대시보드 생성</ModalHeader>
        <form name="postNewDashboard" className="flex flex-col gap-5">
          <Input>
            <Input.Wrapper>
              <Input.Field
                placeholder="대시보드 이름을 입력해주세요."
                value={dashboardTitle}
                onChange={handleFieldChange}
              />
            </Input.Wrapper>
            <Input.Error />
          </Input>
          <DashboardColorChoiceList
            onColorChange={handleColorSelect}
            selectedColorName={selectColor}
            hasSelection={hasSelection}
          />
          <div className="flex gap-5">
            <Button
              colorType="secondary"
              type="button"
              onClick={handleCancel}
            >
              취소
            </Button>
            <Button onClick={handlePostNewDashboard} type="submit">
              생성
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
