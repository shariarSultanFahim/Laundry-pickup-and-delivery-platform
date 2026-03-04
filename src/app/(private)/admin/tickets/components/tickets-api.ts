import type {
  FetchTicketsParams,
  FetchTicketsResponse,
  SupportTicket,
  TicketStats
} from "@/types/ticket-management";

export async function fetchTickets(params: FetchTicketsParams): Promise<FetchTicketsResponse> {
  // Mock implementation - replace with actual API call
  const mockTickets: SupportTicket[] = [
    {
      id: "t1",
      ticketNumber: "12458",
      customerName: "John Mitchell",
      customerEmail: "john@email.com",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      title: "Payment processing error on checkout",
      description: "Customer unable to complete purchase due to payment gateway timeout...",
      status: "open",
      priority: "high",
      timeAgo: "2 hours ago",
      createdAt: "2024-01-15",
      isCustomerOnline: true,
      messages: [
        {
          id: "m1",
          senderId: "c1",
          senderName: "John Mitchell",
          senderType: "customer",
          message:
            "Hi, I'm having trouble with the payment processing. Every time I try to checkout, I get a timeout error.",
          timestamp: "2:30 PM"
        },
        {
          id: "m2",
          senderId: "s1",
          senderName: "Support Agent",
          senderType: "support",
          message:
            "Hello John! I'm sorry to hear about the payment issue. Let me help you resolve this right away. Can you tell me which payment method you're trying to use?",
          timestamp: "2:31 PM"
        },
        {
          id: "m3",
          senderId: "c1",
          senderName: "John Mitchell",
          senderType: "customer",
          message:
            "I'm trying to use my Visa credit card ending in 4532. It worked fine last week but now it keeps timing out during the final step.",
          timestamp: "2:32 PM"
        },
        {
          id: "m4",
          senderId: "s1",
          senderName: "Support Agent",
          senderType: "support",
          message:
            "Thank you for that information. I can see there have been some intermittent issues with our payment gateway today. Let me check your account and process this manually for you.",
          timestamp: "2:33 PM"
        }
      ]
    },
    {
      id: "t2",
      ticketNumber: "12457",
      customerName: "Emma Wilson",
      customerEmail: "emma@email.com",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      title: "Account verification issues",
      description: "Customer cannot verify email address after multiple attempts...",
      status: "open",
      priority: "medium",
      assignedTo: "Mike Johnson",
      timeAgo: "4 hours ago",
      createdAt: "2024-01-15",
      messages: []
    },
    {
      id: "t3",
      ticketNumber: "12456",
      customerName: "Alex Rodriguez",
      customerEmail: "alex@email.com",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
      title: "Feature request for dark mode",
      description: "Customer requesting dark theme option for better accessibility...",
      status: "open",
      priority: "low",
      assignedTo: "Sarah Chen",
      timeAgo: "1 day ago",
      createdAt: "2024-01-14",
      messages: []
    },
    {
      id: "t4",
      ticketNumber: "12455",
      customerName: "Maria Garcia",
      customerEmail: "maria@email.com",
      customerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      title: "Data sync failure between devices",
      description: "User reports that data is not syncing properly across mobile and desktop...",
      status: "open",
      priority: "high",
      timeAgo: "6 hours ago",
      createdAt: "2024-01-15",
      messages: []
    },
    {
      id: "t5",
      ticketNumber: "12454",
      customerName: "David Chen",
      customerEmail: "david@email.com",
      title: "Password reset not working",
      description: "Customer not receiving password reset emails",
      status: "resolved",
      priority: "medium",
      assignedTo: "Sarah Chen",
      timeAgo: "2 days ago",
      createdAt: "2024-01-13",
      messages: []
    },
    {
      id: "t6",
      ticketNumber: "12453",
      customerName: "Lisa Anderson",
      customerEmail: "lisa@email.com",
      title: "Invoice not generated",
      description: "Order completed but invoice was not sent",
      status: "resolved",
      priority: "low",
      timeAgo: "3 days ago",
      createdAt: "2024-01-12",
      messages: []
    }
  ];

  // Filter by search
  let filtered = mockTickets;
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.ticketNumber.toLowerCase().includes(searchLower) ||
        t.customerName.toLowerCase().includes(searchLower) ||
        t.title.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
    );
  }

  // Filter by status
  if (params.filters?.status) {
    filtered = filtered.filter((t) => t.status === params.filters?.status);
  }

  // Filter by date range
  if (params.filters?.fromDate) {
    filtered = filtered.filter((t) => new Date(t.createdAt) >= new Date(params.filters!.fromDate!));
  }
  if (params.filters?.toDate) {
    filtered = filtered.filter((t) => new Date(t.createdAt) <= new Date(params.filters!.toDate!));
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

export async function fetchTicketStats(): Promise<TicketStats[]> {
  return [
    {
      title: "Total Open",
      value: "24",
      subtitle: "Active tickets"
    },
    {
      title: "Total Resolved",
      value: "8",
      subtitle: "Closed today"
    },
    {
      title: "Resolved Today",
      value: "156",
      subtitle: "All time"
    }
  ];
}

export async function sendMessage(ticketId: string, message: string): Promise<void> {
  // Mock implementation - replace with actual API call
  console.log(`Sending message to ticket ${ticketId}:`, message);
}

export async function resolveTicket(ticketId: string): Promise<void> {
  // Mock implementation - replace with actual API call
  console.log(`Resolving ticket ${ticketId}`);
}

export async function assignTicket(ticketId: string, assignee: string): Promise<void> {
  // Mock implementation - replace with actual API call
  console.log(`Assigning ticket ${ticketId} to ${assignee}`);
}
