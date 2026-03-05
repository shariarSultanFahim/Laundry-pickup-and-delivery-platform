import Header from "../components/header";
import StatsCard from "../components/statsCard";
import OrdersTable from "./components/orders-table";
import { operatorOrdersStats } from "./data/orders";

export default function OperatorOrdersPage() {
  return (
    <div className="space-y-6">
      <Header title="Orders" subtitle="Manage and view all your orders" />

      {/* Stats Cards */}
      <div className="gap-4 sm:grid-cols-2 lg:grid-cols-4 grid">
        {operatorOrdersStats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            subtitle={stat.subtitle}
            icon={stat.icon}
            iconBgColor={stat.iconBgColor}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Orders Table */}
      <OrdersTable />
    </div>
  );
}
