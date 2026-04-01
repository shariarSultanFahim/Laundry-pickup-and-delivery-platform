import { withPublicRoute } from "@/lib/hoc/with-route-guard";

function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default withPublicRoute(PublicLayout);
