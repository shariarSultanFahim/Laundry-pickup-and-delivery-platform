"use client";

import { Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useChangePassword } from "@/lib/actions/auth/change-password";

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
  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues
  });

  async function onSubmit(values: ChangePasswordFormData) {
    const toastId = toast.loading("Updating password...", { position: "top-center" });

    try {
      await changePassword({
        oldPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      toast.success("Password changed successfully", { id: toastId, position: "top-center" });
      form.reset(defaultValues);
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : "Failed to change password. Please try again.";

      toast.error(message, { id: toastId, position: "top-center" });
    }
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
        <Button type="submit" form="change-password-form" className="min-w-32" disabled={isPending}>
          <Save className="size-4" />
          {isPending ? "Saving..." : "Save Password"}
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
                    <PasswordInput
                      disabled={isPending}
                      placeholder="Enter current password"
                      {...field}
                    />
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
                    <PasswordInput
                      disabled={isPending}
                      placeholder="Enter new password"
                      {...field}
                    />
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
                    <PasswordInput
                      disabled={isPending}
                      placeholder="Confirm new password"
                      {...field}
                    />
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
