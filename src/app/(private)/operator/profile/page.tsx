import Header from "../components/header";
import ChangePasswordForm from "./forms/change-password-form";
import NotificationPreferencesForm from "./forms/notification-preferences-form";
import ProfileInformationForm from "./forms/profile-information-form";
import WorkHoursForm from "./forms/work-hours-form";

export default function OperatorProfilePage() {
  return (
    <div className="space-y-6">
      <Header title="Profile" subtitle="Manage your profile information" />

      <ProfileInformationForm />

      <div className="gap-6 lg:grid-cols-2 grid grid-cols-1">
        <NotificationPreferencesForm />
        <WorkHoursForm />
      </div>

      <ChangePasswordForm />
    </div>
  );
}
