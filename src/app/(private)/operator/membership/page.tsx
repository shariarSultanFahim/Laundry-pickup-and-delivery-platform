import Header from "../components/header";
import MembershipContent from "./components/membership-content";

export default function OperatorMembershipPage() {
  return (
    <div className="space-y-6">
      <Header
        title="Membership vs Non-Membership Order Breakdown"
        subtitle="Monitor order distribution and trends across membership types"
      />
      <MembershipContent />
    </div>
  );
}
