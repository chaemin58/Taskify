import { getCardList } from "@/api/data";

export const cardKeys = {
  all: ["cards"] as const,
  list: (columnId: number) => [...cardKeys.all, "list", columnId] as const,
};

export function cardListQueryOptions(columnId: number) {
  return {
    queryKey: cardKeys.list(columnId),
    queryFn: () => getCardList({ columnId }),
  };
}

