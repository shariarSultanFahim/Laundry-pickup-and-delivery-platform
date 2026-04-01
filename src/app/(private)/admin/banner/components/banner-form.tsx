"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { GradientPicker } from "@/components/ui/gradiantPicket";
import { Textarea } from "@/ui";
import { Button } from "@/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/ui/form";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Switch } from "@/ui/switch";

import { bannerTypeConfig } from "../data/banner";
import { bannerSchema, type BannerFormData } from "../schema/banner.schema";
import { useCreateBanner } from "@/lib/actions/banner/create.banner";

interface BannerFormProps {
  onSuccess?: () => void;
}

export default function BannerForm({ onSuccess }: BannerFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { mutateAsync: createBanner, isPending } = useCreateBanner();

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      description: "",
      buttonText: "Learn More",
      bannerType: "promotion",
      backgroundColor: "linear-gradient(135deg, #1e40af 0%, #0891b2 100%)",
      textColor: "#ffffff",
      isActive: true
    } as Partial<BannerFormData>
  });

  function handleImageClick() {
    fileInputRef.current?.click();
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      const maxSize = 5242880; // 5MB

      if (!validTypes.includes(file.type)) {
        form.setError("imageFile", {
          type: "manual",
          message: "Image must be JPEG, PNG, WebP, or GIF"
        });
        return;
      }

      if (file.size > maxSize) {
        form.setError("imageFile", {
          type: "manual",
          message: "Image must be less than 5MB"
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Set the file in the form
      form.setValue("imageFile", file);
    }
  }

  const handleSubmit = useCallback(
    async (data: BannerFormData) => {
      try {
        if (!data.imageFile) {
          toast.error("An image file is required");
          return;
        }

        await createBanner({
            title: data.title,
            description: data.description,
            buttonText: data.buttonText,
            bannerType: data.bannerType.toUpperCase(),
            backgroundColor: data.backgroundColor,
            textColor: data.textColor,
            isActive: data.isActive,
            image: data.imageFile,
        });

        toast.success("Banner created successfully");

        form.reset();
        setImagePreview("");
        onSuccess?.();
      } catch (error) {
          toast.error(error instanceof Error ? error.message : "Failed to create banner");
      }
    },
    [form, onSuccess, createBanner]
  );

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const input = fileInputRef.current;
    form
      .handleSubmit(handleSubmit)(e)
      .finally(() => {
        if (input) input.value = "";
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleFormSubmit}
        className="space-y-6 rounded-lg border-border bg-card p-6 border"
      >
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Create New Banner</h2>
          <p className="text-sm text-muted-foreground">
            Add a new promotional banner to display on the mobile app
          </p>
        </div>

        <div className="gap-6 md:grid-cols-2 grid">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Dry Clean 30% OFF" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bannerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select banner type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(bannerTypeConfig).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="backgroundColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Gradient/Color</FormLabel>
                <FormControl>
                  <GradientPicker background={field.value} setBackground={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="textColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text Color</FormLabel>
                <div className="gap-2 flex items-center">
                  <FormControl>
                    <Input type="color" className="size-12 cursor-pointer" {...field} />
                  </FormControl>
                  <Input placeholder="#ffffff" {...field} className="flex-1" />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="buttonText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Button Text</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Schedule Now" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageFile"
            render={() => (
              <FormItem className="md:col-span-2">
                <FormLabel>Banner Image</FormLabel>
                <div className="space-y-3">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                    aria-label="Upload banner image"
                  />

                  {/* Image preview or upload button */}
                  {imagePreview ? (
                    <div className="relative inline-block w-full">
                      <Image
                        src={imagePreview}
                        alt="Banner preview"
                        width={400}
                        height={160}
                        className="h-40 rounded-lg w-full object-cover"
                      />
                      <Button
                        type="button"
                        onClick={handleImageClick}
                        className="bottom-2 right-2 bg-sky-400 text-white hover:bg-sky-500 absolute"
                        size="sm"
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleImageClick}
                      className="rounded-lg border-border bg-muted/30 p-8 hover:bg-muted/50 w-full border-2 border-dashed text-center transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">Click to upload image</p>
                        <p className="text-sm text-muted-foreground">
                          JPEG, PNG, WebP or GIF (Max 5MB)
                        </p>
                      </div>
                    </button>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter banner description"
                  className="resize-none"
                  {...field}
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
            <FormItem className="rounded-lg border-border bg-muted/50 p-4 flex items-center justify-between border">
              <div className="space-y-1">
                <FormLabel className="text-base font-medium">Active Banner</FormLabel>
                <FormDescription>Make this banner visible to users</FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="gap-3 flex">
          <Button type="submit" disabled={isPending} className="">
            {isPending ? "Creating..." : "Create Banner"}
          </Button>
          <Button type="reset" variant="outline">
            Clear
          </Button>
        </div>
      </form>
    </Form>
  );
}
