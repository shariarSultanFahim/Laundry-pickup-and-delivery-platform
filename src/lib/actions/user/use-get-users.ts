import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { GetUsersResponse, UserStatus } from "@/types/user";

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  status?: UserStatus | "";
  searchTerm?: string;
  minspent?: number;
  isVerified?: boolean;
}

export function useGetUsers(params: UsersQueryParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.status) searchParams.append("status", params.status);
      if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
      if (params.minspent) searchParams.append("minspent", params.minspent.toString());
      if (params.isVerified !== undefined) searchParams.append("isVerified", params.isVerified.toString());

      const { data } = await api.get<GetUsersResponse>(`/user?${searchParams.toString()}`);
      return data;
    }
  });
}
