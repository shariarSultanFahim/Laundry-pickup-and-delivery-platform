"use client";

import { useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button, Form } from "@/ui";
import { useGetSettings } from "@/lib/actions/admin/use-get-settings";
import { useUpdateSettings } from "@/lib/actions/admin/use-update-settings";

import BusinessRulesCard from "./business-rules-card";
import CommissionSettingsCard from "./commission-settings-card";
import PaymentMethodsCard from "./payment-methods-card";
import { settingsFormSchema, type SettingsFormData } from "./settings-form.schema";

const initialPaymentMethods = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Accept credit cards and online payments",
    isActive: true
  },
  {
    id: "apple-pay",
    name: "Apple Pay",
    description: "Quick and secure payments for iOS users",
    isActive: false
  },
  {
    id: "google-pay",
    name: "Google Pay",
    description: "Fast checkout for Android users",
    isActive: true
  }
];

const defaultValues: SettingsFormData = {
  paymentMethods: initialPaymentMethods,
  businessRules: {
    cancellationWindow: 0,
    bookingLeadTime: 0,
    requirePaymentUpfront: false,
    allowPartialPayments: false
  },
  commissionSettings: {
    platformCommission: 0,
    pickupDeliveryFee: 0,
    fixedTransactionFee: 0,
    payoutSchedule: "WEEKLY"
  }
};

export default function SettingsForm() {
  const { data: settingsData, isPending: isLoadingSettings } = useGetSettings();
  const { mutateAsync: updateSettings, isPending: isUpdating } = useUpdateSettings();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues
  });

  useEffect(() => {
    if (settingsData) {
      form.reset({
        paymentMethods: initialPaymentMethods,
        businessRules: {
          cancellationWindow: settingsData.cancellationWindowHours,
          bookingLeadTime: settingsData.bookingLeadTimeHours,
          requirePaymentUpfront: settingsData.requirePaymentUpfront,
          allowPartialPayments: settingsData.allowPartialPayments
        },
        commissionSettings: {
          platformCommission: Number(settingsData.platformCommissionRate),
          fixedTransactionFee: Number(settingsData.fixedTransactionFee),
          pickupDeliveryFee: Number(settingsData.pickupDeliveryFee),
          payoutSchedule: (settingsData.payoutSchedule?.trim().toUpperCase() as any) || "WEEKLY"
        }
      });
    }
  }, [settingsData, form]);

  async function onSubmit(data: SettingsFormData) {
    console.log("Settings form data:", data);
    const toastId = toast.loading("Saving settings...");
    try {
      await updateSettings({
        cancellationWindowHours: data.businessRules.cancellationWindow,
        bookingLeadTimeHours: data.businessRules.bookingLeadTime,
        requirePaymentUpfront: data.businessRules.requirePaymentUpfront,
        allowPartialPayments: data.businessRules.allowPartialPayments,
        platformCommissionRate: data.commissionSettings.platformCommission,
        fixedTransactionFee: data.commissionSettings.fixedTransactionFee,
        pickupDeliveryFee: data.commissionSettings.pickupDeliveryFee,
        payoutSchedule: data.commissionSettings.payoutSchedule
      });
      toast.success("Settings saved successfully!", { id: toastId, position: "top-center" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings. Please try again.", { id: toastId, position: "top-center" });
    }
  }

  if (isLoadingSettings) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PaymentMethodsCard control={form.control} />
        <BusinessRulesCard control={form.control} />
        <CommissionSettingsCard control={form.control} />

        <div className="flex justify-end">
          <Button type="submit" className="min-w-40" disabled={isUpdating}>
            {isUpdating ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
