"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
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
import { Input, PasswordInput } from "@/components/ui";

import { AUTH_SESSION_COOKIE, ROLE_HOME_PATHS } from "@/constants/auth";
import { buildSessionFromLoginResponse, useLogin } from "@/lib/actions/auth/login";
import { cookie } from "@/lib/cookie-client";

import { loginSchema, type LoginFormData } from "../schema/login.schema";

export default function LoginForm() {
  const router = useRouter();
  const { mutateAsync: login, isPending } = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  async function onSubmit(data: LoginFormData) {
    const toastId = toast.loading("Logging in...", { position: "top-center" });
    try {
      const response = await login(data);
      const session = buildSessionFromLoginResponse(response);
      cookie.set(AUTH_SESSION_COOKIE, JSON.stringify(session));
      toast.success("Login successful!", { id: toastId, position: "top-center" });
      router.push(ROLE_HOME_PATHS[session.role]);
    } catch (error) {
      const message = isAxiosError<{ message?: string }>(error)
        ? (error.response?.data?.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      toast.error(message, { id: toastId, position: "top-center" });
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
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm text-foreground">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="admin@example.com"
                      type="email"
                      className="border-border"
                      disabled={isPending}
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
                    <PasswordInput
                      placeholder="••••••••"
                      disabled={isPending}
                      {...field}
                      className="border-border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remember Me + Forgot Password */}
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
            <Button type="submit" disabled={isPending} className="py-2 font-semibold h-auto w-full">
              {isPending ? "Logging in..." : "LOG IN"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
