"use client";

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
  Switch
} from "@/ui";

import { updateNotificationPreference } from "../components/profile-api";
import { notificationItems, notificationPreferencesDefaultValues } from "../data/profile";
import {
  notificationPreferencesSchema,
  type NotificationPreferencesFormData
} from "../schema/notification-preferences.schema";

export default function NotificationPreferencesForm() {
  const form = useForm<NotificationPreferencesFormData>({
    resolver: zodResolver(notificationPreferencesSchema),
    defaultValues: notificationPreferencesDefaultValues
  });

  async function onSubmit(values: NotificationPreferencesFormData) {
    // const keys = Object.keys(values) as Array<keyof NotificationPreferencesFormData>;
    // for (const key of keys) {
    await updateNotificationPreference(values);
    // }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {notificationItems.map((item) => (
              <FormField
                key={item.id}
                control={form.control}
                name={item.id}
                render={({ field }) => (
                  <FormItem className="rounded-lg p-4 flex items-center justify-between border">
                    <div className="space-y-0.5">
                      <FormLabel className="cursor-pointer">{item.title}</FormLabel>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" className="w-full">
              Save Preferences
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
