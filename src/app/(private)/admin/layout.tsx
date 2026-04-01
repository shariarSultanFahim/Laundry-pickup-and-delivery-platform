import { Separator } from "@/components/ui";
import { DynamicBreadcrumb } from "@/components/ui/dynamic-breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { withPrivateRoute } from "@/lib/hoc/with-route-guard";

import { AdminAppSidebar } from "./app-sidebar";

function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminAppSidebar />
      <SidebarInset>
        <header className="h-16 gap-2 px-4 flex shrink-0 items-center">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <DynamicBreadcrumb />
        </header>
        <div className="gap-4 rounded-tl-xl bg-background p-4 flex flex-1 flex-col overflow-y-hidden">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default withPrivateRoute(AdminDashboardLayout, { allowedRoles: ["admin"] });
