// Route to /admin route
import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("/login");
}
