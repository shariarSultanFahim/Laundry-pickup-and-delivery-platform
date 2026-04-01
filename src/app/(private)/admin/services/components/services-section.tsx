"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

import { useGetCategories } from "@/lib/actions/category/get.categories";
import { useCreateCategory } from "@/lib/actions/category/create.category";
import { useUpdateCategory } from "@/lib/actions/category/update.category";
import type { Category } from "@/types/category";

import {
  serviceCategorySchema,
  type ServiceCategoryFormData
} from "../schema/service-category.schema";

function getStatusClassName(isActive: boolean) {
  if (isActive) {
    return "text-emerald-600";
  }
  return "text-muted-foreground";
}

export default function ServicesSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categoriesResponse, isLoading, isError } = useGetCategories({
    searchTerm: searchTerm || undefined
  });

  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const categories = categoriesResponse?.data ?? [];

  const form = useForm<ServiceCategoryFormData>({
    resolver: zodResolver(serviceCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active"
    }
  });

  function resetForm() {
    form.reset({
      name: "",
      description: "",
      status: "active"
    });
  }

  function handleOpenCreate() {
    setEditingCategory(null);
    resetForm();
    setIsSheetOpen(true);
  }

  function handleOpenEdit(category: Category) {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      description: category.description,
      status: category.isActive ? "active" : "inactive"
    });
    setIsSheetOpen(true);
  }

  function handleSheetOpenChange(open: boolean) {
    setIsSheetOpen(open);

    if (!open) {
      setEditingCategory(null);
      resetForm();
    }
  }

  async function onSubmit(values: ServiceCategoryFormData) {
    const isActive = values.status === "active";

    try {
      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          name: values.name,
          description: values.description,
          isActive
        });
        toast.success("Category updated successfully", {
          position: "top-center"
        });
      } else {
        await createCategory({
          name: values.name,
          description: values.description,
          isActive
        });
        toast.success("Category created successfully", {
          position: "top-center"
        });
      }
      handleSheetOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred", {
        position: "top-center"
      });
    }
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
                <SheetTitle>{editingCategory ? "Edit Category" : "Add Category"}</SheetTitle>
                <SheetDescription>
                  {editingCategory
                    ? "Update category details and status"
                    : "Add a new category for laundry services"}
                </SheetDescription>
              </SheetHeader>

              <div className="px-4 pb-6 overflow-y-auto">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
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

                    <Button type="submit" className="w-full" disabled={isCreating || isUpdating}>
                      {isCreating || isUpdating
                        ? "Saving..."
                        : editingCategory
                          ? "Save Changes"
                          : "Add Category"}
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

        {isError ? (
          <div className="rounded-lg p-8 border text-center text-destructive bg-destructive/5">
            <p>Failed to load categories. Please try again later.</p>
          </div>
        ) : isLoading ? (
          <div className="rounded-lg p-8 border text-center">
            <p className="text-muted-foreground animate-pulse">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-lg p-8 border text-center">
            <p className="text-muted-foreground">No categories found.</p>
          </div>
        ) : (
          <div className="gap-4 md:grid-cols-2 xl:grid-cols-3 grid">
            {categories.map((category) => (
              <Card key={category.id} className="p-5">
                <div className="gap-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{category.description}</p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEdit(category)}
                    aria-label={`Edit ${category.name}`}
                  >
                    Edit
                  </Button>
                </div>

                <div className="mt-5 text-sm flex items-center justify-between">
                  <span className={getStatusClassName(category.isActive)}>
                    {category.isActive ? "Active" : "Inactive"}
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
