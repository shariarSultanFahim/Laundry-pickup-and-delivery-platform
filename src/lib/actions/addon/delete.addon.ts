"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { del } from "@/lib/api";

interface DeleteAddonResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

export const useDeleteAddon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) =>
            del<DeleteAddonResponse>(`/addon/${id}`),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ["addons"] });
        },
        onError: (error) => {
            const msg = isAxiosError<{ message?: string }>(error)
                ? (error.response?.data?.message ?? error.message)
                : "An unexpected error occurred";
            throw new Error(msg);
        }
    });
};
