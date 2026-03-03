"use client";

import { Laptop, LogOut, Smartphone, Tablet } from "lucide-react";

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui";

import { activeSessions } from "../data/profile";
import { endAllSessions, logoutCurrentSession } from "./profile-api";

const iconMap = {
  "Current Device": Laptop,
  "Mobile Device": Smartphone,
  Tablet
};

export default function SessionManagementCard() {
  return (
    <Card>
      <CardHeader className="gap-4 flex flex-row items-start justify-between">
        <div>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>Manage your active sessions and logout options</CardDescription>
        </div>
        <div className="gap-2 flex items-center">
          <Button variant="outline" onClick={endAllSessions}>
            End All Sessions
          </Button>
          <Button variant="destructive" onClick={logoutCurrentSession}>
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </CardHeader>
      <CardContent className="gap-3 pt-6 md:grid-cols-3 grid grid-cols-1 border-t">
        {activeSessions.map((session) => {
          const Icon = iconMap[session.deviceType];

          return (
            <div key={session.id} className="rounded-md bg-muted/40 p-3 border">
              <div className="mb-2 gap-2 text-muted-foreground flex items-center">
                <Icon className="size-4" />
                <span className="text-xs">{session.deviceType}</span>
              </div>
              <p className="text-sm font-medium">{session.deviceName}</p>
              <p
                className={`text-xs ${session.isCurrent ? "text-green-600" : "text-muted-foreground"}`}
              >
                {session.lastActive}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
