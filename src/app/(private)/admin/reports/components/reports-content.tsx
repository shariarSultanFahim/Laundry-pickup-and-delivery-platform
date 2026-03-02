"use client";

import StatsCard from "../../components/statsCard";
import {
  operatorPerformanceData,
  orderVolumeData,
  paymentSuccessData,
  statsData
} from "../data/reports";
import { OperatorPerformance, OrderVolumeChart, PaymentSuccessRateChart } from "./index";

export function ReportsContent() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="gap-4 md:grid-cols-2 grid">
        {statsData.map((stat) => (
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
        <OrderVolumeChart data={orderVolumeData} />
        <PaymentSuccessRateChart data={paymentSuccessData} />
      </div>

      {/* Operator Performance */}
      <OperatorPerformance data={operatorPerformanceData} />
    </div>
  );
}
