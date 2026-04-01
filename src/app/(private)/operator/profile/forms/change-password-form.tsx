"use client";

import { Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  PasswordInput
} from "@/ui";

import { updatePassword } from "../components/profile-api";
import {
  changePasswordSchema,
  type ChangePasswordFormData
} from "../schema/change-password.schema";

const defaultValues: ChangePasswordFormData = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
};

export default function ChangePasswordForm() {
  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues
  });

  async function onSubmit(values: ChangePasswordFormData) {
    await updatePassword(values);
    form.reset(defaultValues);
  }

  return (
    <Card>
      <CardHeader className="gap-4 flex flex-row items-start justify-between">
        <div>
          <CardTitle>Change Password</CardTitle>
          <p className="text-sm text-muted-foreground">
            Update your password regularly for security
          </p>
        </div>
        <Button type="submit" form="change-password-form" className="min-w-32">
          <Save className="size-4" />
          Save Password
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="change-password-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Enter current password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Enter new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Confirm new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
