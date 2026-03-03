"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/ui";

import { securitySettingsDefaults, sessionTimeoutOptions } from "../data/security";
import {
  updateLoginNotifications,
  updatePasswordComplexity,
  updateSessionTimeout,
  updateTwoFactorAuth
} from "./security-api";
import { securityFormSchema, type SecurityFormData } from "./security-form.schema";

export default function SecuritySettingsForm() {
  const form = useForm<SecurityFormData>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: securitySettingsDefaults
  });

  const handleTwoFactorAuthChange = async (enabled: boolean) => {
    try {
      await updateTwoFactorAuth(enabled);
      form.setValue("twoFactorAuth", enabled);
    } catch {
      // Error already shown in toast
    }
  };

  const handleSessionTimeoutChange = async (minutes: string) => {
    try {
      const minutesNum = Number(minutes);
      await updateSessionTimeout(minutesNum);
      form.setValue("sessionTimeout", minutesNum);
    } catch {
      // Error already shown in toast
    }
  };

  const handlePasswordComplexityChange = async (enabled: boolean) => {
    try {
      await updatePasswordComplexity(enabled);
      form.setValue("passwordComplexity", enabled);
    } catch {
      // Error already shown in toast
    }
  };

  const handleLoginNotificationsChange = async (enabled: boolean) => {
    try {
      await updateLoginNotifications(enabled);
      form.setValue("loginNotifications", enabled);
    } catch {
      // Error already shown in toast
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
      </CardHeader>
      <Form {...form}>
        <CardContent className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="pb-6 flex items-center justify-between border-b last:border-0">
            <div className="space-y-1">
              <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
              <CardDescription>Require 2FA for all users</CardDescription>
            </div>

            <FormField
              control={form.control}
              name="twoFactorAuth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Two-Factor Authentication</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={handleTwoFactorAuthChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Session Timeout */}
          <div className="pb-6 flex items-center justify-between border-b last:border-0">
            <div className="space-y-1">
              <FormLabel className="text-base">Session Timeout</FormLabel>
              <CardDescription>Auto-logout after inactivity</CardDescription>
            </div>

            <FormField
              control={form.control}
              name="sessionTimeout"
              render={({ field }) => (
                <FormItem className="w-32">
                  <Select value={String(field.value)} onValueChange={handleSessionTimeoutChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeout" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sessionTimeoutOptions.map((option) => (
                        <SelectItem key={option} value={String(option)}>
                          {option} minutes
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Password Complexity */}
          <div className="pb-6 flex items-center justify-between border-b last:border-0">
            <div className="space-y-1">
              <FormLabel className="text-base">Password Complexity</FormLabel>
              <CardDescription>Enforce strong passwords</CardDescription>
            </div>

            <FormField
              control={form.control}
              name="passwordComplexity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Password Complexity</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={handlePasswordComplexityChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Login Notifications */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <FormLabel className="text-base">Login Notifications</FormLabel>
              <CardDescription>Email alerts for new logins</CardDescription>
            </div>

            <FormField
              control={form.control}
              name="loginNotifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Login Notifications</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={handleLoginNotificationsChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Form>
    </Card>
  );
}
