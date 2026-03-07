import type {
  OperationalControls,
  OperationalControlsResponse
} from "@/types/operational-controls";

// Mock data storage
const operationalControls: OperationalControls = {
  pauseNewOrders: false,
  acceptingOrders: true,
  dailyCapacityLimit: 25,
  blackoutDates: ["2024-12-25", "2024-12-26", "2025-01-01"],
  serviceRadius: 5
};

export async function fetchOperationalControls(): Promise<OperationalControlsResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    success: true,
    message: "Operational controls retrieved",
    data: { ...operationalControls }
  };
}

export async function updatePauseNewOrders(
  pauseNewOrders: boolean
): Promise<OperationalControlsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  operationalControls.pauseNewOrders = pauseNewOrders;
  operationalControls.acceptingOrders = !pauseNewOrders;

  return {
    success: true,
    message: pauseNewOrders ? "Order paused successfully" : "Orders resuming successfully",
    data: { ...operationalControls }
  };
}

export async function updateDailyCapacityLimit(
  limit: number
): Promise<OperationalControlsResponse> {
  if (limit < 1) {
    return {
      success: false,
      message: "Capacity limit must be at least 1"
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  operationalControls.dailyCapacityLimit = limit;

  return {
    success: true,
    message: `Daily capacity limit updated to ${limit}`,
    data: { ...operationalControls }
  };
}

export async function addBlackoutDate(date: string): Promise<OperationalControlsResponse> {
  if (operationalControls.blackoutDates.includes(date)) {
    return {
      success: false,
      message: "This date is already marked as blackout"
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  operationalControls.blackoutDates.push(date);
  operationalControls.blackoutDates.sort();

  return {
    success: true,
    message: "Blackout date added successfully",
    data: { ...operationalControls }
  };
}

export async function removeBlackoutDate(date: string): Promise<OperationalControlsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  operationalControls.blackoutDates = operationalControls.blackoutDates.filter((d) => d !== date);

  return {
    success: true,
    message: "Blackout date removed successfully",
    data: { ...operationalControls }
  };
}

export async function updateServiceRadius(radius: number): Promise<OperationalControlsResponse> {
  if (radius < 1 || radius > 20) {
    return {
      success: false,
      message: "Service radius must be between 1 km and 20 km"
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  operationalControls.serviceRadius = radius;

  return {
    success: true,
    message: `Service radius updated to ${radius} km`,
    data: { ...operationalControls }
  };
}
