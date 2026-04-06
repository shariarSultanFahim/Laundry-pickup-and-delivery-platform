"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Card,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/ui";
import { useGetOperatorMe } from "@/lib/actions/user/get.operator-me";
import { useGetMyStores } from "@/lib/actions/store/get.my-stores";
import { useUpdateStore } from "@/lib/actions/store/update.store";
import { Store } from "@/types/store";
import StoresTable from "./components/stores-table";
import AddStoreForm from "./components/add-store-form";

export default function StoreManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isActive, setIsActive] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);

  const { data: operatorMe } = useGetOperatorMe();
  const operatorId = operatorMe?.data?.operatorProfile?.id || "";

  const { data: storesResponse, isLoading } = useGetMyStores(operatorId, {
    searchTerm: searchTerm || undefined,
    isActive: isActive === "all" ? undefined : isActive === "true",
    page,
    limit: 10
  });

  const { mutateAsync: updateStore } = useUpdateStore();

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setIsSheetOpen(true);
  };

  const handleToggleStatus = async (store: Store) => {
    try {
      await updateStore({
        id: store.id,
        payload: { isActive: !store.isActive }
      });
      toast.success(`Store status updated to ${!store.isActive ? "Active" : "Inactive"}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update store status");
    }
  };

  const handleFormSuccess = () => {
    setIsSheetOpen(false);
    setEditingStore(null);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) setEditingStore(null);
  };

  const stores = storesResponse?.data || [];
  const meta = storesResponse?.meta;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
          <Card className="p-6 gap-2 w-full flex-row items-center justify-between flex">
            <div className="gap-2 flex flex-col items-start justify-center">
              <h1 className="text-2xl font-bold">Store Management</h1>
              <p className="text-sm text-muted-foreground">Manage your laundry outlets</p>
            </div>
            <SheetTrigger asChild>
              <Button onClick={() => setEditingStore(null)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Store
              </Button>
            </SheetTrigger>
          </Card>
          <SheetContent side="right" className="sm:max-w-md w-full overflow-y-auto">
            <SheetHeader className="px-2">
              <SheetTitle>{editingStore ? "Edit Store" : "Add New Store"}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 pb-10 px-2">
              <AddStoreForm onSuccess={handleFormSuccess} editingStore={editingStore} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <StoresTable
        stores={stores}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        onSearchChange={setSearchTerm}
        onStatusFilterChange={setIsActive}
        page={page}
        totalPage={meta ? Math.ceil(meta.total / 10) : 1}
        setPage={setPage}
        isLoading={isLoading}
      />
    </div>
  );
}
