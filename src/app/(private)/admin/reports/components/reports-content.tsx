"use client";

import { useMemo } from "react";

import StatsCard from "../../components/statsCard";
import {
  operatorPerformanceData,
  orderVolumeData,
  paymentSuccessData,
  statsData
} from "../data/reports";
import { OperatorPerformance, OrderVolumeChart, PaymentSuccessRateChart } from "./index";

interface ReportsContentProps {
  operatorId?: string;
}

function adjustPercentageValue(value: string, factor: number) {
  const numericValue = Number(value.replace("%", ""));
  if (Number.isNaN(numericValue)) {
    return value;
  }

  const adjustedValue = Math.max(numericValue * factor, 0);
  return `${adjustedValue.toFixed(1)}%`;
}

function adjustCurrencyValue(value: string, factor: number) {
  const numericValue = Number(value.replace(/[^\d.]/g, ""));
  if (Number.isNaN(numericValue)) {
    return value;
  }

  return `$${(numericValue * factor).toFixed(2)}`;
}

export function ReportsContent({ operatorId }: ReportsContentProps) {
  const operatorFactor = useMemo(() => {
    if (!operatorId) {
      return 1;
    }

    const operatorIndex = Number(operatorId.split("-")[1] ?? "1");
    return 0.82 + (operatorIndex % 5) * 0.04;
  }, [operatorId]);

  const filteredStatsData = useMemo(() => {
    if (!operatorId) {
      return statsData;
    }

    return statsData.map((stat) => ({
      ...stat,
      value:
        typeof stat.value === "string" && stat.value.includes("$")
          ? adjustCurrencyValue(stat.value, operatorFactor)
          : typeof stat.value === "string" && stat.value.includes("%")
            ? adjustPercentageValue(stat.value, operatorFactor)
            : stat.value,
      change: stat.change
        ? {
            ...stat.change,
            value: stat.change.value.includes("%")
              ? adjustPercentageValue(stat.change.value, operatorFactor)
              : stat.change.value
          }
        : undefined
    }));
  }, [operatorFactor, operatorId]);

  const filteredOrderVolumeData = useMemo(() => {
    if (!operatorId) {
      return orderVolumeData;
    }

    return orderVolumeData.map((item) => ({
      ...item,
      orders: Math.max(Math.round(item.orders * operatorFactor), 0)
    }));
  }, [operatorFactor, operatorId]);

  const filteredPaymentSuccessData = useMemo(() => {
    if (!operatorId) {
      return paymentSuccessData;
    }

    return paymentSuccessData.map((item) => {
      if (item.name === "Successful") {
        return {
          ...item,
          value: Math.max(Math.min(Math.round(item.value * operatorFactor), 99), 1)
        };
      }

      return item;
    });
  }, [operatorFactor, operatorId]);

  const filteredOperatorPerformanceData = useMemo(() => {
    if (!operatorId) {
      return operatorPerformanceData;
    }

    return operatorPerformanceData.filter((operator) => operator.operatorId === operatorId);
  }, [operatorId]);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="gap-4 md:grid-cols-2 grid">
        {filteredStatsData.map((stat) => (
          <StatsCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="gap-4 lg:grid-cols-2 grid">
        <OrderVolumeChart data={filteredOrderVolumeData} />
        <PaymentSuccessRateChart data={filteredPaymentSuccessData} />
      </div>

      {/* Operator Performance */}
      <OperatorPerformance data={filteredOperatorPerformanceData} />
    </div>
  );
}
