import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patch } from "@/lib/api";

import type { FAQResponse, UpdateFAQPayload } from "@/types";

export function useUpdateFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateFAQPayload }) =>
      patch<FAQResponse, UpdateFAQPayload>(`/faq/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-faq"]
      });
    }
  });
}
