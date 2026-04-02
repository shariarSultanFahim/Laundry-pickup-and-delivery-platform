"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Addon } from "@/types/addon";
import { useCreateAddon } from "@/lib/actions/addon/create.addon";
import { useGetMyAddons } from "@/lib/actions/addon/get.my-addons";
import { useUpdateAddon } from "@/lib/actions/addon/update.addon";
import { useDeleteAddon } from "@/lib/actions/addon/delete.addon";
import { CustomPagination } from "@/components/ui/custom-pagination";

import {
  Button,
  Card,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Textarea
} from "@/ui";

import { AddOnServiceFormData, addOnServiceSchema } from "../schema/add-on-service.schema";
import AddOnServicesTable from "./add-on-services-table";
import DeleteConfirmationModal from "@/components/modals/delete-confirmation-modal";



export default function AddOnServicesSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingAddOnService, setEditingAddOnService] = useState<Addon | null>(null);

  // ── API Hooks ─────────────────────────────────────────────────────────────
  const { data: addonsData, isLoading: isFetchingAddons } = useGetMyAddons({
    page,
    limit,
    searchTerm
  });

  const { mutateAsync: createAddon, isPending: isCreating } = useCreateAddon();
  const { mutateAsync: updateAddon } = useUpdateAddon();
  const { mutateAsync: deleteAddon, isPending: isDeletingAddon } = useDeleteAddon();

  const addOnServices = addonsData?.data ?? [];
  const meta = addonsData?.meta;

  const form = useForm<AddOnServiceFormData>({
    resolver: zodResolver(addOnServiceSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      status: "active"
    }
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [serviceToDeleteId, setServiceToDeleteId] = useState<string | null>(null);

  function resetForm() {
    form.reset({
      name: "",
      price: 0,
      description: "",
      status: "active"
    });
  }

  function handleOpenCreate() {
    setEditingAddOnService(null);
    resetForm();
    setIsSheetOpen(true);
  }

  function handleOpenEdit(service: Addon) {
    setEditingAddOnService(service);
    form.reset({
      name: service.name,
      price: Number(service.price),
      description: service.description || "",
      status: service.isActive ? "active" : "inactive"
    });
    setIsSheetOpen(true);
  }

  const handleToggleStatus = async (service: Addon) => {
    try {
      const newIsActive = !service.isActive;
      await updateAddon({
        id: service.id,
        payload: { isActive: newIsActive }
      });
      toast.success(`${service.name} status updated successfully`, {
        position: "top-center"
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  function handleDelete(id: string) {
    // Note: User didn't request DELETE API, so keeping local state or placeholder
    // But since we are moving to real API, maybe we should skip for now or use update for soft delete
    setServiceToDeleteId(id);
    setDeleteModalOpen(true);
  }

  async function handleConfirmDelete() {
    if (serviceToDeleteId) {
      try {
        await deleteAddon(serviceToDeleteId);
        toast.success("Add-on service deleted successfully", {
          position: "top-center"
        });
        setDeleteModalOpen(false);
        setServiceToDeleteId(null);
      } catch (error: any) {
        toast.error(error.message || "Failed to delete service", {
          position: "top-center"
        });
      }
    }
  }

  function handleSheetOpenChange(open: boolean) {
    setIsSheetOpen(open);

    if (!open) {
      setEditingAddOnService(null);
      resetForm();
    }
  }

  async function onSubmit(values: AddOnServiceFormData) {
    try {
      const payload = {
        name: values.name,
        price: values.price,
        description: values.description,
        isActive: values.status === "active"
      };

      if (editingAddOnService) {
        await updateAddon({
          id: editingAddOnService.id,
          payload
        });
        toast.success("Add-on service updated successfully", {
          position: "top-center"
        });
      } else {
        await createAddon(payload);
        toast.success("Add-on service added successfully", {
          position: "top-center"
        });
      }
      handleSheetOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
          <Card className="p-6 gap-2 w-full flex-row items-center justify-between flex">
            <div className="gap-2 flex flex-col items-start justify-center">
              <h1 className="text-2xl font-bold">Add-On Services</h1>
              <p className="text-sm text-muted-foreground">
                Create and manage optional add-on services
              </p>
            </div>
            <SheetTrigger asChild>
              <Button onClick={handleOpenCreate}>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add-On Service
              </Button>
            </SheetTrigger>
          </Card>
          <SheetContent side="right" className="sm:max-w-md w-full">
            <SheetHeader>
              <SheetTitle>
                {editingAddOnService ? "Edit Add-On Service" : "Add Add-On Service"}
              </SheetTitle>
              <SheetDescription>
                {editingAddOnService
                  ? "Update add-on service details and status"
                  : "Create a new add-on service option"}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 px-4 pb-6 overflow-y-auto">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Add-On Service Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Express Service" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0.01}
                            step={0.01}
                            value={field.value}
                            onChange={(event) =>
                              field.onChange(Number(event.target.value || "0"))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (max 30 chars)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Short add-on description"
                            maxLength={30}
                            className="min-h-24 border-border"
                            {...field}
                          />
                        </FormControl>
                        <p className="text-muted-foreground text-xs">{field.value.length}/30</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    {editingAddOnService ? "Save Changes" : "Add Add-On Service"}
                  </Button>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <AddOnServicesTable
        services={addOnServices}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        page={page}
        totalPage={meta?.totalPage || 0}
        setPage={setPage}
        isLoading={isFetchingAddons}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingAddon}
        title="Delete Add-on Service"
        description={`Are you sure you want to delete this add-on service? This action cannot be undone.`}
      />
    </div>
  );
}
