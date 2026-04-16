"use client";

import { useQuery } from "@tanstack/react-query";

import {
  MembershipStatsResponse,
  OrderDistributionResponse,
  OrdersOverTimeResponse,
  OrderSummaryResponse,
  type OrdersOverTimeParams
} from "@/types/operator-membership";

import { get } from "@/lib/api";

const API_BASE = "/operator-membership";

// ── Stats Hook ──────────────────────────────────────────────────────────────

export const useGetMembershipStats = (enabled = true) => {
  return useQuery({
    queryKey: ["membership-stats"],
    enabled,
    queryFn: async () => {
      const response = await get<MembershipStatsResponse>(`${API_BASE}/stats`);
      return response;
    }
  });
};

// ── Order Distribution Hook (Pie Chart) ──────────────────────────────────────

export const useGetOrderDistribution = (enabled = true) => {
  return useQuery({
    queryKey: ["order-distribution"],
    enabled,
    queryFn: async () => {
      const response = await get<OrderDistributionResponse>(`${API_BASE}/order-distribution`);
      return response;
    }
  });
};

// ── Orders Over Time Hook (Bar Chart) ────────────────────────────────────────

export const useGetOrdersOverTime = (params?: OrdersOverTimeParams, enabled = true) => {
  return useQuery({
    queryKey: ["orders-over-time", params],
    enabled,
    queryFn: async () => {
      const response = await get<OrdersOverTimeResponse>(`${API_BASE}/orders-over-time`, {
        params: {
          months: params?.months ?? 6
        }
      });
      return response;
    }
  });
};

// ── Order Summary Hook (Table) ──────────────────────────────────────────────

export const useGetOrderSummary = (enabled = true) => {
  return useQuery({
    queryKey: ["order-summary"],
    enabled,
    queryFn: async () => {
      const response = await get<OrderSummaryResponse>(`${API_BASE}/order-summary`);
      return response;
    }
  });
};
