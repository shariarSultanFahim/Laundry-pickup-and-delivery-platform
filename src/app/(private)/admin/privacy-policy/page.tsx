import Header from "../components/header";
import PrivacyPolicyForm from "./components/privacy-policy-form";

export default function PrivacyPolicy() {
  return (
    <div className="space-y-6">
      <Header
        title="Privacy Policy Management"
        subtitle="Manage and update privacy policy settings and user data handling"
      />

      <PrivacyPolicyForm />
    </div>
  );
}
