export interface OperationalControls {
  id: string;
  operatorId: string;
  pauseNewOrders: boolean;
  dailyCapacityLimit: number;
  blackoutDates: string[];
  serviceRadius: number;
}

export interface UpdateOperationalSettingsRequest {
  pauseNewOrders?: boolean;
  dailyCapacityLimit?: number;
  blackoutDates?: string[];
  serviceRadius?: number;
}

export interface OperationalControlsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: OperationalControls;
}
