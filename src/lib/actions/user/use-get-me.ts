import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { GetMeResponse } from "@/types/user";

export async function fetchMe(): Promise<GetMeResponse> {
  const response = await api.get<GetMeResponse>("/user/get-me");
  return response.data;
}

export function useGetMe() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: fetchMe
  });
}
