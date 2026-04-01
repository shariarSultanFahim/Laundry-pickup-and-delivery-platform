"use client";

import { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AdminAddOnService } from "@/types";

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

const MOCK_ADD_ON_SERVICES: AdminAddOnService[] = [
  {
    id: "addon-1",
    name: "Express Service",
    price: 5,
    description: "Faster turnaround option",
    status: "active"
  },
  {
    id: "addon-2",
    name: "Stain Removal",
    price: 3,
    description: "Targeted stain treatment",
    status: "active"
  },
  {
    id: "addon-3",
    name: "Heavy Prewash",
    price: 4,
    description: "Deep prewash for heavy soil",
    status: "inactive"
  },
  {
    id: "addon-4",
    name: "Delicate Wash",
    price: 6,
    description: "Gentle cycle for soft fabrics",
    status: "active"
  },
  {
    id: "addon-5",
    name: "Fabric Softener",
    price: 2,
    description: "Adds softness and fragrance",
    status: "active"
  },
  {
    id: "addon-6",
    name: "Urgent Service",
    price: 8,
    description: "Priority processing option",
    status: "inactive"
  }
];

function getNewAddOnServiceId() {
  return `addon-${Date.now()}`;
}

export default function AddOnServicesSection() {
  const [addOnServices, setAddOnServices] = useState<AdminAddOnService[]>(MOCK_ADD_ON_SERVICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingAddOnService, setEditingAddOnService] = useState<AdminAddOnService | null>(null);

  const form = useForm<AddOnServiceFormData>({
    resolver: zodResolver(addOnServiceSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      status: "active"
    }
  });

  const filteredAddOnServices = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return addOnServices;
    }

    return addOnServices.filter((service) => {
      return (
        service.name.toLowerCase().includes(normalizedSearch) ||
        service.description.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [addOnServices, searchTerm]);

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

  function handleOpenEdit(service: AdminAddOnService) {
    setEditingAddOnService(service);
    form.reset({
      name: service.name,
      price: service.price,
      description: service.description,
      status: service.status
    });
    setIsSheetOpen(true);
  }

  function handleToggleStatus(service: AdminAddOnService) {
    const newStatus = service.status === "active" ? "inactive" : "active";
    setAddOnServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, status: newStatus as "active" | "inactive" } : s))
    );
    toast.success(`${service.name} status updated to ${newStatus}`, {
      position: "top-center"
    });
  }

  function handleDelete(id: string) {
    setServiceToDeleteId(id);
    setDeleteModalOpen(true);
  }

  function handleConfirmDelete() {
    if (serviceToDeleteId) {
      setAddOnServices((prev) => prev.filter((s) => s.id !== serviceToDeleteId));
      toast.success("Add-on service deleted successfully", {
        position: "top-center"
      });
      setDeleteModalOpen(false);
      setServiceToDeleteId(null);
    }
  }

  function handleSheetOpenChange(open: boolean) {
    setIsSheetOpen(open);

    if (!open) {
      setEditingAddOnService(null);
      resetForm();
    }
  }

  function onSubmit(values: AddOnServiceFormData) {
    if (editingAddOnService) {
      setAddOnServices((prev) =>
        prev.map((service) =>
          service.id === editingAddOnService.id
            ? {
              ...service,
              name: values.name,
              price: values.price,
              description: values.description,
              status: values.status
            }
            : service
        )
      );
      toast.success("Add-on service updated successfully", {
        position: "top-center"
      });
    } else {
      const newAddOnService: AdminAddOnService = {
        id: getNewAddOnServiceId(),
        name: values.name,
        price: values.price,
        description: values.description,
        status: values.status
      };

      setAddOnServices((prev) => [newAddOnService, ...prev]);
      toast.success("Add-on service added successfully", {
        position: "top-center"
      });
    }

    handleSheetOpenChange(false);
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
        services={filteredAddOnServices}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Add-on Service"
        description={`Are you sure you want to delete this add-on service? This action cannot be undone.`}
      />
    </div>
  );
}
