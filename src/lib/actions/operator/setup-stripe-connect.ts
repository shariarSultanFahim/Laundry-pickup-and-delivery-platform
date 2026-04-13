"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";

export interface SetupStripeConnectResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    operator: {
      id: string;
      userId: string;
      stripeAccountId: string;
      stripeAccountStatus: string;
    };
    onboardingLink: string;
  };
}

export const useSetupStripeConnect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (operatorId: string) => {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      const successUrl = `${baseUrl}/operator/onboarding-success`;
      const failureUrl = `${baseUrl}/operator/onboarding-failed`;

      const response = await api.post<SetupStripeConnectResponse>(
        `/operator/setup-connect/${operatorId}`,
        {
          redirectUrls: {
            success: successUrl,
            failure: failureUrl
          }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["operator-me"] });
    }
  });
};
