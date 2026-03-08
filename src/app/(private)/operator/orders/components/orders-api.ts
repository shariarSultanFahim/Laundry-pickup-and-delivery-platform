import type { FetchOrdersParams, FetchOrdersResponse } from "../data/orders";
import { operatorNewOrders, operatorOrders } from "../data/orders";

const ordersList = [...operatorOrders];
const newOrdersList = [...operatorNewOrders];

type NewOrderStatus = "Pending" | "Accepted" | "Rejected";
type MainOrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

interface UpdateNewOrderStatusParams {
  orderId: string;
  status: NewOrderStatus;
}

interface UpdateOrderStatusParams {
  orderId: string;
  status: MainOrderStatus;
}

export async function fetchOrders({
  page,
  pageSize,
  search,
  filters
}: FetchOrdersParams): Promise<FetchOrdersResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = ordersList.filter(
    (order) =>
      order.status !== "Pending" && order.status !== "Accepted" && order.status !== "Rejected"
  );

  // Filter by search term (order ID or customer name)
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.id.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower)
    );
  }

  // Filter by status
  if (filters?.status) {
    filtered = filtered.filter((order) => order.status === filters.status);
  }

  // Filter by date range (mock implementation)
  if (filters?.fromDate || filters?.toDate) {
    // In a real app, you would parse and compare dates
    // For now, we'll keep all results
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);

  return {
    items,
    page,
    pageSize,
    total,
    totalPages
  };
}

export async function fetchNewOrders({
  page,
  pageSize,
  search,
  filters
}: FetchOrdersParams): Promise<FetchOrdersResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = newOrdersList;

  // Filter by search term (order ID or customer name)
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.id.toLowerCase().includes(searchLower) ||
        order.customerName.toLowerCase().includes(searchLower)
    );
  }

  // Filter by status
  if (filters?.status) {
    filtered = filtered.filter((order) => order.status === filters.status);
  }

  // Filter by date range (mock implementation)
  if (filters?.fromDate || filters?.toDate) {
    // In a real app, you would parse and compare dates
    // For now, we'll keep all results
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);

  return {
    items,
    page,
    pageSize,
    total,
    totalPages
  };
}

export async function updateNewOrderStatus({
  orderId,
  status
}: UpdateNewOrderStatusParams): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const orderIndex = newOrdersList.findIndex((order) => order.id === orderId);
  if (orderIndex === -1) {
    return;
  }

  if (status === "Accepted") {
    const [acceptedOrder] = newOrdersList.splice(orderIndex, 1);
    ordersList.unshift({
      ...acceptedOrder,
      status: "Processing"
    });
    return;
  }

  newOrdersList[orderIndex] = {
    ...newOrdersList[orderIndex],
    status
  };
}

export async function updateOrderStatus({
  orderId,
  status
}: UpdateOrderStatusParams): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const orderIndex = ordersList.findIndex((order) => order.id === orderId);
  if (orderIndex === -1) {
    return;
  }

  ordersList[orderIndex] = {
    ...ordersList[orderIndex],
    status
  };
}
