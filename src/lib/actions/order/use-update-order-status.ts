import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { OrderStatus } from "@/types/order-management";

import { patch } from "@/lib/api";

interface UpdateOrderStatusPayload {
  id: string;
  status: Exclude<OrderStatus, "REFUNDED">;
}

interface UpdateOrderStatusResponse {
  success: boolean;
  message: string;
}

async function updateOrderStatus(payload: UpdateOrderStatusPayload) {
  return patch<UpdateOrderStatusResponse, { status: Exclude<OrderStatus, "REFUNDED"> }>(
    `/order/update-status/${payload.id}`,
    { status: payload.status }
  );
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["operator-orders", "my-orders"] });
      await queryClient.invalidateQueries({ queryKey: ["operator-orders", "details"] });
      await queryClient.invalidateQueries({ queryKey: ["operator-dashboard", "my-orders"] });
      await queryClient.invalidateQueries({ queryKey: ["operator-dashboard", "stats"] });
    }
  });
}
