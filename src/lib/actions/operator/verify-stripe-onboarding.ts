"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

export interface VerifyOnboardingResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    operator: {
      id: string;
      stripeAccountId: string;
      stripeAccountStatus: "ACTIVE" | "ONBOARDING" | string;
    };
    stripeStatus: {
      payouts_enabled: boolean;
      charges_enabled: boolean;
      details_submitted: boolean;
    };
  };
}

export const useVerifyStripeOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (operatorId: string) => {
      const response = await api.post<VerifyOnboardingResponse>(
        `/operator/verify-onboarding/${operatorId}`
      );
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["operator-me"] });
    }
  });
};
