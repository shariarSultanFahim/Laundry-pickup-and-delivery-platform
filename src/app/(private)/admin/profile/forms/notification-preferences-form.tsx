"use client";

import { ChartNoAxesColumn, Mail, MessageSquare, Smartphone } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  FormLabel
} from "@/ui";

import { updateNotificationPreference } from "../components/profile-api";
import { notificationItems, notificationPreferencesDefaultValues } from "../data/profile";
import {
  notificationPreferencesSchema,
  type NotificationPreferencesFormData
} from "../schema/notification-preferences.schema";

const iconMap = {
  mail: Mail,
  smartphone: Smartphone,
  "message-square": MessageSquare,
  "chart-no-axes-column": ChartNoAxesColumn
};

export default function NotificationPreferencesForm() {
  const form = useForm<NotificationPreferencesFormData>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: notificationPreferencesDefaultValues
  });

  async function handleToggle(key: keyof NotificationPreferencesFormData, value: boolean) {
    form.setValue(key, value);
    await updateNotificationPreference(key, value);
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
                  className={`gap-4 py-3 flex items-center justify-between ${
                    isLastItem ? "" : "border-border border-b"
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
