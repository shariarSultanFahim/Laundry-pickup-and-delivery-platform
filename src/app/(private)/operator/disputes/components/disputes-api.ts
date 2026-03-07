import type {
  DisputeManagementDispute,
  FetchDisputesParams,
  FetchDisputesResponse
} from "@/types/dispute-management";

const mockDisputes: DisputeManagementDispute[] = [
  {
    id: "od1",
    claimId: "CLM-2850",
    orderId: "ORD-9240",
    customerName: "Lisa Anderson",
    customerEmail: "lisa@email.com",
    operatorName: "My Laundry Service",
    status: "open",
    description:
      "Shirt came back with bleach stains that were not present before delivery. The quality of service has declined.",
    photos: [
      "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"
    ],
    createdAt: "2024-01-18"
  },
  {
    id: "od2",
    claimId: "CLM-2849",
    orderId: "ORD-9235",
    customerName: "Robert Martinez",
    customerEmail: "robert@email.com",
    operatorName: "My Laundry Service",
    status: "open",
    description: "Missing items in the delivered order. Ordered 5 shirts but only received 4.",
    photos: [
      "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"
    ],
    createdAt: "2024-01-17"
  },
  {
    id: "od3",
    claimId: "CLM-2848",
    orderId: "ORD-9230",
    customerName: "Jennifer Lee",
    customerEmail: "jennifer@email.com",
    operatorName: "My Laundry Service",
    status: "escalated",
    description: "Delicate fabric was damaged during washing. The item is no longer wearable.",
    photos: ["https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300"],
    createdAt: "2024-01-16"
  },
  {
    id: "od4",
    claimId: "CLM-2847",
    orderId: "ORD-9225",
    customerName: "Kevin Thompson",
    customerEmail: "kevin@email.com",
    operatorName: "My Laundry Service",
    status: "resolved",
    description: "Color fading in shirt after wash",
    photos: ["https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300"],
    createdAt: "2024-01-15"
  },
  {
    id: "od5",
    claimId: "CLM-2846",
    orderId: "ORD-9220",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@email.com",
    operatorName: "My Laundry Service",
    status: "open",
    description: "Stain appeared on my pants after drop-off. Not satisfactory quality.",
    photos: ["https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300"],
    createdAt: "2024-01-14"
  },
  {
    id: "od6",
    claimId: "CLM-2845",
    orderId: "ORD-9215",
    customerName: "Michael Chen",
    customerEmail: "michael@email.com",
    operatorName: "My Laundry Service",
    status: "open",
    description: "Wrong items delivered. Received someone else's order.",
    photos: [
      "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"
    ],
    createdAt: "2024-01-13"
  },
  {
    id: "od7",
    claimId: "CLM-2844",
    orderId: "ORD-9210",
    customerName: "Emma Wilson",
    customerEmail: "emma@email.com",
    operatorName: "My Laundry Service",
    status: "resolved",
    description: "Zipper damaged on jacket",
    photos: [],
    createdAt: "2024-01-12"
  },
  {
    id: "od8",
    claimId: "CLM-2843",
    orderId: "ORD-9205",
    customerName: "James Brown",
    customerEmail: "james@email.com",
    operatorName: "My Laundry Service",
    status: "open",
    description: "Terrible odor when items arrived. They smelled like chemicals.",
    photos: ["https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300"],
    createdAt: "2024-01-11"
  },
  {
    id: "od9",
    claimId: "CLM-2842",
    orderId: "ORD-9200",
    customerName: "Elizabeth Davis",
    customerEmail: "elizabeth@email.com",
    operatorName: "My Laundry Service",
    status: "escalated",
    description: "Item shrunk significantly after washing. No longer fits.",
    photos: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"],
    createdAt: "2024-01-10"
  },
  {
    id: "od10",
    claimId: "CLM-2841",
    orderId: "ORD-9195",
    customerName: "David Miller",
    customerEmail: "david@email.com",
    operatorName: "My Laundry Service",
    status: "open",
    description: "Button fell off and was not returned with the order.",
    photos: [],
    createdAt: "2024-01-09"
  },
  {
    id: "od11",
    claimId: "CLM-2840",
    orderId: "ORD-9190",
    customerName: "Jessica Taylor",
    customerEmail: "jessica@email.com",
    operatorName: "My Laundry Service",
    status: "resolved",
    description: "Mild discoloration on sleeve",
    photos: ["https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300"],
    createdAt: "2024-01-08"
  },
  {
    id: "od12",
    claimId: "CLM-2839",
    orderId: "ORD-9185",
    customerName: "Christopher Moore",
    customerEmail: "christopher@email.com",
    operatorName: "My Laundry Service",
    status: "open",
    description: "Delivery was late and items were damaged in transit.",
    photos: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"],
    createdAt: "2024-01-07"
  }
];

export async function fetchDisputes(params: FetchDisputesParams): Promise<FetchDisputesResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...mockDisputes];

  // Filter by search
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.orderId.toLowerCase().includes(searchLower) ||
        d.customerName.toLowerCase().includes(searchLower) ||
        d.description.toLowerCase().includes(searchLower)
    );
  }

  // Filter by status
  if (params.filters?.status) {
    filtered = filtered.filter((d) => d.status === params.filters?.status);
  }

  // Pagination
  const total = filtered.length;
  const totalPages = Math.ceil(total / params.pageSize);
  const start = (params.page - 1) * params.pageSize;
  const items = filtered.slice(start, start + params.pageSize);

  return {
    items,
    page: params.page,
    pageSize: params.pageSize,
    total,
    totalPages
  };
}

export async function submitResponse(
  disputeId: string,
  response: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    message: "Response submitted successfully"
  };
}

export async function offerRefund(
  disputeId: string,
  amount: number
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    message: `Refund offer of $${amount.toFixed(2)} sent to customer`
  };
}

export async function offerCredit(
  disputeId: string,
  amount: number
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    message: `Credit offer of $${amount.toFixed(2)} sent to customer`
  };
}

export async function escalateToAdmin(
  disputeId: string,
  reason: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    success: true,
    message: "Dispute escalated to admin successfully"
  };
}
