"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { ImagePlus, Loader2, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Store } from "@/types/store";

import { useCreateStore } from "@/lib/actions/store/create.store";
import { useUpdateStore } from "@/lib/actions/store/update.store";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Switch
} from "@/ui";

import { StoreFormData, storeSchema } from "../schema/store.schema";

const DynamicMap = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="h-64 h-100 rounded-lg bg-muted/20 text-muted-foreground animate-pulse flex items-center justify-center border">
      Loading map...
    </div>
  )
});

interface AddStoreFormProps {
  onSuccess?: () => void;
  editingStore?: Store | null;
}

interface ApiErrorResponse {
  message?: string;
}

export default function AddStoreForm({ onSuccess, editingStore }: AddStoreFormProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(editingStore?.logo || null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(editingStore?.banner || null);

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: "",
      address: "",
      country: "",
      state: "",
      city: "",
      postalCode: "",
      lat: 23.8456, // Dhaka default
      lng: 90.1681,
      isActive: true,
      logo: null,
      banner: null
    }
  });

  const { mutateAsync: createStore, isPending: isCreating } = useCreateStore();
  const { mutateAsync: updateStore, isPending: isUpdating } = useUpdateStore();

  useEffect(() => {
    if (editingStore) {
      form.reset({
        name: editingStore.name,
        address: editingStore.address,
        country: editingStore.country,
        state: editingStore.state,
        city: editingStore.city,
        postalCode: editingStore.postalCode,
        lat: Number(editingStore.lat),
        lng: Number(editingStore.lng),
        isActive: editingStore.isActive,
        logo: null, // Reset images so we don't accidentally update them unless specifically selected
        banner: null
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLogoPreview(editingStore.logo);
      setBannerPreview(editingStore.banner);
    } else {
      form.reset({
        name: "",
        address: "",
        country: "Bangladesh",
        state: "",
        city: "",
        postalCode: "",
        lat: 23.8456,
        lng: 90.1681,
        isActive: true,
        logo: null,
        banner: null
      });
      setLogoPreview(null);
      setBannerPreview(null);
    }
  }, [editingStore, form]);

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: unknown[]) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (...event: unknown[]) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: StoreFormData) {
    try {
      const payload = {
        name: values.name,
        address: values.address,
        country: values.country,
        state: values.state,
        city: values.city,
        postalCode: values.postalCode,
        lat: values.lat,
        lng: values.lng,
        isActive: values.isActive
      };

      if (editingStore) {
        await updateStore({
          id: editingStore.id,
          payload,
          logo: values.logo,
          banner: values.banner
        });
        toast.success("Store updated successfully!");
      } else {
        await createStore({
          payload,
          logo: values.logo,
          banner: values.banner
        });
        toast.success("Store created successfully!");
      }

      form.reset();
      setLogoPreview(null);
      setBannerPreview(null);
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage = isAxiosError<ApiErrorResponse>(error)
        ? (error.response?.data?.message ?? error.message)
        : "Failed to save store";

      toast.error(errorMessage);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="md:grid-cols-2 gap-4 grid grid-cols-1">
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Logo</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {logoPreview ? (
                      <div className="h-32 w-32 rounded-lg relative overflow-hidden border">
                        <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                        {/* <Image
                          src="/images/edit-overlay.png"
                          alt="Edit"
                          fill
                          className="object-cover"
                          unoptimized
                        /> */}
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="top-2 right-2 h-6 w-6 absolute"
                          onClick={() => {
                            setLogoPreview(null);
                            field.onChange(null);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <label className="h-32 w-32 rounded-lg border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed transition-all">
                        <ImagePlus className="h-6 w-6 text-muted-foreground mb-1" />
                        <span className="font-medium text-center text-[10px]">Upload Logo</span>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleLogoChange(e, field.onChange)}
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
            name="banner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store Banner</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {bannerPreview ? (
                      <div className="aspect-video rounded-lg relative w-full overflow-hidden border">
                        <img
                          src={bannerPreview}
                          alt="Banner"
                          className="h-full w-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="top-2 right-2 h-6 w-6 absolute"
                          onClick={() => {
                            setBannerPreview(null);
                            field.onChange(null);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <label className="aspect-video rounded-lg border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 flex w-full cursor-pointer flex-col items-center justify-center border-2 border-dashed transition-all">
                        <ImagePlus className="h-6 w-6 text-muted-foreground mb-1" />
                        <span className="font-medium text-center text-[10px]">Upload Banner</span>
                        <Input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleBannerChange(e, field.onChange)}
                        />
                      </label>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Next Crazy Store" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main Street" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="gap-4 grid grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="gap-4 grid grid-cols-2">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Postal Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormLabel>Location</FormLabel>
          <div className="gap-4 flex">
            <FormField
              control={form.control}
              name="lat"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs">Latitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lng"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="text-xs">Longitude</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <DynamicMap
            onLocationSelect={(lat, lng) => {
              form.setValue("lat", lat);
              form.setValue("lng", lng);
            }}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="rounded-lg p-4 shadow-sm bg-muted/30 flex flex-row items-center justify-between border">
              <div className="space-y-0.5">
                <FormLabel>Active Status</FormLabel>
                <div className="text-xs text-muted-foreground">Is this store active?</div>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="h-11 w-full" disabled={isCreating || isUpdating}>
          {isCreating || isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving Store...
            </>
          ) : editingStore ? (
            "Update Store"
          ) : (
            "Create Store"
          )}
        </Button>
      </form>
    </Form>
  );
}
