"use client";

import { useState } from "react";

import { Card } from "@/components/ui";

import OperatorStoreCombobox from "../components/operator-store-combobox";
import OperationalControlsContent from "./components/operational-controls-content";

export default function OperatorOperationalControlsPage() {
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");

  return (
    <div className="space-y-6">
      <Card className="p-6 gap-2 md:flex-row flex-col items-center justify-between">
        <div className="gap-2 flex flex-col items-start justify-center">
          <h1 className="text-2xl font-bold">Operational Controls</h1>
          <p className="text-sm text-muted-foreground">Manage operational settings and controls</p>
        </div>
        <OperatorStoreCombobox
          value={selectedStoreId}
          onValueChange={setSelectedStoreId}
          mode="first"
        />
      </Card>

      <OperationalControlsContent
        key={selectedStoreId || "no-store"}
        selectedStoreId={selectedStoreId || undefined}
      />
    </div>
  );
}
