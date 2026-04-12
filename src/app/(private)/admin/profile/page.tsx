import Header from "../components/header";
import AccountCreationSection from "./forms/account-creation-section";
import ChangePasswordForm from "./forms/change-password-form";
import NotificationPreferencesForm from "./forms/notification-preferences-form";
import ProfileInformationForm from "./forms/profile-information-form";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Header title="Account Settings" subtitle="Manage your account profile and preferences" />

      <ProfileInformationForm />

      <AccountCreationSection />

      <div className="gap-6 lg:grid-cols-2 grid grid-cols-1">
        <NotificationPreferencesForm />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
