"use client";

import { useRef, type ChangeEvent } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";

import {
    Button,
    Combobox,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input
} from "@/ui";

import { toast } from "sonner";

import type { Service } from "@/types/service-management";
import { addServiceSchema, type AddServiceFormData } from "../schema/add-service.schema";
import { MultiSelectCombobox } from "./multi-select-combobox";
import { createService, updateService } from "./service-api";

const CATEGORY_OPTIONS = [
  { value: "Wash", label: "Wash" },
  { value: "Dry Wash", label: "Dry Wash" },
  { value: "Fold", label: "Fold" },
  { value: "Iron", label: "Iron" },
  { value: "Stain Removal", label: "Stain Removal" },
  { value: "Dry Cleaning", label: "Dry Cleaning" },
  { value: "Alterations", label: "Alterations" }
];

const ADDON_SERVICE_OPTIONS = [
  { value: "Express Service", label: "Express Service" },
  { value: "Stain Removal", label: "Stain Removal" },
  { value: "Heavy Prewash", label: "Heavy Prewash" },
  { value: "Delicate Wash", label: "Delicate Wash" },
  { value: "Fabric Softener", label: "Fabric Softener" },
  { value: "Urgent Service", label: "Urgent Service" }
];

interface AddServiceFormProps {
  onSuccess?: () => void;
  editingService?: Service | null;
}

export default function AddServiceForm({ onSuccess, editingService }: AddServiceFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<AddServiceFormData>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: {
      name: editingService?.name || "",
      category: editingService?.category,
      addOnServices: editingService?.addOnServices || [],
      price: editingService?.price || 0,
      bannerImage: editingService?.bannerImage || null,
      bannerImageFile: null
    }
  });

  const bannerImage = useWatch({ control: form.control, name: "bannerImage" });

  function handleBannerClick() {
    fileInputRef.current?.click();
  }

  function handleBannerChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const url = e.target?.result as string;
      form.setValue("bannerImageFile", selectedFile);
      form.setValue("bannerImage", url);
    };

    reader.readAsDataURL(selectedFile);
  }

  function handleRemoveBanner() {
    form.setValue("bannerImage", null);
    form.setValue("bannerImageFile", null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onSubmit(values: AddServiceFormData) {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("category", values.category);
      formData.append("addOnServices", JSON.stringify(values.addOnServices));
      formData.append("price", values.price.toString());

      if (values.bannerImageFile) {
        formData.append("bannerImage", values.bannerImageFile);
      }

      if (editingService) {
        const response = await updateService(editingService.id, formData);
        if (response.success) {
          toast.success("Service updated successfully!");
          form.reset();
          form.setValue("bannerImage", null);
          form.setValue("bannerImageFile", null);
          onSuccess?.();
        } else {
          toast.error(response.message || "Failed to update service");
        }
      } else {
        const response = await createService(formData);
        if (response.success) {
          toast.success("Service added successfully!");
          form.reset();
          form.setValue("bannerImage", null);
          form.setValue("bannerImageFile", null);
          onSuccess?.();
        } else {
          toast.error(response.message || "Failed to add service");
        }
      }
    } catch (error) {
      console.error("Error submitting service:", error);
      toast.error(`An error occurred while ${editingService ? "updating" : "adding"} the service`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Banner Image */}
        <FormField
          control={form.control}
          name="bannerImage"
          render={() => (
            <FormItem>
              <FormLabel>Banner Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {bannerImage ? (
                    <div className="relative inline-block w-full">
                      <Image
                        src={bannerImage}
                        alt="Service banner"
                        width={400}
                        height={128}
                        className="h-32 w-full object-cover rounded-md border border-input"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveBanner}
                        className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded hover:bg-destructive/90"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleBannerClick}
                      className="border-2 border-dashed border-input rounded-md p-8 text-center hover:border-primary hover:bg-accent transition-colors cursor-pointer"
                    >
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Upload banner image</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="hidden"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Service Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Premium Wash" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Combobox
                  options={CATEGORY_OPTIONS}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select a category..."
                  searchPlaceholder="Search categories..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (for 1 quantity)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Add-on Services */}
        <FormField
          control={form.control}
          name="addOnServices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add-on Services</FormLabel>
              <FormControl>
                <MultiSelectCombobox
                  options={ADDON_SERVICE_OPTIONS}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select add-on services..."
                  searchPlaceholder="Search add-ons..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </form>
    </Form>
  );
}
