import Header from "../components/header";
import SettingsForm from "./components/settings-form";

export default function Settings() {
  return (
    <div className="space-y-6">
      <Header title="Platform Settings" subtitle="Manage system-wide settings and configurations" />
      <SettingsForm />
    </div>
  );
}
