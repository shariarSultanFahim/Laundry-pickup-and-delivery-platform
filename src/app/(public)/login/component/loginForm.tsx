"use client";

import { useState } from "react";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { loginSchema, type LoginFormData } from "../schema/login.schema";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    toast.loading("Logging in...");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: Implement login API call
      console.log("Login attempt:", data);
    } finally {
      setIsLoading(false);
      toast.success("Login successful!");
      window.location.href = "/";
    }
  }

  return (
    <div className="px-4 flex h-screen w-full items-center justify-center">
      <div className="max-w-lg rounded-lg bg-white p-8 shadow-lg w-full">
        {/* Heading */}
        <div className="gap-2 py-4 flex flex-col items-center justify-center">
          <h1 className="text-3xl text-foreground text-center">Login</h1>
          <p className="text-center">
            Enter your email and password to securely access the dashboard
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="hannah.green@test.com"
                      type="email"
                      className="border-border"
                      disabled={isLoading}
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="********"
                      type="password"
                      disabled={isLoading}
                      {...field}
                      className="border-border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between">
              <div className="space-x-2 flex items-center">
                <Checkbox id="remember" className="border-border" />
                <label htmlFor="remember" className="text-sm text-foreground cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-center">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-red-500 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <Button type="submit" disabled={isLoading} className="py-2 font-semibold h-auto w-full">
              {isLoading ? "Logging in..." : "LOG IN"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
