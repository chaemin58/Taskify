"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

import { getDashboardDetail, putDashboardUpdate } from "@/api/data";
import { DashboardColorChoiceList } from "@/components/DashboardColorChoiceList";
import { Input } from "@/components/input/input";
import { Label } from "@/components/label/label";
import { SaveToast } from "@/components/SaveToast";
import { validateDashboardTitle } from "@/utils/dashboardLengthValidation";

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

type ColorName = "red" | "orange" | "yellow" | "green" | "blue";

interface ColorMap {
  [hex: string]: ColorName;
}

const COLOR_MAP: ColorMap = {
  "#ae2e24": "red",
  "#9f4b00": "orange",
  "#bd8c00": "yellow",
  "#206e4e": "green",
  "#1458bc": "blue",
};

export const REVERSE_COLOR_MAP = Object.fromEntries(
  Object.entries(COLOR_MAP).map(([hex, name]) => [name, hex])
);

export function DashboardEdit() {
  const params = useParams();
  const dashboardId = Number(params.id);
  const queryClient = useQueryClient();

  const [titleError, setTitleError] = useState<string>("");

  const { data: dashboardDetail, isLoading } = useQuery({
    queryKey: ["dashboardDetail", dashboardId],
    queryFn: () => getDashboardDetail(dashboardId),
  });

  const [dashboardData, setDashboardData] = useState(() =>
    dashboardDetail
      ? { title: dashboardDetail.title, color: dashboardDetail.color }
      : { title: "", color: "" }
  );
  const [originalData, setOriginalData] = useState(() =>
    dashboardDetail
      ? { title: dashboardDetail.title, color: dashboardDetail.color }
      : { title: "", color: "" }
  );

  if (dashboardDetail && !originalData.title && !originalData.color) {
    setDashboardData({
      title: dashboardDetail.title,
      color: dashboardDetail.color,
    });
    setOriginalData({
      title: dashboardDetail.title,
      color: dashboardDetail.color,
    });
  }

  const isChanged =
    dashboardData.title !== originalData.title ||
    dashboardData.color !== originalData.color;

  const { mutate: handleSave, isPending: isUpdating } = useMutation({
    mutationFn: () => putDashboardUpdate(dashboardId, dashboardData),
    onSuccess: () => {
      setOriginalData(dashboardData);
      queryClient.invalidateQueries({ queryKey: ["dashboards"] });
      queryClient.invalidateQueries({
        queryKey: ["dashboardDetail", dashboardId],
      });
    },
    onError: (error) => {
      const err = error as ApiError;
      const errorMessage =
        err.response?.data?.message || "저장에 실패했습니다.";
      alert(errorMessage);
    },
  });

  const selectedColorName: ColorName = COLOR_MAP[dashboardData.color];

  const handleColorChange = (name: string) => {
    const hexCode = REVERSE_COLOR_MAP[name];
    setDashboardData({ ...dashboardData, color: hexCode });
  };

  const handleDashboardTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTitleError(validateDashboardTitle(e.target.value));
  };

  if (isLoading || !dashboardData.color)
    return <div>데이터를 불러오는 중입니다...</div>;

  return (
    <div>
      <form
        className="flex flex-col gap-7.5 max-md:gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input errorMessage={titleError}>
          <Label htmlFor="name">이름</Label>
          <Input.Wrapper>
            <Input.Field
              value={dashboardData.title}
              id="name"
              placeholder="이름을 입력해주세요"
              onChange={(e) =>
                setDashboardData({ ...dashboardData, title: e.target.value })
              }
              onBlur={handleDashboardTitleBlur}
            />
          </Input.Wrapper>
          <Input.Error />
        </Input>
        <div className="min-w-83.75">
          <DashboardColorChoiceList
            type="edit"
            selectedColorName={selectedColorName}
            onColorChange={handleColorChange}
          />
        </div>
      </form>
      {isChanged && (
        <SaveToast onSave={() => handleSave()} isLoading={isUpdating} />
      )}
    </div>
  );
}
