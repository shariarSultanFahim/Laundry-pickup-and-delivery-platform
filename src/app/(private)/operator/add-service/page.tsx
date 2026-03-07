import Header from "../components/header";
import AddServiceContent from "./components/add-service-content";

export default function OperatorAddServicePage() {
  return (
    <div className="space-y-6">
      <Header title="Add Service" subtitle="Add new services to your offerings" />
      <AddServiceContent />
    </div>
  );
}
