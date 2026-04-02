"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { patch } from "@/lib/api";
import { AddonResponse, UpdateAddonPayload } from "@/types/addon";

interface UpdateAddonInput {
  id: string;
  payload: UpdateAddonPayload;
}

export const useUpdateAddon = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: UpdateAddonInput) =>
            patch<AddonResponse, UpdateAddonPayload>(`/addon/${id}`, payload),
        onSuccess: (data) => {
            void queryClient.invalidateQueries({ queryKey: ["addons"] });
            // Optionally update the individual addon cache if needed
            void queryClient.setQueryData(["addon", data.data.id], data.data);
        },
        onError: (error) => {
            const msg = isAxiosError<{ message?: string }>(error)
                ? (error.response?.data?.message ?? error.message)
                : "An unexpected error occurred";
            throw new Error(msg);
        }
    });
};
