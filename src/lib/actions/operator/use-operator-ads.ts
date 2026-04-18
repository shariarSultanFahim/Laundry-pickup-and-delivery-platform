"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type {
  AdSubscriptionCheckoutSessionPayload,
  AdSubscriptionCheckoutSessionResponse,
  AdSubscriptionPlanListResponse,
  CancelAdSubscriptionResponse,
  CreateAdPayload,
  CreateAdResponse,
  CreateAdSubscriptionPlanPayload,
  CreateAdSubscriptionPlanResponse,
  DeleteAdResponse,
  DeleteMyActiveAdResponse,
  MyActiveAdResponse,
  OperatorAdListQueryParams,
  OperatorAdsResponse,
  OperatorAdSubscriptionListQueryParams,
  OperatorAdSubscriptionsResponse,
  OperatorStoreServicesResponse,
  UpdateAdPayload,
  UpdateAdResponse
} from "@/types/operator-ad";

import { del, get, patch, post } from "@/lib/api";

const API_AD_BASE = "/ad";
const API_AD_SUBSCRIPTION_BASE = "/adsubscription";
const API_AD_SUBSCRIPTION_PLAN_BASE = "/adsubscriptionplan";

const sanitizeParams = <T extends Record<string, unknown>>(params: T) => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  ) as T;
};

export function useGetOperatorAds(params?: OperatorAdListQueryParams) {
  return useQuery({
    queryKey: ["operator-ads", params],
    queryFn: () =>
      get<OperatorAdsResponse>(`${API_AD_BASE}/`, {
        params: sanitizeParams({
          searchTerm: params?.searchTerm,
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
          userLat: params?.userLat,
          userLng: params?.userLng
        })
      })
  });
}

export function useGetOperatorAdSubscriptions(params?: OperatorAdSubscriptionListQueryParams) {
  return useQuery({
    queryKey: ["operator-ad-subscriptions", params],
    queryFn: () =>
      get<OperatorAdSubscriptionsResponse>(`${API_AD_SUBSCRIPTION_BASE}/`, {
        params: sanitizeParams({
          page: params?.page ?? 1,
          limit: params?.limit ?? 10
        })
      })
  });
}

export function useGetAdSubscriptionPlans() {
  return useQuery({
    queryKey: ["ad-subscription-plans"],
    queryFn: () => get<AdSubscriptionPlanListResponse>(`${API_AD_SUBSCRIPTION_PLAN_BASE}/`)
  });
}

export function useCreateAdSubscriptionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdSubscriptionPlanPayload) =>
      post<CreateAdSubscriptionPlanResponse, CreateAdSubscriptionPlanPayload>(
        `${API_AD_SUBSCRIPTION_PLAN_BASE}/`,
        payload
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["ad-subscription-plans"] });
    }
  });
}

export function useCreateAdSubscriptionCheckoutSession() {
  return useMutation({
    mutationFn: (payload: AdSubscriptionCheckoutSessionPayload) =>
      post<AdSubscriptionCheckoutSessionResponse, AdSubscriptionCheckoutSessionPayload>(
        `${API_AD_SUBSCRIPTION_BASE}/checkout-session`,
        payload
      )
  });
}

export function useCreateAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdPayload) =>
      post<CreateAdResponse, CreateAdPayload>(`${API_AD_BASE}/`, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["operator-ads"] });
      void queryClient.invalidateQueries({ queryKey: ["operator-ad-subscriptions"] });
      void queryClient.invalidateQueries({ queryKey: ["operator-my-active-ad"] });
    }
  });
}

interface UpdateAdMutationPayload {
  adId: string;
  payload: UpdateAdPayload;
}

export function useUpdateAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ adId, payload }: UpdateAdMutationPayload) =>
      patch<UpdateAdResponse, UpdateAdPayload>(`${API_AD_BASE}/${adId}`, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["operator-ads"] });
    }
  });
}

export function useDeleteAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adId: string) => del<DeleteAdResponse>(`${API_AD_BASE}/${adId}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["operator-ads"] });
      void queryClient.invalidateQueries({ queryKey: ["operator-my-active-ad"] });
    }
  });
}

export function useGetMyActiveAd() {
  return useQuery({
    queryKey: ["operator-my-active-ad"],
    queryFn: () => get<MyActiveAdResponse>(`${API_AD_BASE}/my-active-ad`)
  });
}

export function useDeleteMyActiveAd() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => del<DeleteMyActiveAdResponse>(`${API_AD_BASE}/my-active-ad`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["operator-ads"] });
      void queryClient.invalidateQueries({ queryKey: ["operator-my-active-ad"] });
    }
  });
}

export function useCancelAdSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: string) =>
      post<CancelAdSubscriptionResponse>(
        `${API_AD_SUBSCRIPTION_BASE}/cancel/${subscriptionId}`,
        undefined
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["operator-ad-subscriptions"] });
      void queryClient.invalidateQueries({ queryKey: ["operator-ads"] });
      void queryClient.invalidateQueries({ queryKey: ["operator-my-active-ad"] });
      void queryClient.invalidateQueries({ queryKey: ["operator-me"] });
    }
  });
}

export function useGetOperatorStoreServices(operatorId?: string) {
  return useQuery({
    queryKey: ["operator-store-services", operatorId],
    enabled: Boolean(operatorId),
    queryFn: () => get<OperatorStoreServicesResponse>(`/storeservice/operator/${operatorId}`)
  });
}
