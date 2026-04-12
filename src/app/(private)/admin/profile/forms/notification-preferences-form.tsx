"use client";

import { useEffect } from "react";
import { Mail, MessageSquare, Smartphone } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useGetNotificationPreferences, useUpdateNotificationPreferences } from "@/lib/actions/user/use-notification-preferences";
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
  Skeleton
} from "@/ui";

import { notificationItems, notificationPreferencesDefaultValues, type NotificationItem } from "../data/profile";
import {
  notificationPreferencesSchema,
  type NotificationPreferencesFormData
} from "../schema/notification-preferences.schema";

const iconMap: Record<NotificationItem["icon"], React.ElementType> = {
  mail: Mail,
  smartphone: Smartphone,
  "message-square": MessageSquare
};

export default function NotificationPreferencesForm() {
  const { data: preferencesResponse, isLoading } = useGetNotificationPreferences();
  const { mutateAsync: updatePreferences } = useUpdateNotificationPreferences();

  const form = useForm<NotificationPreferencesFormData>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: notificationPreferencesDefaultValues
  });

  // Sync form with API data
  useEffect(() => {
    if (preferencesResponse?.data) {
      form.reset({
        email: preferencesResponse.data.email,
        push: preferencesResponse.data.push,
        sms: preferencesResponse.data.sms
      });
    }
  }, [preferencesResponse, form]);

  async function handleToggle(key: keyof NotificationPreferencesFormData, value: boolean) {
    // Optimistic update in UI
    form.setValue(key, value);
    
    try {
      await updatePreferences({ [key]: value });
      toast.success("Notification preference updated");
    } catch (error) {
       // Rollback on error
      form.setValue(key, !value);
      toast.error(error instanceof Error ? error.message : "Failed to update preference");
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Choose how you want to receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-6 w-10 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how you want to receive notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-2">
            {notificationItems.map((item, index) => {
              const Icon = iconMap[item.icon];
              const isLastItem = index === notificationItems.length - 1;

              return (
                <div
                  key={item.id}
                  className={`gap-4 py-3 flex items-center justify-between ${isLastItem ? "" : "border-border border-b"
                    }`}
                >
                  <div className="gap-3 flex items-center">
                    <div
                      className={`size-9 rounded-lg flex items-center justify-center ${item.iconBgClass}`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name={item.id}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">{item.title}</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(checked) => handleToggle(item.id, checked)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
