import type {
  DisputeManagementDispute,
  FetchDisputesParams,
  FetchDisputesResponse
} from "@/types/dispute-management";

export async function fetchDisputes(params: FetchDisputesParams): Promise<FetchDisputesResponse> {
  // Mock implementation - replace with actual API call
  const mockDisputes: DisputeManagementDispute[] = [
    {
      id: "d1",
      claimId: "CLM-2847",
      orderId: "ORD-9234",
      customerName: "Sarah Johnson",
      customerEmail: "sarah@email.com",
      operatorName: "Mike's Laundry",
      status: "escalated",
      description:
        "My white shirt came back with a large stain that wasn't there before. The collar also appears to be damaged with fraying. I've been a loyal customer for 2 years and this is very disappointing.",
      photos: [
        "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"
      ],
      createdAt: "2024-01-15"
    },
    {
      id: "d2",
      claimId: "CLM-2846",
      orderId: "ORD-9221",
      customerName: "David Chen",
      customerEmail: "david@email.com",
      operatorName: "QuickWash Pro",
      status: "open",
      description: "Item missing from order",
      photos: [
        "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"
      ],
      createdAt: "2024-01-14"
    },
    {
      id: "d3",
      claimId: "CLM-2845",
      orderId: "ORD-9198",
      customerName: "Emma Wilson",
      customerEmail: "emma@email.com",
      operatorName: "Fresh Clean Co",
      status: "resolved",
      description: "Quality issue resolved",
      photos: [
        "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"
      ],
      createdAt: "2024-01-13"
    },
    {
      id: "d4",
      claimId: "CLM-2844",
      orderId: "ORD-9187",
      customerName: "James Martinez",
      customerEmail: "james@email.com",
      operatorName: "Express Laundry",
      status: "open",
      description: "Delivery delay complaint",
      photos: [
        "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"
      ],
      createdAt: "2024-01-12"
    },
    {
      id: "d5",
      claimId: "CLM-2843",
      orderId: "ORD-9165",
      customerName: "Lisa Anderson",
      customerEmail: "lisa@email.com",
      operatorName: "Mike's Laundry",
      status: "escalated",
      description: "Damaged clothing claim",
      photos: [
        "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"
      ],
      createdAt: "2024-01-11"
    },
    {
      id: "d6",
      claimId: "CLM-2842",
      orderId: "ORD-9142",
      customerName: "Robert Taylor",
      customerEmail: "robert@email.com",
      operatorName: "QuickWash Pro",
      status: "resolved",
      description: "Refund processed successfully",
      photos: [
        "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300",
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"
      ],
      createdAt: "2024-01-10"
    }
  ];

  // Filter by search
  let filtered = mockDisputes;
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.claimId.toLowerCase().includes(searchLower) ||
        d.orderId.toLowerCase().includes(searchLower) ||
        d.customerName.toLowerCase().includes(searchLower) ||
        d.operatorName.toLowerCase().includes(searchLower)
    );
  }

  // Filter by status
  if (params.filters?.status) {
    filtered = filtered.filter((d) => d.status === params.filters?.status);
  }

  // Filter by date range
  if (params.filters?.fromDate) {
    filtered = filtered.filter((d) => new Date(d.createdAt) >= new Date(params.filters!.fromDate!));
  }
  if (params.filters?.toDate) {
    filtered = filtered.filter((d) => new Date(d.createdAt) <= new Date(params.filters!.toDate!));
  }

  // Calculate pagination
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

export async function resolveDispute(
  disputeId: string,
  action: "override" | "refund" | "credit" | "deduct",
  amount?: number
): Promise<void> {
  // Mock implementation - replace with actual API call
  console.log(`Resolving dispute ${disputeId} with action ${action}`, amount);
}
