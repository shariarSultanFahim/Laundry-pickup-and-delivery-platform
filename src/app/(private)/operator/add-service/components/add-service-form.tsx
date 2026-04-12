"use client";

import { useRef, type ChangeEvent } from "react";
import Image from "next/image";

import { Plus, Upload, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import type { CreateServicePayload, Service } from "@/types/service";

import { useGetMyAddons } from "@/lib/actions/addon/get.my-addons";
import { useGetCategories } from "@/lib/actions/category/get.categories";
import { useCreateService } from "@/lib/actions/service/create.service";
import { useUpdateService } from "@/lib/actions/service/update.service";
import { useGetOperatorMe } from "@/lib/actions/user/get.operator-me";

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

import { addServiceSchema, type AddServiceFormData } from "../schema/add-service.schema";
import { MultiSelectCombobox } from "./multi-select-combobox";

interface AddServiceFormProps {
  onSuccess?: () => void;
  editingService?: Service | null;
}

export default function AddServiceForm({ onSuccess, editingService }: AddServiceFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categoriesResponse } = useGetCategories({ limit: 100 });
  const { data: addonsResponse } = useGetMyAddons({ limit: 100 });

  const { mutateAsync: createService, isPending: isCreating } = useCreateService();
  const { mutateAsync: updateService, isPending: isUpdating } = useUpdateService();
  const { data: operatorData } = useGetOperatorMe();

  const categoryOptions =
    categoriesResponse?.data.map((c) => ({
      value: c.id,
      label: c.name
    })) ?? [];

  const addonOptions =
    addonsResponse?.data.map((a) => ({
      value: a.id,
      label: a.name
    })) ?? [];

  const form = useForm<AddServiceFormData>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: {
      name: editingService?.name || "",
      categoryId: editingService?.categoryId || "",
      addOnServices: editingService?.serviceAddons?.map((addon) => addon.addonId) || [],
      price: Number(editingService?.basePrice) || 0,
      bannerImage: editingService?.image || null,
      bannerImageFile: null,
      isActive: editingService?.isActive ?? true
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

  const onSubmit: SubmitHandler<AddServiceFormData> = async (values) => {
    try {
      const operatorId = editingService?.operatorId || operatorData?.data?.operatorProfile?.id;

      if (!operatorId) {
        toast.error("Operator ID is missing. Please try again later.", {
          position: "top-center"
        });
        return;
      }

      const payload: CreateServicePayload = {
        operatorId,
        name: values.name,
        basePrice: values.price,
        categoryId: values.categoryId,
        addonIds: values.addOnServices,
        isActive: values.isActive ?? true
      };

      if (editingService) {
        await updateService({
          id: editingService.id,
          data: payload,
          image: values.bannerImageFile || undefined
        });
        toast.success("Service updated successfully!", { position: "top-center" });
      } else {
        await createService({
          data: payload,
          image: values.bannerImageFile || undefined
        });
        toast.success("Service added successfully!", { position: "top-center" });
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : `An error occurred while ${editingService ? "updating" : "adding"} the service`;

      toast.error(message, {
        position: "top-center"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        className="h-32 rounded-md border-input w-full border object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={handleRemoveBanner}
                        className="top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded hover:bg-destructive/90 absolute"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleBannerClick}
                      className="border-input rounded-md p-8 hover:border-primary hover:bg-accent w-full cursor-pointer border-2 border-dashed text-center transition-colors"
                    >
                      <Upload className="h-8 w-8 mb-2 text-muted-foreground mx-auto" />
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

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Combobox
                  options={categoryOptions}
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

        <FormField
          control={form.control}
          name="addOnServices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add-on Services</FormLabel>
              <FormControl>
                <MultiSelectCombobox
                  options={addonOptions}
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

        <Button type="submit" className="w-full" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? (
            "Saving..."
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              {editingService ? "Update Service" : "Add Service"}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
