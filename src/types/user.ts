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

export interface OperatorProfile {
  id: string;
  userId: string;
  storeName: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  platformFee: string;
  stripeConnectId: string;
  onboardingComplete: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OperatorMeData extends UserProfile {
  operatorProfile: OperatorProfile;
}

export interface OperatorMeResponse {
  success: boolean;
  message: string;
  data: OperatorMeData;
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

// ── Admin Users Management ────────────────────────────────────────────────────

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  BANNED = "BANNED"
}

export interface UserAddress {
  id: string;
  userId: string;
  address: string;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserListItem {
  id: string;
  userID: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string | null;
  status: UserStatus;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  userAddresses: UserAddress[];
  paymentCards: any[];
  _count: {
    orders: number;
    reviews: number;
  };
  totalPaymentAmount: number;
  totalOrders: number;
  averageOrderValue: number;
}

export interface GetUsersResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    data: AdminUserListItem[];
  };
}

export interface GetUserByIdResponse {
  success: boolean;
  message: string;
  data: AdminUserListItem;
}
