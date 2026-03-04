import Header from "../components/header";
import TicketsContent from "./components/tickets-content";

export default function Tickets() {
  return (
    <div className="space-y-6">
      <Header title="Support Tickets" subtitle="Manage and resolve user support tickets" />
      <TicketsContent />
    </div>
  );
}
