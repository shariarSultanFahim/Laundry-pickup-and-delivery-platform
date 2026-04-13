import { useMutation, useQueryClient } from "@tanstack/react-query";

import { post } from "@/lib/api";

import type { CreateFAQPayload, FAQResponse } from "@/types";

export function useCreateFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFAQPayload) => post<FAQResponse, CreateFAQPayload>("/faq", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-faq"]
      });
    }
  });
}
