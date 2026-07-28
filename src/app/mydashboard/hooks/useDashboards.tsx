import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postDashboard } from "@/api/data";
import { CreateDashboardRequest } from "@/types/api";

export function useCreateDashboardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDashboardRequest) => postDashboard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboards"] });
    },
  });
}
