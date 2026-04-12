import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  OperatorApprovalStatus,
  UpdateOperatorApprovalStatusPayload
} from "@/types/operator-management";

import { api } from "@/lib/api";

export function useUpdateOperatorApprovalStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      operatorId,
      approvalStatus
    }: {
      operatorId: string;
      approvalStatus: OperatorApprovalStatus;
    }) => {
      const { data } = await api.patch(`/operator/${operatorId}`, {
        approvalStatus
      } satisfies UpdateOperatorApprovalStatusPayload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["operators"] });
      queryClient.invalidateQueries({ queryKey: ["operator", variables.operatorId] });
    }
  });
}
