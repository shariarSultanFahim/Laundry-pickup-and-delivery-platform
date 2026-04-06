"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ImagePlus, Loader2, X } from "lucide-react";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
  Badge,
  Switch
} from "@/ui";

import { addBundleSchema, type AddBundleFormData } from "../schema/add-bundle.schema";
import { useCreateBundle } from "@/lib/actions/bundle/create.bundle";
import { useUpdateBundle } from "@/lib/actions/bundle/update.bundle";
import { useGetOperatorMe } from "@/lib/actions/user/get.operator-me";
import ServiceSelector from "./service-selector";
import { Bundle } from "@/types/bundle-management";

interface AddBundleFormProps {
  onSuccess?: () => void;
  editingBundle?: Bundle | null;
}

export default function AddBundleForm({ onSuccess, editingBundle }: AddBundleFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(editingBundle?.image || null);

  const { data: operatorMe } = useGetOperatorMe();
  const operatorId = operatorMe?.data?.operatorProfile?.id;

  const form = useForm<AddBundleFormData>({
    resolver: zodResolver(addBundleSchema),
    defaultValues: {
      name: "",
      description: "",
      services: [],
      bundlePrice: 0,
      isActive: true,
      image: null
    }
  });

  const { mutateAsync: createBundle, isPending: isCreating } = useCreateBundle();
  const { mutateAsync: updateBundle, isPending: isUpdating } = useUpdateBundle();

  const selectedServices = form.watch("services");
  const bundlePrice = form.watch("bundlePrice");

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, s) => sum + s.servicePrice, 0);
  }, [selectedServices]);

  const savingsDetails = useMemo(() => {
    if (totalPrice === 0 || !bundlePrice) return null;
    const amount = totalPrice - bundlePrice;
    const percentage = (amount / totalPrice) * 100;
    return { amount, percentage: Math.max(0, percentage) };
  }, [totalPrice, bundlePrice]);

  useEffect(() => {
    if (editingBundle) {
      form.reset({
        name: editingBundle.name,
        description: editingBundle.description,
        services: editingBundle.bundleServices.map((s: any) => ({
          serviceId: s.service.id,
          serviceName: s.service.name,
          servicePrice: Number(s.service.basePrice)
        })),
        bundlePrice: Number(editingBundle.bundlePrice),
        isActive: editingBundle.isActive,
        image: null
      });
      setImagePreview(editingBundle.image);
    } else {
      form.reset({
        name: "",
        description: "",
        services: [],
        bundlePrice: 0,
        isActive: true,
        image: null
      });
      setImagePreview(null);
    }
  }, [editingBundle, form]);

  async function onSubmit(values: AddBundleFormData) {
    if (!operatorId && !editingBundle) {
      toast.error("Operator ID not found. Please try again later.");
      return;
    }

    try {
      const payload = {
        operatorId: operatorId || editingBundle?.operatorId || "",
        name: values.name,
        description: values.description,
        bundlePrice: values.bundlePrice,
        serviceIds: values.services.map(s => s.serviceId),
        isActive: values.isActive,
        image: values.image
      };

      if (editingBundle) {
        await updateBundle({ id: editingBundle.id, payload });
        toast.success("Bundle updated successfully!");
      } else {
        await createBundle(payload);
        toast.success("Bundle created successfully!");
      }

      form.reset();
      setImagePreview(null);
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to save bundle");
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (...event: any[]) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (onChange: (...event: any[]) => void) => {
    onChange(null);
    setImagePreview(null);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bundle Banner</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => removeImage(field.onChange)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-video w-full rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
                      <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs font-medium">Upload Bundle Banner</span>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageChange(e, field.onChange)}
                      />
                    </label>
                  )}
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
              <FormLabel>Bundle Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Full House Deep Clean" {...field} />
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
                  placeholder="What's included in this bundle?"
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Services</FormLabel>
              <FormControl>
                <ServiceSelector selectedServices={field.value} onServicesChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedServices.length > 0 && (
          <div className="rounded-xl bg-muted/40 p-4 space-y-2 border shadow-sm">
            <div className="text-sm flex justify-between">
              <span className="text-muted-foreground">Original Total:</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            {savingsDetails && (
              <div className="text-sm flex justify-between items-center text-green-600 font-medium">
                <span>Savings:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                  {savingsDetails.percentage.toFixed(0)}% OFF
                </Badge>
              </div>
            )}
          </div>
        )}

        <FormField
          control={form.control}
          name="bundlePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bundle Price ($)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/30">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
                <div className="text-xs text-muted-foreground">
                  Is this bundle available for customers?
                </div>
              </div>
              <FormControl>
                <Switch 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full h-11"
          disabled={isCreating || isUpdating}
        >
          {isCreating || isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : editingBundle ? (
            "Update Bundle"
          ) : (
            "Create Bundle"
          )}
        </Button>
      </form>
    </Form>
  );
}
