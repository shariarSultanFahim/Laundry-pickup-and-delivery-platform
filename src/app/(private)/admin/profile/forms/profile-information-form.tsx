"use client";

import { useRef, type ChangeEvent, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Camera, Save } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input
} from "@/ui";

import { useGetMe } from "@/lib/actions/user/use-get-me";
import { useUpdateProfile } from "@/lib/actions/user/use-update-profile";

import {
  profileInformationSchema,
  type ProfileInformationFormData
} from "../schema/profile-information.schema";

export default function ProfileInformationForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: userResponse, isLoading: isFetchingMe } = useGetMe();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const user = userResponse?.data;

  const form = useForm<ProfileInformationFormData>({
    resolver: zodResolver(profileInformationSchema),
    defaultValues: {
      avatarUrl: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      role: ""
    }
  });

  useEffect(() => {
    if (user) {
      form.reset({
        avatarUrl: user.avatar ?? "",
        fullName: user.name ?? "",
        email: user.email ?? "",
        phoneNumber: user.phone ?? "",
        role: user.role ?? ""
      });
    }
  }, [user, form]);

  const avatarUrl = useWatch({ control: form.control, name: "avatarUrl" });
  const fullName = useWatch({ control: form.control, name: "fullName" });

  function handleAvatarClick() {
    fileInputRef.current?.click();
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    form.setValue("avatarFile", selectedFile, {
      shouldDirty: true,
      shouldValidate: true
    });

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      if (typeof fileReader.result !== "string") {
        return;
      }

      form.setValue("avatarUrl", fileReader.result, {
        shouldDirty: true,
        shouldValidate: true
      });
    };

    fileReader.readAsDataURL(selectedFile);
    event.target.value = "";
  }

  async function onSubmit(values: ProfileInformationFormData) {
    if (!user?.id) return;
    
    const toastId = toast.loading("Updating profile...", { position: "top-center" });
    try {
      await updateProfile({
        id: user.id,
        name: values.fullName,
        phone: values.phoneNumber,
        avatarFile: values.avatarFile ?? undefined
      });
      toast.success("Profile updated successfully", { id: toastId, position: "top-center" });
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? error.message
        : "Failed to update profile. Please try again.";
      toast.error(message, { id: toastId, position: "top-center" });
    }
  }

  return (
    <Card>
      <CardHeader className="gap-4 flex flex-row items-start justify-between">
        <div>
          <CardTitle>Profile Information</CardTitle>
          <p className="text-sm text-muted-foreground">Update your account profile and details</p>
        </div>
        <Button 
          type="submit" 
          form="profile-information-form" 
          disabled={isFetchingMe || isUpdating} 
          className="min-w-32"
        >
          <Save className="size-4" />
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </CardHeader>
      <CardContent>
        {isFetchingMe ? (
          <div className="py-12 animate-pulse text-center space-y-4">
            <div className="mx-auto size-24 bg-muted rounded-full" />
            <div className="h-4 w-1/4 mx-auto bg-muted rounded" />
            <div className="h-4 w-1/3 mx-auto bg-muted rounded" />
          </div>
        ) : (
          <Form {...form}>
            <form
              id="profile-information-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="gap-6 md:grid-cols-[auto_1fr] grid w-full grid-cols-1"
            >
              <div className="flex items-center justify-center">
                <button
                  type="button"
                  aria-label="Upload profile photo"
                  onClick={handleAvatarClick}
                  disabled={isUpdating}
                  className="focus-visible:ring-ring flex h-full w-full items-center justify-center focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Avatar size="xl" className="cursor-pointer rounded-none">
                    <AvatarImage src={avatarUrl} alt={fullName} className="rounded-full object-cover" />
                    <AvatarFallback>{fullName?.charAt(0)?.toUpperCase() || "A"}</AvatarFallback>
                    <AvatarBadge className="size-9">
                      <Camera className="size-5" />
                    </AvatarBadge>
                  </Avatar>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />

                <FormField
                  control={form.control}
                  name="avatarFile"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="gap-4 md:grid-cols-2 grid grid-cols-1">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input disabled={isUpdating} placeholder="Full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        {/* Email should be disabled */}
                        <Input disabled type="email" placeholder="Email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input disabled={isUpdating} placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input disabled placeholder="Role" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
