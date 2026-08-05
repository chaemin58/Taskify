"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";

import { postCardImage, getCardList } from "@/api/data";
import { Dropdown } from "@/components/Dropdown";
import { ImageUpload } from "@/components/ImageUpload";
import { Input } from "@/components/input/input";
import { Label } from "@/components/label/label";
import { ModalCloseButton } from "@/components/modal/ModalCloseButton";
import { FlowbiteDatePicker } from "@/components/style/FlowbiteDatePicker";
import { useCreateCardMutation } from "@/hooks/useCards";

interface Member {
  userId: number;
  nickname: string;
  profileImageUrl?: string | null;
}

interface Column {
  id: number;
  title: string;
}

interface TaskAddFormProps {
  columnList: Column[];
  memberList: Member[];
  dashboardId: number;
  columnId: number;
}
interface CreateCardRequest {
  dashboardId: number;
  columnId: number;
  title: string;
  description: string;
  assigneeUserId?: number;
  dueDate?: string;
  tags: string[];
  imageUrl?: string;
}

export function TaskAddForm({
  columnList,
  memberList,
  dashboardId,
  columnId,
}: TaskAddFormProps) {
  const router = useRouter();
  const createCard = useCreateCardMutation();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [imageKey, setImageKey] = useState(() => Date.now());
  const uniqueMembers = useMemo(() => {
    const map = new Map();
    memberList.forEach((member) => {
      if (!map.has(member.userId)) {
        map.set(member.userId, member);
      }
    });
    return Array.from(map.values()) as Member[];
  }, [memberList]);

  const [formData, setFormData] = useState({
    columnId: columnId || columnList[0]?.id || 0,
    assigneeUserId: memberList[0]?.userId || 0,
    title: "",
    description: "",
    dueDate: "",
  });

  useEffect(() => {
    const fetchExistingTags = async () => {
      try {
        const tagSet = new Set<string>([
          "프로젝트",
          "운영",
          "기획",
          "디자인",
          "개발",
        ]);
        const promises = columnList.map((col) =>
          getCardList({ columnId: col.id, size: 50 })
        );
        const responses = await Promise.all(promises);
        responses.forEach((res) => {
          if (res.cards) {
            res.cards.forEach((card) =>
              card.tags.forEach((tag) => tagSet.add(tag))
            );
          }
        });
        setSuggestedTags(Array.from(tagSet));
      } catch (error) {
        console.error("태그 로드 실패:", error);
      }
    };
    if (columnList.length > 0) fetchExistingTags();
  }, [columnList]);

  const addTag = (tagName: string) => {
    const trimmed = tagName.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      if (!suggestedTags.includes(trimmed)) {
        setSuggestedTags((prev) => [...prev, trimmed]);
      }
    }
    setTagInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (createCard.isPending) return;

    try {
      let imageUrl = "";
      if (imageFile) {
        const uploadRes = await postCardImage(
          Number(formData.columnId),
          imageFile
        );
        imageUrl = uploadRes.imageUrl;
      }

      const submitData: CreateCardRequest = {
        dashboardId: Number(dashboardId),
        columnId: Number(formData.columnId),
        title: formData.title,
        description: formData.description,
        tags,
      };

      if (formData.assigneeUserId && formData.assigneeUserId !== 0) {
        submitData.assigneeUserId = Number(formData.assigneeUserId);
      }

      if (formData.dueDate) {
        submitData.dueDate = formData.dueDate.replace("T", " ");
      }

      submitData.tags = tags;

      if (imageUrl) {
        submitData.imageUrl = imageUrl;
      }

      await createCard.mutateAsync(submitData);
      router.back();
    } catch (error) {
      console.error("카드 생성 중 오류:", error);
      alert("생성 실패: 입력 내용을 확인해 주세요.");
    }
  };

  return (
    <div className="md:bg-modal-background fixed inset-0 z-100 flex flex-col overflow-y-auto border-none bg-[#1B1A1F] p-5 text-white shadow-2xl [scrollbar-width:none] md:fixed md:top-1/2 md:left-1/2 md:h-fit md:max-h-[calc(100vh-100px)] md:min-h-100 md:w-126.5 md:max-w-none md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:border md:border-[#333] md:p-7 lg:max-h-[calc(100vh-128px)] lg:w-150 lg:p-7.5 [&::-webkit-scrollbar]:hidden">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold">할 일 생성</h2>
        <ModalCloseButton />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <Dropdown
            label="컬럼"
            defaultValue={String(formData.columnId)}
            options={columnList.map((c) => ({
              label: c.title,
              value: String(c.id),
            }))}
            onSelect={(val) =>
              setFormData({
                ...formData,
                columnId: Number(val),
              })
            }
          />

          <Dropdown
            label="담당자"
            showAvatar
            options={uniqueMembers.map((m) => ({
              label: m.nickname,
              value: String(m.userId),
              image: m.profileImageUrl || undefined,
            }))}
            onSelect={(val) =>
              setFormData({
                ...formData,
                assigneeUserId: Number(val),
              })
            }
          />
        </div>

        <Input>
          <Label htmlFor="title">제목</Label>
          <Input.Wrapper>
            <Input.Field
              id="title"
              required
              placeholder="제목을 입력해 주세요"
              className="border-none! bg-[#201F23]"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </Input.Wrapper>
        </Input>

        <div className="flex flex-col gap-2">
          <Label>설명</Label>
          <textarea
            rows={4}
            className="w-full rounded-[14px] border border-gray-700 bg-[#201F23] p-3 transition-colors outline-none focus:border-[#00BFFF]"
            placeholder="설명을 입력해 주세요"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <Input>
          <Label htmlFor="dueDate">마감일</Label>
          <FlowbiteDatePicker
            value={formData.dueDate}
            onChange={(selectedDate) =>
              setFormData({ ...formData, dueDate: selectedDate })
            }
            className="z-[2000]"
          />
        </Input>

        <div className="flex flex-col gap-2">
          <Label htmlFor="tags">태그</Label>
          <div className="relative">
            <div className="flex flex-wrap gap-2 rounded-[14px] border border-gray-700 bg-[#201F23] p-3 transition-colors focus-within:border-[#00BFFF]">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 rounded bg-[#333] px-2 py-1 text-sm text-[#00A200]"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((_, idx) => idx !== i))}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                placeholder="태그 입력"
                className="flex-1 bg-transparent text-gray-100 outline-none"
              />
            </div>

            {tagInput && (
              <div className="absolute top-[calc(100%+8px)] z-110 w-full rounded-xl border border-gray-700 bg-[#1e1e1e] p-4 shadow-2xl">
                <p className="mb-3 text-xs text-gray-500">
                  기존 태그 검색 결과
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedTags
                    .filter((t) => t.includes(tagInput) && !tags.includes(t))
                    .map((match) => (
                      <button
                        key={match}
                        type="button"
                        onClick={() => addTag(match)}
                        className="rounded bg-[#333] px-3 py-1 text-sm text-white transition hover:bg-[#00A200]"
                      >
                        {match}
                      </button>
                    ))}

                  {!suggestedTags.some((t) => t === tagInput) && (
                    <div className="mt-1 flex w-full items-center gap-2 border-t border-gray-800 pt-3">
                      <button
                        type="button"
                        onClick={() => addTag(tagInput)}
                        className="rounded bg-[#00A200] px-3 py-1 text-sm font-medium text-white"
                      >
                        &quot;{tagInput}&quot; 신규 추가
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <ImageUpload
          key={imageKey}
          onImageChange={(file) => {
            if (file && !/\.(png|jpg|jpeg)$/i.test(file.name)) {
              alert("png, jpg, jpeg 형식의 이미지만 업로드 가능합니다.");
              setImageFile(null);
              setImageKey(Date.now());
              return;
            }
            setImageFile(file);
          }}
        />

        <div className="mt-4 flex gap-3 pb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-[14px] border border-gray-700 py-4 transition-colors hover:bg-white/5"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={createCard.isPending}
            className="flex-1 rounded-[14px] bg-[#00A200] py-4 font-bold transition-colors hover:bg-[#008100] disabled:bg-gray-600"
          >
            {createCard.isPending ? "생성 중..." : "생성"}
          </button>
        </div>
      </form>
    </div>
  );
}
