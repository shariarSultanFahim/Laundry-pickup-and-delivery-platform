import { useQuery } from "@tanstack/react-query";

import type { MyOrdersResponse } from "@/types/operator-analytics";
import type { OrderStatus } from "@/types/order-management";

import { get } from "@/lib/api";

interface GetMyOrdersParams {
  page: number;
  limit: number;
  searchTerm?: string;
  status?: OrderStatus;
}

export function useGetMyOrders(params: GetMyOrdersParams) {
  return useQuery({
    queryKey: ["operator-orders", "my-orders", params],
    queryFn: () => get<MyOrdersResponse>("/order/my-orders", { params })
  });
}
