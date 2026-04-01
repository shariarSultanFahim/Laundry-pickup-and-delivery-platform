"use client";

import { useState } from "react";

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

import { useForgetPassword } from "@/lib/actions/auth/forget-password";

import { ForgotPasswordFormData, forgotPasswordSchema } from "../schema/forgotPassword.schema";

export default function ForgotPasswordForm() {
  const [emailSent, setEmailSent] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const { mutateAsync: forgetPassword, isPending } = useForgetPassword();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    const toastId = toast.loading("Sending reset link...");
    try {
      await forgetPassword({ email: data.email });
      setSentTo(data.email);
      setEmailSent(true);
      toast.success("Password reset email sent!", { id: toastId });
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : "Something went wrong. Please try again.";
      toast.error(message, { id: toastId });
    }
  }

  // ── Email sent confirmation state ───────────────────────────────────────────
  if (emailSent) {
    return (
      <div className="px-4 flex h-screen w-full items-center justify-center">
        <div className="max-w-lg rounded-lg bg-white p-8 shadow-lg w-full text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium text-foreground">{sentTo}</span>. Click the link in the
            email to set your new password.
          </p>
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive it?{" "}
            <button
              type="button"
              onClick={() => setEmailSent(false)}
              className="text-primary font-medium hover:underline"
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    );
  }

  // ── Email input form ────────────────────────────────────────────────────────
  return (
    <div className="px-4 flex h-screen w-full items-center justify-center">
      <div className="max-w-lg rounded-lg bg-white p-8 shadow-lg w-full">
        {/* Heading */}
        <div className="gap-2 py-4 flex flex-col items-center justify-center">
          <h1 className="text-3xl text-foreground text-center">Forgot password</h1>
          <p className="text-sm text-center">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">Enter Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      disabled={isPending}
                      className="border-border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="py-2 font-semibold h-auto w-full">
              {isPending ? "Sending..." : "SEND RESET LINK"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
