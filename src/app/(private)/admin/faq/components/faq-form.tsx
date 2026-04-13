"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateFAQ } from "@/lib/actions/faq";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";

import { faqSchema, type FAQFormData } from "../schema/faq.schema";

interface FAQFormProps {
  onSuccess?: () => void;
}

export function FAQForm({ onSuccess }: FAQFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutateAsync: createFAQ } = useCreateFAQ();

  const form = useForm({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
      isActive: true
    } as FAQFormData
  });

  async function onSubmit(data: FAQFormData) {
    try {
      setIsSubmitting(true);
      await createFAQ(data);
      form.reset();
      toast.success("FAQ created successfully");
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create FAQ:", error);
      toast.error("Failed to create FAQ. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Add New FAQ</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter FAQ question" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter FAQ answer"
                      {...field}
                      disabled={isSubmitting}
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="space-x-3 space-y-0 flex flex-row items-center">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">Active</FormLabel>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create FAQ"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
