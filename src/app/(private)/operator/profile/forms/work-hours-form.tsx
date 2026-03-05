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
  Input
} from "@/ui";

import { updateWorkHours } from "../components/profile-api";
import { workHoursDefaultValues } from "../data/profile";
import { workHoursSchema, type WorkHoursFormData } from "../schema/work-hours.schema";

export default function WorkHoursForm() {
  const form = useForm<WorkHoursFormData>({
    resolver: zodResolver(workHoursSchema),
    defaultValues: workHoursDefaultValues
  });

  async function onSubmit(values: WorkHoursFormData) {
    await updateWorkHours(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Work Hours</CardTitle>
        <p className="text-sm text-muted-foreground">Set your working hours</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="gap-4 md:grid-cols-2 grid grid-cols-1">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Save Work Hours
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
