"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Bell,
  ChartArea,
  CreditCard,
  Flag,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  ShieldHalf,
  SquareChartGantt,
  Star,
  Ticket,
  User,
  UserLock,
  UserPen
} from "lucide-react";

import { Button } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar";

const data = {
  info: {
    title: "LaundryLink",
    subtitle: ""
  },
  navMain: [
    {
      title: "",
      items: [
        {
          title: "Dashboard",
          url: "/admin",
          icon: LayoutDashboard
        },
        {
          title: "User Management",
          url: "/admin/users",
          icon: User
        },
        {
          title: "Orders & Payments",
          url: "/admin/orders",
          icon: CreditCard
        },
        {
          title: " Report Analytics",
          url: "/admin/reports",
          icon: ChartArea
        },
        {
          title: "General Settings",
          url: "/admin/settings",
          icon: Settings
        },
        {
          title: "Tickets",
          url: "/admin/tickets",
          icon: Ticket
        },
        {
          title: "Security",
          url: "/admin/security",
          icon: UserLock
        },
        {
          title: "Operator Management",
          url: "/admin/operators",
          icon: FolderKanban
        },
        {
          title: "Disputes Management",
          url: "/admin/disputes",
          icon: SquareChartGantt
        },
        {
          title: "Profile",
          url: "/admin/profile",
          icon: UserPen
        },
        {
          title: "Reviews",
          url: "/admin/reviews",
          icon: Star
        },
        {
          title: "Notifications",
          url: "/admin/notifications",
          icon: Bell
        },
        {
          title: "Privacy Policy",
          url: "/admin/privacy-policy",
          icon: Shield
        },
        {
          title: "Terms & Conditions",
          url: "/admin/terms-conditions",
          icon: ShieldHalf
        },
        {
          title: "Banner",
          url: "/admin/banner",
          icon: Flag
        }
      ]
    }
  ]
};

export function AdminAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const isItemActive = (itemUrl: string) => {
    if (itemUrl === "/admin") {
      return pathname === "/admin";
    }

    return pathname === itemUrl || pathname.startsWith(`${itemUrl}/`);
  };

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex items-center justify-center">
                  <Image src="/logo.png" alt="Logo" width={32} height={32} />
                </div>
                <div className="text-sm leading-tight grid flex-1">
                  <span className="text-sm font-bold truncate">{data.info.title}</span>
                  <span className="text-xs font-semibold text-sidebar-foreground/60 truncate">
                    {data.info.subtitle}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            {/* <SidebarGroupLabel>{group.title}</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isItemActive(item.url)}>
                      <Link href={item.url} className="py-5">
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="space-y-5">
            <div className="gap-4 hidden flex-col group-data-[collapsible=icon]:flex">
              <Avatar size="lg" className="h-8 w-8">
                <AvatarImage src="https://media.licdn.com/dms/image/v2/D5603AQF8VWtOZX4cyA/profile-displayphoto-crop_800_800/B56ZoGTUgUJ4AM-/0/1761042323122?e=1773878400&v=beta&t=vPGLXeorVP2ikZACdWsBZN_u_Me7DlXjQSTTBWtG6tY" />
                <AvatarFallback>SF</AvatarFallback>
              </Avatar>
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <div className="gap-4 flex items-center justify-start">
                <Avatar size="lg">
                  <AvatarImage src="https://media.licdn.com/dms/image/v2/D5603AQF8VWtOZX4cyA/profile-displayphoto-crop_800_800/B56ZoGTUgUJ4AM-/0/1761042323122?e=1773878400&v=beta&t=vPGLXeorVP2ikZACdWsBZN_u_Me7DlXjQSTTBWtG6tY" />
                  <AvatarFallback>SF</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">Shariar Fahim</h2>
                  <h3 className="text-sm text-gray-500">Super Administrator</h3>
                </div>
              </div>
            </div>
            <SidebarMenuButton asChild className="group-data-[collapsible=icon]:w-full">
              <Button variant="outline" className="group-data-[collapsible=icon]:p-0 w-full">
                <LogOut className="size-4 group-data-[collapsible=icon]:h-5 group-data-[collapsible=icon]:w-5" />
                <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
