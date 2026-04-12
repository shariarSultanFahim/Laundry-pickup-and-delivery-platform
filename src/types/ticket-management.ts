// ─── Enums ────────────────────────────────────────────────────────────────────
export type SupportTicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type SupportTicketType = "ORDER_ISSUE" | "PAYMENT_ISSUE" | "GENERAL" | "LIVE_CHAT";
export type MessageSenderType = "user" | "admin" | "system";

// ─── Chat Message Type ───────────────────────────────────────────────────────
export interface SenderUser {
  id: string;
  name: string;
  avatar: string | null;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderUserId?: string;
  senderOperatorId?: string | null;
  content: string;
  isDeleted: boolean;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  senderUser?: SenderUser | null;
  senderOperator?: SenderUser | null;
}

// ─── User Type (embedded in ticket) ───────────────────────────────────────────
export interface TicketUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  phone: string;
  role: string;
}

// ─── Chat Room Type ──────────────────────────────────────────────────────────
export interface ChatRoom {
  id: string;
  name: string;
  orderId: string | null;
  ticketId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Support Ticket ───────────────────────────────────────────────────────────
export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  orderId: string | null;
  subject: string;
  description: string;
  status: SupportTicketStatus;
  type: SupportTicketType;
  createdAt: string;
  updatedAt: string;
  user: TicketUser;
  chatRooms: ChatRoom[];
}

// ─── Pagination Meta ─────────────────────────────────────────────────────────
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// ─── Query Params ────────────────────────────────────────────────────────────
export interface GetTicketsQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: SupportTicketStatus;
  type?: SupportTicketType;
}

// ─── Response Types ──────────────────────────────────────────────────────────
export interface GetTicketsListResponse {
  success: boolean;
  message: string;
  meta: PaginationMeta;
  data: SupportTicket[];
}

export interface GetTicketDetailsResponse {
  success: boolean;
  message: string;
  data: SupportTicket;
}

export interface UpdateTicketStatusPayload {
  status: SupportTicketStatus;
}

export interface UpdateTicketStatusResponse {
  success: boolean;
  message: string;
  data?: SupportTicket;
}

// ─── Chat Messages Response ──────────────────────────────────────────────────
export interface GetChatMessagesResponse {
  success: boolean;
  message: string;
  meta: PaginationMeta;
  data: ChatMessage[];
}
