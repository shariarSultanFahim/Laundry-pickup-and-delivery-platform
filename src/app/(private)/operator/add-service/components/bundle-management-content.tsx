"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Card } from "@/components/ui";
import { Button } from "@/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/ui/sheet";

import AddBundleForm from "./add-bundle-form";
import BundlesTable from "./bundles-table";
import { Bundle } from "@/types/bundle-management";

export default function BundleManagementContent() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);

  function handleFormSuccess() {
    setSheetOpen(false);
    setEditingBundle(null);
    setRefreshTrigger((prev) => prev + 1);
  }

  function handleEdit(bundle: Bundle) {
    setEditingBundle(bundle);
    setSheetOpen(true);
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setEditingBundle(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
          <Card className="p-6 gap-2 w-full flex-row items-center justify-between">
            <div className="gap-2 flex flex-col items-start justify-center">
              <h1 className="text-2xl font-bold">Service Bundles</h1>
              <p className="text-sm text-muted-foreground">
                Create and manage service bundles with discounted pricing
              </p>
            </div>
            <SheetTrigger asChild>
              <Button onClick={() => setEditingBundle(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Bundle
              </Button>
            </SheetTrigger>
          </Card>
          <SheetContent side="right" className="md:w-[500px] p-0 w-full overflow-y-auto">
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="text-xl">
                {editingBundle ? "Update Bundle" : "Design New Bundle"}
              </SheetTitle>
            </SheetHeader>
            <div className="p-6 pb-12">
              <AddBundleForm onSuccess={handleFormSuccess} editingBundle={editingBundle} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <BundlesTable
        key={refreshTrigger}
        onEdit={handleEdit}
        onRefresh={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  );
}
