import { useQuery } from "@tanstack/react-query";

import type { FetchOrderDetailsResponse } from "@/types/order-management";

import { get } from "@/lib/api";

export function useGetOrderDetails(orderId: string | null, enabled = true) {
  return useQuery({
    queryKey: ["operator-orders", "details", orderId],
    queryFn: () => get<FetchOrderDetailsResponse>(`/order/${orderId}`),
    enabled: Boolean(orderId) && enabled
  });
}
