"use client";

import { useRef, type ChangeEvent } from "react";

import { Camera, Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

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

import { updateProfileInformation } from "../components/profile-api";
import { profileInformationDefaultValues } from "../data/profile";
import {
  profileInformationSchema,
  type ProfileInformationFormData
} from "../schema/profile-information.schema";

export default function ProfileInformationForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileInformationFormData>({
    resolver: zodResolver(profileInformationSchema),
    defaultValues: profileInformationDefaultValues
  });

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
    await updateProfileInformation(values);
  }

  return (
    <Card>
      <CardHeader className="gap-4 flex flex-row items-start justify-between">
        <div>
          <CardTitle>Profile Information</CardTitle>
          <p className="text-sm text-muted-foreground">Update your account profile and details</p>
        </div>
        <Button type="submit" form="profile-information-form" className="min-w-32">
          <Save className="size-4" />
          Save Changes
        </Button>
      </CardHeader>
      <CardContent>
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
                className="focus-visible:ring-ring flex h-full w-full items-center justify-center focus-visible:ring-2 focus-visible:outline-none"
              >
                <Avatar size="xl" className="cursor-pointer rounded-none">
                  <AvatarImage src={avatarUrl} alt={fullName} className="rounded-full" />
                  <AvatarFallback>JM</AvatarFallback>
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
                      <Input placeholder="Full name" {...field} />
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
                      <Input type="email" placeholder="Email address" {...field} />
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
                      <Input placeholder="Phone number" {...field} />
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
      </CardContent>
    </Card>
  );
}
