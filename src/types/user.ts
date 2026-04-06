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
  avatar: string | null;
  addresses: any[];
  isDeleted: boolean;
  lat: number | null;
  lng: number | null;
  isTwoFactorEnabled: boolean;
  stripeCustomerId: string | null;
  isSubscribed: boolean;
  userId: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: UserCount;
}

export interface GetMeResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface Store {
  id: string;
  operatorId: string;
  name: string;
  logo: string;
  banner: string;
  address: string;
  country: string;
  state: string;
  city: string;
  postalCode: string;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
}

export interface OperatorProfile {
  id: string;
  operatorId: string | null;
  userId: string;
  approvalStatus: string;
  stripeConnectedAccountId: string;
  onboardingUrl: string;
  onboardingComplete: boolean;
  createdAt: string;
  updatedAt: string;
  stores: Store[];
  operatorWallet: any | null;
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
