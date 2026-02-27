"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
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

import { PasswordResetFormData, passwordResetSchema } from "../schema/reset.password.schema";

export default function PasswordResetForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  });

  async function onSubmit(data: PasswordResetFormData) {
    setIsLoading(true);
    toast.loading("Updating password...");
    try {
      //delay of 1 sec
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: Implement password reset API call
      console.log("Password reset attempt:", data);
    } finally {
      setIsLoading(false);
      toast.success("Password updated successfully!");
      window.location.href = "/";
    }
  }

  return (
    <div className="px-4 flex h-screen w-full items-center justify-center">
      <div className="max-w-lg rounded-lg bg-white p-8 shadow-lg w-full">
        {/* Heading */}
        <div className="gap-2 py-4 flex flex-col items-center justify-center">
          <h1 className="text-3xl text-center">Set New Password</h1>
          <p className="text-center">Enter your new password to complete the reset.</p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">Enter New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="8 digits at least, with letters and numbers"
                      type="password"
                      disabled={isLoading}
                      className="border-border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
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
                      disabled={isLoading}
                      className="border-border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Login Button */}
            <Button type="submit" disabled={isLoading} className="py-2 font-semibold h-auto w-full">
              {isLoading ? "Updating password..." : "UPDATE"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
