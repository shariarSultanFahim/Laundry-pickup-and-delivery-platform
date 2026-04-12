import { get } from "@/lib/api";
import type { FetchOrderDetailsResponse, FetchOrdersParams, FetchOrdersResponse } from "@/types/order-management";

export async function fetchOrders({
  page = 1,
  limit = 10,
  searchTerm = "",
  status,
  paymentStatus,
  operatorID,
  fromDate,
  toDate
}: FetchOrdersParams): Promise<FetchOrdersResponse> {
  const params = new URLSearchParams();
  if (page) params.append("page", page.toString());
  if (limit) params.append("limit", limit.toString());
  if (searchTerm) params.append("searchTerm", searchTerm);
  if (status) params.append("status", status);
  if (paymentStatus) params.append("paymentStatus", paymentStatus);
  if (operatorID) params.append("operatorID", operatorID);
  if (fromDate) params.append("fromDate", fromDate);
  if (toDate) params.append("toDate", toDate);

  const url = `/order?${params.toString()}`;
  return get<FetchOrdersResponse>(url);
}

export async function fetchOrderById(id: string): Promise<FetchOrderDetailsResponse> {
  return get<FetchOrderDetailsResponse>(`/order/${id}`);
}
