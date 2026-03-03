import OrdersStatsCards from "./orders-stats-cards";
import OrdersTable from "./orders-table";

export default function OrdersContent() {
  return (
    <div className="space-y-6">
      <OrdersStatsCards />
      <OrdersTable />
    </div>
  );
}
