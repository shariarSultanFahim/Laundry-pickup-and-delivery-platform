import Header from "../components/header";
import OrdersContent from "./components/orders-content";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <Header
        title="Order & Payment Monitoring"
        subtitle="Track and manage all orders and payment transactions"
      />
      <OrdersContent />
    </div>
  );
}
