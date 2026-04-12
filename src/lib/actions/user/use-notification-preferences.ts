"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { get, patch } from "@/lib/api";
import {
  NotificationPreferencesResponse,
  UpdateNotificationPreferencesRequest
} from "@/types/user";

/**
 * Hook to fetch user notification preferences
 */
export const useGetNotificationPreferences = (enabled = true) => {
  return useQuery({
    queryKey: ["notification-preferences"],
    enabled,
    queryFn: () => get<NotificationPreferencesResponse>("/user/notification-preferences")
  });
};

/**
 * Hook to update user notification preferences
 */
export const useUpdateNotificationPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateNotificationPreferencesRequest) =>
      patch<NotificationPreferencesResponse, UpdateNotificationPreferencesRequest>(
        "/user/notification-preferences",
        payload
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["notification-preferences"] });
    },
    onError: (error) => {
      const msg = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : "An unexpected error occurred";
      throw new Error(msg);
    }
  });
};
