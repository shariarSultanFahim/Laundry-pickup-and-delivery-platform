"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useResetPassword } from "@/lib/actions/auth/reset-password";

import { PasswordResetFormData, passwordResetSchema } from "../schema/reset.password.schema";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const form = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  });

  if (!token) {
    return (
      <div className="px-4 flex h-screen w-full items-center justify-center">
        <div className="max-w-lg rounded-lg bg-white p-8 shadow-lg w-full text-center space-y-4">
          <h1 className="text-2xl font-semibold text-destructive">Invalid Reset Link</h1>
          <p className="text-sm text-muted-foreground">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Button onClick={() => router.push("/forgot-password")} className="w-full">
            Request New Link
          </Button>
        </div>
      </div>
    );
  }

  async function onSubmit(data: PasswordResetFormData) {
    const toastId = toast.loading("Updating password...");
    try {
      await resetPassword({ token, password: data.newPassword });
      toast.success("Password updated successfully!", { id: toastId });
      router.push("/login");
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : "Something went wrong. Please try again.";
      toast.error(message, { id: toastId });
    }
  }

  return (
    <div className="px-4 flex h-screen w-full items-center justify-center">
      <div className="max-w-lg rounded-lg bg-white p-8 shadow-lg w-full">
        {/* Heading */}
        <div className="gap-2 py-4 flex flex-col items-center justify-center">
          <h1 className="text-3xl text-center">Set New Password</h1>
          <p className="text-center text-sm text-muted-foreground">
            Enter your new password below to complete the reset.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="At least 8 characters"
                      type="password"
                      disabled={isPending}
                      className="border-border"
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
                  <FormLabel className="text-sm text-foreground">Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm your new password"
                      type="password"
                      disabled={isPending}
                      className="border-border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="py-2 font-semibold h-auto w-full"
            >
              {isPending ? "Updating password..." : "UPDATE PASSWORD"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
