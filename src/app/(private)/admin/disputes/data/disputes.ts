import type { DisputeManagementDispute } from "@/types/dispute-management";

export const disputesData: DisputeManagementDispute[] = [
  {
    id: "d1",
    claimId: "CLM-2847",
    orderId: "ORD-9234",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@email.com",
    operatorId: "opr-001",
    operatorName: "Mike's Laundry",
    status: "ESCALATED",
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
    operatorId: "opr-002",
    operatorName: "QuickWash Pro",
    status: "PENDING",
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
    operatorId: "opr-003",
    operatorName: "Fresh Clean Co",
    status: "RESOLVED",
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
    operatorId: "opr-004",
    operatorName: "Express Laundry",
    status: "PENDING",
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
    operatorId: "opr-001",
    operatorName: "Mike's Laundry",
    status: "ESCALATED",
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
    operatorId: "opr-002",
    operatorName: "QuickWash Pro",
    status: "RESOLVED",
    description: "Refund processed successfully",
    photos: [
      "https://images.unsplash.com/photo-1612528443702-f6741f70a049?w=300",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300"
    ],
    createdAt: "2024-01-10"
  }
];
