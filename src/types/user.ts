// ── User Profile ──────────────────────────────────────────────────────────────

export interface UserCount {
  orders: number;
  reviews: number;
  supportTickets: number;
  ticketMessages: number;
  paymentCards: number;
  favoriteServices: number;
  notifications: number;
  userSubscriptions: number;
  userAddresses: number;
  wallets: number;
  payouts: number;
  transactions: number;
  chatParticipants: number;
  chatMessages: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  isVerified: boolean;
  avatar: string | null;
  userAddresses: any[];
  orders: any[];
  reviews: any[];
  _count?: UserCount;
}

export interface GetMeResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

// ── Update Profile ────────────────────────────────────────────────────────────

export interface UpdateProfileRequest {
  id: string;
  name?: string;
  phone?: string;
  avatarFile?: File;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}
