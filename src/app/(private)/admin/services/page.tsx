import Header from "../components/header";
import ServicesContent from "./components/services-content";

export default function Services() {
  return (
    <div className="space-y-6">
      <Header title="Services" subtitle="Manage your laundry service categories" />
      <ServicesContent />
    </div>
  );
}
