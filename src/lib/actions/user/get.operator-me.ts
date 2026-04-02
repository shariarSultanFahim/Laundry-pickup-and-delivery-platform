"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { OperatorMeResponse } from "@/types/user";

export const getOperatorMe = async (): Promise<OperatorMeResponse> => {
  const response = await api.get<OperatorMeResponse>("/user/operator-getme");
  return response.data;
};

export const useGetOperatorMe = () => {
  return useQuery({
    queryKey: ["operator-me"],
    queryFn: getOperatorMe,
  });
};
