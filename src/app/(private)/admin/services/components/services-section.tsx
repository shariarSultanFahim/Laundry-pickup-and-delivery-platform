"use client";

import { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AdminServiceCategory } from "@/types";
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

import {
    serviceCategorySchema,
    type ServiceCategoryFormData
} from "../schema/service-category.schema";

const MOCK_SERVICE_CATEGORIES: AdminServiceCategory[] = [
  {
    id: "service-1",
    name: "Wash",
    description: "Regular washing service for everyday clothes",
    status: "active"
  },
  {
    id: "service-2",
    name: "Dry Wash",
    description: "Professional dry cleaning for delicate items",
    status: "active"
  },
  {
    id: "service-3",
    name: "Fold",
    description: "Folding and organizing clean clothes",
    status: "active"
  },
  {
    id: "service-4",
    name: "Iron",
    description: "Expert ironing for wrinkle-free garments",
    status: "inactive"
  },
  {
    id: "service-5",
    name: "Stain Removal",
    description: "Targeted stain treatment and fabric care",
    status: "active"
  },
  {
    id: "service-6",
    name: "Dry Cleaning",
    description: "Premium solvent cleaning for special fabrics",
    status: "active"
  },
  {
    id: "service-7",
    name: "Alterations",
    description: "Minor tailoring and fit adjustments",
    status: "inactive"
  }
];

function getNewServiceId() {
  return `service-${Date.now()}`;
}

function getStatusClassName(status: AdminServiceCategory["status"]) {
  if (status === "active") {
    return "text-emerald-600";
  }

  return "text-muted-foreground";
}

export default function ServicesSection() {
  const [services, setServices] = useState<AdminServiceCategory[]>(MOCK_SERVICE_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingService, setEditingService] = useState<AdminServiceCategory | null>(null);

  const form = useForm<ServiceCategoryFormData>({
    resolver: zodResolver(serviceCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      itemsCount: 0,
      status: "active"
    }
  });

  const filteredServices = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return services;
    }

    return services.filter((service) => {
      return (
        service.name.toLowerCase().includes(normalizedSearch) ||
        service.description.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [searchTerm, services]);

  function resetForm() {
    form.reset({
      name: "",
      description: "",
      itemsCount: 0,
      status: "active"
    });
  }

  function handleOpenCreate() {
    setEditingService(null);
    resetForm();
    setIsSheetOpen(true);
  }

  function handleOpenEdit(service: AdminServiceCategory) {
    setEditingService(service);
    form.reset({
      name: service.name,
      description: service.description,
      status: service.status
    });
    setIsSheetOpen(true);
  }

  function handleSheetOpenChange(open: boolean) {
    setIsSheetOpen(open);

    if (!open) {
      setEditingService(null);
      resetForm();
    }
  }

  function onSubmit(values: ServiceCategoryFormData) {
    if (editingService) {
      setServices((prev) =>
        prev.map((service) =>
          service.id === editingService.id
            ? {
                ...service,
                name: values.name,
                description: values.description,
                itemsCount: values.itemsCount,
                status: values.status
              }
            : service
        )
      );
    } else {
      const newService: AdminServiceCategory = {
        id: getNewServiceId(),
        name: values.name,
        description: values.description,
        status: values.status
      };

      setServices((prev) => [newService, ...prev]);
    }

    handleSheetOpenChange(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="gap-4 md:flex-row md:items-center md:justify-between flex flex-col">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Manage your laundry service categories</CardDescription>
          </div>

          <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
            <SheetTrigger asChild>
              <Button onClick={handleOpenCreate}>Add Category</Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-md w-full">
              <SheetHeader>
                <SheetTitle>{editingService ? "Edit Category" : "Add Category"}</SheetTitle>
                <SheetDescription>
                  {editingService
                    ? "Update category details and status"
                    : "Add a new category for laundry services"}
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
                          <FormLabel>Category Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Wash" {...field} />
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
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Short description of this category"
                              className="min-h-24 border-border"
                              {...field}
                            />
                          </FormControl>
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
                      {editingService ? "Save Changes" : "Add Category"}
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
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        {filteredServices.length === 0 ? (
          <div className="rounded-lg p-8 border text-center">
            <p className="text-muted-foreground">No categories found.</p>
          </div>
        ) : (
          <div className="gap-4 md:grid-cols-2 xl:grid-cols-3 grid">
            {filteredServices.map((service) => (
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
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
