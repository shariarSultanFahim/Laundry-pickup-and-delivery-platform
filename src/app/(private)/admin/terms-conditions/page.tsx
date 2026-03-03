import Header from "../components/header";
import TermsConditionsForm from "./components/terms-conditions-form";

export default function TermsConditions() {
  return (
    <div className="space-y-6">
      <Header
        title="Terms & Conditions Management"
        subtitle="Manage and update terms and conditions for users"
      />

      <TermsConditionsForm />
    </div>
  );
}
