import Header from "../components/header";
import UsersContent from "./components/users-content";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <Header title="User Management" subtitle="Manage all users in the system" />
      <UsersContent />
    </div>
  );
}
