import Header from "../../components/header";
import MonthlyRevenueChart from "../../components/monthly-revenue-chart";
import OrderStatusChart from "../../components/order-status-chart";
import OrdersChart from "../../components/orders-chart";
import StatsCard from "../../components/statsCard";
import TopOperators from "../../components/top-operators";
import {
  dashboardStats,
  monthlyRevenueData,
  ordersData,
  orderStatusData,
  storePerformanceData,
  topOperatorsData
} from "../data/dashoard";
import StorePerformanceTable from "./store-performance-table";

export default function DashboardPage() {
  return (
    <section className="">
      <Header title="Dashboard" subtitle="Welcome to the admin dashboard!" />

      {/* Stats Cards */}
      <div className="mt-6 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid">
        {dashboardStats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="mt-6 gap-4 lg:grid-cols-3 grid">
        <div className="lg:col-span-2">
          <MonthlyRevenueChart data={monthlyRevenueData} />
        </div>
        <OrderStatusChart data={orderStatusData} />
      </div>

      <div className="mt-6 gap-4 lg:grid-cols-3 grid">
        <div className="lg:col-span-2">
          <OrdersChart data={ordersData} />
        </div>
        <TopOperators data={topOperatorsData} />
      </div>

      {/* Store Performance Table */}
      <div className="mt-6">
        <StorePerformanceTable data={storePerformanceData} />
      </div>
    </section>
  );
}
