export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "customer" | "support";
  message: string;
  timestamp: string;
  senderAvatar?: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  title: string;
  description: string;
  status: "open" | "resolved";
  priority: "low" | "medium" | "high";
  assignedTo?: string;
  createdAt: string;
  timeAgo: string;
  isCustomerOnline?: boolean;
  messages: TicketMessage[];
}

export interface TicketStats {
  title: string;
  value: string;
  subtitle: string;
}

export interface TicketFilters {
  status?: SupportTicket["status"];
  fromDate?: string;
  toDate?: string;
}

export interface FetchTicketsParams {
  page: number;
  pageSize: number;
  search: string;
  filters?: TicketFilters;
}

export interface FetchTicketsResponse {
  items: SupportTicket[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
