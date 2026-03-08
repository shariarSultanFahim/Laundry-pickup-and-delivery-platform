"use client";

import { useEffect, useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { Bundle } from "@/types/bundle-management";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea
} from "@/ui";

import { addBundleSchema, type AddBundleFormData } from "../schema/add-bundle.schema";
import { createBundle, updateBundle } from "./bundle-api";
import ServiceSelector from "./service-selector";

interface AddBundleFormProps {
  onSuccess?: () => void;
  editingBundle?: Bundle | null;
}

export default function AddBundleForm({ onSuccess, editingBundle }: AddBundleFormProps) {
  const form = useForm<AddBundleFormData>({
    resolver: zodResolver(addBundleSchema),
    defaultValues: {
      name: editingBundle?.name || "",
      description: editingBundle?.description || "",
      services: editingBundle?.services || [],
      bundlePrice: editingBundle?.bundlePrice || 0
    }
  });

  const selectedServices = form.watch("services");
  const bundlePrice = form.watch("bundlePrice");

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, service) => sum + service.servicePrice, 0);
  }, [selectedServices]);

  const discount = useMemo(() => {
    if (totalPrice === 0) return 0;
    return ((totalPrice - bundlePrice) / totalPrice) * 100;
  }, [totalPrice, bundlePrice]);

  // Update form when editing bundle changes
  useEffect(() => {
    if (editingBundle) {
      form.reset({
        name: editingBundle.name,
        description: editingBundle.description,
        services: editingBundle.services,
        bundlePrice: editingBundle.bundlePrice
      });
    } else {
      form.reset({
        name: "",
        description: "",
        services: [],
        bundlePrice: 0
      });
    }
  }, [editingBundle, form]);

  async function onSubmit(values: AddBundleFormData) {
    try {
      if (editingBundle) {
        const response = await updateBundle(editingBundle.id, values);
        if (response.success) {
          toast.success("Bundle updated successfully!");
          form.reset();
          onSuccess?.();
        } else {
          toast.error(response.message || "Failed to update bundle");
        }
      } else {
        const response = await createBundle(values);
        if (response.success) {
          toast.success("Bundle created successfully!");
          form.reset();
          onSuccess?.();
        } else {
          toast.error(response.message || "Failed to create bundle");
        }
      }
    } catch (error) {
      console.error("Error submitting bundle:", error);
      toast.error(`An error occurred while ${editingBundle ? "updating" : "creating"} the bundle`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Bundle Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bundle Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Signature" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bundle Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what this bundle includes..."
                  className="min-h-20 resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Services Selection */}
        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Services</FormLabel>
              <FormControl>
                <ServiceSelector selectedServices={field.value} onServicesChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price Summary */}
        {selectedServices.length > 0 && (
          <div className="rounded-lg bg-muted/50 p-4 space-y-2 border">
            <div className="text-sm flex justify-between">
              <span className="text-muted-foreground">Total Price (all services):</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="text-sm flex justify-between">
              <span className="text-muted-foreground">Discount:</span>
              <span className={discount > 0 ? "font-medium text-green-600" : "font-medium"}>
                {discount.toFixed(2)}%
              </span>
            </div>
          </div>
        )}

        {/* Bundle Price */}
        <FormField
          control={form.control}
          name="bundlePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bundle Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          {editingBundle ? "Update Bundle" : "Create Bundle"}
        </Button>
      </form>
    </Form>
  );
}
