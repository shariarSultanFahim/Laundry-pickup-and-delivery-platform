"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import type { Service } from "@/types/service-management";

import { Card } from "@/components/ui";
import { Button } from "@/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/ui/sheet";

import AddServiceForm from "./add-service-form";
import ServicesTable from "./services-table";

export default function AddServiceContent() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingService, setEditingService] = useState<Service | null>(null);

  function handleFormSuccess() {
    setSheetOpen(false);
    setEditingService(null);
    setRefreshTrigger((prev) => prev + 1);
  }

  function handleEdit(service: Service) {
    setEditingService(service);
    setSheetOpen(true);
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setEditingService(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
          <Card className="p-6 gap-2 w-full flex-row items-center justify-between">
            <div className="gap-2 flex flex-col items-start justify-center">
              <h1 className="text-2xl font-bold">Add Service</h1>
              <p className="text-sm text-muted-foreground">Add new services to your offerings</p>
            </div>
            <SheetTrigger asChild>
              <Button onClick={() => setEditingService(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </SheetTrigger>
          </Card>
          <SheetContent side="right" className="md:w-96 p-4 w-full">
            <SheetHeader className="p-0">
              <SheetTitle>{editingService ? "Edit Service" : "Add New Service"}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 max-h-[calc(100vh-120px)] overflow-y-auto">
              <AddServiceForm onSuccess={handleFormSuccess} editingService={editingService} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <ServicesTable
        key={refreshTrigger}
        onEdit={handleEdit}
        onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  );
}
