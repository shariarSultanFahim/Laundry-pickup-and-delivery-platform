"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui";

import Header from "../components/header";
import SecuritySettingsForm from "./components/security-settings-form";
import SecurityStatsCards from "./components/security-stats-cards";

export default function Security() {
  const onExport = () => {
    //TODO: Implement export functionality here
    toast.message("Logs exported successfully!", {
      position: "top-center"
    });
  };
  return (
    <div className="space-y-6">
      <Header
        title="Security & Data Management"
        subtitle="Manage system security settings and user permissions"
        Button={
          <Button onClick={() => onExport()}>
            <Download /> Export Logs
          </Button>
        }
      />
      <SecurityStatsCards />
      <SecuritySettingsForm />
    </div>
  );
}
