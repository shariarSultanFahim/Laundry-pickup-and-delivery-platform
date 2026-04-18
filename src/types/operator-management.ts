import { PaginationMeta } from "./ticket-management";

export interface Operator {
  id: string;
  name: string;
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  store: string;
  area: string;
  region: "North" | "East" | "West" | "South";
  totalOrders: number;
  totalRevenue: number;
}

export interface OperatorStats {
  title: string;
  value: string;
  subtitle: string;
  trend: "up" | "down";
}

export interface OperatorFilters {
  status?: Operator["status"];
  region?: Operator["region"];
}

export interface FetchOperatorsParams {
  page: number;
  pageSize: number;
  search: string;
  filters?: OperatorFilters;
}

export interface FetchOperatorsResponse {
  items: Operator[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export enum OperatorStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
  SUSPENDED = "SUSPENDED"
}

export enum OperatorApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

export interface OperatorAddress {
  id: string;
  streetAddress: string;
  city: string;
  state: string | null;
  country: string;
  postalCode: string | null;
  isDefault: boolean;
}

export interface OperatorStore {
  id: string;
  operatorId: string;
  name: string;
  logo: string | null;
  banner: string | null;
  address: string;
  country: string;
  state: string | null;
  city: string;
  postalCode: string | null;
  lat: number | null;
  lng: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OperatorProfileSummary {
  id: string;
  stores: OperatorStore[];
  userId: string;
  operatorId: string | null;
  approvalStatus: OperatorApprovalStatus;
  createdAt: string;
  updatedAt: string;
  _count: {
    stores: number;
    services: number;
    bundles: number;
  };
}

export interface OperatorProfileDetails {
  id: string;
  operatorId: string | null;
  userId: string;
  approvalStatus: OperatorApprovalStatus;
  status: OperatorStatus;
  stripeAccountId: string;
  stripeAccountStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface OperatorDetailsUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  password?: string;
  role: string;
  isVerified: boolean;
  isDeleted: boolean;
  lat: number | null;
  lng: number | null;
  stripeCustomerId: string | null;
  isSubscribed: boolean;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  status: OperatorStatus;
  createdById: string | null;
}

export interface OperatorDetailsStore {
  id: string;
  operatorId: string;
  name: string;
  logo: string | null;
  banner: string | null;
  address: string;
  country: string;
  state: string | null;
  city: string;
  postalCode: string | null;
  lat: number | null;
  lng: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OperatorListItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  role: string;
  status: OperatorStatus;
  addresses: OperatorAddress[];
  isDeleted: boolean;
  lat: number | null;
  lng: number | null;
  stripeCustomerId: string | null;
  isSubscribed: boolean;
  operatorProfile: OperatorProfileSummary;
  isTwoFactorEnabled: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OperatorDetails extends OperatorListItem {
  operatorId: string | null;
  approvalStatus: OperatorApprovalStatus;
  status: OperatorStatus;
  stripeAccountId: string;
  stripeAccountStatus: string;
  user: OperatorDetailsUser;
  stores: OperatorDetailsStore[];
  operatorWallet: unknown | null;
}

export interface GetOperatorsQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: OperatorStatus | "";
  approvalStatus?: OperatorApprovalStatus | "";
}

export interface GetOperatorsResponse {
  success: boolean;
  message: string;
  meta: PaginationMeta;
  data: OperatorListItem[];
}

export interface GetOperatorByIdResponse {
  success: boolean;
  message: string;
  data: OperatorDetails;
}

export interface UpdateOperatorStatusPayload {
  status: OperatorStatus;
}

export interface UpdateOperatorApprovalStatusPayload {
  approvalStatus: OperatorApprovalStatus;
}
