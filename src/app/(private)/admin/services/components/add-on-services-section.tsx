"use client";

import { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { AdminAddOnService } from "@/types";

import { AddOnServiceFormData, addOnServiceSchema } from "../schema/add-on-service.schema";

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

function getStatusClassName(status: AdminAddOnService["status"]) {
  if (status === "active") {
    return "text-emerald-600";
  }

  return "text-muted-foreground";
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
    } else {
      const newAddOnService: AdminAddOnService = {
        id: getNewAddOnServiceId(),
        name: values.name,
        price: values.price,
        description: values.description,
        status: values.status
      };

      setAddOnServices((prev) => [newAddOnService, ...prev]);
    }

    handleSheetOpenChange(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="gap-4 md:flex-row md:items-center md:justify-between flex flex-col">
          <div>
            <CardTitle>Add-On Services</CardTitle>
            <CardDescription>Manage optional add-on services for each category</CardDescription>
          </div>

          <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
            <SheetTrigger asChild>
              <Button onClick={handleOpenCreate}>Add Add-On Service</Button>
            </SheetTrigger>
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

              <div className="px-4 pb-6 overflow-y-auto">
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
      </CardHeader>

      <CardContent className="space-y-4">
        <Input
          placeholder="Search add-on services..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {filteredAddOnServices.length === 0 ? (
          <div className="rounded-lg p-8 border text-center">
            <p className="text-muted-foreground">No add-on services found.</p>
          </div>
        ) : (
          <div className="gap-4 md:grid-cols-2 xl:grid-cols-3 grid">
            {filteredAddOnServices.map((service) => (
              <Card key={service.id} className="p-5">
                <div className="gap-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{service.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{service.description}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(service)}
                    aria-label={`Edit ${service.name}`}
                  >
                    Edit
                  </Button>
                </div>

                <div className="mt-5 text-sm flex items-center justify-between">
                  <span className={getStatusClassName(service.status)}>
                    {service.status === "active" ? "Active" : "Inactive"}
                  </span>
                  <span className="text-muted-foreground">${service.price.toFixed(2)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
