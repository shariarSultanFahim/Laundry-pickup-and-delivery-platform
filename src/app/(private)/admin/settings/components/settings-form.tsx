"use client";

import { Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button, Form } from "@/ui";

import { settingsDefaultValues } from "../data/settings";
import BusinessRulesCard from "./business-rules-card";
import CommissionSettingsCard from "./commission-settings-card";
import PaymentMethodsCard from "./payment-methods-card";
import { settingsFormSchema, type SettingsFormData } from "./settings-form.schema";

const defaultValues: SettingsFormData = {
  paymentMethods: settingsDefaultValues.paymentMethods.map((method) => ({ ...method })),
  businessRules: { ...settingsDefaultValues.businessRules },
  commissionSettings: { ...settingsDefaultValues.commissionSettings }
};

export default function SettingsForm() {
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues
  });

  function onSubmit(data: SettingsFormData) {
    // TODO: Replace with actual API call to save settings

    toast.success("Settings saved successfully!", {
      position: "top-center"
    });

    console.log("Settings form data:", data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PaymentMethodsCard control={form.control} />
        <BusinessRulesCard control={form.control} />
        <CommissionSettingsCard control={form.control} />

        <div className="flex justify-end">
          <Button type="submit" className="min-w-40">
            <Save className="size-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
