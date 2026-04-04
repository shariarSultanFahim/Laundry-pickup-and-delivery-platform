export interface AdminSettingsResponse {
  success: boolean;
  message: string;
  data: AdminSettings[];
}

export type PayoutSchedule = "WEEKLY" | "MONTHLY" | "YEARLY";

export interface AdminSettings {
  id: string;
  platformCommissionRate: string;
  calcellationWindowHours: number;
  bookingLeadTimeHours: number;
  requirePaymentUpFront: boolean;
  allowPartialPayment: boolean;
  fixedTransactionFee: string;
  paymentProcessingFee: string;
  payoutSchedule: PayoutSchedule;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAdminSettingsRequest {
  platformCommissionRate: number;
  calcellationWindowHours: number;
  bookingLeadTimeHours: number;
  requirePaymentUpFront: boolean;
  allowPartialPayment: boolean;
  fixedTransactionFee: number;
  paymentProcessingFee: number;
  payoutSchedule: PayoutSchedule;
}

export interface UpdateAdminSettingsResponse {
  success: boolean;
  message: string;
}
