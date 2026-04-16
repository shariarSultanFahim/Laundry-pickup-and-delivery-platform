"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  FetchDisputesParams,
  ResolveDisputePayload,
  RespondToDisputePayload
} from "@/types/dispute-management";

import { fetchDisputes, getDisputeDetails, resolveDispute, respondToDispute } from "./disputes-api";

type DisputeScope = "admin" | "operator" | "shared";

export const disputeQueryKeys = {
  all: ["disputes"] as const,
  list: (scope: DisputeScope, params: FetchDisputesParams) => ["disputes", scope, params] as const,
  detail: (id: string) => ["dispute", id] as const
};

export function useGetDisputes(params: FetchDisputesParams, scope: DisputeScope) {
  return useQuery({
    queryKey: disputeQueryKeys.list(scope, params),
    queryFn: () => fetchDisputes(params)
  });
}

export function useGetDisputeDetails(disputeId: string, enabled: boolean) {
  return useQuery({
    queryKey: disputeQueryKeys.detail(disputeId),
    queryFn: () => getDisputeDetails(disputeId),
    enabled
  });
}

export function useResolveDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ disputeId, payload }: { disputeId: string; payload: ResolveDisputePayload }) =>
      resolveDispute(disputeId, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: disputeQueryKeys.all });
      void queryClient.invalidateQueries({
        queryKey: disputeQueryKeys.detail(variables.disputeId)
      });
    }
  });
}

export function useRespondToDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ disputeId, payload }: { disputeId: string; payload: RespondToDisputePayload }) =>
      respondToDispute(disputeId, payload),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: disputeQueryKeys.all });
      void queryClient.invalidateQueries({
        queryKey: disputeQueryKeys.detail(variables.disputeId)
      });
    }
  });
}
