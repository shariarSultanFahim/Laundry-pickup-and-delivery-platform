export interface OperationalControls {
  pauseNewOrders: boolean;
  acceptingOrders: boolean;
  dailyCapacityLimit: number;
  blackoutDates: string[]; // ISO date strings
  serviceRadius: number; // in km
}

export interface UpdateOperationalControlsRequest {
  pauseNewOrders?: boolean;
  dailyCapacityLimit?: number;
  blackoutDates?: string[];
  serviceRadius?: number;
}

export interface OperationalControlsResponse {
  success: boolean;
  message: string;
  data?: OperationalControls;
}
