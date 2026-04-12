import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { OperatorStatus, UpdateOperatorStatusPayload } from "@/types/operator-management";

import { api } from "@/lib/api";

export function useUpdateOperatorStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OperatorStatus }) => {
      const { data } = await api.patch(`/user/${id}`, {
        status
      } satisfies UpdateOperatorStatusPayload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["operators"] });
      queryClient.invalidateQueries({ queryKey: ["operator", variables.id] });
    }
  });
}
