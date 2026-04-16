"use client";

import { useQuery } from "@tanstack/react-query";

import {
  UserGrowthChartResponse,
  UserRolesChartResponse,
  UserStatsAnalyticsResponse
} from "@/types/user-management";

import { get } from "@/lib/api";

export const useGetUserStats = () => {
  return useQuery({
    queryKey: ["admin-user-stats"],
    queryFn: () => get<UserStatsAnalyticsResponse>("/admin-analytics/user-stats")
  });
};

export const useGetUserRolesChart = () => {
  return useQuery({
    queryKey: ["admin-user-roles-chart"],
    queryFn: () => get<UserRolesChartResponse>("/admin-analytics/user-roles-chart")
  });
};

export const useGetUserGrowthChart = () => {
  return useQuery({
    queryKey: ["admin-user-growth-chart"],
    queryFn: () => get<UserGrowthChartResponse>("/admin-analytics/user-growth-chart")
  });
};
