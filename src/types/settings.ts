export interface AdminSettingsResponse {
  success: boolean;
  message: string;
  data: AdminSettings;
}

export interface AdminSettings {
  id: string;
  cancellationWindowHours: number;
  bookingLeadTimeHours: number;
  requirePaymentUpfront: boolean;
  allowPartialPayments: boolean;
  platformCommissionRate: string;
  fixedTransactionFee: string;
  pickupDeliveryFee: string;
  payoutSchedule: "WEEKLY" | "MONTHLY" | "YEARLY";
  updatedAt: string;
}

export interface UpdateAdminSettingsRequest {
  cancellationWindowHours: number;
  bookingLeadTimeHours: number;
  requirePaymentUpfront: boolean;
  allowPartialPayments: boolean;
  platformCommissionRate: number;
  fixedTransactionFee: number;
  pickupDeliveryFee: number;
  payoutSchedule: "WEEKLY" | "MONTHLY" | "YEARLY";
}

export interface UpdateAdminSettingsResponse {
  success: boolean;
  message: string;
}
