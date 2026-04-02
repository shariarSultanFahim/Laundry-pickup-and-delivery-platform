"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { post } from "@/lib/api";
import { AddonResponse, CreateAddonPayload } from "@/types/addon";

export const useCreateAddon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateAddonPayload) =>
            post<AddonResponse, CreateAddonPayload>("/addon", payload),
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
